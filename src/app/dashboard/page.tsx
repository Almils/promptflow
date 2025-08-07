"use client";
import { useEffect, useState } from "react";

interface DashboardStats {
  name: string;
  points: number;
  rank: number;
  postsCount: number;
  commentsCount: number;
  upvotesGiven: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch("/api/dashboard");
      const data: DashboardStats = await res.json();
      setStats(data);
    };
    fetchDashboard();
  }, []);

  if (!stats) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow p-5 rounded-lg space-y-4">
        <div><span className="font-semibold">Name:</span> {stats.name}</div>
        <div><span className="font-semibold">Points:</span> {stats.points}</div>
        <div><span className="font-semibold">Rank:</span> #{stats.rank}</div>
        <div><span className="font-semibold">Community Posts:</span> {stats.postsCount}</div>
        <div><span className="font-semibold">Comments:</span> {stats.commentsCount}</div>
        <div><span className="font-semibold">Upvotes Given:</span> {stats.upvotesGiven}</div>
      </div>
    </div>
  );
}
