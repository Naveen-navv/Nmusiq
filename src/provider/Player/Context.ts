import { createContext, useContext } from 'react';
import { ITrack } from 'src/interfaces';

export type ContextType = {
  track: ITrack;
  queue: ITrack[];
  isReady: boolean;
  isPlaying: boolean;
  shuffleEnabled: boolean;
  repeatEnabled: boolean;

  setPlaying: (value: boolean) => void;
  addToQueue: (track: ITrack) => Promise<void>;
  toggleShuffle: () => Promise<void>;
  toggleRepeat: () => void;
};

export const Context = createContext<ContextType>({} as ContextType);

export const usePlayer = () => {
  const context = useContext(Context);

  return context;
};
