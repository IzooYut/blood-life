import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import RecipientForm, { RecipientFormData } from '@/components/recipients/recipient-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button,Title,Group } from '@mantine/core';

export default function Create({ blood_groups,hospitals }:
     { blood_groups: { id: string; name: string }[];
      hospitals: { id: string; name: string }[]; }) {
  const form = useForm<RecipientFormData>({
    name: '',
    id_number: '',
    hospital_id:'',
    date_of_birth: '',
    gender: 'male',
    blood_group_id: '',
    medical_notes: '',
  });

  const submit = () => {
    form.post('/recipients', {
      preserveScroll: true,
    });
  };

  const handleChange = (field: keyof RecipientFormData, value: string | null) => {
    form.setData({
      ...form.data,
      [field]: value || ''
    });
  };

  return (
        <AppLayout breadcrumbs={[{ title: 'Recipients', href: '/recipients/create' }]}>
    
      <Card>
        <CardHeader>
          <CardTitle><Title order={3} className="text-center">Create New Recipient</Title></CardTitle>
        </CardHeader>
        <CardContent>
          <RecipientForm
            data={form.data}
            onChange={handleChange}
            bloodGroups={blood_groups}
            hospitals={hospitals}
          />

          <Group justify="center" className='mt-4'>
            <Button onClick={submit} loading={form.processing} color='orange' className="w-full md:w-auto">
              Save Recipient
            </Button>
            </Group>
        </CardContent>
      </Card>
    
    </AppLayout>
  );
}