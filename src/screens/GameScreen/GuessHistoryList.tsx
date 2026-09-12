import { FlatList, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GuessRow from '../../components/GuessRow';
import { colors } from '../../theme/colors';
import { tapHaptic } from '../../utils/haptics';
import type { GuessEntry } from './useGameRound';
import { styles } from './GameScreen.styles';

interface GuessHistoryListProps {
  history: GuessEntry[];
  sortedHistory: GuessEntry[];
  sortByScore: boolean;
  onToggleSort: () => void;
}

/** כפתור מיון ההיסטוריה + רשימת הניחושים עצמה (או הודעת ריק). */
export default function GuessHistoryList({
  history,
  sortedHistory,
  sortByScore,
  onToggleSort,
}: GuessHistoryListProps) {
  function handleToggleSort() {
    tapHaptic();
    onToggleSort();
  }

  return (
    <>
      {history.length > 0 && (
        <Pressable
          style={styles.sortButton}
          onPress={handleToggleSort}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={sortByScore ? 'trophy-outline' : 'time-outline'}
            size={14}
            color={colors.accent}
          />
          <Text style={styles.sortButtonText}>
            {sortByScore ? 'מיון: הכי הרבה בול' : 'מיון: אחרון'}
          </Text>
        </Pressable>
      )}

      <FlatList
        style={styles.flex}
        data={sortedHistory}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => <GuessRow guess={item.guess} result={item.result} />}
        ListEmptyComponent={<Text style={styles.hint}>הניחושים שלך יופיעו כאן</Text>}
      />
    </>
  );
}
