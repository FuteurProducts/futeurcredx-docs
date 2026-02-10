import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import FinlabCard from "./FinlabCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const durationOptions = [
  { title: "Monthly", value: "monthly" },
  { title: "Annually", value: "annually" },
];

type ExpenseItem = {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
};

interface ExpenseCategoryCardProps {
  items?: ExpenseItem[];
  column?: boolean;
  className?: string;
}

const defaultItems: ExpenseItem[] = [
  { name: "Subscribed", value: 1400.54, color: "var(--primary-02)" },
  { name: "Taxes", value: 1120.0, color: "var(--primary-03)" },
  { name: "Taxes 2", value: 850.11, color: "var(--primary-04)" },
  { name: "Others", value: 650.09, color: "var(--primary-01)" },
];

export const ExpenseCategoryCard = ({
  items = defaultItems,
  column = false,
  className = "",
}: ExpenseCategoryCardProps) => {
  const [duration, setDuration] = useState(durationOptions[0].value);

  const sum = items.reduce((n, { value }) => n + value, 0);

  return (
    <FinlabCard
      className={className}
      title="Expense Category"
      tooltip="Breakdown of your expenses by category"
      right={
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="w-[110px] h-12 text-sm border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <div
        className={`flex items-center mt-6 ${
          column ? "flex-col" : "flex-row"
        }`}
      >
        {/* Donut Chart */}
        <div className={`relative shrink-0 ${column ? "w-[190px] mx-auto mb-5" : "mr-8"}`}>
          <ResponsiveContainer width={190} height={190}>
            <PieChart>
              <Pie
                data={items}
                cx={90}
                cy={90}
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive={true}
              >
                {items.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[115px] h-[115px] rounded-full bg-card shadow-widget pointer-events-none">
            <div className="text-2xl font-bold text-foreground">100%</div>
            <div className="text-xs font-medium text-muted-foreground">Data Recorded</div>
          </div>
        </div>

        {/* Legend */}
        <div className={`flex-grow ${column ? "w-full" : "max-w-[330px] ml-auto"}`}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center ${
                column ? "mb-3.5 last:mb-0" : "mb-6 last:mb-0"
              }`}
            >
              <div
                className="shrink-0 w-3 h-3 mr-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="mr-auto font-semibold text-muted-foreground">
                {item.name}&nbsp;({((item.value / sum) * 100).toFixed(1)}%)
              </div>
              <div className="font-bold text-foreground">${item.value.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </FinlabCard>
  );
};

export default ExpenseCategoryCard;
