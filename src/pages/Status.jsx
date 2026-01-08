import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, MoreVertical, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import useAuthStore from "../stores/useAuthStore";
import { useTheme } from "../theme/Theme";
import { Image } from "../assets/image";

// Mock Data for Statuses
const MOCK_STATUSES = [
  {
    id: 1,
    user: {
      _id: "u1",
      username: "Billu Bhasanda",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    timestamp: "Today, 10:30 AM",
    createdAt: new Date().setHours(10, 30, 0, 0), // Today 10:30 AM
    viewed: false,
    stories: [
      { id: "s1", type: "image", url: "https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?w=600&h=900&fit=crop", duration: 5000 },
      { id: "s2", type: "text", content: "Hello World!", bg: "bg-purple-600", duration: 3000 }
    ]
  },
  {
    id: 2,
    user: {
      _id: "u2",
      username: "Singham returns",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    },
    timestamp: "Today, 9:15 AM",
    createdAt: new Date().setHours(9, 15, 0, 0), // Today 9:15 AM
    viewed: false,
    stories: [
      { id: "s3", type: "image", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=900&fit=crop", duration: 5000 }
    ]
  },
  {
    id: 3,
    user: {
      _id: "u3",
      username: "Hero alom",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    },
    timestamp: "Yesterday, 11:45 PM",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(23, 45, 0, 0), // Yesterday 11:45 PM
    viewed: true,
    stories: [
      { id: "s4", type: "image", url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=900&fit=crop", duration: 5000 }
    ]
  },
];

// Status Ring Component
const StatusRing = ({ stories, viewedStoryIds, children }) => {
  const radius = 22; // Radius of the ring
  const stroke = 2; // Thickness
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const total = stories.length;
  
  if (total === 1) {
    const isViewed = viewedStoryIds.has(stories[0].id);
    return (
      <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center p-[3px] rounded-full border-2 ${isViewed ? "border-slate-300 dark:border-slate-700" : "border-teal-500"} relative`}>
        <div className="w-full h-full rounded-full overflow-hidden">
           {children}
        </div>
      </div>
    );
  }

  // Calculate arc for each segment
  const degreesPerSegment = 360 / total;
  const gapDegrees = 5; // Gap in degrees
  const drawDegrees = degreesPerSegment - gapDegrees;

  // Convert polar to cartesian
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  const describeArc = (x, y, radius, startAngle, endAngle) => {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      const d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");
      return d;       
  }

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
       <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 50 50">
          {stories.map((story, i) => {
             const startAngle = i * degreesPerSegment;
             const endAngle = startAngle + drawDegrees;
             const isViewed = viewedStoryIds.has(story.id);
             return (
                 <path 
                    key={story.id}
                    d={describeArc(25, 25, 23, startAngle, endAngle)} // 25=center, 23=radius
                    fill="none"
                    stroke={isViewed ? "#6b7280" : "#14b8a6"} // Gray-500 vs Teal-500
                    strokeWidth="2"
                    strokeLinecap="round"
                 />
             )
          })}
       </svg>
       <div className="w-[86%] h-[86%] rounded-full overflow-hidden z-10">
          {children}
       </div>
    </div>
  )
}

const Status = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuthStore();

  // State
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [viewingStoryIndex, setViewingStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Track viewed STORY IDs locally
  const getInitialViewedStories = () => {
      let viewed = new Set();
      MOCK_STATUSES.forEach(s => {
          if(s.viewed) {
              s.stories.forEach(st => viewed.add(st.id));
          }
      });
      return viewed;
  }
  const [viewedStoryIds, setViewedStoryIds] = useState(getInitialViewedStories());


  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    
    // Find the first unviewed story index
    const firstUnviewedIndex = status.stories.findIndex(s => !viewedStoryIds.has(s.id));
    setViewingStoryIndex(firstUnviewedIndex >= 0 ? firstUnviewedIndex : 0);
    
    setProgress(0);
  };

  const handleCloseStatus = () => {
    setSelectedStatus(null);
    setViewingStoryIndex(0);
    setProgress(0);
  };
  
  // Helper to mark current story as viewed
  const markCurrentStoryViewed = () => {
      if(selectedStatus) {
         const storyId = selectedStatus.stories[viewingStoryIndex].id;
         setViewedStoryIds(prev => new Set(prev).add(storyId));
      }
  }

  // Progress Timer Effect
  useEffect(() => {
    let interval;
    if (selectedStatus) {
      // Mark as viewed immediately when playback starts
      markCurrentStoryViewed();

      const currentStory = selectedStatus.stories[viewingStoryIndex];
      const duration = currentStory.duration || 5000;
      const step = 100 / (duration / 50); // update every 50ms

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Next story or close
            if (viewingStoryIndex < selectedStatus.stories.length - 1) {
              setViewingStoryIndex(prevIndex => prevIndex + 1);
              return 0;
            } else {
              handleCloseStatus();
              return 100;
            }
          }
          return prev + step;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [selectedStatus, viewingStoryIndex]);

  const handleNextStory = (e) => {
    e.stopPropagation();
    markCurrentStoryViewed();
    
    if (selectedStatus && viewingStoryIndex < selectedStatus.stories.length - 1) {
        setViewingStoryIndex(prev => prev + 1);
        setProgress(0);
    } else {
        handleCloseStatus();
    }
  };

  const handlePrevStory = (e) => {
    e.stopPropagation();
    if (selectedStatus && viewingStoryIndex > 0) {
      setViewingStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  }


  return (
    <div className={`flex h-screen w-full overflow-hidden ${theme.mainBg}`}>
      {/* LEFT SIDE: Status List */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`${selectedStatus ? "hidden md:flex" : "flex"} flex-col h-full w-full md:w-[400px] lg:w-[450px] ${theme.sidebarBg} border-r ${theme.divider} flex-shrink-0 z-10`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-4 ${theme.navBg} border-b ${theme.divider} shadow-sm`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`${theme.text} p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all`}
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className={`text-xl font-semibold ${theme.text}`}>Status</h1>
          </div>
          <div className={`${theme.textMuted} p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer`}>
            <MoreVertical size={20} />
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0 pb-20 md:pb-0">

          {/* My Status */}
          <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
            <div className="relative">
              <img
                src={user?.avatar || Image.defaultUser}
                alt="My Status"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-0.5 border-2 border-white dark:border-slate-900">
                <Plus size={14} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${theme.text}`}>My Status</h3>
              <p className={`text-sm ${theme.textMuted}`}>Click to add status update</p>
            </div>
          </div>

          {/* Section Divider */}
          <div className={`px-4 py-2 text-sm font-medium ${theme.textMuted} uppercase tracking-wider text-[11px] mt-2`}>
            Recent updates
          </div>

          {/* Recent Updates List */}
          {MOCK_STATUSES
            .filter(s => s.stories.some(st => !viewedStoryIds.has(st.id)))
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((status) => (
            <div
              key={status.id}
              onClick={() => handleSelectStatus(status)}
              className="px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <StatusRing stories={status.stories} viewedStoryIds={viewedStoryIds}>
                  <img
                    src={status.user.avatar}
                    alt={status.user.username}
                    className="w-full h-full object-cover"
                  />
              </StatusRing>
              
              <div className="flex-1 border-b border-transparent">
                <h3 className={`font-medium ${theme.text} text-base`}>{status.user.username}</h3>
                <p className={`text-sm ${theme.textMuted}`}>{status.timestamp}</p>
              </div>
            </div>
          ))}

          {/* Section Divider */}
          <div className={`px-4 py-2 text-sm font-medium ${theme.textMuted} uppercase tracking-wider text-[11px] mt-4`}>
            Viewed updates
          </div>

          {/* Viewed Updates List */}
          {MOCK_STATUSES
            .filter(s => s.stories.every(st => viewedStoryIds.has(st.id)))
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((status) => (
            <div
              key={status.id}
              onClick={() => handleSelectStatus(status)}
              className="px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center p-[3px] rounded-full border-2 ${theme.divider} relative`}>
                 <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={status.user.avatar}
                      alt={status.user.username}
                      className="w-full h-full object-cover opacity-80"
                    />
                </div>
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${theme.text} text-base opacity-90`}>{status.user.username}</h3>
                <p className={`text-sm ${theme.textMuted}`}>{status.timestamp}</p>
              </div>
            </div>
          ))}

        </div>
      </motion.div>


      {/* RIGHT SIDE: Status View */}
      <div className={`${selectedStatus ? "fixed inset-0 z-[60] flex bg-black md:static md:z-auto" : "hidden md:flex"} flex-1 relative items-center justify-center overflow-hidden`}>
        {selectedStatus ? (
          <div className="relative w-full h-full flex items-center justify-center bg-zinc-900">
            {/* Story Controls */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent">
              {/* Progress Bars */}
              <div className="flex gap-1.5 mb-3">
                {selectedStatus.stories.map((story, idx) => (
                  <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{
                        width: idx < viewingStoryIndex ? "100%" : idx === viewingStoryIndex ? `${progress}%` : "0%"
                      }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <ArrowLeft className="md:hidden cursor-pointer" onClick={handleCloseStatus} />
                  <img src={selectedStatus.user.avatar} className="w-10 h-10 rounded-full border border-white/20" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{selectedStatus.user.username}</span>
                    <span className="text-xs text-white/70">{selectedStatus.timestamp}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-white">
                  <button onClick={handleCloseStatus} className="hover:bg-white/10 p-2 rounded-full">
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div className="w-full h-full flex items-center justify-center relative" onClick={handleNextStory}>
              {selectedStatus.stories[viewingStoryIndex].type === 'image' ? (
                <img
                  src={selectedStatus.stories[viewingStoryIndex].url}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold p-10 text-center ${selectedStatus.stories[viewingStoryIndex].bg}`}>
                  {selectedStatus.stories[viewingStoryIndex].content}
                </div>
              )}

              {/* Navigation Zones */}
              <div className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer" onClick={handlePrevStory}></div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer" onClick={handleNextStory}></div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center opacity-70 select-none">
            <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center mb-6">

              {/* Just a decorative icon */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-xl text-white/80 font-medium mb-2">Click on a contact to view their status updates</h2>
            <p className="text-white/40 text-sm max-w-xs">User statuses will disappear after 24 hours.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;
