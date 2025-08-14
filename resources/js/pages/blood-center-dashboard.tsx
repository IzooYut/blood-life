'use client';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  Calendar,
  Droplet,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity,
  Shield,
  CalendarCheck,
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
interface BloodCenterMetrics {
  totalDonations: number;
  donationsToday: number;
  donationsThisWeek: number;
  donationsThisMonth: number;
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  totalBloodUnits: number;
  averageDonationVolume: number;
  conversionRate: number;
}

interface ScreeningBreakdown {
  passed?: number;
  failed?: number;
  not_screened?: number;
}

interface AppointmentStatusBreakdown {
  scheduled?: number;
  confirmed?: number;
  completed?: number;
  cancelled?: number;
  no_show?: number;
}

interface BloodGroupDonation {
  name: string;
  donations_count: number;
  units: number;
}

interface MonthlyData {
  month: string;
  count: number;
  year: number;
}

interface WeeklyData {
  week: string;
  count: number;
  date: string;
}

interface RecentDonation {
  id: number;
  donor_name: string;
  blood_group: string;
  volume_ml: number;
  donation_date_time: string;
  screening_status: string;
}

interface UpcomingAppointment {
  id: number;
  donor_name: string;
  blood_group: string | null;
  appointment_date: string;
  status: string;
}

interface BloodCenter {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  location: string;
}

interface BloodCenterDashboardStats {
  metrics: BloodCenterMetrics;
  screeningBreakdown: ScreeningBreakdown;
  appointmentStatusBreakdown: AppointmentStatusBreakdown;
  bloodGroupDonations: BloodGroupDonation[];
  monthlyDonations: MonthlyData[];
  weeklyAppointments: WeeklyData[];
  recentDonations: RecentDonation[];
  upcomingAppointments: UpcomingAppointment[];
}

interface BloodCenterDashboardProps {
  stats: BloodCenterDashboardStats;
  bloodCenter: BloodCenter;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Blood Center Dashboard', href: '/blood-center/dashboard' },
];

const getScreeningColor = (status: string) => {
  switch (status) {
    case 'passed': return 'green';
    case 'failed': return 'red';
    case 'not_screened': return 'orange';
    default: return 'gray';
  }
};

const getAppointmentStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'blue';
    case 'confirmed': return 'green';
    case 'completed': return 'teal';
    case 'cancelled': return 'red';
    case 'no_show': return 'orange';
    default: return 'gray';
  }
};

export default function BloodCenterDashboard({ stats, bloodCenter }: BloodCenterDashboardProps) {
  const { 
    metrics, 
    screeningBreakdown, 
    appointmentStatusBreakdown,
    bloodGroupDonations,
    monthlyDonations,
    weeklyAppointments,
    recentDonations,
    upcomingAppointments
  } = stats;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${bloodCenter.name} - Dashboard`} />
      <div className="flex flex-col gap-4 rounded-xl p-4">
        
        {/* Blood Center Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar size="lg" color="red">
                <Building2 size={24} />
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{bloodCenter.name}</CardTitle>
                <CardDescription>
                  {bloodCenter.contact_person} • {bloodCenter.email} • {bloodCenter.phone}
                </CardDescription>
                <Text size="sm" c="dimmed">{bloodCenter.location} • {bloodCenter.address}</Text>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Primary Daily Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Today's Donations</CardTitle>
              <Droplet className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.donationsToday}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.donationsThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Today's Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.upcomingAppointments} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Total Donations</CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalDonations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.donationsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Conversion Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
              <Progress value={metrics.conversionRate} size="sm" color="purple" />
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Users className="text-indigo-500" />
                <div>
                  <CardDescription>Total Appointments</CardDescription>
                  <CardTitle className="text-xl">{metrics.totalAppointments}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {metrics.completedAppointments} completed
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Shield className="text-teal-500" />
                <div>
                  <CardDescription>Blood Units Collected</CardDescription>
                  <CardTitle className="text-xl">{metrics.totalBloodUnits}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(metrics.averageDonationVolume)}ml avg
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <CalendarCheck className="text-blue-500" />
                <div>
                  <CardDescription>Upcoming Appointments</CardDescription>
                  <CardTitle className="text-xl">{metrics.upcomingAppointments}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Clock className="text-orange-500" />
                <div>
                  <CardDescription>Average Volume</CardDescription>
                  <CardTitle className="text-xl">{Math.round(metrics.averageDonationVolume)}ml</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Status Breakdowns */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Screening Status</CardTitle>
                <CardDescription>Donation screening results breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(screeningBreakdown).map(([status, count]) => (
                    <div key={status} className="text-center">
                      <Badge color={getScreeningColor(status)} size="lg" className="capitalize">
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
                <CardTitle>Appointment Status</CardTitle>
                <CardDescription>Current appointment status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(appointmentStatusBreakdown).map(([status, count]) => (
                    <div key={status} className="text-center">
                      <Badge color={getAppointmentStatusColor(status)} size="sm" className="capitalize">
                        {status.replace('_', ' ')}
                      </Badge>
                      <Text size="lg" fw={600}>{count}</Text>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Blood Group Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Group Donations</CardTitle>
            <CardDescription>Donations collected by blood group</CardDescription>
          </CardHeader>
          <CardContent>
            <Divider my="xs" />
            {bloodGroupDonations.length === 0 ? (
              <Center py="xl">
                <Text c="dimmed">No blood group donation data</Text>
              </Center>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {bloodGroupDonations.map((group, idx) => (
                  <Paper key={idx} p="md" withBorder shadow="xs" className="rounded-xl bg-red-50">
                    <Text size="sm" c="red" fw={600}>{group.name}</Text>
                    <Text fw={700} size="lg">{group.units} Units</Text>
                    <Text size="xs" c="dimmed">{group.donations_count} donations</Text>
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
                <CardTitle>Monthly Donations</CardTitle>
                <CardDescription>Donation trends over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationsLineChart data={monthlyDonations} />
              </CardContent>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Appointments</CardTitle>
                <CardDescription>Appointment trends over the last 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <div className="space-y-2">
                    {weeklyAppointments.map((week, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <Text fw={500}>{week.week}</Text>
                          <Text size="sm" c="dimmed">{week.date}</Text>
                        </div>
                        <Badge variant="light" color="blue">{week.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Recent Activity */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Latest blood donations processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDonations.length === 0 ? (
                    <Center py="md">
                      <Text c="dimmed">No recent donations</Text>
                    </Center>
                  ) : (
                    recentDonations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Text fw={500}>{donation.donor_name}</Text>
                          <Text size="sm" c="dimmed">{donation.volume_ml}ml</Text>
                        </div>
                        <div className="text-right">
                          <Badge color="blue" variant="light">
                            {donation.blood_group}
                          </Badge>
                          <br />
                          <Badge size="xs" color={getScreeningColor(donation.screening_status)}>
                            {donation.screening_status.replace('_', ' ')}
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {new Date(donation.donation_date_time).toLocaleDateString()}
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
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Scheduled appointments for donors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.length === 0 ? (
                    <Center py="md">
                      <Text c="dimmed">No upcoming appointments</Text>
                    </Center>
                  ) : (
                    upcomingAppointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Text fw={500}>{appointment.donor_name}</Text>
                          <Text size="sm" c="dimmed">
                            {new Date(appointment.appointment_date).toLocaleDateString()}
                          </Text>
                        </div>
                        <div className="text-right">
                          <Badge color="blue" variant="light">
                            {appointment.blood_group || 'Unknown'}
                          </Badge>
                          <br />
                          <Badge size="xs" color={getAppointmentStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
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