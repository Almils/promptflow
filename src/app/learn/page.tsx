"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import { CardTitle } from "@/components/ui/card-title";
import { CardContent } from "@/components/ui/card-content";


interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Introduction to Prompt Engineering",
    description: "Learn the basics of crafting effective prompts for AI models.",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Advanced Prompt Tuning Techniques",
    description: "Take your prompts to the next level with context and parameters.",
    difficulty: "Advanced",
  },
  {
    id: 3,
    title: "Building AI-Powered Apps",
    description: "Understand how to integrate AI prompts into your applications.",
    difficulty: "Intermediate",
  },
  {
    id: 4,
    title: "Community Best Practices",
    description: "Tips and etiquette for engaging with the prompt engineering community.",
    difficulty: "Beginner",
  },
  {
    id: 5,
    title: "Debugging and Improving Prompts",
    description: "Learn how to analyze and improve prompt results for better outputs.",
    difficulty: "Intermediate",
  },
];

export default function LearnPage() {
  const [filter, setFilter] = useState<Lesson["difficulty"] | "All">("All");

  const filteredLessons =
    filter === "All" ? lessons : lessons.filter((l) => l.difficulty === filter);

  const difficultyColors = {
    Beginner: "bg-green-200 text-green-800",
    Intermediate: "bg-yellow-200 text-yellow-800",
    Advanced: "bg-red-200 text-red-800",
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">Learn Prompt Engineering</h1>
      <p className="mb-6 text-gray-700 max-w-xl">
        Master the art of prompt engineering through guided lessons, community tips, and practical tutorials.
      </p>

      {/* Filter Buttons */}
      <div className="flex space-x-3 mb-8">
        {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              filter === level
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {filteredLessons.map(({ id, title, description, difficulty }) => (
          <Card key={id} className="hover:shadow-lg transition cursor-pointer">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{title}</CardTitle>
              <Badge className={difficultyColors[difficulty]}>{difficulty}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
