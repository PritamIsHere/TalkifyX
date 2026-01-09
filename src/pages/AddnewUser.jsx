// import React from 'react'

// const AddnewUser = () => {
//   return (
//     <div>

//     </div>
//   )
// }

// export default AddnewUser

import React, { useEffect, useState, useRef } from "react";
import {
  Copy,
  Pencil,
  ArrowLeft,
  Camera,
  Share2,
  User,
  Check,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Standard for React navigation
import useAuthStore from "../stores/useAuthStore";
import { useTheme } from "../theme/Theme";
import { Image } from "../assets/image";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const AddnewUser = () => {
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
      // console.error("copy failed", err);
      toast.error("Copy failed");
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
    <div className={`flex h-screen w-full overflow-hidden ${theme.bg}`}>
      {/* LEFT SIDE: Profile Section */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 18,
        }}
        className={`flex flex-col h-full w-full md:w-[400px] lg:w-[450px] ${theme.bg} border-r ${theme.divider} flex-shrink-0 z-10`}
      >
        {/* 3. Back Button Functionality */}
        <div
          className={`flex items-end px-5 pb-4 py-5 ${theme.footer} flex-shrink-0 shadow-sm`}
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)} // Goes back to the previous page
              className={`${theme.text} p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all`}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className={`text-lg font-medium ${theme.text}`}>
              Add New User
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 1. Smaller Profile Photo */}
          <div className="flex justify-center py-8"></div>

          <div className="flex flex-col gap-1">
            {/* Name Section */}

            {/* About Section */}

            {/* Unique ID Section with Animation */}
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: Empty Placeholder */}
      <div
        className={`hidden md:flex flex-1 flex-col items-center justify-center ${theme.mainBg} relative`}
      >
        <div className="flex flex-col items-center text-center max-w-md px-6">
          <div
            className={`p-10 rounded-full ${theme.sidebarBg} mb-6 border ${theme.divider}`}
          >
            <Search size={80} className={theme.textMuted} strokeWidth={1} />
          </div>
          <h2 className={`text-3xl font-light mb-4 ${theme.text}`}>Profile</h2>
          <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
            {/* Update your profile details and manage how others see you on the
            platform. */}
            Add New users
          </p>
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 h-1.5 ${theme.sidebarIconActive}`}
        ></div>
      </div>
    </div>
  );
};

export default AddnewUser;
