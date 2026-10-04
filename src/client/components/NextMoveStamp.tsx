"use client";

import type { NextMove } from "@/shared/types";

const MOVE_META: Record<NextMove, { color: string; summary: string }> = {
    Apply: {
        color: "text-stamp-apply",
        summary: "No medium or high signals were found. A quick check is still worth it.",
    },
    "Verify first": {
        color: "text-stamp-verify",
        summary: "Some signals deserve a closer look before you spend time applying.",
    },
    Skip: {
        color: "text-stamp-skip",
        summary: "Strong scam signals. Never pay a fee or share ID or bank details for a job.",
    },
};

interface NextMoveStampProps {
    move: NextMove;
    steps: string[];
}

export function NextMoveStamp({ move, steps }: NextMoveStampProps) {
    const meta = MOVE_META[move];

    return (
        <section aria-labelledby="next-move-title" className="paper-card rounded-md p-5">
            <p id="next-move-title" className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                Recommended next move
            </p>

            <div className="mt-4 py-1">
                <span className={`stamp font-serif text-3xl font-bold uppercase tracking-wider ${meta.color}`}>
                    {move}
                </span>
            </div>

            <p className="mt-4 text-sm">{meta.summary}</p>

            <h4 className="mt-5 text-sm font-semibold">Before you apply</h4>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-snug">
                {steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </section>
    );
}