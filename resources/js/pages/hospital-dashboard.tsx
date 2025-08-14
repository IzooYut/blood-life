'use client';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  HeartHandshake,
  TrendingUp,
  UserPlus,
  Building2,
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Divider, Paper, Center, Grid, Text, Badge, Progress, Avatar } from '@mantine/core';

import DonationsLineChart from '@/components/charts/donations/donations-line-chart';

// TypeScript interfaces
interface HospitalMetrics {
  totalRecipients: number;
  totalBloodRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  totalRequestItems: number;
  urgentRequestItems: number;
  requestsThisMonth: number;
  recipientsThisMonth: number;
  donationsReceived: number;
  unitsReceived: number;
  fulfillmentRate: number;
}

interface BloodGroupRequest {
  name: string;
  units_requested: number;
  request_count: number;
}

interface RequestStatusBreakdown {
  pending?: number;
  approved?: number;
  partial?: number;
  closed?: number;
  cancelled?: number;
}

interface UrgencyBreakdown {
  normal?: number;
  urgent?: number;
  very_urgent?: number;
}

interface MonthlyData {
  month: string;
  count: number;
  year: number;
}

interface RecentRecipient {
  id: number;
  name: string;
  id_number: string;
  blood_group?: {
    name: string;
  };
  created_at: string;
}

interface RecentBloodRequest {
  id: number;
  request_date: string;
  status: string;
  notes?: string;
  blood_request_items?: Array<{
    blood_group?: {
      name: string;
    };
    units_requested: number;
    urgency: string;
  }>;
}

interface Hospital {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

interface HospitalDashboardStats {
  metrics: HospitalMetrics;
  bloodGroupRequests: BloodGroupRequest[];
  requestStatusBreakdown: RequestStatusBreakdown;
  urgencyBreakdown: UrgencyBreakdown;
  monthlyRequests: MonthlyData[];
  recentRecipients: RecentRecipient[];
  recentBloodRequests: RecentBloodRequest[];
}

interface HospitalDashboardProps {
  stats: HospitalDashboardStats;
  hospital: Hospital;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Hospital Dashboard', href: '/hospital/dashboard' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'orange';
    case 'approved': return 'green';
    case 'partial': return 'blue';
    case 'closed': return 'gray';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'normal': return 'blue';
    case 'urgent': return 'orange';
    case 'very_urgent': return 'red';
    default: return 'gray';
  }
};

export default function HospitalDashboard({ stats, hospital }: HospitalDashboardProps) {
  const { 
    metrics, 
    bloodGroupRequests, 
    requestStatusBreakdown, 
    urgencyBreakdown, 
    monthlyRequests,
    recentRecipients,
    recentBloodRequests 
  } = stats;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${hospital.name} - Dashboard`} />
      <div className="flex flex-col gap-4 rounded-xl p-4">
        
        {/* Hospital Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar size="lg" color="blue">
                <Building2 size={24} />
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{hospital.name}</CardTitle>
                <CardDescription>
                  {hospital.contact_person} • {hospital.email} • {hospital.phone}
                </CardDescription>
                <Text size="sm" c="dimmed">{hospital.address}</Text>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Total Recipients</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRecipients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{metrics.recipientsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Blood Requests</CardTitle>
              <FileText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalBloodRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.requestsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Pending Requests</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.urgentRequestItems} urgent items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Fulfillment Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.fulfillmentRate.toFixed(1)}%</div>
              <Progress value={metrics.fulfillmentRate} size="sm" color="green" />
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <CheckCircle className="text-green-500" />
                <div>
                  <CardDescription>Approved Requests</CardDescription>
                  <CardTitle className="text-xl">{metrics.approvedRequests}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <HeartHandshake className="text-red-500" />
                <div>
                  <CardDescription>Donations Received</CardDescription>
                  <CardTitle className="text-xl">{metrics.donationsReceived}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Users className="text-indigo-500" />
                <div>
                  <CardDescription>Blood Units Received</CardDescription>
                  <CardTitle className="text-xl">{metrics.unitsReceived}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <AlertTriangle className="text-orange-500" />
                <div>
                  <CardDescription>Total Request Items</CardDescription>
                  <CardTitle className="text-xl">{metrics.totalRequestItems}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Status and Urgency Breakdowns */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Request Status Breakdown</CardTitle>
                <CardDescription>Current status of all blood requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(requestStatusBreakdown).map(([status, count]) => (
                    <div key={status} className="text-center">
                      <Badge color={getStatusColor(status)} size="lg" className="capitalize">
                        {status.replace('_', ' ')}
                      </Badge>
                      <Text size="xl" fw={600}>{count}</Text>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Urgency Breakdown</CardTitle>
                <CardDescription>Pending request items by urgency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(urgencyBreakdown).map(([urgency, count]) => (
                    <div key={urgency} className="text-center">
                      <Badge color={getUrgencyColor(urgency)} size="lg" className="capitalize">
                        {urgency.replace('_', ' ')}
                      </Badge>
                      <Text size="xl" fw={600}>{count}</Text>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Blood Group Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Group Requests</CardTitle>
            <CardDescription>Most requested blood groups by units</CardDescription>
          </CardHeader>
          <CardContent>
            <Divider my="xs" />
            {bloodGroupRequests.length === 0 ? (
              <Center py="xl">
                <Text c="dimmed">No blood group requests yet</Text>
              </Center>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {bloodGroupRequests.map((group, idx) => (
                  <Paper key={idx} p="md" withBorder shadow="xs" className="rounded-xl bg-blue-50">
                    <Text size="sm" c="blue" fw={600}>{group.name}</Text>
                    <Text fw={700} size="lg">{group.units_requested} Units</Text>
                    <Text size="xs" c="dimmed">{group.request_count} requests</Text>
                  </Paper>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Blood Requests</CardTitle>
            <CardDescription>Blood request trends over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <DonationsLineChart data={monthlyRequests} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Recipients</CardTitle>
                <CardDescription>Latest registered recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRecipients.length === 0 ? (
                    <Center py="md">
                      <Text c="dimmed">No recent recipients</Text>
                    </Center>
                  ) : (
                    recentRecipients.map((recipient) => (
                      <div key={recipient.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Text fw={500}>{recipient.name}</Text>
                          <Text size="sm" c="dimmed">ID: {recipient.id_number}</Text>
                        </div>
                        <div className="text-right">
                          <Badge color="blue" variant="light">
                            {recipient.blood_group?.name || 'Unknown'}
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {new Date(recipient.created_at).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Blood Requests</CardTitle>
                <CardDescription>Latest blood requests submitted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBloodRequests.length === 0 ? (
                    <Center py="md">
                      <Text c="dimmed">No recent blood requests</Text>
                    </Center>
                  ) : (
                    recentBloodRequests.map((request) => (
                      <div key={request.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Text fw={500}>Request #{request.id}</Text>
                          <Badge color={getStatusColor(request.status)} variant="light">
                            {request.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {(request.blood_request_items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span>{item.blood_group?.name || 'Unknown'} - {item.units_requested} units</span>
                              <Badge size="xs" color={getUrgencyColor(item.urgency)}>
                                {item.urgency.replace('_', ' ')}
                              </Badge>
                            </div>
                          ))}
                          {(!request.blood_request_items || request.blood_request_items.length === 0) && (
                            <Text size="sm" c="dimmed">No items specified</Text>
                          )}
                        </div>
                        <Text size="xs" c="dimmed" className="mt-2">
                          {new Date(request.request_date).toLocaleDateString()}
                        </Text>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid.Col>
        </Grid>

      </div>
    </AppLayout>
  );
}