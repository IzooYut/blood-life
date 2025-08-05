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


interface Recipient {
    id: number;
    name: string;
    gender: string;
    dob: string;
    id_number: string;
    hospital_name: string | null;
    blood_group_name: string | null;
}

interface Props extends PageProps {
    recipients: {
        data: Recipient[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        gender?: string;
        blood_group?: string;
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
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Recipients', href: '/recipients' }];
    const { recipients, filters } = usePage<Props>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [gender, setGender] = useState(filters.gender ?? '');
    const [bloodGroup, setBloodGroup] = useState(filters.blood_group ?? '');
    const [recipientToDelete, setDonorToDelete] = useState<Recipient | null>(null);

    const [debouncedSearch] = useDebouncedValue(search, 300);

    const queryParams = () => ({
        search: debouncedSearch || undefined,
        gender: gender || undefined,
        blood_group: bloodGroup || undefined,
    });

    const [opened, { open, close }] = useDisclosure(false);
    const [drawerOpened, drawer] = useDisclosure(false);
    const [isPending, startTransition] = useTransition();
    const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);


    const confirmDelete = (recipient: Recipient) => {
        setDonorToDelete(recipient);
        open();
    };

    const handleConfirmDelete = () => {
        if (recipientToDelete) {
            router.delete(route('recipients.destroy', recipientToDelete.id));
            close();
        }
    };




    useEffect(() => {
        startTransition(() => {
            router.get(route('recipients.index'), queryParams(), {
                preserveState: true,
                replace: true,
            });
        });
    }, [debouncedSearch, search, gender, bloodGroup]);

    const handlePageChange = (page: number) => {
        router.get(route('recipients.index'), { ...queryParams(), page }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = (type: 'pdf' | 'excel') => {
        setIsExporting(type);
        const url = route(`recipients.export.${type}`, queryParams());

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', '');
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        setTimeout(() => setIsExporting(null), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipients List" />
            <div className="p-4 sm:p-6 w-full space-y-6">
                <Group justify="space-between" className="flex-wrap pb-2 gap-4">
                    <div>
                        <Title order={2} className="text-[1.5rem] sm:text-[1.75rem] font-bold text-[#0B0146]">Recipients List</Title>
                        <Text size="sm" className="text-gray-500">Manage and view all registered recipients</Text>
                    </div>
                    <Group gap="xs" className="flex-wrap justify-end">
                        <Link
                            href={route('recipients.create')}
                            className="px-4 py-2 bg-[#e25b2a] text-white rounded hover:bg-[#0b0146]"

                        >
                            Add Recipient
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
                    gender={gender}
                    setGender={setGender}
                    bloodGroup={bloodGroup}
                    setBloodGroup={setBloodGroup}
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
                                    <th className="px-4 py-2">Gender</th>
                                    <th className="px-4 py-2">Date of Birth</th>
                                    <th className="px-4 py-2">Phone Number</th>
                                    <th className="px-4 py-2">Gender</th>
                                    <th className="px-4 py-2">Blood Group</th>
                                    <th className="px-4 py-2">Hospital</th>
                                    <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recipients?.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6">No recipients found.</td>
                                    </tr>
                                ) : (
                                    recipients?.data.map((recipient, idx) => (
                                        <tr key={recipient.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-2">{recipient.name}</td>
                                            <td className="px-4 py-2 capitalize">{recipient.gender}</td>
                                            <td className="px-4 py-2">{recipient.dob}</td>
                                            <td className="px-4 py-2">{recipient?.id_number ?? '-'}</td>
                                            <td className="px-4 py-2">{recipient?.gender ?? '-'}</td>
                                            <td className="px-4 py-2">{recipient.blood_group_name ?? '-'}</td>
                                            <td className="px-4 py-2">{recipient.hospital_name ?? '-'}</td>
                                            <td className="px-4 py-2 text-right">
                                                <Menu withinPortal shadow="sm" position="bottom-end">
                                                    <MenuTarget>
                                                        <ActionIcon variant="subtle" color="gray"><MoreVertical size={18} /></ActionIcon>
                                                    </MenuTarget>
                                                    <MenuDropdown>
                                                        <MenuItem leftSection={<EyeIcon size={14} />} onClick={() => router.get(route('recipients.show', recipient.id))}>View</MenuItem>
                                                        <MenuItem leftSection={<EditIcon size={14} />} onClick={() => router.get(route('recipients.edit', recipient.id))}>Edit</MenuItem>
                                                        <MenuItem color="red" leftSection={<TrashIcon size={14} />} onClick={() => confirmDelete(recipient)}>Delete</MenuItem>
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
                    {recipients.last_page > 1 && (
                        <Pagination
                            value={recipients.current_page}
                            onChange={handlePageChange}
                            total={recipients.last_page}
                            color="orange"
                            radius="xl"
                            size="sm"
                        />
                    )}
                </div>

                <Modal opened={opened} onClose={close} title="Confirm Deletion" centered withCloseButton>
                    <Text>
                        Are you sure you want to delete recipient <strong>{recipientToDelete?.id}</strong>?
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
