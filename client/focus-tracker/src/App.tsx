import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Forgot from "./Forgot";
import Analysis from "./Analysis";
import Setup from "./Setup";
import axios from "axios";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [setupDone, setSetupDone] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ ADDED

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setPage("login");
      setLoading(false); // ✅ ADDED
      return;
    }

    axios.get("http://localhost:5000/user", {
      headers: { authorization: token }
    })
    .then(res => {
      setSetupDone(res.data.setupDone || false);

      localStorage.setItem(
        "prefs",
        JSON.stringify(res.data.preferences || {})
      );

      setPage("dashboard");
      setLoading(false); // ✅ ADDED
    })
    .catch(() => {
      localStorage.clear();
      setPage("login");
      setLoading(false); // ✅ ADDED
    });
  }, []);

  // ✅ PREVENT EARLY RENDER
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (page === "dashboard" && !setupDone) {
    return (
      <Setup
        onDone={() => {
          setSetupDone(true);
          setPage("dashboard");
        }}
      />
    );
  }

  if (page === "dashboard") {
    return <Dashboard goToAnalysis={() => setPage("analysis")} />;
  }

  if (page === "analysis") {
    return <Analysis goBack={() => setPage("dashboard")} />;
  }

  if (page === "signup") {
    return <Signup onBack={() => setPage("login")} />;
  }

  if (page === "forgot") {
    return <Forgot onBack={() => setPage("login")} />;
  }

  return (
    <Login
      onLogin={() => setPage("dashboard")}
      onSignup={() => setPage("signup")}
      onForgot={() => setPage("forgot")}
    />
  );
}

export default App;