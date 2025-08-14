import React from 'react';
import { Paper, Group, Text, Grid } from '@mantine/core';
import { Check, X, AlertTriangle } from 'lucide-react';

export default function DonationGuidelines() {
    return (
        <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <Group gap="xs" className="mb-3">
                        <Check size={16} className="text-green-600" />
                        <Text className="font-semibold text-green-800">Eligible Donors</Text>
                    </Group>
                    <div className="text-sm text-green-700 space-y-1">
                        <div>• Weight ≥ 50kg</div>
                        <div>• Age 18-65 years</div>
                        <div>• Passed medical screening</div>
                        <div>• No recent donations (8+ weeks)</div>
                    </div>
                </Paper>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                    <Group gap="xs" className="mb-3">
                        <AlertTriangle size={16} className="text-blue-600" />
                        <Text className="font-semibold text-blue-800">Volume Guidelines</Text>
                    </Group>
                    <div className="text-sm text-blue-700 space-y-1">
                        <div>• 50-59kg: Max 350ml</div>
                        <div>• 60kg+: Standard 450ml</div>
                        <div>• Never exceed 500ml</div>
                        <div>• Based on donor safety</div>
                    </div>
                </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
                    <Group gap="xs" className="mb-3">
                        <X size={16} className="text-red-600" />
                        <Text className="font-semibold text-red-800">Safety Restrictions</Text>
                    </Group>
                    <div className="text-sm text-red-700 space-y-1">
                        <div>• Weight less than 50kg: Not eligible</div>
                        <div>• Failed screening: Defer</div>
                        <div>• Recent illness: Wait period</div>
                        <div>• Medication conflicts: Review</div>
                    </div>
                </Paper>
            </Grid.Col>
        </Grid>
    );
}