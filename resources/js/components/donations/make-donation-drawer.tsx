import React, { useEffect } from 'react';
import { Drawer } from '@mantine/core';
import { router } from '@inertiajs/react';
import DonationForm from './donation-form';

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

interface DonationDrawerProps {
    opened: boolean;
    onClose: () => void;
    userId: number;
    appointment: Appointment;
    bloodCenters: { id: number; name: string }[];
    bloodGroups: { id: number; name: string }[];
    bloodRequests?: { id: number; label: string }[];
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
    const handleSuccess = () => {
        onClose();
        router.reload({ only: ['appointments'] });
    };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title="Record Blood Donation"
            position="right"
            size="xl"
            overlayProps={{ opacity: 0.5, blur: 4 }}
            styles={{
                title: {
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#374151'
                },
                header: {
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '1rem'
                },
                body: {
                    padding: '1.5rem'
                }
            }}
        >
            <DonationForm
                userId={userId}
                appointment={appointment}
                bloodCenters={bloodCenters}
                bloodGroups={bloodGroups}
                bloodRequests={bloodRequests}
                onSuccess={handleSuccess}
                onCancel={onClose}
            />
        </Drawer>
    );
}