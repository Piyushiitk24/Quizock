import { create } from 'zustand';
import type { PerformanceRecord } from '../types';

interface UserState {
  username: string | null;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
  savePerformanceRecord: (record: PerformanceRecord) => void;
  getPerformanceRecords: () => PerformanceRecord[];
}

export const useUserStore = create<UserState>((set, get) => ({
  username: localStorage.getItem('quizock_username'),
  isAuthenticated: !!localStorage.getItem('quizock_username'),
  
  login: (name: string) => {
    localStorage.setItem('quizock_username', name);
    set({ username: name, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('quizock_username');
    localStorage.removeItem('quizock_performance');
    set({ username: null, isAuthenticated: false });
  },

  savePerformanceRecord: (record: PerformanceRecord) => {
    const { username } = get();
    if (!username) return;
    
    const key = `quizock_performance_${username}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as PerformanceRecord[];
    existing.unshift(record); // Add to beginning for chronological order
    localStorage.setItem(key, JSON.stringify(existing));
  },

  getPerformanceRecords: (): PerformanceRecord[] => {
    const { username } = get();
    if (!username) return [];
    
    const key = `quizock_performance_${username}`;
    return JSON.parse(localStorage.getItem(key) || '[]') as PerformanceRecord[];
  },
}));
