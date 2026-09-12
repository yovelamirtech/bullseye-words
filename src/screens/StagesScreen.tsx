import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStageCount } from '../data/words';
import { selectionFeedback } from '../utils/pressFeedback';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';
import { maxContentWidth } from '../theme/layout';
import ProgressMeter from '../components/ProgressMeter';
import { BackButton, SettingsButton } from '../components/TopBar';
import ScreenContainer from '../components/ScreenContainer';

interface StagesScreenProps {
  wordLength: number;
  completedCount: number;
  onSelectStage: (stageIndex: number) => void;
  onBack: () => void;
  onOpenSettings: () => void;
}

export default function StagesScreen({
  wordLength,
  completedCount,
  onSelectStage,
  onBack,
  onOpenSettings,
}: StagesScreenProps) {
  const totalStages = getStageCount(wordLength);
  const stages = Array.from({ length: totalStages }, (_, i) => i);
  const progressPercent =
    totalStages > 0 ? Math.round((completedCount / totalStages) * 100) : 0;

  return (
    <ScreenContainer style={styles.safe}>
      <SettingsButton onPress={onOpenSettings} />
      <BackButton onPress={onBack} />
      <View style={styles.header}>
        <Text style={styles.title}>{wordLength} אותיות</Text>
        <View style={styles.meterWrapper}>
          <ProgressMeter percent={progressPercent} width={140} />
        </View>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={stages}
        keyExtractor={(i) => String(i)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: stageIndex }) => {
          const isCompleted = stageIndex < completedCount;
          const isCurrent = stageIndex === completedCount;
          const isLocked = stageIndex > completedCount;

          return (
            <Pressable
              disabled={isLocked}
              style={[
                styles.card,
                isCurrent && styles.cardCurrent,
                isLocked && styles.cardLocked,
              ]}
              onPress={() => {
                selectionFeedback();
                onSelectStage(stageIndex);
              }}
            >
              <View
                style={[
                  styles.badge,
                  isCompleted && styles.badgeCompleted,
                  isCurrent && styles.badgeCurrent,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={20} color={colors.textOnAccent} />
                ) : isLocked ? (
                  <Ionicons name="lock-closed" size={16} color={colors.textFaint} />
                ) : (
                  <Text style={styles.badgeText}>{stageIndex + 1}</Text>
                )}
              </View>
              <Text
                style={[styles.cardLabel, isLocked && styles.cardLabelLocked]}
              >
                שלב {stageIndex + 1}
              </Text>
            </Pressable>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingTop: 64,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
  },
  meterWrapper: {
    marginTop: 10,
  },
  list: {
    flex: 1,
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 14,
  },
  cardCurrent: {
    borderColor: colors.accent,
    borderWidth: 3,
  },
  cardLocked: {
    opacity: 0.6,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  badgeCurrent: {
    borderColor: colors.accent,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: colors.text,
  },
  cardLabel: {
    fontFamily: FONTS.medium,
    fontSize: 17,
    color: colors.text,
  },
  cardLabelLocked: {
    color: colors.textFaint,
  },
});
