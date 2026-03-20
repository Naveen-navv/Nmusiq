import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tracks, playlists } from '../../../data';

import { Colors } from 'src/constants';
import { usePlaylist } from 'src/provider';

import { MINI_AREA_HEIGHT } from '../Player/Dimensions';

import { Header } from './Header';
import { Title } from './Title';
import { Tabbar } from './Tabbar';
import { Lists } from './Lists';

interface Props {
  onPressSettings: () => void;
}

export const Playlist = ({ onPressSettings }: Props) => {
  const { setLists, setTracks } = usePlaylist();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setLists(playlists);
    setTracks(
      tracks.map((item) => ({
        ...item,
        id: String(item.id),
        url: item.source,
      })),
    );
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header onPressSettings={onPressSettings} />
      <Title />
      <Tabbar />
      <Lists />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: MINI_AREA_HEIGHT,
  },
});
