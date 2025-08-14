<?php

namespace App\Services;

use App\Models\BloodRequest;
use App\Models\BloodRequestItem;
use App\Models\Recipient;
use Illuminate\Support\Facades\DB;

class BloodRequestService
{
    public function createWithItems(array $data): BloodRequest
    {

        if (empty($data['items'])) {
            throw new \InvalidArgumentException("Blood request must contain at least one item.");
        }
        return DB::transaction(function () use ($data) {

            unset($data['recipient_data']);
            $items = $data['items'];
            unset($data['items']);

            $request = BloodRequest::create($data);
            foreach ($items as $item) {
                $recipient_blood_group = isset($data['is_general']) ? null : $item['blood_group_id'];
                $recipient_id = isset($data['is_general']) ? null : $item['recipient_id'];
                if (empty($item['recipient_id']) && !empty($item['recipient_data']['name'])) {
                    $recipient = Recipient::create($item['recipient_data']);
                    $recipient_id = $recipient->id;
                    $recipient_blood_group = $recipient->blood_group_id;
                }

                BloodRequestItem::create([
                    'blood_request_id' => $request->id,
                    'blood_group_id' => $recipient_blood_group,
                    'recipient_id' => $recipient_id,
                    'units_requested' => $item['units_requested'],
                    'urgency' => $item['urgency'],
                    'status' => 'pending'
                ]);
            }
            return $request;
        });
    }

    public function updateWithItems(BloodRequest $bloodRequest, array $data): BloodRequest
    {
        if (empty($data['items'])) {
            throw new \InvalidArgumentException("Blood request must contain at least one item.");
        }

        // Check if request can be updated
        if (in_array($bloodRequest->status, ['fulfilled', 'cancelled'])) {
            throw new \InvalidArgumentException("Cannot update {$bloodRequest->status} blood request.");
        }

        return DB::transaction(function () use ($bloodRequest, $data) {
            $items = $data['items'];
            unset($data['items']);

            // Update the main blood request
            $bloodRequest->update([
                'hospital_id' => $data['hospital_id'],
                'request_date' => $data['request_date'],
                'notes' => $data['notes'] ?? null,
            ]);

            // Get existing item IDs
            $existingItemIds = $bloodRequest->items()->pluck('id')->toArray();
            $updatedItemIds = [];

            foreach ($items as $item) {
                $recipient_blood_group = isset($item['is_general']) && $item['is_general'] ? $item['blood_group_id'] : null;
                $recipient_id = isset($item['is_general']) && $item['is_general'] ? null : $item['recipient_id'];

                // Handle new recipient creation
                if (empty($item['recipient_id']) && !empty($item['recipient_data']['name']) && isset($item['add_new_recipient']) && $item['add_new_recipient']) {
                    $recipient = Recipient::create($item['recipient_data']);
                    $recipient_id = $recipient->id;
                    $recipient_blood_group = $recipient->blood_group_id;
                }

                $itemData = [
                    'blood_request_id' => $bloodRequest->id,
                    'blood_group_id' => $recipient_blood_group ?: $item['blood_group_id'],
                    'recipient_id' => $recipient_id,
                    'units_requested' => $item['units_requested'],
                    'urgency' => $item['urgency'],
                ];

                if (isset($item['id']) && !empty($item['id'])) {
                    // Update existing item
                    $existingItem = BloodRequestItem::find($item['id']);
                    if ($existingItem && $existingItem->blood_request_id === $bloodRequest->id) {
                        $existingItem->update($itemData);
                        $updatedItemIds[] = $existingItem->id;
                    }
                } else {
                    // Create new item
                    $itemData['status'] = 'pending';
                    $newItem = BloodRequestItem::create($itemData);
                    $updatedItemIds[] = $newItem->id;
                }
            }

            // Delete items that were removed
            $itemsToDelete = array_diff($existingItemIds, $updatedItemIds);
            if (!empty($itemsToDelete)) {
                BloodRequestItem::whereIn('id', $itemsToDelete)->delete();
            }

            // Refresh the model to get updated relationships
            $bloodRequest->refresh();
            
            return $bloodRequest;
        });
    }

     public function delete(BloodRequest $bloodRequest): bool
    {
        // Check if request can be deleted
        if (in_array($bloodRequest->status, ['approved', 'fulfilled', 'partial'])) {
            throw new \InvalidArgumentException("Cannot delete {$bloodRequest->status} blood request.");
        }

        return DB::transaction(function () use ($bloodRequest) {
            // Delete related items first
            $bloodRequest->items()->delete();
            
            // Delete the blood request
            return $bloodRequest->delete();
        });
    }
}
