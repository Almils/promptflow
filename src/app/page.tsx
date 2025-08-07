"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>

      <div className="relative z-10 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Learn, Share & Level Up <br /> Your Prompts
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Join the next generation of prompt engineers. Practice, share, and rank up in a vibrant community.
        </p>

        <button
          onClick={() => router.push("/auth")}
          className="mt-10 inline-block bg-white text-indigo-700 px-10 py-4 rounded-xl shadow-lg text-lg font-bold hover:bg-gray-100 transition cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
