import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { maxContentWidth } from '../theme/layout';

interface ScreenContainerProps {
  children: ReactNode;
  /** עיצוב נוסף על ה-SafeAreaView החיצוני (למשל paddingTop, alignItems). */
  style?: StyleProp<ViewStyle>;
}

// עטיפת מסך משותפת: SafeAreaView עם רקע המשחק, כדי שכל מסך לא יגדיר את
// אותו style{flex:1, backgroundColor} בעצמו. כפתורי top-bar ממוקמים
// כילדים ישירים שלה (position: absolute יחסית לרוחב המסך המלא), ואילו
// התוכן הראשי עטוף ב-ScreenContent כדי לקבל את הגבלת הרוחב המרבי.
export default function ScreenContainer({ children, style }: ScreenContainerProps) {
  return <SafeAreaView style={[styles.safe, style]}>{children}</SafeAreaView>;
}

interface ScreenContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** עוטף את גוף המסך במרכוז ורוחב מרבי, למניעת שבירה במסכים רחבים (טאבלט/אייפד). */
export function ScreenContent({ children, style }: ScreenContentProps) {
  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
});
