import { StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface ProgressMeterProps {
  percent: number;
  width?: number;
}

// מד מינימליסטי: צבע מילוי קבוע אחד (לא משתנה לפי האחוז), לא בולט מדי,
// עם האחוז מוצג באמצע. משמש גם במסך בחירת האותיות וגם במסך השלבים.
export default function ProgressMeter({ percent, width = 120 }: ProgressMeterProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View style={[styles.track, { width }]}>
      <View style={[styles.fill, { width: `${clamped}%` }]} />
      <Text style={styles.text}>{clamped}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.accentBorder,
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: colors.textMuted,
  },
});
