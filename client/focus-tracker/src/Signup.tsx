import { useState } from "react";
import axios from "axios";

type Props = {
  onBack: () => void;
};

export default function Signup({ onBack }: Props) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🚀 SEND OTP
  const sendOtp = async () => {
    if (!email) {
      alert("Enter email first");
      return;
    }

    try {
      await axios.post("https://focus-tracker-backend-aqe3.onrender.com/send-otp", { email });
      alert("OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  // 🚀 VERIFY OTP
  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp,
      });

      alert("OTP verified");
      setVerified(true);
    } catch {
      alert("Invalid OTP");
    }
  };

  // 🚀 FINAL SIGNUP
  const signup = async () => {
    if (!password) {
      alert("Enter password");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/signup", {
        email,
        password,
        otp,
      });

      alert("Account created successfully");
      onBack();
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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
        <div style={{ position: "absolute", top: "10px", left: "20px" }}>
          <h1 style={{ fontSize: "28px" }}>Focus Tracker</h1>
          <p style={{ fontSize: "14px" }}>
            Stay focused. Track your time. Improve productivity.
          </p>
        </div>

        <div style={{ position: "absolute", bottom: "40px", left: "20px" }}>
          <button
            onClick={onBack}
            style={{
              padding: "-10px 15px",
              background: "white",
              color: "#1e3a8a",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Back to Login
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
            Signup
          </h2>

          {/* EMAIL */}
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          {/* STEP 1 */}
          {!otpSent && (
            <button onClick={sendOtp} style={btnStyle}>
              Send OTP
            </button>
          )}

          {/* STEP 2 */}
          {otpSent && !verified && (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={inputStyle}
              />
              <button onClick={verifyOtp} style={btnStyle}>
                Verify OTP
              </button>
            </>
          )}

          {/* STEP 3 */}
          {verified && (
            <>
              <input
                type="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              <button onClick={signup} style={btnStyle}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </>
          )}

          <p
            onClick={onBack}
            style={{
              marginTop: "10px",
              cursor: "pointer",
              color: "#1e3a8a",
              fontWeight: "bold"
            }}
          >
            Already have an account? Login
          </p>
        </div>
      </div>
    </div>
  );
}

// 🎨 styles
const inputStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "10px"
};