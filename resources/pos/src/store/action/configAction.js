import { apiBaseURL, configActionType, toastType } from '../../constants';
import apiConfig from '../../config/apiConfig';
import { addToast } from './toastAction';
import { getConfig } from '../../../../js/indexDB';

export const fetchConfig = (navigate) => async (dispatch) => {
    if (navigator.onLine) {
        apiConfig.get(apiBaseURL.CONFIG)
            .then((response) => {
                console.log(response.data.data);
                dispatch({ type: configActionType.FETCH_CONFIG, payload: response.data.data.permissions });
                dispatch({ type: configActionType.FETCH_ALL_CONFIG, payload: response.data.data });
                navigate && navigate("/app/pos")
            })
            .catch((response) => {
                dispatch(addToast(
                    { text: response.response?.data?.message, type: toastType.ERROR }));
            });
    } else {
        let config = await getConfig()
        console.log(config);
        // config[0].open_register = false
        dispatch({ type: configActionType.FETCH_CONFIG, payload: config[0].permissions });
        dispatch({ type: configActionType.FETCH_ALL_CONFIG, payload: config[0] });
        navigate && navigate("/app/pos")
    }
};
