import { DashboardLayout } from "@/components/dashboard/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Business {
  id: string;
  name: string;
  industry: string;
  creditScore: number;
  creditStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  creditLimit: number;
  utilization: number;
  paymentsOnTime: number;
  delinquencies: number;
  yearsInBusiness: number;
  monthlyRevenue: number;
}

const dummyBusinesses: Business[] = [
  {
    id: "1",
    name: "Green Valley Landscaping",
    industry: "Landscaping",
    creditScore: 785,
    creditStatus: "Excellent",
    creditLimit: 50000,
    utilization: 28,
    paymentsOnTime: 98,
    delinquencies: 0,
    yearsInBusiness: 8,
    monthlyRevenue: 45000
  },
  {
    id: "2",
    name: "Main Street Cafe",
    industry: "Food & Beverage",
    creditScore: 720,
    creditStatus: "Good",
    creditLimit: 35000,
    utilization: 45,
    paymentsOnTime: 92,
    delinquencies: 1,
    yearsInBusiness: 5,
    monthlyRevenue: 28000
  },
  {
    id: "3",
    name: "Tech Solutions LLC",
    industry: "IT Services",
    creditScore: 810,
    creditStatus: "Excellent",
    creditLimit: 100000,
    utilization: 22,
    paymentsOnTime: 100,
    delinquencies: 0,
    yearsInBusiness: 12,
    monthlyRevenue: 85000
  },
  {
    id: "4",
    name: "Urban Construction Co",
    industry: "Construction",
    creditScore: 650,
    creditStatus: "Fair",
    creditLimit: 75000,
    utilization: 68,
    paymentsOnTime: 85,
    delinquencies: 3,
    yearsInBusiness: 4,
    monthlyRevenue: 62000
  },
  {
    id: "5",
    name: "Bright Minds Tutoring",
    industry: "Education",
    creditScore: 690,
    creditStatus: "Good",
    creditLimit: 25000,
    utilization: 35,
    paymentsOnTime: 90,
    delinquencies: 2,
    yearsInBusiness: 3,
    monthlyRevenue: 18000
  },
  {
    id: "6",
    name: "Peak Performance Gym",
    industry: "Fitness",
    creditScore: 745,
    creditStatus: "Good",
    creditLimit: 60000,
    utilization: 40,
    paymentsOnTime: 94,
    delinquencies: 1,
    yearsInBusiness: 6,
    monthlyRevenue: 52000
  },
  {
    id: "7",
    name: "Sunset Auto Repair",
    industry: "Automotive",
    creditScore: 580,
    creditStatus: "Poor",
    creditLimit: 30000,
    utilization: 85,
    paymentsOnTime: 72,
    delinquencies: 5,
    yearsInBusiness: 10,
    monthlyRevenue: 35000
  },
  {
    id: "8",
    name: "Cloud Nine Bakery",
    industry: "Food & Beverage",
    creditScore: 760,
    creditStatus: "Good",
    creditLimit: 40000,
    utilization: 32,
    paymentsOnTime: 96,
    delinquencies: 0,
    yearsInBusiness: 7,
    monthlyRevenue: 38000
  },
  {
    id: "9",
    name: "Elite Marketing Agency",
    industry: "Marketing",
    creditScore: 795,
    creditStatus: "Excellent",
    creditLimit: 80000,
    utilization: 25,
    paymentsOnTime: 99,
    delinquencies: 0,
    yearsInBusiness: 9,
    monthlyRevenue: 72000
  },
  {
    id: "10",
    name: "Riverside Plumbing",
    industry: "Trade Services",
    creditScore: 615,
    creditStatus: "Fair",
    creditLimit: 45000,
    utilization: 72,
    paymentsOnTime: 80,
    delinquencies: 4,
    yearsInBusiness: 2,
    monthlyRevenue: 42000
  }
];

const getCreditStatusColor = (status: string) => {
  switch (status) {
    case 'Excellent':
      return 'bg-success/10 text-success border-success/20';
    case 'Good':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Fair':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'Poor':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const Users = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Small Business Users</h1>
          <p className="text-muted-foreground mt-2">
            Overview of businesses with different credit profiles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Credit Profiles</CardTitle>
            <CardDescription>
              Showing {dummyBusinesses.length} small businesses with varying credit scores and payment histories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Credit Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>On-Time %</TableHead>
                  <TableHead>Delinquencies</TableHead>
                  <TableHead>Years</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyBusinesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(business.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{business.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{business.industry}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{business.creditScore}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCreditStatusColor(business.creditStatus)}>
                        {business.creditStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${business.creditLimit.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              business.utilization > 70 ? 'bg-destructive' : 
                              business.utilization > 50 ? 'bg-warning' : 
                              'bg-success'
                            }`}
                            style={{ width: `${business.utilization}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{business.utilization}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={
                        business.paymentsOnTime >= 95 ? 'text-success font-medium' :
                        business.paymentsOnTime >= 85 ? 'text-warning' :
                        'text-destructive'
                      }>
                        {business.paymentsOnTime}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={business.delinquencies === 0 ? 'text-success' : 'text-destructive'}>
                        {business.delinquencies}
                      </span>
                    </TableCell>
                    <TableCell>{business.yearsInBusiness}y</TableCell>
                    <TableCell className="text-muted-foreground">
                      ${(business.monthlyRevenue / 1000).toFixed(0)}k
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Users;
