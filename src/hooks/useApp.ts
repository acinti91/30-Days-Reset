"use client";

import { useState, useEffect, useCallback } from "react";
import type { CheckIn } from "@/lib/db";

export type Tab = "today" | "plan" | "chat" | "progress" | "toolkit";

interface AppState {
  startDate: string | null;
  currentDay: number | null;
  loading: boolean;
  activeTab: Tab;
  checkIns: CheckIn[];
}

export function useApp() {
  const [state, setState] = useState<AppState>({
    startDate: null,
    currentDay: null,
    loading: true,
    activeTab: "today",
    checkIns: [],
  });

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setState((prev) => ({
      ...prev,
      startDate: data.startDate,
      currentDay: data.currentDay,
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

  const setStartDate = async (date: string) => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: date }),
    });
    await fetchSettings();
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

  return {
    ...state,
    setStartDate,
    saveCheckIn,
    setActiveTab,
    refreshCheckIns: fetchCheckIns,
  };
}
