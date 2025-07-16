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
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Divider, Paper, Center, Grid, Text } from '@mantine/core';

import DonationsLineChart from '@/components/charts/donations/donations-line-chart';
import RequestFulfilmentChart from '@/components/charts/donations/request-fulfilment-chart';
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

const metrics = {
  totalDonors: 1340,
  activeAppointments: 220,
  requestsFulfilled: 1085,
  hospitals: 38,
  donations: 1850,
  bloodUnits: 470,
};

const topBloodGroups = [
  { name: 'O+', units: 120 },
  { name: 'A+', units: 95 },
  { name: 'B+', units: 85 },
  { name: 'AB+', units: 45 },
  { name: 'O-', units: 40 },
  { name: 'A-', units: 30 },
];

const donationsPerMonth = [
  { month: 'Jan', count: 120 },
  { month: 'Feb', count: 95 },
  { month: 'Mar', count: 130 },
  { month: 'Apr', count: 160 },
  { month: 'May', count: 110 },
  { month: 'Jun', count: 140 },
];

const requestFulfillment = [
  { month: 'Jan', fulfilled: 100 },
  { month: 'Feb', fulfilled: 80 },
  { month: 'Mar', fulfilled: 105 },
  { month: 'Apr', fulfilled: 150 },
  { month: 'May', fulfilled: 90 },
  { month: 'Jun', fulfilled: 130 },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-4 rounded-xl p-4">

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle>Total Donors</CardTitle>
              <Users className="h-5 w-5 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalDonors}</div>
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
              <div className="text-2xl font-bold">{metrics.requestsFulfilled}</div>
              <p className="text-xs text-muted-foreground">Total since launch</p>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Droplet className="text-red-500" />
                <div>
                  <CardDescription>Total Donations</CardDescription>
                  <CardTitle className="text-xl">{metrics.donations}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card>
              <CardHeader className="flex items-center gap-3">
                <Activity className="text-indigo-500" />
                <div>
                  <CardDescription>Blood Units Available</CardDescription>
                  <CardTitle className="text-xl">{metrics.bloodUnits}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
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
        </Grid>

        {/* Top Blood Groups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Blood Groups</CardTitle>
            <CardDescription>Based on available units</CardDescription>
          </CardHeader>
          <CardContent>
            <Divider my="xs" />
            {topBloodGroups.length === 0 ? (
              <Center py="xl">
                <Text c="dimmed">No blood group data</Text>
              </Center>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {topBloodGroups.map((group, idx) => (
                  <Paper key={idx} p="md" withBorder shadow="xs" className="rounded-xl bg-red-50">
                    <Text size="sm" c="red">{group.name}</Text>
                    <Text fw={600}>{group.units} Units</Text>
                  </Paper>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Donations Per Month</CardTitle>
                <CardDescription>Monthly blood donations trend</CardDescription>
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
                <CardDescription>Blood requests successfully fulfilled</CardDescription>
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
