import { ReactNode } from "react";
import { Info, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FinlabCardProps {
  className?: string;
  title: string;
  tooltip?: string;
  onSeeMore?: () => void;
  center?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}

export const FinlabCard = ({
  className = "",
  title,
  tooltip,
  onSeeMore,
  center,
  right,
  children,
}: FinlabCardProps) => (
  <div className={`mt-6 p-6 bg-white rounded-2xl ${className}`}>
    <div className="flex items-start">
      <div className="mr-auto text-lg font-semibold text-foreground flex items-center gap-1.5">
        {title}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {center}
      {onSeeMore && (
        <button
          className="flex items-center h-7 font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={onSeeMore}
        >
          See more <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      )}
      {right && <div className="flex items-center min-h-[27px] ml-3">{right}</div>}
    </div>
    {children}
  </div>
);

export default FinlabCard;
