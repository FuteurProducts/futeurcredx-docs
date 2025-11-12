import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@clerk/clerk-react";
import dashboardService from "@/services/dashboardService";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface BusinessInsight {
  id: string;
  userId: string;
  name: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string | null;
  empCount?: number;
  legalStruct?: string;
  yearFounded?: number;
  ownerFname?: string;
  ownerLname?: string;
  ownerMname?: string;
  ownerTitle?: string;
  createdAt: string;
  recommendation?: {
    score: number;
    business: string;
    recommendations: Array<{
      reason: string;
      cardName: string;
      fitScore: number;
      suggestedUsage: string;
    }>;
  };
  recommendationUpdatedAt?: string;
  score?: {
    id: string;
    businessId: string;
    score: number;
    type: string;
    reportUrl?: string | null;
    metadata?: any;
  };
}

const getCreditStatusFromScore = (score?: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' => {
  if (!score) return 'Fair';
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  return 'Poor';
};

const getCreditStatusColor = (status: string) => {
  switch (status) {
    case 'Excellent':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Good':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Fair':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Poor':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const calculateYearsInBusiness = (yearFounded?: number): number => {
  if (!yearFounded) return 0;
  return new Date().getFullYear() - yearFounded;
};

const Users = () => {
  const { getToken } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRecommendationFilter, setHasRecommendationFilter] = useState<boolean | undefined>(undefined);
  const [hasScoreFilter, setHasScoreFilter] = useState<boolean | undefined>(undefined);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessInsight | null>(null);

  const fetchBusinesses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Use the dashboard service to fetch business insights
      const filters: { hasRecommendation?: boolean; hasScore?: boolean } = {};
      if (hasRecommendationFilter !== undefined) {
        filters.hasRecommendation = hasRecommendationFilter;
      }
      if (hasScoreFilter !== undefined) {
        filters.hasScore = hasScoreFilter;
      }

      const data = await dashboardService.getBusinessInsights(filters);
      setBusinesses(data);
    } catch (err: any) {
      console.error('Error fetching businesses:', err);
      setError(err.message || 'Failed to load businesses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [hasRecommendationFilter, hasScoreFilter]);

  if (isLoading) {
    return (
      <DashboardLayout hideSidebar>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout hideSidebar>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <Button onClick={fetchBusinesses} className="mt-2">Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout hideSidebar>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Users</h1>
            <p className="text-slate-500 mt-2">
              Overview of businesses with credit profiles, recommendations, and scores
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="border border-slate-200/80 shadow-sm p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              value={hasRecommendationFilter === undefined ? "all" : String(hasRecommendationFilter)}
              onValueChange={(value) => setHasRecommendationFilter(value === "all" ? undefined : value === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Has Recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recommendations</SelectItem>
                <SelectItem value="true">With Recommendations</SelectItem>
                <SelectItem value="false">Without Recommendations</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={hasScoreFilter === undefined ? "all" : String(hasScoreFilter)}
              onValueChange={(value) => setHasScoreFilter(value === "all" ? undefined : value === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Has Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="true">With Scores</SelectItem>
                <SelectItem value="false">Without Scores</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchBusinesses} variant="outline">
              Refresh
            </Button>
          </div>
        </Card>

        <Card className="border border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle>Business Credit Profiles</CardTitle>
            <CardDescription>
              Showing {businesses.length} businesses with credit information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Years</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  businesses.map((business) => {
                    const creditStatus = getCreditStatusFromScore(business.score?.score);
                    const yearsInBusiness = calculateYearsInBusiness(business.yearFounded);
                    const location = [business.city, business.state].filter(Boolean).join(', ') || 'N/A';

                    return (
                      <TableRow key={business.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(business.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{business.name}</span>
                              {business.legalStruct && (
                                <p className="text-xs text-slate-500">{business.legalStruct}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{location}</TableCell>
                        <TableCell>
                          {business.score ? (
                            <span className="font-semibold">{business.score.score}</span>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCreditStatusColor(creditStatus)}>
                            {creditStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{yearsInBusiness > 0 ? `${yearsInBusiness}y` : 'N/A'}</TableCell>
                        <TableCell>
                          {business.recommendation ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{business.recommendation.recommendations.length} cards</span>
                            </div>
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedBusiness(business)}
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{business.name}</DialogTitle>
                                <DialogDescription>
                                  Complete business information, recommendations, and credit score details
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6 mt-4">
                                {/* Business Info */}
                                <div>
                                  <h3 className="font-semibold mb-2">Business Information</h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-slate-500">Address</p>
                                      <p className="font-medium">
                                        {[business.streetAddress, business.city, business.state, business.zipCode]
                                          .filter(Boolean)
                                          .join(', ') || 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-slate-500">Legal Structure</p>
                                      <p className="font-medium">{business.legalStruct || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-slate-500">Employees</p>
                                      <p className="font-medium">{business.empCount || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-slate-500">Year Founded</p>
                                      <p className="font-medium">{business.yearFounded || 'N/A'}</p>
                                    </div>
                                    {business.ownerFname && (
                                      <div>
                                        <p className="text-slate-500">Owner</p>
                                        <p className="font-medium">
                                          {[business.ownerFname, business.ownerMname, business.ownerLname]
                                            .filter(Boolean)
                                            .join(' ')}
                                          {business.ownerTitle && ` (${business.ownerTitle})`}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Score Information */}
                                {business.score && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Credit Score</h3>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-slate-600">Score</span>
                                        <span className="text-2xl font-bold">{business.score.score}</span>
                                      </div>
                                      <div className="text-sm text-slate-600">
                                        <p>Type: {business.score.type}</p>
                                        {business.score.reportUrl && (
                                          <a
                                            href={business.score.reportUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                          >
                                            View Full Report
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Recommendations */}
                                {business.recommendation && (
                                  <div>
                                    <h3 className="font-semibold mb-2">
                                      Recommendations ({business.recommendation.recommendations.length})
                                    </h3>
                                    <div className="space-y-4">
                                      {business.recommendation.recommendations.map((rec, idx) => (
                                        <div key={idx} className="border border-slate-200 rounded-lg p-4">
                                          <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold">{rec.cardName}</h4>
                                            <Badge variant="outline">
                                              Fit Score: {(rec.fitScore * 100).toFixed(0)}%
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-slate-600 mb-2">{rec.reason}</p>
                                          <div className="mt-2">
                                            <p className="text-xs font-semibold text-slate-700 mb-1">
                                              Suggested Usage:
                                            </p>
                                            <p className="text-sm text-slate-600">{rec.suggestedUsage}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Users;
