import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { topic, topicLabel } = await request.json();

    const prompt = `Generate a realistic personal finance scenario about ${topicLabel}.

The scenario should:
- Feature a specific person with realistic numbers and circumstances (age, income, debt amounts, etc.)
- Present a genuine financial dilemma or decision point
- Be 130–180 words
- End with a clear question asking what the person should do

Write only the scenario text — no headings, no commentary, no metadata. Start directly with the person's situation.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-1-20250805",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const scenario =
      data.content.find((block: { type: string }) => block.type === "text")
        ?.text || "";

    return NextResponse.json({ scenario, topic });
  } catch (error) {
    console.error("Scenario API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
