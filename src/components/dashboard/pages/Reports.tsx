import { DashboardLayout } from "@/components/dashboard/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
  { id: "r-1001", date: "2025-06-01", name: "Monthly Usage Summary", type: "Usage", format: "CSV", size: "120 KB" },
  { id: "r-1002", date: "2025-06-01", name: "API Keys Audit", type: "Security", format: "PDF", size: "340 KB" },
  { id: "r-1003", date: "2025-05-01", name: "Conversion & Approvals", type: "Analytics", format: "XLSX", size: "910 KB" },
  { id: "r-1004", date: "2025-04-01", name: "Region Latency Breakdown", type: "Ops", format: "CSV", size: "85 KB" },
];

const Reports = () => {
  return (
    <DashboardLayout hideSidebar>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <div className="flex gap-2">
            <Button variant="outline">Export CSV</Button>
            <Button>Export PDF</Button>
          </div>
        </div>

        <Card className="p-4 border border-slate-200/80 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-4">
            <Input placeholder="Search reports" className="sm:col-span-2" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="usage">Usage</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="ops">Operations</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-0 border border-slate-200/80 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.format}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.size}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button size="sm">Download</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;


