import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
    Text,
    Badge,
    Card,
    Grid,
    Group,
    Stack,
    Divider,
    Title,
    Button,
    Alert,
    Anchor
} from '@mantine/core';
import { Head, Link } from '@inertiajs/react';
import {
    User,
    Droplets,
    Weight,
    Calendar,
    MapPin,
    FileText,
    Clock,
    Check,
    X,
    AlertTriangle,
    Eye,
    Edit,
    Trash,
    Phone,
    Mail,
    Activity,
    Award,
    Building
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    blood_group: { id: number; name: string } | null;
}

interface BloodCenter {
    id: number;
    name: string;
    address?: string;
    phone?: string;
}

interface BloodGroup {
    id: number;
    name: string;
}

interface BloodRequestItem {
    id: number;
    label: string;
    screening_status?: string;
    unique_code:string;
}

interface Appointment {
    id: number;
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
    created_at: string;
    updated_at: string;
    donor: User | null;
    blood_center: BloodCenter | null;
    blood_group: BloodGroup | null;
    blood_request_item?: BloodRequestItem | null;
    appointment?: Appointment | null;
    added_by?: User | null;
}

interface ViewDonationDetailsProps {
    donation: Donation | null;
    canEdit?: boolean;
    canDelete?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function ViewDonationDetails({
    donation,
    canEdit = false,
    canDelete = false,
    onEdit,
    onDelete
}: ViewDonationDetailsProps) {
    // Helper function to format date with null checking
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Helper function to get screening status color and icon with null checking
    const getScreeningStatusDetails = (status: string | null | undefined) => {
        if (!status) {
            return { color: 'gray', icon: <AlertTriangle size={16} />, label: 'Unknown' };
        }
        
        switch (status.toLowerCase()) {
            case 'passed':
                return { color: 'green', icon: <Check size={16} />, label: 'Passed' };
            case 'failed':
                return { color: 'red', icon: <X size={16} />, label: 'Failed' };
            case 'not_screened':
                return { color: 'yellow', icon: <Clock size={16} />, label: 'Not Screened' };
            default:
                return { color: 'gray', icon: <AlertTriangle size={16} />, label: 'Unknown' };
        }
    };

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
                            <Text c="dimmed" mt="xs">The requested donation could not be found.</Text>
                            <Link href="/donations">
                                <Button variant="light" leftSection={<Eye size={16} />} mt="md">
                                    Back to Donations
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </AppLayout>
        );
    }

    const screeningDetails = getScreeningStatusDetails(donation.screening_status);

    // Safe calculations with null checking
    const donorWeight = donation.weight ? parseFloat(donation.weight) : 0;
    const isValidWeight = !isNaN(donorWeight) && donorWeight > 0;
    const donationVolume = donation.volume_ml || 0;
    const donationEfficiency = isValidWeight ? donationVolume / donorWeight : 0;

    // Safe data access
    const donor = donation.donor;
    const bloodCenter = donation.blood_center;
    const bloodGroup = donation.blood_group;
    const donorName = donor 
        ? `${donor.first_name || ''} ${donor.last_name || ''}`.trim() || 'Unknown Donor'
        : 'Unknown Donor';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Donation',
            href: '/donations',
        },
        {
            title: `Donation #${donation.id || 'Unknown'}`,
            href: `/donations/${donation.id || ''}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Donations #${donation.id || 'Unknown'}`} />
            <div className="space-y-6">
                {/* Header Card */}
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Eye size={24} className="text-red-600" />
                                    <Title order={2} className="text-red-800">
                                        Donation Details
                                    </Title>
                                </div>
                                <Text className="text-red-700 text-lg">
                                    Donation ID: <span className="font-bold">#{donation.id || 'Unknown'}</span>
                                </Text>
                                <Text className="text-red-600 text-sm">
                                    Recorded on {formatDate(donation.created_at)}
                                </Text>
                            </div>

                            {/* Action Buttons */}
                            {(canEdit || canDelete) && (
                                <Group gap="sm">
                                    {canEdit && (
                                        <Button
                                            variant="light"
                                            color="blue"
                                            size="sm"
                                            leftSection={<Edit size={16} />}
                                            onClick={onEdit}
                                            className="transition-all duration-200 hover:scale-105"
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {canDelete && (
                                        <Button
                                            variant="light"
                                            color="red"
                                            size="sm"
                                            leftSection={<Trash size={16} />}
                                            onClick={onDelete}
                                            className="transition-all duration-200 hover:scale-105"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </Group>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Donor Information */}
                <Card className="p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <User size={20} className="text-gray-600" />
                        <Title order={3} className="text-gray-800">
                            Donor Information
                        </Title>
                    </div>

                    {!donor ? (
                        <Alert
                            variant="light"
                            color="yellow"
                            icon={<AlertTriangle size={16} />}
                        >
                            <Text size="sm">Donor information is not available for this donation.</Text>
                        </Alert>
                    ) : (
                        <Grid gutter="lg">
                            <Grid.Col span={{ base: 12, md: 8 }}>
                                <Stack gap="sm">
                                    <Group gap="md">
                                        <Text size="lg" fw={600} className="text-gray-800">
                                            {donorName}
                                        </Text>
                                        <Badge
                                            variant="filled"
                                            color="red"
                                            size="lg"
                                            leftSection={<Droplets size={14} />}
                                        >
                                            {bloodGroup?.name || donor.blood_group?.name || 'Unknown'}
                                        </Badge>
                                    </Group>

                                    {donor.email && donor.email.trim() && (
                                        <Group gap="xs">
                                            <Mail size={16} className="text-gray-500" />
                                            <Anchor href={`mailto:${donor.email}`} size="sm">
                                                {donor.email}
                                            </Anchor>
                                        </Group>
                                    )}

                                    {donor.phone && donor.phone.trim() && (
                                        <Group gap="xs">
                                            <Phone size={16} className="text-gray-500" />
                                            <Anchor href={`tel:${donor.phone}`} size="sm">
                                                {donor.phone}
                                            </Anchor>
                                        </Group>
                                    )}
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Card className="bg-blue-50 border border-blue-200">
                                    <Stack gap="xs" align="center">
                                        <Activity size={20} className="text-blue-600" />
                                        <Text size="sm" c="blue.7" fw={500}>Donor Weight</Text>
                                        <Text size="xl" fw={700} className="text-blue-800">
                                            {isValidWeight ? `${donorWeight} kg` : 'N/A'}
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    )}
                </Card>

                {/* Donation Details */}
                <Card className="p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Droplets size={20} className="text-gray-600" />
                        <Title order={3} className="text-gray-800">
                            Donation Details
                        </Title>
                    </div>

                    <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="md">
                                <Group justify="space-between">
                                    <Text fw={500} className="text-gray-700">Volume Donated:</Text>
                                    <Badge variant="filled" color="orange" size="lg">
                                        {donationVolume} ml
                                    </Badge>
                                </Group>

                                <Group justify="space-between">
                                    <Text fw={500} className="text-gray-700">Donation Date:</Text>
                                    <Group gap="xs">
                                        <Calendar size={16} className="text-purple-500" />
                                        <Text size="sm">{formatDate(donation.donation_date_time)}</Text>
                                    </Group>
                                </Group>

                                <Group justify="space-between">
                                    <Text fw={500} className="text-gray-700">Screening Status:</Text>
                                    <Badge
                                        variant="filled"
                                        color={screeningDetails.color}
                                        leftSection={screeningDetails.icon}
                                    >
                                        {screeningDetails.label}
                                    </Badge>
                                </Group>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card className="bg-green-50 border border-green-200 h-full">
                                <Stack gap="xs" align="center" justify="center" className="h-full">
                                    <Award size={24} className="text-green-600" />
                                    <Text size="sm" c="green.7" fw={500}>Donation Efficiency</Text>
                                    <Text size="xl" fw={700} className="text-green-800">
                                        {isValidWeight && donationVolume > 0 
                                            ? `${donationEfficiency.toFixed(1)} ml/kg`
                                            : 'N/A'
                                        }
                                    </Text>
                                    <Text size="xs" c="green.6" ta="center">
                                        Volume per body weight
                                    </Text>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Card>

                {/* Location Information */}
                <Card className="p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Building size={20} className="text-gray-600" />
                        <Title order={3} className="text-gray-800">
                            Location & Center
                        </Title>
                    </div>

                    {!bloodCenter ? (
                        <Alert
                            variant="light"
                            color="yellow"
                            icon={<AlertTriangle size={16} />}
                        >
                            <Text size="sm">Blood center information is not available for this donation.</Text>
                        </Alert>
                    ) : (
                        <Grid gutter="lg">
                            <Grid.Col span={{ base: 12, md: 8 }}>
                                <Stack gap="sm">
                                    <Group gap="xs">
                                        <MapPin size={16} className="text-gray-500" />
                                        <Text fw={600} className="text-gray-800">
                                            {bloodCenter.name || 'Unknown Center'}
                                        </Text>
                                    </Group>

                                    {bloodCenter.address && bloodCenter.address.trim() && (
                                        <Text size="sm" className="text-gray-600 ml-6">
                                            {bloodCenter.address}
                                        </Text>
                                    )}

                                    {bloodCenter.phone && bloodCenter.phone.trim() && (
                                        <Group gap="xs" className="ml-6">
                                            <Phone size={14} className="text-gray-500" />
                                            <Anchor href={`tel:${bloodCenter.phone}`} size="sm">
                                                {bloodCenter.phone}
                                            </Anchor>
                                        </Group>
                                    )}
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Card className="bg-purple-50 border border-purple-200">
                                    <Stack gap="xs" align="center">
                                        <MapPin size={20} className="text-purple-600" />
                                        <Text size="sm" c="purple.7" fw={500}>Collection Center</Text>
                                        <Text size="sm" fw={600} className="text-purple-800" ta="center">
                                            ID: {bloodCenter.id || 'Unknown'}
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    )}
                </Card>

                {/* Associated Records */}
                {(donation.blood_request_item || donation.appointment) && (
                    <Card className="p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={20} className="text-gray-600" />
                            <Title order={3} className="text-gray-800">
                                Associated Records
                            </Title>
                        </div>

                        <Grid gutter="md">
                            {donation.blood_request_item && (
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Alert
                                        variant="light"
                                        color="blue"
                                        icon={<FileText size={16} />}
                                        title="Linked Blood Request"
                                    >
                                        <Stack gap="xs">
                                            <Text size="sm" fw={500}>
                                                {donation.blood_request_item.unique_code || 'Unknown Request'}
                                            </Text>
                                            {donation.blood_request_item.screening_status && donation.blood_request_item.screening_status.trim() && (
                                                <Badge
                                                    variant="light"
                                                    color={donation.blood_request_item.screening_status === 'fulfilled' ? 'green' : 'orange'}
                                                    size="sm"
                                                >
                                                    {donation.blood_request_item.screening_status}
                                                </Badge>
                                            )}
                                        </Stack>
                                    </Alert>
                                </Grid.Col>
                            )}

                            {donation.appointment && (
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Alert
                                        variant="light"
                                        color="purple"
                                        icon={<Calendar size={16} />}
                                        title="Linked Appointment"
                                    >
                                        <Stack gap="xs">
                                            <Text size="sm">
                                                {formatDate(donation.appointment.appointment_date)}
                                            </Text>
                                            {donation.appointment.status && donation.appointment.status.trim() && (
                                                <Badge
                                                    variant="light"
                                                    color={donation.appointment.status === 'accepted' ? 'green' : 'gray'}
                                                    size="sm"
                                                >
                                                    {donation.appointment.status}
                                                </Badge>
                                            )}
                                        </Stack>
                                    </Alert>
                                </Grid.Col>
                            )}
                        </Grid>
                    </Card>
                )}

                {/* Notes Section */}
                {donation.notes && donation.notes.trim() && (
                    <Card className="p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={20} className="text-gray-600" />
                            <Title order={3} className="text-gray-800">
                                Additional Notes
                            </Title>
                        </div>

                        <Card className="bg-gray-50 border border-gray-200">
                            <Text size="sm" className="text-gray-700 whitespace-pre-wrap">
                                {donation.notes}
                            </Text>
                        </Card>
                    </Card>
                )}

                {/* Health & Safety Indicators */}
                <Card className="p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={20} className="text-gray-600" />
                        <Title order={3} className="text-gray-800">
                            Health & Safety Assessment
                        </Title>
                    </div>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Alert
                                variant="light"
                                color={isValidWeight && donorWeight >= 50 ? "green" : "red"}
                                icon={isValidWeight && donorWeight >= 50 ? <Check size={16} /> : <X size={16} />}
                                title="Weight Requirement"
                            >
                                <Text size="sm">
                                    {!isValidWeight 
                                        ? "⚠ Weight information unavailable"
                                        : donorWeight >= 50
                                            ? `✓ Meets minimum weight (${donorWeight}kg ≥ 50kg)`
                                            : `✗ Below minimum weight (${donorWeight}kg < 50kg)`
                                    }
                                </Text>
                            </Alert>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Alert
                                variant="light"
                                color={donationVolume > 0 && donationVolume <= 500 ? "green" : "yellow"}
                                icon={donationVolume > 0 && donationVolume <= 500 ? <Check size={16} /> : <AlertTriangle size={16} />}
                                title="Volume Safety"
                            >
                                <Text size="sm">
                                    {donationVolume <= 0
                                        ? "⚠ No volume recorded"
                                        : donationVolume <= 500
                                            ? `✓ Safe volume (${donationVolume}ml ≤ 500ml)`
                                            : `⚠ High volume (${donationVolume}ml > 500ml)`
                                    }
                                </Text>
                            </Alert>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Alert
                                variant="light"
                                color={screeningDetails.color}
                                icon={screeningDetails.icon}
                                title="Screening Result"
                            >
                                <Text size="sm">
                                    Medical screening: {screeningDetails.label}
                                </Text>
                            </Alert>
                        </Grid.Col>
                    </Grid>
                </Card>

                {/* Record Information */}
                <Card className="p-6 border border-gray-200 shadow-sm bg-gray-50">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={20} className="text-gray-600" />
                        <Title order={3} className="text-gray-800">
                            Record Information
                        </Title>
                    </div>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="xs">
                                <Text size="sm" fw={500} className="text-gray-700">Created:</Text>
                                <Text size="sm" className="text-gray-600">
                                    {formatDate(donation.created_at)}
                                </Text>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="xs">
                                <Text size="sm" fw={500} className="text-gray-700">Last Updated:</Text>
                                <Text size="sm" className="text-gray-600">
                                    {formatDate(donation.updated_at)}
                                </Text>
                            </Stack>
                        </Grid.Col>

                        {donation.added_by && (
                            <Grid.Col span={12}>
                                <Divider my="xs" />
                                <Group gap="xs">
                                    <User size={14} className="text-gray-500" />
                                    <Text size="sm" className="text-gray-600">
                                        Added by: <span className="font-medium">
                                            {donation.added_by.first_name && donation.added_by.last_name
                                                ? `${donation.added_by.first_name} ${donation.added_by.last_name}`
                                                : donation.added_by.name || 'Unknown User'
                                            }
                                        </span>
                                    </Text>
                                </Group>
                            </Grid.Col>
                        )}
                    </Grid>
                </Card>
            </div>
        </AppLayout>
    );
}