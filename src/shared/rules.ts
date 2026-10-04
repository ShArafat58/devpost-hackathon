import { findQuoteRange } from "@/shared/highlight";
import type { AnalyzeResponse } from "@/shared/schema";
import {
    LANE_ORDER,
    type LaneId,
    type LaneView,
    type NextMove,
    type ProcessedReport,
    type SignalView,
    type Strength,
} from "@/shared/types";

export interface ValidatedLanes {
    lanes: Record<LaneId, LaneView>;
    droppedQuoteCount: number;
}

/**
 * Keeps a "post" signal only if its quote exists in the post text
 * (whitespace and case ignored, punctuation exact). "context" signals are kept as they are.
 * A lane left with no signals has no strength.
 */
export function validateQuotes(rawLanes: AnalyzeResponse["lanes"], postText: string): ValidatedLanes {
    let droppedQuoteCount = 0;
    const lanes = {} as Record<LaneId, LaneView>;

    for (const laneId of LANE_ORDER) {
        const rawLane = rawLanes[laneId];
        const signals: SignalView[] = [];

        rawLane.signals.forEach((signal, index) => {
            const id = `${laneId}-${index}`;

            if (signal.source === "context") {
                signals.push({ id, lane: laneId, source: "context", reason: signal.reason });
                return;
            }

            const range = findQuoteRange(postText, signal.quote);
            if (!range) {
                droppedQuoteCount += 1;
                return;
            }

            signals.push({
                id,
                lane: laneId,
                source: "post",
                quote: postText.slice(range.start, range.end),
                reason: signal.reason,
                start: range.start,
                end: range.end,
            });
        });

        lanes[laneId] = {
            id: laneId,
            strength: signals.length > 0 ? rawLane.strength : null,
            signals,
        };
    }

    return { lanes, droppedQuoteCount };
}

/** Skip if scam is High; Verify first if any lane is Medium or High; otherwise Apply. */
export function nextMove(lanes: Record<LaneId, { strength: Strength | null }>): NextMove {
    if (lanes.scam.strength === "high") return "Skip";

    const anyConcern = LANE_ORDER.some((laneId) => {
        const strength = lanes[laneId].strength;
        return strength === "medium" || strength === "high";
    });

    return anyConcern ? "Verify first" : "Apply";
}

/** Turns a raw, schema-valid AI reply into the report the UI shows. */
export function buildReport(raw: AnalyzeResponse, postText: string): ProcessedReport {
    const { lanes, droppedQuoteCount } = validateQuotes(raw.lanes, postText);
    return {
        postText,
        lanes,
        nextMove: nextMove(lanes),
        verificationSteps: raw.verificationSteps,
        droppedQuoteCount,
    };
}