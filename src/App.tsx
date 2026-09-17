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

  // first API call to get the senate trades data from the FMP API.
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
      const key = import.meta.env.VITE_FMP_KEY;
      const symbolsToPrice = trades
        .filter((t) => `${t.firstName} ${t.lastName}` === selectedMember)
        .map((t) => t.symbol);
      const uniqueSymbols = [...new Set(symbolsToPrice)];

      const newPrices: Record<string, { price: number; change: number }> = {};
      for (const symbol of uniqueSymbols) {
        try {
          const response = await fetch(
            `https://financialmodelingprep.com/stable/quote-short?symbol=${symbol}&apikey=${key}`,
          );
          if (!response.ok) continue;
          const data = await response.json();
          // print out the symbol and data to debug why some symbols are not returning data
          console.log(symbol, data);

          if (data[0]) {
            newPrices[symbol] = {
              price: data[0].price,
              change: data[0].change,
            };
          }
        } catch (err) {
          console.error(`Failed to fetch price for ${symbol}`, err);
        }
      }
      setPrices(newPrices);
    }

    loadPrices();
  }, [selectedMember, trades]);

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
              <th>Current Price</th>
              <th>Day Change</th>
            </tr>
          </thead>
          <tbody>
            {visibleTrades.map((holding, index) => (
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
      )}
    </>
  );
}

export default App;
