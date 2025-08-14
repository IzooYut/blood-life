import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types';
import { Title } from '@mantine/core';
import CreateDonationForm from '@/components/donations/create-donation-form';
import DonationGuidelines from '@/components/donations/donation-guidlines';

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

interface CreateProps {
    donors: User[];
    bloodCenters: BloodCenter[];
    bloodGroups: BloodGroup[];
    appointments?: Appointment[];
    bloodRequests?: BloodRequest[];
}

export default function Create({ 
    donors, 
    bloodCenters, 
    bloodGroups, 
    appointments = [], 
    bloodRequests = [] 
}: CreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blood Donations',
            href: '/donations/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record Donation" />

            <div className="space-y-6">
                {/* Main Donation Recording Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Title order={3} className="text-center text-gray-800">
                                Record New Blood Donation
                            </Title>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <CreateDonationForm
                            donors={donors}
                            bloodCenters={bloodCenters}
                            bloodGroups={bloodGroups}
                            appointments={appointments}
                            bloodRequests={bloodRequests}
                        />
                    </CardContent>
                </Card>

                {/* Guidelines Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Title order={4} className="text-gray-800">
                                Donation Guidelines & Safety Information
                            </Title>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DonationGuidelines />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}