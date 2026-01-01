import { motion } from "framer-motion";
import { Globe, Shield, Zap, ArrowRight } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

import { Image } from "../assets/image";

const LandingBody = () => {
  const isDark = useThemeStore((state) => state.isDarkMode);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();

  const theme = {
    bg: isDark ? "bg-slate-950" : "bg-slate-50",
    text: isDark ? "text-white" : "text-slate-900",
    textMuted: isDark ? "text-slate-400" : "text-slate-600",
    navBg: isDark
      ? "bg-slate-950/70 border-white/5"
      : "bg-white/70 border-slate-200",
    cardBg: isDark
      ? "bg-white/5 border-white/5 hover:bg-white/10"
      : "bg-white border-slate-200 shadow-sm hover:shadow-md",
    bubbleOther: isDark
      ? "bg-slate-800/80 border-white/10"
      : "bg-white/80 border-slate-200 shadow-lg",
    bubbleTextOther: isDark ? "text-white" : "text-slate-800",
    footer: isDark
      ? "bg-slate-950 border-white/5"
      : "bg-slate-100 border-slate-200",
    blobBlue: isDark ? "bg-blue-600/20" : "bg-blue-400/20",
    blobPurple: isDark ? "bg-purple-600/20" : "bg-purple-400/20",
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text} selection:bg-cyan-500 selection:text-white overflow-x-hidden`}
    >
      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div
          className={`absolute top-20 left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${theme.blobBlue}`}
        />
        <div
          className={`absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${theme.blobPurple}`}
        />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Connect Globally. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Chat Freely.
              </span>
            </h1>

            <p
              className={`text-lg lg:text-xl mb-8 leading-relaxed max-w-lg transition-colors ${theme.textMuted}`}
            >
              Break language barriers with real-time translation and connect
              with anyone, anywhere. Secure, fast, and beautifully designed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                onClick={() =>
                  isAuthenticated ? navigate("/") : navigate("/login")
                }
              >
                Start Chatting <ArrowRight size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 border rounded-xl font-bold transition-all ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                View Demo
              </motion.button>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex -space-x-3">
                {[Image.pic1, Image.pic2, Image.pic3, Image.pic4].map(
                  (img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`User ${i + 1}`}
                      className={`h-10 w-10 rounded-full object-cover ring-2 ${
                        isDark ? "ring-slate-950" : "ring-white"
                      }`}
                    />
                  )
                )}
              </div>

              <div className="flex flex-col justify-center">
                {/* Optional: Add stars for extra trust */}
                <div className="flex gap-0.5 text-yellow-500 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className={`text-sm ${theme.textMuted}`}>
                  Trusted by{" "}
                  <strong className={`${theme.textMuted}`}>
                    10,000+ users
                  </strong>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hero Visuals - Animated Bubbles */}
          <div className="relative h-[400px] w-full flex items-center justify-center">
            {/* Central Large Bubble */}
            <FloatingElement delay={0} className="z-20">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl rounded-bl-none shadow-2xl shadow-blue-900/50 max-w-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 z-0 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-1">HELLO</h3>
                  <p className="text-blue-100 text-sm">English • Just now</p>
                </div>
              </div>
            </FloatingElement>

            {/* Top Right Bubble */}
            <FloatingElement delay={1} className="absolute top-0 right-10 z-10">
              <div
                className={`backdrop-blur-md p-5 rounded-2xl rounded-br-none border transition-colors duration-300 ${theme.bubbleOther}`}
              >
                <h3 className="text-xl font-bold text-cyan-500">BONJOUR</h3>
                <p
                  className={`${
                    isDark ? "text-slate-400" : "text-slate-500"
                  } text-xs`}
                >
                  French • 2m ago
                </p>
              </div>
            </FloatingElement>

            {/* Bottom Left Bubble */}
            <FloatingElement
              delay={2}
              className="absolute bottom-10 left-10 z-30"
            >
              <div
                className={`backdrop-blur-md p-5 rounded-2xl rounded-tr-none border transition-colors duration-300 ${theme.bubbleOther}`}
              >
                <h3 className="text-xl font-bold text-purple-500">HOLA</h3>
                <p
                  className={`${
                    isDark ? "text-slate-400" : "text-slate-500"
                  } text-xs`}
                >
                  Spanish • 5m ago
                </p>
              </div>
            </FloatingElement>

            {/* Decorative Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border rounded-full z-0 transition-colors ${
                isDark ? "border-white/5" : "border-slate-200"
              }`}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-dashed rounded-full z-0 transition-colors ${
                isDark ? "border-white/10" : "border-slate-300"
              }`}
            />
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section
        className={`py-24 relative overflow-hidden transition-colors ${
          isDark ? "bg-slate-900/50" : "bg-slate-100/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why choose TalkifyX?
            </h2>
            <p className={theme.textMuted}>
              Everything you need to communicate without boundaries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe size={32} className="text-cyan-500" />}
              title="Instant Translation"
              description="Type in your language, they read in theirs. Supports 100+ languages with 99% accuracy."
              delay={0.1}
              theme={theme}
              isDark={isDark}
            />
            <FeatureCard
              icon={<Shield size={32} className="text-purple-500" />}
              title="End-to-End Encrypted"
              description="Your privacy is our priority. No one can read your messages, not even us."
              delay={0.2}
              theme={theme}
              isDark={isDark}
            />
            <FeatureCard
              icon={<Zap size={32} className="text-yellow-500" />}
              title="Lightning Fast"
              description="Optimized for speed. Messages are delivered in milliseconds, anywhere in the world."
              delay={0.3}
              theme={theme}
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
    </div>
  );
};

// --- Sub-components ---

const FloatingElement = ({ children, delay, className }) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description, delay, theme, isDark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay }}
      whileHover={{ y: -5 }}
      className={`p-8 rounded-2xl border transition-all group ${theme.cardBg}`}
    >
      <div
        className={`mb-6 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-3 ${theme.text}`}>{title}</h3>
      <p className={`leading-relaxed ${theme.textMuted}`}>{description}</p>
    </motion.div>
  );
};

export default LandingBody;
