import { useMemo, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { Onboarding } from "./components/Onboarding";
import { loadProfile, resetProfile, type UserProfile } from "./lib/storage";

const themeClassMap: Record<UserProfile["theme"], string> = {
  default: "theme-default",
  couple: "theme-couple",
  friends: "theme-friends",
  dream: "theme-dream",
};

const App = () => {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());

  const appThemeClass = useMemo(() => {
    return themeClassMap[profile.theme] ?? "theme-default";
  }, [profile.theme]);

  const handleReset = () => {
    setProfile(resetProfile());
  };

  if (!profile.onboarded) {
    return (
      <div className={`app-shell ${appThemeClass}`}>
        <Onboarding onDone={setProfile} />
      </div>
    );
  }

  return (
    <div className={`app-shell ${appThemeClass}`}>
      <AppHeader
        profile={profile}
        onUpdate={setProfile}
        onReset={handleReset}
      />

      <main className="content-wrap">
        <section className="journal-card">
          <h2>Your Journal Space</h2>
          <p>
            Welcome back, {profile.name || "Friend"}.
            {profile.mode === "couple" && profile.partnerName
              ? ` Writing with ${profile.partnerName}.`
              : " Start capturing today's moments."}
          </p>
        </section>
      </main>
    </div>
  );
};

export default App;
