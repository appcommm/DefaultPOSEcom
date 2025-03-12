import { setLoading } from './loadingAction';
import apiConfig from '../../config/apiConfig';
import { apiBaseURL, saleActionType, toastType } from '../../constants';
import { addToast } from './toastAction';
import { getCustomers, getOfflineSales, getSetting, getWarehouses } from '../../../../js/indexDB';

export const saleDetailsAction = (saleId, singleSale, isLoading = true) => async (dispatch) => {
    if (navigator.onLine) {
        if (isLoading) {
            dispatch(setLoading(true))
        }
        apiConfig.get(apiBaseURL.SALE_DETAILS + '/' + saleId, singleSale)
            .then((response) => {
                console.log(response.data.data);
                dispatch({ type: saleActionType.SALE_DETAILS, payload: response.data.data })
                if (isLoading) {
                    dispatch(setLoading(false))
                }
            })
            .catch(({ response }) => {
                dispatch(addToast(
                    { text: response.data.message, type: toastType.ERROR }));
            });
    } else {
        let sales = await getOfflineSales()
        sales.forEach(async (sale) => {
            if (sale.id == saleId) {
                sale = sale.attributes
                let customers = await getCustomers();
                let offlineCustomer = customers.find(customer => customer.id === sale.customer_id);

                let warehouses = await getWarehouses();
                let offlineWarehouse = warehouses.find(warehouse => warehouse.id === sale.warehouse_id);

                let setting = await getSetting();
                sale.customer = offlineCustomer.attributes
                sale.warehouse = offlineWarehouse.attributes
                sale.company_info = setting[0].attributes

                console.log(sale);
                dispatch({
                    type: saleActionType.SALE_DETAILS,
                    payload: sale,
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            }
        });
    }
};
