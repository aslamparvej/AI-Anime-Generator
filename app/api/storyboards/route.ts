import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/AuthOptions";
import connectToDB from "@/app/lib/db";
import Storyboard from "@/app/lib/models/Storyboard";
import { generateStoryboard } from "@/app/lib/ai/generateStoryboard";

// Helper : Clamp number of scenes
function clampScenes(num: number, min: number, max: number) {
  if (Number.isNaN(num)) return min;
  return Math.min(max, Math.max(min, num));
}

/**
 * GET /api/storyboards
 * Returns all the storyboards for the logged-in user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email && !(session?.user as any)?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const userId = (session?.user as any).id;

    // Get Storyboards based on users
    const storyboards = await Storyboard.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ storyboards }, { status: 200 });
  } catch (error) {
    console.error("GET /api/storyboards error", error);
    return NextResponse.json(
      { message: "Failed to fetch storyboards" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/storyboards
 * Body: {title, prompt, genre, artStyle, numScenes}
 * Creates storyboard (text only first) using AI, no images yet.
 */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { message: "You must be signed in to create a storyboard" },
        { status: 401 }
      );
    }

    const { title, prompt, genre, artStyle, numScenes } = await req.json();

    if (!title || !prompt || !genre || !artStyle) {
      return NextResponse.json(
        { message: "Title, prompt, genre and art style are required" },
        { status: 400 }
      );
    }

    const SCENE_MIN = 3;
    const SCENE_MAX = 12;
    const scenesCount = clampScenes(
      Number(numScenes ?? 6),
      SCENE_MIN,
      SCENE_MAX
    );

    await connectToDB();

    // Call LLM to generate scenes + characters
    const { scenes, characters } = await generateStoryboard({
      title,
      prompt,
      genre,
      artStyle,
      numScenes: scenesCount,
    });

    const userId = (session.user as any).id;

    const storyboard = await Storyboard.create({
      userId,
      title,
      prompt,
      genre,
      artStyle,
      numScenes: scenesCount,
      scenes,
      characters,
      isPublic: false,
    });

    return NextResponse.json(
      {
        message: "Storyboard created successfully",
        id: storyboard._id.toString(),
        storyboard,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/storyboards error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create storyboard",
      },
      { status: 500 }
    );
  }
}
