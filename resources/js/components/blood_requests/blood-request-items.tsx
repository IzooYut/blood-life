import { Select, Button, TextInput, Tooltip, Switch } from "@mantine/core";
import RecipientForm, { RecipientFormData } from "../recipients/recipient-form";
import { useEffect, useState } from "react";

export default function BloodRequestItemForm({
    index,
    item,
    bloodGroups,
    recipients,
    hospitals,
    updateItem,
    removeItem,
}: BloodRequestItemProps) {

    const isAddingRecipient = item?.add_new_recipient ?? false;
    
    // Local state to force re-render and ensure blood group is displayed
    const [localBloodGroupId, setLocalBloodGroupId] = useState(item.blood_group_id);
    
    // Sync local state with item state
    useEffect(() => {
        setLocalBloodGroupId(item.blood_group_id);
    }, [item.blood_group_id]);
    
    // Fixed useEffect with proper dependencies and logic
    useEffect(() => {
        if (!isAddingRecipient && item.recipient_id) {
            const recipient = recipients.find((r) => r.id?.toString() === item.recipient_id?.toString());
            
            if (recipient && recipient.blood_group_id) {
                const newBloodGroupId = recipient.blood_group_id?.toString();
                
                // Only update if the blood group is different to prevent infinite loops
                if (item.blood_group_id?.toString() !== newBloodGroupId) {
                    // Update both local state and parent state
                    setLocalBloodGroupId(newBloodGroupId);
                    updateItem(index, 'blood_group_id', newBloodGroupId);
                    
                    // Also update recipient_data if it exists and is different
                    // if (item.recipient_data && item.recipient_data.blood_group_id !== newBloodGroupId) {
                    //     updateItem(index, 'recipient_data', {
                    //         ...item.recipient_data,
                    //         blood_group_id: newBloodGroupId,
                    //     });
                    // }
                }
            }
        }
    }, [item.recipient_id, isAddingRecipient, recipients, index]);

    return (
        <div className="p-4 border rounded-md space-y-3 relative bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Is General?"
                    value={item.is_general ? 'yes' : 'no'}
                    onChange={(val) => updateItem(index, 'is_general', val === 'yes')}
                    data={[
                        { value: 'yes', label: 'Yes (No Blood Group Specified)' },
                        { value: 'no', label: 'No (Specify Blood Group)' },
                    ]}
                />

                <TextInput
                    label="Units Requested"
                    value={item.units_requested}
                    onChange={(e) => updateItem(index, 'units_requested', e.currentTarget.value)}
                    type="number"
                    min={1}
                    required
                />

                <Tooltip label="Urgency level of this item (affects prioritization)">
                    <Select
                        label="Urgency"
                        value={item.urgency}
                        onChange={(val) => updateItem(index, 'urgency', val)}
                        data={[
                            { value: 'normal', label: 'Normal' },
                            { value: 'urgent', label: 'Urgent' },
                            { value: 'very_urgent', label: 'Very Urgent' },
                        ]}
                        required
                    />
                </Tooltip>
            </div>

            <Switch
                label="Add New Recipient?"
                checked={item.add_new_recipient}
                onChange={(e) => updateItem(index, 'add_new_recipient', e.currentTarget.checked)}
            />

            {item.add_new_recipient ? (
                <RecipientForm
                    data={item.recipient_data || getEmptyRecipientData()}
                    onChange={(field, value) => {
                        const updated = { ...(item.recipient_data || {}), [field]: value };
                        updateItem(index, 'recipient_data', updated);
                    }}
                    bloodGroups={bloodGroups}
                    hospitals={hospitals}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Recipient"
                        value={item.recipient_id?.toString()}
                        onChange={(val) => {
                            updateItem(index, 'recipient_id', val);
                            // Clear blood group when recipient changes to let useEffect handle it
                            if (!val) {
                                updateItem(index, 'blood_group_id', '');
                            }
                        }}
                        data={recipients?.map((r) => ({ 
                            value: r.id?.toString(), 
                            label: r?.name ?? '-' 
                        }))}
                        disabled={isAddingRecipient}
                        placeholder="Select a recipient"
                        clearable
                    />
                    
                    <Select
                        key={`blood-group-${index}-${item.recipient_id}`}
                        label="Blood Group"
                        value={localBloodGroupId?.toString() || null}
                        onChange={(val) => {
                            setLocalBloodGroupId(val);
                            updateItem(index, 'blood_group_id', val);
                        }}
                        data={bloodGroups?.map((bg) => ({ 
                            value: bg.id?.toString(), 
                            label: bg?.name ?? '-'
                        })) ?? []}
                        required
                        clearable
                        placeholder={item.recipient_id ? "Select blood group" : "Select recipient first"}
                    />
                </div>
            )}

            <div className="text-right">
                <Button color="red" variant="light" onClick={() => removeItem(index)}>
                    Remove Item
                </Button>
            </div>
        </div>
    );
}

const getEmptyRecipientData = (): RecipientFormData => ({
    name: '',
    id_number: '',
    hospital_id: '',
    date_of_birth: '',
    gender: 'male',
    blood_group_id: '',
    medical_notes: '',
});

interface BloodRequestItemProps {
    index: number;
    item: any;
    bloodGroups: Array<{ id: string; name: string }>;
    recipients: Array<{ id: string; name: string; blood_group_id: string; }>;
    hospitals: Array<{ id: string; name: string }>;
    updateItem: (index: number, field: string, value: any) => void;
    removeItem: (index: number) => void;
}