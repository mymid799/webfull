import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Windows from "../pages/Windows";
import Office from "../pages/Office";
import Tools from "../pages/Tools";
import FreeAntivirus from "../pages/FreeAntivirus";
import Report from "../pages/Report";
import AdminFeedback from "../pages/AdminFeedback";
import FeedbackStatus from "../pages/FeedbackStatus";
import VirusTotalScan from "../pages/VirusTotalScan";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/windows" element={<Windows />} />
      <Route path="/office" element={<Office />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/free-antivirus" element={<FreeAntivirus />} />
      <Route path="/report" element={<Report />} />
      <Route path="/admin-feedback" element={<AdminFeedback />} />
      <Route path="/feedback-status" element={<FeedbackStatus />} />
      <Route path="/virustotal-scan" element={<VirusTotalScan />} />
    </Routes>
  );
}
