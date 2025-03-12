<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends BaseController
{
    public function list()
    {
        $customer = $customer = Auth::guard('mobile')->user();
        $noti = Notification::where('customer_id', $customer->id)->latest()->get();
        return $this->sendResponse("Notification list!", $noti);
    }

    public function read($id)
    {
        $noti = Notification::find($id);
        if ($noti) {
            $noti->is_new = 0;
            $noti->update();
            return $this->sendResponse("Notification read!", $noti);
        } else {
            return $this->sendError(422, "Notification not found!");
        }
    }
}
