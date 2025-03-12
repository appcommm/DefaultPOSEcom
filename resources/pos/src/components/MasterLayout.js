import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AsideDefault from './sidebar/asideDefault';
import Header from './header/Header';
import Footer from './footer/Footer';
import AsideTopSubMenuItem from './sidebar/asideTopSubMenuItem';
import { Tokens } from '../constants';
import asideConfig from '../config/asideConfig';
import { environment } from '../config/environment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { fetchConfig } from "../store/action/configAction";
import apiConfig from "../config/apiConfig"
import { addCustomer, addOfflineSale, addProduct, addUnit, addWarehouse, addSetting, addFrontSetting, addOfflineHoldList, addProductCategory, addBrand, clearOfflineSales, getOfflineHoldList, getOfflineSales, clearOfflineHoldList, addPOSRegisterDetail } from '../../../js/indexDB';

const MasterLayout = (props) => {
    const { children, newPermissions, frontSetting, fetchConfig, config, allConfigData } = props;
    const [isResponsiveMenu, setIsResponsiveMenu] = useState(false);
    const [isMenuCollapse, setIsMenuCollapse] = useState(false);
    const newRoutes = config && prepareRoutes(config);
    const token = localStorage.getItem(Tokens.ADMIN);

    useEffect(() => {
        apiConfig
            .get(`settings`)
            .then(async (response) => {
                await addSetting(response.data.data, 1)
            })
        apiConfig
            .get(`front-setting`)
            .then(async (response) => {
                await addFrontSetting(response.data.data, 1)
            })
        apiConfig
            .get(`get-register-details`)
            .then(async (response) => {
                await addPOSRegisterDetail(response.data.data, 1)
            })
        apiConfig
            .get(`holds`)
            .then(async (response) => {
                if (response.data.data[0]) {
                    response.data.data.forEach(async (hold) => {
                        hold.action = 'none'
                        let data = {
                            'offline': hold
                        }
                        await addOfflineHoldList(data, hold.id)
                    });
                }
            })
        apiConfig
            .get(`sales?page[size]=0`)
            .then((response) => {
                console.log(response.data.data);
                response.data.data.forEach(async (sale) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = sale.attributes
                    data.id = sale.id
                    data.links.self = environment.URL + '/api/sales/' + sale.id
                    data.type = 'sales'
                    data.action = 'none'
                    await addOfflineSale(data, sale.id)
                });
            })
        apiConfig
            .get(`units?page[size]=0`)
            .then((response) => {
                response.data.data.forEach(async (unit) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = unit.attributes
                    data.id = unit.id
                    data.links.self = environment.URL + '/api/units/' + unit.id
                    data.type = 'units'
                    await addUnit(data, unit.id)
                });
            })
        apiConfig
            .get(`warehouses?page[size]=0`)
            .then((response) => {
                response.data.data.forEach(async (warehouse) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = warehouse.attributes
                    data.id = warehouse.id
                    data.links.self = environment.URL + '/api/warehouses/' + warehouse.id
                    data.type = 'warehouses'
                    await addWarehouse(data, warehouse.id)
                });
            })
        apiConfig
            .get(`brands?page[size]=0`)
            .then((response) => {
                response.data.data.forEach(async (brand) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = brand.attributes
                    data.id = brand.id
                    data.links.self = environment.URL + '/api/brands/' + brand.id
                    data.type = 'brands'
                    await addBrand(data, brand.id)
                });
            })
        apiConfig
            .get(`product-categories?page[size]=0`)
            .then((response) => {
                response.data.data.forEach(async (productCategories) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = productCategories.attributes
                    data.id = productCategories.id
                    data.links.self = environment.URL + '/api/product-categoriess/' + productCategories.id
                    data.type = 'product-categories'
                    await addProductCategory(data, productCategories.id)
                });
            })
        apiConfig
            .get(`customers?page[size]=0`)
            .then((response) => {
                response.data.data.forEach(async (customer) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = customer.attributes
                    data.id = customer.id
                    data.links.self = environment.URL + '/api/customers/' + customer.id
                    data.type = 'customers'
                    await addCustomer(data, customer.id)
                });
            })

        apiConfig
            .get(`products?page[size]=0`)
            .then((response) => {
                response.data.data.forEach(async (product) => {
                    let data = { 'attributes': null, 'id': null, 'links': { 'self': null }, 'type': null }
                    data.attributes = product.attributes
                    data.attributes.images.imageUrls = await toBase64All(data.attributes.images.imageUrls);
                    data.id = product.id
                    data.links.self = environment.URL + '/api/products/' + product.id
                    data.type = 'products'
                    await addProduct(data, product.id)
                });
            })
        if (token) {
            fetchConfig()
        }
        if (!token) {
            window.location.href = environment.URL + '#' + '/login';
        }
    }, []);

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
        if (imageUrls) {
            const base64Images = await Promise.all(
                imageUrls.map(async (img) => await toBase64(img))
            );
            return base64Images;
        }
        return false;
    };

    const menuClick = () => {
        setIsResponsiveMenu(!isResponsiveMenu);
    };

    const menuIconClick = () => {
        setIsMenuCollapse(!isMenuCollapse)
    };

    return (
        <div className='d-flex flex-row flex-column-fluid'>
            <AsideDefault asideConfig={newRoutes} frontSetting={frontSetting} isResponsiveMenu={isResponsiveMenu}
                menuClick={menuClick} menuIconClick={menuIconClick} isMenuCollapse={isMenuCollapse} />
            <div className={`${isMenuCollapse === true ? 'wrapper-res' : 'wrapper'} d-flex flex-column flex-row-fluid`}>
                <div className='d-flex align-items-stretch justify-content-between header'>
                    <div className='container-fluid d-flex align-items-stretch justify-content-xxl-between flex-grow-1'>
                        <button type='button' className='btn d-flex align-items-center d-xl-none px-0' title='Show aside menu'
                            onClick={menuClick}>
                            <FontAwesomeIcon icon={faBars} className='fs-1' />
                        </button>
                        <AsideTopSubMenuItem asideConfig={asideConfig} isMenuCollapse={isMenuCollapse} />
                        <Header newRoutes={newRoutes} />
                    </div>
                </div>
                <div className='content d-flex flex-column flex-column-fluid pt-7'>
                    <div className='d-flex flex-column-fluid'>
                        <div className='container-fluid'>
                            {children}
                        </div>
                    </div>
                </div>
                <div className='container-fluid'>
                    <Footer allConfigData={allConfigData} frontSetting={frontSetting} />
                </div>
            </div>
        </div>
    )
};

const getRouteWithSubMenu = (route, permissions) => {
    const subRoutes = route.subMenu ? route.subMenu.filter((item) => permissions.indexOf(item.permission) !== -1 || item.permission === '') : null
    const newSubRoutes = subRoutes ? { ...route, newRoute: subRoutes } : route
    return newSubRoutes
}

const prepareRoutes = (config) => {
    const permissions = config;
    let filterRoutes = [];
    asideConfig.forEach((route) => {
        const permissionsRoute = getRouteWithSubMenu(route, permissions)
        if (permissions && permissions.indexOf(route.permission) !== -1 || route.permission === '' || permissionsRoute.newRoute?.length) {
            filterRoutes.push(permissionsRoute)
        }
    });
    return filterRoutes;
};

const mapStateToProps = (state) => {
    const newPermissions = [];
    const { permissions, settings, frontSetting, config, allConfigData } = state;

    if (permissions) {
        permissions.forEach((permission) =>
            newPermissions.push(permission.attributes.name)
        )
    }
    return { newPermissions, settings, frontSetting, config, allConfigData };
};

export default connect(mapStateToProps, { fetchConfig })(MasterLayout);
