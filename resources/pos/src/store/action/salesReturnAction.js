import apiConfig from "../../config/apiConfig";
import { apiBaseURL, saleActionType, saleReturnActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";
import { addOfflineSaleReturn, clearOfflineSaleReturns, getCustomers, getOfflineSaleReturns, getProducts, getUnits, getWarehouses } from "../../../../js/indexDB";
import { environment } from "../../config/environment";

export const fetchSalesReturn =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            const admin = true;
            let url = apiBaseURL.SALE_RETURN;
            if (
                !_.isEmpty(filter) &&
                (filter.page ||
                    filter.pageSize ||
                    filter.search ||
                    filter.order_By ||
                    filter.created_at)
            ) {
                url += requestParam(filter, admin, null, null, url);
            }
            if (navigator.onLine) {
                await apiConfig
                    .get(url)
                    .then((response) => {
                        dispatch({
                            type: saleReturnActionType.FETCH_SALES_RETURN,
                            payload: response.data.data,
                        });
                        dispatch(
                            setTotalRecord(
                                response.data.meta.total !== undefined &&
                                    response.data.meta.total >= 0
                                    ? response.data.meta.total
                                    : response.data.data.total
                            )
                        );
                        if (isLoading) {
                            dispatch(setLoading(false));
                        }
                    })
                    .catch(({ response }) => {
                        dispatch(
                            addToast({
                                text: response.data.message,
                                type: toastType.ERROR,
                            })
                        );
                    });
            } else {
                let sales = await getOfflineSaleReturns()
                dispatch({
                    type: saleReturnActionType.FETCH_SALES_RETURN,
                    payload: sales,
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            }
        };

export const fetchSaleReturn =
    (saleId, isSaleReturnFromSale, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            await apiConfig
                .get(
                    !isSaleReturnFromSale
                        ? apiBaseURL.SALE_RETURN + "/" + saleId + "/edit"
                        : apiBaseURL.EDIT_SALE_FROM_SALE + "/" + saleId
                )
                .then((response) => {
                    dispatch({
                        type: saleReturnActionType.FETCH_SALE_RETURN,
                        payload: response.data.data,
                    });
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                })
                .catch(({ response }) => {
                    dispatch(
                        addToast({
                            text: response.data.message,
                            type: toastType.ERROR,
                        })
                    );
                });
        };

export const addSaleReturn = (sale, navigate) => async (dispatch) => {
    if (navigator.onLine) {
        dispatch(setSavingButton(true));
        await apiConfig
            .post(apiBaseURL.SALE_RETURN, sale)
            .then((response) => {
                console.log(response.data.data);
                dispatch({
                    type: saleReturnActionType.ADD_SALE_RETURN,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "sale-return.success.create.message"
                        ),
                    })
                );
                dispatch(addInToTotalRecord(1));
                navigate("/app/sale-return");
                dispatch(setSavingButton(false));
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    } else {
        let offlineSaleReturns = await getOfflineSaleReturns();
        let lastItem = offlineSaleReturns[offlineSaleReturns.length - 1];

        let saleId = lastItem ? lastItem.id + 1 : 1

        let customers = await getCustomers();
        let offlineCustomer = customers.find(customer => customer.id === sale.customer_id);

        let warehouses = await getWarehouses();
        let offlineWarehouse = warehouses.find(warehouse => warehouse.id === sale.warehouse_id);

        let units = await getUnits();
        let products = await getProducts();

        console.log(sale);
        let now = new Date().toISOString().replace('Z', '000000Z')
        let offlineSaleReturn = {
            "type": "sales_return",
            "id": saleId,
            "attributes": {
                "date": now,
                "sale_id": sale.sale_id,
                "customer_id": sale.customer_id,
                "customer_name": offlineCustomer.attributes.name,
                "warehouse_id": sale.warehouse_id,
                "warehouse_name": offlineWarehouse.attributes.name,
                "tax_rate": sale.tax_rate,
                "tax_amount": sale.tax_amount,
                "discount": sale.discount,
                "shipping": sale.shipping,
                "grand_total": sale.grand_total,
                "paid_amount": sale.paid_amount,
                "payment_type": sale.payment_type,
                "note": sale.note,
                "status": sale.status,
                "reference_code": sale.sale_reference,
                "sale_return_items": [],
                "created_at": now,
                "barcode_url": `${environment.URL}/uploads/sales-return/barcode-${sale.sale_reference}.png`
            },
            "links": {
                "self": `${environment.URL}/api/sales-return/${saleId}`
            }
        }
        console.log(offlineSaleReturn);
        sale.sale_return_items.forEach(item => {
            let offlineUnit = units.find(unit => unit.id === item.sale_unit);
            let offlineProduct = products.find(product => product.id == item.product_id);
            offlineSaleReturn.attributes.sale_return_items.push({
                "id": item.id,
                "sale_id": sale.saleId,
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
                "sale_unit": item.sale_unit_id,
                // "sale_unit": {
                //     "id": item.sale_unit_id,
                //     "name": offlineUnit.attributes.name,
                //     "short_name": offlineUnit.attributes.short_name,
                //     "base_unit": offlineUnit.attributes.base_unit,
                //     "created_at": now,
                //     "updated_at": now
                // },
                "quantity": item.quantity,
                "sub_total": item.sub_total,
                "created_at": now,
                "updated_at": now
            })
        })

        await addOfflineSaleReturn(offlineSaleReturn, saleId);

        // data.attributes = sale
        // data.id = saleId
        // data.links.self = environment.URL + '/api/sale-returns/' + saleId;
        // data.type = 'sales_return'

        dispatch({
            type: saleReturnActionType.ADD_SALE_RETURN,
            payload: offlineSaleReturn,
        });
        dispatch(
            addToast({
                text: getFormattedMessage("sale-return.success.create.message"),
            })
        );
        dispatch(addInToTotalRecord(1));
        navigate("/app/sale-return");
        dispatch(setSavingButton(false));
    }
};

export const editSaleReturn = (saleId, sale, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .patch(apiBaseURL.SALE_RETURN + "/" + saleId, sale)
        .then((response) => {
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "sale-return.success.edit.message"
                    ),
                })
            );
            navigate("/app/sale-return");
            dispatch({
                type: saleReturnActionType.EDIT_SALE_RETURN,
                payload: response.data.data,
            });
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const deleteSaleReturn = (userId) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.SALE_RETURN + "/" + userId)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: saleReturnActionType.DELETE_SALE_RETURN,
                payload: userId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "sale-return.success.delete.message"
                    ),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
async function syncSaleReturns() {
    console.log('sale return sync');
    const offlineSales = await getOfflineSaleReturns();
    try {
        await apiConfig
            .post(apiBaseURL.BULK_SALE_RETURN, JSON.stringify(offlineSales), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async (response) => {
                await clearOfflineSaleReturns()
                location.reload()
            });
    } catch (error) {
        console.error('Network error:', error);
    }
}
if (window.location.hash === '#/app/sale-return') {
    window.addEventListener('online', syncSaleReturns);
}
