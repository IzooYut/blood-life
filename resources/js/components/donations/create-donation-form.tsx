
// DonationForm.tsx
import React, { useState, useEffect } from 'react';
import {
    TextInput,
    Select,
    Button,
    Grid,
    Box,
    Group,
    Text,
    Alert,
    Paper,
    Card,
    Divider,
    NumberInput,
    Textarea
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Check,
    Calendar,
    Info,
    X,
    User,
    Droplets,
    Weight,
    FileText,
    MapPin,
    Clock
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    blood_group: { id: number; name: string };
}

interface BloodCenter {
    id: number;
    name: string;
}

interface BloodGroup {
    id: number;
    name: string;
}

interface BloodRequest {
    id: number;
    label: string;
}

interface Appointment {
    id: number;
    user: User;
    blood_center: BloodCenter;
    appointment_date: string;
    status: string;
}

interface DonationFormProps {
    donors: User[];
    bloodCenters: BloodCenter[];
    bloodGroups: BloodGroup[];
    appointments?: Appointment[];
    bloodRequests?: BloodRequest[];
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface VolumeValidation {
    isValid: boolean | null;
    message: string;
    recommendation: string;
}

export default function CreateDonationForm({
    donors,
    bloodCenters,
    bloodGroups,
    appointments = [],
    bloodRequests = [],
    onSuccess,
    onCancel
}: DonationFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        blood_center_id: '',
        blood_group_id: '',
        appointment_id: '',
        blood_request_item_id: '',
        volume_ml: 450,
        weight: '' as string,
        donation_date_time: new Date().toISOString().slice(0, 16),
        screening_status: 'not_screened',
        notes: '',
    });

    const [volumeValidation, setVolumeValidation] = useState<VolumeValidation>({
        isValid: null,
        message: '',
        recommendation: ''
    });

    const [selectedDonor, setSelectedDonor] = useState<User | null>(null);

    // Validate donation volume based on weight
    const validateVolume = (volume: number, weight: string) => {
        if (!weight || !volume) {
            setVolumeValidation({
                isValid: null,
                message: '',
                recommendation: ''
            });
            return;
        }

        const donorWeight = parseFloat(weight);
        if (donorWeight < 50) {
            setVolumeValidation({
                isValid: false,
                message: `Donor weight (${donorWeight}kg) is below minimum requirement of 50kg.`,
                recommendation: 'Donor may not be eligible for standard blood donation.'
            });
            return;
        }

        // Standard volume recommendations based on weight
        let recommendedVolume = 450; // Standard donation
        let isValid = true;
        let message = '';
        let recommendation = '';

        if (donorWeight >= 50 && donorWeight < 60) {
            recommendedVolume = 350;
            if (volume > 400) {
                isValid = false;
                message = `Volume too high for donor weight (${donorWeight}kg).`;
                recommendation = `Recommended maximum: ${recommendedVolume}ml`;
            } else {
                message = `Volume appropriate for donor weight (${donorWeight}kg).`;
                recommendation = `Recommended: ${recommendedVolume}ml`;
            }
        } else if (donorWeight >= 60) {
            recommendedVolume = 450;
            if (volume > 500) {
                isValid = false;
                message = `Volume slightly high for safety guidelines.`;
                recommendation = `Recommended: ${recommendedVolume}ml`;
            } else {
                message = `Volume appropriate for donor weight (${donorWeight}kg).`;
                recommendation = `Standard donation: ${recommendedVolume}ml`;
            }
        }

        setVolumeValidation({
            isValid,
            message,
            recommendation
        });
    };

    // Effect to validate volume when volume or weight changes
    useEffect(() => {
        if (data.volume_ml && data.weight) {
            validateVolume(data.volume_ml, data.weight);
        }
    }, [data.volume_ml, data.weight]);

    // Handle donor selection and auto-fill blood group
    const handleDonorChange = (donorId: string | null) => {
        const id = donorId || '';
        setData('user_id', id);

        if (id) {
            const donor = donors.find(d => d.id === parseInt(id));
            if (donor) {
                setSelectedDonor(donor);
                setData(prev => ({
                    ...prev,
                    user_id: id,
                    blood_group_id: String(donor.blood_group.id)
                }));
            }
        } else {
            setSelectedDonor(null);
            setData('blood_group_id', '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Additional client-side validation
        if (volumeValidation.isValid === false && data.weight && parseFloat(data.weight) < 50) {
            // Prevent submission for underweight donors
            return;
        }

        post('/donations', {
            preserveScroll: true,
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Donation Guidelines Information */}
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Info size={20} className="text-red-600" />
                        <Text className="text-lg font-semibold text-red-800">
                            Blood Donation Guidelines
                        </Text>
                    </div>
                    <Text className="text-red-700">
                        Ensure donor meets all eligibility criteria. Standard donation volume is <span className="font-semibold">450ml</span>.
                        Minimum donor weight requirement is <span className="font-semibold">50kg</span> for safety.
                    </Text>
                </div>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donor Selection */}
                <Card className="p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <User size={18} className="text-gray-600" />
                        <Text className="text-md font-semibold text-gray-800">
                            Donor Information
                        </Text>
                    </div>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                                label="Select Donor"
                                placeholder="Choose a registered donor"
                                data={donors.map((donor) => ({
                                    value: String(donor.id),
                                    label: `${donor.first_name} ${donor.last_name} (${donor.blood_group.name})`
                                }))}
                                value={data.user_id}
                                onChange={handleDonorChange}
                                error={errors.user_id}
                                required
                                leftSection={<User size={16} className="text-gray-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                                searchable
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                                label="Blood Group"
                                placeholder="Blood group (auto-filled)"
                                data={bloodGroups.map((bg) => ({
                                    value: String(bg.id),
                                    label: bg.name
                                }))}
                                value={data.blood_group_id}
                                onChange={(value) => setData('blood_group_id', value || '')}
                                error={errors.blood_group_id}
                                required
                                leftSection={<Droplets size={16} className="text-red-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                                disabled={!!selectedDonor}
                                description={selectedDonor ? "Auto-filled from donor profile" : "Select donor first"}
                            />
                        </Grid.Col>
                    </Grid>

                    {selectedDonor && (
                        <Alert
                            variant="light"
                            color="blue"
                            icon={<Info size={16} />}
                            title="Selected Donor"
                            className="mt-4 border border-blue-200"
                        >
                            <Text size="sm">
                                <strong>{selectedDonor.first_name} {selectedDonor.last_name}</strong> -
                                Blood Type: <strong className="text-red-600">{selectedDonor.blood_group.name}</strong>
                            </Text>
                        </Alert>
                    )}
                </Card>

                {/* Location & Appointment */}
                <Card className="p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={18} className="text-gray-600" />
                        <Text className="text-md font-semibold text-gray-800">
                            Location & Request
                        </Text>
                    </div>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                                label="Blood Center"
                                placeholder="Select donation center"
                                data={bloodCenters.map((center) => ({
                                    value: String(center.id),
                                    label: center.name
                                }))}
                                value={data.blood_center_id}
                                onChange={(value) => setData('blood_center_id', value || '')}
                                error={errors.blood_center_id}
                                required
                                leftSection={<MapPin size={16} className="text-gray-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                            />
                        </Grid.Col>

                        {/* <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                                label="Related Appointment (Optional)"
                                placeholder="Link to appointment"
                                data={appointments.map((apt) => ({
                                    value: String(apt.id),
                                    label: `${apt.user.first_name} ${apt.user.last_name} - ${new Date(apt.appointment_date).toLocaleDateString()}`
                                }))}
                                value={data.appointment_id}
                                onChange={(value) => setData('appointment_id', value || '')}
                                error={errors.appointment_id}
                                leftSection={<Calendar size={16} className="text-purple-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                                clearable
                            />
                        </Grid.Col> */}

                        {bloodRequests.length > 0 && (
                            <Grid.Col span={{base: 12,md: 6}}>
                                <Select
                                    label="Blood Request (Optional)"
                                    placeholder="Link to blood request"
                                    data={bloodRequests.map((req) => ({
                                        value: String(req.id),
                                        label: req.label
                                    }))}
                                    value={data.blood_request_item_id}
                                    onChange={(value) => setData('blood_request_item_id', value || '')}
                                    error={errors.blood_request_item_id}
                                    leftSection={<FileText size={16} className="text-gray-500" />}
                                    className="transition-all duration-200 focus-within:scale-[1.02]"
                                    clearable
                                    description="Associate this donation with a specific blood request"
                                />
                            </Grid.Col>
                        )}
                    </Grid>
                </Card>

                {/* Physical Measurements */}
                <Card className="p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Weight size={18} className="text-gray-600" />
                        <Text className="text-md font-semibold text-gray-800">
                            Physical Measurements
                        </Text>
                    </div>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <NumberInput
                                label="Donor Weight (kg)"
                                placeholder="Enter donor's weight"
                                value={data.weight === '' ? undefined : parseFloat(data.weight)}
                                onChange={(value) => setData('weight', value === undefined ? '' : String(value))}
                                error={errors.weight}
                                min={0}
                                max={300}
                                allowDecimal
                                leftSection={<Weight size={16} className="text-green-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                                description="Minimum 50kg required for donation"
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <NumberInput
                                label="Volume (ml)"
                                placeholder="Donation volume"
                                value={data.volume_ml}
                                onChange={(value) => setData('volume_ml', Number(value))}
                                error={errors.volume_ml}
                                required
                                min={100}
                                max={1000}
                                step={50}
                                leftSection={<Droplets size={16} className="text-blue-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                                description="Standard donation: 450ml"
                            />
                        </Grid.Col>

                        {/* Volume Validation Alert */}
                        {volumeValidation.message && (
                            <Grid.Col span={12}>
                                <Alert
                                    variant="light"
                                    color={volumeValidation.isValid ? "green" : "yellow"}
                                    icon={volumeValidation.isValid ? <Check size={16} /> : <AlertTriangle size={16} />}
                                    title="Volume Assessment"
                                    className="border"
                                >
                                    <Text size="sm">
                                        {volumeValidation.message}
                                        <br />
                                        <strong>{volumeValidation.recommendation}</strong>
                                    </Text>
                                </Alert>
                            </Grid.Col>
                        )}
                    </Grid>
                </Card>

                {/* Date & Screening */}
                <Card className="p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={18} className="text-gray-600" />
                        <Text className="text-md font-semibold text-gray-800">
                            Date & Screening
                        </Text>
                    </div>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <DateTimePicker
                                label="Donation Date & Time"
                                placeholder="Select donation date and time"
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
                                leftSection={<Calendar size={16} className="text-purple-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                                clearable
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                                label="Screening Status"
                                placeholder="Select screening result"
                                data={[
                                    { value: 'not_screened', label: 'Not Screened' },
                                    { value: 'passed', label: 'Passed' },
                                    { value: 'failed', label: 'Failed' },
                                ]}
                                value={data.screening_status}
                                onChange={(value) => setData('screening_status', value || '')}
                                error={errors.screening_status}
                                required
                                leftSection={<Check size={16} className="text-orange-500" />}
                                className="transition-all duration-200 focus-within:scale-[1.02]"
                                description="Medical screening result"
                            />
                        </Grid.Col>
                    </Grid>
                </Card>

                {/* Notes */}
                <Card className="p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={18} className="text-gray-600" />
                        <Text className="text-md font-semibold text-gray-800">
                            Additional Notes
                        </Text>
                    </div>

                    <Textarea
                        label="Notes"
                        placeholder="Any additional information about this donation..."
                        value={data.notes}
                        onChange={(e) => setData('notes', e.currentTarget.value)}
                        error={errors.notes}
                        minRows={3}
                        maxRows={6}
                        leftSection={<FileText size={16} className="text-gray-500" />}
                        className="transition-all duration-200 focus-within:scale-[1.02]"
                        description="Record any observations, special circumstances, or relevant information"
                    />
                </Card>

                <Divider />

                {/* Action Buttons */}
                <Group justify="end" className="pt-4">
                    {onCancel && (
                        <Button
                            variant="light"
                            color="gray"
                            onClick={onCancel}
                            className="transition-all duration-200 hover:scale-105"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        loading={processing}
                        color="orange"
                        disabled={!!(volumeValidation.isValid === false && data.weight && parseFloat(data.weight) < 50)}
                        className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-orange-500 to-red-500"
                    >
                        {processing ? 'Saving...' : 'Record Donation'}
                    </Button>

                </Group>
            </form>
        </div>
    );
}