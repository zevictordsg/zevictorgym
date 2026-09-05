import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FunnelAnswers = {
  nome?: string;
  whatsapp?: string;
  objetivo?: string;
  pesoAtual?: number;
  pesoMeta?: number;
  nivelAtividade?: string;
  /** capturado na Screen09FinalOffer — usado pra criar a conta na área de membros (carbb) */
  email?: string;
  // demais respostas do quiz entram aqui como chaves livres
  [key: string]: string | number | undefined;
};

type FunnelState = {
  /** índice da tela atual dentro do array STEPS (ver data/funnel-steps.tsx) */
  currentIndex: number;
  /** 1 = avançando, -1 = voltando — usado para escolher a animação */
  direction: 1 | -1;
  answers: FunnelAnswers;
  /** id do lead salvo no Supabase, preenchido assim que capturamos o primeiro dado */
  leadId: string | null;
  hasHydrated: boolean;
  /**
   * Timestamp (Date.now()) de quando a "sessão de urgência" começou —
   * usado pra derivar as vagas/vouchers restantes (ver useSpotsRemaining)
   * de um jeito determinístico e IGUAL em qualquer tela que leia o hook,
   * em vez de cada tela ter seu próprio contador local desincronizado.
   * Persistido, então um refresh no meio do funil não "reseta" a contagem
   * pra cima (o que ia parecer estranho pro usuário).
   */
  spotsSessionStartedAt: number | null;

  goNext: (lastIndex: number) => void;
  goBack: () => void;
  goTo: (index: number) => void;
  setAnswer: (key: string, value: string | number | undefined) => void;
  setLeadId: (id: string) => void;
  ensureSpotsSessionStarted: () => void;
  reset: () => void;
  setHasHydrated: (state: boolean) => void;
};

export const useFunnelStore = create<FunnelState>()(
  persist(
    (set, get) => ({
      currentIndex: 0,
      direction: 1,
      answers: {},
      leadId: null,
      hasHydrated: false,
      spotsSessionStartedAt: null,

      goNext: (lastIndex) =>
        set((state) => ({
          direction: 1,
          currentIndex: Math.min(state.currentIndex + 1, lastIndex),
        })),

      goBack: () =>
        set((state) => ({
          direction: -1,
          currentIndex: Math.max(state.currentIndex - 1, 0),
        })),

      goTo: (index) =>
        set((state) => ({
          direction: index >= state.currentIndex ? 1 : -1,
          currentIndex: index,
        })),

      setAnswer: (key, value) =>
        set((state) => ({ answers: { ...state.answers, [key]: value } })),

      setLeadId: (id) => set({ leadId: id }),

      ensureSpotsSessionStarted: () => {
        if (get().spotsSessionStartedAt == null) {
          set({ spotsSessionStartedAt: Date.now() });
        }
      },

      reset: () =>
        set({ currentIndex: 0, direction: 1, answers: {}, leadId: null, spotsSessionStartedAt: null }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "carbmaxxing-funnel",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentIndex: state.currentIndex,
        answers: state.answers,
        leadId: state.leadId,
        spotsSessionStartedAt: state.spotsSessionStartedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
