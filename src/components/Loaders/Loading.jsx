import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { useTheme } from "../../theme/Theme";

const Loading = () => {
  const theme = useTheme();

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-300 ${theme.bg}`}
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mb-8"
      >
        {/* Pulsing Background Circle */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-cyan-500 rounded-full blur-xl"
        />

        {/* Main Icon */}
        <div
          className={`relative z-10 p-4 rounded-2xl shadow-xl border ${theme.sidebarBg} ${theme.divider}`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          ></motion.div>

          {/* Centered Static Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-cyan-500">
            <MessageSquare
              size={20}
              fill="currentColor"
              className="opacity-80"
            />
          </div>
        </div>
      </motion.div>

      {/* Branding Text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className={`text-2xl font-bold tracking-tight ${theme.text}`}>
          TalkifyX
        </h1>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-1 h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: ["0%", "-50%", "0%"],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;
