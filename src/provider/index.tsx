import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PlaylistProvider } from './Playlist';
import { PlayerProvider } from './Player';
import { SettingsProvider } from './Settings';

interface Props {
  children: React.ReactNode;
}

export const Provider: React.FC<Props> = ({ children }: Props) => {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <PlaylistProvider>
          <PlayerProvider>{children}</PlayerProvider>
        </PlaylistProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
};

export { usePlayer } from './Player';
export { usePlaylist } from './Playlist';
export { useSettings } from './Settings';
