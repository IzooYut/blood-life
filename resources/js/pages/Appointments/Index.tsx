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
    GiftIcon,
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import { type BreadcrumbItem } from '@/types';
import { formatNumberWithCommas } from '@/lib/number-utils';
import { formatHumanDate, formatHumanDateTime } from '@/lib/format-date';
import FilterRow from '@/components/filter-row';
import DonationDrawer from '@/components/donations/make-donation-drawer';

interface Appointment {
    id: number;
    user: { first_name: string; last_name: string; id: number, name: string, blood_group: { id: number; name: string } };
    blood_center: { name: string; id: number };
    blood_group: { name: string; id: number };
    appointment_date: string;
    status: 'pending' | 'accepted' | 'rejected';
    notes: string | null;
}

interface Props extends PageProps {
    appointments: {
        data: Appointment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        blood_group?: string;
        blood_center?: string;
        userId?: number;
    };
}

const statusColorMap: Record<string, string> = {
    pending: 'gray',
    accepted: 'green',
    rejected: 'red',
};

export default function Index() {
    const { appointments, filters,bloodGroups,b } = usePage<Props>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [bloodGroup, setBloodGroup] = useState(filters.blood_group ?? '');
    const [bloodCenterId, setBloodCenterId] = useState(filters.blood_center ?? '');
    const [userId, setUserId] = useState(filters.blood_center ?? '');

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Appointments', href: '/appointments' }];
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [isPending, startTransition] = useTransition();
    const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);
    const [donationDrawerOpened, { open: openDonationDrawer, close: closeDonationDrawer }] = useDisclosure(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [debouncedSearch] = useDebouncedValue(search, 300);

    const queryParams = () => ({
        search: debouncedSearch || undefined,
    });



    useEffect(() => {
        startTransition(() => {
            router.get(route('appointments.index'), queryParams(), {
                preserveState: true,
                replace: true,
            });
        });
    }, [debouncedSearch]);

    const handlePageChange = (page: number) => {
        router.get(route('appointments.index'), { ...queryParams(), page }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = (type: 'pdf' | 'excel') => {
        setIsExporting(type);
        const url = route(`appointments.export.${type}`, queryParams());

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', '');
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        setTimeout(() => setIsExporting(null), 2000); 
    };



    const handleConfirmDelete = () => {
        if (appointmentToDelete) {
            router.delete(route('appointments.destroy', appointmentToDelete.id));
            close();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointments" />
            <div className="p-4 sm:p-6 space-y-6">
                <Group justify="space-between" className="flex-wrap pb-2 gap-4">
                    <div>
                        <Title order={2} className="text-[1.5rem] sm:text-[1.75rem] font-bold text-[#0B0146]">Appointments List</Title>
                        <Text size="sm" className="text-gray-500">Manage and view all appointments</Text>
                    </div>
                    <Group gap="xs" className="flex-wrap justify-end">
                        <Link
                            href={route('appointments.create')}
                            className="px-4 py-2 bg-[#e25b2a] text-white rounded hover:bg-[#0b0146]"

                        >
                            Add Appointment
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

                <FilterRow
                    search={search}
                    setSearch={setSearch}
                    bloodGroup={bloodGroup}
                    setBloodGroup={setBloodGroup}
                    userId={userId}
                    setUserId={setUserId}


                />


                <div className="overflow-x-auto border bg-white rounded-xl">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-2">Donor</th>
                                <th className="px-4 py-2">Blood Center</th>
                                <th className="px-4 py-2">Blood Group</th>
                                <th className="px-4 py-2">Appointment Date</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-6">No appointments found.</td>
                                </tr>
                            ) : appointments.data.map((a) => (
                                <tr key={a.id}>
                                    <td className="px-4 py-2">{a?.user?.name}
                                        <br />
                                        <Button
                                            size="xs"
                                            variant="light"
                                            color="orange"
                                            leftSection={<GiftIcon size={14} />}
                                            radius="xl"
                                            mt="xs"
                                            onClick={() => {
                                                setSelectedUserId(a.user.id);
                                                openDonationDrawer();
                                            }}
                                        >
                                            Add Donation
                                        </Button>
                                    </td>
                                    <td className="px-4 py-2">{a?.blood_center?.name}</td>
                                    <td className="px-4 py-2">{a?.user?.blood_group?.name}</td>
                                    <td className="px-4 py-2">{formatHumanDateTime(a.appointment_date)}</td>
                                    <td className="px-4 py-2">
                                        <Badge color={statusColorMap[a.status]} variant="light" size="sm" radius="sm">{a.status}</Badge>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <Menu withinPortal shadow="sm" position="bottom-end">
                                            <MenuTarget>
                                                <ActionIcon variant="subtle"><MoreVertical size={18} /></ActionIcon>
                                            </MenuTarget>
                                            <MenuDropdown>
                                                <MenuItem onClick={() => router.get(route('appointments.edit', a.id))} leftSection={<EditIcon size={14} />}>Edit</MenuItem>
                                                <MenuItem color="red" onClick={() => { setAppointmentToDelete(a); open(); }} leftSection={<TrashIcon size={14} />}>Delete</MenuItem>
                                            </MenuDropdown>
                                        </Menu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {appointments.last_page > 1 && (
                    <Pagination
                        value={appointments.current_page}
                        onChange={(page) => router.get(route('appointments.index'), { page }, { preserveState: true, replace: true })}
                        total={appointments.last_page}
                        color="orange"
                        radius="xl"
                        size="sm"
                    />
                )}

                <Modal opened={opened} onClose={close} title="Delete Appointment" centered>
                    <Text>Are you sure you want to delete this appointment?</Text>
                    <Group justify="end" mt="md">
                        <Button variant="light" color="gray" onClick={close}>Cancel</Button>
                        <Button color="red" onClick={handleConfirmDelete}>Confirm</Button>
                    </Group>
                </Modal>
                {selectedUserId !== null && (
                    <DonationDrawer
                        opened={donationDrawerOpened}
                        onClose={closeDonationDrawer}
                        userId={selectedUserId}
                        bloodCenters={[]} // Replace with your actual list
                        bloodGroups={[]}  // Replace with your actual list
                        bloodRequests={[]} // Optional if needed
                    />
                )}

            </div>
        </AppLayout>
    );
}
