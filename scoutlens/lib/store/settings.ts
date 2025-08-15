import { create } from 'zustand';

type SettingsState = {
  techName: string;
  company: string;
  webhookUrl: string;
  autoSend: boolean;
  set: (partial: Partial<Omit<SettingsState, 'set'>>) => void;
};

export const useSettings = create<SettingsState>((set) => ({
  techName: typeof window !== 'undefined' ? (localStorage.getItem('techName') || '') : '',
  company: typeof window !== 'undefined' ? (localStorage.getItem('company') || '') : '',
  webhookUrl: typeof window !== 'undefined' ? (localStorage.getItem('webhookUrl') || '') : '',
  autoSend: typeof window !== 'undefined' ? localStorage.getItem('autoSend') === '1' : false,
  set: (partial) => set((state) => {
    const next = { ...state, ...partial };
    if (typeof window !== 'undefined') {
      localStorage.setItem('techName', next.techName || '');
      localStorage.setItem('company', next.company || '');
      localStorage.setItem('webhookUrl', next.webhookUrl || '');
      localStorage.setItem('autoSend', next.autoSend ? '1' : '0');
    }
    return next;
  }),
}));