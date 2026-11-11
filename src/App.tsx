import "./App.css";
import Header from "./Header";
import HoldingRow from "./HoldingRow";
import type { Holding } from "./HoldingRow";
import SummaryCard from "./SummaryCard";
import { useState, useEffect } from "react";
import AllocationChart from "./allocationChart";
import Footer from "./Footer";

function App() {
  // setting the useState hooks at first since it has to go on top
  const [trades, setTrades] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState("All");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // first API call to get the senate trades data from the FMP API.
  // swabbed out the fetch URL to localhost:3000/api/trades, which is the endpoint of the backend server that I created to handle the API call to FMP API, and return the data to the frontend.
  useEffect(() => {
    async function loadTrades() {
      try {
        const response = await fetch(`${API_URL}/api/trades`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // unwrap the json data to get the trades array and change the "Trades" info
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

  // using Set to get unique member names from trades data and dropdown list, with hardcoded "All" goes first
  const memberNames = [
    "All",
    ...new Set(trades.map((t) => `${t.firstName} ${t.lastName}`)),
  ];

  // Ternary condition to filter trades based on names, show all trades if "All" is selected
  const visibleTrades =
    selectedMember === "All"
      ? trades
      : trades.filter((t) => `${t.firstName} ${t.lastName}` === selectedMember);

  // sorting the transactionDate in descending order, so the latest trades will be shown first.
  const sortedTrades = [...visibleTrades].sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime(),
  );

  // Below is the second API call for price and dayChange, ONLY when specific member is selected, to avoid unnecessary API calls.
  const [prices, setPrices] = useState<
    Record<string, { price: number; change: number }>
  >({});

  // putting a guard to prevent loading all prices for all members, which will spam the API quota
  useEffect(() => {
    if (selectedMember === "All") {
      setPrices({});
      return;
    }

    async function loadPrices() {
      const symbolsToPrice = trades
        .filter((t) => `${t.firstName} ${t.lastName}` === selectedMember)
        .map((t) => t.symbol);
      const uniqueSymbols = [...new Set(symbolsToPrice)];

      // if nothing to price? clear and stop
      if (uniqueSymbols.length === 0) {
        setPrices({});
        return;
      }

      try {
        // fetch from server endpoint
        const response = await fetch(
          `${API_URL}/api/prices?symbols=${uniqueSymbols.join(",")}`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPrices(data);
      } catch (err) {
        console.error("Failed to fetch prices", err);
      }
    }
    loadPrices();
  }, [selectedMember, trades]);

  return (
    <>
      <Header />
      <div className="picker-row">
        <label htmlFor="member">Filter by member:</label>
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
      <div className="dashboard-header">
        <div className="summary-row">
          <SummaryCard label="Trades Shown" value={`${visibleTrades.length}`} />
          <SummaryCard
            label="Total Members"
            value={`${memberNames.length - 1}`}
          />
        </div>

        {/* placing allocation chart */}
        <div className="chart-section">
          <AllocationChart trades={visibleTrades} />
        </div>
      </div>
      {loading && <p>Loading trades...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* including error handling message if no trade available for a particular member */}
      {!loading &&
        !error &&
        (visibleTrades.length === 0 ? (
          <p>No trades found for {selectedMember}.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Company</th>
                <th>Description</th>
                <th>Member</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Transaction Date</th>
                <th>Current Price</th>
                <th>Day Change</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((holding, index) => (
                <HoldingRow
                  key={index}
                  holding={{
                    ...holding,
                    currentPrice: prices[holding.symbol]?.price,
                    change: prices[holding.symbol]?.change,
                  }}
                />
              ))}
            </tbody>
          </table>
        ))}
      {/* adding disclaimer footer to the bottom of the page, to inform users about the data source and API limitations. */}
      <Footer />
    </>
  );
}

export default App;
