import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AnalysisCard from "./AnalysisCard";

interface IncomeDataItem {
  name: string;
  value: number;
}

interface IncomeAnalysisCardProps {
  items?: IncomeDataItem[];
  expense?: string;
  row?: boolean;
  className?: string;
}

const defaultItems: IncomeDataItem[] = [
  { name: "Jan", value: 4500 },
  { name: "Feb", value: 6200 },
  { name: "Mar", value: 8100 },
  { name: "Apr", value: 7300 },
];

const formatYAxis = (value: number) => {
  if (value === 0) return "";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
};

export const IncomeAnalysisCard = ({
  items = defaultItems,
  expense,
  row = false,
  className = "",
}: IncomeAnalysisCardProps) => {
  return (
    <AnalysisCard
      className={className}
      title="Income Analysis"
      tooltip="Your income trends over time"
      price="$8,527,224"
      percent={3.1}
      expense={expense}
      row={row}
    >
      <div className="h-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items}
            barSize={20}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--shade-08)" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fontWeight: 400, fill: "var(--shade-06)" }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fontWeight: 400, fill: "var(--shade-06)" }}
            />
            <Bar dataKey="value" fill="var(--primary-05)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalysisCard>
  );
};

export default IncomeAnalysisCard;
