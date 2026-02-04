import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  try {
    // List available models
    const models: string[] = [];
    
    // Try to get model info for common model names
    const modelNames = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest", 
      "gemini-1.0-pro",
      "gemini-pro",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-2.0-flash-exp",
    ];

    for (const name of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        // Try a simple test
        const result = await model.generateContent("Say 'ok'");
        if (result) {
          models.push(`✓ ${name} - WORKS`);
        }
      } catch (e) {
        models.push(`✗ ${name} - ${e instanceof Error ? e.message.slice(0, 50) : 'failed'}`);
      }
    }

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
