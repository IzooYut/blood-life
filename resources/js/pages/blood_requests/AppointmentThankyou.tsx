import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { formatHumanDateTime } from '@/lib/format-date';


 type Appointment = {
  appointment_date:string | null;
  message?: string | null;
  blood_group_id: number | null;
  blood_center_id: number;
 

  blood_center?: {
    id: number;
    name: string;
    location?: string | null;
  };
};

type Props = {
  appointment: Appointment;
};

export default function AppointmentThankYou({ appointment }: Props) {
  return (
      <>
      <Head title="Thank You" />

      <div className="max-w-7xl mx-auto mt-8 p-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Title order={2} className="text-primary">Thank You for Booking!</Title>
            </CardTitle>
            <Text className="text-gray-600 mt-2">
              Your appointment has been successfully booked. Below are the details:
            </Text>
          </CardHeader>

          <CardContent>
            <Stack gap="xs">
             
              <Text><strong>Date Time:</strong> {formatHumanDateTime(appointment.appointment_date)}</Text>
              <Text><strong>Blood Center:</strong> {appointment.blood_center?.name}</Text>
              <Text><strong>Blood Center Location:</strong> {appointment.blood_center?.location}</Text>
            </Stack>
          </CardContent>

          <div className="px-6 pb-4 pt-2">
            <Group justify='between' mt="md">
              <Button
                component={Link}
                href="/requests-page"
                color="orange"
                variant="outline"
                radius="md"
              >
                View More Blood Requests
              </Button>

              <Button
                variant="light"
                color="red"
                radius="md"
                onClick={() => router.post('/logout')}
              >
                Logout
              </Button>
            </Group>
          </div>
        </Card>
      </div>
      </>
  );
}
