import { posProductActionType, productActionType, toastType } from '../../../constants';
import apiConfig from '../../../config/apiConfig';
import { addToast } from '../toastAction';
import { addProduct, clearProducts, getBrands, getProducts } from '../../../../../js/indexDB';

export const posAllProductAction = () => async (dispatch) => {
    apiConfig.get(`products?page[size]=0`)
        .then((response) => {
            dispatch({ type: posProductActionType.POS_ALL_PRODUCT, payload: response.data.data });
        })
        .catch(({ response }) => {
            dispatch(addToast(
                { text: response.data.message, type: toastType.ERROR }));
        });
};

export const posAllProduct = (warehouse) => async (dispatch) => {
    if (navigator.onLine) {
        apiConfig.get(`products?page[size]=0&warehouse_id=${warehouse}`)
            .then(async (response) => {
                await clearProducts()
                response.data.data.forEach(async (product) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = product.attributes
                    data.attributes.images.imageUrls = await toBase64All(data.attributes.images.imageUrls);
                    data.id = product.id
                    data.links.self = environment.URL + '/api/products/' + product.id
                    data.type = 'products'
                    await addProduct(data, product.id)
                });
                dispatch({ type: posProductActionType.POS_ALL_PRODUCTS, payload: response.data.data });
            })
            .catch(({ response }) => {
                dispatch(addToast(
                    { text: response.data.message, type: toastType.ERROR }));
            });
    } else {
        let products = await getProducts()
        dispatch({ type: posProductActionType.POS_ALL_PRODUCTS, payload: products });
    }
};

export const fetchBrandClickable = (brandId, categoryId, warehouse) => async (dispatch) => {
    if (navigator.onLine) {
        await apiConfig.get(`products?filter[brand_id]=${brandId ? brandId : ''}&filter[product_category_id]=${categoryId ? categoryId : ''}&page[size]=0&warehouse_id=${warehouse ? warehouse : ''}`)
            .then(async (response) => {
                await clearProducts()
                response.data.data.forEach(async (product) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = product.attributes
                    data.attributes.images.imageUrls = await toBase64All(data.attributes.images.imageUrls);
                    data.id = product.id
                    data.links.self = environment.URL + '/api/products/' + product.id
                    data.type = 'products'
                    await addProduct(data, product.id)
                });
                dispatch({ type: productActionType.FETCH_BRAND_CLICKABLE, payload: response.data.data });
            })
            .catch(({ response }) => {
                dispatch(addToast(
                    { text: response.data.message, type: toastType.ERROR }));
            });
    } else {
        let products = await getProducts()
        if (brandId) {
            products = products.filter(product => product.attributes.brand_id == brandId)
        }
        if (categoryId) {
            products = products.filter(product => product.attributes.category_id == categoryId)
        }
        dispatch({ type: productActionType.FETCH_BRAND_CLICKABLE, payload: products });
    }
};
