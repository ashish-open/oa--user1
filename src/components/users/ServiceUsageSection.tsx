
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, ArrowUpRight, DatabaseIcon } from 'lucide-react';
import { User } from '@/types';

interface ServiceUsageSectionProps {
  user: User;
}

const ServiceUsageSection: React.FC<ServiceUsageSectionProps> = ({ user }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // If no service usage data, display a placeholder
  if (!user.serviceUsage || !user.serviceStats) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Service Usage</h3>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center py-4">
              No service usage data available for this user.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { payin, payout, api } = user.serviceUsage;
  const serviceCount = [payin, payout, api].filter(Boolean).length;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Service Usage & Performance</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Services Used ({serviceCount}/3)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={payin ? "default" : "outline"} className={payin ? "bg-blue-500" : "text-muted-foreground"}>
                <CreditCard className="h-3 w-3 mr-1" /> Payment Gateway
              </Badge>
              <Badge variant={payout ? "default" : "outline"} className={payout ? "bg-purple-500" : "text-muted-foreground"}>
                <ArrowUpRight className="h-3 w-3 mr-1" /> Payout
              </Badge>
              <Badge variant={api ? "default" : "outline"} className={api ? "bg-green-500" : "text-muted-foreground"}>
                <DatabaseIcon className="h-3 w-3 mr-1" /> API Services
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {user.serviceStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Payment Gateway stats */}
          {user.serviceUsage.payin && (
            <Card className={user.serviceRiskScores?.payin && user.serviceRiskScores.payin > 50 ? "border-red-200" : ""}>
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-500" /> Payment Gateway
                  </CardTitle>
                  {user.serviceRiskScores?.payin && (
                    <Badge variant={user.serviceRiskScores.payin > 50 ? "destructive" : "outline"}>
                      Risk: {user.serviceRiskScores.payin}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Volume</span>
                    <span className="text-xs font-medium">{formatCurrency(user.serviceStats.payinVolume)}</span>
                  </div>
                  {user.serviceRiskScores?.payin && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Risk Score</span>
                        <span className="text-xs font-medium">{user.serviceRiskScores.payin}/100</span>
                      </div>
                      <Progress 
                        value={user.serviceRiskScores.payin} 
                        className={`h-1.5 ${user.serviceRiskScores.payin > 50 ? "bg-red-100" : "bg-blue-100"}`}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payout stats */}
          {user.serviceUsage.payout && (
            <Card className={user.serviceRiskScores?.payout && user.serviceRiskScores.payout > 50 ? "border-red-200" : ""}>
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-2 text-purple-500" /> Payout
                  </CardTitle>
                  {user.serviceRiskScores?.payout && (
                    <Badge variant={user.serviceRiskScores.payout > 50 ? "destructive" : "outline"}>
                      Risk: {user.serviceRiskScores.payout}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Volume</span>
                    <span className="text-xs font-medium">{formatCurrency(user.serviceStats.payoutVolume)}</span>
                  </div>
                  {user.serviceRiskScores?.payout && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Risk Score</span>
                        <span className="text-xs font-medium">{user.serviceRiskScores.payout}/100</span>
                      </div>
                      <Progress 
                        value={user.serviceRiskScores.payout} 
                        className={`h-1.5 ${user.serviceRiskScores.payout > 50 ? "bg-red-100" : "bg-purple-100"}`}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* API stats */}
          {user.serviceUsage.api && (
            <Card className={user.serviceRiskScores?.api && user.serviceRiskScores.api > 50 ? "border-red-200" : ""}>
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm flex items-center">
                    <DatabaseIcon className="h-4 w-4 mr-2 text-green-500" /> API Services
                  </CardTitle>
                  {user.serviceRiskScores?.api && (
                    <Badge variant={user.serviceRiskScores.api > 50 ? "destructive" : "outline"}>
                      Risk: {user.serviceRiskScores.api}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">API Calls</span>
                    <span className="text-xs font-medium">{user.serviceStats.apiCallCount.toLocaleString()}</span>
                  </div>
                  {user.serviceRiskScores?.api && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Risk Score</span>
                        <span className="text-xs font-medium">{user.serviceRiskScores.api}/100</span>
                      </div>
                      <Progress 
                        value={user.serviceRiskScores.api} 
                        className={`h-1.5 ${user.serviceRiskScores.api > 50 ? "bg-red-100" : "bg-green-100"}`}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceUsageSection;
