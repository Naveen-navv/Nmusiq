import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Modal, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  skip,
  play,
  addEventListener,
  getState,
  STATE_READY,
  STATE_PLAYING,
} from 'react-native-track-player';

import { ITrack } from 'src/interfaces';
import { Colors } from 'src/constants';
import { usePlaylist, usePlayer, useSettings } from 'src/provider';
import { Text } from 'src/components';
import { Options } from 'src/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  item?: ITrack;
  last: boolean;
  playlistIndex: number;
}

export const Item: React.FC<Props> = ({ item, last, playlistIndex }: Props) => {
  if (!item) return null;

  const { id, title, artwork, artist, duration } = item;
  const { active, updateTrackPlayer } = usePlaylist();
  const { addToQueue } = usePlayer();
  const { showArtistNames, showDurations } = useSettings();
  const optionsButtonRef = useRef<View>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 16 });

  const onPress = async () => {
    if (active !== playlistIndex) {
      await updateTrackPlayer(playlistIndex);
    }

    // get state before skip
    const state = await getState();

    await skip(id);

    // If it can't be played, wait until it's ready and then play
    if (state !== STATE_PLAYING) {
      let subscription = addEventListener('playback-state', (data) => {
        if (data.state === STATE_READY) {
          play();

          subscription.remove();
        }
      });
    }

    try {
      await play();
    } catch (error) {}
  };

  const onPressOptions = () => {
    if (menuVisible) {
      setMenuVisible(false);
      return;
    }

    optionsButtonRef.current?.measureInWindow((x, y, width) => {
      setMenuPosition({
        top: y + 24,
        right: Math.max(12, SCREEN_WIDTH - (x + width)),
      });
      setMenuVisible(true);
    });
  };

  const onPressAddToQueue = async () => {
    setMenuVisible(false);
    await addToQueue(item);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.pressArea}>
        <View style={styles.artworkContainer}>
          {artwork ? <FastImage source={artwork} style={styles.artwork} /> : null}

          <View style={styles.artworkInlineBorder}>
            <View style={styles.artworkPoint} />
          </View>
        </View>

        <View style={[styles.content, last && { borderBottomWidth: 0 }]}>
          <View style={styles.information}>
            <Text
              size={17}
              style={styles.title}
              numberOfLines={2}
              ellipsizeMode="tail">
              {title}
            </Text>

            {showArtistNames ? (
              <View style={styles.artist}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  size={13}
                  color={Colors.light}>
                  {artist}
                </Text>
              </View>
            ) : null}
          </View>

          {showDurations ? (
            <View style={styles.time}>
              <Text color={Colors.primary} size={13} style={styles.duration}>
                {duration}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      <View style={styles.options}>
        <Pressable onPress={onPressOptions} hitSlop={10} ref={optionsButtonRef}>
          <Options size={22} />
        </Pressable>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropPress} onPress={() => setMenuVisible(false)} />
          <View style={[styles.menu, { top: menuPosition.top, right: menuPosition.right }]}>
            <Pressable onPress={onPressAddToQueue} style={styles.menuItem}>
              <Text size={14} color="white">
                Add to queue
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 108,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  pressArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.foreground,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(247,244,236,0.08)',
    paddingHorizontal: 14,
    minHeight: 84,
  },

  artworkContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  artwork: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  artworkInlineBorder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: Colors.primary,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

  artworkPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.black,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingVertical: 14,
    overflow: 'visible',
    zIndex: 1,
  },

  information: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  title: {
    color: Colors.white,
    lineHeight: 22,
    paddingRight: 8,
    flexShrink: 1,
  },

  artist: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  time: {
    minWidth: 62,
    alignItems: 'flex-end',
  },
  duration: {
    letterSpacing: 0.4,
  },

  options: {
    minWidth: 44,
    alignItems: 'flex-end',
    overflow: 'visible',
    position: 'relative',
    zIndex: 2,
    marginLeft: 10,
  },
  menu: {
    position: 'absolute',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: Colors.foreground,
    borderColor: 'rgba(247, 244, 236, 0.1)',
    borderWidth: 1,
    zIndex: 3,
    elevation: 6,
    minWidth: 130,
    maxWidth: 160,
  },
  backdrop: {
    flex: 1,
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  menuItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});
