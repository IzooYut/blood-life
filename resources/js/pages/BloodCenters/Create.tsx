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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        location: '',
        address: '',
        longitude: '',
        latitude: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blood Centers',
            href: '/blood_centers/create',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/blood_centers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Blood Center" />

            <Card>
                <CardHeader>
                    <CardTitle>
                        <Title order={3} className="text-center">Register Blood Center</Title>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid gutter="md">
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.currentTarget.value)}
                                    error={errors.name}
                                    required
                                />
                            </Grid.Col>
                             <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Contact Person"
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.currentTarget.value)}
                                    error={errors.name}
                                    required
                                />
                            </Grid.Col>

                             <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.currentTarget.value)}
                                    error={errors.name}
                                    required
                                />
                            </Grid.Col>
                             <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.currentTarget.value)}
                                    error={errors.name}
                                    required
                                />
                            </Grid.Col>



                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.currentTarget.value)}
                                    error={errors.location}
                                    required
                                />
                            </Grid.Col>

                           

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.currentTarget.value)}
                                    error={errors.address}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="longitude"
                                    type="longitude"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.currentTarget.value)}
                                    error={errors.longitude}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="latitude"
                                    type="latitude"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.currentTarget.value)}
                                    error={errors.latitude}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Group justify="end" mt="md">
                                    <Button type="submit" loading={processing} color="orange">
                                        Save Blood Center
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
