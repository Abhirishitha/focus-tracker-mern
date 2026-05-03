import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis
} from "recharts";

type Session = {
  url: string;
  timeSpent: number;
};

type Props = {
  goToAnalysis: () => void;
};

/* 🔥 AI CACHE */
const aiCache: Record<string, string> = {};

/* 🔥 SAFE AI (NO API) */
const classifyWithAI = async (site: string) => {
  const s = site.toLowerCase();

  if (["github", "leetcode", "chatgpt", "docs"].some(k => s.includes(k)))
    return "Productive";

  if (["youtube", "instagram", "reel", "poki", "game"].some(k => s.includes(k)))
    return "Distracting";

  return "Unknown";
};

export default function Dashboard({ goToAnalysis }: Props) {
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  /* FETCH DATA */
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchData = () => {
      axios
        .get(`https://focus-tracker-backend-aqe3.onrender.com/data?userId=${userId}`)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  /* LOGOUT */
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  /* PREFS */
  const prefs = JSON.parse(localStorage.getItem("prefs") || "{}");

  const distractingSites: string[] = prefs?.distracting || [];
  const productiveSites: string[] = prefs?.productive || [];

  /* NORMALIZE */
  const normalize = (url: string) => {
    return url
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .split("/")[0]
      .toLowerCase();
  };

  /* BUILD MAP */
  const siteMap: Record<string, { time: number; count: number }> = {};

  data.forEach((item) => {
    if (!item.url) return;

    const site = normalize(item.url);

    if (!siteMap[site]) {
      siteMap[site] = { time: 0, count: 0 };
    }

    siteMap[site].time += item.timeSpent;
    siteMap[site].count += 1;
  });

  /* 🔥 CLASSIFICATION (FIXED + AI ADDED) */
  const tableData = Object.keys(siteMap).map((site) => {
    const seconds = Math.floor(siteMap[site].time / 1000);

    let type = "Unknown";

    if (distractingSites.some(s => site === s || site.endsWith("." + s))) {
      type = "Distracting";
    } else if (productiveSites.some(s => site === s || site.endsWith("." + s))) {
      type = "Productive";
    } else {
      // 🔥 AI fallback
      type = aiCache[site] || "Unknown";

      if (!aiCache[site]) {
        classifyWithAI(site).then(res => {
          aiCache[site] = res;
          setData(prev => [...prev]); // re-render
        });
      }
    }

    return {
      site,
      count: siteMap[site].count,
      time: seconds,
      type
    };
  });

  /* TOTALS */
  let productive = 0;
  let distracting = 0;

  tableData.forEach((item) => {
    if (item.type === "Productive") productive += item.time;
    if (item.type === "Distracting") distracting += item.time;
  });

  const pieData = [
    { name: "Productive", value: productive },
    { name: "Distracting", value: distracting }
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ color: "#1e3a8a" }}>Focus Tracker Dashboard</h1>
        <button onClick={logout} style={btn}>Logout</button>
      </div>

      {/* TABLE */}
      <h2>Website Usage</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tableData.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={cell}>S.No</th>
              <th style={cell}>Website</th>
              <th style={cell}>Link</th>
              <th style={cell}>Visits</th>
              <th style={cell}>Time (sec)</th>
              <th style={cell}>Type</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((item, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#f9fafb" : "white" }}>
                <td style={cell}>{i + 1}</td>
                <td style={cell}>{item.site}</td>
                <td style={cell}>
                  <a href={`https://${item.site}`} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </td>
                <td style={cell}>{item.count}</td>
                <td style={cell}>{item.time}</td>
                <td
                  style={{
                    ...cell,
                    color:
                      item.type === "Distracting"
                        ? "red"
                        : item.type === "Productive"
                        ? "green"
                        : "gray",
                    fontWeight: "bold"
                  }}
                >
                  {item.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* INSIGHT */}
      <div style={card}>
        <h3>Productivity Insight</h3>
        <p>
          You spent <strong>{productive}</strong> sec productively and{" "}
          <strong>{distracting}</strong> sec on distractions.
        </p>
      </div>

      {/* PIE */}
      {tableData.length > 0 && (
        <>
          <h2>Focus Distribution</h2>
          <PieChart width={350} height={300}>
            <Pie data={pieData} dataKey="value" outerRadius={100}>
              <Cell fill="green" />
              <Cell fill="red" />
            </Pie>
            <Tooltip />
          </PieChart>
        </>
      )}

      {/* BAR */}
      {tableData.length > 0 && (
        <>
          <h2>Website Time Analysis</h2>
          <BarChart width={600} height={300} data={tableData}>
            <XAxis dataKey="site" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="time" fill="#1e3a8a" />
          </BarChart>
        </>
      )}

      {/* BUTTON */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={goToAnalysis} style={btn}>
          Review Analysis
        </button>
      </div>

    </div>
  );
}

/* STYLES */

const btn = {
  padding: "10px 15px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginTop: "10px",
  border: "1px solid #ccc"
};

const cell = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center" as const
};

const card = {
  marginTop: "20px",
  padding: "15px",
  background: "#f1f5f9",
  borderRadius: "8px"
};