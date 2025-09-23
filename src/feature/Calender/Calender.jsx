import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { SpinnerCircular } from "spinners-react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const ContestCalendar = () => {
  const [contests, setContests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedContest, setSelectedContest] = useState(null);
  let content;
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(
          "https://codeforces.com/api/contest.list"
        );
        setContests(response.data.result);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Clear selected contest when date changes
    setSelectedContest(null);
  };

  const handleClick = (contest) => {
    setSelectedContest(contest);
  };
  if (contests?.length) {
    content = (
      <div className="contest-calendar">
        <h1>Contest Calendar</h1>
        <div className="calendar-container">
          <div className="calendar-wrapper">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={({ date }) => {
                // Highlight dates with contests
                const contestDates = contests.map((contest) =>
                  new Date(contest.startTimeSeconds * 1000).toDateString()
                );
                if (contestDates.includes(date.toDateString())) {
                  return "highlighted";
                }
                return "";
              }}
            />
          </div>
          <div className="contest-list">
            {contests.map((contest) => {
              const startDate = new Date(
                contest.startTimeSeconds * 1000
              ).toDateString();
              if (startDate === selectedDate.toDateString()) {
                return (
                  <div
                    key={contest.id}
                    className={`contest ${
                      selectedContest && selectedContest.id === contest.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleClick(contest)}
                  >
                    <div className="contest-info">
                      <div className="contest-name">{contest.name}</div>
                      <div className="contest-time">
                        {new Date(
                          contest.startTimeSeconds * 1000
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        {selectedContest && (
          <div className="selected-contest">
            <h2>{selectedContest.name}</h2>
            <p>
              Start Time:{" "}
              {new Date(
                selectedContest.startTimeSeconds * 1000
              ).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    );
  } else {
    content = (
      <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return content;
};

export default ContestCalendar;
