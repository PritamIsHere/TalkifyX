import React, { useEffect, useState, useRef } from "react";
import {
  Copy,
  Pencil,
  ArrowLeft,
  Camera,
  Share2,
  User,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Standard for React navigation
import useAuthStore from "../stores/useAuthStore";
import { useTheme } from "../theme/Theme";
import { Image } from "../assets/image";
import { api } from "../api/api";

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loadUser = useAuthStore((state) => state.loadUser);

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false); // For copy animation

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const theme = useTheme();

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        if (user) {
          if (mounted) setProfile(user);
        } else {
          setLoading(true);
          await loadUser();
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [user, loadUser]);

  // 2. Animation on Copy
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(profile.userCode || profile._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Connect with me",
          text: `My Unique ID is: ${profile.userCode}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      copyId();
    }
  };

  // Avatar upload handlers
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Upload
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await api.put("/user/update_profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setUploadSuccess(true);
        // Update local profile and global user
        if (res.data.user) {
          setProfile(res.data.user);
          // Refresh auth store
          try {
            await loadUser();
          } catch (err) {
            // ignore
          }
        } else {
          // fallback to reloading user
          await loadUser();
        }

        setTimeout(() => setUploadSuccess(false), 1800);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      e.target.value = null; // reset input so same file can be re-picked
    }
  };

  // Cleanup preview URL on unmount / change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (loading || !profile)
    return (
      <div
        className={`h-full w-full flex items-center justify-center ${theme.mainBg} ${theme.text}`}
      >
        <div className="animate-pulse">Loading...</div>
      </div>
    );

  return (
    <div className={`flex h-screen w-full overflow-hidden ${theme.mainBg}`}>
      {/* LEFT SIDE: Profile Section */}
      <div
        className={`flex flex-col h-full w-full md:w-[400px] lg:w-[450px] ${theme.sidebarBg} border-r ${theme.divider} flex-shrink-0 z-10`}
      >
        {/* 3. Back Button Functionality */}
        <div
          className={`flex items-end px-5 pb-4 h-[108px] ${theme.footer} flex-shrink-0 shadow-sm`}
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)} // Goes back to the previous page
              className={`${theme.text} p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all`}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className={`text-lg font-medium ${theme.text}`}>Profile</h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 1. Smaller Profile Photo */}
          <div className="flex justify-center py-8">
            <div
              className="relative group w-40 h-40 rounded-full overflow-hidden shadow-md"
              onClick={handleAvatarClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleAvatarClick();
              }}
            >
              <img
                src={preview || profile.avatar || Image.defaultUser}
                alt={profile.username}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-center p-4">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="text-[11px]">Uploading...</span>
                  </div>
                ) : uploadSuccess ? (
                  <div className="flex flex-col items-center gap-2">
                    <Check size={20} className="text-green-400" />
                    <span className="text-[11px]">Uploaded</span>
                  </div>
                ) : (
                  <>
                    <Camera size={22} className="mb-1" />
                    <span className="text-[9px] uppercase font-bold leading-tight">
                      Change <br /> Profile Photo
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {/* Name Section */}
            <div className={`px-8 py-4 ${theme.mainBg} shadow-sm`}>
              <label className="text-sm text-cyan-600 dark:text-cyan-400 mb-4 block">
                Your name
              </label>
              <div className="flex items-center justify-between group">
                <span className={`text-base ${theme.text}`}>
                  {profile.username}
                </span>
                <Pencil
                  size={18}
                  className={`${theme.textMuted} cursor-pointer hover:${theme.text}`}
                />
              </div>
              <p className={`text-xs ${theme.textMuted} mt-6 leading-relaxed`}>
                This is not your username or pin. This name will be visible to
                your contacts.
              </p>
            </div>

            {/* About Section */}
            <div className={`px-8 py-5 ${theme.mainBg} shadow-sm`}>
              <label className="text-sm text-cyan-600 dark:text-cyan-400 mb-4 block">
                About
              </label>
              <div className="flex items-center justify-between group">
                <span className={`text-base ${theme.text} whitespace-pre-wrap`}>
                  {profile.bio || "Hey there! I am using WhatsApp."}
                </span>
                <Pencil
                  size={18}
                  className={`${theme.textMuted} cursor-pointer hover:${theme.text}`}
                />
              </div>
            </div>

            {/* Unique ID Section with Animation */}
            <div className={`px-8 py-5 ${theme.mainBg} shadow-sm`}>
              <label className="text-sm text-cyan-600 dark:text-cyan-400 mb-4 block">
                Unique ID
              </label>
              <div className="flex items-center justify-between">
                <span className={`text-base font-mono ${theme.text}`}>
                  {profile.userCode || "N/A"}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-black/5 rounded-full"
                    title="Share Profile"
                  >
                    <Share2 size={20} className={theme.textMuted} />
                  </button>

                  {/* Copy Button with Icon Swap Animation */}
                  <button
                    onClick={copyId}
                    className={`p-2 rounded-full transition-all ${copied ? "bg-green-500/10" : "hover:bg-black/5"}`}
                    title="Copy ID"
                  >
                    {copied ? (
                      <Check
                        size={20}
                        className="text-green-500 animate-in zoom-in duration-200"
                      />
                    ) : (
                      <Copy size={20} className={theme.textMuted} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Empty Placeholder */}
      <div
        className={`hidden md:flex flex-1 flex-col items-center justify-center ${theme.mainBg} relative`}
      >
        <div className="flex flex-col items-center text-center max-w-md px-6">
          <div
            className={`p-10 rounded-full ${theme.sidebarBg} mb-6 border ${theme.divider}`}
          >
            <User size={80} className={theme.textMuted} strokeWidth={1} />
          </div>
          <h2 className={`text-3xl font-light mb-4 ${theme.text}`}>Profile</h2>
          <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
            Update your profile details and manage how others see you on the
            platform.
          </p>
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 h-1.5 ${theme.sidebarIconActive}`}
        ></div>
      </div>
    </div>
  );
};

export default Profile;
