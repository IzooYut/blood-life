import React from 'react';
import { Modal, Title, Text } from '@mantine/core';
import { AppointmentForm } from './appointment-from';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: {
    id: number;
    recipientName: string;
    bloodGroup: string;
    urgency: string;
    location: string;
    requiredBy: string;
  };
  bloodGroups: { id: number; name: string }[];
  bloodCenters: { id: number; name: string }[];
}

export const MakeAppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  bloodGroups,
  bloodCenters,
}) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <div>
          <Title order={4}>Book Appointment</Title>
          {appointment && (
            <Text size="sm" c="dimmed" mt={4}>
              For <strong>{appointment.recipientName}</strong> at{' '}
              <strong>{appointment.location}</strong>
            </Text>
          )}
        </div>
      }
      size="lg"
      centered
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <AppointmentForm
        bloodGroups={bloodGroups}
        bloodCenters={bloodCenters}
        selectedBloodRequest={appointment}
        onSuccess={onClose}
      />
    </Modal>
  );
};