import { useState } from "react";
import axios from "axios";

type Props = {
  onLogin: () => void;
  onSignup: () => void;
  onForgot: () => void;
};

export default function Login({ onLogin, onSignup, onForgot }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      // ✅ STORE TOKEN
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      onLogin();
    } catch (err: any) {
      alert(err.response?.data || "Login failed"); // ✅ improved error
    } finally {
      setLoading(false);
    }
  };

  // ✅ ENTER KEY SUPPORT
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") login();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDE */}
      <div
        style={{
          flex: 1,
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "#1e3a8a"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "20px"
          }}
        >
          <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>
            Focus Tracker
          </h1>

          <p style={{ fontSize: "14px" }}>
            Stay focused. Track your time. Improve productivity.
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "20px"
          }}
        >
          <button
            onClick={onSignup}
            style={{
              padding: "10px 15px",
              background: "white",
              color: "#1e3a8a",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fafb"
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "10px",
            width: "320px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#1e3a8a" }}>
            Login
          </h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey} // ✅ added
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey} // ✅ added
            style={{
              width: "100%",
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px"
            }}
          />

          <button
            onClick={login}
            disabled={loading} // ✅ added
            style={{
              width: "100%",
              padding: "10px",
              background: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            onClick={onForgot}
            style={{
              marginTop: "10px",
              fontSize: "14px",
              cursor: "pointer",
              color: "#1e3a8a"
            }}
          >
            Forgot Password?
          </p>

          <p
            onClick={onSignup}
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#1e3a8a",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            New user? Create Account
          </p>
        </div>
      </div>
    </div>
  );
}