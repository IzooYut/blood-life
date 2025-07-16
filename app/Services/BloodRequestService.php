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
}
