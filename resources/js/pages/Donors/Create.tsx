import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types';
import {
    TextInput,
    Select,
    Button,
    Grid,
    Box,
    Group,
    Text,
    Title,
    Alert,
    Paper,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { 
    AlertTriangle, 
    Check, 
    Calendar, 
    Info,
    X
} from 'lucide-react';

export default function Create({ bloodGroups }: { bloodGroups: { id: number; name: string }[] }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        gender: '',
        dob: '',
        phone: '',
        email: '',
        blood_group_id: '',
    });

    const [ageEligibility, setAgeEligibility] = useState<{
        isEligible: boolean | null;
        age: number | null;
        message: string;
    }>({
        isEligible: null,
        age: null,
        message: ''
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blood Donors',
            href: '/donors/create',
        },
    ];

    // Calculate age and check eligibility
    const checkAgeEligibility = (dateOfBirth: string | Date) => {
        if (!dateOfBirth) {
            setAgeEligibility({
                isEligible: null,
                age: null,
                message: ''
            });
            return;
        }

        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        
        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Check eligibility (18-65 years)
        const isEligible = age >= 18 && age <= 65;
        
        let message = '';
        if (age < 18) {
            message = `You must be at least 18 years old to donate blood. You are currently ${age} years old.`;
        } else if (age > 65) {
            message = `Blood donation is typically restricted to ages 18-65. You are currently ${age} years old. Please consult with medical staff.`;
        } else {
            message = `Great! At ${age} years old, you meet the age requirement for blood donation.`;
        }

        setAgeEligibility({
            isEligible,
            age,
            message
        });
    };

    // Effect to check eligibility when DOB changes
    useEffect(() => {
        if (data.dob) {
            checkAgeEligibility(data.dob);
        }
    }, [data.dob]);

    const handleDateChange = (date: Date | string | null) => {
        try {
            const dateValue = date ? (date as any).toISOString().split('T')[0] : '';
            setData('dob', dateValue);
        } catch {
            setData('dob', (date as string) || '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Additional client-side validation for age
        if (ageEligibility.isEligible === false && ageEligibility.age !== null) {
            if (ageEligibility.age < 18) {
                // Prevent submission for underage users
                return;
            }
            // For users over 65, we can allow submission but with warning
        }
        
        post('/donors');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Donor" />

            <Card>
                <CardHeader>
                    <CardTitle>
                        <Title order={3} className="text-center">Register New Donor</Title>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {/* Age Eligibility Information */}
                    <Paper withBorder p="md" mb="lg" bg="blue.0">
                        <Group gap="sm" mb="xs">
                            <Info size={20} color="blue" />
                            <Text fw={600} c="blue.7">Blood Donation Age Requirements</Text>
                        </Group>
                        <Text size="sm" c="blue.6">
                            To donate blood safely, you must be between <strong>18-65 years old</strong>. 
                            This ensures both donor safety and optimal blood quality for recipients.
                        </Text>
                    </Paper>

                    <form onSubmit={handleSubmit}>
                        <Grid gutter="md">
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="First Name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.currentTarget.value)}
                                    error={errors.first_name}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Last Name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.currentTarget.value)}
                                    error={errors.last_name}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Select
                                    label="Gender"
                                    placeholder="Select gender"
                                    data={[
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                        { value: 'other', label: 'Other' },
                                    ]}
                                    value={data.gender}
                                    onChange={(value) => setData('gender', value || '')}
                                    error={errors.gender}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Box>
                                    <DateInput
                                        label="Date of Birth"
                                        placeholder="Select your date of birth"
                                        value={data.dob ? new Date(data.dob) : null}
                                        onChange={handleDateChange}
                                        error={errors.dob}
                                        maxDate={new Date()} // Prevent future dates
                                        leftSection={<Calendar size={16} />}
                                        required
                                    />
                                    
                                    {/* Age Eligibility Alert */}
                                    {ageEligibility.isEligible !== null && (
                                        <Box mt="xs">
                                            <Alert
                                                variant="light"
                                                color={ageEligibility.isEligible ? "green" : "red"}
                                                icon={ageEligibility.isEligible ? <Check size={16} /> : <X size={16} />}
                                                title={`Age: ${ageEligibility.age} years old`}
                                            >
                                                <Text size="sm">
                                                    {ageEligibility.message}
                                                </Text>
                                            </Alert>
                                        </Box>
                                    )}
                                </Box>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.currentTarget.value)}
                                    error={errors.phone}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.currentTarget.value)}
                                    error={errors.email}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Select
                                    label="Blood Group"
                                    placeholder="Select blood group"
                                    data={bloodGroups.map((bg) => ({ value: String(bg.id), label: bg.name }))}
                                    value={data.blood_group_id}
                                    onChange={(value) => setData('blood_group_id', value || '')}
                                    error={errors.blood_group_id}
                                    required
                                />
                            </Grid.Col>

                            {/* Warning for over 65 */}
                            {ageEligibility.isEligible === false && ageEligibility.age !== null && ageEligibility.age > 65 && (
                                <Grid.Col span={12}>
                                    <Alert
                                        variant="light"
                                        color="yellow"
                                        icon={<AlertTriangle size={16} />}
                                        title="Age Consideration"
                                    >
                                        <Text size="sm">
                                            While you're over the typical age limit, some blood centers may accept donors over 65 
                                            after additional medical screening. Please consult with the medical staff at your 
                                            chosen donation center.
                                        </Text>
                                    </Alert>
                                </Grid.Col>
                            )}

                            <Grid.Col span={12}>
                                <Group justify="end" mt="md">
                                    <Button 
                                        type="submit" 
                                        loading={processing} 
                                        color="orange"
                                        disabled={ageEligibility.isEligible === false && ageEligibility.age !== null && ageEligibility.age < 18}
                                    >
                                        {ageEligibility.isEligible === false && ageEligibility.age !== null && ageEligibility.age < 18 
                                            ? 'Age Requirement Not Met' 
                                            : 'Save Donor'
                                        }
                                    </Button>
                                </Group>
                            </Grid.Col>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {/* Additional Information Section */}
            <Card mt="lg">
                <CardHeader>
                    <CardTitle>
                        <Title order={4}>Additional Eligibility Information</Title>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="sm" bg="green.0">
                                <Group gap="xs" mb="xs">
                                    <Check size={16} color="green" />
                                    <Text fw={600} c="green.7">Eligible Ages (18-65)</Text>
                                </Group>
                                <Text size="sm" c="green.6">
                                    • Mature enough to give informed consent<br/>
                                    • Physically capable of handling donation<br/>
                                    • Optimal blood quality for recipients
                                </Text>
                            </Paper>
                        </Grid.Col>
                        
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="sm" bg="red.0">
                                <Group gap="xs" mb="xs">
                                    <X size={16} color="red" />
                                    <Text fw={600} c="red.7">Age Restrictions</Text>
                                </Group>
                                <Text size="sm" c="red.6">
                                    • Under 18: Legal and safety concerns<br/>
                                    • Over 65: Health risk considerations<br/>
                                    • Individual assessment may apply
                                </Text>
                            </Paper>
                        </Grid.Col>
                    </Grid>
                </CardContent>
            </Card>
        </AppLayout>
    );
}