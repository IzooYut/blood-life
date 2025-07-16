import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types';
import {
    TextInput,
    Select,
    Button,
    Grid,
    Box,
    Group,
    Text,
    Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';

export default function Create({ bloodGroups }: { bloodGroups: { id: number; name: string }[] }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        gender: '',
        dob: '',
        phone: '',
        email: '',
        blood_group_id: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blood Donors',
            href: '/donors/create',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/donors');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Donor" />

            <Card>
                <CardHeader>
                    <CardTitle>
                        <Title order={3} className="text-center">Register New Donor</Title>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid gutter="md">
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="First Name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.currentTarget.value)}
                                    error={errors.first_name}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Last Name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.currentTarget.value)}
                                    error={errors.last_name}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Select
                                    label="Gender"
                                    placeholder="Select gender"
                                    data={[
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                        { value: 'other', label: 'Other' },
                                    ]}
                                    value={data.gender}
                                    onChange={(value) => setData('gender', value || '')}
                                    error={errors.gender}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <DateInput
                                    label="Date of Birth"
                                    value={data.dob}
                                    onChange={(date) => {
                                        try {
                                            setData('dob', date ? (date as any).toISOString().split('T')[0] : '');
                                        } catch {
                                            setData('dob', (date as string) || '');
                                        }
                                    }}
                                    error={errors.dob}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.currentTarget.value)}
                                    error={errors.phone}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.currentTarget.value)}
                                    error={errors.email}
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
                                <Group justify="end" mt="md">
                                    <Button type="submit" loading={processing} color="orange">
                                        Save Donor
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
