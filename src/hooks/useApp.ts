"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CheckIn } from "@/lib/db";

export type Tab = "today" | "plan" | "chat" | "progress" | "toolkit";

interface AppState {
  startDate: string | null;
  currentDay: number | null;
  loading: boolean;
  activeTab: Tab;
  checkIns: CheckIn[];
  userName: string | null;
  showNewDayPrompt: boolean;
  gapInfo: { missedDays: number; lastActiveDay: number } | null;
  showCatchUp: boolean;
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

export function useApp() {
  const [state, setState] = useState<AppState>({
    startDate: null,
    currentDay: null,
    loading: true,
    activeTab: "today",
    checkIns: [],
    userName: null,
    showNewDayPrompt: false,
    gapInfo: null,
    showCatchUp: false,
  });

  const lastCheckedDate = useRef(getTodayStr());

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setState((prev) => ({
      ...prev,
      startDate: data.startDate,
      currentDay: data.currentDay,
      userName: data.userName ?? null,
      loading: false,
    }));
  }, []);

  const fetchCheckIns = useCallback(async () => {
    const res = await fetch("/api/checkin");
    const data = await res.json();
    setState((prev) => ({ ...prev, checkIns: data }));
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchCheckIns();
  }, [fetchSettings, fetchCheckIns]);

  // Midnight auto-refresh: detect date change
  useEffect(() => {
    const checkDateChange = () => {
      const now = getTodayStr();
      if (now !== lastCheckedDate.current) {
        lastCheckedDate.current = now;
        setState((prev) => ({ ...prev, showNewDayPrompt: true }));
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkDateChange();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    const interval = setInterval(checkDateChange, 60_000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, []);

  const acknowledgeNewDay = useCallback(async () => {
    setState((prev) => ({ ...prev, showNewDayPrompt: false }));
    await Promise.all([fetchSettings(), fetchCheckIns()]);
  }, [fetchSettings, fetchCheckIns]);

  const setStartDate = async (date: string) => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: date }),
    });
    await fetchSettings();
  };

  const setUserName = async (name: string) => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: name }),
    });
    setState((prev) => ({ ...prev, userName: name }));
  };

  const saveCheckIn = async (data: Omit<CheckIn, "id" | "created_at">) => {
    await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchCheckIns();
  };

  const setActiveTab = (tab: Tab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  // Gap detection: detect multi-day gaps after check-ins and currentDay load
  useEffect(() => {
    const { checkIns, currentDay, startDate } = state;
    if (!currentDay || currentDay < 3 || !startDate) return;

    const todayKey = getTodayStr();
    const dismissedKey = `catch-up-dismissed-${todayKey}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(dismissedKey)) return;

    // Find the most recent check-in date
    if (checkIns.length === 0) {
      // No check-ins at all — gap is from day 1
      const missedDays = currentDay - 1;
      if (missedDays >= 2) {
        setState((prev) => ({
          ...prev,
          gapInfo: { missedDays, lastActiveDay: 0 },
          showCatchUp: true,
        }));
      }
      return;
    }

    // Convert the most recent check-in date to a day number
    const lastCheckInDate = checkIns[checkIns.length - 1].date;
    const startMs = new Date(startDate + "T12:00:00").getTime();
    const lastMs = new Date(lastCheckInDate + "T12:00:00").getTime();
    const lastActiveDay = Math.floor((lastMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
    const missedDays = currentDay - lastActiveDay - 1;

    if (missedDays >= 2) {
      setState((prev) => ({
        ...prev,
        gapInfo: { missedDays, lastActiveDay },
        showCatchUp: true,
      }));
    }
  }, [state.checkIns, state.currentDay, state.startDate]);

  const dismissCatchUp = useCallback(() => {
    const todayKey = getTodayStr();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`catch-up-dismissed-${todayKey}`, "1");
    }
    setState((prev) => ({ ...prev, showCatchUp: false, gapInfo: null }));
  }, []);

  return {
    ...state,
    setStartDate,
    setUserName,
    saveCheckIn,
    setActiveTab,
    refreshCheckIns: fetchCheckIns,
    acknowledgeNewDay,
    dismissCatchUp,
  };
}
