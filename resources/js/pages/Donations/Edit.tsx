import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
    Clock,
    Edit
} from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    blood_group: { id: number; name: string } | null;
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
    user: User | null;
    blood_center: BloodCenter | null;
    appointment_date: string;
    status: string;
}

interface Donation {
    id: number;
    user_id: number;
    blood_center_id: number;
    blood_group_id: number;
    appointment_id?: number;
    blood_request_item_id?: number;
    volume_ml: number;
    weight: string;
    donation_date_time: string;
    screening_status: string;
    notes?: string;
    donor: User | null;
    blood_center: BloodCenter | null;
    blood_group: BloodGroup | null;
}

interface EditDonationFormProps {
    donation: Donation | null;
    donors?: User[];
    bloodCenters?: BloodCenter[];
    bloodGroups?: BloodGroup[];
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

export default function EditDonationForm({
    donation,
    donors = [],
    bloodCenters = [],
    bloodGroups = [],
    appointments = [],
    bloodRequests = [],
    onSuccess,
    onCancel
}: EditDonationFormProps) {
    // Early return if donation is null or undefined
    if (!donation) {
        return (
            <AppLayout breadcrumbs={[]}>
                <Head title="Donation Not Found" />
                <Card>
                    <div className="p-6">
                        <div className="text-center py-8">
                            <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
                            <Text size="lg" fw={500}>Donation Not Found</Text>
                            <Text c="dimmed" mt="xs">The donation you're trying to edit could not be found.</Text>
                            <Link href="/donations">
                                <Button variant="light" leftSection={<Edit size={16} />} mt="md">
                                    Back to Donations
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </AppLayout>
        );
    }

    // Safe data access with fallbacks
    const safeDonor = donation.donor;
    const donorName = safeDonor 
        ? `${safeDonor.first_name || ''} ${safeDonor.last_name || ''}`.trim() || 'Unknown Donor'
        : 'Unknown Donor';

    const { data, setData, put, processing, errors } = useForm({
        user_id: donation.user_id ? String(donation.user_id) : '',
        blood_center_id: donation.blood_center_id ? String(donation.blood_center_id) : '',
        blood_group_id: donation.blood_group_id ? String(donation.blood_group_id) : '',
        appointment_id: donation.appointment_id ? String(donation.appointment_id) : '',
        blood_request_item_id: donation.blood_request_item_id ? String(donation.blood_request_item_id) : '',
        volume_ml: donation.volume_ml || 0,
        weight: donation.weight || '',
        donation_date_time: donation.donation_date_time || '',
        screening_status: donation.screening_status || '',
        notes: donation.notes || '',
    });

    const [volumeValidation, setVolumeValidation] = useState<VolumeValidation>({
        isValid: null,
        message: '',
        recommendation: ''
    });

    const [selectedDonor, setSelectedDonor] = useState<User | null>(safeDonor);

    // Helper function to safely parse weight
    const parseWeight = (weight: string | null | undefined): number => {
        if (!weight || typeof weight !== 'string') return 0;
        const parsed = parseFloat(weight);
        return isNaN(parsed) ? 0 : parsed;
    };

    // Validate donation volume based on weight
    const validateVolume = (volume: number | null | undefined, weight: string | null | undefined) => {
        const safeVolume = volume || 0;
        const safeWeight = weight || '';

        if (!safeWeight || !safeVolume || safeVolume <= 0) {
            setVolumeValidation({
                isValid: null,
                message: '',
                recommendation: ''
            });
            return;
        }

        const donorWeight = parseWeight(safeWeight);
        if (donorWeight <= 0) {
            setVolumeValidation({
                isValid: null,
                message: 'Invalid weight entered.',
                recommendation: 'Please enter a valid weight value.'
            });
            return;
        }

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
            if (safeVolume > 400) {
                isValid = false;
                message = `Volume too high for donor weight (${donorWeight}kg).`;
                recommendation = `Recommended maximum: ${recommendedVolume}ml`;
            } else {
                message = `Volume appropriate for donor weight (${donorWeight}kg).`;
                recommendation = `Recommended: ${recommendedVolume}ml`;
            }
        } else if (donorWeight >= 60) {
            recommendedVolume = 450;
            if (safeVolume > 500) {
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

        if (id && donors.length > 0) {
            const donor = donors.find(d => d?.id === parseInt(id));
            if (donor) {
                setSelectedDonor(donor);
                const bloodGroupId = donor.blood_group?.id;
                setData(prev => ({
                    ...prev,
                    user_id: id,
                    blood_group_id: bloodGroupId ? String(bloodGroupId) : ''
                }));
            }
        } else {
            setSelectedDonor(null);
            setData('blood_group_id', '');
        }
    };

    // Safe date formatting
    const formatDonationDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'Unknown Date';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString();
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Additional client-side validation
        const weight = parseWeight(data.weight);
        if (volumeValidation.isValid === false && weight < 50) {
            // Prevent submission for underweight donors
            return;
        }

        put(`/donations/${donation.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Donations',
            href: '/donations',
        },
        {
            title: `Donation #${donation.id || 'Unknown'}`,
            href: `/donations/${donation.id || ''}`,
        },
    ];

    // Prepare safe dropdown data
    const donorOptions = donors
        .filter((donor): donor is User => Boolean(donor))
        .map((donor) => {
            const name = `${donor.first_name || ''} ${donor.last_name || ''}`.trim() || 'Unknown Name';
            const bloodType = donor.blood_group?.name || 'Unknown';
            return {
                value: String(donor.id),
                label: `${name} (${bloodType})`
            };
        });

    const bloodCenterOptions = bloodCenters
        .filter((center): center is BloodCenter => Boolean(center?.name))
        .map((center) => ({
            value: String(center.id),
            label: center.name
        }));

    const bloodGroupOptions = bloodGroups
        .filter((bg): bg is BloodGroup => Boolean(bg?.name))
        .map((bg) => ({
            value: String(bg.id),
            label: bg.name
        }));

    const bloodRequestOptions = bloodRequests
        .filter((req): req is BloodRequest => Boolean(req?.label))
        .map((req) => ({
            value: String(req.id),
            label: req.label
        }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Donation #${donation.id || 'Unknown'}`} />
            <div className="space-y-6">
                {/* Edit Information */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Edit size={20} className="text-blue-600" />
                            <Text className="text-lg font-semibold text-blue-800">
                                Edit Donation Record
                            </Text>
                        </div>
                        <Text className="text-blue-700">
                            Updating donation record for <span className="font-semibold">{donorName}</span> 
                            from {formatDonationDate(donation.donation_date_time)}. 
                            Ensure all information remains accurate and follows safety guidelines.
                        </Text>
                    </div>
                </Card>

                {/* Warning if critical data is missing */}
                {(!donors.length || !bloodCenters.length || !bloodGroups.length) && (
                    <Alert
                        variant="light"
                        color="yellow"
                        icon={<AlertTriangle size={16} />}
                        title="Missing Reference Data"
                    >
                        <Text size="sm">
                            Some reference data is missing which may limit editing capabilities:
                            {!donors.length && ' No donors available.'}
                            {!bloodCenters.length && ' No blood centers available.'}
                            {!bloodGroups.length && ' No blood groups available.'}
                        </Text>
                    </Alert>
                )}

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
                                    data={donorOptions}
                                    value={data.user_id}
                                    onChange={handleDonorChange}
                                    error={errors.user_id}
                                    required
                                    leftSection={<User size={16} className="text-gray-500" />}
                                    className="transition-all duration-200 focus-within:scale-[1.02]"
                                    searchable
                                    disabled={donorOptions.length === 0}
                                    description={donorOptions.length === 0 ? "No donors available" : undefined}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Select
                                    label="Blood Group"
                                    placeholder="Blood group (auto-filled)"
                                    data={bloodGroupOptions}
                                    value={data.blood_group_id}
                                    onChange={(value) => setData('blood_group_id', value || '')}
                                    error={errors.blood_group_id}
                                    required
                                    leftSection={<Droplets size={16} className="text-red-500" />}
                                    className="transition-all duration-200 focus-within:scale-[1.02]"
                                    disabled={!!selectedDonor || bloodGroupOptions.length === 0}
                                    description={
                                        bloodGroupOptions.length === 0 
                                            ? "No blood groups available"
                                            : selectedDonor 
                                                ? "Auto-filled from donor profile" 
                                                : "Select donor first"
                                    }
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
                                    <strong>
                                        {`${selectedDonor.first_name || ''} ${selectedDonor.last_name || ''}`.trim() || 'Unknown Name'}
                                    </strong> -
                                    Blood Type: <strong className="text-red-600">
                                        {selectedDonor.blood_group?.name || 'Unknown'}
                                    </strong>
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
                                    data={bloodCenterOptions}
                                    value={data.blood_center_id}
                                    onChange={(value) => setData('blood_center_id', value || '')}
                                    error={errors.blood_center_id}
                                    required
                                    leftSection={<MapPin size={16} className="text-gray-500" />}
                                    className="transition-all duration-200 focus-within:scale-[1.02]"
                                    disabled={bloodCenterOptions.length === 0}
                                    description={bloodCenterOptions.length === 0 ? "No blood centers available" : undefined}
                                />
                            </Grid.Col>

                            {bloodRequestOptions.length > 0 && (
                                <Grid.Col span={{base: 12, md: 6}}>
                                    <Select
                                        label="Blood Request (Optional)"
                                        placeholder="Link to blood request"
                                        data={bloodRequestOptions}
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
                                    value={data.weight === '' ? undefined : parseWeight(data.weight) || undefined}
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
                                    value={data.volume_ml || undefined}
                                    onChange={(value) => setData('volume_ml', Number(value) || 0)}
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
                                    value={data.donation_date_time ? (() => {
                                        try {
                                            const date = new Date(data.donation_date_time);
                                            return isNaN(date.getTime()) ? null : date;
                                        } catch {
                                            return null;
                                        }
                                    })() : null}
                                    onChange={(date) => {
                                        if (!date) {
                                            setData('donation_date_time', '');
                                            return;
                                        }
                                        
                                        try {
                                            const isoString = (date as Date).toISOString();
                                            setData('donation_date_time', isoString);
                                        } catch {
                                            setData('donation_date_time', String(date));
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
                            color="blue"
                            disabled={
                                !!(volumeValidation.isValid === false && 
                                   data.weight && 
                                   parseWeight(data.weight) < 50) ||
                                donorOptions.length === 0 ||
                                bloodCenterOptions.length === 0 ||
                                bloodGroupOptions.length === 0
                            }
                            className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-500 to-cyan-500"
                        >
                            {processing ? 'Updating...' : 'Update Donation'}
                        </Button>
                    </Group>
                </form>
            </div>
        </AppLayout>
    );
}