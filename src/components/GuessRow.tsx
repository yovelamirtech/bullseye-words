import { StyleSheet, Text, View } from 'react-native';
import type { GuessResult } from '../logic/game';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface GuessRowProps {
  guess: string;
  result: GuessResult;
}

export default function GuessRow({ guess, result }: GuessRowProps) {
  const letters = guess.split('');

  return (
    <View style={styles.row}>
      <View style={styles.letters}>
        {letters.map((letter, index) => (
          <View key={index} style={styles.cell}>
            <Text style={styles.cellText}>{letter}</Text>
          </View>
        ))}
      </View>
      <View style={styles.score}>
        <Text style={styles.bulls}>בול {result.bulls}</Text>
        <Text style={styles.hits}>פגיעה {result.hits}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  letters: {
    flexDirection: 'row-reverse',
  },
  cell: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  cellText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: colors.text,
  },
  score: {
    flexDirection: 'row-reverse',
    minWidth: 120,
  },
  bulls: {
    fontFamily: FONTS.bold,
    marginHorizontal: 4,
    color: colors.success,
  },
  hits: {
    fontFamily: FONTS.bold,
    marginHorizontal: 4,
    color: colors.warning,
  },
});
