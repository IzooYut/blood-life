import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BloodGroup, PaginatedBloodGroups } from '@/types/user';
import DeleteConfirmDialog from '@/components/delete-confirm-dialog';
import { toast } from 'react-hot-toast'
import CreateBloodGroup from '@/components/blood_groups/create-blood-group';
import { formatHumanDate } from '@/lib/format-date';
interface BloodGroupIndexProps {
    auth: {
        blood_group: BloodGroup;
    };
    blood_groups: PaginatedBloodGroups;
}

export default function Index({ auth, blood_groups }: BloodGroupIndexProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | null>(null);

    const handleEdit = (blood_group: BloodGroup) => {
        setSelectedBloodGroup(blood_group);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedBloodGroup(null);
        setModalOpen(true);
    };
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bloodGroupToDelete, setBloodGroupToDelete] = useState<BloodGroup | null>(null);
    const confirmDelete = (BloodGroup: BloodGroup) => {
        setBloodGroupToDelete(BloodGroup);
        setDeleteDialogOpen(true);
    };

    const performDelete = () => {
        if (!bloodGroupToDelete) return;

        router.delete(route('blood-groups.destroy', bloodGroupToDelete.id), {
            onSuccess: () => {
                toast.success(

                    `"${bloodGroupToDelete.name}" was deleted successfully.`
                );
                setDeleteDialogOpen(false);
                setBloodGroupToDelete(null);
            },
            onError: () => {
                toast.error(`Failed to delete "${bloodGroupToDelete.name}".`,);
            },
        });
    };



    return (
        <AppLayout breadcrumbs={[{ title: 'Blood Groups List', href: '/blood-groups/index' }]}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border-gray-200">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-medium">Blood Groups List</h3>
                        <Button className="px-4 py-2 bg-[#e25b2a] text-white rounded hover:bg-[#0b0146] cursor-pointer" onClick={handleCreate}>Create Blood Group</Button>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                      <tbody className="divide-y divide-gray-200">
                            {blood_groups.data.map((blood_group: any) => (
                                <tr key={blood_group.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{blood_group.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatHumanDate(blood_group?.created_at)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                                            onClick={() => handleEdit(blood_group)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(blood_group)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Remove
                                        </button>
                                        {/* <Link
                      method="delete"
                      as="button"
                      href={route('customers.destroy', country.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </Link> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4">
                        {blood_groups.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || ''}
                                className={`px-3 py-1 mx-1 rounded ${link.active ? 'bg-[#e25b2a] text-white' : 'bg-gray-200 text-gray-700'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <CreateBloodGroup
                open={modalOpen}
                setOpen={setModalOpen}
                blood_group={selectedBloodGroup}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={performDelete}
                title={`Delete "${bloodGroupToDelete?.name}"?`}
                description="This action cannot be undone."
            />

        </AppLayout>
    );
}
