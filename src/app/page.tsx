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
import CatchUpOverlay from "@/components/CatchUpOverlay";

export default function Home() {
  const {
    startDate,
    currentDay,
    loading,
    activeTab,
    checkIns,
    userName,
    showNewDayPrompt,
    gapInfo,
    showCatchUp,
    setStartDate,
    setUserName,
    saveCheckIn,
    setActiveTab,
    acknowledgeNewDay,
    dismissCatchUp,
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

  const handleOnboardingStart = useCallback(async (date: string, name: string) => {
    await setStartDate(date);
    if (name) {
      await setUserName(name);
    }
  }, [setStartDate, setUserName]);

  const handleAcknowledgeNewDay = useCallback(() => {
    acknowledgeNewDay();
    setViewingDay(null);
  }, [acknowledgeNewDay]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!startDate || !currentDay) {
    return <Onboarding onStart={handleOnboardingStart} />;
  }

  return (
    <main className="min-h-dvh bg-background">
      <MusicToggle />

      {/* New Day Overlay */}
      {showNewDayPrompt && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
          <div className="text-center space-y-6">
            <h1 className="font-serif text-4xl font-light text-foreground">
              A new day has begun
            </h1>
            <p className="text-text-secondary text-sm">
              Ready to continue your journey?
            </p>
            <button
              onClick={handleAcknowledgeNewDay}
              className="bg-accent hover:bg-accent-muted text-background font-medium px-8 py-3 rounded-full transition-colors text-sm tracking-wide active:scale-[0.98]"
            >
              Begin new day
            </button>
          </div>
        </div>
      )}

      {/* Catch-Up Overlay — shown after multi-day gap */}
      {showCatchUp && gapInfo && (
        <CatchUpOverlay
          missedDays={gapInfo.missedDays}
          lastActiveDay={gapInfo.lastActiveDay}
          currentDay={currentDay}
          onContinue={dismissCatchUp}
          onReviewMissed={() => {
            dismissCatchUp();
            setViewingDay(gapInfo.lastActiveDay + 1);
          }}
        />
      )}

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
            userName={userName}
            gapInfo={gapInfo}
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
