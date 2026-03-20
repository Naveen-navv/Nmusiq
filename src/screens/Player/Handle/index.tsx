import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

import { useAnimation } from '../Context';
import { WIDTH, HANDLE_HEIGHT, MINI_CONTROL_WIDTH } from '../Dimensions';

interface Props {
  gestureHandler: (event: PanGestureHandlerGestureEvent) => void;
}

export const Handle: React.FC<Props> = ({ gestureHandler }: Props) => {
  const { percent, expand } = useAnimation();
  const tapRef = useRef(null);
  const panRef = useRef(null);

  const width = useDerivedValue(() => {
    return interpolate(
      percent.value,
      [0, 100],
      [WIDTH - MINI_CONTROL_WIDTH, WIDTH],
    );
  });

  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const onTapHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Only expand if the player is currently in the mini / collapsed state
      if (percent.value < 50) {
        expand();
      }
    }
  };

  return (
    <TapGestureHandler
      ref={tapRef}
      waitFor={panRef}
      onHandlerStateChange={onTapHandlerStateChange}>
      <Animated.View style={[styles.container, style]}>
        <PanGestureHandler ref={panRef} onGestureEvent={gestureHandler}>
          <Animated.View style={styles.inner} />
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: HANDLE_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  inner: {
    width: '100%',
    height: '100%',
  },
});
