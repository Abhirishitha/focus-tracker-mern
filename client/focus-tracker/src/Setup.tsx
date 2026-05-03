import { useState } from "react";
import axios from "axios";

type Props = {
  onDone: () => void;
};

export default function Setup({ onDone }: Props) {
  const [purpose, setPurpose] = useState("");

  const [distractingInput, setDistractingInput] = useState("");
  const [productiveInput, setProductiveInput] = useState("");

  const [distracting, setDistracting] = useState<string[]>([]);
  const [productive, setProductive] = useState<string[]>([]);

  const [loading, setLoading] = useState(false); // ✅ ADDED

  const normalize = (url: string) => {
    return url
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .split("/")[0]
      .trim()
      .toLowerCase();
  };

  const addDistracting = () => {
    if (!distractingInput) return;

    const site = normalize(distractingInput);
    if (distracting.includes(site)) return;

    setDistracting([...distracting, site]);
    setDistractingInput("");
  };

  const addProductive = () => {
    if (!productiveInput) return;

    const site = normalize(productiveInput);
    if (productive.includes(site)) return;

    setProductive([...productive, site]);
    setProductiveInput("");
  };

  const removeDistracting = (i: number) =>
    setDistracting(distracting.filter((_, idx) => idx !== i));

  const removeProductive = (i: number) =>
    setProductive(productive.filter((_, idx) => idx !== i));

  // ✅ ENTER KEY SUPPORT
  const handleKey = (e: React.KeyboardEvent, type: "d" | "p") => {
    if (e.key === "Enter") {
      type === "d" ? addDistracting() : addProductive();
    }
  };

  const save = async () => {
    // ✅ VALIDATION ADDED
    if (!purpose) {
      alert("Please enter purpose");
      return;
    }

    if (distracting.length === 0 && productive.length === 0) {
      alert("Add at least one website");
      return;
    }

    try {
      setLoading(true); // ✅ ADDED

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      const payload = {
        purpose,
        distracting,
        productive
      };

      await axios.post("http://localhost:5000/setup", payload, {
        headers: { authorization: token }
      });

      localStorage.setItem("prefs", JSON.stringify(payload));

      onDone();
    } catch (err: any) {
      alert(err.response?.data?.message || "Setup failed");
    } finally {
      setLoading(false); // ✅ ADDED
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* LEFT IMAGE */}
      <div
        style={{
          width: "40%",
          backgroundImage: "url('/bg1.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#f1f5f9"
        }}
      />

      {/* RIGHT SIDE */}
      <div
        style={{
          width: "60%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fafb"
        }}
      >
        <div style={card}>
          <h2 style={{ color: "#1e3a8a", marginBottom: "15px" }}>
            Setup Your Focus
          </h2>

          {/* PURPOSE */}
          <input
            placeholder="Purpose (Study / Work / Coding)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={input}
          />

          {/* DISTRACTING */}
          <h4>Distracting Websites</h4>
          <div style={row}>
            <input
              value={distractingInput}
              onChange={(e) => setDistractingInput(e.target.value)}
              onKeyDown={(e) => handleKey(e, "d")} // ✅ ADDED
              placeholder="youtube.com"
              style={input}
            />
            <button onClick={addDistracting} style={plusBtn}>+</button>
          </div>

          <div style={tags}>
            {distracting.map((site, i) => (
              <div key={i} style={tag}>
                {site}
                <span onClick={() => removeDistracting(i)} style={remove}>✕</span>
              </div>
            ))}
          </div>

          {/* PRODUCTIVE */}
          <h4>Productive Websites</h4>
          <div style={row}>
            <input
              value={productiveInput}
              onChange={(e) => setProductiveInput(e.target.value)}
              onKeyDown={(e) => handleKey(e, "p")} // ✅ ADDED
              placeholder="github.com"
              style={input}
            />
            <button onClick={addProductive} style={plusBtn}>+</button>
          </div>

          <div style={tags}>
            {productive.map((site, i) => (
              <div key={i} style={tag}>
                {site}
                <span onClick={() => removeProductive(i)} style={remove}>✕</span>
              </div>
            ))}
          </div>

          <button
            onClick={save}
            disabled={loading} // ✅ ADDED
            style={{
              ...mainBtn,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* STYLES (NO CHANGE) */
const card = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "350px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
};

const input = {
  flex: 1,
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const row = {
  display: "flex",
  gap: "10px"
};

const plusBtn = {
  padding: "10px 15px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const mainBtn = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const tags = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "8px",
  marginBottom: "10px"
};

const tag = {
  background: "#e2e8f0",
  padding: "5px 10px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  gap: "5px"
};

const remove = {
  cursor: "pointer",
  color: "red"
};