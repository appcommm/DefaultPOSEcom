<?php

namespace App\Http\Controllers\Dashboard\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Dashboard\API\BaseController;
use App\Models\Region;

class RegionController extends BaseController
{
    public function list()
    {
        $data = Region::orderBy('id', 'desc')->get();
        if(!count($data)){
            return $this->sendError(204,'No Data Found');
        }
        return $this->sendResponse('success', $data);
    }

    public function detail($id)
    {
        $region = Region::with('deliveryFees')->where('id', $id)->get();
        if (count($region)) {
            return $this->sendResponse('success', $region);
        }
        return $this->sendError(204, 'No Data Found');
    }
}
