import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Calendar from "./components/Calendar";
import Timeline from "./components/Timeline";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDiaryModeOpen, setIsDiaryModeOpen] = useState(false);

  const [activeView, setActiveView] = useState<"timeline" | "calendar">(
    "calendar",
  );

  return (
    <main className="h-screen overflow-hidden bg-[#efeae2] text-[#4d4338]">
      <div className="mx-auto flex h-full overflow-hidden rounded-sm border border-[#ddd3c7] bg-[#f4efe7]">
        {isMobileSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 z-20 bg-[#2b251f]/30 lg:hidden"
            aria-label="Close sidebar overlay"
          />
        )}

        {!isDiaryModeOpen && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onNavigate={setActiveView}
            isMobileOpen={isMobileSidebarOpen}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            activeView={activeView}
          />
        )}

        {activeView === "calendar" ? (
          <Calendar onDiaryModeChange={setIsDiaryModeOpen} />
        ) : (
          <Timeline />
        )}
      </div>
    </main>
  );
};

export default App;
