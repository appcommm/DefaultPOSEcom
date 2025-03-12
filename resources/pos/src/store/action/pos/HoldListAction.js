import apiConfig from "../../../config/apiConfig";
import { apiBaseURL, holdListActionType, toastType } from "../../../constants";
import { addToast } from "./../toastAction";
import { removeFromTotalRecord } from "./../totalRecordAction";
import { setLoading } from "./../loadingAction";
import requestParam from "../../../shared/requestParam";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import { addOfflineHoldList, deleteOfflineHoldList, getCustomers, getOfflineHoldList, getProducts, getUnits, getWarehouses } from "../../../../../js/indexDB";
import { environment } from "../../../config/environment";

export const fetchHoldLists =
    (filter = {}) =>
        async (dispatch) => {
            const admin = true;
            let url = apiBaseURL.HOLDS_LIST;
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
                            type: holdListActionType.FETCH_HOLDS,
                            payload: response.data.data,
                        });
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
                let offlineHoldList = await getOfflineHoldList()
                let holdlist = []
                offlineHoldList.map(item => {
                    if (item.offline.action != 'delete') {
                        holdlist.push(item.offline)
                    }
                })

                dispatch({
                    type: holdListActionType.FETCH_HOLDS,
                    payload: holdlist,
                });
            }
        };

export const fetchHoldList =
    (HoldId, singleSale, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            if (navigator.onLine) {
                await apiConfig
                    .get(apiBaseURL.HOLDS_LIST + "/" + HoldId + "/edit", singleSale)
                    .then((response) => {
                        dispatch({
                            type: holdListActionType.FETCH_HOLD,
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
                let holdlist = await getOfflineHoldList()
                holdlist = holdlist.filter(item => item.offline.id == HoldId && item.offline.action != 'delete')
                console.log(holdlist);
                dispatch({
                    type: holdListActionType.FETCH_HOLD,
                    payload: holdlist[0].offline
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            }
        };

export const addHoldList = (holdlist, navigate) => async (dispatch) => {
    if (navigator.onLine) {
        await apiConfig
            .post(apiBaseURL.HOLDS_LIST, holdlist)
            .then((response) => {
                dispatch({
                    type: holdListActionType.ADD_HOLD,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "hold-list.success.create.message"
                        ),
                    })
                );
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    } else {
        let offlineHoldList = await getOfflineHoldList()
        let lastItem = offlineHoldList[offlineHoldList.length - 1];
        let holdlistId = lastItem ? lastItem.offline.id + 1 : 1
        let now = new Date().toISOString().replace('Z', '000000Z')
        holdlist.id = holdlistId
        holdlist.action = 'create'

        let customers = await getCustomers();
        let offlineCustomer = customers.find(customer => customer.id === holdlist.customer_id);

        let warehouses = await getWarehouses();
        let offlineWarehouse = warehouses.find(warehouse => warehouse.id === holdlist.warehouse_id);

        let units = await getUnits();
        let products = await getProducts();
        let data = {
            "type": "holds",
            "id": holdlistId,
            "attributes": {
                "reference_code": holdlist.reference_code,
                "date": now,
                "customer_id": holdlist.customer_id,
                "customer_name": offlineCustomer.attributes.name,
                "warehouse_id": holdlist.warehouse_id,
                "warehouse_name": offlineWarehouse.attributes.name,
                "tax_rate": holdlist.tax_rate,
                "tax_amount": 0,
                "discount": 0,
                "shipping": holdlist.shipping,
                "grand_total": holdlist.grandTotal,
                "received_amount": null,
                "paid_amount": null,
                "note": null,
                "status": null,
                "hold_items": [],
                "created_at": now
            },
            "links": {
                "self": `${environment.URL}/api/holds/${holdlistId}`
            }
        }
        // console.log(holdlist);
        holdlist.hold_items.forEach(item => {
            let offlineUnit = units.find(unit => unit.id == item.sale_unit);
            let offlineProduct = products.find(product => product.id == item.product_id);
            data.attributes.hold_items.push({
                "id": item.id,
                "hold_id": holdlistId,
                "product_id": item.product_id,
                "product_price": item.product_price,
                "net_unit_price": item.net_unit_cost,
                "tax_type": item.tax_type,
                "tax_value": item.tax_value,
                "tax_amount": item.tax_amount,
                "discount_type": item.discount_type,
                "discount_value": item.discount_value ?? 0,
                "discount_amount": item.discount_amount,
                "sale_unit": {
                    "id": item.sale_unit,
                    "name": offlineUnit.attributes.name,
                    "name": offlineUnit.attributes.name,
                    "short_name": offlineUnit.attributes.short_name,
                    "base_unit": offlineUnit.attributes.base_unit,
                    "created_at": offlineUnit.attributes.created_at,
                    "updated_at": offlineUnit.attributes.updated_at
                },
                "product": offlineProduct.attributes,
                "quantity": item.quantity,
                "sub_total": item.quantity * item.product_price,
                "created_at": now,
                "updated_at": now
            })
        });
        await addOfflineHoldList({
            'sync': holdlist,
            'offline': data
        }, holdlistId)
        dispatch({
            type: holdListActionType.ADD_HOLD,
            payload: data,
        });
        dispatch(
            addToast({
                text: getFormattedMessage(
                    "hold-list.success.create.message"
                ),
            })
        );
    }
}
export const deleteHoldItem = (hold_id) => async (dispatch) => {
    if (navigator.onLine) {
        await apiConfig
            .delete(apiBaseURL.HOLDS_LIST + "/" + hold_id)
            .then(() => {
                dispatch(removeFromTotalRecord(1));
                dispatch({ type: holdListActionType.DELETE_HOLD, payload: hold_id });
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    } else {
        let records = await getOfflineHoldList()
        records.forEach(async (record) => {
            if (record.offline) {
                if (record.offline.id == hold_id) {
                    record.offline.action = 'delete';
                    await deleteOfflineHoldList(hold_id)
                    await addOfflineHoldList(record, hold_id)
                }
            } else {
                if (record.sync.id == hold_id) {
                    record.sync.action = 'delete';
                    await deleteOfflineHoldList(hold_id)
                    await addOfflineHoldList(record, hold_id)
                }
            }
        })
        dispatch(removeFromTotalRecord(1));
        dispatch({ type: holdListActionType.DELETE_HOLD, payload: hold_id });
    }
};
