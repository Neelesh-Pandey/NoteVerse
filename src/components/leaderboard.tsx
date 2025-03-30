"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, Users, ThumbsUp, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";

interface LeaderboardUser {
  id: string;
  name: string;
  imageUrl: string | null;
  total_notes?: number;
  total_upvotes?: number;
  rank: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("contributors");
  const [loading, setLoading] = useState(true);
  const [contributors, setContributors] = useState<LeaderboardUser[]>([]);
  const [upvoted, setUpvoted] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const [contributorsRes, upvotedRes] = await Promise.all([
        axios.get("/api/leaderboard?type=contributors"),
        axios.get("/api/leaderboard?type=upvoted"),
      ]);

      setContributors(
        contributorsRes.data.map((user: LeaderboardUser, index: number) => ({
          ...user,
          rank: index + 1,
        }))
      );
      setUpvoted(
        upvotedRes.data.map((user: LeaderboardUser, index: number) => ({
          ...user,
          rank: index + 1,
        }))
      );
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const LeaderboardList = ({ users }: { users: LeaderboardUser[] }) => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {users.length > 0 ? (
        users.map((user) => (
          <motion.div
            key={user.id}
            variants={item}
            className="group relative flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-primary/50 transition-all duration-300">
                  <AvatarImage
                    src={user.imageUrl || undefined}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {getRankIcon(user.rank)}
              </div>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activeTab === "contributors"
                    ? `${user.total_notes} notes`
                    : `${user.total_upvotes} upvotes`}
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              #{user.rank}
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            No data available
          </p>
        </div>
      )}
    </motion.div>
  );

  return (
    <Card className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Leaderboard
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700">
                <Users className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>View top contributors and most upvoted profiles</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="contributors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Top Contributors
          </TabsTrigger>
          <TabsTrigger value="upvoted" className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            Most Upvoted
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <LeaderboardList
                users={activeTab === "contributors" ? contributors : upvoted}
              />
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </Card>
  );
}
