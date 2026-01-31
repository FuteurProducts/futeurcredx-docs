import { useState, ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
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

interface AnalysisCardProps {
  title: string;
  tooltip?: string;
  price: string;
  percent: number;
  expense?: string;
  children: ReactNode;
  row?: boolean;
  className?: string;
}

export const AnalysisCard = ({
  title,
  tooltip = "Analysis data",
  price,
  percent,
  expense,
  children,
  row = false,
  className = "",
}: AnalysisCardProps) => {
  const [duration, setDuration] = useState(durationOptions[0].value);

  return (
    <FinlabCard
      className={`${row ? "pb-4" : ""} ${className}`}
      title={title}
      tooltip={tooltip}
      right={
        row ? (
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-[110px] h-8 text-sm border-border">
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
        ) : undefined
      }
    >
      <div className={`mt-4 ${row ? "flex items-center" : ""}`}>
        <div className={`${row ? "flex-grow" : "mb-7"}`}>
          <div className={`${row ? "flex items-start mb-4" : ""}`}>
            <div className={`text-4xl font-bold text-foreground ${row ? "mb-0" : "mb-4"}`}>
              {price}
            </div>
            <div className={`flex items-center text-base font-medium ${row ? "ml-4 mt-2" : ""}`}>
              <div
                className={`flex items-center mr-3 px-2 py-0.5 rounded-md text-sm font-semibold ${
                  percent >= 0
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {percent >= 0 ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" style={{ transform: 'rotate(-45deg)' }} />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" style={{ transform: 'rotate(45deg)' }} />
                )}
                {percent > 0 ? `+${percent}` : percent}%
              </div>
              {!row && "VS This Month"}
            </div>
          </div>
          
          {expense && (
            <div
              className={`text-base font-medium ${
                percent < 0 ? "text-destructive" : "text-foreground"
              }`}
            >
              Expense increased by{" "}
              <span className={percent < 0 ? "text-destructive font-semibold" : "text-success font-semibold"}>
                {expense}
              </span>{" "}
              This Month
            </div>
          )}
        </div>

        {!row && (
          <div className="flex justify-end mb-4">
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-[110px] h-8 text-sm border-border">
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
          </div>
        )}

        <div className={`${row ? "shrink-0 w-[180px] h-[110px] ml-4" : "h-[140px]"}`}>
          {children}
        </div>
      </div>
    </FinlabCard>
  );
};

export default AnalysisCard;
