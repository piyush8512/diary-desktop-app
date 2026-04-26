import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles, Users, BookHeart } from "lucide-react";
import {
  saveProfile,
  type Mode,
  type Theme,
  type UserProfile,
} from "../lib/storage";

interface Props {
  onDone: (profile: UserProfile) => void;
}

const modes: { id: Mode; icon: typeof Heart; title: string; desc: string }[] = [
  {
    id: "solo",
    icon: BookHeart,
    title: "Just Me",
    desc: "A private little world",
  },
  {
    id: "couple",
    icon: Heart,
    title: "Couple",
    desc: "Share with your partner",
  },
  {
    id: "friends",
    icon: Users,
    title: "Friends",
    desc: "Collab with your crew",
  },
];

const themes: { id: Theme; label: string; swatch: string }[] = [
  {
    id: "default",
    label: "Peachy",
    swatch: "linear-gradient(135deg, #ffd5e5, #ffe8d6)",
  },
  {
    id: "couple",
    label: "Rose",
    swatch: "linear-gradient(135deg, #ff9bb3, #ffd0a8)",
  },
  {
    id: "friends",
    label: "Minty",
    swatch: "linear-gradient(135deg, #9be3c4, #fff3a8)",
  },
  {
    id: "dream",
    label: "Dreamy",
    swatch: "linear-gradient(135deg, #c9a9f0, #a8d5f0)",
  },
];

export const Onboarding = ({ onDone }: Props) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [mode, setMode] = useState<Mode>("solo");
  const [theme, setTheme] = useState<Theme>("default");

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => Math.max(0, prev - 1));

  const finish = () => {
    const profile: UserProfile = {
      name: name.trim() || "Friend",
      partnerName: partnerName.trim(),
      mode,
      theme,
      onboarded: true,
    };

    saveProfile(profile);
    onDone(profile);
  };

  return (
    <div className="onboarding-shell">
      <div className="onboarding-bg" aria-hidden>
        <div className="float-item float-a">🌸</div>
        <div className="float-item float-b">✨</div>
        <div className="float-item float-c">🍃</div>
        <div className="float-item float-d">💌</div>
      </div>

      <div className="onboarding-card-wrap">
        <div className="progress-dots">
          {[0, 1, 2, 3].map((item) => (
            <motion.div
              key={item}
              className="progress-dot"
              animate={{
                width: item === step ? 28 : 8,
                opacity: item <= step ? 1 : 0.3,
              }}
              transition={{ duration: 0.35 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section
              key="welcome"
              className="onboarding-card centered"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className="emoji-badge"
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
              >
                📖
              </motion.div>
              <h1>Pocket Pages</h1>
              <p className="subtitle">your tiny corner of the internet</p>
              <button type="button" className="btn btn-primary" onClick={next}>
                Begin <Sparkles size={16} />
              </button>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section
              key="name"
              className="onboarding-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <div className="emoji-center">👋</div>
              <h2>What should we call you?</h2>
              <p className="muted">A name to sign your pages</p>
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name..."
                className="text-input"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && name.trim()) {
                    next();
                  }
                }}
              />
              <div className="actions-row">
                <button type="button" className="btn" onClick={back}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={next}
                  disabled={!name.trim()}
                >
                  Next
                </button>
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="mode"
              className="onboarding-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <h2>Who are these pages for?</h2>
              <p className="muted">You can change this anytime</p>
              <div className="mode-grid">
                {modes.map((item) => {
                  const Icon = item.icon;
                  const active = mode === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setMode(item.id)}
                      className={`mode-item ${active ? "mode-item-active" : ""}`}
                    >
                      <span className="mode-icon">
                        <Icon size={20} />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.desc}</small>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {mode === "couple" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <input
                    value={partnerName}
                    onChange={(event) => setPartnerName(event.target.value)}
                    placeholder="Your partner's name (optional)"
                    className="text-input"
                  />
                </motion.div>
              )}

              <div className="actions-row">
                <button type="button" className="btn" onClick={back}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={next}
                >
                  Next
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="theme"
              className="onboarding-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <h2>Pick your vibe</h2>
              <p className="muted">Set the mood for your pages</p>
              <div className="theme-grid">
                {themes.map((item) => {
                  const active = theme === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTheme(item.id)}
                      className={`theme-item ${active ? "theme-item-active" : ""}`}
                      style={{ background: item.swatch }}
                    >
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="actions-row">
                <button type="button" className="btn" onClick={back}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={finish}
                >
                  Open my book
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
