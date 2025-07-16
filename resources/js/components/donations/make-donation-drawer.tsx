// resources/js/components/donations/DonationDrawer.tsx
import {
    Button,
    Drawer,
    Select,
    Textarea,
    NumberInput,
    Stack,
    Group,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface DonationDrawerProps {
    opened: boolean;
    onClose: () => void;
    userId: number;
    bloodCenters: { id: number; name: string }[];
    bloodGroups: { id: number; name: string }[];
    bloodRequests?: { id: number; label: string }[]; // optional
}

export default function DonationDrawer({
    opened,
    onClose,
    userId,
    bloodCenters,
    bloodGroups,
    bloodRequests = [],
}: DonationDrawerProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: userId,
        blood_center_id: '',
        blood_group_id: '',
        blood_request_id: '',
        volume_ml: 450,
        weight: '' as string, // 👈 fix type
        donation_date: '',
        screening_status: 'not_screened',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('donations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

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
                            value={data.blood_request_id}
                            onChange={(val) => setData('blood_request_id', val || '')}
                            error={errors.blood_request_id}
                            clearable
                        />
                    )}

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


                    <DateInput
                        label="Date of Birth"
                        value={data.donation_date}
                        onChange={(date) => {
                            try {
                                setData('donation_date', date ? (date as any).toISOString().split('T')[0] : '');
                            } catch {
                                setData('donation_date', (date as string) || '');
                            }
                        }}
                        error={errors.donation_date}
                        required
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
                        <Button type="submit" loading={processing} color="orange">
                            Save Donation
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Drawer>
    );
}
