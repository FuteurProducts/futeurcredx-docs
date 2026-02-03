import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart
} from 'recharts';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  TimePeriodSelector,
  StatChange,
  type TimePeriod,
} from '@/components/ui/chart-utils';

// Types for real API data
interface ApiKey {
  id: string;
  name: string;
  key?: string;
  keyPrefix?: string;
  createdAt: string;
  lastUsed?: string | null;
  lastUsedAt?: string | null;
  callsUsed?: number;
  usageCount?: number;
  isActive?: boolean;
  environment?: string;
}

// API stats type used by the components below
type ApiStatsType = {
  totalCalls: number;
  monthlyLimit: number;
  plan: string;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  keyStats: Array<{
    keyId: string;
    keyName: string;
    callsUsed: number;
    lastUsed: string | null;
    isActive: boolean;
    environment: string;
  }>;
  totalCallsThisMonth: number;
  totalCallsLastMonth: number;
};

// Export the type for use in other files
export type { ApiStatsType };

// ============================================
// CARD WRAPPER
// ============================================

interface NCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  rightContent?: React.ReactNode;
  arrowTitle?: boolean;
  tooltip?: string;
  seeAllUrl?: string;
  option?: { id: string; title: string };
  setOption?: (option: { id: string; title: string }) => void;
  options?: { id: string; title: string }[];
}

// Custom Dropdown Component
interface DropdownProps {
  options: { id: string; title: string }[];
  value: { id: string; title: string };
  onChange: (option: { id: string; title: string }) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 bg-muted hover:bg-[#EFEFEF] border border-border rounded-xl text-[0.875rem] font-semibold text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0C68E9] focus:ring-offset-1"
      >
        <span>{value.title}</span>
        <svg 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          strokeWidth={2} 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[140px] py-2 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-[0.875rem] font-medium transition-colors ${
                  opt.id === value.id 
                    ? 'bg-[#0C68E9] text-white' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {opt.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const NCard: React.FC<NCardProps> = ({ 
  title, 
  children, 
  className = '', 
  rightContent,
  arrowTitle,
  tooltip,
  seeAllUrl,
  option,
  setOption,
  options
}) => {
  // Icon helper for NCard (keep for future use)
  void function IconImg({ name, iconClassName = "" }: { name: string; iconClassName?: string }) {
    const iconMap: Record<string, string> = {
      'arrow-next': '/icons/chevron-right.svg',
      'arrow-next-fat': '/icons/chevron-right.svg',
      'help': '/icons/help-circle.svg',
    };
    return (
      <img 
        src={iconMap[name] || '/icons/file-02.svg'} 
        alt={name}
        className={`w-4 h-4 ${iconClassName}`}
        style={{ filter: 'brightness(0) opacity(0.6)' }}
      />
    );
  };

  return (
    <div className={`bg-white rounded-2xl p-6 ${className || ""}`}>
      {(title || rightContent || options || seeAllUrl) && (
        <div className="relative z-2 flex justify-between items-center min-h-[2.5rem] mb-4">
          {title && (
            <div className="flex items-center text-[1.125rem] md:text-[1.125rem] font-semibold text-foreground">
              <div className={`truncate ${options ? "md:max-w-[33vw]" : ""}`}>
                {title}
              </div>
              {arrowTitle && (
                <svg className="w-5 h-5 ml-2 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {tooltip && (
                <div className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-[#F4F4F4] cursor-help">
                  <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          )}
          {options && option && setOption && (
            <CustomDropdown 
              options={options}
              value={option}
              onChange={setOption}
            />
          )}
          {seeAllUrl && (
            <a
              href={seeAllUrl}
              className="shrink-0 group inline-flex items-center text-[0.875rem] font-semibold text-[#0C68E9] hover:text-blue-700 transition-colors"
            >
              See all
              <svg className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
          {rightContent}
        </div>
      )}
      <div className="">{children}</div>
    </div>
  );
};

// ============================================
// BALANCE CHART (Area Chart with Gradient)
// ============================================

const chartBalanceData = [
  { name: "Oct", price: 2132.34 },
  { name: "Nov", price: 4212.55 },
  { name: "Dec", price: 2734.87 },
  { name: "Jan", price: 2256.87 },
  { name: "Feb", price: 4423.78 },
  { name: "Mar", price: 3090.1 },
];

const durationOptions = [
  { id: "0", title: "All time" },
  { id: "1", title: "Month" },
  { id: "2", title: "Year" },
];

// Professional tooltip with design system colors
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-popover/95 backdrop-blur-sm border border-border rounded-xl shadow-lg shadow-black/5">
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {label}
        </div>
        <div className="text-xl font-semibold text-foreground">
          ${payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export const BalanceChart: React.FC = () => {
  const [time, setTime] = useState(durationOptions[0]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1M');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading on period change
  const handlePeriodChange = (period: TimePeriod) => {
    setIsLoading(true);
    setTimePeriod(period);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <NCard
      title="Balance"
      arrowTitle
      option={time}
      setOption={setTime}
      options={durationOptions}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-end">
          <span className="text-[3rem] md:text-[2rem] font-semibold text-foreground">
            $3,200.80
          </span>
          <StatChange value={85.66} className="ml-3 mb-2" />
        </div>
        <TimePeriodSelector
          value={timePeriod}
          onChange={handlePeriodChange}
          periods={['7D', '1M', '3M', '1Y']}
        />
      </div>
      <ChartContainer isLoading={isLoading} height="14rem">
        <div className="h-[14rem] -mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartBalanceData}
              margin={{ top: 10, right: 6, left: 6, bottom: 0 }}
            >
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fill: 'hsl(var(--muted-foreground))',
                }}
                dy={4}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'hsl(var(--border))',
                  strokeWidth: 1,
                  fill: 'transparent',
                }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#balanceGradient)"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
                activeDot={{
                  r: 6,
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 3,
                  fill: 'hsl(var(--primary))',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </NCard>
  );
};

// ============================================
// TOP TOKENS (List with Mini Line Charts)
// ============================================

const topTokensData = [
  {
    id: "0",
    icon: "/lumiqlogo.png",
    currencyFull: "Ripple",
    currencyShort: "XRP",
    price: "$0.4831",
    percent: 26.66,
    itemsCharts: [
      { name: "1", price: 1000 },
      { name: "2", price: 1500 },
      { name: "3", price: 500 },
      { name: "4", price: 2500 },
      { name: "5", price: 2200 },
      { name: "6", price: 1400 },
      { name: "7", price: 1000 },
      { name: "8", price: 1500 },
      { name: "9", price: 500 },
      { name: "10", price: 2500 },
      { name: "11", price: 2200 },
      { name: "12", price: 1400 },
    ],
  },
  {
    id: "1",
    icon: "/lumiqlogo.png",
    currencyFull: "Ethereum",
    currencyShort: "ETH",
    price: "$2,968.31",
    percent: 15.42,
    itemsCharts: [
      { name: "1", price: 1500 },
      { name: "2", price: 1200 },
      { name: "3", price: 500 },
      { name: "4", price: 2000 },
      { name: "5", price: 3200 },
      { name: "6", price: 2400 },
      { name: "7", price: 1000 },
      { name: "8", price: 2500 },
      { name: "9", price: 1500 },
      { name: "10", price: 2500 },
      { name: "11", price: 2200 },
      { name: "12", price: 1800 },
    ],
  },
  {
    id: "2",
    icon: "/lumiqlogo.png",
    currencyFull: "Solana",
    currencyShort: "SOL",
    price: "$132.38",
    percent: -5.12,
    itemsCharts: [
      { name: "1", price: 600 },
      { name: "2", price: 1500 },
      { name: "3", price: 2500 },
      { name: "4", price: 1200 },
      { name: "5", price: 2800 },
      { name: "6", price: 1900 },
      { name: "7", price: 2400 },
      { name: "8", price: 2000 },
      { name: "9", price: 2200 },
      { name: "10", price: 1700 },
      { name: "11", price: 1300 },
      { name: "12", price: 900 },
    ],
  },
];

export const TopTokens: React.FC = () => {
  return (
    <NCard
      className="flex-1"
      title="Top tokens"
      tooltip="Tooltip top tokens"
      seeAllUrl="/"
    >
      <div className="-mx-3 pt-6 space-y-1 md:-mx-2">
        {topTokensData.map((item) => (
          <div
            key={item.id}
            className="flex items-center h-20 px-3 rounded-2xl border border-transparent transition-all duration-200 hover:border-border hover:bg-muted/30 md:px-2 cursor-pointer"
          >
            <div className="mr-5 md:mr-2">
              <img
                src={item.icon}
                alt={item.currencyFull}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="min-w-[6rem]">
              <div className="text-[0.9375rem] font-semibold text-foreground">
                {item.currencyFull}
              </div>
              <div className="text-[0.8125rem] text-muted-foreground">
                {item.currencyShort}
              </div>
            </div>
            <div className="w-18 h-9 mx-auto md:w-16 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={item.itemsCharts}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`tokenGradient-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={item.percent > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={item.percent > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={item.percent > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                    strokeWidth={2}
                    fill={`url(#tokenGradient-${item.id})`}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="min-w-[5.5rem] -mb-1.5 text-right">
              <div className="text-[0.9375rem] font-semibold text-foreground">{item.price}</div>
              <div className={cn(
                'text-[0.8125rem] font-semibold',
                item.percent > 0 ? 'text-success' : 'text-destructive'
              )}>
                {item.percent > 0 ? '+' : ''}{item.percent}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </NCard>
  );
};

// ============================================
// GREED INDEX (Pie Chart)
// ============================================

const greedData = [
  { name: "Red", value: 400 },
  { name: "Yellow", value: 250 },
  { name: "Pink", value: 350 },
  { name: "Green", value: 300 },
];

const GREED_COLORS = ["#F04D1A", "#FBA94B", "#B981DA", "#32AE60"];

export const GreedIndex: React.FC = () => {
  return (
    <NCard
      className="flex-1"
      title="Greed index"
      tooltip="Tooltip Greed index"
      seeAllUrl="/greed-index"
    >
      <div className="md:-mx-2">
        <div className="relative w-80 h-40 mt-14 mx-auto lg:my-8 md:mt-6 md:mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={400}>
              <Pie
                data={greedData}
                cx={155}
                cy={160}
                startAngle={180}
                endAngle={0}
                innerRadius={128}
                outerRadius={160}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
                stroke="transparent"
              >
                {greedData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GREED_COLORS[index % GREED_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-center">
            <div className="text-[3rem] md:text-[2.5rem] font-semibold text-foreground">82</div>
            <div className="text-[1.125rem] text-muted-foreground">
              Greed
            </div>
          </div>
        </div>
      </div>
    </NCard>
  );
};

// ============================================
// RECENT ACTIVITIES
// ============================================

const recentActivitiesData = [
  {
    id: "0",
    balance: true,
    wallet: "Ox3...d531B",
    status: "Completed",
    priceCrypto: "+3.32899 ETH",
    price: "-$10288,96 USD",
  },
  {
    id: "1",
    balance: false,
    wallet: "Ox3...d531B",
    status: "Pending",
    priceCrypto: "-1.32899 ETH",
    price: "-$4109,96 USD",
  },
  {
    id: "2",
    balance: true,
    wallet: "Ox3...d531B",
    status: "Completed",
    priceCrypto: "+0.3289 BTC",
    price: "+$20844,46 USD",
  },
  {
    id: "3",
    balance: false,
    wallet: "Ox3...d531B",
    status: "Completed",
    priceCrypto: "-3.32899 ETH",
    price: "-10295,01 USD",
  },
];

const Icon = ({ name, className = "" }: { name: string; className?: string }) => {
  const iconMap: Record<string, string> = {
    'arrow-up-right-long': '/icons/chevron-right.svg',
  };
  return (
    <img 
      src={iconMap[name] || '/icons/file-02.svg'} 
      alt={name}
      className={`w-5 h-5 ${className}`}
      style={{ filter: 'brightness(0) opacity(0.6)' }}
    />
  );
};

export const RecentActivities: React.FC = () => {
  return (
    <NCard
      className=""
      title="Recent activities"
      tooltip="Tooltip recent activities"
      seeAllUrl="/"
    >
      <div className="pt-6 space-y-1">
        {recentActivitiesData.map((item) => (
          <div className="flex items-center py-4" key={item.id}>
            <div
              className={`flex justify-center items-center shrink-0 w-10 h-12 mr-4 rounded-[0.625rem] md:mr-3 ${
                item.balance
                  ? "bg-[var(--n-brand-100)]"
                  : "bg-[var(--n-purple-100)]"
              }`}
            >
              <Icon
                className={`${
                  item.balance
                    ? ""
                    : "rotate-180"
                }`}
                name="arrow-up-right-long"
              />
            </div>
            <div className="mr-auto">
              <div className="flex items-center text-[0.9375rem] font-semibold text-[var(--n-primary)]">
                <div className="w-2 h-2 mr-2 rounded-full bg-[var(--n-green)]"></div>
                {item.wallet}
              </div>
              <div
                className={`text-[0.8125rem] font-semibold ${
                  item.status === "Pending"
                    ? "text-[var(--n-yellow)]"
                    : "text-[var(--n-green)]"
                }`}
              >
                {item.status}
              </div>
            </div>
            <div className="ml-3">
              <div className="flex justify-end items-center text-[0.9375rem] font-semibold text-[var(--n-primary)]">
                {item.priceCrypto}
                <div className="w-4 h-4 ml-2 rounded-full bg-[var(--n-surface-2)]"></div>
              </div>
              <div className="flex justify-end items-center text-[0.8125rem] font-semibold text-[var(--n-tertiary)]">
                {item.price}
                <div className="w-4 h-4 ml-2 rounded-full bg-[var(--n-surface-2)]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </NCard>
  );
};

// ============================================
// TOTAL BALANCE (Bar Chart - from MyAssets)
// ============================================

const chartTotalBalanceData = [
  { name: "1", price: 2133.22 },
  { name: "2", price: 4254.67 },
  { name: "3", price: 2787.98 },
  { name: "4", price: 2205.65 },
  { name: "5", price: 4423.74 },
  { name: "6", price: 2123.2 },
  { name: "7", price: 3111.54 },
];

const balanceDurationOptions = [
  { id: "0", title: "Last 7 days" },
  { id: "1", title: "Month" },
  { id: "2", title: "Year" },
];

const BarTooltip = ({ active, payload, label: _label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-popover/95 backdrop-blur-sm border border-border rounded-xl shadow-lg shadow-black/5">
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          28 Feb 2024
        </div>
        <div className="text-xl font-semibold text-foreground">
          ${payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export const TotalBalanceChart: React.FC = () => {
  const [time, setTime] = useState(balanceDurationOptions[0]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7D');
  const [isLoading, setIsLoading] = useState(false);

  const handlePeriodChange = (period: TimePeriod) => {
    setIsLoading(true);
    setTimePeriod(period);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <NCard
      className="grow"
      title="Total balance"
      option={time}
      setOption={setTime}
      options={balanceDurationOptions}
    >
      <div className="flex items-center justify-between mt-0.5 md:mt-2">
        <div className="flex items-end">
          <span className="text-[3rem] md:text-[2rem] font-semibold text-foreground">
            $3,200.80
          </span>
          <StatChange value={85.66} className="ml-3 mb-2" />
        </div>
        <TimePeriodSelector
          value={timePeriod}
          onChange={handlePeriodChange}
          periods={['7D', '1M', '3M']}
        />
      </div>
      <ChartContainer isLoading={isLoading} height="17.5rem">
        <div className="h-[17.5rem] mt-8 -mb-6 md:mt-4 md:-mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartTotalBalanceData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barSize={64}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
                horizontal={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fill: 'hsl(var(--muted-foreground))',
                }}
                dy={4}
              />
              <Tooltip
                content={<BarTooltip />}
                cursor={{
                  fill: 'hsl(var(--muted))',
                  opacity: 0.5,
                }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar
                dataKey="price"
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {chartTotalBalanceData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index > 2 ? 'hsl(var(--success) / 0.4)' : 'hsl(var(--primary))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </NCard>
  );
};

// ============================================
// BEST TO BUY (Area Chart - from MyAssets)
// ============================================

const chartBestToBuyData = [
  { name: "6 Apr", price: 2100 },
  { name: "7 Apr", price: 4200 },
  { name: "8 Apr", price: 2700 },
  { name: "9 Apr", price: 2200 },
  { name: "10 Apr", price: 3400 },
  { name: "11 Apr", price: 2400 },
  { name: "12 Apr", price: 3900 },
];

export const BestToBuy: React.FC = () => {
  const RefreshIcon = () => (
    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  return (
    <NCard
      className="card-sidebar"
      title="Best to buy"
      rightContent={
        <button className="group w-9 h-9 flex items-center justify-center border-2 border-border rounded-xl transition-all duration-200 hover:bg-muted hover:border-muted-foreground/20">
          <RefreshIcon />
        </button>
      }
    >
      <div className="pt-6">
        <div className="mb-3 text-[2rem] font-semibold text-foreground">
          $3,326.18
        </div>
        <div className="flex items-center">
          <div className="mr-2">
            <img
              src="/lumiqlogo.png"
              alt="Ethereum"
              className="w-6 h-6 rounded-full"
            />
          </div>
          <div className="text-[0.9375rem] font-semibold text-foreground">
            Ethereum <span className="text-muted-foreground">ETH</span>
          </div>
          <StatChange value={12.32} className="ml-2 text-sm" />
        </div>
        <div className="h-[9.5rem] my-2 -mx-6 md:-mx-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartBestToBuyData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="bestToBuyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#bestToBuyGradient)"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center mb-8 text-sm text-muted-foreground md:mb-6">
          <div className="mr-3">
            <img
              src="/lumiqlogo.png"
              alt="Method"
              className="w-6 h-6 rounded-full"
            />
          </div>
          Method: LSTM, Accuracy: 87%
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary flex-1 px-2 h-12 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
            Smart trade
          </button>
          <button className="btn-gray flex-1 px-2 h-12 bg-muted text-foreground rounded-full font-semibold hover:bg-muted/80 transition-colors">
            Set Alert
          </button>
        </div>
      </div>
    </NCard>
  );
};

// ============================================
// REAL DATA COMPONENTS
// ============================================

// API Usage Overview Card - Line Chart like Balance
interface ApiUsageOverviewProps {
  totalCalls: number;
  monthlyLimit: number;
  plan: string;
  growth: number;
  isLoading?: boolean;
  monthlyData?: { name: string; calls: number }[];
}

const ApiUsageTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-popover/95 backdrop-blur-sm border border-border rounded-xl shadow-lg shadow-black/5">
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {label}
        </div>
        <div className="text-xl font-semibold text-foreground">
          {payload[0].value.toLocaleString()} calls
        </div>
      </div>
    );
  }
  return null;
};

export const ApiUsageOverview: React.FC<ApiUsageOverviewProps> = ({
  totalCalls,
  growth,
  isLoading,
  monthlyData
}) => {
  const [time, setTime] = useState({ id: "0", title: "All time" });
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1M');
  const timeOptions = [
    { id: "0", title: "All time" },
    { id: "1", title: "This month" },
    { id: "2", title: "This year" },
  ];

  const chartData = monthlyData || [
    { name: "Oct", calls: Math.round(totalCalls * 0.4) },
    { name: "Nov", calls: Math.round(totalCalls * 0.6) },
    { name: "Dec", calls: Math.round(totalCalls * 0.5) },
    { name: "Jan", calls: Math.round(totalCalls * 0.8) },
    { name: "Feb", calls: Math.round(totalCalls * 0.9) },
    { name: "Mar", calls: totalCalls },
  ];

  const growthPercent = growth || 85.66;

  return (
    <NCard
      title="API Usage"
      arrowTitle
      option={time}
      setOption={setTime}
      options={timeOptions}
    >
      <ChartContainer isLoading={isLoading} height="18rem">
        <div className="flex items-center justify-between md:mt-4 mb-2">
          <div className="flex items-end">
            <span className="text-[3rem] md:text-[2rem] font-semibold text-foreground">
              {totalCalls.toLocaleString()}
            </span>
            <StatChange value={growthPercent} className="ml-3 mb-2" />
          </div>
          <TimePeriodSelector
            value={timePeriod}
            onChange={setTimePeriod}
            periods={['7D', '1M', '3M', '1Y']}
          />
        </div>
        <div className="h-[14rem] -mb-2 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 6, left: 6, bottom: 0 }}
            >
              <defs>
                <linearGradient id="apiUsageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fill: 'hsl(var(--muted-foreground))',
                }}
                dy={4}
              />
              <Tooltip
                content={<ApiUsageTooltip />}
                cursor={{
                  stroke: 'hsl(var(--border))',
                  strokeWidth: 1,
                  fill: 'transparent',
                }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#apiUsageGradient)"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
                activeDot={{
                  r: 6,
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 3,
                  fill: 'hsl(var(--primary))',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </NCard>
  );
};

// API Keys List Card
interface ApiKeysListProps {
  apiKeys: ApiKey[];
  isLoading?: boolean;
  onManageKeys?: () => void;
}

export const ApiKeysList: React.FC<ApiKeysListProps> = ({ 
  apiKeys, 
  isLoading,
  onManageKeys 
}) => {
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <NCard
      className="flex-1"
      title="API Keys"
      tooltip="Your active API keys"
      seeAllUrl="#"
      rightContent={
        <button 
          onClick={onManageKeys}
          className="text-[0.875rem] font-semibold text-[#0C68E9] hover:text-blue-600"
        >
          Manage
        </button>
      }
    >
      {isLoading ? (
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="pt-6 text-center text-muted-foreground">
          <p className="text-[0.9375rem]">No API keys yet</p>
          <button
            onClick={onManageKeys}
            className="mt-3 px-4 py-2 bg-[#0C68E9] text-white rounded-xl font-semibold text-[0.875rem]"
          >
            Create API Key
          </button>
        </div>
      ) : (
        <div className="-mx-3 pt-4 space-y-1">
          {apiKeys.slice(0, 5).map((key) => (
            <div
              key={key.id}
              className="flex items-center h-16 px-3 rounded-2xl border border-transparent transition-colors hover:border-border cursor-pointer"
            >
              <div className="flex justify-center items-center w-10 h-10 mr-4 rounded-xl bg-[#D8F0FF]">
                <svg className="w-5 h-5 text-[#0C68E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.9375rem] font-semibold text-foreground truncate">
                  {key.name}
                </div>
                <div className="text-[0.8125rem] text-muted-foreground">
                  {key.environment || 'development'}
                </div>
              </div>
              <div className="text-right ml-3">
                <div className="text-[0.9375rem] font-semibold text-foreground">
                  {(key.callsUsed || key.usageCount || 0).toLocaleString()} calls
                </div>
                <div className="text-[0.8125rem] text-muted-foreground">
                  {formatDate(key.lastUsed || key.lastUsedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </NCard>
  );
};

// Usage Limit Gauge (like Greed Index - colorful speedometer)
interface UsageLimitGaugeProps {
  used: number;
  limit: number;
  plan: string;
}

// Counter animation hook for smooth number counting
const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function: ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

// Static data outside component
const usageGaugeData = [
  { name: "Red", value: 400 },
  { name: "Yellow", value: 250 },
  { name: "Pink", value: 350 },
  { name: "Green", value: 300 },
];

const USAGE_GAUGE_COLORS = ["#F04D1A", "#FBA94B", "#B981DA", "#32AE60"];

export const UsageLimitGauge: React.FC<UsageLimitGaugeProps> = ({ used, limit, plan }) => {
  const percentage = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0;
  const remaining = limit - used;
  
  // Animated percentage counter
  const animatedPercentage = useCountUp(percentage, 1500);
  
  // Get status text and color based on percentage
  const getStatus = () => {
    if (percentage >= 90) return { text: 'Critical', color: '#F04D1A' };
    if (percentage >= 70) return { text: 'High', color: '#FBA94B' };
    if (percentage >= 40) return { text: 'Moderate', color: '#B981DA' };
    return { text: 'Low', color: '#32AE60' };
  };

  const status = getStatus();

  return (
    <NCard
      className="flex-1"
      title="Usage Limit"
      tooltip="Your monthly API call limit"
    >
      <div className="md:-mx-2">
        <div className="relative w-80 h-40 mt-14 mx-auto lg:my-8 md:mt-6 md:mb-2">
          {/* Gauge */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={400}>
              <Pie
                data={usageGaugeData}
                cx={155}
                cy={160}
                startAngle={180}
                endAngle={0}
                innerRadius={128}
                outerRadius={160}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
                stroke="transparent"
              >
                {usageGaugeData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={USAGE_GAUGE_COLORS[index % USAGE_GAUGE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center display - animated counter */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-center">
            <div className="text-[3rem] md:text-[2.5rem] font-semibold text-foreground">
              {animatedPercentage}
            </div>
            <div className="text-[1.125rem] font-semibold" style={{ color: status.color }}>
              {status.text}
            </div>
          </div>
        </div>
        
        {/* Stats below gauge */}
        <div className="mt-2 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[0.8125rem] text-muted-foreground">API Calls Used</div>
              <div className="text-[1.5rem] font-semibold text-foreground">{used.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-[0.8125rem] text-muted-foreground">Remaining</div>
              <div className={`text-[1.5rem] font-semibold ${remaining > 0 ? 'text-success' : 'text-destructive'}`}>
                {remaining > 0 ? remaining.toLocaleString() : '0'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[0.8125rem] text-muted-foreground">Monthly Limit</div>
              <div className="text-[1.5rem] font-semibold text-foreground">{limit.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-[#D8F0FF] text-[#0C68E9] rounded-full text-[0.875rem] font-semibold">
              {plan} Plan
            </span>
          </div>
        </div>
      </div>
    </NCard>
  );
};

// Quick Stats Card
interface QuickStatsProps {
  stats: {
    label: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
  }[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <NCard title="Quick Stats">
      <div className="grid grid-cols-2 gap-4 pt-2">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 bg-muted rounded-xl">
            <div className="text-[0.8125rem] text-muted-foreground mb-1">{stat.label}</div>
            <div className="flex items-end gap-2">
              <span className="text-[1.5rem] font-semibold text-foreground">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </span>
              {stat.change !== undefined && (
                <span className={`text-[0.8125rem] font-semibold ${stat.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {stat.change >= 0 ? '+' : ''}{stat.change}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </NCard>
  );
};

// Recent API Activity
interface RecentApiActivityProps {
  activities: {
    id: string;
    endpoint: string;
    status: 'success' | 'error' | 'pending';
    timestamp: string;
    responseTime?: number;
  }[];
  isLoading?: boolean;
}

export const RecentApiActivity: React.FC<RecentApiActivityProps> = ({ activities, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success/10 text-success';
      case 'error': return 'bg-destructive/10 text-destructive';
      case 'pending': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <NCard
      title="Recent Activity"
      tooltip="Latest API calls"
      seeAllUrl="#"
    >
      {isLoading ? (
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-32 mb-1"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="pt-6 text-center text-muted-foreground">
          <p className="text-[0.9375rem]">No recent activity</p>
        </div>
      ) : (
        <div className="pt-4 space-y-2">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center py-3">
              <div className={`flex justify-center items-center w-10 h-10 mr-3 rounded-xl ${getStatusColor(activity.status)}`}>
                {activity.status === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : activity.status === 'error' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.9375rem] font-semibold text-foreground truncate">
                  {activity.endpoint}
                </div>
                <div className="text-[0.8125rem] text-muted-foreground">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
              {activity.responseTime && (
                <div className="text-[0.8125rem] text-muted-foreground ml-2">
                  {activity.responseTime}ms
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </NCard>
  );
};

// ============================================
// CREDIT INTELLIGENCE DASHBOARD CHARTS
// ============================================

// Mock data for charts
const conversionLiftData = [
  { date: 'Nov 26', without: 18.2, with: 18.5 },
  { date: 'Nov 28', without: 17.8, with: 18.8 },
  { date: 'Dec 1', without: 18.0, with: 19.2 },
  { date: 'Dec 3', without: 17.5, with: 19.5 },
  { date: 'Dec 6', without: 18.1, with: 20.0 },
  { date: 'Dec 8', without: 17.9, with: 20.3 },
  { date: 'Dec 11', without: 18.3, with: 20.8 },
  { date: 'Dec 14', without: 18.0, with: 21.2 },
  { date: 'Dec 16', without: 17.7, with: 21.5 },
  { date: 'Dec 19', without: 18.2, with: 21.8 },
  { date: 'Dec 21', without: 18.0, with: 22.0 },
  { date: 'Dec 24', without: 17.8, with: 22.5 },
];

const latencyDistributionData = [
  { percentile: '50th', value: 89 },
  { percentile: '75th', value: 124 },
  { percentile: '90th', value: 156 },
  { percentile: '95th', value: 198 },
  { percentile: '99th', value: 287 },
];

const revenueImpactData = [
  { date: 'Nov 26', value: 95000 },
  { date: 'Nov 28', value: 102000 },
  { date: 'Dec 1', value: 110000 },
  { date: 'Dec 3', value: 108000 },
  { date: 'Dec 5', value: 115000 },
  { date: 'Dec 8', value: 125000 },
  { date: 'Dec 10', value: 130000 },
  { date: 'Dec 12', value: 128000 },
  { date: 'Dec 14', value: 140000 },
  { date: 'Dec 17', value: 145000 },
  { date: 'Dec 19', value: 155000 },
  { date: 'Dec 21', value: 160000 },
  { date: 'Dec 24', value: 175000 },
];

const approvalRateTrendData = [
  { month: 'Jul', applications: 800, approved: 400, rate: 50 },
  { month: 'Aug', applications: 900, approved: 350, rate: 39 },
  { month: 'Sep', applications: 1000, approved: 500, rate: 50 },
  { month: 'Oct', applications: 1100, approved: 550, rate: 50 },
  { month: 'Nov', applications: 1150, approved: 600, rate: 52 },
  { month: 'Dec', applications: 1200, approved: 650, rate: 54 },
];

// Stat Card with Sparkline
interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  color: 'cyan' | 'green' | 'purple' | 'yellow' | 'emerald';
  sparklineData?: number[];
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, color, sparklineData }) => {
  const colorMap = {
    cyan: { bg: 'bg-cyan-50', line: '#06B6D4' },
    green: { bg: 'bg-success/10', line: '#22C55E' },
    purple: { bg: 'bg-purple-50', line: '#A855F7' },
    yellow: { bg: 'bg-yellow-50', line: '#EAB308' },
    emerald: { bg: 'bg-success/10', line: '#10B981' },
  };
  
  const sparkData = sparklineData || Array.from({ length: 12 }, () => Math.random() * 100);
  
  return (
    <div className={`${colorMap[color].bg} rounded-2xl p-5 relative overflow-hidden`}>
      <div className="text-[0.875rem] text-muted-foreground mb-2">{title}</div>
      <div className="text-[2rem] font-semibold text-foreground mb-1">{value}</div>
      <div className={`flex items-center gap-1 text-[0.8125rem] font-medium ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
        <svg className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 14l5-5 5 5H7z" />
        </svg>
        {change >= 0 ? '+' : ''}{change}% vs last period
      </div>
      {/* Sparkline */}
      <div className="absolute bottom-0 left-0 right-0 h-12 opacity-50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData.map((v, _i) => ({ value: v }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={colorMap[color].line} 
              fill={colorMap[color].line}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Credit Intelligence Dashboard Header
export const CreditIntelligenceDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const animatedCount = useCountUp(915, 1500);
  
  return (
    <div className="bg-white rounded-2xl p-6 mb-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[1.5rem] font-semibold text-foreground">Credit Intelligence Dashboard</h2>
          <p className="text-muted-foreground text-[0.9375rem]">Real-time API performance, conversion metrics, and revenue analytics</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Live Counter */}
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[0.8125rem] text-muted-foreground">Live Scoring Counter</span>
            </div>
            <div className="text-[1.5rem] font-semibold text-foreground">{animatedCount}</div>
            <div className="text-[0.75rem] text-muted-foreground">applications scored today</div>
          </div>
          {/* Time Range Toggle */}
          <div className="flex bg-muted rounded-xl p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-colors ${
                  timeRange === range ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <StatCard title="Apps Scored Today" value={animatedCount} change={12.3} color="cyan" />
        <StatCard title="Conversion Rate" value="16.7%" change={3.2} color="green" />
        <StatCard title="Approval Rate" value="75.6%" change={5.4} color="purple" />
        <StatCard title="Avg Decision Latency" value="134ms" change={8.1} color="yellow" />
        <StatCard title="Revenue Impact" value="$11.54M" change={18.7} color="emerald" />
      </div>
    </div>
  );
};

// Conversion Lift Over Time Chart
export const ConversionLiftChart: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1M');

  return (
    <NCard
      className="flex-1"
      rightContent={
        <div className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-full text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          +38.4% Lift
        </div>
      }
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground">Conversion Lift Over Time</h3>
          </div>
          <p className="text-sm text-muted-foreground">Comparing conversion rates with and without LUMIQ AI integration</p>
        </div>
        <TimePeriodSelector
          value={timePeriod}
          onChange={setTimePeriod}
          periods={['7D', '1M', '3M']}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground" />
          <span className="text-sm text-muted-foreground">Without LUMIQ AI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm font-medium text-success">With LUMIQ AI</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={conversionLiftData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="p-4 bg-popover/95 backdrop-blur-sm border border-border rounded-xl shadow-lg shadow-black/5">
                    <div className="mb-2 text-xs font-medium text-muted-foreground">{label}</div>
                    {payload.map((entry: any) => (
                      <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-sm text-muted-foreground">
                            {entry.dataKey === 'with' ? 'With LUMIQ AI' : 'Without LUMIQ AI'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{entry.value?.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                );
              }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Area
              type="monotone"
              dataKey="without"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              fill="transparent"
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="with"
              stroke="hsl(var(--success))"
              fill="url(#colorWith)"
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Footer */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Baseline Avg</div>
          <div className="text-2xl font-semibold text-foreground">12.5%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">With LUMIQ AI Avg</div>
          <div className="text-2xl font-semibold text-success">17.3%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Peak Conversion</div>
          <div className="text-2xl font-semibold text-success">21.8%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Avg Lift</div>
          <div className="text-2xl font-semibold text-primary">+38.4%</div>
        </div>
      </div>
    </NCard>
  );
};

// Processing Latency Distribution Chart
export const LatencyDistributionChart: React.FC = () => {
  return (
    <NCard className="flex-1">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-[#FBA94B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-[1.125rem] font-semibold text-foreground">Processing Latency Distribution</h3>
          </div>
          <p className="text-[0.8125rem] text-muted-foreground">Response time percentiles (ms)</p>
        </div>
        <div className="px-4 py-1.5 bg-success/10 text-success rounded-full text-[0.875rem] font-medium border border-success/20">
          p95 &lt; 200ms
        </div>
      </div>
      
      {/* Horizontal Bar Chart */}
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={latencyDistributionData} 
            layout="vertical" 
            margin={{ top: 0, right: 20, left: 50, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" horizontal={false} />
            <XAxis 
              type="number" 
              domain={[0, 300]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6F767E' }}
              tickFormatter={(v) => `${v}ms`}
            />
            <YAxis 
              type="category"
              dataKey="percentile"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6F767E' }}
              width={50}
            />
            <Bar 
              dataKey="value" 
              fill="#FBA94B" 
              radius={[0, 4, 4, 0]}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Stats Footer */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
        {latencyDistributionData.map((item) => (
          <div key={item.percentile} className="text-center">
            <div className="text-[0.75rem] text-muted-foreground">{item.percentile}</div>
            <div className="text-[1.25rem] font-semibold text-foreground">
              {item.value}<span className="text-[0.875rem] font-normal text-muted-foreground">ms</span>
            </div>
          </div>
        ))}
      </div>
    </NCard>
  );
};

// Revenue Impact Chart
export const RevenueImpactChart: React.FC = () => {
  return (
    <NCard className="flex-1">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-[#0C68E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-[1.125rem] font-semibold text-foreground">Revenue Impact</h3>
          </div>
          <p className="text-[0.8125rem] text-muted-foreground">Daily revenue from API-driven approvals</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-success/10 text-success rounded-full text-[0.875rem] font-medium border border-success/20">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          $2.85M this period
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueImpactData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0C68E9" />
                <stop offset="100%" stopColor="#32AE60" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6F767E' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #EFEFEF', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [value !== undefined ? `$${(Number(value) / 1000).toFixed(0)}K` : '-', 'Revenue']}
            />
            <Bar 
              dataKey="value" 
              fill="#0C68E9" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </NCard>
  );
};

// Approval Rate Trend Chart
export const ApprovalRateTrendChart: React.FC = () => {
  return (
    <NCard className="flex-1">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-[#32AE60]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-[1.125rem] font-semibold text-foreground">Approval Rate Trend</h3>
          </div>
          <p className="text-[0.8125rem] text-muted-foreground">Monthly approval rates and volumes</p>
        </div>
        <div className="px-4 py-1.5 bg-success/10 text-success rounded-full text-[0.875rem] font-medium border border-success/20">
          75% avg rate
        </div>
      </div>
      
      {/* Combined Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={approvalRateTrendData} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6F767E' }}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6F767E' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#A855F7' }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #EFEFEF', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="applications" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Applications" yAxisId="left" isAnimationActive={true} animationDuration={1500} />
            <Bar dataKey="approved" fill="#32AE60" radius={[4, 4, 0, 0]} name="Approved" yAxisId="left" isAnimationActive={true} animationDuration={1500} />
            <Line type="monotone" dataKey="rate" stroke="#A855F7" strokeWidth={2} dot={{ fill: '#A855F7', r: 4 }} name="Approval Rate %" yAxisId="right" isAnimationActive={true} animationDuration={1500} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#E5E7EB]" />
          <span className="text-[0.8125rem] text-muted-foreground">Applications</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#32AE60]" />
          <span className="text-[0.8125rem] text-[#32AE60]">Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-[#A855F7]" />
          <span className="text-[0.8125rem] text-[#A855F7]">Approval Rate %</span>
        </div>
      </div>
    </NCard>
  );
};
