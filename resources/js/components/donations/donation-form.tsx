import React from 'react';
import {
    Button,
    Select,
    Textarea,
    NumberInput,
    Stack,
    Group,
    Alert,
    Text,
    Card,
    Badge,
    Divider,
    Grid,
    ActionIcon,
    Tooltip
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@inertiajs/react';
import { AlertCircle, User, Calendar, Droplets, Weight, FileText, Info } from 'lucide-react';

interface Appointment {
    id: number;
    user: { 
        first_name: string; 
        last_name: string; 
        id: number;
        name: string;
        blood_group: { id: number; name: string };
    };
    blood_center: { name: string; id: number };
    blood_group: { name: string; id: number };
    appointment_date: string;
    blood_request_item_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    notes: string | null;
}

interface DonationFormProps {
    userId: number;
    appointment: Appointment;
    bloodCenters: { id: number; name: string }[];
    bloodGroups: { id: number; name: string }[];
    bloodRequests?: { id: number; label: string }[];
    onSuccess: () => void;
    onCancel: () => void;
}

export default function DonationForm({
    userId,
    appointment,
    bloodCenters,
    bloodGroups,
    bloodRequests = [],
    onSuccess,
    onCancel
}: DonationFormProps) {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('donations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'yellow';
            case 'accepted': return 'green';
            case 'rejected': return 'red';
            default: return 'gray';
        }
    };

    return (
        <div className="space-y-6">
            {/* Appointment Summary Card */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Text className="text-lg font-semibold text-gray-800">
                            Appointment Details
                        </Text>
                        <Badge 
                            color={getStatusColor(appointment.status)}
                            variant="filled"
                            className="capitalize"
                        >
                            {appointment.status}
                        </Badge>
                    </div>
                    
                    <Grid>
                        <Grid.Col span={6}>
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-600" />
                                <div>
                                    <Text size="sm" className="text-gray-600">Donor</Text>
                                    <Text className="font-medium">
                                        {appointment.user.first_name} {appointment.user.last_name}
                                    </Text>
                                </div>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <div className="flex items-center gap-2">
                                <Droplets size={16} className="text-red-500" />
                                <div>
                                    <Text size="sm" className="text-gray-600">Blood Type</Text>
                                    <Text className="font-medium text-red-600">
                                        {appointment.user.blood_group.name}
                                    </Text>
                                </div>
                            </div>
                        </Grid.Col>
                    </Grid>
                </div>
            </Card>

            {/* Error Alert */}
            {(errors.user_id || (errors as any).general) && (
                <Alert
                    icon={<AlertCircle size={16} />}
                    title="Validation Error"
                    color="red"
                    variant="light"
                    className="border-red-200"
                >
                    {errors.user_id || (errors as any).general}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location & Blood Info */}
                <Card className="p-4 border border-gray-200">
                    <Text className="text-md font-semibold mb-4 text-gray-800">
                        Donation Information
                    </Text>
                    
                    <Stack>
                        <Grid>
                            <Grid.Col span={6}>
                                <Select
                                    label="Blood Center"
                                    data={bloodCenters.map((c) => ({ 
                                        value: String(c.id), 
                                        label: c.name 
                                    }))}
                                    value={data.blood_center_id}
                                    onChange={(val) => setData('blood_center_id', val || '')}
                                    error={errors.blood_center_id}
                                    required
                                    leftSection={<Droplets size={16} className="text-gray-500" />}
                                    className="transition-all duration-200 focus-within:scale-[1.02]"
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Blood Group"
                                    data={bloodGroups.map((g) => ({ 
                                        value: String(g.id), 
                                        label: g.name 
                                    }))}
                                    value={data.blood_group_id}
                                    onChange={(val) => setData('blood_group_id', val || '')}
                                    error={errors.blood_group_id}
                                    required
                                    leftSection={<Droplets size={16} className="text-red-500" />}
                                    className="transition-all duration-200 focus-within:scale-[1.02]"
                                />
                            </Grid.Col>
                        </Grid>

                        {bloodRequests.length > 0 && (
                            <Select
                                label="Blood Request"
                                description="Link this donation to a specific blood request (optional)"
                                data={bloodRequests.map((r) => ({ 
                                    value: String(r.id), 
                                    label: r.label 
                                }))}
                                value={data.blood_request_item_id}
                                onChange={(val) => setData('blood_request_item_id', val || '')}
                                error={errors.blood_request_item_id}
                                clearable
                                leftSection={<FileText size={16} className="text-gray-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                            />
                        )}
                    </Stack>
                </Card>

                {/* Physical Measurements */}
                <Card className="p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Weight size={18} className="text-gray-600" />
                        <Text className="text-md font-semibold text-gray-800">
                            Physical Measurements
                        </Text>
                    </div>
                    
                    <Grid>
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Volume (ml)"
                                description="Standard donation volume"
                                value={data.volume_ml}
                                onChange={(val) => setData('volume_ml', Number(val))}
                                error={errors.volume_ml}
                                required
                                min={100}
                                max={1000}
                                step={50}
                                leftSection={<Droplets size={16} className="text-blue-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Weight (kg)"
                                description="Donor's current weight"
                                value={data.weight === '' ? undefined : parseFloat(data.weight)}
                                onChange={(val) => setData('weight', val === undefined ? '' : String(val))}
                                error={errors.weight}
                                min={0}
                                max={300}
                                allowDecimal
                                placeholder="e.g. 72.5"
                                leftSection={<Weight size={16} className="text-green-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                            />
                        </Grid.Col>
                    </Grid>
                </Card>

                {/* Date & Status */}
                <Card className="p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={18} className="text-gray-600" />
                        <Text className="text-md font-semibold text-gray-800">
                            Date & Screening
                        </Text>
                    </div>
                    
                    <Grid>
                        <Grid.Col span={6}>
                            <DateTimePicker
                                label="Donation Date & Time"
                                description="When was the donation made?"
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
                                leftSection={<Calendar size={16} className="text-purple-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <div className="flex items-center gap-2">
                                <Select
                                    label="Screening Status"
                                    description="Medical screening result"
                                    data={[
                                        { value: 'not_screened', label: 'Not Screened' },
                                        { value: 'passed', label: 'Passed' },
                                        { value: 'failed', label: 'Failed' },
                                    ]}
                                    value={data.screening_status}
                                    onChange={(val) => setData('screening_status', val || '')}
                                    error={errors.screening_status}
                                    required
                                    leftSection={<AlertCircle size={16} className="text-orange-500" />}
                                    className="transition-all duration-200 focus-within:scale-[1.02] flex-1"
                                />
                                <Tooltip label="Screening determines if the donated blood is safe for use">
                                    <ActionIcon variant="subtle" color="gray" className="mt-6">
                                        <Info size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            </div>
                        </Grid.Col>
                    </Grid>
                </Card>

                {/* Notes */}
                <Card className="p-4 border border-gray-200">
                    <Textarea
                        label="Additional Notes"
                        description="Any additional information about this donation"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.currentTarget.value)}
                        error={errors.notes}
                        minRows={3}
                        maxRows={6}
                        placeholder="Enter any relevant notes, observations, or special circumstances..."
                        leftSection={<FileText size={16} className="text-gray-500" />}
                        className="transition-all duration-200 focus-within:scale-[1.02]"
                    />
                </Card>

                <Divider />

                {/* Action Buttons */}
                <Group justify="end" className="pt-4">
                    <Button 
                        variant="light" 
                        color="gray" 
                        onClick={onCancel}
                        className="transition-all duration-200 hover:scale-105"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        color="orange"
                        disabled={!!errors.user_id}
                        className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-orange-500 to-red-500"
                    >
                        {processing ? 'Saving...' : 'Save Donation'}
                    </Button>
                </Group>
            </form>
        </div>
    );
}