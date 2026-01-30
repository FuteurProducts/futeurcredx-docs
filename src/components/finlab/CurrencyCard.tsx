import { useState } from "react";
import FinlabCard from "./FinlabCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { title: "USD", value: "usd" },
  { title: "EUR", value: "eur" },
  { title: "CNY", value: "cny" },
  { title: "JPY", value: "jpy" },
];

interface CurrencyItem {
  id: string;
  title: string;
  price: string;
  description: string;
  flag: string;
}

interface CurrencyCardProps {
  items?: CurrencyItem[];
  viewItems?: number;
  className?: string;
}

const defaultItems: CurrencyItem[] = [
  { id: "1", title: "Rupiah", price: "15425,15", description: "IDR", flag: "🇮🇩" },
  { id: "2", title: "Euro", price: "0,95", description: "EUR", flag: "🇪🇺" },
  { id: "3", title: "Chinese Yuan", price: "7,06", description: "CNY", flag: "🇨🇳" },
];

export const CurrencyCard = ({
  items = defaultItems,
  viewItems = 3,
  className = "",
}: CurrencyCardProps) => {
  const [currency, setCurrency] = useState(currencies[0].value);

  return (
    <FinlabCard
      className={className}
      title="Currency"
      tooltip="Currency exchange rates"
      right={
        <div className="flex items-center h-12 border border-border rounded-full overflow-hidden">
          <div className="flex-shrink-0 w-[54px] border-r border-border text-center font-medium">
            1
          </div>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="flex-grow border-0 h-11 px-3 uppercase text-sm font-medium focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((cur) => (
                <SelectItem key={cur.value} value={cur.value}>
                  {cur.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="mt-8">
        {items.slice(0, viewItems).map((item) => (
          <div key={item.id} className="flex items-center mt-6 text-base font-bold">
            <div className="flex justify-center items-center w-[34px] h-[34px] rounded-full text-2xl">
              {item.flag}
            </div>
            <div className="flex items-center flex-1 pl-3.5">
              <div className="mr-auto pr-3 truncate text-foreground">{item.title}</div>
              <div className="mr-4 text-foreground">{item.price}</div>
              <div className="text-muted-foreground font-medium">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </FinlabCard>
  );
};

export default CurrencyCard;
