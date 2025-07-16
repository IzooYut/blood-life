import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  TextInput,
  Button,
  Grid,
  Title,
  Group,
  Image,
  FileInput,
} from '@mantine/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, UploadIcon } from 'lucide-react';

export default function Edit({ hospital }: { hospital: any }) {
  const { data, setData, put, processing, errors } = useForm({
    _method: 'PUT',
    name: hospital.name || '',
    logo: null as File | null,
    address: hospital.address || '',
    contact_person: hospital.contact_person || '',
    phone: hospital.phone || '',
    email: hospital.email || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/hospitals/${hospital.id}`);
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Hospitals', href: '/hospitals' }, { title: 'Edit', href: `/hospitals/${hospital.id}/edit` }]}>
      <Card>
        <CardHeader>
          <CardTitle><Title order={3} className="text-center">Edit Hospital</Title></CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput label="Name" value={data.name} onChange={(e) => setData('name', e.currentTarget.value)} error={errors.name} required />
              </Grid.Col>
               <Grid.Col span={6}>
                <TextInput label="Contact Person" value={data.contact_person} onChange={(e) => setData('contact_person', e.currentTarget.value)} error={errors.contact_person} />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Phone" value={data.phone} onChange={(e) => setData('phone', e.currentTarget.value)} error={errors.phone} />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.currentTarget.value)} error={errors.email} />
              </Grid.Col>
              <Grid.Col span={6}>
               <Grid.Col span={6}>
                <TextInput label="Address" value={data.address} onChange={(e) => setData('address', e.currentTarget.value)} error={errors.address} />
              </Grid.Col>
             

            {hospital.logo_url && (
              <Image src={hospital.logo_url} alt="Current Logo" w={120} radius="md"  />
            )}

            <FileInput
              label="Update Logo (optional)"
              placeholder="Upload new logo"
              leftSection={<UploadIcon size={16} />}
              value={data.logo}
              onChange={(file) => setData('logo', file)}
              error={errors.logo}
              accept="image/png,image/jpeg,image/jpg"
            />
              </Grid.Col>
             
              <Grid.Col span={12}>
                <Group justify="end">
                  <Button type="submit" loading={processing} color="orange">Update Hospital</Button>
                </Group>
              </Grid.Col>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
