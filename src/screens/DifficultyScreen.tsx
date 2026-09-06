import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DIFFICULTY_LEVELS } from '../data/riddles';
import { selectionHaptic, tapHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/sound';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface DifficultyScreenProps {
  initialLength: number;
  onSelect: (wordLength: number) => void;
  onOpenSettings: () => void;
}

const LABELS: Record<number, string> = {
  2: 'קליל',
  3: 'קל',
  4: 'בינוני',
  5: 'קשה',
  6: 'מומחה',
};

export default function DifficultyScreen({
  initialLength,
  onSelect,
  onOpenSettings,
}: DifficultyScreenProps) {
  const [selected, setSelected] = useState(initialLength);

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable
        style={styles.settingsButton}
        onPress={() => {
          tapHaptic();
          playClickSound();
          onOpenSettings();
        }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="settings-outline" size={20} color={colors.accent} />
      </Pressable>
      <Text style={styles.title}>בול פגיעה</Text>
      <Text style={styles.subtitle}>בחר/י דרגת קושי</Text>

      <View style={styles.grid}>
        {DIFFICULTY_LEVELS.map((length) => (
          <Pressable
            key={length}
            style={[styles.card, selected === length && styles.cardSelected]}
            onPress={() => {
              selectionHaptic();
              playClickSound();
              setSelected(length);
            }}
          >
            <Text
              style={[
                styles.cardLength,
                selected === length && styles.cardTextSelected,
              ]}
            >
              {length} אותיות
            </Text>
            <Text
              style={[
                styles.cardLabel,
                selected === length && styles.cardTextSelected,
              ]}
            >
              {LABELS[length] ?? ''}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.button}
        onPress={() => {
          tapHaptic();
          playClickSound();
          onSelect(selected);
        }}
      >
        <Text style={styles.buttonText}>התחל משחק</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 40,
  },
  settingsButton: {
    position: 'absolute',
    top: 58,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: radii.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 18,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 100,
    minHeight: 96,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  cardLength: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  cardLabel: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  cardTextSelected: {
    color: colors.textOnAccent,
  },
  button: {
    marginTop: 32,
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    color: colors.textOnAccent,
    fontSize: 18,
  },
});
