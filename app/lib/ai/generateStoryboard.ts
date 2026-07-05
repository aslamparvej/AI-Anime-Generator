// lib/ai/generateStoryboard.ts
import OpenAI from "openai";

// Types should match your Storyboard model
export interface IScene {
  id: string;
  title: string;
  description: string;
  cameraAngle: string;
  mood: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  order: number;
}

export interface ICharacter {
  name: string;
  role: string;
  personality: string;
  appearance: string;
  abilities?: string;
}

export interface GenerateStoryboardInput {
  title: string;
  prompt: string;
  genre: string;     // e.g. "shonen", "scifi"
  artStyle: string;  // e.g. "ghibli", "cyberpunk"
  numScenes: number;
}

export interface GenerateStoryboardResult {
  scenes: IScene[];
  characters: ICharacter[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Helpers to expand compact values into nicer descriptions for the LLM ---

function describeGenre(genre: string): string {
  const map: Record<string, string> = {
    shonen: "Shonen action/adventure anime with high energy battles and friendship themes",
    seinen: "Seinen, more grounded, mature drama with psychological depth",
    shojo: "Shojo romance/drama with emotional focus and character relationships",
    isekai: "Isekai fantasy where the protagonist is transported to another world",
    scifi: "Science fiction / cyberpunk with futuristic technology and neon cities",
    fantasy: "Fantasy / mythical world with magic, spirits, and legendary creatures",
    slice: "Comedy / slice-of-life with character interactions and everyday moments",
    thriller: "Thriller / mystery with tension, twists, and investigation",
    horror: "Horror / dark fantasy with creepy atmosphere and supernatural danger",
    sports: "Sports / competition anime with training, tournaments, and rivalries",
    historical: "Historical / samurai setting with period-accurate details",
    mecha: "Mecha with giant robots and tactical battles",
  };

  return map[genre] ?? genre;
}

function describeArtStyle(style: string): string {
  const map: Record<string, string> = {
    ghibli:
      "Soft, painterly Studio Ghibli-like visuals with dreamy backgrounds and gentle lighting",
    demon_slayer:
      "Crisp, dynamic action style similar to Demon Slayer with strong line work and vivid effects",
    classic_shonen:
      "Classic shonen anime look like Naruto or Bleach with bold outlines and expressive faces",
    cyberpunk:
      "Neon-soaked cyberpunk visuals with strong contrast, holograms, and futuristic cityscapes",
    dark_sharp:
      "Dark, sharp style with dramatic shading and intense atmosphere like Jujutsu Kaisen",
    cartoon:
      "Exaggerated, playful style similar to One Piece with elastic characters and bold colors",
    cinematic:
      "Cinematic, detailed style like 'Your Name' with realistic lighting and beautiful scenery",
    gritty:
      "Gritty, intense style reminiscent of Attack on Titan with heavy shadows and serious tone",
    elegant:
      "Polished, elegant style like Violet Evergarden with delicate line art and refined color",
    horror:
      "Moody, horror style with strong shadows, eerie lighting, and unsettling framing",
    retro:
      "Retro 90s/early 2000s anime style with flat shading and nostalgic vibes",
    kids:
      "Soft, friendly kids anime style with rounded shapes and bright, gentle colors",
  };

  return map[style] ?? style;
}

/**
 * Calls OpenAI to generate a storyboard: scenes + characters.
 * Returns clean, typed data that can be directly saved into MongoDB.
 */
export async function generateStoryboard(
  input: GenerateStoryboardInput
): Promise<GenerateStoryboardResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const {
    title,
    prompt,
    genre,
    artStyle,
    numScenes,
  } = input;

  const genreDescription = describeGenre(genre);
  const styleDescription = describeArtStyle(artStyle);
  const sceneCount = Math.max(3, Math.min(12, numScenes || 6));

  const systemPrompt = `
You are an experienced anime director and storyboard writer.
You create scene-by-scene anime storyboards and character sheets.

Return STRICTLY valid JSON with EXACTLY this structure:

{
  "scenes": [
    {
      "title": "string",
      "description": "string",
      "cameraAngle": "string",
      "mood": "string"
    },
    ...
  ],
  "characters": [
    {
      "name": "string",
      "role": "string",
      "personality": "string",
      "appearance": "string",
      "abilities": "string (optional, can be empty)"
    },
    ...
  ]
}

Rules:
- Create exactly ${sceneCount} scenes.
- Each scene description should be 2–5 sentences, cinematic and specific.
- Vary camera angles: wide shot, close-up, overhead, tracking shot, etc.
- Vary mood: tense, hopeful, melancholic, comedic, eerie, epic, etc.
- Characters should be reused across scenes (not one-off nobodies).
- Use clear, concise English.
- Do NOT include any comments, markdown, or text outside the JSON.
  `.trim();

  const userPrompt = `
Title: ${title}
Core Idea: ${prompt}

Genre / Tone:
${genreDescription}

Visual Art Style:
${styleDescription}

Number of Scenes:
${sceneCount}

Goal:
Create a coherent anime storyboard that follows the protagonist through a clear arc with beginning, middle, and end.
  `.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // or any other JSON-capable model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("No content returned from OpenAI");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse LLM JSON:", raw);
      throw new Error("Failed to parse AI storyboard JSON");
    }

    const scenesRaw: any[] = Array.isArray(parsed.scenes)
      ? parsed.scenes
      : [];
    const charactersRaw: any[] = Array.isArray(parsed.characters)
      ? parsed.characters
      : [];

    // Normalize scenes to IScene[]
    const scenes: IScene[] = scenesRaw.map((scene, index) => ({
      id: `scene-${index + 1}`,
      title: String(scene.title ?? `Scene ${index + 1}`),
      description: String(
        scene.description ??
          "No description provided by the AI for this scene."
      ),
      cameraAngle: String(scene.cameraAngle ?? "wide shot"),
      mood: String(scene.mood ?? "neutral"),
      order: index + 1,
      imageUrl: undefined,
      thumbnailUrl: undefined,
    }));

    // Ensure we always have exactly sceneCount scenes
    if (scenes.length === 0) {
      for (let i = 0; i < sceneCount; i++) {
        scenes.push({
          id: `scene-${i + 1}`,
          title: `Scene ${i + 1}`,
          description: "Placeholder scene generated as fallback.",
          cameraAngle: "wide shot",
          mood: "neutral",
          order: i + 1,
        });
      }
    }

    // Normalize characters to ICharacter[]
    const characters: ICharacter[] = charactersRaw.map((ch) => ({
      name: String(ch.name ?? "Unknown"),
      role: String(ch.role ?? "Supporting"),
      personality: String(
        ch.personality ?? "Personality not described by the AI."
      ),
      appearance: String(
        ch.appearance ?? "Appearance not described by the AI."
      ),
      abilities:
        ch.abilities != null ? String(ch.abilities) : undefined,
    }));

    return { scenes, characters };
  } catch (error) {
    console.error("generateStoryboard error:", error);
    throw error;
  }
}
