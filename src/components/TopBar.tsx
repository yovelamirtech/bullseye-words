import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tapFeedback } from '../utils/pressFeedback';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface TopBarButtonProps {
  onPress: () => void;
}

// כל כפתורי החזרה וההגדרות (וכל כפתור אחר שצריך ליישר איתם, כמו כפתור
// הדיווח במסך המשחק) יושבים באותו גובה בדיוק, כדי שהמעבר בין מסכים לא
// "יקפיץ" את הכפתורים למקום אחר.
export const TOP_BAR_OFFSET = 58;

export function SettingsButton({ onPress }: TopBarButtonProps) {
  return (
    <Pressable
      style={[styles.button, styles.settingsButton]}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel="הגדרות"
    >
      <Ionicons name="settings-outline" size={20} color={colors.accent} />
    </Pressable>
  );
}

export function BackButton({ onPress }: TopBarButtonProps) {
  return (
    <Pressable
      style={[styles.button, styles.backButton]}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel="חזרה"
    >
      <Ionicons name="chevron-forward" size={22} color={colors.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: TOP_BAR_OFFSET,
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
  settingsButton: {
    left: 20,
  },
  backButton: {
    right: 20,
  },
});
