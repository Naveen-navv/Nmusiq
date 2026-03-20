import React, { useState } from 'react';

import { Context } from './Context';

interface Props {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<Props> = ({ children }: Props) => {
  const [showArtistNames, setShowArtistNames] = useState(true);
  const [showDurations, setShowDurations] = useState(true);
  const [showQueue, setShowQueue] = useState(true);

  return (
    <Context.Provider
      value={{
        showArtistNames,
        showDurations,
        showQueue,
        setShowArtistNames,
        setShowDurations,
        setShowQueue,
      }}>
      {children}
    </Context.Provider>
  );
};

export { useSettings } from './Context';
