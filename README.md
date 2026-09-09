# בול פגיעה (Bullseye Words)

A Hebrew word-guessing mobile game, Mastermind-style: guess the target
word letter by letter and get **בול** (bullseye — right letter, right
position) / **פגיעה** (hit — right letter, wrong position) feedback after
each guess. Each level increases the target word length, starting at 2
letters.

## Stack

Built with **Expo (React Native + TypeScript)** — a single codebase for
iOS, Android, and web, fast local iteration via Expo Go, and a
straightforward Jest setup for testing pure game logic without a device
or simulator.

## Project layout

- `src/logic/game.ts` — scoring (bulls/hits) and win-check logic, fully
  unit tested. Final-form ("sofit") letters (ך ם ן ף ץ) are normalized
  to their regular form before comparing, so either form counts as a
  match.
- `src/logic/hebrew.ts` — the sofit-letter normalization helper.
- `src/data/wordBank.ts` — generated Hebrew word bank (~23k words),
  grouped by word length, covering lengths 2-10.
- `src/data/words.ts` — word-length helpers (`getWordsForLevel`,
  `getStageTarget`, `getStageCount`) plus `isValidWord`, which checks a
  guess against the dictionary (sofit-normalized) so only real words are
  accepted.
- `src/state/progress.ts` — persists the player's selected word length and
  completed-stage counts locally via
  `@react-native-async-storage/async-storage`.
- `src/screens/GameTypesScreen.tsx` — lets the player pick how many
  letters to play with.
- `src/screens/StagesScreen.tsx` — shows stage-by-stage progress for the
  chosen word length.
- `src/screens/GameScreen.tsx` — the main game screen: guess input
  (rejecting non-dictionary words with an inline error), guess history
  with bull/hit feedback, and stage completion.
- `src/components/GuessRow.tsx` — renders one past guess as a letter
  grid plus its score.

## Getting started

```bash
npm install
npm start        # opens Expo dev tools; press w/a/i for web/Android/iOS
```

## Testing

```bash
npm test
```

## Bug reports (Web3Forms)

The in-app report forms — "דיווח על באג" in Settings and "דיווח על מילה שגויה" in the
game — submit to [Web3Forms](https://web3forms.com), which forwards them to your inbox.

The Access Key ships as the default in `app.json` (`expo.extra.web3formsAccessKey`).
It's meant to be public — Web3Forms is designed for the key to live in client-side
code, and protects against abuse with its own rate limiting plus the honeypot field
already sent by `src/utils/web3forms.ts`. This works out of the box in Expo Go, EAS
builds, and the Vercel web export with no extra setup.

To use a different key (e.g. after rotating it), get a free Access Key at
https://web3forms.com and override the default without touching code:

- **Locally**: copy `.env.example` to `.env` and set `WEB3FORMS_ACCESS_KEY`, then
  restart the dev server.
- **EAS builds**: `eas env:set --name WEB3FORMS_ACCESS_KEY --value <key> --environment production`
- **Vercel web export**: set `WEB3FORMS_ACCESS_KEY` under Project Settings →
  Environment Variables.

`app.config.js` checks the env var first and falls back to the `app.json` default.

## Status / next steps

This is an MVP covering level 1 (2-letter words) end-to-end, with the
scoring engine and level progression generalized to any word length.
The word bank now covers real Hebrew dictionary words for lengths 2-10,
and guesses are validated against it. Remaining work: polish the
win/level-transition UI.

## App store readiness

- Display name in `app.json` is "בול-מילה"; the `slug`
  (`bullseye-words`) stays as-is since it's just the internal Expo
  project identifier, not user-facing.
- Privacy policy: [PRIVACY.md](./PRIVACY.md) (link to the GitHub-rendered
  page — `https://github.com/yovelamirtech/bullseye-words/blob/main/PRIVACY.md`
  — when filling out App Store Connect / Play Console privacy fields).
  It documents the real AdMob banner ad unit already wired in
  `app.json` / `src/ads/adUnitIds.ts`.
- `app.json` has real `ios.bundleIdentifier` / `android.package`
  (`com.yovelsys.bullseyewords`), starting build numbers, and an
  `ios.infoPlist.NSUserTrackingUsageDescription` string (required by
  Apple because the app links Google Mobile Ads / accesses IDFA).
- `src/ads/adsInit.ts` runs once on launch: it gathers GDPR consent via
  AdMob's `AdsConsent` API (required by Google for EEA/UK/Switzerland
  users regardless of where the publisher is based) and, on iOS, asks
  for App Tracking Transparency permission before the SDK initializes.
  Run `npx expo install expo-tracking-transparency` once to make sure
  the version pinned in `package.json` matches your installed Expo SDK
  exactly, then run a real build (not Expo Go) to see the consent/ATT
  prompts — they don't appear in Expo Go.
- `eas.json` defines `development`, `preview`, and `production` build
  profiles plus a `submit.production` target. Before the first build,
  run `eas init` (requires an Expo account) to link the project and
  populate `extra.eas.projectId` in `app.json`, and set the `owner`
  field if building under an Expo organization account.
- Still needed before submission: Apple Developer / Google Play Console
  accounts, store listing assets (screenshots, descriptions, content
  rating — declare "Advertising ID" / "Approximate location" data
  collection in both stores' data-safety questionnaires because of
  AdMob), and a device test pass.
