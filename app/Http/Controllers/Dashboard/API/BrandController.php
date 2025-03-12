<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Models\Brand;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Dashboard\API\BaseController;
use App\Http\Resources\Dashboard\BrandResource;

class BrandController extends BaseController
{
    //index
    public function index()
    {
        $data = Brand::orderBy('id', 'DESC')->get();
        if(!count($data)){
            return $this->sendError(204,'No Data Found');
        }
        return $this->sendResponse('success', BrandResource::collection($data));

    }
}
