"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, Users, ThumbsUp, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardUser {
  id: string;
  name: string;
  imageUrl: string | null;
  total_notes?: number;
  total_upvotes?: number;
  rank: number;
}

// ✅ Fetch data dynamically from API
const fetchLeaderboardData = async (type: string): Promise<LeaderboardUser[]> => {
  try {
    const response = await fetch(`/api/leaderboard?type=${type}`);
    if (!response.ok) {
      throw new Error(`Error fetching leaderboard data: ${response.status}`);
    }

    const result: LeaderboardUser[] = await response.json();
    return result.map((user, index) => ({
      ...user,
      rank: index + 1, // ✅ Add rank dynamically
    }));
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    return [];
  }
};

const LeaderboardItem = ({
  user,
  activeTab,
}: {
  user: LeaderboardUser;
  activeTab: string;
}) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center rounded-full shadow-lg animate-pulse-slow">
            <Trophy className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center rounded-full">
            <Medal className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 3:
        return (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center rounded-full">
            <Award className="w-3.5 h-3.5 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-amber-500";
      case 2:
        return "bg-gradient-to-r from-slate-400 to-slate-500";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-700";
      default:
        return "bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-500 dark:to-slate-600";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-700/20 shadow-xl p-4 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-14 h-14 ring-2 ring-purple-200 dark:ring-purple-900/30 group-hover:ring-purple-500/50 transition-all duration-300 shadow-md">
              <AvatarImage
                src={user.imageUrl || undefined}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-medium">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {getRankBadge(user.rank)}
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              {user.name}
            </h3>
            <div className="flex items-center gap-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "contributors"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}
              >
                {activeTab === "contributors"
                  ? `${user.total_notes} notes`
                  : `${user.total_upvotes} upvotes`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`font-bold text-lg text-white rounded-full w-8 h-8 flex items-center justify-center ${getRankColor(
              user.rank
            )}`}
          >
            {user.rank}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("contributors");
  const [loading, setLoading] = useState(true);
  const [contributors, setContributors] = useState<LeaderboardUser[]>([]);
  const [upvoted, setUpvoted] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch data dynamically from API
        const [contributorsRes, upvotedRes] = await Promise.all([
          fetchLeaderboardData("contributors"),
          fetchLeaderboardData("upvoted"),
        ]);

        setContributors(contributorsRes);
        setUpvoted(upvotedRes);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-6 md:p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-700/20 shadow-xl overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 via-purple-600 to-blue-600 dark:from-purple-400 dark:via-purple-300 dark:to-blue-400">
                Leaderboard
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Discover top community members
              </p>
            </div>

            <div className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 shadow-sm">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg">
              <TabsTrigger
                value="upvoted"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm py-2.5"
              >
                <ThumbsUp className="w-4 h-4" />
                Most Upvoted
              </TabsTrigger>
              <TabsTrigger
                value="contributors"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm py-2.5"
              >
                <Users className="w-4 h-4" />
                Top Contributors
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Loading leaderboard...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value={activeTab} className="mt-0 space-y-4">
                    {(activeTab === "contributors" ? contributors : upvoted)
                      .length > 0 ? (
                      (activeTab === "contributors" ? contributors : upvoted).map(
                        (user) => (
                          <LeaderboardItem
                            key={user.id}
                            user={user}
                            activeTab={activeTab}
                          />
                        )
                      )
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-slate-500 dark:text-slate-400">
                          No data available
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
