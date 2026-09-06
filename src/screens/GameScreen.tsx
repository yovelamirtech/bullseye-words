import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scoreGuess, isWinningGuess, type GuessResult } from '../logic/game';
import { isValidWord, getStageTarget } from '../data/words';
import GuessRow from '../components/GuessRow';
import LetterBoxInput from '../components/LetterBoxInput';
import ReportModal from '../components/ReportModal';
import { errorHaptic, selectionHaptic, successHaptic, tapHaptic } from '../utils/haptics';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';
import {
  playClickSound,
  playCorrectSound,
  playGuessSound,
  playIncorrectSound,
  playLetterClickSound,
} from '../utils/sound';

interface GuessEntry {
  guess: string;
  result: GuessResult;
}

interface GameScreenProps {
  wordLength: number;
  stageIndex: number;
  totalStages: number;
  onCompleteStage: () => void;
  onBackToStages: () => void;
  onOpenSettings: () => void;
}

export default function GameScreen({
  wordLength,
  stageIndex,
  totalStages,
  onCompleteStage,
  onBackToStages,
  onOpenSettings,
}: GameScreenProps) {
  const [target, setTarget] = useState('');
  const [clue, setClue] = useState('');
  const [clueVisible, setClueVisible] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<GuessEntry[]>([]);
  const [won, setWon] = useState(false);
  const [error, setError] = useState('');
  // דיווח על מילה שגויה: המילה שנדחתה נטענת מראש לטופס
  const [reportVisible, setReportVisible] = useState(false);
  const [reportedWord, setReportedWord] = useState('');
  const inputRef = useRef<TextInput>(null);

  function openReport(word: string) {
    tapHaptic();
    setReportedWord(word);
    setReportVisible(true);
  }

  function startStage() {
    const round = getStageTarget(wordLength, stageIndex);
    setTarget(round?.word ?? '');
    setClue(round?.clue ?? '');
    setClueVisible(false);
    setHistory([]);
    setInput('');
    setWon(false);
    setError('');
  }

  useEffect(() => {
    startStage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordLength, stageIndex]);

  const canSubmit = useMemo(
    () => input.length === wordLength && !won && target.length > 0,
    [input, wordLength, won, target]
  );

  function handleSubmit() {
    if (!canSubmit) return;
    if (!isValidWord(input)) {
      errorHaptic();
      playIncorrectSound();
      setError('זו לא מילה תקנית בעברית');
      inputRef.current?.focus();
      return;
    }
    setError('');
    const result = scoreGuess(input, target);
    setHistory((prev) => [{ guess: input, result }, ...prev]);
    setInput('');
    if (isWinningGuess(input, target)) {
      successHaptic();
      playCorrectSound();
      setWon(true);
    } else {
      tapHaptic();
      playGuessSound();
    }
  }

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) =>
          b.result.bulls - a.result.bulls || b.result.hits - a.result.hits
      ),
    [history]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable
        style={styles.settingsButton}
        onPress={() => {
          tapHaptic();
          playClickSound();
          onOpenSettings();
        }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="settings-outline" size={20} color={colors.accent} />
      </Pressable>
      <Pressable
        style={styles.reportButton}
        onPress={() => openReport('')}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="דיווח על מילה שגויה"
      >
        <Ionicons name="flag-outline" size={18} color={colors.accent} />
      </Pressable>
      <View style={styles.flex}>
        <Text style={styles.title}>בול פגיעה</Text>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            שלב {stageIndex + 1} מתוך {totalStages} · {wordLength} אותיות
          </Text>
          <Pressable
            onPress={() => {
              tapHaptic();
              playClickSound();
              onBackToStages();
            }}
          >
            <Text style={styles.changeLink}>חזרה למסלול</Text>
          </Pressable>
        </View>
        {clue.length > 0 &&
          (clueVisible ? (
            <Text style={styles.clue}>רמז: {clue}</Text>
          ) : (
            <Pressable
              style={styles.hintButton}
              onPress={() => {
                tapHaptic();
                playClickSound();
                setClueVisible(true);
              }}
            >
              <Text style={styles.hintButtonText}>הצג רמז</Text>
            </Pressable>
          ))}

        {won ? (
          <View style={styles.winBox}>
            <Text style={styles.winText}>כל הכבוד! פגעת במילה: {target}</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                tapHaptic();
                playClickSound();
                onCompleteStage();
              }}
            >
              <Text style={styles.buttonText}>
                {stageIndex + 1 < totalStages ? 'לשלב הבא' : 'חזרה למסלול'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputArea}>
            <LetterBoxInput
              ref={inputRef}
              value={input}
              wordLength={wordLength}
              onChangeText={(text) => {
                if (text.length > input.length) {
                  selectionHaptic();
                  playLetterClickSound();
                }
                if (error && text.length > input.length) {
                  const typed = text.slice(input.length);
                  setInput(typed.slice(0, wordLength));
                } else {
                  setInput(text.slice(0, wordLength));
                }
                setError('');
              }}
              onSubmit={handleSubmit}
            />
            <Pressable
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={styles.buttonText}>הגש</Text>
            </Pressable>
          </View>
        )}

        {error.length > 0 && (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{error}</Text>
            <Pressable onPress={() => openReport(input)}>
              <Text style={styles.errorReportLink}>בטוחים שהמילה תקנית? דווחו לנו</Text>
            </Pressable>
          </View>
        )}

        <FlatList
          style={styles.flex}
          data={sortedHistory}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <GuessRow guess={item.guess} result={item.result} />
          )}
          ListEmptyComponent={
            <Text style={styles.hint}>הניחושים שלך יופיעו כאן</Text>
          }
        />
      </View>

      <ReportModal
        visible={reportVisible}
        title="דיווח על מילה שגויה"
        intro="ניסיתם מילה שאתם בטוחים שהיא תקנית, אבל המשחק לא זיהה אותה? ספרו לנו ונבדוק."
        fields={[
          {
            key: 'word',
            label: 'מה המילה?',
            placeholder: 'לדוגמה: שולחן',
            required: true,
            initialValue: reportedWord,
          },
          {
            key: 'meaning',
            label: 'מה הפירוש שלה?',
            placeholder: 'הסבר קצר על משמעות המילה',
            multiline: true,
          },
        ]}
        onClose={() => setReportVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: 58,
    left: 20,
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
  reportButton: {
    position: 'absolute',
    top: 58,
    left: 68,
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
  changeLink: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: colors.accent,
    textDecorationLine: 'underline',
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
});
