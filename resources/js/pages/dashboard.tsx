'use client';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  Users,
  CalendarCheck,
  HeartHandshake,
  Hospital,
  Droplet,
  Activity,
  Building2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Divider, Paper, Center, Grid, Text, Badge, Progress } from '@mantine/core';

import DonationsLineChart from '@/components/charts/donations/donations-line-chart';
import RequestFulfilmentChart from '@/components/charts/donations/request-fulfilment-chart';

// TypeScript interfaces for the data
interface Metrics {
  totalDonors: number;
  activeAppointments: number;
  requestsFulfilled: number;
  hospitals: number;
  donations: number;
  bloodUnits: number;
  totalBloodCenters: number;
  pendingRequests: number;
  urgentRequests: number;
  donationsThisMonth: number;
  averageDonationVolume: number;
}

interface BloodGroup {
  name: string;
  units: number;
}

interface MonthlyData {
  month: string;
  count?: number;
  fulfilled?: number;
  year: number;
}

interface BloodGroupDistribution {
  name: string;
  count: number;
}

interface RecentDonation {
  id: number;
  donor_name: string;
  blood_group: string;
  volume_ml: number;
  donation_date_time: string;
}

interface UpcomingAppointment {
  id: number;
  donor_name: string;
  blood_group: string;
  appointment_date: string;
}

interface UrgencyBreakdown {
  normal?: number;
  urgent?: number;
  very_urgent?: number;
}

interface DashboardStats {
  metrics: Metrics;
  topBloodGroups: BloodGroup[];
  donationsPerMonth: MonthlyData[];
  requestFulfillment: MonthlyData[];
  bloodGroupDistribution: BloodGroupDistribution[];
  recentDonations: RecentDonation[];
  upcomingAppointments: UpcomingAppointment[];
  urgencyBreakdown: UrgencyBreakdown;
}

interface DashboardProps {
  stats: DashboardStats;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard({ stats }: DashboardProps) {
  const { metrics, topBloodGroups, donationsPerMonth, requestFulfillment, urgencyBreakdown } = stats;

  // Calculate percentages for progress indicators
  const fulfillmentRate = metrics.requestsFulfilled > 0 
    ? ((metrics.requestsFulfilled / (metrics.requestsFulfilled + metrics.pendingRequests)) * 100)
    : 0;

  const urgentRequestsPercentage = metrics.pendingRequests > 0
    ? ((metrics.urgentRequests / metrics.pendingRequests) * 100)
    : 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-4 rounded-xl p-4">

        {/* Primary Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Total Donors</CardTitle>
              <Users className="h-5 w-5 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalDonors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Registered donors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Active Appointments</CardTitle>
              <CalendarCheck className="h-5 w-5 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeAppointments}</div>
              <p className="text-xs text-muted-foreground">Scheduled this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Requests Fulfilled</CardTitle>
              <HeartHandshake className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.requestsFulfilled.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {fulfillmentRate.toFixed(1)}% fulfillment rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Droplet className="text-red-500" />
                <div>
                  <CardDescription>Total Donations</CardDescription>
                  <CardTitle className="text-xl">{metrics.donations.toLocaleString()}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {metrics.donationsThisMonth} this month
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Activity className="text-indigo-500" />
                <div>
                  <CardDescription>Blood Units Available</CardDescription>
                  <CardTitle className="text-xl">{metrics.bloodUnits.toLocaleString()}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Avg: {Math.round(metrics.averageDonationVolume)}ml per donation
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Hospital className="text-blue-500" />
                <div>
                  <CardDescription>Hospitals Supported</CardDescription>
                  <CardTitle className="text-xl">{metrics.hospitals}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Building2 className="text-purple-500" />
                <div>
                  <CardDescription>Blood Centers</CardDescription>
                  <CardTitle className="text-xl">{metrics.totalBloodCenters}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Request Status Cards */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Clock className="text-orange-500" />
                <div>
                  <CardDescription>Pending Requests</CardDescription>
                  <CardTitle className="text-xl">{metrics.pendingRequests}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" />
                <div>
                  <CardDescription>Urgent Requests</CardDescription>
                  <CardTitle className="text-xl">{metrics.urgentRequests}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {urgentRequestsPercentage.toFixed(1)}% of pending
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <TrendingUp className="text-green-500" />
                <div>
                  <CardDescription>Fulfillment Rate</CardDescription>
                  <CardTitle className="text-xl">{fulfillmentRate.toFixed(1)}%</CardTitle>
                  <Progress value={fulfillmentRate} size="sm" color="green" />
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Urgency Breakdown */}
        {Object.keys(urgencyBreakdown).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Request Urgency Breakdown</CardTitle>
              <CardDescription>Current pending requests by urgency level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Badge color="blue" size="lg">Normal</Badge>
                  <Text size="xl" fw={600}>{urgencyBreakdown.normal || 0}</Text>
                </div>
                <div className="text-center">
                  <Badge color="orange" size="lg">Urgent</Badge>
                  <Text size="xl" fw={600}>{urgencyBreakdown.urgent || 0}</Text>
                </div>
                <div className="text-center">
                  <Badge color="red" size="lg">Very Urgent</Badge>
                  <Text size="xl" fw={600}>{urgencyBreakdown.very_urgent || 0}</Text>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Blood Groups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Blood Groups</CardTitle>
            <CardDescription>Based on available units from successful donations</CardDescription>
          </CardHeader>
          <CardContent>
            <Divider my="xs" />
            {topBloodGroups.length === 0 ? (
              <Center py="xl">
                <Text c="dimmed">No blood group data available</Text>
              </Center>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {topBloodGroups.map((group, idx) => (
                  <Paper key={idx} p="md" withBorder shadow="xs" className="rounded-xl bg-red-50">
                    <Text size="sm" c="red" fw={600}>{group.name}</Text>
                    <Text fw={700} size="lg">{group.units} Units</Text>
                  </Paper>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Donations Per Month</CardTitle>
                <CardDescription>Monthly blood donations trend (Last 12 months)</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationsLineChart data={donationsPerMonth} />
              </CardContent>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Request Fulfilment Trend</CardTitle>
                <CardDescription>Blood requests successfully fulfilled (Last 6 months)</CardDescription>
              </CardHeader>
              <CardContent>
                <RequestFulfilmentChart data={requestFulfillment} />
              </CardContent>
            </Card>
          </Grid.Col>
        </Grid>

      </div>
    </AppLayout>
  );
}