import { useMemo, useRef, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer, { ScreenContent } from '../../components/ScreenContainer';
import LetterBoxInput from '../../components/LetterBoxInput';
import ReportModal from '../../components/ReportModal';
import { isValidWord } from '../../data/words';
import { submitToWeb3Forms } from '../../utils/web3forms';
import { errorFeedback, letterFeedback, selectionFeedback, successFeedback, tapFeedback } from '../../utils/pressFeedback';
import { playGuessSound } from '../../utils/sound';
import { tapHaptic } from '../../utils/haptics';
import { colors } from '../../theme/colors';
import { useGameRound } from './useGameRound';
import { computeNextInput } from './computeNextInput';
import { getNextButtonLabel } from './getNextButtonLabel';
import GameHeaderButtons from './GameHeaderButtons';
import GuessHistoryList from './GuessHistoryList';
import { styles } from './GameScreen.styles';

interface GameScreenProps {
  wordLength: number;
  stageIndex: number;
  totalStages: number;
  isRandomMode?: boolean;
  randomTarget?: { word: string; clue: string } | null;
  onNewRandomStage?: () => void;
  onCompleteStage: () => void;
  onBackToStages: () => void;
  onOpenSettings: () => void;
}

export default function GameScreen({
  wordLength,
  stageIndex,
  totalStages,
  isRandomMode = false,
  randomTarget = null,
  onNewRandomStage,
  onCompleteStage,
  onBackToStages,
  onOpenSettings,
}: GameScreenProps) {
  // App.tsx מרנדר מחדש GameScreen עם key שונה בכל שלב חדש, כך שה-hook
  // הבא נגזר ישירות מה-props בכל רינדור ואין הבזק של הסיבוב הקודם.
  const { target, clue, history, sortedHistory, sortByScore, setSortByScore, won, submitGuess } =
    useGameRound({ wordLength, stageIndex, isRandomMode, randomTarget });

  const [clueVisible, setClueVisible] = useState(false);
  const [input, setInput] = useState('');
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

  function confirmNewRandomStage() {
    tapFeedback();
    Alert.alert(
      'שלב חדש',
      'לעבור לשלב אקראי חדש? ההתקדמות בשלב הנוכחי לא תישמר.',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'קדימה',
          onPress: () => {
            selectionFeedback();
            onNewRandomStage?.();
          },
        },
      ]
    );
  }

  const canSubmit = useMemo(
    () => input.length === wordLength && !won && target.length > 0,
    [input, wordLength, won, target]
  );

  function handleSubmit() {
    if (!canSubmit) return;
    if (!isValidWord(input)) {
      errorFeedback();
      setError('זו לא מילה תקנית בעברית');
      inputRef.current?.focus();
      return;
    }
    setError('');
    const { won: didWin } = submitGuess(input);
    setInput('');
    if (didWin) {
      successFeedback();
    } else {
      tapHaptic();
      playGuessSound();
    }
  }

  function handleChangeText(text: string) {
    const isGrowing = text.length > input.length;
    if (isGrowing) letterFeedback();
    setInput(computeNextInput(text, input, wordLength, Boolean(error)));
    setError('');
  }

  return (
    <ScreenContainer>
      <GameHeaderButtons
        onOpenSettings={onOpenSettings}
        onBackToStages={onBackToStages}
        onOpenReport={() => openReport('')}
      />
      <ScreenContent style={styles.flex}>
        <Text style={styles.title}>בול פגיעה</Text>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {isRandomMode
              ? `שלב אקראי · ${wordLength} אותיות`
              : `שלב ${stageIndex + 1} מתוך ${totalStages} · ${wordLength} אותיות`}
          </Text>
          {isRandomMode && (
            <Pressable style={styles.newRandomButton} onPress={confirmNewRandomStage}>
              <Ionicons name="shuffle-outline" size={15} color={colors.accent} />
              <Text style={styles.newRandomButtonText}>שלב חדש</Text>
            </Pressable>
          )}
        </View>
        {clue.length > 0 &&
          (clueVisible ? (
            <Text style={styles.clue}>רמז: {clue}</Text>
          ) : (
            <Pressable
              style={styles.hintButton}
              onPress={() => {
                tapFeedback();
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
                tapFeedback();
                onCompleteStage();
              }}
            >
              <Text style={styles.buttonText}>
                {getNextButtonLabel(isRandomMode, stageIndex, totalStages)}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputArea}>
            <LetterBoxInput
              ref={inputRef}
              value={input}
              wordLength={wordLength}
              onChangeText={handleChangeText}
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

        <GuessHistoryList
          history={history}
          sortedHistory={sortedHistory}
          sortByScore={sortByScore}
          onToggleSort={() => setSortByScore((prev) => !prev)}
        />
      </ScreenContent>

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
        onSubmit={(values) =>
          submitToWeb3Forms(`דיווח על מילה שגויה: ${values.word}`, 'בול-מילה - מילה', {
            המילה: values.word,
            הפירוש: values.meaning.trim() || 'לא צורף פירוש',
            'אורך המילה': String(wordLength),
            שלב: String(stageIndex + 1),
          })
        }
      />
    </ScreenContainer>
  );
}
