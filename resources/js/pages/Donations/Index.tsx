import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, Badge, Table, ActionIcon, Group, Text, TextInput, Select, Pagination, Stack, Grid } from '@mantine/core';
import { BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { BuildingIcon, CalendarIcon, DropletIcon, EyeIcon, FilterIcon, LucideGift, PlusIcon, PlusSquareIcon, SearchIcon, UserIcon } from 'lucide-react';

export interface Donation {
  id: number
  donor: {
    id: number
    name: string
    email?: string
  } | null
  blood_center: {
    id: number
    name: string
    location?: string
  } | null
  
  blood_request_item: {
    id: number,
    unique_code: string,
    recipient: {
        id: number,
        name: string
    } | null
  } | null
  appointment_id: number | null
  volume_ml: number
  donation_date_time: string
  screening_status: 'not_screened' | 'passed' | 'failed'
  notes: string | null
}

interface IndexDonationProps {
    donations: {
        data: Donation[];
        links: any;
        meta: any;
    };
    filters: {
        search?: string;
        screening_status?: string;
        recipient_id?: string;
        donor_id?: string;
        blood_center_id?: string;
        per_page?: number;
        sort_by?: string;
        sort_direction?: string;
    };
    filterOptions: {
        bloodCenters: Array<{ id: string; name: string }>;
        donors: Array<{ id: string; name: string }>;
        recipients: Array<{ id: string; name: string }>;
        screeningStatuses: Array<{ value: string; label: string }>;
    };
}

const getScreeningStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'not_screened':
            return 'yellow';
        case 'passed':
            return 'green';
        case 'failed':
            return 'red';
        default:
            return 'gray';
    }
};

const formatVolume = (volumeMl: number) => {
    return `${volumeMl} ml`;
};

export default function Index({ donations, filters, filterOptions }: IndexDonationProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [screeningStatusFilter, setScreeningStatusFilter] = useState(filters.screening_status || '');
    const [recipientFilter, setRecipientFilter] = useState(filters.recipient_id || '');
    const [donorFilter, setDonorFilter] = useState(filters.donor_id || '');
    const [bloodCenterFilter, setBloodCenterFilter] = useState(filters.blood_center_id || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'donation_date_time');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
    
    const [debouncedSearch] = useDebouncedValue(searchValue, 300);

    // Handle search and filter changes
    useEffect(() => {
        const params = new URLSearchParams();
        
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (screeningStatusFilter) params.set('screening_status', screeningStatusFilter);
        if (recipientFilter) params.set('recipient_id', recipientFilter);
        if (donorFilter) params.set('donor_id', donorFilter);
        if (bloodCenterFilter) params.set('blood_center_id', bloodCenterFilter);
        if (sortBy) params.set('sort_by', sortBy);
        if (sortDirection) params.set('sort_direction', sortDirection);
        
        router.get('/donations', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    }, [debouncedSearch, screeningStatusFilter, recipientFilter, donorFilter, bloodCenterFilter, sortBy, sortDirection]);

    const clearFilters = () => {
        setSearchValue('');
        setScreeningStatusFilter('');
        setRecipientFilter('');
        setDonorFilter('');
        setBloodCenterFilter('');
        setSortBy('donation_date_time');
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
            title: 'Donations',
            href: '/donations',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Donations" />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Blood Donations</CardTitle>
                        <Link href="/donations/create">
                            <Button leftSection={<PlusSquareIcon size={16} />}>
                                New Donation
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
                                    <Grid.Col span={2}>
                                        <TextInput
                                            placeholder="Search donations..."
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.currentTarget.value)}
                                            leftSection={<SearchIcon size={16} />}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Select
                                            placeholder="All Donors"
                                            value={donorFilter}
                                            onChange={(value) => setDonorFilter(value || '')}
                                            data={filterOptions.donors.map(d => ({ value: d.id?.toString(), label: d.name }))}
                                            clearable
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Select
                                            placeholder="All Recipients"
                                            value={recipientFilter}
                                            onChange={(value) => setRecipientFilter(value || '')}
                                            data={filterOptions.recipients.map(r => ({ value: r.id?.toString(), label: r.name }))}
                                            clearable
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Select
                                            placeholder="All Blood Centers"
                                            value={bloodCenterFilter}
                                            onChange={(value) => setBloodCenterFilter(value || '')}
                                            data={filterOptions.bloodCenters.map(bc => ({ value: bc.id?.toString(), label: bc.name }))}
                                            clearable
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Select
                                            placeholder="All Statuses"
                                            value={screeningStatusFilter}
                                            onChange={(value) => setScreeningStatusFilter(value || '')}
                                            data={filterOptions.screeningStatuses}
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
                                    onClick={() => handleSort('donor_name')}
                                >
                                    Donor{getSortIcon('donor_name')}
                                </Table.Th>
                                <Table.Th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSort('donation_date_time')}
                                >
                                    Donation Date{getSortIcon('donation_date_time')}
                                </Table.Th>
                                <Table.Th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSort('blood_center_name')}
                                >
                                    Blood Center{getSortIcon('blood_center_name')}
                                </Table.Th>
                                <Table.Th>Recipient</Table.Th>
                                <Table.Th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSort('volume_ml')}
                                >
                                    Volume{getSortIcon('volume_ml')}
                                </Table.Th>
                                <Table.Th 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSort('screening_status')}
                                >
                                    Screening Status{getSortIcon('screening_status')}
                                </Table.Th>
                                <Table.Th>Request Code</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {donations.data.map((donation) => (
                                <Table.Tr key={donation.id}>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <UserIcon size={16} />
                                            <div>
                                                <Text size="sm" fw={500}>
                                                    {donation.donor?.name || 'Unknown Donor'}
                                                </Text>
                                                {donation.donor?.email && (
                                                    <Text size="xs" c="dimmed">
                                                        {donation.donor.email}
                                                    </Text>
                                                )}
                                            </div>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <CalendarIcon size={16} />
                                            <div>
                                                <Text size="sm">
                                                    {new Date(donation.donation_date_time).toLocaleDateString()}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {new Date(donation.donation_date_time).toLocaleTimeString()}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <BuildingIcon size={16} />
                                            <div>
                                                <Text size="sm" fw={500}>
                                                    {donation.blood_center?.name || 'Unknown Center'}
                                                </Text>
                                                {donation.blood_center?.location && (
                                                    <Text size="xs" c="dimmed">
                                                        {donation.blood_center.location}
                                                    </Text>
                                                )}
                                            </div>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        {donation.blood_request_item?.recipient ? (
                                            <Text size="sm">
                                                {donation.blood_request_item.recipient.name}
                                            </Text>
                                        ) : (
                                            <Text size="sm" c="dimmed">
                                                No recipient
                                            </Text>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <DropletIcon size={16} />
                                            <Badge variant="light" color="blue">
                                                {formatVolume(donation.volume_ml)}
                                            </Badge>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={getScreeningStatusColor(donation.screening_status)}>
                                            {donation.screening_status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        {donation.blood_request_item?.unique_code ? (
                                            <Badge variant="outline" color="gray">
                                                {donation.blood_request_item.unique_code}
                                            </Badge>
                                        ) : (
                                            <Text size="sm" c="dimmed">
                                                No code
                                            </Text>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <Link href={`/donations/${donation.id}`}>
                                                <ActionIcon variant="light" size="sm">
                                                    <EyeIcon size={16} />
                                                </ActionIcon>
                                            </Link>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {/* Pagination */}
                    {donations?.meta?.last_page > 1 && (
                        <div className="mt-4 flex justify-between items-center">
                            <Text size="sm" c="dimmed">
                                Showing {donations?.meta?.from} to {donations?.meta?.to} of {donations.meta.total} results
                            </Text>
                            <Pagination
                                total={donations.meta.last_page}
                                value={donations.meta.current_page}
                                onChange={(page) => {
                                    const params = new URLSearchParams(window.location.search);
                                    params.set('page', page.toString());
                                    router.get('/donations', Object.fromEntries(params), {
                                        preserveState: true,
                                        preserveScroll: true,
                                    });
                                }}
                            />
                        </div>
                    )}

                    {donations?.data?.length === 0 && (
                        <div className="text-center py-8">
                            <Text size="lg" c="dimmed">
                                No donations found
                            </Text>
                            <Text size="sm" c="dimmed" mt="xs">
                                {searchValue || screeningStatusFilter || recipientFilter || donorFilter || bloodCenterFilter 
                                    ? 'Try adjusting your filters or search criteria'
                                    : 'Create your first donation record to get started'
                                }
                            </Text>
                            <Link href="/donations/create">
                                <Button mt="md" leftSection={<LucideGift size={16} />}>
                                    Add Donation
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}