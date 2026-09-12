import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WORD_LENGTHS } from '../data/riddles';
import { getStageCount } from '../data/words';
import { selectionFeedback } from '../utils/pressFeedback';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';
import { maxContentWidth } from '../theme/layout';
import ProgressMeter from '../components/ProgressMeter';
import { BackButton, SettingsButton } from '../components/TopBar';

const HEBREW_ALPHABET = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
  'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת',
];

interface GameTypesScreenProps {
  completedStages: Record<number, number>;
  onSelect: (wordLength: number) => void;
  onOpenSettings: () => void;
  onBack: () => void;
}

export default function GameTypesScreen({
  completedStages,
  onSelect,
  onOpenSettings,
  onBack,
}: GameTypesScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <SettingsButton onPress={onOpenSettings} />
      <BackButton onPress={onBack} />
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
                selectionFeedback();
                onSelect(length);
              }}
            >
              <View style={styles.cardText}>
                <View style={styles.boxesRow}>
                  {letterBoxes.map((_, index) => (
                    <View key={index} style={styles.letterBox}>
                      <Text style={styles.letterBoxText}>{HEBREW_ALPHABET[index]}</Text>
                    </View>
                  ))}
                </View>
                <ProgressMeter percent={percent} width={100} />
              </View>
              <View style={styles.chevronWrapper}>
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={colors.accent}
                />
              </View>
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
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronWrapper: {
    position: 'absolute',
    left: 20,
    top: '50%',
    marginTop: -11,
  },
  cardText: {
    alignItems: 'center',
  },
  boxesRow: {
    flexDirection: 'row-reverse',
    gap: 4,
    marginBottom: 14,
  },
  letterBox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterBoxText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: colors.text,
  },
});
