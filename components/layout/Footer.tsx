import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer-section py-8 text-center text-sm text-gray-500">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <p className="font-semibold mb-2">
              About A web app where users type a story idea → the app generates
              scene-wise breakdown, anime-style images, and character sheets,
              and saves everything as a storyboard they can revisit and share.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
            <Link href="/features" className="hover:underline">
              Features
            </Link>
            <Link href="/how-to-use" className="hover:underline">
              How to Use
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/support" className="hover:underline">
              Support
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
        <p className="">
          &copy; {new Date().getFullYear()} AI Anime Storyboard Generator. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
