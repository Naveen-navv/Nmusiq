import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Text } from 'src/components';
import { Colors } from 'src/constants';
import { usePlayer, useSettings } from 'src/provider';

import { useAnimation } from '../Context';
import { WIDTH } from '../Dimensions';

export const Queue = () => {
  const { queue } = usePlayer();
  const { showQueue } = useSettings();
  const { percent } = useAnimation();

  if (!showQueue) {
    return null;
  }

  const opacity = useDerivedValue(() => {
    return interpolate(percent.value, [70, 100], [0, 1]);
  });

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, style]}>
      <Text size={12} color="rgba(247,244,236,0.55)" style={styles.eyebrow}>
        QUEUE
      </Text>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {queue.length === 0 ? (
          <Text size={14} color={Colors.light} style={styles.empty}>
            Queue is empty
          </Text>
        ) : (
          queue.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.item}>
              <Text size={15} numberOfLines={1}>
                {item.title}
              </Text>
              <Text size={13} color={Colors.light} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 170,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  list: {
    marginTop: 10,
    backgroundColor: Colors.foreground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(247,244,236,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  eyebrow: {
    letterSpacing: 2,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(247,244,236,0.08)',
  },
  empty: {
    paddingVertical: 12,
  },
});
