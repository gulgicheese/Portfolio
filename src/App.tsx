import "./App.css";
import Header from "./Header";
import HoldingRow from "./HoldingRow";
import type { Holding } from "./HoldingRow";
import SummaryCard from "./SummaryCard";
import { useState, useEffect } from "react";

function App() {
  const [trades, setTrades] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState("All");

  useEffect(() => {
    async function loadTrades() {
      try {
        const key = import.meta.env.VITE_FMP_KEY;
        const response = await fetch(
          `https://financialmodelingprep.com/stable/senate-latest?apikey=${key}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTrades(data);
      } catch (err) {
        setError("Could not load trades. Check your connect or API key.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTrades();
  }, []);

  const memberNames = [
    "All",
    ...new Set(trades.map((t) => `${t.firstName} ${t.lastName}`)),
  ];

  const visibleTrades =
    selectedMember === "All"
      ? trades
      : trades.filter((t) => `${t.firstName} ${t.lastName}` === selectedMember);

  return (
    <>
      <Header />

      <div className="picker-row">
        <label htmlFor="member">Filter by member: </label>
        <select
          id="member"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          {memberNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="summary-row">
        <SummaryCard label="Trades Shown" value={`${visibleTrades.length}`} />
        <SummaryCard
          label="Total Members"
          value={`${memberNames.length - 1}`}
        />
      </div>

      {loading && <p>Loading trades...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Company</th>
              <th>Member</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {visibleTrades.map((holding, index) => (
              <HoldingRow key={index} holding={holding} />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default App;
