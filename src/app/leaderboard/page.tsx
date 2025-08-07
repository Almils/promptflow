"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LeaderboardUser {
  id: string;
  name?: string | null;
  image?: string | null;
  points: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) return;
      const data: unknown = await res.json();
      if (Array.isArray(data)) setUsers(data as LeaderboardUser[]);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      {users.map((user, index) => (
        <div
          key={user.id}
          className="flex items-center justify-between bg-white shadow p-3 rounded-lg mb-2"
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold">#{index + 1}</span>
            {user.image && (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <span>{user.name ?? "Anonymous"}</span>
          </div>
          <span className="font-semibold">{user.points} pts</span>
        </div>
      ))}
    </div>
  );
}
