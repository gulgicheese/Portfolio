import "./App.css";
import Header from "./Header";
import HoldingRow from "./HoldingRow";
import fakeDataByPolitician from "./fakedata";
import SummaryCard from "./SummaryCard";
import { useState } from "react";

function App() {
  const politicians = Object.keys(fakeDataByPolitician);

  type PoliticianName = keyof typeof fakeDataByPolitician;

  const [selectedPolitician, setSelectedPolitician] = useState<PoliticianName>(
    politicians[0] as PoliticianName,
  );
  const holdings = fakeDataByPolitician[selectedPolitician];

  const totalHoldings = holdings.length;
  const totalValue = holdings.reduce(
    (sum, holding) => sum + holding.currentPrice,
    0,
  );
  return (
    <>
      <Header />

      <div className="picker-row">
        <label htmlFor="politician">Select member: </label>
        <select
          id="politician"
          value={selectedPolitician}
          onChange={(e) =>
            setSelectedPolitician(e.target.value as PoliticianName)
          }
        >
          {politicians.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="summary-row">
        <SummaryCard label="Total Holdings" value={`${totalHoldings}`} />
        <SummaryCard label="Total Value" value={`$${totalValue.toFixed(2)}`} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Company</th>
            <th>Trade Type</th>
            <th>Amount Range</th>
            <th>Transaction Date</th>
            <th>Current Price</th>
            <th>Day Change</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <HoldingRow key={holding.ticker} holding={holding} />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
