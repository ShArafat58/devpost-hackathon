"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import type { SamplePost } from "@/shared/data/samples";

export type InputTab = "text" | "image" | "sample";

const TABS: { id: InputTab; label: string }[] = [
    { id: "text", label: "Paste text" },
    { id: "image", label: "Upload screenshot" },
    { id: "sample", label: "Try a sample" },
];

const MIN_CHARS = 80;
const MAX_CHARS = 8000;

interface InputPanelProps {
    tab: InputTab;
    onTabChange: (tab: InputTab) => void;
    text: string;
    onTextChange: (text: string) => void;
    file: File | null;
    onFileChange: (file: File | null) => void;
    samples: SamplePost[];
    sampleId: SamplePost["id"] | null;
    onSampleChange: (id: SamplePost["id"]) => void;
}

export function InputPanel({
    tab,
    onTabChange,
    text,
    onTextChange,
    file,
    onFileChange,
    samples,
    sampleId,
    onSampleChange,
}: InputPanelProps) {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const current = TABS.findIndex((t) => t.id === tab);
        const step = event.key === "ArrowRight" ? 1 : -1;
        const next = (current + step + TABS.length) % TABS.length;
        onTabChange(TABS[next].id);
        tabRefs.current[next]?.focus();
    }

    return (
        <div>
            <div
                role="tablist"
                aria-label="How do you want to share the post?"
                className="flex flex-wrap gap-1.5 pl-2"
                onKeyDown={handleTabKeyDown}
            >
                {TABS.map((t, index) => {
                    const selected = t.id === tab;
                    return (
                        <button
                            key={t.id}
                            ref={(el) => {
                                tabRefs.current[index] = el;
                            }}
                            id={`tab-${t.id}`}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            aria-controls={`panel-${t.id}`}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => onTabChange(t.id)}
                            className={`relative -mb-[1.5px] rounded-t-md border-[1.5px] border-b-0 border-ink px-4 py-2 text-sm font-medium transition-colors ${selected
                                ? "z-10 bg-card"
                                : "bg-paper-deep text-ink-soft hover:text-ink"
                                }`}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>

            <div
                id={`panel-${tab}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab}`}
                className="paper-card rounded-md p-4 sm:p-5"
            >
                {tab === "text" && <TextPanel text={text} onTextChange={onTextChange} />}
                {tab === "image" && <ImagePanel file={file} onFileChange={onFileChange} />}
                {tab === "sample" && (
                    <SamplePanel
                        samples={samples}
                        sampleId={sampleId}
                        onSampleChange={onSampleChange}
                    />
                )}
            </div>
        </div>
    );
}

function TextPanel({
    text,
    onTextChange,
}: {
    text: string;
    onTextChange: (text: string) => void;
}) {
    const length = text.length;
    const tooShort = length > 0 && length < MIN_CHARS;

    return (
        <div>
            <label htmlFor="post-text" className="sr-only">
                Job post text
            </label>
            <textarea
                id="post-text"
                value={text}
                onChange={(event) => onTextChange(event.target.value)}
                maxLength={MAX_CHARS}
                rows={10}
                placeholder="Paste the full job post here — English or Bengali."
                className="block w-full resize-y rounded-sm border border-rule bg-paper/40 p-3 font-mono text-sm leading-relaxed placeholder:text-ink-soft/70 focus:border-ink focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between font-mono text-xs text-ink-soft">
                <span aria-live="polite">
                    {tooShort ? `At least ${MIN_CHARS} characters for a fair read.` : "\u00a0"}
                </span>
                <span>
                    {length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
            </div>
        </div>
    );
}

function ImagePanel({
    file,
    onFileChange,
}: {
    file: File | null;
    onFileChange: (file: File | null) => void;
}) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleDrop(event: DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        setDragging(false);
        const dropped = event.dataTransfer.files?.[0];
        if (dropped) onFileChange(dropped);
    }

    if (file) {
        return (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-rule bg-paper/40 p-4">
                <div className="min-w-0">
                    <p className="truncate font-mono text-sm">{file.name}</p>
                    <p className="font-mono text-xs text-ink-soft">
                        {(file.size / 1024).toFixed(0)} KB
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        onFileChange(null);
                        if (inputRef.current) inputRef.current.value = "";
                    }}
                    className="rounded-sm border border-ink px-3 py-1.5 text-sm hover:bg-paper-deep"
                >
                    Remove
                </button>
            </div>
        );
    }

    return (
        <label
            onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-4 py-12 text-center transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${dragging ? "border-ink bg-paper-deep" : "border-ink/40 bg-paper/40 hover:bg-paper-deep/60"
                }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            />
            <span className="font-serif text-lg">Drop a screenshot of the post</span>
            <span className="text-sm text-ink-soft">or click to choose a file</span>
            <span className="mt-1 font-mono text-xs text-ink-soft">
                JPG, PNG, or WebP · up to 4 MB
            </span>
        </label>
    );
}

function SamplePanel({
    samples,
    sampleId,
    onSampleChange,
}: {
    samples: SamplePost[];
    sampleId: SamplePost["id"] | null;
    onSampleChange: (id: SamplePost["id"]) => void;
}) {
    return (
        <fieldset>
            <legend className="mb-3 text-sm text-ink-soft">
                Fictional posts from invented companies, ready to check.
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
                {samples.map((sample) => (
                    <label
                        key={sample.id}
                        className="flex cursor-pointer flex-col gap-2 rounded-sm border-[1.5px] border-ink/30 bg-paper/40 p-3 transition-colors hover:border-ink has-checked:border-ink has-checked:bg-paper-deep has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
                    >
                        <input
                            type="radio"
                            name="sample-post"
                            value={sample.id}
                            checked={sampleId === sample.id}
                            onChange={() => onSampleChange(sample.id)}
                            className="sr-only"
                        />
                        <span className="w-fit rounded-full border border-ink/50 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide">
                            {sample.kindLabel}
                        </span>
                        <span className="font-serif text-base leading-snug">{sample.title}</span>
                        <span className="text-xs text-ink-soft">{sample.company} (fictional)</span>
                        <span className="line-clamp-3 font-mono text-xs text-ink-soft">
                            {sample.text}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}