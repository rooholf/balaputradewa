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
    DateField,
    NumberField,
    ExportButton,
    useDrawerForm,
    getDefaultSortOrder,
    EditButton,
    ShowButton,
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
    IOrderFilterVariables,
} from "../../interfaces";
import { EditOrder } from "../../components/editOrder";

const { RangePicker } = DatePicker;

export const InvoiceSupplierList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, sorter, searchFormProps, filters, tableQueryResult } = useTable<
        IOrder,
        HttpError,
        IOrderFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { q, created_at, _status } = params;

            filters.push({
                field: "q",
                operator: "eq",
                value: q ? q : null,
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
        resource: "invoices/supplier",
        invalidates: ["list"],
        warnWhenUnsavedChanges: true,
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
                    headerButtons={() => (
                        <>
                            <Actions />
                        </>
                    )}
                    canCreate={true}
                    breadcrumb={null}
                >
                    <Table
                        {...tableProps}
                        rowKey="invCode"
                        size="small"
                        onRow={(record) => {
                            return {
                                onClick: (e) => {
                                    e.stopPropagation();
                                    editShow(record.invCode);
                                },
                            };
                        }}
                    >
                        <Table.Column
                            key="id"
                            dataIndex="id"
                            title={t("orders.fields.orderID")}
                            render={(value) => <TextField value={value} />}
                            defaultSortOrder={getDefaultSortOrder(
                                "status",
                                sorter,
                            )}
                            sorter
                        />
                        <Table.Column
                            key="invCode"
                            dataIndex="invCode"
                            ellipsis
                            title={t("orders.fields.orderNumber")}
                            render={(value) => <TextField value={value} />}
                        />

                        <Table.Column
                            align="left"
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

                        <Table.Column<IOrder>
                            key="status"
                            dataIndex={"status"}
                            title={t("orders.fields.status")}
                            render={(value) => {
                                return <OrderStatus status={value} />;
                            }}

                        />

                        <Table.Column
                            key="profit"
                            dataIndex="profit"
                            title={t("orders.fields.profits")}
                            render={(value) => {
                                return <NumberField
                                    options={{
                                        currency: "IDR",
                                        style: "currency",
                                        maximumFractionDigits: 0
                                    }}
                                    value={value}
                                />;
                            }}
                        />

                        <Table.Column<IOrder>
                            key="vehicleOrders"
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

                        <Table.Column<IOrder>
                            fixed="right"
                            title={t("table.actions")}
                            dataIndex="actions"
                            key="actions"
                            align="center"
                            render={(_value, record) => (
                                <>
                                    <ShowButton hideText recordItemId={record.id} />

                                    <EditButton
                                        hideText
                                        recordItemId={record.id}
                                        onClick={() => {
                                            editShow
                                            editFormProps.id = record.id as unknown as string;
                                        }}
                                        style={{ marginLeft: 10 }}
                                    />
                                </>
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
                tableQueryResult={tableQueryResult}
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
                _status: getDefaultFilter("_status", filters) || null,
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
