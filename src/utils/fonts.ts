import { useFonts } from 'expo-font';
import { SecularOne_400Regular } from '@expo-google-fonts/secular-one';
import { Heebo_400Regular, Heebo_500Medium, Heebo_700Bold } from '@expo-google-fonts/heebo';

// אותו זוג פונטים כמו במשחק האחות (מעגל אותיות): Secular One לתצוגה
// (כותרת המשחק), Heebo לטקסט - כדי ששני המשחקים יישארו מזוהים כאותה
// "משפחה" ויזואלית גם אם כל אחד בונה עליה עולם צבעים משלו.
export const FONTS = {
  display: 'SecularOne_400Regular',
  regular: 'Heebo_400Regular',
  medium: 'Heebo_500Medium',
  bold: 'Heebo_700Bold',
} as const;

export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    SecularOne_400Regular,
    Heebo_400Regular,
    Heebo_500Medium,
    Heebo_700Bold,
  });

  // אם טעינת הפונטים נכשלה אין טעם לתקוע את האפליקציה על מסך המתנה -
  // עדיף להמשיך עם פונט ברירת המחדל של המערכת.
  return loaded || error !== null;
}
