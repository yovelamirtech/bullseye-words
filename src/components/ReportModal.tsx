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
import AnimatedModal from './AnimatedModal';
import { successHaptic, tapHaptic } from '../utils/haptics';
import { playClickSound, playCorrectSound } from '../utils/sound';
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

interface ReportModalProps {
  visible: boolean;
  title: string;
  intro?: string;
  fields: ReportField[];
  successTitle?: string;
  successMessage?: string;
  onClose: () => void;
  onSubmit?: (values: Record<string, string>) => void;
}

function initialValues(fields: ReportField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, f.initialValue ?? '']));
}

// טופס דיווח כללי (באג / מילה שגויה). כרגע מוקאפ בלבד: הדיווח לא נשלח
// לשום שרת, אלא רק מוצג מסך תודה. ה-onSubmit נועד לחיבור עתידי לשרת.
export default function ReportModal({
  visible,
  title,
  intro,
  fields,
  successTitle = 'תודה! 🙏',
  successMessage = 'קיבלנו את הדיווח שלך ונבדוק אותו בהקדם.',
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [submitted, setSubmitted] = useState(false);

  // כל פתיחה מחדש של הטופס מתחילה מדף נקי (כולל ערכים שהוזנו מראש).
  useEffect(() => {
    if (visible) {
      setValues(initialValues(fields));
      setSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const canSubmit = fields.every((f) => !f.required || values[f.key]?.trim());

  function handleSubmit() {
    if (!canSubmit) return;
    successHaptic();
    playCorrectSound();
    onSubmit?.(values);
    setSubmitted(true);
  }

  function handleClose() {
    tapHaptic();
    playClickSound();
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

                <View style={styles.buttons}>
                  <Pressable
                    style={[
                      styles.button,
                      styles.submitButton,
                      !canSubmit && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                  >
                    <Text style={styles.submitText}>שליחה</Text>
                  </Pressable>
                  <Pressable style={[styles.button, styles.cancelButton]} onPress={handleClose}>
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
