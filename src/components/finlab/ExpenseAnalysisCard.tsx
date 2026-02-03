import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import AnalysisCard from "./AnalysisCard";

interface ExpenseDataItem {
  name: string;
  value: number;
}

interface ExpenseAnalysisCardProps {
  items?: ExpenseDataItem[];
  expense?: string;
  row?: boolean;
  className?: string;
}

const defaultItems: ExpenseDataItem[] = [
  { name: "Jan", value: 2200 },
  { name: "Feb", value: 2800 },
  { name: "Mar", value: 2400 },
  { name: "Apr", value: 3100 },
  { name: "May", value: 2600 },
];

export const ExpenseAnalysisCard = ({
  items = defaultItems,
  expense,
  row = false,
  className = "",
}: ExpenseAnalysisCardProps) => {
  return (
    <AnalysisCard
      className={className}
      title="Expense Analysis"
      tooltip="Your expense trends over time"
      price="$2,056,123"
      percent={-2.1}
      expense={expense}
      row={row}
    >
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={items}
            margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide={true} />
            <YAxis hide={true} />
            <Area
              dot={{
                stroke: "hsl(var(--primary-01))",
                fill: "hsl(var(--background))",
                strokeWidth: 3,
                r: 5,
              }}
              type="linear"
              dataKey="value"
              stroke="hsl(var(--primary-01))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalysisCard>
  );
};

export default ExpenseAnalysisCard;
