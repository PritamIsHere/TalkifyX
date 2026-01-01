import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import toast from "react-hot-toast";

export const LoginForm = ({ theme, onClose }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { login, loading, error } = useAuthStore();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login({
        username: formData.username,
        password: formData.password,
      });
      if (success) {
        onClose();
      }
      toast.success("Login Successfully !!");
    } catch (error) {}
  };

  return (
    <motion.form
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
    >
      {error && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm border ${theme.errorBg}`}
        >
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <InputField
        name="username"
        type="text"
        placeholder="Username"
        icon={<User size={20} />}
        theme={theme}
        value={formData.username}
        onChange={handleChange}
      />
      <InputField
        name="password"
        type="password"
        placeholder="Password"
        icon={<Lock size={20} />}
        theme={theme}
        value={formData.password}
        onChange={handleChange}
      />

      <div className="flex justify-end mb-6">
        <button type="button" className="text-xs text-cyan-500 hover:underline">
          Forgot Password?
        </button>
      </div>

      <SubmitButton loading={loading} text="Log In" />
    </motion.form>
  );
};

const SubmitButton = ({ loading, text }) => (
  <button
    disabled={loading}
    type="submit"
    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        <Loader2 size={20} className="animate-spin" /> Processing...
      </>
    ) : (
      <>
        {text} <ArrowRight size={20} />
      </>
    )}
  </button>
);

const InputField = ({
  name,
  type,
  placeholder,
  icon,
  theme,
  value,
  onChange,
}) => (
  <div className="relative mb-4 group">
    <div
      className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.inputIcon} group-focus-within:text-cyan-500 transition-colors`}
    >
      {icon}
    </div>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className={`w-full py-4 pl-12 pr-4 rounded-xl border outline-none transition-all placeholder:text-slate-500/50 ${theme.inputBg} ${theme.text}`}
    />
  </div>
);
