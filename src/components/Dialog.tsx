import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface DialogProps {
  /** נקרא כשלוחצים על הרקע הכהה מסביב לכרטיס. */
  onDismiss: () => void;
  /** תוכן הכרטיס עצמו (כותרת, שדות, כפתורים - לפי כל מסך). */
  children: ReactNode;
  /** עיצוב נוסף/מחליף על הכרטיס עצמו (padding וכו'), ספציפי לכל מסך. */
  cardStyle?: StyleProp<ViewStyle>;
  /** מרים את הכרטיס מעל המקלדת (נחוץ כשיש שדות טקסט בתוך הדיאלוג). */
  avoidKeyboard?: boolean;
}

// מבנה הדיאלוג המשותף ל-SettingsScreen ול-ReportModal: רקע כהה שסגירה
// בלחיצה עליו, וכרטיס ממורכז עם רוחב מרבי קבוע. כל מסך מוסיף מעליו את
// התוכן הספציפי לו (כותרת+כפתור סגירה, שדות טופס וכו') כ-children.
export default function Dialog({ onDismiss, children, cardStyle, avoidKeyboard = false }: DialogProps) {
  const card = <View style={[styles.card, cardStyle]}>{children}</View>;

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.cardWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {card}
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.cardWrapper}>{card}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.xl,
  },
});
