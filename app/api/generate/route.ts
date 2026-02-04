import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Use REST API directly for better compatibility
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "API request failed", details: data },
        { status: response.status }
      );
    }

    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to parse as JSON first (since our prompt asks for JSON output)
    try {
      let jsonText = text;
      
      // Remove markdown code blocks if present
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }

      const parsedContent = JSON.parse(jsonText);
      return NextResponse.json({
        success: true,
        data: parsedContent,
        raw: text,
      });
    } catch {
      // If not valid JSON, return raw text
      return NextResponse.json({
        success: true,
        data: { content: text },
        raw: text,
      });
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
