import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { BloodGroup } from '@/types/user';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  blood_group?: BloodGroup | null;
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function CreateBloodGroup({ blood_group = null, open, setOpen }: Props) {
  const isEditing = Boolean(blood_group);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    id: blood_group?.id || null,
    name: blood_group?.name || '',
  });

  
  useEffect(() => {
    if (blood_group) {
      setData({
        id: blood_group.id,
        name: blood_group.name,
      });
    } else {
      reset();
    }
  }, [blood_group]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('blood-groups.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        clearErrors();
        setOpen(false);
      },
    });
  };

  const handleCancel = () => {
    clearErrors();
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{isEditing ? 'Edit Blood Group' : 'Add New Blood Group'}</DialogTitle>
        <DialogDescription></DialogDescription>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="sr-only">Blood Group</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Enter Blood Group Name"
            />
            <InputError message={errors.name} />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" className="bg-blue-500" disabled={processing}>
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
