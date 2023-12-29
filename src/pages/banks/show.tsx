import {
    useShow,
    HttpError,
    IResourceComponentsProps,
    useTranslate,
    useGetLocale,
    useInvalidate,
    useApiUrl,
    useCustom,
    useSelect,
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
    RefreshButton,
    Show,
    SaveButton,
} from "@refinedev/antd";

import {
    CalendarOutlined,
    CheckOutlined,
    ShopFilled,
    CloseOutlined,
    FilePdfOutlined,
    MoneyCollectOutlined,
    BankTwoTone,
    UserAddOutlined,
    BarcodeOutlined,
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
    Select,
    Tooltip,
} from "antd";

import { OrderStatus } from "../../components";
import { IOrder, IOrderFilterVariables, IPrice, IFactory, ISalesChart, IBankAccount, ITransaction } from "../../interfaces";
import { useState } from "react";
import { PdfLayout } from "../../components/pdf/pdfLayout";
import React from "react";
import { PdfMutation } from "../../components/pdf/pdfMutation";

const { useBreakpoint } = Grid;


export const BankShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { xl } = useBreakpoint();
    const { queryResult } = useShow<IBankAccount>();
    const locale = useGetLocale();

    const { data } = queryResult;
    const bank = data?.data;

    const [transactionType, setTransactionType] = useState<string>("");


    const { tableProps, sorter, tableQueryResult } = useTable<
        ITransaction,
        HttpError,
        IOrderFilterVariables,
        IBankAccount
    >({
        resource: `bank/${bank?.id}/transactions`,
        initialPageSize: 6,
        syncWithLocation: false,
    });


    const pdfRecord = tableQueryResult.data?.data



    const { queryResult: bankQueryResult } = useSelect<IBankAccount>({
        resource: "bank",
    });

    const bankOptions = bankQueryResult?.data?.data?.map((item: IBankAccount) => ({
        label: `${item.bankName} - ${item.accountName} - ${item.accountNumber}`,
        value: item.id,
    }));

    const {
        modalProps: createModalProps,
        formProps: createFormProps,
        show: createModalShow,
        close,
        onFinish,
    } = useModalForm<IPrice>({
        action: "create",
        resource: `bank/${bank?.id}/transactions`,
        id: bank?.id,
        warnWhenUnsavedChanges: false,
    });

    const { show, modalProps } = useModal();


    const onFinishCreate = async (values: any) => {
        await onFinish({
            amount: values.amount,
            type: transactionType,
            description: values.description,
            toBankAccountId: values.toBankAcountId,
        });
        queryResult.refetch();
        close();
    }

    return (
        <Show
            isLoading={queryResult?.isFetching}
            canEdit={false}
            footerButtons={[
                <SaveButton key="refresh" onClick={() => {
                    show()
                }} >
                    {t("Cetak Mutasi")}
                </SaveButton>,
            ]}
        >
            <Row gutter={[16, 16]}>
                <Col xl={6} lg={24} xs={24}>
                    <Card
                        bordered={false}

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
                                <BankTwoTone style={{ fontSize: "5em" }} />
                                <Typography.Title level={3}>
                                    {bank?.bankName}
                                </Typography.Title>

                            </Space>

                            <Space
                                direction="vertical"
                                style={{
                                    width: "100%",
                                    textAlign: xl ? "unset" : "center",
                                }}
                            >
                                <Typography.Text >
                                    <UserAddOutlined />
                                    {" "}
                                    {bank?.accountName}
                                </Typography.Text>

                                <Typography.Text>
                                    <BarcodeOutlined />
                                    {" "}
                                    {bank?.accountNumber}
                                </Typography.Text>
                                <Typography.Text strong>
                                    <MoneyCollectOutlined />
                                    {" "}
                                    <NumberField
                                        options={{
                                            currency: "IDR",
                                            style: "currency",
                                            maximumFractionDigits: 0
                                        }}
                                        value={bank?.balance || ""}
                                    />
                                </Typography.Text>

                            </Space>
                        </Space>

                        <Space
                            direction="vertical"
                            style={{
                                textAlign: "center",
                                width: "100%",
                                marginTop: xl ? "5em" : "1em",
                            }}
                        >
                            <Space
                                direction="vertical"
                                style={{
                                    width: "100%",
                                    textAlign: xl ? "unset" : "center",
                                }}
                            >

                                <Button
                                    style={{ width: "100%" }}
                                    htmlType="submit"
                                    onClick={() => {
                                        createModalShow()
                                        return setTransactionType("Debit")
                                    }}
                                >
                                    {"Deposit"}
                                </Button>
                            </Space>

                            <Space
                                direction="vertical"
                                style={{
                                    width: "100%",
                                    textAlign: xl ? "unset" : "center",
                                }}
                            >
                                <Button
                                    style={{ width: "100%" }}
                                    htmlType="submit"
                                    onClick={() => {
                                        createModalShow()
                                        return setTransactionType("Transfer")
                                    }}
                                >
                                    {"Transfer"}
                                </Button>
                                <Button
                                    style={{ width: "100%" }}
                                    htmlType="submit"
                                    onClick={() => {
                                        createModalShow()
                                        return setTransactionType("Credit")
                                    }}
                                >
                                    {"Tarik Dana"}
                                </Button>


                            </Space>

                        </Space>


                    </Card>
                </Col>
                <Col xl={18} xs={24}>

                    <List
                        title={t("Mutasi Rekening")}
                        breadcrumb={null}
                    >
                        <Table {...tableProps} rowKey="id" >
                            <Table.Column

                                key="transactionDate"
                                dataIndex={"transactionDate"}
                                title={t("Tanggal Transaksi")}
                                width={180}
                                render={(value) => (
                                    <DateField value={value} format="LL" />
                                )}
                            />
                            <Table.Column
                                key="transactionType"
                                dataIndex={"transactionType"}
                                title={t("orders.fields.status")}
                                render={(value) => {
                                    return <OrderStatus status={value} />;
                                }}
                            />

                            <Table.Column
                                key="desctription"
                                dataIndex={"description"}
                                title={t("Keterangan")}

                                render={(value) => {
                                    return <Tooltip title={value}>
                                        <Typography.Text ellipsis={true} style={{ maxWidth: 350 }}>
                                            {value}
                                        </Typography.Text>
                                    </Tooltip>
                                }}
                            />
                            <Table.Column
                                key="amount"
                                dataIndex={"amount"}
                                title={t("Nominal Transaksi")}
                                width={180}
                                render={(value) => {
                                    return <NumberField
                                        locale={"id"}
                                        options={{
                                            currency: "IDR",
                                            style: "currency",

                                            maximumFractionDigits: 0
                                        }}
                                        value={value}
                                    />;
                                }}
                            />

                        </Table>
                    </List>
                    <Modal title="Create New Price" {...createModalProps} width={300} >
                        <Form {...createFormProps} onFinish={onFinishCreate}>
                            <Form.Item label="Amount" name="amount">
                                <InputNumber addonBefore="Rp" style={{}} />
                            </Form.Item>
                            <Form.Item label="Description" name="description" rules={[
                                {
                                    required: true,
                                    message: "Please input description",
                                }
                            ]}>
                                <Input />
                            </Form.Item>
                            {transactionType === "Transfer" && <Form.Item label="Bank" name="toBankAcountId">
                                <Select options={bankOptions} />
                            </Form.Item>}
                        </Form>
                    </Modal>
                    <Modal {...modalProps} width="60%" footer={null} style={{ top: 10 }}>
                        {/* <PdfLayout record={ } /> */}
                        {<PdfMutation bankInfo={bank} record={pdfRecord as unknown as ITransaction} />}
                    </Modal>
                    <Row gutter={[16, 16]}>
                        <Col xl={16} lg={24} xs={24}>
                            {/* <List
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
                            </List> */}
                        </Col>
                        <Col xl={8} xs={24}>
                            {/* <List
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
                            </Modal> */}
                        </Col>
                    </Row>
                </Col>
            </Row>

        </Show>
    );
};
