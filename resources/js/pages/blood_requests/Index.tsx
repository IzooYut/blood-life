import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, Badge, Table, ActionIcon, Group, Text, TextInput, Select, Pagination, Stack, Grid, Title, Modal, Alert } from '@mantine/core';
import { BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { BuildingIcon, CalendarIcon, DownloadIcon, DropletIcon, EyeIcon, FilterIcon, Loader, PlusIcon, PlusSquareIcon, SearchIcon, EditIcon, TrashIcon, AlertTriangleIcon } from 'lucide-react';
import { notifications } from '@mantine/notifications';

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

    const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);
    
    // Delete modal state
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // View modal state
    const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

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

    const handleExport = (format: 'pdf' | 'excel') => {
        setIsExporting(format);

        const rawParams: Record<string, string | undefined> = {
            start_date: undefined,
            end_date: undefined,
            search: debouncedSearch || undefined,
        };

        const params: Record<string, string> = Object.fromEntries(
            Object.entries(rawParams).filter(([_, v]) => v !== undefined) as [string, string][]
        );

        const queryString = new URLSearchParams(params).toString();
        const url = route('reports.export', { type: 'requests', format: format }) + '?' + queryString;

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', '');
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        setTimeout(() => setIsExporting(null), 2000);
    };

    // Handle view request
    const handleViewRequest = (request: BloodRequest) => {
        setSelectedRequest(request);
        openViewModal();
    };

    // Handle delete request
    const handleDeleteClick = (requestId: string) => {
        setSelectedRequestId(requestId);
        openDeleteModal();
    };

    const handleConfirmDelete = async () => {
        if (!selectedRequestId) return;

        setIsDeleting(true);
        
        try {
            router.delete(`/blood-requests/${selectedRequestId}`, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Blood request deleted successfully',
                        color: 'green',
                    });
                    closeDeleteModal();
                    setSelectedRequestId(null);
                },
                onError: () => {
                    notifications.show({
                        title: 'Error',
                        message: 'Failed to delete blood request',
                        color: 'red',
                    });
                },
                onFinish: () => {
                    setIsDeleting(false);
                }
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred',
                color: 'red',
            });
            setIsDeleting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blood Requests" />

            {/* Delete Confirmation Modal */}
            <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Confirm Deletion" centered>
                <Alert icon={<AlertTriangleIcon size={16} />} color="red" mb="md">
                    <Text size="sm">
                        Are you sure you want to delete this blood request? This action cannot be undone.
                    </Text>
                </Alert>
                
                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button 
                        color="red" 
                        onClick={handleConfirmDelete}
                        loading={isDeleting}
                    >
                        Delete Request
                    </Button>
                </Group>
            </Modal>

            {/* View Request Modal */}
            <Modal 
                opened={viewModalOpened} 
                onClose={closeViewModal} 
                title="Blood Request Details" 
                size="lg"
                centered
            >
                {selectedRequest && (
                    <Stack gap="md">
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Hospital</Text>
                                <Text>{selectedRequest.hospital.name}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Request Date</Text>
                                <Text>{new Date(selectedRequest.request_date).toLocaleDateString()}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Status</Text>
                                <Badge color={getStatusColor(selectedRequest.status)}>
                                    {selectedRequest.status.toUpperCase()}
                                </Badge>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm" fw={500} c="dimmed">Total Items</Text>
                                <Text>{selectedRequest.items.length}</Text>
                            </Grid.Col>
                        </Grid>

                        {selectedRequest.notes && (
                            <div>
                                <Text size="sm" fw={500} c="dimmed">Notes</Text>
                                <Text size="sm">{selectedRequest.notes}</Text>
                            </div>
                        )}

                        <div>
                            <Text size="sm" fw={500} c="dimmed" mb="xs">Blood Items</Text>
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Blood Group</Table.Th>
                                        <Table.Th>Units</Table.Th>
                                        <Table.Th>Urgency</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {selectedRequest.items.map((item, index) => (
                                        <Table.Tr key={index}>
                                            <Table.Td>{item.blood_group.name}</Table.Td>
                                            <Table.Td>{item.units_requested}</Table.Td>
                                            <Table.Td>
                                                <Badge size="sm" color={getUrgencyColor(item.urgency)}>
                                                    {item.urgency.toUpperCase()}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge size="sm" color={getStatusColor(item.status)}>
                                                    {item.status.toUpperCase()}
                                                </Badge>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                    </Stack>
                )}
            </Modal>

            <Card>
                <CardHeader>
                    <Group justify="space-between" className="flex-wrap pb-2 gap-4">
                        <div>
                            <Title order={2} className="text-[1.5rem] sm:text-[1.75rem] font-bold text-[#0B0146]">Blood Requests List</Title>
                            <Text size="sm" className="text-gray-500">Manage and view all registered Blood Requests</Text>
                        </div>
                        <Group gap="xs" className="flex-wrap justify-end">
                            <Link href="/blood-requests/create">
                                <Button leftSection={<PlusSquareIcon size={16} />}>
                                    New Request
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                color="gray"
                                leftSection={isExporting === 'excel' ? <Loader size={14} /> : <DownloadIcon size={16} />}
                                radius="md"
                                loading={isExporting === 'excel'}
                                onClick={() => handleExport('excel')}
                            >
                                Export Excel
                            </Button>

                            <Button
                                variant="filled"
                                color="orange"
                                leftSection={isExporting === 'pdf' ? <Loader size={14} color="white" /> : <DownloadIcon size={16} />}
                                radius="md"
                                loading={isExporting === 'pdf'}
                                onClick={() => handleExport('pdf')}
                            >
                                Export PDF
                            </Button>
                        </Group>
                    </Group>
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
                                const totalUnits = request.items.reduce((sum, item) => sum + Number(item?.units_requested ?? 0), 0);
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
                                                {/* <ActionIcon 
                                                    variant="light" 
                                                    size="sm"
                                                    onClick={() => handleViewRequest(request)}
                                                    color="blue"
                                                >
                                                    <EyeIcon size={16} />
                                                </ActionIcon> */}
                                                <Link href={`/blood-requests/${request.id}`}>
                                                    <ActionIcon variant="light" size="sm">
                                                        <EyeIcon size={16} />
                                                    </ActionIcon>
                                                </Link>
                                                <Link href={`/blood-requests/${request.id}/edit`}>
                                                    <ActionIcon variant="light" size="sm" color="orange">
                                                        <EditIcon size={16} />
                                                    </ActionIcon>
                                                </Link>
                                                <ActionIcon 
                                                    variant="light" 
                                                    size="sm" 
                                                    color="red"
                                                    onClick={() => handleDeleteClick(request.id)}
                                                >
                                                    <TrashIcon size={16} />
                                                </ActionIcon>
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
                </CardContent>
            </Card>
        </AppLayout>
    );
}