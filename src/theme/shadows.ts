// צל "ויטרינה" יחיד ומכוון - מוחל רק על האלמנט המרכזי הפעיל (תא האות
// שמולאה בקלט), כדי לתת לו עומק בלי להפוך את שאר הכפתורים/הכרטיסים
// השטוחים לרועשים. אותה גישה (צל אחד לאלמנט הראשי, שאר הרכיבים שטוחים
// ונשענים על borderWidth) חוזרת ב"מעגל אותיות" עם ערכים משלה.
export const shadows = {
  showcase: {
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
} as const;
