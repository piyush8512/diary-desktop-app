import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Heart, Users, BookHeart } from "lucide-react";
import {
  saveProfile,
  type Mode,
  type Theme,
  type UserProfile,
} from "../lib/storage";

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onReset: () => void;
}

const modeIcon = {
  solo: BookHeart,
  couple: Heart,
  friends: Users,
} as const;

const modeLabel = {
  solo: "Just Me",
  couple: "Couple",
  friends: "Friends",
} as const;

export const AppHeader = ({ profile, onUpdate, onReset }: Props) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const Icon = modeIcon[profile.mode];

  useEffect(() => {
    const onWindowClick = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, []);

  const setMode = (mode: Mode) => {
    const updated = { ...profile, mode };
    saveProfile(updated);
    onUpdate(updated);
    setOpen(false);
  };

  const setTheme = (theme: Theme) => {
    const updated = { ...profile, theme };
    saveProfile(updated);
    onUpdate(updated);
    setOpen(false);
  };

  return (
    <header className="app-header">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="brand-wrap"
      >
        <div className="brand-icon">📖</div>
        <div>
          <div className="brand-title">Pocket Pages</div>
          <div className="brand-meta">
            <Icon size={14} /> {modeLabel[profile.mode]} · hi{" "}
            {profile.name || "friend"}
          </div>
        </div>
      </motion.div>

      <div className="menu-wrap" ref={menuRef}>
        <button
          type="button"
          className="settings-btn"
          aria-label="Open settings"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Settings size={16} />
        </button>

        {open && (
          <div className="menu-panel" role="menu">
            <div className="menu-label">Mode</div>
            <button
              type="button"
              className="menu-item"
              onClick={() => setMode("solo")}
            >
              Just Me
            </button>
            <button
              type="button"
              className="menu-item"
              onClick={() => setMode("couple")}
            >
              Couple
            </button>
            <button
              type="button"
              className="menu-item"
              onClick={() => setMode("friends")}
            >
              Friends
            </button>
            <div className="menu-sep" />
            <div className="menu-label">Theme</div>
            <button
              type="button"
              className="menu-item"
              onClick={() => setTheme("default")}
            >
              Peachy
            </button>
            <button
              type="button"
              className="menu-item"
              onClick={() => setTheme("couple")}
            >
              Rose
            </button>
            <button
              type="button"
              className="menu-item"
              onClick={() => setTheme("friends")}
            >
              Minty
            </button>
            <button
              type="button"
              className="menu-item"
              onClick={() => setTheme("dream")}
            >
              Dreamy
            </button>
            <div className="menu-sep" />
            <button
              type="button"
              className="menu-item danger"
              onClick={() => {
                setOpen(false);
                onReset();
              }}
            >
              Restart onboarding
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
