import Image from "next/image";
import Link from "next/link";

import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section container min-h-screen flex flex-col justify-center items-center gap-8">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-black dark:text-white">
            AI Anime Storyboard Generator
          </h1>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            Generate anime-style storyboards using AI technology. Perfect for
            artists, writers, and creators looking to visualize their ideas.
          </p>
          <Link href="/signup">
            <button className="">Get Started</button>
          </Link>
        </div>
        <div className="hero-image-container">
          <Image src="/hero-banner.png" alt="Anime Storyboard" width={800} height={400} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card feature-card">
            <h2 className=" text-[1.25rem] font-semibold mb-4">AI-Powered</h2>
            <p>
              Leverage advanced AI algorithms to create stunning anime-style
              storyboards effortlessly.
            </p>
          </div>
          <div className="card feature-card">
            <h2 className=" text-[1.25rem] font-semibold mb-4">
              User-Friendly
            </h2>
            <p>
              Intuitive interface designed for both beginners and professionals.
            </p>
          </div>
          <div className="card feature-card">
            <h2 className=" text-[1.25rem] font-semibold mb-4">Customizable</h2>
            <p>
              Tailor your storyboards with various styles and settings to match
              your vision.
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section container py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">About Us</h2>
        <p className="text-center max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          At AI Anime Storyboard Generator, we are passionate about empowering
          creators with cutting-edge AI technology. Our mission is to make the
          process of visual storytelling accessible and enjoyable for everyone.
        </p>
      </section>

      {/* How to use section */}
      <section className="usage-section container py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card feature-card">
            <h3 className=" text-[1.25rem] font-semibold mb-4">
              Step 1: Sign Up
            </h3>
            <p>Create an account to access all features and save your work.</p>
          </div>
          <div className="card feature-card">
            <h3 className=" text-[1.25rem] font-semibold mb-4">
              Step 2: Input Ideas
            </h3>
            <p>Enter your story ideas and preferences to guide the AI.</p>
          </div>
          <div className="card feature-card">
            <h3 className=" text-[1.25rem] font-semibold mb-4">
              Step 3: Generate Storyboard
            </h3>
            <p>Let the AI create a unique anime-style storyboard for you.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section container py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card feature-card">
            <p>
              "This tool has revolutionized the way I create storyboards. The AI
              generates amazing anime-style visuals that perfectly match my
              ideas!"
            </p>
            <span className="block mt-4 font-semibold">- Alex M.</span>
          </div>
          <div className="card feature-card">
            <p>
              "As a writer, I love how easy it is to visualize my stories. The
              customization options let me create exactly what I envision."
            </p>
            <span className="block mt-4 font-semibold">- Jamie L.</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section container py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
        <p className="text-center max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          Have questions or feedback? Reach out to us anytime, and we'll be
          happy to help.
        </p>
        {/* Contact Form  */}
        <form className="max-w-2xl mx-auto mt-8 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Your Message"
            className="p-3 border border-gray-300 rounded-md h-32"
          ></textarea>
          <button type="submit" className="">
            Send Message
          </button>
        </form>
      </section>
    </>
  );
}
