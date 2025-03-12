<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends BaseController
{
    public function index()
    {
        $data = Banner::orderBy('id', 'DESC')->get();
        if (!count($data)) {
            return $this->sendError(204, 'No Data Found');
        }
        return $this->sendResponse('success', $data);
    }
}
