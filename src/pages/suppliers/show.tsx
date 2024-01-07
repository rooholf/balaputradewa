import {
    useShow,
    HttpError,
    IResourceComponentsProps,
    useTranslate,
    useGetLocale,
    useInvalidate,
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
import { IOrder, IOrderFilterVariables, IPrice, ISupplier } from "../../interfaces";
import { useState } from "react";
import { PdfLayout } from "../../components/pdf/pdfLayout";

const { useBreakpoint } = Grid;


export const SupplierShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { xl } = useBreakpoint();
    const { queryResult } = useShow<ISupplier>();
    const locale = useGetLocale();
    const currentLocale = locale();


    const { data } = queryResult;
    const supplier = data?.data;

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
                field: "supplier.id",
                operator: "eq",
                value: supplier?.id,
            },
        ],
        initialPageSize: 4,
        queryOptions: {
            enabled: supplier !== undefined,
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
        resource: `suppliers/${supplier?.id}/price`,
        id: supplier?.id,
        invalidates: ["detail"],
        warnWhenUnsavedChanges: false,

    });

    const { show, close: closePdfModal, modalProps } = useModal();

    const [record, setRecord] = useState<IOrder>();

    const invalidate = useInvalidate();

    const onFinishCreate = async (values: any) => {
        await onFinish({
            price: values.price,
            isPPN: values.isPPN ? values.isPPN : false,
        });
        queryResult.refetch();
        invalidate({
            resource: `suppliers/${supplier?.id}`,
            invalidates: ['all'],
            id: supplier?.id
        })
        close();
    }


    return (
        <>
            <Row gutter={[16, 16]} style={{}}>
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
                                    {supplier?.name}
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
                                    <DateField value={supplier?.created_at} format="LL" />
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
                                key="supplierPrice.id"
                                dataIndex="supplierPrice"
                                title={t("orders.fields.supplierPrice")}
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
                                key="profits"
                                dataIndex="profits"
                                title={t("orders.fields.profits")}
                                width={150}
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


                            <Table.Column
                                key="invCode"
                                dataIndex="invCode"
                                title={t("orders.fields.invCode")}
                                render={(value) => <TextField value={value} />}
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
                        <PdfLayout record={record} />
                    </Modal>
                    <Row gutter={[16, 16]}>
                        <Col xl={12} xs={24}>
                            <List
                                title={t("Supplier Vehicles")}
                                breadcrumb={null}
                                headerProps={{
                                    style: {
                                        marginTop: "1em",
                                    },
                                }}
                                canCreate={false}
                            >
                                <Table dataSource={supplier?.vehicles} >
                                    <Table.Column
                                        key="price"
                                        dataIndex="plate"
                                        title={t("Plate")}
                                    />
                                    <Table.Column
                                        key="brand"
                                        dataIndex="brand"
                                        title={t("Brand")}
                                    />
                                    <Table.Column
                                        key="color"
                                        dataIndex="color"
                                        title={t("Color")}
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
                        <Col xl={12} xs={24}>
                            <List
                                title={t("Supplier Prices")}
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
                                <Table dataSource={supplier?.prices} >
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
                                        key="isPPN"
                                        dataIndex={"isPPN"}
                                        title={t("isPPN")}
                                        render={(value) => {
                                            return (
                                                value ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />
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
                    </Row>
                    <Modal title="Create New Price" {...createModalProps} width={300} >
                        <Form key="createForm" {...createFormProps} onFinish={onFinishCreate}>
                            <Form.Item label="Price" name="price">
                                <InputNumber addonBefore="Rp" />
                            </Form.Item>
                            <Form.Item label="Is PPN" name="isPPN">
                                <Switch />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Col>
            </Row>

        </>
    );
};
