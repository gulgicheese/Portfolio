type Holdiing = {
  ticker: string;
  company: string;
  tradeType: string;
  amountRange: string;
  txDate: string;
  currentPrice: number;
  dayChange: number;
};

type HoldingRowProps = {
  holding: Holdiing;
};

function HoldingRow({ holding }: HoldingRowProps) {
  return (
    <tr>
      <td>{holding.ticker}</td>
      <td>{holding.company}</td>
      <td>{holding.tradeType}</td>
      <td>{holding.amountRange}</td>
      <td>{holding.txDate}</td>
      <td>{holding.currentPrice.toFixed(2)}</td>
      <td>{holding.dayChange.toFixed(2)}</td>
    </tr>
  );
}

export default HoldingRow;
