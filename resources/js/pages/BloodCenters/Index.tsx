import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Button,
    Group,
    Title,
    Text,
    Pagination,
    Center,
    Loader,
    ActionIcon,
    Modal,
    Menu,
    MenuTarget,
    MenuDropdown,
    MenuItem,
    Badge,
    Drawer,
    Divider,
    Stack,
} from '@mantine/core';
import { useState, useEffect, useTransition } from 'react';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {
    EditIcon,
    TrashIcon,
    DownloadIcon,
    EyeIcon,
    MoreVertical,
    Filter as FilterIcon,
    X,
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import { type BreadcrumbItem } from '@/types';
import { formatNumberWithCommas } from '@/lib/number-utils';
import { formatHumanDate } from '@/lib/format-date';
import FilterRow from '@/components/filter-row';


interface BloodCenter {
    id: number;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    location: string;
    address: string;
    longitude: string;
    latitude: string;
    donations_count: string;
    appointments_count: string;
    created_at: string;
}

interface Props extends PageProps {
    blood_centers: {
        data: BloodCenter[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

const statusColorMap: Record<string, string> = {
    pending: 'gray',
    dispatched: 'blue',
    in_transit: 'yellow',
    at_customs: 'indigo',
    delivered: 'green',
};

export default function Index() {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Blood Centers', href: '/blood_centers' }];
    const { blood_centers, filters } = usePage<Props>().props;

    const [search, setSearch] = useState(filters.search ?? '');

    const [bloodCenterToDelete, setBloodCenterToDelete] = useState<BloodCenter | null>(null);

    const [debouncedSearch] = useDebouncedValue(search, 300);

    const queryParams = () => ({
        search: debouncedSearch || undefined,
    });

    const [opened, { open, close }] = useDisclosure(false);
    const [drawerOpened, drawer] = useDisclosure(false);
    const [isPending, startTransition] = useTransition();
    const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);


    const confirmDelete = (blood_center: BloodCenter) => {
        setBloodCenterToDelete(blood_center);
        open();
    };

    const handleConfirmDelete = () => {
        if (bloodCenterToDelete) {
            router.delete(route('blood_centers.destroy', bloodCenterToDelete.id));
            close();
        }
    };




    useEffect(() => {
        startTransition(() => {
            router.get(route('blood_centers.index'), queryParams(), {
                preserveState: true,
                replace: true,
            });
        });
    }, [debouncedSearch, search]);

    const handlePageChange = (page: number) => {
        router.get(route('blood_centers.index'), { ...queryParams(), page }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = (type: 'pdf' | 'excel') => {
        setIsExporting(type);
        const url = route(`blood_centers.export.${type}`, queryParams());

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', '');
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        setTimeout(() => setIsExporting(null), 2000); // reset after 2s
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blood Centers List" />
            <div className="p-4 sm:p-6 w-full space-y-6">
                <Group justify="space-between" className="flex-wrap pb-2 gap-4">
                    <div>
                        <Title order={2} className="text-[1.5rem] sm:text-[1.75rem] font-bold text-[#0B0146]">Blood Centers List</Title>
                        <Text size="sm" className="text-gray-500">Manage and view all registered blood centers</Text>
                    </div>
                    <Group gap="xs" className="flex-wrap justify-end">
                        <Link
                            href={route('blood_centers.create')}
                            className="px-4 py-2 bg-[#e25b2a] text-white rounded hover:bg-[#0b0146]"

                        >
                            Add Blood Center
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
                        {/* <Button className="sm:hidden" onClick={drawer.open} leftSection={<FilterIcon size={16} />} variant="light">Filters</Button> */}
                    </Group>
                </Group>


                <FilterRow
                    search={search}
                    setSearch={setSearch}
                />

                {isPending ? (
                    <Center py="lg">
                        <Loader color="orange" size="md" />
                    </Center>
                ) : (
                    <div className="overflow-x-auto rounded-xl border bg-white">
                        <table className="min-w-full text-sm text-gray-700">
                            <thead className="bg-gray-50 border-b text-left">
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Contact Person</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Phone</th>
                                    <th className="px-4 py-2">Location</th>
                                    <th className="px-4 py-2">Address</th>
                                    <th className="px-4 py-2">No Of Donations</th>
                                    <th className="px-4 py-2">No Of Appointments</th>
                                    {/* <th className="px-4 py-2">Created At</th> */}
                                    <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blood_centers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6">No donors found.</td>
                                    </tr>
                                ) : (
                                    blood_centers.data.map((blood_center, idx) => (
                                        <tr key={blood_center.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-2">{blood_center.name}</td>
                                            <td className="px-4 py-2">{blood_center?.contact_person ?? '-'}</td>
                                            <td className="px-4 py-2">{blood_center?.email ?? '-'}</td>
                                            <td className="px-4 py-2">{blood_center?.phone ?? '-'}</td>
                                            <td className="px-4 py-2 capitalize">{blood_center.location}</td>
                                            <td className="px-4 py-2">{blood_center.address}</td>
                                            <td className="px-4 py-2">{blood_center.donations_count ?? '-'}</td>
                                            <td className="px-4 py-2">{blood_center.appointments_count ?? '-'}</td>
                                            {/* <td className="px-4 py-2">{formatHumanDate(blood_center?.created_at) ?? '-'}</td> */}
                                            <td className="px-4 py-2 text-right">
                                                <Menu withinPortal shadow="sm" position="bottom-end">
                                                    <MenuTarget>
                                                        <ActionIcon variant="subtle" color="gray"><MoreVertical size={18} /></ActionIcon>
                                                    </MenuTarget>
                                                    <MenuDropdown>
                                                        <MenuItem leftSection={<EyeIcon size={14} />} onClick={() => router.get(route('blood_centers.show', blood_center.id))}>View</MenuItem>
                                                        <MenuItem leftSection={<EditIcon size={14} />} onClick={() => router.get(route('blood_centers.edit', blood_center.id))}>Edit</MenuItem>
                                                        <MenuItem color="red" leftSection={<TrashIcon size={14} />} onClick={() => confirmDelete(blood_center)}>Delete</MenuItem>
                                                    </MenuDropdown>
                                                </Menu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    {/* <Text className="text-base font-medium text-gray-700">
                        Total Cost: <span className="text-[#0B0146] font-semibold">KES {totals.total_cost.toLocaleString()}</span>
                    </Text>
                    <Text className="text-base font-medium text-gray-700">
                        Total Discount: <span className="text-[#0B0146] font-semibold">KES {discount.discount.toLocaleString()}</span>
                    </Text> */}
                    {blood_centers.last_page > 1 && (
                        <Pagination
                            value={blood_centers.current_page}
                            onChange={handlePageChange}
                            total={blood_centers.last_page}
                            color="orange"
                            radius="xl"
                            size="sm"
                        />
                    )}
                </div>

                <Modal opened={opened} onClose={close} title="Confirm Deletion" centered withCloseButton>
                    <Text>
                        Are you sure you want to delete Blood Center <strong>{bloodCenterToDelete?.id}</strong>?
                    </Text>
                    <Group justify="end" mt="lg">
                        <Button variant="light" color="gray" onClick={close}>Cancel</Button>
                        <Button color="red" onClick={handleConfirmDelete}>Confirm</Button>
                    </Group>
                </Modal>
            </div>
        </AppLayout>
    );
}
