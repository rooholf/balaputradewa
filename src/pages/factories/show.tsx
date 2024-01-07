import {
    useShow,
    HttpError,
    IResourceComponentsProps,
    useTranslate,
    useGetLocale,
    useInvalidate,
    useApiUrl,
    useCustom,
} from "@refinedev/core";
import {
    useTable,
    List,
    useModalForm,
    TextField,
    getDefaultSortOrder,
    NumberField,
    DateField,
    useModal,
} from "@refinedev/antd";

import {
    CalendarOutlined,
    CheckOutlined,
    ShopFilled,
    CloseOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";
import {
    Typography,
    Avatar,
    Row,
    Col,
    Card,
    Space,
    Table,
    Grid,
    Popover,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    InputNumber,
} from "antd";

import { OrderStatus } from "../../components";
import { IOrder, IOrderFilterVariables, IPrice, IFactory, ISalesChart } from "../../interfaces";
import { useState } from "react";
import { PdfLayout } from "../../components/pdf/pdfLayout";
import React from "react";
import { FactoryPdf } from "../../components/pdf/factoryPdf";

const { useBreakpoint } = Grid;


export const FactoryShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { xl } = useBreakpoint();
    const { queryResult } = useShow<IFactory>();
    const locale = useGetLocale();
    const currentLocale = locale();

    // const API_URL = useApiUrl();

    const { data } = queryResult;
    const factory = data?.data;

    // const url = `${API_URL}/transaction/report?factoryId=${factory?.id}`;
    // const { data: factoryReport, isLoading: isReportLoading } = useCustom<{
    //     data: ISalesChart[];
    //     total: number;
    //     trend: number;
    // }>({ url, method: "get" });



    const { tableProps, sorter } = useTable<
        IOrder,
        HttpError,
        IOrderFilterVariables,
        IPrice
    >({
        resource: "orders",
        initialSorter: [
            {
                field: "created_at",
                order: "desc",
            },
        ],
        permanentFilter: [
            {
                field: "factory.id",
                operator: "eq",
                value: factory?.id,
            },
        ],
        initialPageSize: 5,
        queryOptions: {
            enabled: factory !== undefined,
        },
        syncWithLocation: false,
        sorters: {
            mode: "off"
        }
    });


    const {
        modalProps: createModalProps,
        formProps: createFormProps,
        show: createModalShow,
        close,
        onFinish,
    } = useModalForm<IPrice>({
        action: "create",
        resource: `factories/${factory?.id}/price`,
        id: factory?.id,
        warnWhenUnsavedChanges: false,
    });

    const { show, modalProps } = useModal();

    const [record, setRecord] = useState<IOrder>();

    const onFinishCreate = async (values: any) => {
        await onFinish({
            price: values.price,
        });
        queryResult.refetch();
        close();
    }

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xl={6} lg={24} xs={24}>
                    <Card
                        bordered={false}
                        style={{
                            height: "100%",
                        }}
                    >
                        <Space
                            direction="vertical"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <Space
                                direction="vertical"
                                style={{
                                    textAlign: "center",
                                    width: "100%",
                                }}
                            >

                                <ShopFilled style={{ fontSize: "5em" }} />
                                <Typography.Title level={3}>
                                    {factory?.name}
                                </Typography.Title>
                            </Space>
                            <Space
                                direction="vertical"
                                style={{
                                    width: "100%",
                                    textAlign: xl ? "unset" : "center",
                                }}
                            >
                                <Typography.Text>
                                    <CalendarOutlined />
                                    {" "}
                                    <DateField value={factory?.created_at} format="LL" />
                                </Typography.Text>
                                <Typography.Text>
                                    {"Jumlah Order : "}
                                    {factory?.orders.length}
                                </Typography.Text>
                            </Space>
                        </Space>

                    </Card>
                </Col>
                <Col xl={18} xs={24}>

                    <List
                        title={t("orders.orders")}
                        headerProps={{
                            extra: <></>,
                        }}

                    >
                        <Table {...tableProps} rowKey="id" size="small" >
                            <Table.Column
                                key="invDate"
                                dataIndex="invDate"
                                title={t("orders.fields.invDate")}
                                render={(value) => (
                                    <DateField value={value} format="LL" />
                                )}
                            />
                            <Table.Column
                                key="status"
                                dataIndex={"status"}
                                title={t("orders.fields.status")}
                                render={(value) => {
                                    return <OrderStatus status={value} />;
                                }}
                            />
                            <Table.Column
                                key="factoryPrice.id"
                                dataIndex="factoryPrice"
                                title={t("Harga Per Kg")}
                                render={(value) => {
                                    const price = value?.price;
                                    return <NumberField
                                        options={{
                                            currency: "IDR",
                                            style: "currency",
                                            maximumFractionDigits: 0
                                        }}
                                        value={price}
                                    />;
                                }}
                            />

                            <Table.Column
                                key="qty"
                                dataIndex={"qty"}
                                title={t("orders.fields.qty")}
                            />

                            <Table.Column
                                key="invTotal"
                                dataIndex="invTotal"
                                title={t("orders.fields.invTotal")}

                                render={(value) => {
                                    return (
                                        <NumberField
                                            options={{
                                                currency: "IDR",
                                                style: "currency",
                                                maximumFractionDigits: 0
                                            }}
                                            value={value}
                                        />
                                    );
                                }}
                            />

                            <Table.Column
                                key="invCode"
                                dataIndex="invCode"
                                title={t("Invoice Code")}
                                render={(value) => <TextField value={value} />}
                            />
                            <Table.Column
                                key="created_at"
                                dataIndex="created_at"
                                title={t("Invoice Generated At")}
                                render={(value) => (
                                    <DateField value={value} format="LL" />
                                )}
                                sorter
                                defaultSortOrder={getDefaultSortOrder(
                                    "created_at",
                                    sorter,
                                )}
                            />
                            <Table.Column
                                title={"Actions"}
                                dataIndex="actions"
                                render={(_, record: IOrder) => (
                                    <Space>
                                        <Button
                                            size="small"
                                            icon={<FilePdfOutlined />}
                                            onClick={() => {
                                                setRecord(record);
                                                show();
                                            }}
                                        />
                                    </Space>
                                )}
                            />
                        </Table>
                    </List>
                    <Modal {...modalProps} width="60%" footer={null} style={{ top: 10 }}>
                        <FactoryPdf record={record as IOrder} />
                    </Modal>
                    <Row gutter={[16, 16]}>
                        <Col xl={16} lg={24} xs={24}>
                            <List
                                title={t("Factory Suppliers")}
                                breadcrumb={null}
                                headerProps={{
                                    style: {
                                        marginTop: "1em",
                                    },
                                }}
                                canCreate={false}
                            >
                                <Table dataSource={factory?.suppliers} >
                                    <Table.Column
                                        key="code"
                                        dataIndex="code"
                                        title={t("Code")}
                                    />
                                    <Table.Column
                                        key="name"
                                        dataIndex="name"
                                        title={t("Name")}
                                    />
                                    <Table.Column
                                        key="product"
                                        dataIndex="product"
                                        title={t("Product")}
                                    />

                                    <Table.Column
                                        key="address"
                                        dataIndex="address"
                                        title={t("Address")}
                                    />

                                    <Table.Column
                                        key="created_at"
                                        dataIndex="created_at"
                                        title={t("orders.fields.createdAt")}
                                        render={(value) => (
                                            <DateField value={value} format="LL" />
                                        )}
                                        sorter={(a: any, b: any) => {
                                            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                                        }}
                                        defaultSortOrder={getDefaultSortOrder(
                                            "created_at",
                                            sorter,
                                        )}

                                    />
                                </Table>
                            </List>
                        </Col>
                        <Col xl={8} xs={24}>
                            <List
                                title={t("Factory Prices")}
                                breadcrumb={null}
                                headerProps={{
                                    style: {
                                        marginTop: "1em",
                                    },
                                }}
                                createButtonProps={{
                                    title: "Create New Price",
                                    onClick: () => {
                                        createModalShow();
                                    },
                                }}
                                canCreate={true}
                            >
                                <Table dataSource={factory?.prices} size="small">
                                    <Table.Column
                                        key="price"
                                        dataIndex="price"
                                        title={t("price")}
                                        render={(value) => {
                                            return (
                                                <NumberField
                                                    options={{
                                                        currency: "IDR",
                                                        style: "currency",
                                                    }}
                                                    value={value}
                                                />
                                            );
                                        }}
                                    />

                                    <Table.Column
                                        key="created_at"
                                        dataIndex="created_at"
                                        title={t("orders.fields.createdAt")}
                                        render={(value) => (
                                            <DateField value={value} format="LL" />
                                        )}
                                        sorter={(a: any, b: any) => {
                                            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                                        }}
                                        defaultSortOrder={getDefaultSortOrder(
                                            "created_at",
                                            sorter,
                                        )}
                                    />

                                </Table>
                            </List>
                            <Modal title="Create New Price" {...createModalProps} width={300} >
                                <Form {...createFormProps} onFinish={onFinishCreate}>
                                    <Form.Item label="Price" name="price">
                                        <InputNumber addonBefore="Rp" />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* <Row gutter={[16, 16]}>
                <Col xl={12} lg={24} xs={24}>

                </Col>
                <Col xl={12} xs={24}>
                    <List
                        title={t("Factory Prices")}
                        breadcrumb={null}
                        headerProps={{
                            style: {
                                marginTop: "1em",
                            },
                        }}
                        createButtonProps={{
                            onClick: () => {
                                createModalShow();
                            },
                        }}
                        canCreate={true}
                    >
                        <Table dataSource={factory?.prices} >
                            <Table.Column
                                key="price"
                                dataIndex="price"
                                title={t("price")}
                                render={(value) => {
                                    return (
                                        <NumberField
                                            options={{
                                                currency: "IDR",
                                                style: "currency",
                                            }}
                                            value={value}
                                        />
                                    );
                                }}
                            />

                            <Table.Column
                                key="created_at"
                                dataIndex="created_at"
                                title={t("orders.fields.createdAt")}
                                render={(value) => (
                                    <DateField value={value} format="LLL" />
                                )}
                                sorter={(a: any, b: any) => {
                                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                                }}
                                defaultSortOrder={getDefaultSortOrder(
                                    "created_at",
                                    sorter,
                                )}

                            />
                        </Table>
                    </List>
                </Col>
            </Row> */}
        </>
    );
};
