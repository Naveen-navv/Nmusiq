import React from 'react';
import { View, StyleSheet } from 'react-native';
import { playlists } from '../../../data';

import { Text, TextType } from 'src/components';
import { usePlaylist } from 'src/provider';

export const Title = () => {
  const { lists, swipeIndex } = usePlaylist();

  const text =
    lists.find((_, key) => key === swipeIndex)?.title ?? playlists[0]?.title ?? '';

  return (
    <View style={styles.container}>
      <Text size={12} color="rgba(247,244,236,0.55)" style={styles.eyebrow}>
        CURATED PLAYLIST
      </Text>
      <Text size={30} type={TextType.SEMIBOLD}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 84,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  eyebrow: {
    letterSpacing: 2.2,
    marginBottom: 6,
  },
});
