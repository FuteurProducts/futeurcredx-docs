import { ChevronDown, Car, Gamepad2, PiggyBank, Gift } from "lucide-react";
import FinlabCard from "./FinlabCard";

interface PlanItem {
  id: string;
  title: string;
  price: string;
  icon: React.ReactNode;
}

interface PocketPlansCardProps {
  items?: PlanItem[];
  more?: boolean;
  row?: boolean;
  className?: string;
  onSeeMore?: () => void;
}

const defaultItems: PlanItem[] = [
  { id: "1", title: "New Car", price: "$5,000.00", icon: <Car className="w-5 h-5 text-muted-foreground" /> },
  { id: "2", title: "New Console", price: "$1,324.22", icon: <Gamepad2 className="w-5 h-5 text-muted-foreground" /> },
  { id: "3", title: "Savings", price: "$3,094.56", icon: <PiggyBank className="w-5 h-5 text-muted-foreground" /> },
  { id: "4", title: "Wedding Dress", price: "$1,191.68", icon: <Gift className="w-5 h-5 text-muted-foreground" /> },
];

export const PocketPlansCard = ({
  items = defaultItems,
  more = true,
  row = false,
  className = "",
  onSeeMore,
}: PocketPlansCardProps) => (
  <FinlabCard
    className={className}
    title="My Pocket Plans"
    tooltip="Your savings goals"
    onSeeMore={onSeeMore || (() => console.log("See more"))}
  >
    <div
      className={`flex flex-wrap mt-2 -mx-2 ${
        row
          ? "overflow-x-auto flex-nowrap scrollbar-hide mx-0 mt-4 -mx-6 px-6"
          : ""
      }`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`${
            row
              ? "flex-shrink-0 w-[151px] mr-4 last:mr-0"
              : "w-[calc(50%-16px)] mx-2 mt-4"
          } p-5 border border-border rounded-xl font-semibold`}
        >
          <div className="flex justify-center items-center w-10 h-10 mb-5 rounded-lg bg-muted">
            {item.icon}
          </div>
          <div className="text-base text-foreground">{item.title}</div>
          <div className="mt-0.5 text-muted-foreground text-sm">{item.price}</div>
        </div>
      ))}
    </div>
    
    {more && (
      <div className="mt-10 text-center">
        <button className="inline-flex items-center font-medium text-muted-foreground hover:text-foreground transition-colors">
          Load more <ChevronDown className="w-4 h-4 ml-1.5" />
        </button>
      </div>
    )}
  </FinlabCard>
);

export default PocketPlansCard;
