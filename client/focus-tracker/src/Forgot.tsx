import { useState } from "react";
import axios from "axios";

type Props = {
  onBack: () => void;
};

export default function Forgot({ onBack }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ ADDED

  const handleReset = async () => {
    if (!email) {
      alert("Enter your email");
      return;
    }

    try {
      setLoading(true); // ✅ ADDED

      await axios.post("https://focus-tracker-backend-aqe3.onrender.com/send-otp", {
        email
      });

      alert("OTP sent to your email"); // ✅ UPDATED TEXT
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // ✅ ADDED
    }
  };

  return (
    <div
      style={{
        height: "100vh",
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
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}
      >
        <h2 style={{ color: "#1e3a8a", marginBottom: "20px" }}>
          Forgot Password
        </h2>

        <input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email} // ✅ ADDED
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />

        <button
          onClick={handleReset}
          disabled={loading} // ✅ ADDED
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
          {loading ? "Sending..." : "Send Reset Link"} {/* ✅ UPDATED */}
        </button>

        <p
          onClick={onBack}
          style={{
            marginTop: "15px",
            cursor: "pointer",
            color: "#1e3a8a"
          }}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}