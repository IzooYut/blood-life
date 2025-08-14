import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, Badge, Table, Group, Text, Stack, Grid, Paper, Divider } from '@mantine/core';

import { BreadcrumbItem } from '@/types';
import { AlertTriangleIcon, ArrowLeftIcon, Building2Icon, Calendar1Icon, Clock10Icon, Clock12Icon, DropletIcon, DropletsIcon, MailIcon, MapPinIcon, NotebookTabs, PhoneIcon, User2Icon } from 'lucide-react';

interface BloodRequestItem {
    id: string;
    blood_group: {
        id: string;
        name: string;
    };
    recipient?: {
        id: string;
        name: string;
        id_number?: string;
        date_of_birth?: string;
        gender?: string;
        medical_notes?: string;
        blood_group: {
            id: string;
            name: string;
        };
    };
    units_requested: number;
    unique_code: string;
    urgency: string;
    status: string;
}

interface BloodRequest {
    id: string;
    hospital: {
        id: string;
        name: string;
        address?: string;
        contact_person?: string;
        phone?: string;
        email?: string;
    };
    request_date: string;
    notes?: string;
    status: string;
    items: BloodRequestItem[];
    created_at: string;
    updated_at: string;
}

interface ViewBloodRequestProps {
    bloodRequest: BloodRequest;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'yellow';
        case 'approved':
            return 'blue';
        case 'fulfilled':
            return 'green';
        case 'cancelled':
            return 'red';
        case 'partial':
            return 'orange';
        default:
            return 'gray';
    }
};

const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
        case 'urgent':
            return 'red';
        case 'normal':
            return 'blue';
        case 'low':
            return 'green';
        default:
            return 'gray';
    }
};

export default function View({ bloodRequest }: ViewBloodRequestProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blood Requests',
            href: '/blood-requests',
        },
        {
            title: `Request #${bloodRequest.id}`,
            href: `/blood-requests/${bloodRequest.id}`,
        },
    ];

    const totalUnits = bloodRequest.items.reduce((sum, item) => {
        const units = Number(item?.units_requested ?? 0);
        return sum + units;
    }, 0);
    const bloodGroups = [...new Set(bloodRequest.items.map(item => item.blood_group.name))];
    const hasUrgentItems = bloodRequest.items.some(item => item.urgency === 'urgent');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Blood Request #${bloodRequest.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <DropletIcon size={24} />
                                    Blood Request #{bloodRequest.id}
                                </CardTitle>
                                <div className="flex items-center gap-4 mt-2">
                                    <Badge color={getStatusColor(bloodRequest.status)} size="lg">
                                        {bloodRequest.status.toUpperCase()}
                                    </Badge>
                                    {hasUrgentItems && (
                                        <Badge color="red" size="lg">
                                            <AlertTriangleIcon size={16} className="mr-1" />
                                            URGENT
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Link href="/blood-requests">
                                <Button variant="light" leftSection={<ArrowLeftIcon size={16} />}>
                                    Back to List
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>

                <Grid>

                    <Grid.Col span={8}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Paper p="md" withBorder>
                                            <Stack gap="sm">
                                                <Group gap="xs">
                                                    <Calendar1Icon size={20} />
                                                    <Text fw={500}>Request Date</Text>
                                                </Group>
                                                <Text size="lg">
                                                    {new Date(bloodRequest.request_date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </Text>
                                            </Stack>
                                        </Paper>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Paper p="md" withBorder>
                                            <Stack gap="sm">
                                                <Group gap="xs">
                                                    <DropletsIcon size={20} />
                                                    <Text fw={500}>Total Units</Text>
                                                </Group>
                                                <Text size="lg" c={hasUrgentItems ? 'red' : 'blue'}>
                                                    {totalUnits} units
                                                </Text>
                                            </Stack>
                                        </Paper>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Paper p="md" withBorder>
                                            <Stack gap="sm">
                                                <Group gap="xs">
                                                    <Clock10Icon size={20} />
                                                    <Text fw={500}>Created</Text>
                                                </Group>
                                                <Text size="sm" c="dimmed">
                                                    {new Date(bloodRequest.created_at).toLocaleString()}
                                                </Text>
                                            </Stack>
                                        </Paper>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Paper p="md" withBorder>
                                            <Stack gap="sm">
                                                <Group gap="xs">
                                                    <Clock12Icon size={20} />
                                                    <Text fw={500}>Last Updated</Text>
                                                </Group>
                                                <Text size="sm" c="dimmed">
                                                    {new Date(bloodRequest.updated_at).toLocaleString()}
                                                </Text>
                                            </Stack>
                                        </Paper>
                                    </Grid.Col>
                                </Grid>

                                {bloodRequest.notes && (
                                    <>
                                        <Divider my="md" />
                                        <Stack gap="sm">
                                            <Group gap="xs">
                                                <NotebookTabs size={20} />
                                                <Text fw={500}>Notes</Text>
                                            </Group>
                                            <Paper p="md" withBorder bg="gray.0">
                                                <Text>{bloodRequest.notes}</Text>
                                            </Paper>
                                        </Stack>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid.Col>

                    {/* Hospital Information */}
                    <Grid.Col span={4}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2Icon size={20} />
                                    Hospital Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Stack gap="md">
                                    <div>
                                        <Text fw={500} size="lg">
                                            {bloodRequest.hospital.name}
                                        </Text>
                                    </div>

                                    {bloodRequest.hospital.address && (
                                        <Group gap="xs" align="flex-start">
                                            <MapPinIcon size={16} className="mt-1" />
                                            <Text size="sm" c="dimmed">
                                                {bloodRequest.hospital.address}
                                            </Text>
                                        </Group>
                                    )}

                                    {bloodRequest.hospital.contact_person && (
                                        <Group gap="xs">
                                            <User2Icon size={16} />
                                            <Text size="sm">
                                                <Text span fw={500}>Contact:</Text> {bloodRequest.hospital.contact_person}
                                            </Text>
                                        </Group>
                                    )}

                                    {bloodRequest.hospital.phone && (
                                        <Group gap="xs">
                                            <PhoneIcon size={16} />
                                            <Text size="sm">
                                                {bloodRequest.hospital.phone}
                                            </Text>
                                        </Group>
                                    )}

                                    {bloodRequest.hospital.email && (
                                        <Group gap="xs">
                                            <MailIcon size={16} />
                                            <Text size="sm">
                                                {bloodRequest.hospital.email}
                                            </Text>
                                        </Group>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid.Col>
                </Grid>

                {/* Blood Request Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Requested Blood Items ({bloodRequest.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Request Code</Table.Th>
                                    <Table.Th>Blood Group</Table.Th>
                                    <Table.Th>Units</Table.Th>
                                    <Table.Th>Urgency</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Recipient</Table.Th>
                                    <Table.Th>Recipient Details</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {bloodRequest.items.map((item) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td>
                                            <Badge variant="light" color="green" size="lg">
                                                {item?.unique_code ?? '-'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color="blue" size="lg">
                                                {item.blood_group.name}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text fw={500} size="lg">
                                                {item.units_requested}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={getUrgencyColor(item.urgency)}>
                                                {item.urgency.toUpperCase()}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={getStatusColor(item.status)}>
                                                {item.status.toUpperCase()}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            {item.recipient ? (
                                                <div>
                                                    <Text fw={500}>{item.recipient.name}</Text>
                                                    <Text size="xs" c="dimmed">
                                                        Blood Group: {item.recipient.blood_group.name}
                                                    </Text>
                                                </div>
                                            ) : (
                                                <Badge variant="light" color="gray">
                                                    General Request
                                                </Badge>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            {item.recipient ? (
                                                <Stack gap="xs">
                                                    {item.recipient.id_number && (
                                                        <Text size="xs" c="dimmed">
                                                            ID: {item.recipient.id_number}
                                                        </Text>
                                                    )}
                                                    {item.recipient.date_of_birth && (
                                                        <Text size="xs" c="dimmed">
                                                            DOB: {new Date(item.recipient.date_of_birth).toLocaleDateString()}
                                                        </Text>
                                                    )}
                                                    {item.recipient.gender && (
                                                        <Text size="xs" c="dimmed">
                                                            Gender: {item.recipient.gender}
                                                        </Text>
                                                    )}
                                                    {item.recipient.medical_notes && (
                                                        <Text size="xs" c="dimmed" fs="italic">
                                                            Notes: {item.recipient.medical_notes}
                                                        </Text>
                                                    )}
                                                </Stack>
                                            ) : (
                                                <Text size="xs" c="dimmed">
                                                    No specific recipient
                                                </Text>
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}