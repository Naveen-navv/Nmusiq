import { createContext, useContext } from 'react';

export type ContextType = {
  showArtistNames: boolean;
  showDurations: boolean;
  showQueue: boolean;
  setShowArtistNames: (value: boolean) => void;
  setShowDurations: (value: boolean) => void;
  setShowQueue: (value: boolean) => void;
};

export const Context = createContext<ContextType>({} as ContextType);

export const useSettings = () => {
  return useContext(Context);
};
