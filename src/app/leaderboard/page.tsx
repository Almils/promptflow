"use client";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
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
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <span>{user.name || "Anonymous"}</span>
          </div>
          <span className="font-semibold">{user.points} pts</span>
        </div>
      ))}
    </div>
  );
}
