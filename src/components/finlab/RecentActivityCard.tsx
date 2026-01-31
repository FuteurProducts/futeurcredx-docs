import FinlabCard from "./FinlabCard";

interface ActivityItem {
  id: string;
  title: string;
  price: string;
  description: string;
  time: string;
  image: string;
}

interface RecentActivityCardProps {
  items?: ActivityItem[];
  viewItems?: number;
  className?: string;
  onSeeMore?: () => void;
}

const defaultItems: ActivityItem[] = [
  {
    id: "1",
    title: "Figma Pro",
    price: "-$23.21",
    description: "Subscriptions",
    time: "15/02/22 - 12.34",
    image: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg",
  },
  {
    id: "2",
    title: "Adobe Collection",
    price: "-$50.21",
    description: "Subscriptions",
    time: "14/02/22 - 8.55",
    image: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/adobe.svg",
  },
  {
    id: "3",
    title: "Fiverr",
    price: "+$100.00",
    description: "Receive",
    time: "11/02/22 - 13.33",
    image: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fiverr.svg",
  },
  {
    id: "4",
    title: "Starbucks",
    price: "-$50.00",
    description: "Transfer",
    time: "02/02/22 - 9.15",
    image: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/starbucks.svg",
  },
];

export const RecentActivityCard = ({
  items = defaultItems,
  viewItems = 4,
  className = "",
  onSeeMore,
}: RecentActivityCardProps) => (
  <FinlabCard
    className={className}
    title="Recent Activity"
    tooltip="Your latest transactions"
    onSeeMore={onSeeMore || (() => console.log("See more"))}
  >
    <div className="-mt-2">
      {items.slice(0, viewItems).map((item) => (
        <div key={item.id} className="flex items-center mt-8">
          <div className="flex justify-center items-center w-[52px] h-[52px] rounded-full bg-[#F4F4F7]">
            <img
              src={item.image}
              alt={item.title}
              className="w-6 h-6 opacity-70"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 pl-3">
            <div className="flex items-center mb-1.5">
              <div className="mr-auto pr-3 text-base font-semibold text-foreground truncate">
                {item.title}
              </div>
              <div className={`font-semibold ${item.price.startsWith('+') ? 'text-success' : 'text-foreground'}`}>
                {item.price}
              </div>
            </div>
            <div className="flex items-center text-muted-foreground font-medium">
              <div className="mr-auto pr-3 truncate">{item.description}</div>
              <div className="text-sm">{item.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </FinlabCard>
);

export default RecentActivityCard;
