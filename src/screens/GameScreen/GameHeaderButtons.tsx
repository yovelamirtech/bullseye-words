import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton, SettingsButton } from '../../components/TopBar';
import { colors } from '../../theme/colors';
import { styles } from './GameScreen.styles';

interface GameHeaderButtonsProps {
  onOpenSettings: () => void;
  onBackToStages: () => void;
  onOpenReport: () => void;
}

/** שורת הכפתורים הצפה מעל מסך המשחק: הגדרות, חזרה, ודיווח על מילה שגויה. */
export default function GameHeaderButtons({
  onOpenSettings,
  onBackToStages,
  onOpenReport,
}: GameHeaderButtonsProps) {
  return (
    <>
      <SettingsButton onPress={onOpenSettings} />
      <BackButton onPress={onBackToStages} />
      <Pressable
        style={styles.reportButton}
        onPress={onOpenReport}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="דיווח על מילה שגויה"
      >
        <Ionicons name="flag-outline" size={18} color={colors.accent} />
      </Pressable>
    </>
  );
}
