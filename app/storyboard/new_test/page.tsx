"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

// ---- Options ----

const GENRES = [
  { label: "Shonen (Action/Adventure)", value: "shonen" },
  { label: "Seinen (Mature/Drama)", value: "seinen" },
  { label: "Shojo (Romance)", value: "shojo" },
  { label: "Isekai (Fantasy World)", value: "isekai" },
  { label: "Sci-Fi / Cyberpunk", value: "scifi" },
  { label: "Fantasy / Mythical", value: "fantasy" },
  { label: "Comedy / Slice of Life", value: "slice" },
  { label: "Thriller / Mystery", value: "thriller" },
  { label: "Horror / Dark Fantasy", value: "horror" },
  { label: "Sports / Competition", value: "sports" },
  { label: "Historical / Samurai", value: "historical" },
  { label: "Mecha (Robots)", value: "mecha" },
];

const ART_STYLES = [
  { label: "Studio Ghibli (Dreamy)", value: "ghibli" },
  { label: "Demon Slayer (Dynamic)", value: "demon_slayer" },
  { label: "Classic Shonen", value: "classic_shonen" },
  { label: "Cyberpunk Neon", value: "cyberpunk" },
  { label: "Dark & Sharp (JJK)", value: "dark_sharp" },
  { label: "One Piece Cartoon", value: "cartoon" },
  { label: "Cinematic (Your Name)", value: "cinematic" },
  { label: "Gritty (AOT)", value: "gritty" },
  { label: "Elegant (Violet Evergarden)", value: "elegant" },
  { label: "Moody Horror", value: "horror" },
  { label: "Retro Action", value: "retro" },
  { label: "Soft Kids Style", value: "kids" },
];

const SCENE_RANGE = {
  min: 3,
  max: 12,
  default: 6,
};

export default function NewStoryboardPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState(GENRES[0]?.value ?? "");
  const [artStyle, setArtStyle] = useState(ART_STYLES[0]?.value ?? "");
  const [numScenes, setNumScenes] = useState<number>(SCENE_RANGE.default);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/storyboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          prompt,
          genre,
          artStyle,
          numScenes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to create storyboard");
        setLoading(false);
        return;
      }

      // Expecting API to return { id: "<storyboardId>" }
      const id = data.id || data._id || data.storyboardId;
      if (!id) {
        setError("Storyboard created but no ID returned from API");
        setLoading(false);
        return;
      }

      router.push(`/storyboard/${id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-white mb-2">
          New Anime Storyboard
        </h1>
        <p className="text-sm md:text-base text-text-light max-w-2xl">
          Describe your idea and let the AI turn it into a cinematic anime
          storyboard with scenes, characters, and mood.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl p-5 md:p-7 shadow-lg shadow-black/40">
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs md:text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs md:text-sm text-text-light mb-1.5">
              Storyboard Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Demon of the Neon City"
              className="w-full rounded-lg bg-bg border border-border px-3 py-2.5 text-sm md:text-base text-text-white placeholder:text-text-light/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
              required
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-xs md:text-sm text-text-light mb-1.5">
              Core Story Idea
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A shy hacker girl in a futuristic Tokyo discovers a cursed AI spirit living inside the city's neon signs..."
              rows={5}
              className="w-full rounded-lg bg-bg border border-border px-3 py-2.5 text-sm md:text-base text-text-white placeholder:text-text-light/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/60 resize-y"
              required
            />
            <p className="mt-1 text-[11px] md:text-xs text-text-light">
              Tip: Mention setting, main character, conflict, and tone (e.g.
              dark, hopeful, comedic) for better scenes.
            </p>
          </div>

          {/* Genre & Art Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-xs md:text-sm text-text-light mb-1.5">
                Genre
              </label>
              <div className="relative">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full appearance-none rounded-lg bg-bg border border-border px-3 py-2.5 text-sm md:text-base text-text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60 pr-8"
                >
                  {GENRES.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-light text-xs">
                  ▼
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm text-text-light mb-1.5">
                Art Style
              </label>
              <div className="relative">
                <select
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  className="w-full appearance-none rounded-lg bg-bg border border-border px-3 py-2.5 text-sm md:text-base text-text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/60 pr-8"
                >
                  {ART_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-light text-xs">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Scenes slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs md:text-sm text-text-light">
                Number of Scenes
              </label>
              <span className="text-xs md:text-sm text-text-white font-medium">
                {numScenes} scene{numScenes !== 1 ? "s" : ""}
              </span>
            </div>
            <input
              type="range"
              min={SCENE_RANGE.min}
              max={SCENE_RANGE.max}
              value={numScenes}
              step={1}
              onChange={(e) => setNumScenes(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[11px] md:text-xs text-text-light mt-1">
              <span>{SCENE_RANGE.min}</span>
              <span>Short</span>
              <span>Medium</span>
              <span>Long</span>
              <span>{SCENE_RANGE.max}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <p className="text-[11px] md:text-xs text-text-light max-w-xs">
              The AI will generate scene-by-scene descriptions and characters
              first. You can generate images for each scene afterwards.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 md:px-5 py-2.5 text-sm md:text-base font-semibold text-text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-text-white/40 border-t-text-white rounded-full animate-spin" />
                  Generating storyboard...
                </>
              ) : (
                <>Generate Storyboard</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
