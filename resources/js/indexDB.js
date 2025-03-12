import { openDB } from 'idb';
const dbPromise = openDB('pos-db', 1, {
    upgrade(db) {
        db.createObjectStore('units', {
            autoIncrement: false,
        });
        db.createObjectStore('warehouses', {
            autoIncrement: false,
        });
        db.createObjectStore('brands', {
            autoIncrement: false,
        });
        db.createObjectStore('product-categories', {
            autoIncrement: false,
        });
        db.createObjectStore('customers', {
            autoIncrement: false,
        });
        db.createObjectStore('products', {
            autoIncrement: false,
        });
        db.createObjectStore('sales', {
            autoIncrement: false,
        });
        db.createObjectStore('sale-returns', {
            autoIncrement: false,
        });
        db.createObjectStore('setting', {
            autoIncrement: false,
        });
        db.createObjectStore('front-setting', {
            autoIncrement: false,
        });
        db.createObjectStore('config', {
            autoIncrement: false,
        });
        db.createObjectStore('pos-register', {
            autoIncrement: false,
        });
        db.createObjectStore('pos-register-detail', {
            autoIncrement: false,
        })
        db.createObjectStore('holdlist', {
            autoIncrement: false,
        });
        db.createObjectStore('register-close', {
            autoIncrement: false,
        })
    },
});
//Units
export async function getUnits() {
    return (await dbPromise).getAll('units');
}
export async function addUnit(record, id) {
    return (await dbPromise).put('units', record, id);
}
export async function deleteUnit(record) {
    return (await dbPromise).delete('units', record);
}
export async function clearUnits() {
    return (await dbPromise).clear('units');
}
//Product Cateogry
export async function getProductCategories() {
    return (await dbPromise).getAll('product-categories');
}
export async function addProductCategory(record, id) {
    return (await dbPromise).put('product-categories', record, id);
}
export async function deleteProductCategory(record) {
    return (await dbPromise).delete('product-categories', record);
}
export async function clearProductCategories() {
    return (await dbPromise).clear('product-categories');
}
//Brand
export async function getBrands() {
    return (await dbPromise).getAll('brands');
}
export async function addBrand(record, id) {
    return (await dbPromise).put('brands', record, id);
}
export async function deleteBrand(record) {
    return (await dbPromise).delete('brands', record);
}
export async function clearBrands() {
    return (await dbPromise).clear('brands');
}
//Warehouse
export async function getWarehouses() {
    return (await dbPromise).getAll('warehouses');
}
export async function addWarehouse(record, id) {
    return (await dbPromise).put('warehouses', record, id);
}
export async function deleteWarehouse(record) {
    return (await dbPromise).delete('warehouses', record);
}
export async function clearWarehouses() {
    return (await dbPromise).clear('warehouses');
}
//Customers
export async function getCustomers() {
    return (await dbPromise).getAll('customers');
}
export async function addCustomer(record, id) {
    return (await dbPromise).put('customers', record, id);
}
export async function deleteCustomer(record) {
    return (await dbPromise).delete('customers', record);
}
export async function clearCustomers() {
    return (await dbPromise).clear('customers');
}
//Products
export async function getProducts() {
    return (await dbPromise).getAll('products');
}
export async function addProduct(record, id) {
    return (await dbPromise).put('products', record, id);
}
export async function deleteProduct(record) {
    return (await dbPromise).delete('products', record);
}
export async function clearProducts() {
    return (await dbPromise).clear('products');
}
//Sales
export async function getOfflineSales() {
    return (await dbPromise).getAll('sales');
}
export async function addOfflineSale(record, id) {
    return (await dbPromise).put('sales', record, id);
}
export async function deleteOfflineSale(record) {
    return (await dbPromise).delete('sales', record);
}
export async function clearOfflineSales() {
    return (await dbPromise).clear('sales');
}
//Sale Returns
export async function getOfflineSaleReturns() {
    return (await dbPromise).getAll('sale-returns');
}
export async function addOfflineSaleReturn(record, id) {
    return (await dbPromise).put('sale-returns', record, id);
}
export async function deleteOfflineSaleReturn(record) {
    return (await dbPromise).delete('sale-returns', record);
}
export async function clearOfflineSaleReturns() {
    return (await dbPromise).clear('sale-returns');
}
//Setting
export async function getSetting() {
    return (await dbPromise).getAll('setting');
}
export async function addSetting(record, id) {
    return (await dbPromise).put('setting', record, id);
}
export async function deleteSetting(record) {
    return (await dbPromise).delete('setting', record);
}
export async function clearSetting() {
    return (await dbPromise).clear('setting');
}
//Front Setting
export async function getFrontSetting() {
    return (await dbPromise).getAll('front-setting');
}
export async function addFrontSetting(record, id) {
    return (await dbPromise).put('front-setting', record, id);
}
export async function deleteFrontSetting(record) {
    return (await dbPromise).delete('front-setting', record);
}
export async function clearFrontSetting() {
    return (await dbPromise).clear('front-setting');
}
//POS Register
export async function getPOSRegister() {
    return (await dbPromise).getAll('pos-register');
}
export async function addPOSRegister(record, id) {
    return (await dbPromise).put('pos-register', record, id);
}
export async function deletePOSRegister(record) {
    return (await dbPromise).delete('pos-register', record);
}
export async function clearPOSRegister() {
    return (await dbPromise).clear('pos-register');
}

//POS Register Detail
export async function getPOSRegisterDetail() {
    return (await dbPromise).getAll('pos-register-detail');
}
export async function addPOSRegisterDetail(record, id) {
    return (await dbPromise).put('pos-register-detail', record, id);
}
export async function deletePOSRegisterDetail(record) {
    return (await dbPromise).delete('pos-register-detail', record);
}
export async function clearPOSRegisterDetail() {
    return (await dbPromise).clear('pos-register-detail');
}
//POS Register Close
export async function getPOSRegisterClose() {
    return (await dbPromise).getAll('register-close');
}
export async function addPOSRegisterClose(record, id) {
    return (await dbPromise).put('register-close', record, id);
}
export async function deletePOSRegisterClose(record) {
    return (await dbPromise).delete('register-close', record);
}
export async function clearPOSRegisterClose() {
    return (await dbPromise).clear('register-close');
}
//Config
export async function getConfig() {
    return (await dbPromise).getAll('config');
}
export async function addConfig(record, id) {
    return (await dbPromise).put('config', record, id);
}
export async function deleteConfig(record) {
    return (await dbPromise).delete('config', record);
}
export async function clearConfig() {
    return (await dbPromise).clear('config');
}
//Holdlist
export async function getOfflineHoldList() {
    return (await dbPromise).getAll('holdlist');
}
export async function addOfflineHoldList(record, id) {
    return (await dbPromise).put('holdlist', record, id);
}
export async function deleteOfflineHoldList(record) {
    return (await dbPromise).delete('holdlist', record);
}
export async function clearOfflineHoldList() {
    return (await dbPromise).clear('holdlist');
}

