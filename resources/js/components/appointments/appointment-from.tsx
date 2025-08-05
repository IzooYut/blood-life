import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Textarea,
    Select,
    Button,
    Grid,
    Group,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

interface AppointmentFormProps {
    bloodGroups: { id: number; name: string }[];
    bloodCenters: { id: number; name: string }[];
    selectedBloodRequest?: {
        id: number;
        recipientName: string;
        bloodGroup: string;
        urgency: string;
        location: string;
        requiredBy: string;
    };
    onSuccess?: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
    bloodGroups,
    bloodCenters,
    selectedBloodRequest,
    onSuccess,
}) => {
    const { data, setData, post, processing, errors } = useForm({
        blood_center_id: '',
        blood_group_id: '',
        appointment_date: '',
        notes: '',
        blood_request_item_id: selectedBloodRequest?.id || '',
    });

    useEffect(() => {
        if (selectedBloodRequest && bloodGroups.length > 0) {
            const matchingBloodGroup = bloodGroups.find(
                (bg) => bg.name === selectedBloodRequest.bloodGroup
            );
            
            if (matchingBloodGroup) {
                setData('blood_group_id', String(matchingBloodGroup.id));
            }
        }
    }, [selectedBloodRequest, bloodGroups, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/appointments', {
            preserveScroll: true,
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                        label="Blood Center"
                        placeholder="Select center"
                        data={bloodCenters.map((bc) => ({
                            value: String(bc.id),
                            label: bc.name,
                        }))}
                        value={data.blood_center_id}
                        onChange={(value) => setData('blood_center_id', value || '')}
                        error={errors.blood_center_id}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                        label="Blood Group"
                        placeholder="Select group"
                        data={bloodGroups.map((bg) => ({
                            value: String(bg.id),
                            label: bg.name,
                        }))}
                        value={data.blood_group_id}
                        onChange={(value) => setData('blood_group_id', value || '')}
                        error={errors.blood_group_id}
                        required
                        disabled={!!selectedBloodRequest} 
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <DateTimePicker
                        label="Appointment Date & Time"
                        value={data.appointment_date as any}
                        onChange={(date) => {
                            try {
                                setData('appointment_date', date ? (date as any).toISOString().split('T')[0] : '');
                            } catch {
                                setData('appointment_date', (date as string) || '');
                            }
                        }}
                        error={errors.appointment_date}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Textarea
                        label="Notes"
                        placeholder="Optional notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.currentTarget.value)}
                        error={errors.notes}
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Group justify="end" mt="md">
                        <Button type="submit" loading={processing} color="red">
                            Book Appointment
                        </Button>
                    </Group>
                </Grid.Col>
            </Grid>
        </form>
    );
};