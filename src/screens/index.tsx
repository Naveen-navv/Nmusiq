import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Colors } from 'src/constants';

import { Playlist } from './Playlist';
import { Player } from './Player';
import { Settings } from './Settings';

export const Screens = () => {
  const [screen, setScreen] = useState<'home' | 'settings'>('home');

  return (
    <View style={styles.container}>
      {screen === 'home' ? (
        <>
          <Playlist onPressSettings={() => setScreen('settings')} />
          <Player />
        </>
      ) : (
        <Settings onPressBack={() => setScreen('home')} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
