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
  goBack: () => void;
};

export default function Analysis({ goBack }: Props) {
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    axios
      .get(`https://focus-tracker-backend-aqe3.onrender.com/data?userId=${userId}`)
      .then(res => {
        console.log("Analysis Data:", res.data); // debug
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ✅ Load user preferences
  const prefs = JSON.parse(localStorage.getItem("prefs") || "{}");
  const distractingSites: string[] = prefs?.distracting || [];
  const productiveSites: string[] = prefs?.productive || [];

  const siteMap: Record<string, number> = {};

  let productive = 0;
  let distracting = 0;

  data.forEach(item => {
    if (!item.url) return;

    const seconds = Math.floor(item.timeSpent / 1000);

    let site = "unknown";
    try {
      site = new URL(item.url).hostname;
    } catch {}

    if (!siteMap[site]) siteMap[site] = 0;
    siteMap[site] += seconds;

    if (distractingSites.some(s => site.includes(s))) {
      distracting += seconds;
    } else if (productiveSites.some(s => site.includes(s))) {
      productive += seconds;
    }
  });

  const barData = Object.keys(siteMap).map(site => ({
    site,
    time: siteMap[site]
  }));

  const pieData = [
    { name: "Productive", value: productive },
    { name: "Distracting", value: distracting }
  ];

  const total = productive + distracting;
  const productivityScore =
    total === 0 ? 0 : Math.round((productive / total) * 100);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ color: "#1e3a8a" }}>Detailed Analysis</h1>

        <button onClick={goBack} style={btn}>
          Back
        </button>
      </div>

      {/* EMPTY STATE */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p style={{ color: "gray" }}>
          No data available. Start browsing to generate analysis.
        </p>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          <div style={grid}>
            <Card title="Total Time" value={`${total} sec`} />
            <Card title="Productive Time" value={`${productive} sec`} />
            <Card title="Distracting Time" value={`${distracting} sec`} />
            <Card title="Productivity Score" value={`${productivityScore}%`} />
          </div>

          {/* INSIGHTS */}
          <div style={card}>
            <h3>Insights</h3>
            <p>
              Your productivity score is <strong>{productivityScore}%</strong>.
            </p>

            {productivityScore < 50 && (
              <p style={{ color: "red" }}>
                ⚠️ Too much distraction. Reduce time on non-productive sites.
              </p>
            )}

            {productivityScore >= 50 && productivityScore < 80 && (
              <p style={{ color: "orange" }}>
                👍 Decent focus, but can improve further.
              </p>
            )}

            {productivityScore >= 80 && (
              <p style={{ color: "green" }}>
                🔥 Excellent productivity!
              </p>
            )}
          </div>

          {/* PIE CHART */}
          <h2>Focus Distribution</h2>
          <PieChart width={350} height={300}>
            <Pie data={pieData} dataKey="value" outerRadius={100}>
              <Cell fill="green" />
              <Cell fill="red" />
            </Pie>
            <Tooltip />
          </PieChart>

          {/* BAR CHART */}
          <h2>Time per Website</h2>
          <BarChart width={600} height={300} data={barData}>
            <XAxis dataKey="site" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="time" fill="#1e3a8a" />
          </BarChart>
        </>
      )}
    </div>
  );
}

/* CARD COMPONENT */
function Card({ title, value }: any) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h4>{title}</h4>
      <h2 style={{ color: "#1e3a8a" }}>{value}</h2>
    </div>
  );
}

/* STYLES */

const btn = {
  background: "#1e3a8a",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginTop: "20px"
};

const card = {
  marginTop: "20px",
  padding: "15px",
  background: "#f1f5f9",
  borderRadius: "8px"
};