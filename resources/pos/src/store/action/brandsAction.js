import apiConfig from "../../config/apiConfig";
import { apiBaseURL, brandsActionType, toastType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    setTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { callUpdateBrandApi } from "./updateBrand";
import { getBrands } from "../../../../js/indexDB";
// import { addOfflineBrand, clearOfflineBrands, deleteOfflineBrand, getOfflineBrands } from "../../../../js/indexDB";
// import { environment } from "../../config/environment";

export const fetchBrands =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            let url = apiBaseURL.BRANDS;
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
            apiConfig
                .get(url)
                .then(async (response) => {

                    // response.data.data.forEach(async (brand) => {
                    //     let offlineBrand = {
                    //         id: brand.id,
                    //         name: brand.attributes.name,
                    //         image: await toBase64(brand.attributes.image),
                    //         'product_count': brand.attributes.product_count,
                    //         'action': 'update',
                    //     }
                    //     await addOfflineBrand(offlineBrand, brand.id)
                    // });
                    dispatch({
                        type: brandsActionType.FETCH_BRANDS,
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

export const fetchBrand = (brandsId, singleUser) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.BRANDS + "/" + brandsId, singleUser)
        .then((response) => {
            dispatch({
                type: brandsActionType.FETCH_BRAND,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const addBrand = (brands) => async (dispatch) => {
    if (navigator.onLine) {

        await apiConfig
            .post(apiBaseURL.BRANDS, brands)
            .then((response) => {

                dispatch({
                    type: brandsActionType.ADD_BRANDS,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage("brand.success.create.message"),
                    })
                );
                dispatch(addInToTotalRecord(1));
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    } else {
        // var data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
        // var brand = { 'id': null, 'name': null, 'image': null, 'product_count': 0, 'action': 'create' }
        // let offlineBrands = await getOfflineBrands();
        // let lastItem = offlineBrands[offlineBrands.length - 1];

        // let brandId = lastItem ? lastItem.id + 1 : 1
        // brand.id = brandId
        // brand.name = brands.get('name')
        // brand.image = await toBase64(brands.get('image'))

        // await addOfflineBrand(brand, brandId);


        // data.attributes = brand
        // data.id = brandId
        // data.links.self = environment.URL + '/api/brands/' + brandId;
        // data.type = 'brands'

        // dispatch({
        //     type: brandsActionType.ADD_BRANDS,
        //     payload: data,
        // });
        // dispatch(
        //     addToast({
        //         text: getFormattedMessage("brand.success.create.message"),
        //     })
        // );
        // dispatch(addInToTotalRecord(1));
    }
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

export const editBrand =
    (brandsId, brands, handleClose) => async (dispatch) => {
        if (navigator.onLine) {
            apiConfig
                .post(apiBaseURL.BRANDS + "/" + brandsId, brands)
                .then((response) => {
                    dispatch(callUpdateBrandApi(true));
                    // dispatch({type: productActionType.ADD_IMPORT_PRODUCT, payload: response.data.data});
                    handleClose(false);
                    dispatch(
                        addToast({
                            text: getFormattedMessage("brand.success.edit.message"),
                        })
                    );
                    dispatch(addInToTotalRecord(1));
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
            // await deleteOfflineBrand(brandsId)
            // dispatch(removeFromTotalRecord(1));
            // dispatch({
            //     type: brandsActionType.DELETE_BRANDS,
            //     payload: brandsId,
            // });

            // var data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
            // var brand = { 'id': null, 'name': null, 'image': null, 'action': 'update' }
            // let offlineBrands = await getOfflineBrands();

            // brand.id = brandsId;
            // brand.name = brands.get('name')
            // brand.image = await toBase64(brands.get('image'))

            // await addOfflineBrand(brand, brandsId);

            // data.attributes = brand
            // data.id = brandsId
            // data.links.self = environment.URL + '/api/brands/' + brandsId;
            // data.type = 'brands'

            // dispatch({
            //     type: brandsActionType.ADD_BRANDS,
            //     payload: data,
            // });
            // dispatch(
            //     addToast({
            //         text: getFormattedMessage("brand.success.edit.message"),
            //     })
            // );
            // dispatch(addInToTotalRecord(1));
        }
    };

export const deleteBrand = (brandsId) => async (dispatch) => {
    if (navigator.onLine) {
        // await deleteOfflineBrand(brandsId)
        apiConfig
            .delete(apiBaseURL.BRANDS + "/" + brandsId)
            .then((response) => {
                dispatch(removeFromTotalRecord(1));
                dispatch({
                    type: brandsActionType.DELETE_BRANDS,
                    payload: brandsId,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage("brand.success.delete.message"),
                    })
                );
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    } else {
        // let records = await getOfflineBrands()
        // records.forEach(async (record) => {
        //     if (record.id == brandsId) {
        //         record.action = 'delete';
        //         await deleteOfflineBrand(brandsId)
        //         await addOfflineBrand(record, brandsId)
        //     }
        // })

        // dispatch(removeFromTotalRecord(1));
        // dispatch({
        //     type: brandsActionType.DELETE_BRANDS,
        //     payload: brandsId,
        // });
        // dispatch(
        //     addToast({
        //         text: getFormattedMessage("brand.success.delete.message"),
        //     })
        // );
        // dispatch(setLoading(false));
    }
};

export const fetchAllBrands = () => async (dispatch) => {
    if (navigator.onLine) {
        apiConfig
            .get(`brands?page[size]=0`)
            .then((response) => {
                dispatch({
                    type: brandsActionType.FETCH_ALL_BRANDS,
                    payload: response.data.data,
                });
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({ text: response.data.message, type: toastType.ERROR })
                );
            });
    } else {
        let offlineBrands = await getBrands()
        dispatch({
            type: brandsActionType.FETCH_ALL_BRANDS,
            payload: offlineBrands,
        });
    }
};
// async function syncBrands() {
//     const offlineBrands = await getOfflineBrands();
//     try {
//         await apiConfig
//             .post(apiBaseURL.BULK_BRANDS, JSON.stringify(offlineBrands), {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             })
//             .then(async (response) => {
//                 await clearOfflineBrands()
//                 location.reload()
//             });
//     } catch (error) {
//         console.error('Network error:', error);
//     }
// }
// if (window.location.hash === '#/app/brands') {
//     window.addEventListener('online', syncBrands);
// }
