<?php

namespace App\Repositories;

use App\Models\Order;

/**
 * Class OrderRepository
 */
class OrderRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'phone',
        'created_at'
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'name',
        'phone',
        'created_at'
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
        return Order::class;
    }
}
