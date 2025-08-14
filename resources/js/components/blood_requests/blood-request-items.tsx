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
    hospital_id,
    disabled = false, // Add disabled prop with default value
}: BloodRequestItemProps) {

    const isAddingRecipient = item?.add_new_recipient ?? false;
    
    // Local state to force re-render and ensure blood group is displayed
    const [localBloodGroupId, setLocalBloodGroupId] = useState(item.blood_group_id);
    const isGeneral  = item?.is_general ? true : false;
    
    // Sync local state with item state
    useEffect(() => {
        setLocalBloodGroupId(item.blood_group_id);
    }, [item.blood_group_id]);

    // NEW: Clear blood_group_id and recipient_id when is_general becomes true
    useEffect(() => {
        if (isGeneral && !disabled) { // Only clear when not disabled
            // Clear blood_group_id if it has a value
            if (item.blood_group_id) {
                setLocalBloodGroupId('');
                updateItem(index, 'blood_group_id', '');
            }
            
            // Clear recipient_id if it has a value
            if (item.recipient_id) {
                updateItem(index, 'recipient_id', '');
            }
            
            // Clear recipient_data if it exists and add_new_recipient is true
            if (item.add_new_recipient && item.recipient_data) {
                updateItem(index, 'recipient_data', getEmptyRecipientData());
            }
            
            // Also clear add_new_recipient flag
            if (item.add_new_recipient) {
                updateItem(index, 'add_new_recipient', false);
            }
        }
    }, [isGeneral, index, disabled]); // Add disabled to dependencies
    
    // Fixed useEffect with proper dependencies and logic
    useEffect(() => {
        if (!isAddingRecipient && item.recipient_id && !isGeneral && !disabled) { // Add !disabled check
            const recipient = recipients.find((r) => r.id?.toString() === item.recipient_id?.toString());
            
            if (recipient && recipient.blood_group_id) {
                const newBloodGroupId = recipient.blood_group_id?.toString();
                
                // Only update if the blood group is different to prevent infinite loops
                if (item.blood_group_id?.toString() !== newBloodGroupId) {
                    // Update both local state and parent state
                    setLocalBloodGroupId(newBloodGroupId);
                    updateItem(index, 'blood_group_id', newBloodGroupId);
                }
            }
        }
    }, [item.recipient_id, isAddingRecipient, recipients, index, isGeneral, disabled]); // Add disabled to dependencies

    return (
        <div className="p-4 border rounded-md space-y-3 relative bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Is General?"
                    value={item.is_general ? 'yes' : 'no'}
                    onChange={(val) => !disabled && updateItem(index, 'is_general', val === 'yes')} // Check disabled
                    data={[
                        { value: 'yes', label: 'Yes (No Blood Group Specified)' },
                        { value: 'no', label: 'No (Specify Blood Group)' },
                    ]}
                    disabled={disabled} // Add disabled prop
                />

                <TextInput
                    label="Units Requested"
                    value={item.units_requested}
                    onChange={(e) => !disabled && updateItem(index, 'units_requested', e.currentTarget.value)} // Check disabled
                    type="number"
                    min={1}
                    required
                    disabled={disabled} // Add disabled prop
                />

                <Tooltip label="Urgency level of this item (affects prioritization)">
                    <Select
                        label="Urgency"
                        value={item.urgency}
                        onChange={(val) => !disabled && updateItem(index, 'urgency', val)} // Check disabled
                        data={[
                            { value: 'normal', label: 'Normal' },
                            { value: 'urgent', label: 'Urgent' },
                            { value: 'very_urgent', label: 'Very Urgent' },
                        ]}
                        required
                        disabled={disabled} // Add disabled prop
                    />
                </Tooltip>
            </div>
        
        {!isGeneral && (
            <>
             <Switch
                label="Add New Recipient?"
                checked={item.add_new_recipient}
                onChange={(e) => !disabled && updateItem(index, 'add_new_recipient', e.currentTarget.checked)} // Check disabled
                disabled={disabled} // Add disabled prop
            />

            {item.add_new_recipient ? (
                <RecipientForm
                    data={item.recipient_data || getEmptyRecipientData()}
                    onChange={(field, value) => {
                        if (!disabled) { // Check disabled
                            const updated = { ...(item.recipient_data || {}), [field]: value };
                            updateItem(index, 'recipient_data', updated);
                        }
                    }}
                    bloodGroups={bloodGroups}
                    hospitals={hospitals}
                    hospital_id={hospital_id}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Recipient"
                        value={item.recipient_id?.toString()}
                        onChange={(val) => {
                            if (!disabled) { // Check disabled
                                updateItem(index, 'recipient_id', val);
                                // Clear blood group when recipient changes to let useEffect handle it
                                if (!val) {
                                    updateItem(index, 'blood_group_id', '');
                                }
                            }
                        }}
                        data={recipients?.map((r) => ({ 
                            value: r.id?.toString(), 
                            label: r?.name ?? '-' 
                        }))}
                        disabled={isAddingRecipient || disabled} // Add disabled prop
                        placeholder="Select a recipient"
                        clearable
                        searchable
                    />
                    
                    <Select
                        key={`blood-group-${index}-${item.recipient_id}`}
                        label="Blood Group"
                        value={localBloodGroupId?.toString() || null}
                        onChange={(val) => {
                            if (!disabled) { // Check disabled
                                setLocalBloodGroupId(val);
                                updateItem(index, 'blood_group_id', val);
                            }
                        }}
                        data={bloodGroups?.map((bg) => ({ 
                            value: bg.id?.toString(), 
                            label: bg?.name ?? '-'
                        })) ?? []}
                        required
                        clearable
                        placeholder={item.recipient_id ? "Select blood group" : "Select recipient first"}
                        disabled={disabled} // Add disabled prop
                    />
                </div>
            )}
            </>
        )}

            {/* Only show remove button if removeItem function is provided and not disabled */}
            {removeItem && !disabled && (
                <div className="text-right">
                    <Button color="red" variant="light" onClick={() => removeItem(index)}>
                        Remove Item
                    </Button>
                </div>
            )}
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
    removeItem?: (index: number) => void; // Make optional for disabled state
    hospital_id?: string;
    disabled?: boolean; // Add disabled prop
}