import { addConfig, addPOSRegister, addPOSRegisterClose, clearPOSRegister, getConfig, getPOSRegister, getPOSRegisterDetail } from "../../../../../js/indexDB";
import apiConfig from "../../../config/apiConfig";
import {
    apiBaseURL,
    posProductActionType,
    posRegisterDetailsAction,
    posRegisterReportDetailsAction,
    toastType,
} from "../../../constants";
import requestParam from "../../../shared/requestParam";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import { fetchConfig } from "../configAction";
import { addToast } from "../toastAction";
import { setTotalRecord } from "../totalRecordAction";

export const fetchTodaySaleOverAllReport = () => async (dispatch) => {
    if (navigator.onLine) {
        apiConfig
            .get(apiBaseURL.TODAY_SALE_OVERALL_REPORT)
            .then((response) => {
                dispatch({
                    type: posProductActionType.FETCH_TODAY_SALE_OVERALL_REPORT,
                    payload: response.data.data,
                });
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    }
};

export const registerCashInHandAction = (data, navigate) => async (dispatch) => {
    if (navigator.onLine) {
        let url = apiBaseURL.REGISTER_CASH_IN_HAND;
        apiConfig
            .post(url, data)
            .then((response) => {
                dispatch(fetchConfig(navigate));
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "register.entry.added.successfully.message"
                        ),
                    })
                );
            })
            .catch((response) => {
                dispatch(
                    addToast({
                        text: response.response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    } else {
        let config = await getConfig()
        config[0].open_register = false
        await addConfig(config[0], 1)
        await addPOSRegister(data, 1)
        dispatch(fetchConfig(navigate));
        dispatch(
            addToast({
                text: getFormattedMessage(
                    "register.entry.added.successfully.message"
                ),
            })
        );

    }
};

export const closeRegisterAction = (data, navigate) => async (dispatch) => {
    let url = apiBaseURL.CLOSE_REGISTER;
    if (navigator.onLine) {
        apiConfig
            .post(url, data)
            .then((response) => {
                dispatch(fetchConfig());
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "register.closed.successfully.message"
                        ),
                    })
                );
                navigate("/app/dashboard");
            })
            .catch((response) => {
                dispatch(
                    addToast({
                        text: response.response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    } else {
        await addPOSRegisterClose(data, 1)
        dispatch(fetchConfig());
        dispatch(
            addToast({
                text: getFormattedMessage(
                    "register.closed.successfully.message"
                ),
            })
        );
        navigate("/app/dashboard");
    }
};

export const getAllRegisterDetailsAction = () => async (dispatch) => {
    if (navigator.onLine) {
        apiConfig
            .get(apiBaseURL.GET_REGISTER_DETAILS)
            .then((response) => {
                dispatch({
                    type: posRegisterDetailsAction.GET_REGISTER_DETAILS,
                    payload: response.data.data,
                });
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    } else {
        let registerDetail = await getPOSRegisterDetail()
        dispatch({
            type: posRegisterDetailsAction.GET_REGISTER_DETAILS,
            payload: registerDetail[0]
        });
    }
};

// export const getAllRegisterReportDetailsAction = () => async ( dispatch ) => {
//     apiConfig.get( apiBaseURL.GET_REGISTER_REPORT_DETAILS )
//         .then( ( response ) => {
//               dispatch(
//     setTotalRecord(
//         response.data.meta.total || response.data.data.total
//     )
// );
//             dispatch( {type: posRegisterReportDetailsAction.GET_REGISTER_REPORT_DETAILS, payload: response.data.data} )
//         } )
//         .catch( ( {response} ) => {
//             dispatch( addToast(
//                 {text: response.data.message, type: toastType.ERROR} ) );
//         } );
// };

export const getAllRegisterReportDetailsAction =
    ({ query = "", filter = {} }) =>
        async (dispatch) => {
            let url = apiBaseURL.GET_REGISTER_REPORT_DETAILS;
            url += query ? query : "";

            if (
                !_.isEmpty(filter) &&
                (filter.page ||
                    filter.pageSize ||
                    filter.search ||
                    filter.order_By ||
                    filter.created_at)
            ) {
                url += requestParam(filter, null, null, null, url);
            }

            await apiConfig
                .get(url)
                .then((response) => {
                    dispatch(
                        setTotalRecord(
                            response.data.meta.total !== undefined &&
                                response.data.meta.total >= 0
                                ? response.data.meta.total
                                : response.data.data.total
                        )
                    );
                    dispatch({
                        type: posRegisterReportDetailsAction.GET_REGISTER_REPORT_DETAILS,
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
        };

async function syncPOSRegister() {
    const posRegister = await getPOSRegisterDetail();
    try {
        await apiConfig
            .post(apiBaseURL.REGISTER_CASH_IN_HAND, JSON.stringify(posRegister[0]), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async (response) => {
                await clearPOSRegister()
                location.reload()
            });
    } catch (error) {
        console.error('Network error:', error);
    }
}
// if (window.location.hash.startsWith('#/app') && !window.location.hash.startsWith('#/app/pos')) {
//     window.addEventListener('online', syncPOSRegister);
// }
