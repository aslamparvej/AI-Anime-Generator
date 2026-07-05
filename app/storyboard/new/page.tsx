"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch("api/storyboards", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title,
          prompt,
          genre,
          artStyle,
          numScenes,
        }),
      });

      const data = await res.json();

      if(!res.ok){
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
    } catch (error) {
      console.error(error);
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
      <div className="flex flex-col items-center justify-center h-full">
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs md:text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card min-w-[35rem] space-y-5">
          {/* Title  */}
          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e)=> setTitle(e.target.value)}
              placeholder="e.g. Demon of the Neon City"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="stroy_idea">Story idea</label>
            <textarea
              name="stroy_idea"
              id="stroy_idea"
              value={prompt}
              onChange={(e)=> setPrompt(e.target.value)}
              rows={6}
              placeholder="Example: A shy hacker girl in a futuristic Tokyo discovers a cursed AI spirit living inside the city's neon signs..."
              required
            ></textarea>
            <p className="mt-1 text-[11px] md:text-xs text-text-light">
              Tip: Mention setting, main character, conflict, and tone (e.g.
              dark, hopeful, comedic) for better scenes.
            </p>
          </div>

          {/* Genre */}
          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              name="genre"
              value={genre}
              onChange={(e)=> setGenre(e.target.value)}
              className="w-full appearance-none rounded-lg bg-bg border border-border px-3 py-2.5 text-sm md:text-base text-text-white outline-none pr-8"
              required
            >
              {GENRES.map((g) => (
                <option value={g.value} key={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="art_style">Art Style</label>
            <select
              id="art_style"
              name="art_style"
              value={artStyle}
              onChange={(e)=> setArtStyle(e.target.value)}
              className="w-full appearance-none rounded-lg bg-bg border border-border px-3 py-2.5 text-sm md:text-base text-text-white outline-none pr-8"
              required
            >
              {ART_STYLES.map((art) => (
                <option value={art.value} key={art.value}>
                  {art.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="number_of_scenes">Number of Scenes</label>
            <input
              type="range"
              id="number_of_scenes"
              min={SCENE_RANGE.min}
              max={SCENE_RANGE.max}
              step={1}
              value={numScenes}
              onChange={(e)=> setNumScenes(Number(e.target.value))}
              className="w-full accent-[var(--primary-color)]"
              required
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
          <div className="pt-2 flex flex-col items-center justify-between gap-3 mt-8">
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
            <p className="text-center text-[11px] md:text-xs text-text-light mt-4 w-[20rem]">
              Note: The AI will generate scene-by-scene descriptions and characters
              first. You can generate images for each scene afterwards.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
