import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, aspectRatio } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const output = await replicate.run(
      "google/imagen-4-fast:latest",
      {
        input: {
          prompt: prompt,
          aspect_ratio: aspectRatio || "1:1",
          output_format: "jpg",
          safety_tolerance: 2,
        },
      }
    ) as string | string[];

    // Replicate returns either a string or an array of strings
    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
