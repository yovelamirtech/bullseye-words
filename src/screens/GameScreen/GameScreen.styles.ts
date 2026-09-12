import { StyleSheet } from 'react-native';
import { FONTS } from '../../utils/fonts';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { maxContentWidth } from '../../theme/layout';
import { topBarButtonStyle } from '../../components/TopBar';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  reportButton: {
    ...topBarButtonStyle,
    left: 68,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginTop: 24,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    color: colors.textMuted,
  },
  newRandomButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  newRandomButtonText: {
    fontFamily: FONTS.medium,
    color: colors.accent,
    fontSize: 13,
  },
  clue: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  hintButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 8,
  },
  hintButtonText: {
    fontFamily: FONTS.medium,
    color: colors.accent,
    fontSize: 14,
  },
  inputArea: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.cardDisabled,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    color: colors.textOnAccent,
    fontSize: 16,
  },
  winBox: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  winText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: colors.success,
    marginBottom: 8,
    textAlign: 'center',
  },
  hint: {
    fontFamily: FONTS.regular,
    textAlign: 'center',
    color: colors.textFaint,
    marginTop: 24,
  },
  errorBox: {
    alignItems: 'center',
    marginBottom: 8,
  },
  error: {
    fontFamily: FONTS.regular,
    textAlign: 'center',
    color: colors.error,
  },
  errorReportLink: {
    fontFamily: FONTS.regular,
    marginTop: 4,
    fontSize: 13,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  sortButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.lg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  sortButtonText: {
    fontFamily: FONTS.medium,
    color: colors.accent,
    fontSize: 12,
  },
});
