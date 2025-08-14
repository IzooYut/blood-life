import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea, Select, Button, Grid, Alert, Text, Group, Badge } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';
import BloodRequestItemForm from '@/components/blood_requests/blood-request-items';
import { BreadcrumbItem } from '@/types';
import { RecipientFormData } from '@/components/recipients/recipient-form';
import { notifications } from '@mantine/notifications';
import { AlertCircleIcon } from 'lucide-react';

interface EditBloodRequestProps {
    bloodRequest: {
        id: string;
        hospital_id: string;
        request_date: string;
        notes: string;
        status: string;
        items: Array<{
            id: string;
            blood_group_id: string;
            is_general: boolean;
            units_requested: string;
            urgency: string;
            recipient_id: string | null;
            recipient?: {
                id: string;
                name: string;
                id_number: string;
                date_of_birth: string;
                blood_group_id: string;
                medical_notes: string;
            };
        }>;
    };
    hospitals: Array<{ id: string; name: string }>;
    recipients: Array<{ id: string; name: string; blood_group_id: string; }>;
    bloodGroups: Array<{ id: string; name: string }>;
}

type BloodRequestItemType = {
    id?: string; // Made optional to handle new items
    blood_group_id: string;
    is_general: boolean;
    units_requested: string;
    urgency: string;
    recipient_id: string;
    add_new_recipient: boolean;
    recipient_data: RecipientFormData;
    [key: string]: string | boolean | RecipientFormData | undefined;
};

export default function Edit({ bloodRequest, bloodGroups, hospitals, recipients }: EditBloodRequestProps) {
    const [hasChanges, setHasChanges] = useState(false);

    const form = useForm({
        hospital_id: bloodRequest.hospital_id,
        request_date: bloodRequest.request_date,
        notes: bloodRequest.notes || '',
        items: bloodRequest.items.map(item => ({
            id: item.id,
            blood_group_id: item.blood_group_id,
            is_general: item.is_general,
            units_requested: item.units_requested,
            urgency: item.urgency,
            recipient_id: item.recipient_id || '',
            recipient_data: item.recipient ? {
                name: item.recipient.name,
                id_number: item.recipient.id_number,
                date_of_birth: item.recipient.date_of_birth,
                blood_group_id: item.recipient.blood_group_id,
                medical_notes: item.recipient.medical_notes,
            } : {
                name: '',
                id_number: '',
                date_of_birth: '',
                blood_group_id: '',
                medical_notes: ''
            } as RecipientFormData,
            add_new_recipient: false,
        })) as BloodRequestItemType[], // Explicit type casting
    });

    const addItem = () => {
        form.setData('items', [
            ...form.data.items,
            {
                // No id property for new items - it will be assigned by the server
                blood_group_id: '',
                is_general: true,
                units_requested: '',
                urgency: 'normal',
                recipient_id: '',
                recipient_data: {
                    name: '',
                    id_number: '',
                    date_of_birth: '',
                    gender: 'male',
                    blood_group_id: '',
                    medical_notes: '',
                } as RecipientFormData,
                add_new_recipient: false,
            } as BloodRequestItemType, // Explicit type casting
        ]);
        setHasChanges(true);
    };

    const updateItem = <K extends keyof BloodRequestItemType>(
        index: number,
        field: K,
        value: BloodRequestItemType[K]
    ) => {
        const items = [...form.data.items];
        items[index] = {
            ...items[index],
            [field]: value,
        };
        form.setData('items', items);
        setHasChanges(true);
    };

    const removeItem = (index: number) => {
        const items = [...form.data.items];
        items.splice(index, 1);
        form.setData('items', items);
        setHasChanges(true);
    };

    const updateRecipientField = (index: number, field: keyof RecipientFormData, value: any) => {
        const items = [...form.data.items];
        const updatedRecipient = {
            ...items[index].recipient_data,
            [field]: value,
        };

        items[index].recipient_data = updatedRecipient;
        form.setData('items', items);
        setHasChanges(true);
    };

    const submit = () => {
        form.put(`/blood-requests/${bloodRequest.id}`, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Blood request updated successfully',
                    color: 'green',
                });
                setHasChanges(false);
            },
            onError: (errors) => {
                notifications.show({
                    title: 'Error',
                    message: 'Please check the form for errors',
                    color: 'red',
                });
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blood Requests',
            href: '/blood-requests',
        },
        {
            title: 'Edit Request',
            href: `/blood-requests/${bloodRequest.id}/edit`,
        },
    ];

    // Check if the request can be edited
    const canEdit = !['fulfilled', 'cancelled'].includes(bloodRequest.status.toLowerCase());

    function getStatusColor(status: string) {
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
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Blood Request" />

            <Card>
                <CardHeader>
                    <Group justify="space-between">
                        <CardTitle>Edit Blood Request</CardTitle>
                        <Badge color={getStatusColor(bloodRequest.status)} size="lg">
                            {bloodRequest.status.toUpperCase()}
                        </Badge>
                    </Group>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!canEdit && (
                        <Alert icon={<AlertCircleIcon size={16} />} color="yellow" mb="md">
                            This blood request cannot be edited because it has been {bloodRequest.status.toLowerCase()}.
                        </Alert>
                    )}

                    <Grid>
                        <Grid.Col span={6}>
                            <Select
                                label="Hospital"
                                value={form.data.hospital_id?.toString()}
                                onChange={(value) => {
                                    form.setData('hospital_id', value || '');
                                    setHasChanges(true);
                                }}
                                data={hospitals.map((h: any) => ({ value: h.id?.toString(), label: h.name }))}
                                required
                                disabled={!canEdit}
                                error={form.errors.hospital_id}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <DateInput
                                label="Request Date"
                                value={new Date(form.data.request_date)}
                                onChange={(date) => {
                                    try {
                                        form.setData('request_date', date ? (date as any).toISOString().split('T')[0] : '');
                                        setHasChanges(true);
                                    } catch {
                                        form.setData('request_date', (date as string) || '');
                                        setHasChanges(true);
                                    }
                                }}
                                required
                                disabled={!canEdit}
                                error={form.errors.request_date}
                            />
                        </Grid.Col>
                        
                        <Grid.Col span={12}>
                            <Textarea
                                label="Notes"
                                value={form.data.notes}
                                onChange={(e) => {
                                    form.setData('notes', e.currentTarget.value);
                                    setHasChanges(true);
                                }}
                                placeholder="Additional request details..."
                                disabled={!canEdit}
                                error={form.errors.notes}
                            />
                        </Grid.Col>
                    </Grid>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold">Requested Blood Items</h2>
                            {canEdit && (
                                <Button onClick={addItem}>+ Add Item</Button>
                            )}
                        </div>

                        {form.errors.items && (
                            <Alert color="red" mb="md">
                                {form.errors.items}
                            </Alert>
                        )}

                        {form.data.items.map((item, index) => (
                            <div key={item.id || `new-${index}`} className="space-y-4 border rounded-md p-4">
                                <BloodRequestItemForm
                                    index={index}
                                    item={item}
                                    bloodGroups={bloodGroups}
                                    recipients={recipients}
                                    hospitals={hospitals}
                                    updateItem={updateItem}
                                    removeItem={canEdit ? removeItem : undefined}
                                    hospital_id={form?.data?.hospital_id}
                                    disabled={!canEdit}
                                />
                                
                                {/* Display validation errors for this item */}
                                {Object.entries(form.errors)
                                    .filter(([key]) => key.startsWith(`items.${index}.`) && !key.includes('recipient_data'))
                                    .map(([key, error]) => (
                                        <Alert key={key} color="red">
                                            {error}
                                        </Alert>
                                    ))
                                }
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex gap-4">
                        {canEdit && (
                            <Button 
                                onClick={submit} 
                                loading={form.processing}
                                disabled={!hasChanges}
                            >
                                Update Request
                            </Button>
                        )}
                        <Link href="/blood-requests">
                            <Button variant="outline">
                                Back to List
                            </Button>
                        </Link>
                    </div>

                    {hasChanges && canEdit && (
                        <Alert color="blue" mt="md">
                            You have unsaved changes. Don't forget to click "Update Request" to save your changes.
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}