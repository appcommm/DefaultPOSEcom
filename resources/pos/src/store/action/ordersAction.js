import apiConfig from "../../config/apiConfig";
import { apiBaseURL, orderActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import requestParam from "../../shared/requestParam";

export const fetchOrders =
    (filter = {}, isLoading = true) => (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            const admin = true;
            let url = apiBaseURL.ORDERS;
            if (
                !_.isEmpty(filter) &&
                (filter.page ||
                    filter.pageSize ||
                    filter.search ||
                    filter.order_By ||
                    filter.created_at ||
                    filter.custome_id)
            ) {
                url += requestParam(filter, admin, null, null, url);
            }
            apiConfig
                .get(url)
                .then((response) => {
                    dispatch({
                        type: orderActionType.FETCH_ORDERS,
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

        };

export const fetchOrder =
    (orderId, singleOrder, isLoading = true) => (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            apiConfig
                .get(apiBaseURL.ORDERS + "/" + orderId + "/edit", singleOrder)
                .then((response) => {
                    console.log(response.data.data);
                    dispatch({
                        type: orderActionType.FETCH_ORDER,
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
