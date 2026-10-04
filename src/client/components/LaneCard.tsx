"use client";

import type { ReactNode } from "react";
import type { LaneId, LaneView, Strength } from "@/shared/types";

const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-4",
    "aria-hidden": true,
};

export const LANE_META: Record<
    LaneId,
    { title: string; emptyLabel: string; mark: string; iconBg: string; icon: ReactNode }
> = {
    scam: {
        title: "Scam signals",
        emptyLabel: "No scam signals found in this post.",
        mark: "bg-scam/30 border-b-2 border-scam",
        iconBg: "bg-scam/30",
        icon: (
            <svg {...iconProps}>
                <path d="M12 3 2 20h20L12 3z" />
                <path d="M12 10v4" />
                <path d="M12 17h.01" />
            </svg>
        ),
    },
    ghost: {
        title: "Ghost signals",
        emptyLabel: "No ghost signals found in this post.",
        mark: "bg-ghost/45 border-b-2 border-ghost",
        iconBg: "bg-ghost/50",
        icon: (
            <svg {...iconProps}>
                <path d="M5 21V10a7 7 0 0 1 14 0v11l-2.5-2-2.5 2-2-2-2 2-2.5-2L5 21z" />
                <path d="M9.5 10h.01" />
                <path d="M14.5 10h.01" />
            </svg>
        ),
    },
    mismatch: {
        title: "Fresher-mismatch signals",
        emptyLabel: "No fresher-mismatch signals found in this post.",
        mark: "bg-mismatch/25 border-b-2 border-mismatch",
        iconBg: "bg-mismatch/25",
        icon: (
            <svg {...iconProps}>
                <path d="M5 9h14" />
                <path d="M5 15h14" />
                <path d="M16 5 8 19" />
            </svg>
        ),
    },
};

const STRENGTH_LEVEL: Record<Strength, number> = { low: 1, medium: 2, high: 3 };

function StrengthMeter({ strength }: { strength: Strength | null }) {
    if (!strength) {
        return (
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">No signals</span>
        );
    }

    const level = STRENGTH_LEVEL[strength];
    return (
        <span className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wide">{strength}</span>
            <span aria-hidden="true" className="flex items-end gap-0.5">
                {[1, 2, 3].map((n) => (
                    <span
                        key={n}
                        className={`w-1.5 rounded-[1px] ${n <= level ? "bg-ink" : "bg-ink/15"}`}
                        style={{ height: `${6 + n * 3}px` }}
                    />
                ))}
            </span>
        </span>
    );
}

interface LaneCardProps {
    lane: LaneView;
    activeSignalId: string | null;
    onSignalClick: (signalId: string) => void;
}

export function LaneCard({ lane, activeSignalId, onSignalClick }: LaneCardProps) {
    const meta = LANE_META[lane.id];
    const titleId = `lane-title-${lane.id}`;

    return (
        <section aria-labelledby={titleId} className="paper-card rounded-md p-4 sm:p-5">
            <header className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className={`grid size-8 place-items-center rounded-full text-ink ${meta.iconBg}`}>
                        {meta.icon}
                    </span>
                    <h3 id={titleId} className="font-serif text-lg">
                        {meta.title}
                    </h3>
                </div>
                <StrengthMeter strength={lane.strength} />
            </header>

            {lane.signals.length === 0 ? (
                <p className="mt-3 text-sm text-ink-soft">{meta.emptyLabel}</p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {lane.signals.map((signal) => (
                        <li key={signal.id}>
                            {signal.source === "post" ? (
                                <button
                                    type="button"
                                    onClick={() => onSignalClick(signal.id)}
                                    className={`group w-full rounded-sm border p-2.5 text-left transition-colors hover:border-ink/40 hover:bg-paper-deep/60 ${activeSignalId === signal.id
                                        ? "border-ink/50 bg-paper-deep/60"
                                        : "border-transparent"
                                        }`}
                                >
                                    <span
                                        className={`box-decoration-clone break-words rounded-[2px] px-1 font-mono text-[13px] leading-relaxed ${meta.mark}`}
                                    >
                                        &ldquo;{signal.quote}&rdquo;
                                    </span>
                                    <span className="mt-1.5 block text-sm leading-snug">{signal.reason}</span>
                                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-wide text-ink-soft group-hover:text-ink">
                                        Show in post
                                    </span>
                                </button>
                            ) : (
                                <div className="rounded-sm border border-dashed border-ink/40 p-2.5">
                                    <span className="font-mono text-[11px] uppercase tracking-wide">
                                        From your answers
                                    </span>
                                    <p className="mt-1 text-sm leading-snug">{signal.reason}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}