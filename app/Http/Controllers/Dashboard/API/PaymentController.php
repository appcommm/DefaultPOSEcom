<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Models\Payment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Dashboard\API\BaseController;
use App\Http\Resources\Dashboard\PaymentResource;

class PaymentController extends BaseController
{
    //payments
    public function index()
    {
        $data = Payment::activePayment()->orderBy('id', 'DESC')->get();
        if (!count($data)) {
            return $this->sendError(204, 'No Data Found');
        }
        return $this->sendResponse('success', PaymentResource::collection($data));
    }
}
