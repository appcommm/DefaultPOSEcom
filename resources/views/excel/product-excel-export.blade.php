<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>Products Excel Export</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon.ico') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Fonts -->
    <!-- General CSS Files -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" />
</head>

<body>
    <table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
        <thead>
            <tr style="background-color: dodgerblue;">
                {{-- <th style="width: 200%">{{ __('messages.pdf.product') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.code') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.category') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.brand') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.barcode_symbol') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.price') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.unit_price') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.product_unit') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.sale_unit') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.purchase_unit') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.stock_alert') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.order_tax') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.tax_type') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.note') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.warehouse') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.supplier') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.in_stock') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.status') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.product_type') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.variation') }}</th>
                <th style="width: 200%">{{ __('messages.pdf.variation_type') }}</th> --}}
                <th style="width: 200%;">name</th>
                <th style="width: 200%;">code</th>
                <th style="width: 200%;">category</th>
                <th style="width: 200%;">brand</th>
                <th style="width: 200%;">barcode symbol</th>
                <th style="width: 200%;">product cost</th>
                <th style="width: 200%;">product price</th>
                <th style="width: 200%;">product unit</th>
                <th style="width: 200%;">sale unit</th>
                <th style="width: 200%;">purchase unit</th>
                <th style="width: 200%;">stock alert</th>
                <th style="width: 200%;">order tax</th>
                <th style="width: 200%;">tax type</th>
                <th style="width: 200%;">note</th>
                <th style="width: 200%;">warehouse</th>
                <th style="width: 200%;">supplier</th>
                <th style="width: 200%;">product quantity</th>
                <th style="width: 200%;">status</th>
                <th style="width: 200%;">product type</th>
                <th style="width: 200%;">variation</th>
                <th style="width: 200%;">variation type</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($products as $product)
                @php
                    $purchase = null;
                    $purchase = App\Models\Purchase::where('id', $product->purchases[0]->purchase_id ?? 0)->first();
                    $status = '';
                    if ($purchase) {
                        switch ($purchase->status) {
                            case 1:
                                $status = 'Received';
                                break;
                            case 2:
                                $status = 'Pending';
                                break;
                            case 3:
                                $status = 'Ordered';
                                break;
                            default:
                                break;
                        }
                    } else {
                        $status = 'No Purchase';
                    }
                @endphp
                <tr align="center">
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->code }}</td>
                    <td>{{ $product->productCategory->name }}</td>
                    <td>{{ $product->brand->name }}</td>
                    <td>{{ $product->barcode_symbol }}</td>
                    <td>{{ $product->product_cost }}</td>
                    <td>{{ $product->product_price }}</td>
                    <td>
                        <?php
                        $productUnitName = App\Models\BaseUnit::where('id', $product->product_unit)->value('name');
                        ?>
                        {{ $productUnitName }}
                    </td>
                    <td>
                        {{ $product->getSaleUnitName()['name'] }}
                    </td>
                    <td>
                        {{ $product->getPurchaseUnitName()['name'] }}
                    </td>
                    <td>{{ $product->stock_alert }}</td>
                    <td>{{ $product->order_tax }}</td>
                    <td>{{ $product->tax_type == 1 ? 'EXCLUSIVE' : 'INCLUSIVE' }}</td>
                    <td>{{ $product->notes }}</td>
                    <td>{{ $purchase->warehouse->name }}</td>
                    <td>{{ $purchase->supplier->name }}</td>
                    <td>{{ $product->inStock($product->id) }}</td>
                    <td>{{ $status }}</td>
                    <td>{{ $product->variationProduct ? 'Variation' : 'Single' }}</td>
                    <td>{{ $product->variationProduct->variation->name ?? '' }}</td>
                    <td>{{ $product->variationType->name ?? '' }}</td>
                    {{-- <td>{{ \Carbon\Carbon::parse($product->created_at)->isoFormat('Do MMM, YYYY') }}</td> --}}
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
