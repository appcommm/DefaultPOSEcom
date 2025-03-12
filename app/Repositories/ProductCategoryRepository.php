<?php

namespace App\Repositories;

use App\Models\ProductCategory;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class ProductCategoryRepository
 */
class ProductCategoryRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'name',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model(): string
    {
        return ProductCategory::class;
    }

    /**
     * @return LengthAwarePaginator|Collection|mixed
     */
    public function storeProductCategory($input)
    {
        try {
            DB::beginTransaction();
            $productCategory = $this->create($input);
            if (array_key_exists('image', $input)) {
                if (is_string($input['image'])) {
                    $media = $productCategory->addMediaFromBase64($input['image'])->toMediaCollection(
                        productCategory::PATH,
                        config('app.media_disc')
                    );
                } else {
                    $media = $productCategory->addMedia($input['image'])->toMediaCollection(
                        productCategory::PATH,
                        config('app.media_disc')
                    );
                }
            }
            DB::commit();

            return $productCategory;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return LengthAwarePaginator|Collection|mixed
     */
    public function updateProductCategory($input, $id)
    {
        try {
            DB::beginTransaction();
            $productCategory = $this->withCount('products');
            $productCategory = $productCategory->update($input, $id);
            if (array_key_exists('image', $input)) {
                if (is_string($input['image'])) {
                    $productCategory->clearMediaCollection(productCategory::PATH);
                    $productCategory['image_url'] = $productCategory->addMediaFromBase64($input['image'])->toMediaCollection(
                        productCategory::PATH,
                        config('app.media_disc')
                    );
                } else {
                    $productCategory->clearMediaCollection(productCategory::PATH);
                    $productCategory['image_url'] = $productCategory->addMedia($input['image'])->toMediaCollection(
                        productCategory::PATH,
                        config('app.media_disc')
                    );
                }
            }
            DB::commit();

            return $productCategory;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
