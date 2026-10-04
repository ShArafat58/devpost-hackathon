import { LANE_SEVERITY, type LaneId, type ProcessedReport } from "@/shared/types";

export interface TextRange {
    start: number;
    end: number;
}

interface NormalizedText {
    text: string;
    /** map[i] = index in the original string of normalized character i */
    map: number[];
}

/**
 * Collapses every whitespace run to one space and lowercases,
 * while remembering where each character came from in the original.
 * Punctuation is kept exactly as written.
 */
function normalizeWithMap(input: string): NormalizedText {
    let text = "";
    const map: number[] = [];
    let inWhitespace = false;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (/\s/.test(char)) {
            if (!inWhitespace) {
                text += " ";
                map.push(i);
                inWhitespace = true;
            }
            continue;
        }

        inWhitespace = false;
        const lower = char.toLowerCase();
        for (let k = 0; k < lower.length; k++) {
            text += lower[k];
            map.push(i);
        }
    }

    return { text, map };
}

export function normalizeForMatch(input: string): string {
    return normalizeWithMap(input).text.trim();
}

/** Finds a quote in the text, ignoring whitespace and case, and returns its original character range. */
export function findQuoteRange(text: string, quote: string): TextRange | null {
    const needle = normalizeForMatch(quote);
    if (needle.length === 0) return null;

    const haystack = normalizeWithMap(text);
    const index = haystack.text.indexOf(needle);
    if (index === -1) return null;

    const start = haystack.map[index];
    const end = haystack.map[index + needle.length - 1] + 1;
    return { start, end };
}

export interface HighlightInput {
    signalId: string;
    lane: LaneId;
    start: number;
    end: number;
}

export interface Segment {
    start: number;
    end: number;
    text: string;
    /** Lane color for this piece of text, or null when not highlighted */
    lane: LaneId | null;
    /** Every signal whose quote covers this piece of text */
    signalIds: string[];
}

/** Collects the highlight ranges of all validated post signals in a report. */
export function highlightRanges(report: Pick<ProcessedReport, "lanes">): HighlightInput[] {
    const ranges: HighlightInput[] = [];
    for (const lane of Object.values(report.lanes)) {
        for (const signal of lane.signals) {
            if (signal.source === "post") {
                ranges.push({ signalId: signal.id, lane: signal.lane, start: signal.start, end: signal.end });
            }
        }
    }
    return ranges;
}

/** Splits the text into non-overlapping segments; overlaps take the higher-severity lane color. */
export function buildSegments(text: string, ranges: HighlightInput[]): Segment[] {
    const valid = ranges.filter(
        (range) => range.start >= 0 && range.end <= text.length && range.end > range.start,
    );

    const boundaries = new Set<number>([0, text.length]);
    for (const range of valid) {
        boundaries.add(range.start);
        boundaries.add(range.end);
    }
    const points = [...boundaries].sort((a, b) => a - b);

    const segments: Segment[] = [];
    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        if (end <= start) continue;

        const covering = valid.filter((range) => range.start <= start && range.end >= end);
        let lane: LaneId | null = null;
        for (const range of covering) {
            if (lane === null || LANE_SEVERITY[range.lane] > LANE_SEVERITY[lane]) {
                lane = range.lane;
            }
        }

        segments.push({
            start,
            end,
            text: text.slice(start, end),
            lane,
            signalIds: covering.map((range) => range.signalId),
        });
    }

    return segments;
}