import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, Badge, Table, ActionIcon, Group, Text, TextInput, Select, Pagination, Stack, Grid } from '@mantine/core';
// import { IconEye, IconPlus, IconCalendar, IconBuilding, IconDroplet, IconSearch, IconFilter } from '@tabler/icons-react';
import { BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { BuildingIcon, CalendarIcon, DropletIcon, EyeIcon, FilterIcon, PlusIcon, PlusSquareIcon, SearchIcon } from 'lucide-react';

interface BloodRequestItem {
    id: string;
    blood_group: {
        id: string;
        name: string;
    };
    recipient?: {
        id: string;
        name: string;
        blood_group: {
            id: string;
            name: string;
        };
    };
    units_requested: number;
    urgency: string;
    status: string;
}

interface BloodRequest {
    id: string;
    hospital: {
        id: string;
        name: string;
    };
    request_date: string;
    notes?: string;
    status: string;
    items: BloodRequestItem[];
    created_at: string;
    updated_at: string;
}

interface IndexBloodRequestProps {
    bloodRequests: {
        data: BloodRequest[];
        links: any;
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
        hospital_id?: string;
        urgency?: string;
        per_page?: number;
        sort_by?: string;
        sort_direction?: string;
    };
    filterOptions: {
        hospitals: Array<{ id: string; name: string }>;
        statuses: Array<{ value: string; label: string }>;
        urgencies: Array<{ value: string; label: string }>;
    };
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

export default function Index({ bloodRequests, filters, filterOptions }: IndexBloodRequestProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [hospitalFilter, setHospitalFilter] = useState(filters.hospital_id || '');
    const [urgencyFilter, setUrgencyFilter] = useState(filters.urgency || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'request_date');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
    
    const [debouncedSearch] = useDebouncedValue(searchValue, 300);

    // Handle search and filter changes
    useEffect(() => {
        const params = new URLSearchParams();
        
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (statusFilter) params.set('status', statusFilter);
        if (hospitalFilter) params.set('hospital_id', hospitalFilter);
        if (urgencyFilter) params.set('urgency', urgencyFilter);
        if (sortBy) params.set('sort_by', sortBy);
        if (sortDirection) params.set('sort_direction', sortDirection);
        
        router.get('/blood-requests', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    }, [debouncedSearch, statusFilter, hospitalFilter, urgencyFilter, sortBy, sortDirection]);

    const clearFilters = () => {
        setSearchValue('');
        setStatusFilter('');
        setHospitalFilter('');
        setUrgencyFilter('');
        setSortBy('request_date');
        setSortDirection('desc');
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: string) => {
        if (sortBy !== field) return '';
        return sortDirection === 'asc' ? ' ↑' : ' ↓';
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blood Requests',
            href: '/blood-requests',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blood Requests" />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Blood Requests</CardTitle>
                        <Link href="/blood-requests/create">
                            <Button leftSection={<PlusSquareIcon size={16} />}>
                                New Request
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Card>
                        <CardContent>
                            <Stack gap="md">
                                <Group justify="space-between">
                                    <Text fw={500} size="sm">
                                        <FilterIcon size={16} className="mr-1" />
                                        Filters
                                    </Text>
                                    <Button variant="light" size="xs" onClick={clearFilters}>
                                        Clear All
                                    </Button>
                                </Group>
                                
                                <Grid>
                                    <Grid.Col span={3}>
                                        <TextInput
                                            placeholder="Search hospitals..."
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.currentTarget.value)}
                                            leftSection={<SearchIcon size={16} />}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Select
                                            placeholder="All Hospitals"
                                            value={hospitalFilter}
                                            onChange={(value) => setHospitalFilter(value || '')}
                                            data={filterOptions.hospitals.map(h => ({ value: h.id?.toString(), label: h.name }))}
                                            clearable
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Select
                                            placeholder="All Statuses"
                                            value={statusFilter}
                                            onChange={(value) => setStatusFilter(value || '')}
                                            data={filterOptions.statuses}
                                            clearable
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <Select
                                            placeholder="All Urgencies"
                                            value={urgencyFilter}
                                            onChange={(value) => setUrgencyFilter(value || '')}
                                            data={filterOptions.urgencies}
                                            clearable
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSort('hospital_name')}
                                >
                                    Hospital{getSortIcon('hospital_name')}
                                </Table.Th>
                                <Table.Th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSort('request_date')}
                                >
                                    Request Date{getSortIcon('request_date')}
                                </Table.Th>
                                <Table.Th>Items Count</Table.Th>
                                <Table.Th>Blood Groups</Table.Th>
                                <Table.Th>Total Units</Table.Th>
                                <Table.Th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSort('status')}
                                >
                                    Status{getSortIcon('status')}
                                </Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {bloodRequests.data.map((request) => {
                                const totalUnits = request.items.reduce((sum, item) => sum + item.units_requested, 0);
                                const bloodGroups = [...new Set(request.items.map(item => item.blood_group.name))];
                                const hasUrgentItems = request.items.some(item => item.urgency === 'urgent');
                                
                                return (
                                    <Table.Tr key={request.id}>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <BuildingIcon size={16} />
                                                <Text size="sm" fw={500}>
                                                    {request.hospital.name}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <CalendarIcon size={16} />
                                                <Text size="sm">
                                                    {new Date(request.request_date).toLocaleDateString()}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color="blue">
                                                {request.items.length} items
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <DropletIcon size={16} />
                                                <Text size="sm">
                                                    {bloodGroups.join(', ')}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Badge variant="light" color={hasUrgentItems ? 'red' : 'blue'}>
                                                    {totalUnits} units
                                                </Badge>
                                                {hasUrgentItems && (
                                                    <Badge size="xs" color="red">
                                                        URGENT
                                                    </Badge>
                                                )}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={getStatusColor(request.status)}>
                                                {request.status.toUpperCase()}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Link href={`/blood-requests/${request.id}`}>
                                                    <ActionIcon variant="light" size="sm">
                                                        <EyeIcon size={16} />
                                                    </ActionIcon>
                                                </Link>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>

                    {/* Pagination */}
                    {bloodRequests?.meta?.last_page > 1 && (
                        <div className="mt-4 flex justify-between items-center">
                            <Text size="sm" c="dimmed">
                                Showing {bloodRequests?.meta?.from} to {bloodRequests?.meta?.to} of {bloodRequests.meta.total} results
                            </Text>
                            <Pagination
                                total={bloodRequests.meta.last_page}
                                value={bloodRequests.meta.current_page}
                                onChange={(page) => {
                                    const params = new URLSearchParams(window.location.search);
                                    params.set('page', page.toString());
                                    router.get('/blood-requests', Object.fromEntries(params), {
                                        preserveState: true,
                                        preserveScroll: true,
                                    });
                                }}
                            />
                        </div>
                    )}

                    {bloodRequests?.data?.length === 0 && (
                        <div className="text-center py-8">
                            <Text size="lg" c="dimmed">
                                No blood requests found
                            </Text>
                            <Text size="sm" c="dimmed" mt="xs">
                                {searchValue || statusFilter || hospitalFilter || urgencyFilter 
                                    ? 'Try adjusting your filters or search criteria'
                                    : 'Create your first blood request to get started'
                                }
                            </Text>
                            <Link href="/blood-requests/create">
                                <Button mt="md" leftSection={<PlusIcon size={16} />}>
                                    Create Blood Request
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination can be added here if needed */}
                </CardContent>
            </Card>
        </AppLayout>
    );
}