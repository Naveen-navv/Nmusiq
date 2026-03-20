import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { IPlaylist } from 'src/interfaces';
import { Colors } from 'src/constants';
import { Text, TextType } from 'src/components';
import { usePlaylist } from 'src/provider';

export const Tabbar = () => {
  const { lists, swipeIndex, setSwipeIndex } = usePlaylist();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {lists.map((playlist: IPlaylist, key: number) => (
          <TouchableOpacity key={key} onPress={() => setSwipeIndex(key)}>
            <View
              style={[
                styles.text,
                swipeIndex === key ? styles.textActive : undefined,
              ]}>
              <Text
                size={15}
                color={
                  swipeIndex === key ? Colors.black : 'rgba(247,244,236,0.74)'
                }
                type={
                  swipeIndex === key ? TextType.SEMIBOLD : TextType.REGULAR
                }>
                {playlist.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 74,
    paddingLeft: 20,
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
  },
  text: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.foreground,
    borderWidth: 1,
    borderColor: 'rgba(247,244,236,0.08)',
  },
  textActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
