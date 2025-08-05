import {
    Button,
    Drawer,
    Select,
    Textarea,
    NumberInput,
    Stack,
    Group,
    Alert
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm, router} from '@inertiajs/react';
import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { get } from 'lodash';


interface Appointment {
    id: number;
    user: { first_name: string; last_name: string; id: number, name: string, blood_group: { id: number; name: string } };
    blood_center: { name: string; id: number };
    blood_group: { name: string; id: number };
    appointment_date: string;
    blood_request_item_id: string,
    status: 'pending' | 'accepted' | 'rejected';
    notes: string | null;
}

interface DonationDrawerProps {
    opened: boolean;
    onClose: () => void;
    userId: number;
    appointment: Appointment;
    bloodCenters: { id: number; name: string }[];
    bloodGroups: { id: number; name: string }[];
    bloodRequests?: { id: number; label: string }[]; // optional
}

export default function DonationDrawer({
    opened,
    onClose,
    userId,
    appointment,
    bloodCenters,
    bloodGroups,
    bloodRequests = [],
}: DonationDrawerProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: userId,
        blood_center_id: String(appointment.blood_center.id),
        blood_group_id: String(appointment.user.blood_group.id),
        appointment_id: String(appointment.id),
        blood_request_item_id: String(appointment.blood_request_item_id),
        volume_ml: 450,
        weight: '' as string,
        donation_date_time: new Date().toISOString().slice(0, 16),
        screening_status: 'not_screened',
        notes: '',
    });

    const getInitialFormData = () => ({
        user_id: userId,
        blood_center_id: appointment ? String(appointment.blood_center.id) : '',
        blood_group_id: appointment ? String(appointment.user.blood_group.id) : '',
        appointment_id: appointment ? String(appointment.id) : '',
        blood_request_item_id: '',
        volume_ml: 450,
        weight: '',
        donation_date_time: new Date().toISOString().slice(0, 16),
        screening_status: 'not_screened',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('donations.store'), {
            preserveScroll: true,
            onSuccess: () => {

                setData(getInitialFormData());
                onClose(); // Close the drawer

                router.reload({ only: ['appointments'] });
            },
        });
    };


    useEffect(() => {
        if (opened && appointment) {
            setData(prevData => ({
                ...prevData,
                user_id: userId,
                blood_center_id: String(appointment.blood_center.id),
                blood_group_id: String(appointment.user.blood_group.id),
            }));
        }
    }, [opened, appointment, userId]);

    useEffect(() => {
        if (!opened) reset();
    }, [opened]);

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title="Add Donation"
            position="right"
            size="lg"
            overlayProps={{ opacity: 0.5, blur: 4 }}
        >
            <form onSubmit={handleSubmit}>
                <Stack>
                    {(errors.user_id || (errors as any).general) && (
                        <Alert
                            icon={<AlertCircle size={16} />}
                            title="Validation Error"
                            color="red"
                            variant="light"
                        >
                            {errors.user_id || (errors as any).general}
                        </Alert>
                    )}
                    <Select
                        label="Blood Center"
                        data={bloodCenters.map((c) => ({ value: String(c.id), label: c.name }))}
                        value={data.blood_center_id}
                        onChange={(val) => setData('blood_center_id', val || '')}
                        error={errors.blood_center_id}
                        required

                    />

                    <Select
                        label="Blood Group"
                        data={bloodGroups.map((g) => ({ value: String(g.id), label: g.name }))}
                        value={data.blood_group_id}
                        onChange={(val) => setData('blood_group_id', val || '')}
                        error={errors.blood_group_id}
                        required

                    />

                    {bloodRequests.length > 0 && (
                        <Select
                            label="Blood Request (optional)"
                            data={bloodRequests.map((r) => ({ value: String(r.id), label: r.label }))}
                            value={data.blood_request_item_id}
                            onChange={(val) => setData('blood_request_item_id', val || '')}
                            error={errors.blood_request_item_id}
                            clearable
                        />
                    )}

                    <DateTimePicker
                        label="Donation Date & Time"
                        value={data.donation_date_time ? new Date(data.donation_date_time) : null}
                        onChange={(date) => {
                            try {
                                setData('donation_date_time', date ? (date as any).toISOString() : '');
                            } catch {
                                setData('donation_date_time', date as string);
                            }
                        }}
                        error={errors.donation_date_time}
                        required
                        maxDate={new Date()}
                        placeholder="Select donation date and time"
                        clearable
                    />

                    <NumberInput
                        label="Volume (ml)"
                        value={data.volume_ml}
                        onChange={(val) => setData('volume_ml', Number(val))}
                        error={errors.volume_ml}
                        required
                    />

                    <NumberInput
                        label="Weight (kg)"
                        value={data.weight === '' ? undefined : parseFloat(data.weight)}
                        onChange={(val) => setData('weight', val === undefined ? '' : String(val))}
                        error={errors.weight}
                        min={0}
                        allowDecimal
                        placeholder="e.g. 72.5"
                    />

                    <Select
                        label="Screening Status"
                        data={[
                            { value: 'not_screened', label: 'Not Screened' },
                            { value: 'passed', label: 'Passed' },
                            { value: 'failed', label: 'Failed' },
                        ]}
                        value={data.screening_status}
                        onChange={(val) => setData('screening_status', val || '')}
                        error={errors.screening_status}
                        required
                    />

                    <Textarea
                        label="Notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.currentTarget.value)}
                        error={errors.notes}
                        minRows={2}
                    />

                    <Group justify="end">
                        <Button variant="light" color="gray" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={processing}
                            color="orange"
                            disabled={!!errors.user_id}
                        >
                            Save Donation
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Drawer>
    );
}