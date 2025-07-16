import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types';
import {
    Textarea,
    Select,
    Button,
    Grid,
    Group,
    Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

export default function Edit({
    appointment,
    bloodGroups,
    bloodCenters
}: {
    appointment: any,
    bloodGroups: { id: number; name: string }[],
    bloodCenters: { id: number; name: string }[],
}) {
    const { data, setData, put, processing, errors } = useForm({
        blood_center_id: String(appointment.blood_center_id ?? ''),
        blood_group_id: String(appointment.blood_group_id ?? ''),
        appointment_date: appointment.appointment_date ?? '',
        notes: appointment.notes ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Appointments', href: '/appointments' },
        { title: 'Edit', href: `/appointments/${appointment.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/appointments/${appointment.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Appointment" />

            <Card>
                <CardHeader>
                    <CardTitle>
                        <Title order={3} className="text-center">Edit Appointment</Title>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid gutter="md">
                            <Grid.Col span={12}>
                                <Select
                                    label="Blood Center"
                                    placeholder="Select blood center"
                                    data={bloodCenters.map((c) => ({ value: String(c.id), label: c.name }))}
                                    value={data.blood_center_id}
                                    onChange={(value) => setData('blood_center_id', value || '')}
                                    error={errors.blood_center_id}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Select
                                    label="Blood Group"
                                    placeholder="Select blood group"
                                    data={bloodGroups.map((bg) => ({ value: String(bg.id), label: bg.name }))}
                                    value={data.blood_group_id}
                                    onChange={(value) => setData('blood_group_id', value || '')}
                                    error={errors.blood_group_id}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <DateTimePicker
                                    label="Appointment Date & Time"
                                    value={data.appointment_date}
                                    onChange={(date) => {
                                        try {
                                            setData('appointment_date', date ? (date as any).toISOString() : '');
                                        } catch {
                                            setData('appointment_date', date as string);
                                        }
                                    }}
                                    error={errors.appointment_date}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Textarea
                                    label="Notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.currentTarget.value)}
                                    error={errors.notes}
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Group justify="end" mt="md">
                                    <Button type="submit" loading={processing} color="orange">
                                        Update Appointment
                                    </Button>
                                </Group>
                            </Grid.Col>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
