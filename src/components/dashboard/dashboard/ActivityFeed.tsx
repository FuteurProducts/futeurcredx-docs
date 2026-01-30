import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const activities = [
  { user: "Alice Johnson", action: "completed task", item: "Q4 Report", time: "2 minutes ago", initials: "AJ" },
  { user: "Bob Smith", action: "updated", item: "Marketing Campaign", time: "1 hour ago", initials: "BS" },
  { user: "Carol White", action: "created", item: "New Project", time: "3 hours ago", initials: "CW" },
  { user: "David Brown", action: "commented on", item: "Design Review", time: "5 hours ago", initials: "DB" },
  { user: "Eve Davis", action: "shared", item: "Sales Dashboard", time: "1 day ago", initials: "ED" },
];

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                  <span className="text-primary">{activity.item}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
