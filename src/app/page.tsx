"use client";

import { useState } from "react";
import { ContextChips } from "@/client/components/ContextChips";
import { InputPanel, type InputTab } from "@/client/components/InputPanel";
import { ReportView } from "@/client/components/ReportView";
import { SAMPLE_POSTS, type SamplePost } from "@/shared/data/samples";
import {
    ERROR_MESSAGES,
    isErrorCode,
    type ApiErrorBody,
    type ErrorCode,
} from "@/shared/errors";
import type { AnalyzeRequest, Context } from "@/shared/schema";
import type { AnalyzeSuccessBody, ProcessedReport } from "@/shared/types";

const DEFAULT_CONTEXT: Context = {
    source: "other",
    age: "not_sure",
    reposted: "not_sure",
};

const MIN_TEXT_CHARS = 80;

const LANE_KEYS = [
    { label: "Scam signals", swatch: "bg-scam/45" },
    { label: "Ghost signals", swatch: "bg-ghost/60" },
    { label: "Fresher-mismatch signals", swatch: "bg-mismatch/35" },
];

type Status = "idle" | "loading" | "report" | "error";

export default function Home() {
    const [tab, setTab] = useState<InputTab>("text");
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [sampleId, setSampleId] = useState<SamplePost["id"] | null>(null);
    const [context, setContext] = useState<Context>(DEFAULT_CONTEXT);

    const [status, setStatus] = useState<Status>("idle");
    const [report, setReport] = useState<ProcessedReport | null>(null);
    const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);

    // Screenshot checks are enabled in Slice 4
    const hasInput =
        tab === "text" ? text.trim().length > 0 : tab === "sample" ? sampleId !== null : false;

    function clearError() {
        if (status === "error") {
            setStatus("idle");
            setErrorCode(null);
        }
    }

    function handleTabChange(next: InputTab) {
        setTab(next);
        clearError();
    }

    function handleTextChange(next: string) {
        setText(next);
        clearError();
    }

    function handleSampleChange(id: SamplePost["id"]) {
        setSampleId(id);
        clearError();
        const sample = SAMPLE_POSTS.find((s) => s.id === id);
        if (sample) setContext(sample.context);
    }

    function buildRequest(): AnalyzeRequest | null {
        if (tab === "text") return { mode: "text", text, context };
        if (tab === "sample") {
            const sample = SAMPLE_POSTS.find((s) => s.id === sampleId);
            return sample ? { mode: "text", text: sample.text, context } : null;
        }
        return null;
    }

    function showError(code: ErrorCode) {
        setErrorCode(code);
        setStatus("error");
    }

    async function handleCheck() {
        const request = buildRequest();
        if (!request) return;

        if (request.mode === "text" && request.text.trim().length < MIN_TEXT_CHARS) {
            showError("TOO_SHORT");
            return;
        }

        setStatus("loading");
        setErrorCode(null);

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });
            const body: unknown = await res.json().catch(() => null);

            if (!res.ok) {
                const code = (body as ApiErrorBody | null)?.error?.code;
                showError(isErrorCode(code) ? code : "AI_ERROR");
                return;
            }

            const nextReport = (body as AnalyzeSuccessBody | null)?.report;
            if (!nextReport) {
                showError("AI_ERROR");
                return;
            }

            setReport(nextReport);
            setStatus("report");
            window.scrollTo({ top: 0 });
        } catch {
            showError("AI_ERROR");
        }
    }

    function handleReset() {
        setReport(null);
        setStatus("idle");
        setErrorCode(null);
        setTab("text");
        setText("");
        setFile(null);
        setSampleId(null);
        setContext(DEFAULT_CONTEXT);
        window.scrollTo({ top: 0 });
    }

    const showReport = status === "report" && report !== null;

    return (
        <main
            className={`mx-auto w-full px-5 pb-16 pt-10 sm:pt-16 ${showReport ? "max-w-6xl" : "max-w-3xl"}`}
        >
            <header className="mb-10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                    Case file · Job post review
                </p>
                <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
                    Ghostlisted
                </h1>
                <p className="mt-3 max-w-xl text-lg">
                    Before you apply, find out if anyone&apos;s really hiring.
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                    {LANE_KEYS.map((lane) => (
                        <li key={lane.label} className="flex items-center gap-2">
                            <span aria-hidden="true" className={`h-3 w-6 -skew-x-12 rounded-[2px] ${lane.swatch}`} />
                            {lane.label}
                        </li>
                    ))}
                </ul>
            </header>

            {showReport ? (
                <ReportView report={report} onReset={handleReset} />
            ) : (
                <>
                    <section aria-labelledby="step-post" className="mb-10">
                        <SectionLabel id="step-post" index="01" title="The post" />
                        <InputPanel
                            tab={tab}
                            onTabChange={handleTabChange}
                            text={text}
                            onTextChange={handleTextChange}
                            file={file}
                            onFileChange={setFile}
                            samples={SAMPLE_POSTS}
                            sampleId={sampleId}
                            onSampleChange={handleSampleChange}
                        />
                    </section>

                    <section aria-labelledby="step-context" className="mb-10">
                        <SectionLabel id="step-context" index="02" title="The context" />
                        <div className="paper-card rounded-md p-4 sm:p-5">
                            <ContextChips value={context} onChange={setContext} />
                        </div>
                    </section>

                    <section aria-labelledby="step-check">
                        <SectionLabel id="step-check" index="03" title="Run the check" />

                        {status === "error" && errorCode && (
                            <div role="alert" className="mb-5 rounded-md border-[1.5px] border-stamp-skip bg-card p-4">
                                <p className="font-serif text-lg">{ERROR_MESSAGES[errorCode].title}</p>
                                <p className="mt-1 text-sm text-ink-soft">{ERROR_MESSAGES[errorCode].body}</p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleCheck}
                            disabled={!hasInput || status === "loading"}
                            aria-busy={status === "loading"}
                            className="w-full rounded-md border-[1.5px] border-ink bg-ink px-6 py-4 font-serif text-xl text-paper shadow-[4px_4px_0_var(--color-ink-soft)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:w-auto"
                        >
                            {status === "loading" ? "Checking…" : "Check this post"}
                        </button>
                    </section>
                </>
            )}

            <footer className="mt-16 space-y-1 border-t border-rule pt-5 text-xs text-ink-soft">
                <p>Signals, not verdicts. A post can&apos;t prove what a company decides internally.</p>
                <p>Post text is sent to an AI service for analysis and is not stored.</p>
            </footer>
        </main>
    );
}

function SectionLabel({ id, index, title }: { id: string; index: string; title: string }) {
    return (
        <h2 id={id} className="mb-4 flex items-baseline gap-3">
            <span className="font-mono text-sm text-ink-soft">{index}</span>
            <span className="font-serif text-2xl">{title}</span>
        </h2>
    );
}