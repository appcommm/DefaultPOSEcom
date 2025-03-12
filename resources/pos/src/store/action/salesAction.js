import apiConfig from "../../config/apiConfig";
import { apiBaseURL, saleActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { callSaleApi } from "./saleApiAction";
import { setSavingButton } from "./saveButtonAction";
import { addOfflineSale, addProduct, clearOfflineSales, clearProducts, deleteOfflineSale, getCustomers, getOfflineSales, getProducts, getUnits, getWarehouses } from "../../../../js/indexDB";
import { environment } from "../../config/environment";

export const fetchSales =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            const admin = true;
            let url = apiBaseURL.SALES;
            if (
                !_.isEmpty(filter) &&
                (filter.page ||
                    filter.pageSize ||
                    filter.search ||
                    filter.order_By ||
                    filter.created_at ||
                    filter.customer_id)
            ) {
                url += requestParam(filter, admin, null, null, url);
            }
            if (navigator.onLine) {
                await apiConfig
                    .get(url)
                    .then((response) => {
                        dispatch({
                            type: saleActionType.FETCH_SALES,
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
                        dispatch(callSaleApi(false));
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
                let sales = await getOfflineSales()
                dispatch({
                    type: saleActionType.FETCH_SALES,
                    payload: sales,
                });
                dispatch(callSaleApi(false));
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            }
        };

export const fetchSale =
    (saleId, singleSale, isLoading = true) =>
        async (dispatch) => {
            if (navigator.onLine) {
                if (isLoading) {
                    dispatch(setLoading(true));
                }
                await apiConfig
                    .get(apiBaseURL.SALES + "/" + saleId + "/edit", singleSale)
                    .then((response) => {
                        console.log(response.data.data);
                        dispatch({
                            type: saleActionType.FETCH_SALE,
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
            } else {
                let sales = await getOfflineSales()
                sales.forEach(sale => {
                    if (sale.id == saleId) {
                        dispatch({
                            type: saleActionType.FETCH_SALE,
                            payload: sale,
                        });
                        if (isLoading) {
                            dispatch(setLoading(false));
                        }
                    }
                });
            }
        };

export const addSale = (sale, navigate) => async (dispatch) => {
    if (navigator.onLine) {
        dispatch(setSavingButton(true));
        await apiConfig
            .post(apiBaseURL.SALES, sale)
            .then((response) => {
                console.log(response.data.data);
                dispatch({
                    type: saleActionType.ADD_SALE,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage("sale.success.create.message"),
                    })
                );
                dispatch(addInToTotalRecord(1));
                navigate("/app/sales");
                dispatch(setSavingButton(false));
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    } else {
        let offlineSales = await getOfflineSales()
        let lastItem = offlineSales[offlineSales.length - 1];

        let saleId = lastItem ? lastItem.id + 1 : 1
        sale.id = saleId
        sale.reference_code = "SA_111" + saleId
        await addOfflineSale(sale, saleId)

        let customers = await getCustomers();
        let offlineCustomer = customers.find(customer => customer.id === sale.customer_id);

        let warehouses = await getWarehouses();
        let offlineWarehouse = warehouses.find(warehouse => warehouse.id === sale.warehouse_id);

        let units = await getUnits();
        let products = await getProducts();

        let now = new Date().toISOString().replace('Z', '000000Z')
        let offlineSale = {
            "type": "sales",
            "id": saleId,
            "attributes": {
                "date": now,
                "is_return": null,
                "customer_id": sale.customer_id,
                "customer_name": offlineCustomer.attributes.name,
                "warehouse_id": sale.warehouse_id,
                "warehouse_name": offlineWarehouse.attributes.name,
                "tax_rate": sale.tax_rate,
                "tax_amount": sale.tax_amount,
                "discount": sale.discount,
                "shipping": sale.shipping,
                "grand_total": sale.grand_total,
                "received_amount": sale.received_amount,
                "paid_amount": sale.paid_amount,
                "due_amount": 0,
                "payment_type": sale.payment_type,
                "note": sale.note,
                "status": sale.status,
                "payment_status": sale.payment_status,
                "reference_code": "SA_111" + saleId,
                "sale_items": [],
                "created_at": now,
                "barcode_url": `${environment.URL}/uploads/sales/barcode-SA_111${saleId}.png`
            },
            "links": {
                "self": `${environment.URL}/api/sales/${saleId}`
            }
        }
        sale.sale_items.forEach(item => {
            let offlineUnit = units.find(unit => unit.id == item.sale_unit);
            let offlineProduct = products.find(product => product.id == item.product_id);
            console.log(item, offlineProduct);
            offlineSale.attributes.sale_items.push({
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
                    "created_at": now,
                    "updated_at": now
                },
                "quantity": item.quantity,
                "sub_total": item.sub_total,
                "created_at": now,
                "updated_at": now
            })
        })
        dispatch({
            type: saleActionType.ADD_SALE,
            payload: offlineSale,
        });
        dispatch(
            addToast({
                text: getFormattedMessage("sale.success.create.message"),
            })
        );
        dispatch(addInToTotalRecord(1));
        navigate("/app/sales");
        dispatch(setSavingButton(false));
    }
};

export const editSale = (saleId, sale, navigate) => async (dispatch) => {
    if (navigator.onLine) {
        dispatch(setSavingButton(true));
        await apiConfig
            .patch(apiBaseURL.SALES + "/" + saleId, sale)
            .then((response) => {
                dispatch(
                    addToast({
                        text: getFormattedMessage("sale.success.edit.message"),
                    })
                );
                navigate("/app/sales");
                dispatch({
                    type: saleActionType.EDIT_SALE,
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
    } else {
        await deleteOfflineSale(parseInt(saleId))
        dispatch(removeFromTotalRecord(1));
        dispatch({
            type: saleActionType.DELETE_SALE,
            payload: saleId,
        });

        let offlineSales = await getOfflineSales()
        let lastItem = offlineSales[offlineSales.length - 1];

        sale.id = saleId
        sale.reference_code = "SA_111" + saleId
        sale.action = 'update'
        await addOfflineSale(sale, saleId)

        let customers = await getCustomers();
        let offlineCustomer = customers.find(customer => customer.id === sale.customer_id);

        let warehouses = await getWarehouses();
        let offlineWarehouse = warehouses.find(warehouse => warehouse.id === sale.warehouse_id);

        let units = await getUnits();

        let now = new Date().toISOString().replace('Z', '000000Z')
        let offlineSale = {
            "type": "sales",
            "id": saleId,
            "attributes": {
                "date": now,
                "is_return": null,
                "customer_id": sale.customer_id,
                "customer_name": offlineCustomer.attributes.name,
                "warehouse_id": sale.warehouse_id,
                "warehouse_name": offlineWarehouse.attributes.name,
                "tax_rate": sale.tax_rate,
                "tax_amount": sale.tax_amount,
                "discount": sale.discount,
                "shipping": sale.shipping,
                "grand_total": sale.grand_total,
                "received_amount": sale.received_amount,
                "paid_amount": sale.paid_amount,
                "due_amount": 0,
                "payment_type": sale.payment_type,
                "note": sale.note,
                "status": sale.status,
                "payment_status": sale.payment_status,
                "reference_code": "SA_111" + saleId,
                "sale_items": [],
                "created_at": now,
                "barcode_url": `${environment.URL}/uploads/sales/barcode-SA_111${saleId}.png`
            },
            "links": {
                "self": `${environment.URL}/api/sales/${saleId}`
            }
        }
        sale.sale_items.forEach(item => {
            let offlineUnit = units.find(unit => unit.id === item.sale_unit);
            offlineSale.attributes.sale_items.push({
                "id": 2,
                "sale_id": 2,
                "product_id": item.product_id,
                "product_price": item.product_price,
                "net_unit_price": item.net_unit_price,
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
        })
        dispatch({
            type: saleActionType.ADD_SALE,
            payload: offlineSale,
        });
        dispatch(
            addToast({
                text: getFormattedMessage("sale.success.create.message"),
            })
        );
        dispatch(addInToTotalRecord(1));
        navigate("/app/sales");
        dispatch(setSavingButton(false));
    }
};

export const deleteSale = (userId) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.SALES + "/" + userId)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({ type: saleActionType.DELETE_SALE, payload: userId });
            dispatch(
                addToast({
                    text: getFormattedMessage("sale.success.delete.message"),
                })
            );
        })
        .catch(({ response }) => {
            response &&
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
        });
};
const toBase64 = file => new Promise(async (resolve, reject) => {
    if (typeof file == 'string') {
        const response = await fetch(file);
        file = await response.blob();
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
const toBase64All = async (imageUrls) => {
    const base64Images = await Promise.all(
        imageUrls.map(async (img) => await toBase64(img))
    );
    return base64Images;
};
async function syncSales() {
    const offlineSales = await getOfflineSales();
    try {
        const response = await apiConfig.post(apiBaseURL.BULK_SALES, JSON.stringify(offlineSales), {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        await clearOfflineSales();
        await clearProducts();

        const productsResponse = await apiConfig.get(`products?page[size]=0`);
        const products = productsResponse.data.data;

        // Use a for...of loop to handle async/await properly
        for (const product of products) {
            let data = {
                attributes: product.attributes,
                id: product.id,
                links: {
                    self: environment.URL + '/api/products/' + product.id
                },
                type: 'products',
            };

            // Process images with async/await
            data.attributes.images.imageUrls = await toBase64All(data.attributes.images.imageUrls);
            await addProduct(data, product.id);
        }

        // Reload the page after all processing is complete
        location.reload();
    } catch (error) {
        console.error('Network error:', error);
    }
}

// async function syncSales() {
//     const offlineSales = await getOfflineSales();
//     try {
//         await apiConfig
//             .post(apiBaseURL.BULK_SALES, JSON.stringify(offlineSales), {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             })
//             .then(async (response) => {
//                 await clearOfflineSales()
//                 await clearProducts()
//                 apiConfig
//                     .get(`products?page[size]=0`)
//                     .then((response) => {
//                         response.data.data.forEach(async (product) => {
//                             let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
//                             data.attributes = product.attributes
//                             data.attributes.images.imageUrls = await toBase64All(data.attributes.images.imageUrls);
//                             data.id = product.id
//                             data.links.self = environment.URL + '/api/products/' + product.id
//                             data.type = 'products'
//                             await addProduct(data, product.id)
//                         });
//                     })
//                 location.reload()
//             });
//     } catch (error) {
//         console.error('Network error:', error);
//     }
// }
// if (window.location.hash.startsWith('#/app')) {
// window.addEventListener('online', (e) => {
//     syncSales()
// });
// }
