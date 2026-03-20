import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Search, Gear, DoubleQuaver } from 'src/icons';
import { Colors } from 'src/constants';
import { usePlaylist } from 'src/provider';

interface Props {
  onPressSettings: () => void;
}

export const Header = ({ onPressSettings }: Props) => {
  const { searchQuery, setSearchQuery } = usePlaylist();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSearch = () => {
    if (isOpen && searchQuery) {
      setSearchQuery('');
    }
    setIsOpen((value) => !value);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Pressable onPress={toggleSearch} hitSlop={10} style={styles.iconButton}>
          <Search size={28} />
        </Pressable>
        <View style={styles.brandWrap}>
          <DoubleQuaver size={30} />
        </View>
        <Pressable onPress={onPressSettings} hitSlop={10} style={styles.iconButton}>
          <Gear size={28} />
        </Pressable>
      </View>
      {isOpen ? (
        <View style={styles.searchWrap}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search songs or artists"
            placeholderTextColor={Colors.mute}
            selectionColor={Colors.primary}
            style={styles.input}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 82,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.foreground,
    borderWidth: 1,
    borderColor: 'rgba(247,244,236,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(212,176,106,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(212,176,106,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  input: {
    height: 48,
    borderRadius: 18,
    backgroundColor: Colors.foreground,
    color: Colors.white,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(247,244,236,0.08)',
  },
});
