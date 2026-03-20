import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useAnimation } from '../Context';

import { Colors } from 'src/constants';
import { usePlayer } from 'src/provider';
import { Shuffle as Icon } from 'src/icons';

interface Props {}

export const Shuffle: React.FC<Props> = () => {
  const { percent } = useAnimation();
  const { shuffleEnabled, toggleShuffle } = usePlayer();

  const onPress = () => {
    toggleShuffle();
  };

  const opacity = useDerivedValue(() => {
    return interpolate(percent.value, [0, 90, 100], [0, 0, 1]);
  });

  const style = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  return (
    <Animated.View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress}>
        <Icon fill={shuffleEnabled ? Colors.primary : Colors.light} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 40,
  },
});
