"use client";

import { ERROR_MESSAGES, type ErrorCode } from "@/shared/errors";

/** Errors the user can fix by simply trying again */
const RETRYABLE: ReadonlySet<ErrorCode> = new Set(["RATE_LIMITED", "AI_ERROR"]);

interface ErrorNoticeProps {
    code: ErrorCode;
    onRetry: () => void;
    onTrySample: () => void;
}

export function ErrorNotice({ code, onRetry, onTrySample }: ErrorNoticeProps) {
    const message = ERROR_MESSAGES[code];

    return (
        <div
            role="alert"
            className="mb-5 rounded-md border-[1.5px] border-stamp-skip bg-card p-4 shadow-[3px_3px_0_var(--color-stamp-skip)]"
        >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp-skip">
                Check interrupted
            </p>
            <p className="mt-1 font-serif text-lg">{message.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{message.body}</p>

            {(RETRYABLE.has(code) || code === "NOT_A_JOB_POST") && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {RETRYABLE.has(code) && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="rounded-sm border-[1.5px] border-ink bg-ink px-3 py-1.5 text-sm text-paper hover:opacity-90"
                        >
                            Retry
                        </button>
                    )}
                    {code === "NOT_A_JOB_POST" && (
                        <button
                            type="button"
                            onClick={onTrySample}
                            className="rounded-sm border-[1.5px] border-ink px-3 py-1.5 text-sm hover:bg-paper-deep"
                        >
                            Try a sample
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}