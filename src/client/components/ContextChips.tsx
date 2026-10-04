"use client";

import type { Context } from "@/shared/schema";

interface Option<T extends string> {
    value: T;
    label: string;
}

const SOURCE_OPTIONS: Option<Context["source"]>[] = [
    { value: "linkedin", label: "LinkedIn" },
    { value: "job_board", label: "Job board" },
    { value: "facebook_group", label: "Facebook group" },
    { value: "whatsapp_telegram", label: "WhatsApp or Telegram" },
    { value: "company_website", label: "Company website" },
    { value: "other", label: "Other" },
];

const AGE_OPTIONS: Option<Context["age"]>[] = [
    { value: "under_1_week", label: "Under 1 week" },
    { value: "1_4_weeks", label: "1–4 weeks" },
    { value: "1_3_months", label: "1–3 months" },
    { value: "over_3_months", label: "Over 3 months" },
    { value: "not_sure", label: "Not sure" },
];

const REPOSTED_OPTIONS: Option<Context["reposted"]>[] = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not_sure", label: "Not sure" },
];

interface ChipGroupProps<T extends string> {
    legend: string;
    name: string;
    options: Option<T>[];
    value: T;
    onChange: (next: T) => void;
}

function ChipGroup<T extends string>({
    legend,
    name,
    options,
    value,
    onChange,
}: ChipGroupProps<T>) {
    return (
        <fieldset className="space-y-2.5">
            <legend className="text-sm font-semibold">{legend}</legend>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="cursor-pointer select-none rounded-full border border-ink/60 bg-card px-3.5 py-1.5 text-sm transition-colors hover:bg-paper-deep has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

interface ContextChipsProps {
    value: Context;
    onChange: (next: Context) => void;
}

export function ContextChips({ value, onChange }: ContextChipsProps) {
    return (
        <div className="space-y-6">
            <ChipGroup
                legend="Where did you find it?"
                name="context-source"
                options={SOURCE_OPTIONS}
                value={value.source}
                onChange={(source) => onChange({ ...value, source })}
            />
            <ChipGroup
                legend="How old is the post?"
                name="context-age"
                options={AGE_OPTIONS}
                value={value.age}
                onChange={(age) => onChange({ ...value, age })}
            />
            <ChipGroup
                legend="Have you seen it reposted?"
                name="context-reposted"
                options={REPOSTED_OPTIONS}
                value={value.reposted}
                onChange={(reposted) => onChange({ ...value, reposted })}
            />
        </div>
    );
}