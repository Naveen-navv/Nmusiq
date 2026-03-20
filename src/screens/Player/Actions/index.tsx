import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';

import { useAnimation } from '../Context';
import { WIDTH } from '../Dimensions';

import { Content } from './Content';
import { Controls } from './Controls';

export const Actions = () => {
  const offsetY = useSharedValue(0);
  const { expand } = useAnimation();

  const onLayout = useCallback(({ nativeEvent: { layout } }) => {
    offsetY.value = layout.y;
  }, []);

  return (
    <TapGestureHandler onActivated={expand}>
      <View onLayout={onLayout} style={styles.container}>
        <Content {...{ offsetY }} />
        <Controls {...{ offsetY }} />
      </View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 120,
  },
});
