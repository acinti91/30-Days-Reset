"use client";

import { useState, useCallback } from "react";
import { useApp } from "@/hooks/useApp";
import Onboarding from "@/components/Onboarding";
import Navigation from "@/components/Navigation";
import TodayView from "@/components/TodayView";
import PlanView from "@/components/PlanView";
import ChatView from "@/components/ChatView";
import ProgressView from "@/components/ProgressView";
import ToolkitView from "@/components/ToolkitView";
import MusicToggle from "@/components/MusicToggle";

export default function Home() {
  const {
    startDate,
    currentDay,
    loading,
    activeTab,
    checkIns,
    setStartDate,
    saveCheckIn,
    setActiveTab,
  } = useApp();

  const [autoGreet, setAutoGreet] = useState(false);
  const [viewingDay, setViewingDay] = useState<number | null>(null);

  const openChatFromToday = useCallback(() => {
    setAutoGreet(true);
    setActiveTab("chat");
  }, [setActiveTab]);

  const handleDaySelect = useCallback((day: number) => {
    setViewingDay(day);
    setActiveTab("today");
  }, [setActiveTab]);

  const handleDayChange = useCallback((day: number | null) => {
    setViewingDay(day);
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!startDate || !currentDay) {
    return <Onboarding onStart={setStartDate} />;
  }

  return (
    <main className="min-h-dvh bg-background">
      <MusicToggle />
      <div className="fade-active">
        {activeTab === "today" && (
          <TodayView
            currentDay={currentDay}
            viewingDay={viewingDay}
            startDate={startDate}
            allCheckIns={checkIns}
            onSaveCheckIn={saveCheckIn}
            onOpenChat={openChatFromToday}
            onDayChange={handleDayChange}
          />
        )}
        {activeTab === "plan" && <PlanView currentDay={currentDay} onDaySelect={handleDaySelect} />}
        {activeTab === "chat" && <ChatView autoGreet={autoGreet} />}
        {activeTab === "progress" && (
          <ProgressView currentDay={currentDay} checkIns={checkIns} startDate={startDate} />
        )}
        {activeTab === "toolkit" && <ToolkitView />}
      </div>
      <Navigation activeTab={activeTab} onTabChange={(tab) => { setAutoGreet(false); if (tab === "today") setViewingDay(null); setActiveTab(tab); }} />
    </main>
  );
}
