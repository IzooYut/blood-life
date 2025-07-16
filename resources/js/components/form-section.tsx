import React from 'react';
import { Box, Title, Text, Paper } from '@mantine/core';
import { Transition } from '@mantine/core';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  visible?: boolean;
}

export default function FormSection({
  title,
  description,
  children,
  visible = true,
}: FormSectionProps) {
  return (
    <Transition
      mounted={visible}
      transition="slide-up"
      duration={300}
      timingFunction="ease"
    >
      {(styles) => (
        <Paper  shadow="xs" p="md" radius="md" style={styles}>
          <Box mb="sm">
            <Title order={3} size="h5" c="dark.6" className='text-center'>
              {title}
            </Title>
            {description && (
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            )}
          </Box>
          <Box className="space-y-4">{children}</Box>
        </Paper>
      )}
    </Transition>
  );
}
