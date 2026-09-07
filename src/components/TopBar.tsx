import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tapHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/sound';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface TopBarButtonProps {
  onPress: () => void;
}

// כל כפתורי החזרה וההגדרות בכל המסכים יושבים באותו גובה בדיוק (top: 58),
// כדי שהמעבר בין מסכים לא "יקפיץ" את הכפתורים למקום אחר.
export function SettingsButton({ onPress }: TopBarButtonProps) {
  return (
    <Pressable
      style={[styles.button, styles.settingsButton]}
      onPress={() => {
        tapHaptic();
        playClickSound();
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
        tapHaptic();
        playClickSound();
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
    top: 58,
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
