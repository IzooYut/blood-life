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

export default function Create({ bloodGroups, bloodCenters,donors }: {
    bloodGroups: { id: number; name: string }[];
    bloodCenters: { id: number; name: string }[];
    donors: { id: number; name: string }[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        blood_center_id: '',
        blood_group_id: '',
        appointment_date: '',
        user_id:'',
        notes: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Appointments', href: '/appointments' },
        { title: 'Create', href: '/appointments/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/appointments');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Appointment" />

            <Card>
                <CardHeader>
                    <CardTitle>
                        <Title order={3} className="text-center">Schedule New Appointment</Title>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid gutter="md">
                             <Grid.Col span={6}>
                                <Select
                                    label="Donor"
                                    placeholder="Select Donor"
                                    data={donors.map((c) => ({ value: String(c.id), label: c.name }))}
                                    value={data.user_id}
                                    onChange={(value) => setData('user_id', value || '')}
                                    error={errors.user_id}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
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

                            {/* <Grid.Col span={6}>
                                <Select
                                    label="Blood Group"
                                    placeholder="Select blood group"
                                    data={bloodGroups.map((bg) => ({ value: String(bg.id), label: bg.name }))}
                                    value={data.blood_group_id}
                                    onChange={(value) => setData('blood_group_id', value || '')}
                                    error={errors.blood_group_id}
                                    required
                                />
                            </Grid.Col> */}

                            <Grid.Col span={6}>
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

                            <Grid.Col span={6}>
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
                                        Save Appointment
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
