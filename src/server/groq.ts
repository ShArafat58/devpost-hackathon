import "server-only";
import Groq from "groq-sdk";
import { z } from "zod";
import { buildSystemPrompt, buildUserText } from "@/server/prompt";
import { AnalyzeError } from "@/shared/errors";
import {
    AnalyzeResponseSchema,
    type AnalyzeRequest,
    type AnalyzeResponse,
} from "@/shared/schema";

const MAX_ATTEMPTS = 2;

let cachedJsonSchema: Record<string, unknown> | null = null;

/** One source of truth: the JSON Schema sent to Groq is generated from the Zod schema. */
function responseJsonSchema(): Record<string, unknown> {
    if (!cachedJsonSchema) {
        const schema = { ...z.toJSONSchema(AnalyzeResponseSchema) } as Record<string, unknown>;
        delete schema.$schema;
        cachedJsonSchema = schema;
    }
    return cachedJsonSchema;
}

function getConfig(): { apiKey: string; model: string } {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL;
    if (!apiKey || !model) {
        throw new AnalyzeError("AI_ERROR", "GROQ_API_KEY or GROQ_MODEL is not set");
    }
    return { apiKey, model };
}

type ParseResult =
    | { success: true; data: AnalyzeResponse }
    | { success: false; problem: string };

function parseReply(raw: string | null | undefined): ParseResult {
    if (!raw) return { success: false, problem: "empty reply" };

    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let json: unknown;
    try {
        json = JSON.parse(cleaned);
    } catch {
        return { success: false, problem: "reply was not valid JSON" };
    }

    const result = AnalyzeResponseSchema.safeParse(json);
    if (!result.success) {
        return { success: false, problem: result.error.issues[0]?.message ?? "schema mismatch" };
    }
    return { success: true, data: result.data };
}

export async function analyzePost(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const { apiKey, model } = getConfig();
    const client = new Groq({ apiKey });

    const schema = responseJsonSchema();
    const systemPrompt = buildSystemPrompt(JSON.stringify(schema));
    const userText = buildUserText(request);

    const userContent =
        request.mode === "image"
            ? [
                { type: "text" as const, text: userText },
                {
                    type: "image_url" as const,
                    image_url: { url: `data:${request.mimeType};base64,${request.imageBase64}` },
                },
            ]
            : userText;

    let lastProblem = "unknown";

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        let raw: string | null | undefined;

        try {
            const completion = await client.chat.completions.create({
                model,
                temperature: 0.2,
                max_completion_tokens: 4096,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userContent },
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: { name: "ghostlisted_report", schema, strict: false },
                },
            });
            raw = completion.choices[0]?.message?.content;
        } catch (error) {
            if (error instanceof Groq.APIError && error.status === 429) {
                throw new AnalyzeError("RATE_LIMITED");
            }
            const message = error instanceof Error ? error.message : "Groq request failed";
            throw new AnalyzeError("AI_ERROR", message);
        }

        const parsed = parseReply(raw);
        if (parsed.success) return parsed.data;

        lastProblem = parsed.problem;
        console.warn(`[groq] attempt ${attempt} rejected: ${lastProblem}`);
    }

    throw new AnalyzeError("AI_ERROR", `AI reply failed validation: ${lastProblem}`);
}