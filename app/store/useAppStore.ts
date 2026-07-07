import { create } from "zustand";

interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface AppState {
  notifications: Notification[];
  addNotification: (type: "success" | "error" | "info", message: string) => void;
  removeNotification: (id: string) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  notifications: [],
  addNotification: (type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }));
    // Auto remove after 5s
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  isSettingsOpen: false,
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
}));
