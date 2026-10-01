import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Holding } from "./HoldingRow";

type AllocationChartProps = {
  trades: Holding[];
};

const COLORS = ["#2d6a4f", "#c1121f"];

function AllocationChart({ trades }: AllocationChartProps) {
  const purchaseCount = trades.filter((t) => t.type === "Purchase").length;
  const saleCount = trades.filter((t) => t.type === "Sale").length;

  const data = [
    { name: "Purchase", value: purchaseCount },
    { name: "Sale", value: saleCount },
  ].filter((entry) => entry.value > 0); // Filter out entries with zero value

  return (
    <div
      style={{ width: "100%", height: 300, marginTop: 10, marginBottom: 10 }}
    >
      <h3>Purchase vs Sale</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend position="top" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
export default AllocationChart;
