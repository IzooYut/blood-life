import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea, Select, Button, Switch, Grid } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';
import BloodRequestItem from '@/components/blood_requests/blood-request-items';
import { BreadcrumbItem } from '@/types';
import RecipientForm, { RecipientFormData } from '@/components/recipients/recipient-form';

interface CreateBloodRequestProps {
    hospitals: Array<{ id: string; name: string }>;
    recipients: Array<{ id: string; name: string; blood_group_id:string; }>;
    bloodGroups: Array<{ id: string; name: string }>;
}

type BloodRequestItem = {
    blood_group_id: string;
    is_general: boolean;
    units_requested: string;
    urgency: string;
    recipient_id: string;
    add_new_recipient: boolean;
    [key: string]: string | boolean;
};





export default function Create({  bloodGroups,hospitals, recipients }: CreateBloodRequestProps) {
    const form = useForm({
        hospital_id: '',
        request_date: new Date().toISOString().substring(0, 10),
        notes: '',
        items: [
            {
                blood_group_id: '',
                is_general: true,
                units_requested: '',
                urgency: 'normal',
                recipient_id: '',
                recipient_data: {
                    name: '',
                    id_number: '',
                    date_of_birth: '',
                    blood_group_id: '',
                    medical_notes: ''
                } as RecipientFormData,
                add_new_recipient: false,

            },
        ],

    });



    const addItem = () => {
        form.setData('items', [
            ...form.data.items,
            {
                blood_group_id: '',
                is_general: true,
                units_requested: '',
                urgency: 'normal',
                recipient_id: '',
                recipient_data: {
                    name: '',
                    date_of_birth: '',
                    gender: 'male',
                    blood_group_id: '',
                    medical_notes: '',
                } as RecipientFormData,
                add_new_recipient: false,
            },
        ]);
    };



    

    const updateItem = <K extends keyof BloodRequestItem>(
        index: number,
        field: K,
        value: BloodRequestItem[K]
    ) => {
        const items = [...form.data.items];
        items[index] = {
            ...items[index],
            [field]: value,
        };
        form.setData('items', items);
    };


    const removeItem = (index: number) => {
        const items = [...form.data.items];
        items.splice(index, 1);
        form.setData('items', items);
    };

    const updateRecipientField = (index: number, field: keyof RecipientFormData, value: any) => {
        const items = [...form.data.items];
        const updatedRecipient = {
            ...items[index].recipient_data,
            [field]: value,
        };

        items[index].recipient_data = updatedRecipient;
        form.setData('items', items);
    }







    const submit = () => {
        form.post('/blood-requests');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blood Requests',
            href: '/blood_requests/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Blood Request" />


            <Card>
                <CardHeader>
                    <CardTitle>Create Blood Request</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Grid>
                        <Grid.Col span={6}>
                             <Select
                                label="Hospital"
                                value={form.data.hospital_id}
                                onChange={(value) => form.setData('hospital_id', value || '')}
                                data={hospitals.map((h: any) => ({ value: h.id?.toString(), label: h.name }))}
                                required
                            />
                        </Grid.Col> 



                        <Grid.Col span={6}>
                            <DateInput
                                label="Request Date"
                                value={form.data.request_date}
                                onChange={(date) => {
                                    try {
                                        form.setData('request_date', date ? (date as any).toISOString().split('T')[0] : '');
                                    } catch {
                                        form.setData('request_date', (date as string) || '');
                                    }
                                }}

                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Textarea
                                label="Notes"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.currentTarget.value)}
                                placeholder="Additional request details..."
                            />

                        </Grid.Col>

                    </Grid>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold">Requested Blood Items</h2>
                            <Button onClick={addItem}>+ Add Item</Button>
                        </div>


                        {form.data.items.map((item, index) => (
                            <div key={index} className="space-y-4 border rounded-md p-4">
                                <BloodRequestItem
                                    index={index}
                                    item={item}
                                    bloodGroups={bloodGroups}
                                    recipients={recipients}
                                    hospitals={hospitals}
                                    updateItem={updateItem}
                                    removeItem={removeItem}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <Button onClick={submit} loading={form.processing} className="w-full md:w-auto">
                            Submit Request
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </AppLayout>
    );
}


