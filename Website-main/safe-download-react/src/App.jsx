import React from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fffcf2",
      }}
    >
      <Header />
      <Navigation />
      <main style={{ flex: 1 }}>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
