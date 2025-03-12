<?php

namespace App\Http\Controllers\Dashboard\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Dashboard\API\BaseController;
use App\Http\Resources\Dashboard\CategoryResource;
use App\Models\ProductCategory;

class CategoryController extends BaseController
{
    //category
    public function index()
    {
        $data = ProductCategory::orderBy('id', 'DESC')->get();
        if(!count($data)){
            return $this->sendError(204,'No Data Found');
        }
        return $this->sendResponse('success', CategoryResource::collection($data));

    }
}
