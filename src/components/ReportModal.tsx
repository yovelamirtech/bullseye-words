import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedModal from './AnimatedModal';
import { playClickSound } from '../utils/sound';
import { successFeedback, tapFeedback } from '../utils/pressFeedback';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

export interface ReportField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  initialValue?: string;
}

interface ReportSubmitResult {
  success: boolean;
  /** הודעת שגיאה בעברית שתוצג למשתמש אם השליחה נכשלה */
  message?: string;
}

interface ReportModalProps {
  visible: boolean;
  title: string;
  intro?: string;
  fields: ReportField[];
  successTitle?: string;
  successMessage?: string;
  onClose: () => void;
  onSubmit?: (values: Record<string, string>) => Promise<ReportSubmitResult> | void;
}

function initialValues(fields: ReportField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, f.initialValue ?? '']));
}

// טופס דיווח כללי (באג / מילה שגויה). ה-onSubmit יכול להחזיר Promise עם
// תוצאת השליחה בפועל (למשל ל-Web3Forms); הטופס מציג "שולח..." בזמן
// ההמתנה, ומעבר למסך תודה רק אם ההחזרה מציינת הצלחה.
export default function ReportModal({
  visible,
  title,
  intro,
  fields,
  successTitle = 'תודה!',
  successMessage = 'קיבלנו את הדיווח שלך ונבדוק אותו בהקדם.',
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // כל פתיחה מחדש של הטופס מתחילה מדף נקי (כולל ערכים שהוזנו מראש).
  useEffect(() => {
    if (visible) {
      setValues(initialValues(fields));
      setSubmitted(false);
      setSending(false);
      setErrorMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const canSubmit = fields.every((f) => !f.required || values[f.key]?.trim());

  async function handleSubmit() {
    if (!canSubmit || sending) return;
    playClickSound();
    setSending(true);
    setErrorMessage(null);

    const result = await onSubmit?.(values);

    setSending(false);
    if (result && !result.success) {
      setErrorMessage(result.message ?? 'השליחה נכשלה. נסו שוב.');
      return;
    }

    successFeedback();
    setSubmitted(true);
  }

  function handleClose() {
    tapFeedback();
    onClose();
  }

  return (
    <AnimatedModal visible={visible} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <KeyboardAvoidingView
          style={styles.cardWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.card}>
            {submitted ? (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={40}
                  color={colors.accent}
                  style={styles.successIcon}
                />
                <Text style={styles.title}>{successTitle}</Text>
                <Text style={styles.message}>{successMessage}</Text>
                <Pressable
                  style={[styles.button, styles.submitButton, styles.singleButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.submitText}>סגירה</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.title}>{title}</Text>
                {intro ? <Text style={styles.message}>{intro}</Text> : null}

                {fields.map((field) => (
                  <View key={field.key}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <TextInput
                      style={[styles.input, field.multiline && styles.inputMultiline]}
                      value={values[field.key] ?? ''}
                      onChangeText={(text) =>
                        setValues((prev) => ({ ...prev, [field.key]: text }))
                      }
                      placeholder={field.placeholder}
                      placeholderTextColor={colors.placeholder}
                      multiline={field.multiline}
                    />
                  </View>
                ))}

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <View style={styles.buttons}>
                  <Pressable
                    style={[
                      styles.button,
                      styles.submitButton,
                      (!canSubmit || sending) && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!canSubmit || sending}
                  >
                    <Text style={styles.submitText}>{sending ? 'שולח...' : 'שליחה'}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleClose}
                    disabled={sending}
                  >
                    <Text style={styles.cancelText}>ביטול</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </AnimatedModal>
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
    padding: 20,
  },
  successIcon: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
    writingDirection: 'rtl',
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    marginTop: 14,
    writingDirection: 'rtl',
  },
  fieldLabel: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    fontFamily: FONTS.regular,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  buttons: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  singleButton: {
    flex: 0,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: colors.accent,
  },
  buttonDisabled: {
    backgroundColor: colors.cardDisabled,
  },
  submitText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: colors.textOnAccent,
    writingDirection: 'rtl',
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  cancelText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: colors.accent,
    writingDirection: 'rtl',
  },
});
