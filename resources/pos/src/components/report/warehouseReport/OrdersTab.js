import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect } from "react-redux";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { fetchOrders } from "../../../store/action/ordersAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
// import { saleExcelAction } from "../../../store/action/salesExcelAction";

const OrdersTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchOrders,
        orders,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        // saleExcelAction,
        allConfigData,
    } = props;
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue =
        currencySymbol &&
        orders.length >= 0 &&
        orders.map((order) => ({
            time: moment(order.attributes.created_at).format("LT"),
            customer_name: order.attributes.customer_name,
            phone: order.attributes.phone,
            address: order.attributes.address,
            status: order.attributes.status,
            grand_total: order.attributes.grand_total
                ?? (0.0).toFixed(2),
            id: order.id,
            currency: currencySymbol,
        }));

    // useEffect(() => {
    //     if (isWarehouseValue === true) {
    //         saleExcelAction(warehouseValue.value, setIsWarehouseValue);
    //     }
    // }, [isWarehouseValue]);

    const columns = [
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("globally.detail.phone"),
            selector: (row) => row.phone,
            sortField: "phone",
            sortable: false,
        },
        {
            name: getFormattedMessage("globally.detail.address"),
            selector: (row) => row.address,
            sortField: "address",
            sortable: false,
        },
        {
            name: getFormattedMessage("purchase.select.status.label"),
            sortField: "status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.status === 'pending' && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "order-status.filter.pending.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 'confirm' && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "order-status.filter.confirm.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 'processing' && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "order-status.filter.processing.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 'delivered' && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "order-status.filter.delivered.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 'complete' && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "order-status.filter.complete.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 'cancel' && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "order-status.filter.cancel.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 'cancel' && row.refund_date && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "order-status.filter.refund.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("purchase.grant-total.label"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.grand_total
                ),
            sortField: "grand_total",
            sortable: true,
        },
    ];

    const onChange = (filter) => {
        fetchOrders(filter, true);
    };

    // const onExcelClick = () => {
    //     setIsWarehouseValue(true);
    // };

    return (
        <div className="warehouse_sale_report_table">
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                warehouseValue={warehouseValue}
                isLoading={isLoading}
                totalRows={totalRecord}
                // isEXCEL
                // onExcelClick={onExcelClick}
                isPaymentStatus
                isStatus
                isShowFilterField
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    const { isLoading, totalRecord, orders, frontSetting } = state;
    return { isLoading, totalRecord, orders, frontSetting };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchOrders,
    // saleExcelAction,
})(OrdersTab);
