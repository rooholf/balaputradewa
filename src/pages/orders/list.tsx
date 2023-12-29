import { useMemo } from "react";
import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    useExport,
    useNavigation,
    HttpError,
    getDefaultFilter,
} from "@refinedev/core";

import {
    List,
    TextField,
    useTable,
    getDefaultSortOrder,
    DateField,
    NumberField,
    useSelect,
    ExportButton,
    useDrawerForm,
} from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import {
    Table,
    Popover,
    Card,
    Input,
    Form,
    DatePicker,
    Select,
    Button,
    FormProps,
    Row,
    Col,
} from "antd";
import dayjs from "dayjs";

import { OrderStatus, OrderActions } from "../../components";
import {
    IOrder,
    IStore,
    IOrderFilterVariables,
    IOrderStatus,
    IVehicleOrders,
} from "../../interfaces";
import { EditOrder } from "../../components/editOrder";

const { RangePicker } = DatePicker;

export const OrderList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, sorter, searchFormProps, filters } = useTable<
        IOrder,
        HttpError,
        IOrderFilterVariables
    >({
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { q, created_at, _status } = params;

            filters.push({
                field: "q",
                operator: "eq",
                value: q ? q : "q",
            });

            filters.push({
                field: "_status",
                operator: "eq",
                value: _status,
            });

            filters.push(
                {
                    field: "created_at",
                    operator: "gte",
                    value: created_at
                        ? created_at[0].startOf("day").toISOString()
                        : undefined,
                },
                {
                    field: "created_at",
                    operator: "lte",
                    value: created_at
                        ? created_at[1].endOf("day").toISOString()
                        : undefined,
                },
            );

            return filters;
        },
        syncWithLocation: false,
    });

    const t = useTranslate();
    const { show } = useNavigation();

    const { isLoading, triggerExport } = useExport<IOrder>({
        sorter,
        filters,
        pageSize: 50,
        maxItemCount: 50,
        mapData: (item) => {
            return {
                id: item.id,
                amount: item.invTotal,
                orderNumber: item.invCode,
                status: item.status,
                created_at: item.created_at,
                supplier: item.supplier.id,
                price: item.supplierPrice,
            };
        },
    });

    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
        id: editId,
    } = useDrawerForm<IOrder>({
        action: "create",
        resource: "orders",
        redirect: "list",
        warnWhenUnsavedChanges: false,
    });

    const Actions: React.FC = () => (
        <ExportButton onClick={triggerExport} loading={isLoading} />
    );

    return (
        <Row gutter={[16, 16]}>
            <Col
                xl={24}
                lg={24}
                xs={24}
                style={{
                    marginTop: 10,
                }}
            >
                <Card title={t("orders.filter.title")}>
                    <Filter
                        formProps={searchFormProps}
                        filters={filters || []}
                    />
                </Card>
            </Col>
            <Col xl={24} xs={24}>
                <List
                    headerProps={{
                        extra: <Actions />,
                    }}
                    breadcrumb={null}
                >
                    <Table
                        {...tableProps}
                        rowKey="invCode"
                        size="small"
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    <OrderActions record={record} editShow={editShow} />
                                },
                            };
                        }}
                    >
                        <Table.Column
                            key="invCode"
                            dataIndex="invCode"
                            title={t("orders.fields.orderNumber")}
                            render={(value) => <TextField value={value} />}
                        />
                        <Table.Column<IOrder>
                            key="status"
                            dataIndex={"status"}
                            title={t("orders.fields.status")}
                            render={(value) => {
                                return <OrderStatus status={value} />;
                            }}

                        />
                        <Table.Column
                            align="right"
                            key="invTotal"
                            dataIndex="invTotal"
                            title={t("orders.fields.amount")}
                            render={(value) => {
                                return (
                                    <NumberField
                                        options={{
                                            currency: "IDR",
                                            style: "currency",
                                            maximumFractionDigits: 0,
                                        }}
                                        value={value}
                                    />
                                );
                            }}
                        />
                        {/* <Table.Column
                            key="store.id"
                            dataIndex={["store", "title"]}
                            title={t("orders.fields.store")}
                        />
                        <Table.Column
                            key="user.fullName"
                            dataIndex={["user", "fullName"]}
                            title={t("orders.fields.user")}
                        /> */}
                        <Table.Column<IOrder>
                            key="VehicleOrders"
                            dataIndex="vehicleOrders"
                            title={t("Vehicle Orders")}
                            render={(_, record) => (
                                record.vehicleOrders && <Popover
                                    content={
                                        <ul>
                                            {record.vehicleOrders.map((order) => (
                                                <>
                                                    <li key={order.id}>
                                                        {`${order.plate} - ${order.qty}Kg`}
                                                    </li>
                                                </>
                                            ))}
                                        </ul>
                                    }
                                    title="Vehicle plate - Qty"
                                    trigger="hover"
                                >
                                    {t("orders.fields.qty", {
                                        amount: record.qty,
                                    })}
                                </Popover>
                            )}
                        />
                        <Table.Column
                            key="created_at"
                            dataIndex="created_at"
                            title={t("orders.fields.createdAt")}
                            render={(value) => (
                                <DateField value={value} format="LLL" />
                            )}
                            sorter
                        />
                        <Table.Column<IOrder>
                            fixed="right"
                            title={t("table.actions")}
                            dataIndex="actions"
                            key="actions"
                            align="center"
                            render={(_value, record) => (
                                <OrderActions record={record} editShow={editShow} />
                            )}
                        />
                    </Table>
                </List>
            </Col>
            <EditOrder
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
                editId={editId}
            />
        </Row>

    );
};

const Filter: React.FC<{ formProps: FormProps; filters: CrudFilters }> = (
    props,
) => {
    const t = useTranslate();

    const { formProps, filters } = props;

    const created_at = useMemo(() => {
        const start = getDefaultFilter("created_at", filters, "gte");
        const end = getDefaultFilter("created_at", filters, "lte");

        const startFrom = dayjs(start);
        const endAt = dayjs(end);

        if (start && end) {
            return [startFrom, endAt];
        }
        return undefined;
    }, [filters]);

    return (
        <Form
            layout="vertical"
            {...formProps}
            initialValues={{
                q: getDefaultFilter("q", filters),
                store: getDefaultFilter("store.id", filters)
                    ? Number(getDefaultFilter("store.id", filters))
                    : undefined,
                user: getDefaultFilter("user.id", filters)
                    ? Number(getDefaultFilter("user.id", filters))
                    : undefined,
                _status: getDefaultFilter("_status", filters) || "none",
                created_at,
            }}
        >
            <Row gutter={[10, 0]} align="bottom">
                <Col xl={12} md={8} sm={12} xs={24}>
                    <Form.Item label={t("orders.filter.search.label")} name="q">
                        <Input
                            placeholder={"Invoice Numbers, Supplier, Factory, Vehicle Plate"}
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                </Col>
                <Col xl={12} md={8} sm={12} xs={24}>
                    <Form.Item
                        label={t("orders.filter.status.label")}
                        name="_status"
                    >
                        <Select
                            allowClear
                            placeholder={"Select status"}

                            options={[
                                {
                                    label: "Paid",
                                    value: "paid",
                                },
                                {
                                    label: "Pending",
                                    value: "pending",
                                },
                                {
                                    label: "None",
                                    value: "none",
                                },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col xl={12} md={8} sm={12} xs={24}>
                    <Form.Item
                        label={t("orders.filter.created_at.label")}
                        name="created_at"
                    >
                        <RangePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                <Col xl={12} md={8} sm={12} xs={24}>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            type="primary"
                            size="large"
                            block
                            onClick={() => {
                                const formValues = formProps.form?.getFieldsValue();
                            }}
                        >
                            {t("orders.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
