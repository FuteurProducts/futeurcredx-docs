import { useState } from "react";
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight, Send, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FinlabCard from "./FinlabCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const cards = [
  { title: "**** 7189", image: "/images/master-card.svg", value: "7189" },
  { title: "**** 4234", image: "/images/visa.svg", value: "4234" },
  { title: "**** 1231", image: "/images/master-card.svg", value: "1231" },
];

interface TotalBalanceCardProps {
  balance?: string;
  percent?: number;
  className?: string;
}

export const TotalBalanceCard = ({ 
  balance = "$12,456,315", 
  percent,
  className = ""
}: TotalBalanceCardProps) => {
  const [selectedCard, setSelectedCard] = useState(cards[0].value);
  const [showBalance, setShowBalance] = useState(true);

  return (
    <FinlabCard
      className={className}
      title="Total Balance"
      tooltip="Your total balance across all accounts"
      right={
        <Select value={selectedCard} onValueChange={setSelectedCard}>
          <SelectTrigger className="w-[130px] h-8 text-sm border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cards.map((card) => (
              <SelectItem key={card.value} value={card.value}>
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground">{card.title}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <div className="flex items-center mt-4 text-4xl font-bold text-foreground">
        {showBalance ? balance : "••••••••"}
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>

      {percent !== undefined && (
        <div className="flex items-center mt-4 text-base font-medium text-foreground">
          <div
            className={`flex items-center mr-3 px-2 py-0.5 rounded-md text-sm font-semibold ${
              percent >= 0
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {percent >= 0 ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5 -rotate-45" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5 rotate-45" />
            )}
            {percent > 0 ? `+${percent}` : percent}%
          </div>
          Increase this Month
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <Button
          className="flex-1 bg-foreground hover:bg-foreground/90 text-white rounded-xl h-11"
          onClick={() => {
            toast({ title: 'Transfer', description: 'Transfer functionality coming soon' });
          }}
        >
          <Send className="w-4 h-4 mr-2" />
          Transfer
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-2 border-foreground text-foreground hover:bg-foreground hover:text-white rounded-xl h-11"
          onClick={() => {
            toast({ title: 'Receive', description: 'Receive functionality coming soon' });
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Receive
        </Button>
      </div>
    </FinlabCard>
  );
};

export default TotalBalanceCard;
