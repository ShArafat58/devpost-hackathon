import { describe, expect, it } from "vitest";
import { buildSegments, findQuoteRange, highlightRanges } from "@/shared/highlight";
import type { LaneView } from "@/shared/types";

describe("findQuoteRange", () => {
    it("maps a normalized match back to the original characters", () => {
        const text = "Pay a fee\n  of USD 35 today";
        const range = findQuoteRange(text, "a fee of usd 35");

        expect(range).not.toBeNull();
        expect(text.slice(range!.start, range!.end)).toBe("a fee\n  of USD 35");
    });

    it("returns null when the quote is not in the text", () => {
        expect(findQuoteRange("Open until filled.", "Apply by Friday")).toBeNull();
    });

    it("returns null for an empty quote", () => {
        expect(findQuoteRange("Some text", "   ")).toBeNull();
    });
});

describe("buildSegments", () => {
    const text = "abcdefghijklmnopqrst";

    it("returns one plain segment when there are no highlights", () => {
        expect(buildSegments(text, [])).toEqual([
            { start: 0, end: 20, text, lane: null, signalIds: [] },
        ]);
    });

    it("gives overlapping text the higher-severity lane", () => {
        const segments = buildSegments(text, [
            { signalId: "s", lane: "scam", start: 0, end: 10 },
            { signalId: "g", lane: "ghost", start: 5, end: 15 },
        ]);

        expect(segments.map((s) => [s.start, s.end, s.lane, s.signalIds])).toEqual([
            [0, 5, "scam", ["s"]],
            [5, 10, "scam", ["s", "g"]],
            [10, 15, "ghost", ["g"]],
            [15, 20, null, []],
        ]);
    });

    it("ranks mismatch above ghost", () => {
        const segments = buildSegments(text, [
            { signalId: "g", lane: "ghost", start: 0, end: 10 },
            { signalId: "m", lane: "mismatch", start: 0, end: 10 },
        ]);

        expect(segments[0].lane).toBe("mismatch");
    });
});

describe("highlightRanges", () => {
    it("includes post signals and skips context signals", () => {
        const empty = (id: LaneView["id"]): LaneView => ({ id, strength: null, signals: [] });

        const ranges = highlightRanges({
            lanes: {
                scam: empty("scam"),
                mismatch: empty("mismatch"),
                ghost: {
                    id: "ghost",
                    strength: "high",
                    signals: [
                        { id: "ghost-0", lane: "ghost", source: "post", quote: "abc", reason: "r", start: 0, end: 3 },
                        { id: "ghost-1", lane: "ghost", source: "context", reason: "r" },
                    ],
                },
            },
        });

        expect(ranges).toEqual([{ signalId: "ghost-0", lane: "ghost", start: 0, end: 3 }]);
    });
});