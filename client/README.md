# 🔔 React Notification System with Audio

A lightweight, fully‑featured notification system for React apps, built from scratch during an extensive refactor. It supports toast‑style messages, sound effects, themes, action buttons, accessibility, queued playback, per‑position stacks, and more—all without external UI libraries.

---

## ✨ Key Features

| Feature                                  | Details                                                                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Modular Provider / Container pattern** | Drop‑in `<NotificationProvider>` and `<NotificationContainer>` components.                                                             |
| **Custom audio engine**                  | `AudioManager` class with queueing, caching, volume control, preload, overlap toggle and graceful fallback when audio is unsupported.  |
| **Multiple positions**                   | `top‑right`, `top‑left`, `bottom‑right`, `bottom‑left`, `top‑center`, `bottom‑center`; each position has its own stack and animations. |
| **Grouped duplicates**                   | Identical notifications merge into one and display `(xN)` with a scale‑fade counter badge.                                             |
| **Limited stack**                        | Configurable via `VITE_MAX_NOTIFICATIONS` (FIFO eviction of oldest).                                                                   |
| **Rich actions**                         | Optional buttons per toast (`label`, `onClick`, `variant`, `disabled`, `closeOnClick`).                                                |
| **Pause‑on‑hover & tab‑blur**            | Progress bar and auto‑close timers pause on hover or when the tab loses focus.                                                         |
| **Themes**                               | Global light/dark via `ThemeContext` + per‑toast `theme` prop.                                                                         |
| **Accessibility**                        | `role="alert"`, `aria‑live="polite"`, `tabIndex`, `Esc`/`Enter` shortcuts, visible focus outline.                                      |
| **Animations**                           | Slide‑in/out from edge based on position; exit animation before removal; counter badge scale‑fade.                                     |
| **Environment toggles**                  | `VITE_NOTIFICATIONS_SOUND` and `VITE_MAX_NOTIFICATIONS` for easy runtime control.                                                      |

---

## 📦 Installation

```bash
# with npm
npm install uuid
# or with pnpm / yarn / bun as you prefer
```

> **Note**
> This system has **zero external UI/run‑time dependencies**—only `uuid` helper.

---

## 🗂️ Project structure (suggested)

```
client/
├── public/
│   └── sounds/
│       ├── success-info.ogg
│       ├── error-warning.ogg
│       └── …
├── src/
│   ├── config/
│   │   └── soundConfig.js
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── components/
│   │   ├── NotificationContainer.jsx
│   │   └── NotificationItem.jsx
│   └── main.jsx
└── vite.config.js
```

---

## ⚙️ Sound Configuration (`src/config/soundConfig.js`)

```js
const soundConfig = {
  success: "/sounds/success.ogg",
  error:   "/sounds/error.ogg",
  warning: "/sounds/warning.ogg",
  info:    "/sounds/info.ogg",
  volume: 0.6,       // 0 – 1
  allowOverlap: false
};
export default soundConfig;
```

---

## 🚀 Quick Start

### 1 – Wrap your app

```jsx
import soundConfig from "./config/soundConfig";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider }        from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <NotificationProvider soundConfig={soundConfig}>
        <App />
        {/* One container handles every position */}
        <NotificationContainer />
      </NotificationProvider>
    </ThemeProvider>
  </BrowserRouter>
);
```

### 2 – Trigger a notification

```jsx
import { useNotification } from "./context/NotificationContext";

function SaveButton() {
  const showNotification = useNotification();

  const handleSave = async () => {
    try {
      await api.saveStuff();
      showNotification({
        type: "success",
        message: "Saved successfully",
        position: "top-right",
        autoClose: true,
      });
    } catch (err) {
      showNotification({
        type: "error",
        message: "Error saving",
        actions: [
          { label: "Retry",   onClick: handleSave, variant: "primary" },
          { label: "Cancel",     onClick: () => {},   variant: "secondary" }
        ],
      });
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

---

## 🔧 API Reference

### `showNotification(options)`

| Prop        | Type / Values                           | Default               | Description                       | 
| ----------- | --------------------------------------- | --------------------- | --------------------------------- |
| `type`      | "success", "error", "warning", "info"   | "info"                | Style + icon + sound selection.   |
| `message`   | `string \| ReactNode`                   | —                     | Notification body.                |   
| `duration`  | `number` (ms)                           | `5000`                | Lifetime before auto‑close.       |  
| `autoClose` | `boolean`                               | `true`                | Disable to require manual close.  | 
| `position`  | Position string (see *Features*)        | `"top-right"`         | Where to show.                    | 
| `theme`     | "light", "dark"                         | from `ThemeContext`   | Overrides global theme.           | 
| `actions`   | `Array<Action>`                         | `[]`                  | Render buttons below the message. |
| `playSound` | `boolean`                               | from `.env`           | Force / mute this toast.          |  

`Action` object:

```ts
{
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  closeOnClick?: boolean; // default true
}
```

---

## 🛡️ Environment Variables

| Variable                   | Example | Meaning                                         |
| -------------------------- | ------- | ----------------------------------------------- |
| `VITE_NOTIFICATIONS_SOUND` | `true`  | Master switch for audio (`false` silences all). |
| `VITE_MAX_NOTIFICATIONS`   | `5`     | Max toasts per session; oldest is evicted FIFO. |

---

## 📝 Accessibility

* `role="alert"` + `aria-live="polite"` for screen readers.
* `Esc` key closes focused toast.
* Toast container auto‑focuses; keyboard navigation supported (`Tab`, `Enter`).
* Visible `outline` on focus.

---

## 🔄 Roadmap / Ideas

* 🗎 Export as NPM package (`react-sound-toasts`).
* 🔄 Persist user volume in `localStorage`.
* 🔔 Custom sound themes.
* 🖥️ Storybook demo.

---

## 📄 License

MIT © 2025 **Cristian Gonzalez**  
GitHub: [CristianGonzalez24](https://github.com/CristianGonzalez24)
