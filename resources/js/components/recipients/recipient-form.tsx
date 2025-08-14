import { Tooltip } from '@/components/ui/tooltip';
import {
    TextInput,
    Select,
    Textarea,
    Button,
    Grid,
    Box,
    Group,
    Text,
    Title,
} from '@mantine/core';

export interface RecipientFormData {
    name: string;
    date_of_birth: string;
    hospital_id: string;
    id_number: string;
    gender: 'male' | 'female' | 'other';
    blood_group_id: string;
    medical_notes: string;
    [key: string]: any;
}

export interface RecipientFormProps {
    data: RecipientFormData;
    onChange: <K extends keyof RecipientFormData>(field: K, value: RecipientFormData[K]) => void;
    bloodGroups: { id: string; name: string }[];
    hospitals: {id: string; name: string}[];
    hospital_id?: string;
}

export default function RecipientForm({ data, onChange, bloodGroups, hospitals,hospital_id }: RecipientFormProps) {
    return (
        <div className="space-y-4">
            <Grid>
                <Grid.Col span={6}>
                    <TextInput
                        label="Full Name"
                        value={data.name}
                        onChange={(e) => onChange('name', e.currentTarget.value)}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <TextInput
                        label="Phone Number"
                        type="text"
                        value={data.id_number}
                        onChange={(e) => onChange('id_number', e.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <TextInput
                        label="Date of Birth"
                        type="date"
                        value={data.date_of_birth}
                        onChange={(e) => onChange('date_of_birth', e.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Select
                        label="Gender"
                        value={data.gender}
                        onChange={(val) => onChange('gender', val as RecipientFormData['gender'])}

                        data={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' },
                        ]}
                        required
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        label="Hospital"
                        value={data?.hospital_id}
                        defaultValue={hospital_id}
                        onChange={(val) => onChange('hospital_id', val || '')}
                        data={hospitals?.map((h) => ({ value: h.id?.toString(), label: h.name }))}
                        required
                        withScrollArea
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Select
                        label="Blood Group"
                        value={data.blood_group_id}
                        onChange={(val) => onChange('blood_group_id', val || '')}
                        data={bloodGroups?.map((b) => ({ value: b.id?.toString(), label: b.name }))}
                        required
                        withScrollArea
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Textarea
                        label="Medical Notes"
                        value={data.medical_notes}
                        onChange={(e) => onChange('medical_notes', e.currentTarget.value)}
                        placeholder="Optional medical background for this recipient. Helps with donor matching."
                    />
                </Grid.Col>
            </Grid>
          
        </div>
    );
}