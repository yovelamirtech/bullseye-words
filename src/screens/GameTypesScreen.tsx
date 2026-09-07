import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WORD_LENGTHS } from '../data/riddles';
import { getStageCount } from '../data/words';
import { selectionHaptic, tapHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/sound';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';
import ProgressMeter from '../components/ProgressMeter';

interface GameTypesScreenProps {
  completedStages: Record<number, number>;
  onSelect: (wordLength: number) => void;
  onOpenSettings: () => void;
}

export default function GameTypesScreen({
  completedStages,
  onSelect,
  onOpenSettings,
}: GameTypesScreenProps) {
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
      <Text style={styles.subtitle}>בחרו כמה אותיות</Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {WORD_LENGTHS.map((length) => {
          const total = getStageCount(length);
          const completed = Math.min(completedStages[length] ?? 0, total);
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const letterBoxes = Array.from({ length });
          return (
            <Pressable
              key={length}
              style={styles.card}
              onPress={() => {
                selectionHaptic();
                playClickSound();
                onSelect(length);
              }}
            >
              <View style={styles.cardText}>
                <View style={styles.boxesRow}>
                  {letterBoxes.map((_, index) => (
                    <View key={index} style={styles.letterBox} />
                  ))}
                </View>
                <ProgressMeter percent={percent} width={100} />
              </View>
              <Ionicons
                name="chevron-back"
                size={22}
                color={colors.accent}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 64,
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
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 20,
    color: colors.text,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  cardText: {
    alignItems: 'flex-end',
  },
  boxesRow: {
    flexDirection: 'row-reverse',
    gap: 6,
  },
  letterBox: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
});
