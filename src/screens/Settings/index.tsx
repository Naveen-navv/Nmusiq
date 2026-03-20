import React from 'react';
import { View, StyleSheet, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, TextType } from 'src/components';
import { Colors } from 'src/constants';
import { Back } from 'src/icons';
import { useSettings } from 'src/provider';

interface Props {
  onPressBack: () => void;
}

export const Settings = ({ onPressBack }: Props) => {
  const insets = useSafeAreaInsets();
  const {
    showArtistNames,
    showDurations,
    showQueue,
    setShowArtistNames,
    setShowDurations,
    setShowQueue,
  } = useSettings();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={onPressBack} hitSlop={12}>
          <Back size={22} />
        </Pressable>
        <Text size={28} type={TextType.SEMIBOLD}>
          Settings
        </Text>
        <View style={styles.spacer} />
      </View>

      <Text size={12} color="rgba(247,244,236,0.55)" style={styles.eyebrow}>
        PERSONALIZE EXPERIENCE
      </Text>
      <View style={styles.card}>
        <SettingRow
          title="Show Artist Names"
          subtitle="Display the artist under each song in the home list."
          value={showArtistNames}
          onValueChange={setShowArtistNames}
        />
        <SettingRow
          title="Show Durations"
          subtitle="Show track lengths in the home list."
          value={showDurations}
          onValueChange={setShowDurations}
        />
        <SettingRow
          title="Show Queue Section"
          subtitle="Display the queued songs block on the player screen."
          value={showQueue}
          onValueChange={setShowQueue}
        />
      </View>
    </View>
  );
};

interface SettingRowProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingRow = ({
  title,
  subtitle,
  value,
  onValueChange,
}: SettingRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text size={17}>{title}</Text>
        <Text size={13} color={Colors.light}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(255,255,255,0.14)', true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  header: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: {
    width: 22,
  },
  card: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 28,
    backgroundColor: Colors.foreground,
    borderWidth: 1,
    borderColor: 'rgba(247,244,236,0.08)',
    shadowColor: Colors.black,
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  copy: {
    flex: 1,
    paddingRight: 16,
  },
  eyebrow: {
    marginTop: 10,
    letterSpacing: 2,
  },
});
