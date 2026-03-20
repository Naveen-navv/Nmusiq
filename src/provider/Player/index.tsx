import React, { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import TrackPlayer, {
  getTrack,
  getQueue,
  getCurrentTrack,
  getPosition,
  addEventListener,
  TrackPlayerEvents,
  useTrackPlayerEvents,
  STATE_PLAYING,
  STATE_PAUSED,
  play,
  seekTo,
  reset,
  skip,
} from 'react-native-track-player';

import { ITrack } from 'src/interfaces';

import { Context } from './Context';
import { defaultTrack } from './InitialValue';

const { PLAYBACK_STATE, PLAYBACK_QUEUE_ENDED } = TrackPlayerEvents;

interface Props {
  children: React.ReactNode;
}

export const PlayerProvider: React.FC<Props> = ({ children }: Props) => {
  const [isReady, setReady] = useState<boolean>(false);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [track, setTrack] = useState<ITrack>(defaultTrack);
  const [queue, setQueue] = useState<ITrack[]>([]);
  const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(false);
  const [repeatEnabled, setRepeatEnabled] = useState<boolean>(false);
  const sequenceRef = useRef<any[]>([]);
  const repeatEnabledRef = useRef<boolean>(false);

  useEffect(() => {
    repeatEnabledRef.current = repeatEnabled;
  }, [repeatEnabled]);

  const syncSequence = async () => {
    sequenceRef.current = await getQueue();
  };

  const shuffleItems = <T,>(items: T[]) => {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const temp = copy[index];
      copy[index] = copy[randomIndex];
      copy[randomIndex] = temp;
    }

    return copy;
  };

  const addToQueue = async (trackToQueue: ITrack) => {
    const { duration: _duration, ...playerTrack } = trackToQueue;
    const [playerQueue, currentTrackId] = await Promise.all([
      getQueue(),
      getCurrentTrack(),
    ]);

    let insertBeforeId: string | undefined;

    if (playerQueue.length > 0) {
      const currentIndex = playerQueue.findIndex(
        (item: any) => item.id === currentTrackId,
      );

      if (currentIndex >= 0) {
        const queuedIds = queue.map((item: ITrack) => item.id);
        let matchedQueued = 0;

        for (let index = currentIndex + 1; index < playerQueue.length; index++) {
          const item = playerQueue[index] as any;

          if (
            matchedQueued < queuedIds.length &&
            item.id === queuedIds[matchedQueued]
          ) {
            matchedQueued++;
            continue;
          }

          insertBeforeId = item.id;
          break;
        }
      } else {
        insertBeforeId = (playerQueue[0] as any).id;
      }
    }

    await TrackPlayer.add(playerTrack as any, insertBeforeId);
    setQueue((previous) => [...previous, trackToQueue]);
    await syncSequence();
  };

  const toggleShuffle = async () => {
    const nextValue = !shuffleEnabled;
    setShuffleEnabled(nextValue);

    if (!nextValue) {
      return;
    }

    const [playerQueue, currentTrackId, position, state] = await Promise.all([
      getQueue(),
      getCurrentTrack(),
      getPosition(),
      TrackPlayer.getState(),
    ]);

    if (!playerQueue.length) {
      return;
    }

    const currentIndex = playerQueue.findIndex(
      (item: any) => item.id === currentTrackId,
    );

    if (currentIndex < 0) {
      return;
    }

    const played = playerQueue.slice(0, currentIndex + 1);
    const upcoming = playerQueue.slice(currentIndex + 1);
    const pinnedQueued = upcoming.slice(0, queue.length);
    const regularUpcoming = upcoming.slice(queue.length);
    const reorderedQueue = [
      ...played,
      ...pinnedQueued,
      ...shuffleItems(regularUpcoming),
    ];

    await reset();
    await TrackPlayer.add(reorderedQueue as any);
    await skip(currentTrackId);
    await seekTo(position);

    if (state === TrackPlayer.STATE_PLAYING) {
      await play();
    }

    await syncSequence();
  };

  const toggleRepeat = () => {
    setRepeatEnabled((previous) => !previous);
  };

  useTrackPlayerEvents([PLAYBACK_STATE], (event: any) => {
    if (event.type === PLAYBACK_STATE) {
      if (event.state === STATE_PLAYING) {
        setPlaying(true);
      } else if (event.state === STATE_PAUSED) {
        setPlaying(false);
      }
    }
  });

  useEffect(() => {
    TrackPlayer.setupPlayer().then(() => {
      TrackPlayer.updateOptions({
        // Whether the player should stop running when the app is closed on Android
        stopWithApp: false,

        // An array of media controls capabilities
        // Can contain CAPABILITY_PLAY, CAPABILITY_PAUSE, CAPABILITY_STOP, CAPABILITY_SEEK_TO,
        // CAPABILITY_SKIP_TO_NEXT, CAPABILITY_SKIP_TO_PREVIOUS, CAPABILITY_SET_RATING
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_STOP,
          TrackPlayer.CAPABILITY_SEEK_TO,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ],

        // An array of capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SEEK_TO,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ],
      }).then(() => {
        setReady(true);
        setQueue([]);
        syncSequence();
      });
    });
  }, []);

  useEffect(() => {
    addEventListener('playback-track-changed', async () => {
      let trackId = await getCurrentTrack();
      let trackObject = await getTrack(trackId);

      if (trackObject) {
        setTrack({ ...trackObject, duration: '' });
      }
      setQueue((previous) => {
        const index = previous.findIndex((item: ITrack) => item.id === trackId);

        if (index < 0) {
          return previous;
        }

        return previous.filter((_: ITrack, itemIndex: number) => itemIndex !== index);
      });
      syncSequence();
    });

    addEventListener(PLAYBACK_QUEUE_ENDED, async () => {
      if (!repeatEnabledRef.current || !sequenceRef.current.length) {
        return;
      }

      const queueToReplay = [...sequenceRef.current];

      await reset();
      await TrackPlayer.add(queueToReplay as any);
      await play();
      setQueue([]);
      await syncSequence();
    });

    AppState.addEventListener('change', async (appState) => {
      if (appState == 'active') {
        const state = await TrackPlayer.getState();

        setPlaying(state == TrackPlayer.STATE_PLAYING);
        syncSequence();
      }
    });
  }, []);

  return (
    <Context.Provider
      value={{
        track,
        queue,
        isReady,
        isPlaying,
        shuffleEnabled,
        repeatEnabled,
        setPlaying,
        addToQueue,
        toggleShuffle,
        toggleRepeat,
      }}>
      {children}
    </Context.Provider>
  );
};

export { usePlayer } from './Context';
