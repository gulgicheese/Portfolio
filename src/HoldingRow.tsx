export type Holding = {
  symbol: string;
  assetDescription: string;
  type: string;
  amount: string;
  transactionDate: string;
  firstName: string;
  lastName: string;
  currentPrice?: number;
  change?: number;
};

type HoldingRowProps = {
  holding: Holding;
};

function HoldingRow({ holding }: HoldingRowProps) {
  return (
    <tr>
      <td>{holding.symbol}</td>
      <td>{holding.assetDescription}</td>
      <td>
        {holding.firstName} {holding.lastName}
      </td>
      <td>{holding.type}</td>
      <td>{holding.amount}</td>
      <td>{holding.transactionDate}</td>
      <td>
        {holding.currentPrice != null
          ? `$${holding.currentPrice.toFixed(2)}`
          : "..."}
      </td>
      <td
        style={{
          color:
            holding.change == null
              ? "gray"
              : holding.change >= 0
                ? "green"
                : "red",
        }}
      >
        {" "}
        {holding.change != null ? holding.change.toFixed(2) : "..."}
      </td>
    </tr>
  );
}

export default HoldingRow;
