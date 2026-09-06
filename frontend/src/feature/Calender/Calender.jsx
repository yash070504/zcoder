import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { 
  FiCalendar, 
  FiClock, 
  FiExternalLink, 
  FiFilter, 
  FiGlobe,
  FiX
} from "react-icons/fi";

// Popular competitive programming platforms with direct links
const PLATFORM_HUBS = [
  {
    id: "LeetCode",
    name: "LeetCode",
    url: "https://leetcode.com/contest/",
    color: "#ffa116",
    badgeBg: "rgba(255, 161, 22, 0.15)",
    badgeBorder: "rgba(255, 161, 22, 0.3)",
    description: "Weekly & Biweekly Contests"
  },
  {
    id: "Codeforces",
    name: "Codeforces",
    url: "https://codeforces.com/contests",
    color: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeBorder: "rgba(56, 189, 248, 0.3)",
    description: "Rated Div 1 / 2 / 3 Rounds"
  },
  {
    id: "CodeChef",
    name: "CodeChef",
    url: "https://www.codechef.com/contests",
    color: "#c084fc",
    badgeBg: "rgba(192, 132, 252, 0.15)",
    badgeBorder: "rgba(192, 132, 252, 0.3)",
    description: "Wednesday Starters"
  },
  {
    id: "AtCoder",
    name: "AtCoder",
    url: "https://atcoder.jp/contests/",
    color: "#22d3ee",
    badgeBg: "rgba(34, 211, 238, 0.15)",
    badgeBorder: "rgba(34, 211, 238, 0.3)",
    description: "AtCoder Beginner Contests (ABC)"
  },
  {
    id: "HackerRank",
    name: "HackerRank",
    url: "https://www.hackerrank.com/contests",
    color: "#34d399",
    badgeBg: "rgba(52, 211, 153, 0.15)",
    badgeBorder: "rgba(52, 211, 153, 0.3)",
    description: "Hiring & Algorithm Contests"
  }
];

// Helper to generate recurring future contest schedules for LeetCode, CodeChef, and AtCoder
const generateUpcomingPlatformContests = (baseDate = new Date(), daysSpan = 60) => {
  const generated = [];
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysSpan; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    // 1. LeetCode Weekly Contest: Every Sunday at 08:00 AM IST (02:30 UTC)
    if (dayOfWeek === 0) {
      const lcWeekly = new Date(d);
      lcWeekly.setUTCHours(2, 30, 0, 0);
      generated.push({
        id: `leetcode-weekly-${d.toISOString().slice(0, 10)}`,
        platform: "LeetCode",
        name: "LeetCode Weekly Contest",
        startTimeSeconds: Math.floor(lcWeekly.getTime() / 1000),
        durationSeconds: 5400, // 1h 30m
        phase: lcWeekly.getTime() > Date.now() ? "BEFORE" : "COMPLETED",
        registerUrl: "https://leetcode.com/contest/",
        platformColor: "#ffa116"
      });
    }

    // 2. LeetCode Biweekly Contest: Every alternate Saturday at 08:00 PM IST (14:30 UTC)
    if (dayOfWeek === 6) {
      const weekIndex = Math.floor(d.getTime() / (7 * 24 * 60 * 60 * 1000));
      if (weekIndex % 2 === 0) {
        const lcBiweekly = new Date(d);
        lcBiweekly.setUTCHours(14, 30, 0, 0);
        generated.push({
          id: `leetcode-biweekly-${d.toISOString().slice(0, 10)}`,
          platform: "LeetCode",
          name: "LeetCode Biweekly Contest",
          startTimeSeconds: Math.floor(lcBiweekly.getTime() / 1000),
          durationSeconds: 5400,
          phase: lcBiweekly.getTime() > Date.now() ? "BEFORE" : "COMPLETED",
          registerUrl: "https://leetcode.com/contest/",
          platformColor: "#ffa116"
        });
      }
    }

    // 3. CodeChef Starters: Every Wednesday at 08:00 PM IST (14:30 UTC)
    if (dayOfWeek === 3) {
      const ccStarters = new Date(d);
      ccStarters.setUTCHours(14, 30, 0, 0);
      generated.push({
        id: `codechef-starters-${d.toISOString().slice(0, 10)}`,
        platform: "CodeChef",
        name: "CodeChef Starters",
        startTimeSeconds: Math.floor(ccStarters.getTime() / 1000),
        durationSeconds: 7200, // 2h
        phase: ccStarters.getTime() > Date.now() ? "BEFORE" : "COMPLETED",
        registerUrl: "https://www.codechef.com/contests",
        platformColor: "#c084fc"
      });
    }

    // 4. AtCoder Beginner Contest: Every Saturday at 05:30 PM IST (12:00 UTC)
    if (dayOfWeek === 6) {
      const acAbc = new Date(d);
      acAbc.setUTCHours(12, 0, 0, 0);
      generated.push({
        id: `atcoder-abc-${d.toISOString().slice(0, 10)}`,
        platform: "AtCoder",
        name: "AtCoder Beginner Contest (ABC)",
        startTimeSeconds: Math.floor(acAbc.getTime() / 1000),
        durationSeconds: 6000, // 1h 40m
        phase: acAbc.getTime() > Date.now() ? "BEFORE" : "COMPLETED",
        registerUrl: "https://atcoder.jp/contests/",
        platformColor: "#22d3ee"
      });
    }
  }

  return generated;
};

const ContestCalendar = () => {
  const [contests, setContests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedContest, setSelectedContest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllContests = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch live Codeforces contests
        let cfContests = [];
        try {
          const response = await axios.get("https://codeforces.com/api/contest.list");
          if (response.data && response.data.result) {
            cfContests = response.data.result
              .filter((c) => c.phase === "BEFORE" || c.phase === "CODING")
              .map((c) => ({
                id: `cf-${c.id}`,
                platform: "Codeforces",
                name: c.name,
                startTimeSeconds: c.startTimeSeconds,
                durationSeconds: c.durationSeconds,
                phase: c.phase,
                // Direct link to the valid, live contest overview page on Codeforces
                registerUrl: `https://codeforces.com/contest/${c.id}`,
                platformColor: "#38bdf8"
              }));
          }
        } catch (cfErr) {
          console.warn("Codeforces API fetch error:", cfErr);
        }

        // 2. Generate recurring contests for LeetCode, CodeChef, and AtCoder
        const multiPlatformContests = generateUpcomingPlatformContests(new Date(), 60);

        // 3. Merge and sort chronologically
        const combined = [...cfContests, ...multiPlatformContests].sort(
          (a, b) => a.startTimeSeconds - b.startTimeSeconds
        );

        setContests(combined);
      } catch (err) {
        console.error("Error organizing contests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContests();
  }, []);

  const handleDateChange = (date) => {
    // If the same date is clicked again, clear the filter; otherwise set selected date
    if (selectedDate && selectedDate.toDateString() === date.toDateString()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
    setSelectedContest(null);
  };

  // Filter contests based on platform tab and calendar selected date
  const filteredContests = useMemo(() => {
    return contests.filter((c) => {
      // Platform filter
      if (selectedPlatform !== "All" && c.platform !== selectedPlatform) {
        return false;
      }
      // Date filter
      if (selectedDate) {
        const contestDate = new Date(c.startTimeSeconds * 1000).toDateString();
        return contestDate === selectedDate.toDateString();
      }
      return true;
    });
  }, [contests, selectedPlatform, selectedDate]);

  // Set of dates that have contests for calendar day highlighting
  const contestDateStrings = useMemo(() => {
    const dates = new Set();
    contests.forEach((c) => {
      if (selectedPlatform === "All" || c.platform === selectedPlatform) {
        dates.add(new Date(c.startTimeSeconds * 1000).toDateString());
      }
    });
    return dates;
  }, [contests, selectedPlatform]);

  const platformOptions = ["All", "Codeforces", "LeetCode", "CodeChef", "AtCoder"];

  return (
    <div className="w-100">
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2 small">Syncing competitive programming schedules...</p>
        </div>
      ) : (
        <div className="row g-4 align-items-start">
          {/* ========================================================
              LEFT COLUMN: Interactive Calendar + Direct Platform Portals
             ======================================================== */}
          <div className="col-12 col-xl-5 col-lg-5">
            <div className="d-flex flex-column align-items-center">
              {/* Calendar Widget */}
              <div className="w-100 d-flex justify-content-center mb-4">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate || new Date()}
                  tileClassName={({ date }) => {
                    if (contestDateStrings.has(date.toDateString())) {
                      return "highlighted";
                    }
                    return "";
                  }}
                />
              </div>

              {/* Quick Links to Coding Platform Hubs */}
              <div 
                className="w-100 p-3 rounded-4" 
                style={{ 
                  background: "rgba(13, 18, 30, 0.7)", 
                  border: "1px solid rgba(255, 255, 255, 0.08)" 
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                  <div className="d-flex align-items-center gap-2">
                    <FiGlobe size={16} style={{ color: "#818cf8" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#f8fafc" }}>
                      Coding Platform Portals
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Official Hubs</span>
                </div>

                <div className="d-flex flex-column gap-2">
                  {PLATFORM_HUBS.map((hub) => (
                    <a
                      key={hub.id}
                      href={hub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="platform-hub-link"
                      title={`Visit ${hub.name} Official Contest Page`}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: hub.color,
                            boxShadow: `0 0 8px ${hub.color}`
                          }}
                        ></span>
                        <span style={{ fontSize: "0.88rem", fontWeight: "600", color: "#f1f5f9" }}>
                          {hub.name}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }} className="d-none d-sm-inline">
                          — {hub.description}
                        </span>
                      </div>
                      <span 
                        className="d-inline-flex align-items-center gap-1"
                        style={{ fontSize: "0.78rem", color: hub.color, fontWeight: "600" }}
                      >
                        <span>Open</span>
                        <FiExternalLink size={12} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Platform Filter Tabs ("this options") + Contests List
             ======================================================== */}
          <div className="col-12 col-xl-7 col-lg-7">
            {/* Options Bar: Platform Selector Tabs */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="d-flex align-items-center gap-1 me-1 text-muted small fw-semibold">
                  <FiFilter size={14} />
                  <span>Platform:</span>
                </span>
                {platformOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedPlatform(opt)}
                    className={`contest-filter-pill ${selectedPlatform === opt ? "active" : ""}`}
                  >
                    {opt === "Codeforces" && <span style={{ color: "#38bdf8" }}>●</span>}
                    {opt === "LeetCode" && <span style={{ color: "#ffa116" }}>●</span>}
                    {opt === "CodeChef" && <span style={{ color: "#c084fc" }}>●</span>}
                    {opt === "AtCoder" && <span style={{ color: "#22d3ee" }}>●</span>}
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {/* Date Filter Indicator and Reset */}
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="btn btn-sm d-inline-flex align-items-center gap-1 py-1 px-2"
                  style={{
                    background: "rgba(99, 102, 241, 0.18)",
                    border: "1px solid rgba(99, 102, 241, 0.4)",
                    color: "#c7d2fe",
                    fontSize: "0.78rem",
                    borderRadius: "8px"
                  }}
                  title="Clear date filter"
                >
                  <span>Date: {selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* List Header */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="fs-6 fw-bold text-uppercase text-muted mb-0" style={{ letterSpacing: "0.05em" }}>
                {selectedDate
                  ? `Rounds on ${selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                  : selectedPlatform === "All"
                  ? "All Upcoming Competitions"
                  : `Upcoming ${selectedPlatform} Contests`}
              </h4>
              <span className="badge-easy">
                {filteredContests.length} {filteredContests.length === 1 ? "Round" : "Rounds"} Available
              </span>
            </div>

            {/* Contests List */}
            <div 
              className="d-flex flex-column gap-3" 
              style={{ maxHeight: "580px", overflowY: "auto", paddingRight: "4px" }}
            >
              {filteredContests.map((contest) => {
                const startDate = new Date(contest.startTimeSeconds * 1000);
                const isSelected = selectedContest?.id === contest.id;

                return (
                  <div
                    key={contest.id}
                    onClick={() => setSelectedContest(contest)}
                    className={`contest-item-card ${isSelected ? "active-selected" : ""}`}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-2">
                        {/* Platform Brand Badge */}
                        <span
                          style={{
                            fontSize: "0.74rem",
                            fontWeight: "700",
                            padding: "3px 10px",
                            borderRadius: "999px",
                            background: "rgba(255, 255, 255, 0.06)",
                            border: `1px solid ${contest.platformColor || "#6366f1"}`,
                            color: contest.platformColor || "#f8fafc",
                            letterSpacing: "0.02em"
                          }}
                        >
                          {contest.platform}
                        </span>

                        <h5 className="fs-6 fw-bold text-white mb-0">
                          {contest.name}
                        </h5>
                      </div>

                      {/* Status Tag */}
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: contest.phase === "BEFORE" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: contest.phase === "BEFORE" ? "#34d399" : "#fbbf24",
                          fontWeight: 600
                        }}
                      >
                        {contest.phase === "BEFORE" ? "Upcoming" : contest.phase}
                      </span>
                    </div>

                    {/* Metadata & Register Link */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2 mt-1 border-top border-secondary border-opacity-25">
                      <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                        <span className="d-inline-flex align-items-center gap-1">
                          <FiCalendar size={13} style={{ color: "#38bdf8" }} />
                          <span>{startDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                        </span>
                        <span className="d-inline-flex align-items-center gap-1">
                          <FiClock size={13} style={{ color: "#fbbf24" }} />
                          <span>{startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </span>
                        {contest.durationSeconds && (
                          <span style={{ color: "#94a3b8" }}>
                            Duration: {Math.floor(contest.durationSeconds / 3600)}h{" "}
                            {Math.floor((contest.durationSeconds % 3600) / 60)}m
                          </span>
                        )}
                      </div>

                      {/* Working Register / Contest Portal Link */}
                      <a
                        href={contest.registerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-register-pill"
                        title={`Open official registration/contest page on ${contest.platform}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <span>Register / View</span>
                        <FiExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })}

              {filteredContests.length === 0 && (
                <div 
                  className="p-5 text-center rounded-4" 
                  style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px dashed rgba(255, 255, 255, 0.12)" }}
                >
                  <p className="text-white fw-semibold mb-1">No rounds found for this selection</p>
                  <p className="text-muted small mb-3">
                    {selectedDate 
                      ? "There are no scheduled contests on this date for the selected platform." 
                      : "Try selecting 'All' platforms to view all upcoming events."}
                  </p>
                  {selectedDate && (
                    <button
                      type="button"
                      onClick={() => setSelectedDate(null)}
                      className="btn-premium py-2 px-3"
                      style={{ fontSize: "0.84rem" }}
                    >
                      Show All Upcoming Contests
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestCalendar;
