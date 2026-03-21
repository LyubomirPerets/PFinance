import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, topic } = await request.json();

    const systemPrompt = `You are a friendly and knowledgeable personal finance tutor. You're helping users learn about ${topic}. 
    
    Be conversational, use simple language, provide practical examples, and encourage deeper learning. 
    If the user asks something off-topic, gently redirect them back to the current topic.
    Keep responses concise but informative.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: systemPrompt,
        messages: messages,
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
    const textContent = data.content.find((block: any) => block.type === "text");
    return NextResponse.json({
      content: textContent?.text || "No response generated",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
