export type Holding = {
  symbol: string;
  assetDescription: string;
  type: string;
  amount: string;
  transactionDate: string;
  firstName: string;
  lastName: string;
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
    </tr>
  );
}

export default HoldingRow;
