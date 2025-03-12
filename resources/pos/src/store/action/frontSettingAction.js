import { getFrontSetting } from '../../../../js/indexDB';
import apiConfig from '../../config/apiConfig';
import { apiBaseURL, frontSettingActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchFrontSetting = () => async (dispatch) => {
    if (navigator.onLine) {
        apiConfig.get(apiBaseURL.FRONT_SETTING)
            .then((response) => {
                dispatch({ type: frontSettingActionType.FETCH_FRONT_SETTING, payload: response.data.data });
            })
            .catch(({ response }) => {
                dispatch(addToast(
                    { text: response.data.message, type: toastType.ERROR }));
            });
    } else {
        let frontSetting = await getFrontSetting()
        dispatch({ type: frontSettingActionType.FETCH_FRONT_SETTING, payload: frontSetting[0] });
    }
}
