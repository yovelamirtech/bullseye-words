import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStageCount } from '../data/words';
import { selectionHaptic, tapHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/sound';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface StagesScreenProps {
  wordLength: number;
  completedCount: number;
  onSelectStage: (stageIndex: number) => void;
  onBack: () => void;
}

export default function StagesScreen({
  wordLength,
  completedCount,
  onSelectStage,
  onBack,
}: StagesScreenProps) {
  const totalStages = getStageCount(wordLength);
  const stages = Array.from({ length: totalStages }, (_, i) => i);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            tapHaptic();
            playClickSound();
            onBack();
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.accent} />
        </Pressable>
        <Text style={styles.title}>{wordLength} אותיות</Text>
        <Text style={styles.subtitle}>
          {completedCount > 0
            ? `הושלמו ${completedCount} מתוך ${totalStages} שלבים`
            : `${totalStages} שלבים לפניך`}
        </Text>
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
                selectionHaptic();
                playClickSound();
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: radii.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  list: {
    flex: 1,
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
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 14,
  },
  cardCurrent: {
    borderColor: colors.accent,
    backgroundColor: colors.card,
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
