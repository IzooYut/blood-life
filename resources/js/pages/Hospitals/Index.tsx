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
  Avatar,
  Image,
} from '@mantine/core';
import { useState, useEffect, useTransition } from 'react';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {
  EditIcon,
  TrashIcon,
  EyeIcon,
  MoreVertical,
  DownloadIcon,
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import { type BreadcrumbItem } from '@/types';


interface Hospital {
  id: number;
  name: string;
  logo?: string | null;
  address?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  created_by?: string | null;
}

interface Props extends PageProps {
  hospitals: {
    data: Hospital[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Index() {
  const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hospitals', href: '/hospitals' }];
  const { hospitals } = usePage<Props>().props;


  const [hospitalToDelete, setHospitalToDelete] = useState<Hospital | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);
  // const [debouncedSearch] = useDebouncedValue(search, 300);



  const confirmDelete = (hospital: Hospital) => {
    setHospitalToDelete(hospital);
    open();
  };

  const handleConfirmDelete = () => {
    if (hospitalToDelete) {
      router.delete(route('hospitals.destroy', hospitalToDelete.id));
      close();
    }
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.get(route('hospitals.index'), { page }, {
        preserveState: true,
        replace: true,
      });
    });
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    setIsExporting(format);

    const rawParams: Record<string, string | undefined> = {
      start_date: undefined,
      end_date: undefined,
      // search: debouncedSearch || undefined,
    };

    const params: Record<string, string> = Object.fromEntries(
      Object.entries(rawParams).filter(([_, v]) => v !== undefined) as [string, string][]
    );

    const queryString = new URLSearchParams(params).toString();

    const url = route('reports.export', { type: 'hospitals', format: format }) + '?' + queryString;

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
      <Head title="Hospitals List" />
      <div className="p-4 sm:p-6 w-full space-y-6">
        <Group justify="space-between" className="flex-wrap pb-2 gap-4">
          <div>
            <Title order={2} className="text-[1.5rem] sm:text-[1.75rem] font-bold text-[#0B0146]">Hospitals List</Title>
            <Text size="sm" className="text-gray-500">Manage and view all hospitals</Text>
          </div>
          <Group gap="xs" className="flex-wrap justify-end">
            <Link
              href={route('hospitals.create')}
              className="px-4 py-2 bg-[#e25b2a] text-white rounded hover:bg-[#0b0146]"
            >
              Add Hospital
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

        {isPending ? (
          <Center py="lg">
            <Loader color="orange" size="md" />
          </Center>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b text-left">
                <tr>
                  <th className="px-4 py-2">Logo</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Created By</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6">No hospitals found.</td>
                  </tr>
                ) : (
                  hospitals.data.map((hospital, idx) => (
                    <tr key={hospital.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2">
                        {hospital.logo ? (
                          <Image
                            src={hospital.logo}
                            alt={`${hospital.name} logo`}
                            width={40}
                            height={40}
                            radius="sm"
                            fit="contain"
                          />
                        ) : (
                          <span className="text-gray-400">No Logo</span>
                        )}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-800">{hospital.name}</td>
                      <td className="px-4 py-2">{hospital.address ?? '-'}</td>
                      <td className="px-4 py-2">{hospital.contact_person ?? '-'}</td>
                      <td className="px-4 py-2">{hospital.phone ?? '-'}</td>
                      <td className="px-4 py-2">{hospital.email ?? '-'}</td>
                      <td className="px-4 py-2">{hospital.created_by ?? '-'}</td>
                      <td className="px-4 py-2 text-right">
                        <Menu withinPortal shadow="sm" position="bottom-end">
                          <MenuTarget>
                            <ActionIcon variant="subtle" color="gray">
                              <MoreVertical size={18} />
                            </ActionIcon>
                          </MenuTarget>
                          <MenuDropdown>
                            <MenuItem
                              leftSection={<EyeIcon size={14} />}
                              onClick={() => router.get(route('hospitals.show', hospital.id))}
                            >
                              View
                            </MenuItem>
                            <MenuItem
                              leftSection={<EditIcon size={14} />}
                              onClick={() => router.get(route('hospitals.edit', hospital.id))}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              color="red"
                              leftSection={<TrashIcon size={14} />}
                              onClick={() => confirmDelete(hospital)}
                            >
                              Delete
                            </MenuItem>
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

        {hospitals.last_page > 1 && (
          <div className="flex justify-end mt-6">
            <Pagination
              value={hospitals.current_page}
              onChange={handlePageChange}
              total={hospitals.last_page}
              color="orange"
              radius="xl"
              size="sm"
            />
          </div>
        )}

        <Modal opened={opened} onClose={close} title="Confirm Deletion" centered withCloseButton>
          <Text>
            Are you sure you want to delete <strong>{hospitalToDelete?.name}</strong>?
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
