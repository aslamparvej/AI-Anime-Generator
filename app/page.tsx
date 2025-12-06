import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16">
        <div className="mb-32 w-full text-center sm:mb-16 sm:text-left">
          <h1 className="mb-6 text-5xl font-bold text-black dark:text-white">
            AI Anime Storyboard Generator
          </h1>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            Generate anime-style storyboards using AI technology. Perfect for
            artists, writers, and creators looking to visualize their ideas.
          </p>
          <a
            href="/generate"
            className="inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
