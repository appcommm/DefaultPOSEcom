<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "brand" => $this->brand_id ? new BrandResource($this->brand) : '',
            "category" => $this->category_id ? new CategoryResource($this->category) : '',
            "price" => $this->price,
            "status" => $this->status,
            "myanmar_colors" => $this->myanmar_colors ?? [],
            "english_colors" => $this->english_colors ?? [],
            "sizes" => $this->sizes ?? [],
            // "image" => $this->image->path,
            'instock' => $this->inStock($this->id),
            "created_at" => $this->created_at,
        ];
    }
}
