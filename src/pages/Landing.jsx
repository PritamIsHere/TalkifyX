import { useThemeStore } from "../stores/useThemeStore";
import useAuthStore from "../stores/useAuthStore";
import { useTheme } from "../theme/Theme";
import { AnimatedBubbles } from "../components/Landing/AnimatedBubbles";
import { FeaturesGrid } from "../components/Landing/FeaturesGrid";
import { HeroContent } from "../components/Landing/HeroContent";

const Landing = () => {
  const isDark = useThemeStore((state) => state.isDarkMode);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const theme = useTheme();

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text} selection:bg-cyan-500 selection:text-white overflow-x-hidden`}
    >
      
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div
          className={`absolute top-20 left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${theme.blobBlue}`}
        />
        <div
          className={`absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${theme.blobPurple}`}
        />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <HeroContent
            isDark={isDark}
            isAuthenticated={isAuthenticated}
            theme={theme}
          />

          <AnimatedBubbles isDark={isDark} theme={theme} />
        </div>
      </section>

      
      <FeaturesGrid isDark={isDark} theme={theme} />
    </div>
  );
};

export default Landing;
