import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Madhab, HeirType } from '../inheritance/types';

export type HeirEntry = { type: HeirType; count: number };

type CalculationState = {
  totalEstate: number;
  debts: number;
  funeralExpenses: number;
  willAmount: number;
  madhab: Madhab;
  heirs: HeirEntry[];
};

type Action =
  | { type: 'SET_ESTATE'; payload: { total: number; debts: number; funeral: number; will: number } }
  | { type: 'SET_MADHAB'; payload: Madhab }
  | { type: 'SET_HEIRS'; payload: HeirEntry[] }
  | { type: 'RESET' };

const initialState: CalculationState = {
  totalEstate: 0,
  debts: 0,
  funeralExpenses: 0,
  willAmount: 0,
  madhab: 'hanafi',
  heirs: [],
};

function reducer(state: CalculationState, action: Action): CalculationState {
  switch (action.type) {
    case 'SET_ESTATE':
      return { ...state, ...action.payload };
    case 'SET_MADHAB':
      return { ...state, madhab: action.payload };
    case 'SET_HEIRS':
      return { ...state, heirs: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const CalculationContext = createContext<{
  state: CalculationState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const CalculationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <CalculationContext.Provider value={{ state, dispatch }}>{children}</CalculationContext.Provider>;
};

export const useCalculationContext = () => {
  const context = useContext(CalculationContext);
  if (!context) throw new Error('useCalculationContext must be used inside CalculationProvider');
  return context;
};
