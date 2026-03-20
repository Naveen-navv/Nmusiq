import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Text } from 'src/components';
import { Back } from 'src/icons';

import { HEADER_HEIGHT } from '../Dimensions';
import { useAnimation } from '../Context';

interface Props {}

export const Header: React.FC<Props> = () => {
  const { percent, collapse } = useAnimation();

  const opacity = useDerivedValue(() => {
    return interpolate(percent.value, [80, 100], [0, 1]);
  });

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const onPressBack = useCallback(() => {
    collapse();
  }, [collapse]);

  return (
    <Animated.View style={[styles.container, style]}>
      <Pressable onPress={onPressBack} hitSlop={12}>
        <Back size={25} />
      </Pressable>
      <View style={styles.middle}>
        <Text size={18}>NOW PLAYING</Text>
      </View>
      <View style={styles.right} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
    elevation: 2,
    overflow: 'visible',
  },

  middle: {
    flex: 1,
    alignItems: 'center',
  },

  right: {
    width: 35,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'visible',
  },
});
