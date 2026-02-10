import { Clock, User, AlertCircle } from "lucide-react";
import { CaseStatus, CASE_STATUSES } from "@/constants/bankTerminology";
import { cn } from "@/lib/utils";

export interface CaseStatusBannerProps {
  status: CaseStatus;
  assignedAnalyst?: string;
  daysInQueue?: number;
  slaTarget?: number;
  className?: string;
}

const MAIN_STEPS: CaseStatus[] = [
  "pending_review",
  "in_review",
  "conditional",
  "approved",
];

const DECLINED_STEP: CaseStatus = "declined";

export function CaseStatusBanner({
  status,
  assignedAnalyst,
  daysInQueue,
  slaTarget,
  className,
}: CaseStatusBannerProps) {
  const isDeclined = status === "declined";
  const currentMainIndex = MAIN_STEPS.indexOf(status);

  function getSlaLabel(): {
    text: string;
    variant: "ok" | "warning" | "breach";
  } {
    if (daysInQueue == null || slaTarget == null) {
      return { text: "No SLA data", variant: "ok" };
    }
    if (daysInQueue < slaTarget) {
      return { text: "Within SLA", variant: "ok" };
    }
    if (daysInQueue === slaTarget) {
      return { text: "SLA at risk", variant: "warning" };
    }
    return { text: "SLA breached", variant: "breach" };
  }

  const sla = getSlaLabel();

  return (
    <div className={cn("bg-card rounded-xl border border-border p-4", className)}>
      {/* Step indicator */}
      <div className="flex items-start gap-0">
        {/* Main pipeline steps */}
        <div className="flex items-center flex-1">
          {MAIN_STEPS.map((step, index) => {
            const stepMeta = CASE_STATUSES[step];
            const isActive =
              !isDeclined && currentMainIndex >= 0 && index <= currentMainIndex;
            const isCurrent = !isDeclined && step === status;

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                {/* Circle */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                      isActive
                        ? "border-transparent text-white"
                        : "border-border bg-muted text-muted-foreground"
                    )}
                    style={
                      isActive
                        ? { backgroundColor: stepMeta.color }
                        : undefined
                    }
                  >
                    {isCurrent ? (
                      <span className="block w-2 h-2 rounded-full bg-white" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs whitespace-nowrap",
                      isCurrent
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {stepMeta.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < MAIN_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-1 mt-[-1rem] rounded-full transition-colors",
                      !isDeclined &&
                        currentMainIndex >= 0 &&
                        index < currentMainIndex
                        ? "bg-primary"
                        : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Declined branch */}
        <div className="flex items-center ml-3 pl-3 border-l border-dashed border-border">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                isDeclined
                  ? "border-transparent text-white bg-destructive"
                  : "border-destructive/30 bg-destructive/5 text-destructive/60 dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive/70"
              )}
            >
              {isDeclined ? (
                <span className="block w-2 h-2 rounded-full bg-white" />
              ) : (
                <span className="text-[10px]">X</span>
              )}
            </div>
            <span
              className={cn(
                "text-xs whitespace-nowrap",
                isDeclined
                  ? "font-semibold text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {CASE_STATUSES[DECLINED_STEP].label}
            </span>
          </div>
        </div>
      </div>

      {/* Metadata row */}
      <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {/* Assigned analyst */}
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>{assignedAnalyst || "Unassigned"}</span>
        </div>

        {/* Days in queue */}
        {daysInQueue != null && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {daysInQueue} {daysInQueue === 1 ? "day" : "days"} in queue
            </span>
          </div>
        )}

        {/* SLA status */}
        {daysInQueue != null && slaTarget != null && (
          <div
            className={cn("flex items-center gap-1.5 text-xs font-medium", {
              "text-success": sla.variant === "ok",
              "text-warning": sla.variant === "warning",
              "text-destructive": sla.variant === "breach",
            })}
          >
            {sla.variant === "breach" && (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>{sla.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseStatusBanner;
