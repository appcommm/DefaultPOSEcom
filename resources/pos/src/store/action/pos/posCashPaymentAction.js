import { apiBaseURL, posCashPaymentActionType, toastType } from '../../../constants';
import apiConfig from '../../../config/apiConfig';
import { addToast } from '../toastAction';
import { fetchBrandClickable } from "./posAllProductAction";
import { getFormattedMessage } from '../../../shared/sharedMethod';
import { setLoading } from '../loadingAction';
import { fetchHoldLists } from "./HoldListAction";
import { addOfflineSale, addProduct, clearOfflineHoldList, clearOfflineSales, deleteProduct, getCustomers, getOfflineHoldList, getOfflineSales, getProducts, getUnits, getWarehouses } from '../../../../../js/indexDB';
import { environment } from '../../../config/environment';


export const posCashPaymentAction = (detailsCash, setUpdateProducts, setModalShowPaymentSlip, posAllProduct, filterData, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    let url = apiBaseURL.CASH_PAYMENT;
    if (navigator.onLine) {
        apiConfig.post(url, detailsCash)
            .then((response) => {
                dispatch({ type: posCashPaymentActionType.POS_CASH_PAYMENT, payload: response.data.data });
                dispatch(addToast(
                    { text: getFormattedMessage("pos.payment.success.message") }));
                setUpdateProducts([])
                setModalShowPaymentSlip(true)
                dispatch(fetchBrandClickable(filterData.brandId, filterData.categoryId, filterData.selectedOption.value))
                if (isLoading) {
                    dispatch(setLoading(false))
                    dispatch(fetchHoldLists())
                }
            })
            .catch((response) => {
                dispatch(addToast(
                    { text: response.response.data.message, type: toastType.ERROR }));
            });
    } else {
        let offlineSales = await getOfflineSales()
        let lastItem = offlineSales[offlineSales.length - 1];
        let saleId = lastItem ? lastItem.id + 1 : 1
        let now = new Date().toISOString().replace('Z', '000000Z')
        detailsCash.id = saleId
        await addOfflineSale(detailsCash, saleId)

        let customers = await getCustomers();
        let offlineCustomer = customers.find(customer => customer.id === detailsCash.customer_id);

        let warehouses = await getWarehouses();
        let offlineWarehouse = warehouses.find(warehouse => warehouse.id === detailsCash.warehouse_id);

        let units = await getUnits();
        let products = await getProducts();
        let data = {
            "type": "sales",
            "id": saleId,
            "attributes": {
                "date": now,
                "is_return": null,
                "customer_id": detailsCash.customer_id,
                "customer_name": offlineCustomer.attributes.name,
                "warehouse_id": detailsCash.warehouse_id,
                "warehouse_name": offlineWarehouse.attributes.name,
                "tax_rate": detailsCash.tax_rate,
                "tax_amount": detailsCash.tax_amount,
                "discount": detailsCash.discount,
                "shipping": detailsCash.shipping,
                "grand_total": detailsCash.grand_total,
                "received_amount": detailsCash.received_amount,
                "paid_amount": detailsCash.paid_amount,
                "due_amount": 0,
                "payment_type": detailsCash.payment_type,
                "note": detailsCash.note,
                "status": detailsCash.status,
                "payment_status": detailsCash.payment_status,
                "reference_code": "SA_111" + saleId,
                "sale_items": [],
                "created_at": now,
                "barcode_url": `${environment.URL}/uploads/sales/barcode-SA_111${saleId}.png`
            },
            "links": {
                "self": `${environment.URL}/api/sales/${saleId}`
            }
        }
        detailsCash.sale_items.forEach(async (item) => {
            let offlineUnit = units.find(unit => unit.id == item.sale_unit);
            let offlineProduct = products.find(product => product.id == item.product_id);
            data.attributes.sale_items.push({
                "id": item.id,
                "sale_id": saleId,
                "product_id": item.product_id,
                "product_price": item.product_price,
                "net_unit_price": item.net_unit_price,
                "product": offlineProduct.attributes,
                "tax_type": item.tax_type,
                "tax_value": item.tax_value,
                "tax_amount": item.tax_amount,
                "discount_type": item.discount_type,
                "discount_value": item.discount_value,
                "discount_amount": item.discount_amount,
                "sale_unit": {
                    "id": item.sale_unit_id,
                    "name": offlineUnit.attributes.name,
                    "short_name": offlineUnit.attributes.short_name,
                    "base_unit": offlineUnit.attributes.base_unit,
                    "created_at": offlineUnit.attributes.created_at,
                    "updated_at": offlineUnit.attributes.updated_at
                },
                "quantity": item.quantity,
                "sub_total": item.sub_total,
                "created_at": now,
                "updated_at": now
            })
            await deleteProduct(offlineProduct.id).then(async () => {
                offlineProduct.attributes.in_stock -= item.quantity
                await addProduct(offlineProduct, offlineProduct.id).then(() => {
                    setTimeout(() => {
                        dispatch({ type: posCashPaymentActionType.POS_CASH_PAYMENT, payload: data });
                        dispatch(addToast(
                            { text: getFormattedMessage("pos.payment.success.message") }));
                        setUpdateProducts([])
                        setModalShowPaymentSlip(true)
                        // dispatch(posAllProduct(detailsCash.warehouse_id))
                        dispatch(fetchBrandClickable(filterData.brandId, filterData.categoryId, filterData.selectedOption.value))
                        if (isLoading) {
                            dispatch(setLoading(false))
                            dispatch(fetchHoldLists())
                        }
                    }, 1000);
                })
            })
        })

    }
};
async function syncPOSSale() {
    const offlineSales = await getOfflineSales();
    const offlineHoldList = await getOfflineHoldList()
    try {
        await apiConfig
            .post(apiBaseURL.BULK_SALES, JSON.stringify(offlineSales), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async (response) => {
                await clearOfflineSales()
            });

        await apiConfig
            .post(apiBaseURL.BULK_HOLDS_LIST, JSON.stringify(offlineHoldList), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async (response) => {
                await clearOfflineHoldList()
                location.reload()
            });
    } catch (error) {
        console.error('Network error:', error);
    }
}
// if (window.location.hash === '#/app/pos') {
// }
window.addEventListener('online', () => {
    if (window.location.hash == '#/app/pos') {
        syncPOSSale()
    }
});
