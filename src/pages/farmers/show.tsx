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
    GithubFilled,
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

import { OrderStatus, UserIcon } from "../../components";
import { IOrder, IOrderFilterVariables, IPrice, IFactory, ISalesChart, IBankAccount, ITransaction, IFarmer } from "../../interfaces";
import { useState } from "react";
import { PdfLayout } from "../../components/pdf/pdfLayout";
import React from "react";
import { PdfMutation } from "../../components/pdf/pdfMutation";

const { useBreakpoint } = Grid;


export const FarmerShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { xl } = useBreakpoint();
    const { queryResult } = useShow<IFarmer>();
    const locale = useGetLocale();

    const { data } = queryResult;
    const farmer = data?.data;


    const saldoSimpanan = farmer?.farmerOrders?.reduce((acc, item) => {
        if (item.transactionType === "Saving") {
            return acc + item.transactionTotal
        }
        if (item.transactionType === "Saving Withdrawal") {
            return acc - item.transactionTotal
        }
        return acc
    }
        , 0)

    const pokokPinjaman = farmer?.farmerOrders?.reduce((acc, item) => {
        if (item.transactionType === "Loan") {
            return acc + item.transactionTotal
        }
        if (item.transactionType === "Loan Payment") {
            return acc - item.transactionTotal
        }
        return acc
    }
        , 0)

    const [transactionType, setTransactionType] = useState<string>("");


    const { tableProps, sorter, tableQueryResult } = useTable<
        ITransaction,
        HttpError,
        IOrderFilterVariables,
        IBankAccount
    >({
        resource: `farmers/${farmer?.id}/transactions`,
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
        resource: `farmers/${farmer?.id}/order`,
        id: farmer?.id,
        warnWhenUnsavedChanges: false,
    });

    const { show, modalProps } = useModal();


    const onFinishCreate = async (values: any) => {
        await onFinish({
            transactionType: transactionType,
            transactionTotal: values.transactionTotal,
            bankAccountId: values.toBankAccountId,
            farmerId: farmer?.id,
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
                                <GithubFilled style={{ fontSize: "5em" }} />
                                <Typography.Title level={3}>
                                    {farmer?.name}
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
                                    {farmer?.code}
                                </Typography.Text>

                                <Typography.Text>
                                    <BarcodeOutlined />
                                    {" "}
                                    {farmer?.phone}
                                </Typography.Text>
                                <Typography.Text >
                                    Saldo Simpanan
                                    <br />
                                    <NumberField
                                        strong
                                        locale={"id"}
                                        options={{
                                            currency: "IDR",
                                            style: "currency",
                                            maximumFractionDigits: 0
                                        }}
                                        value={saldoSimpanan || ""}
                                    />
                                </Typography.Text>

                                <Typography.Text >
                                    Pokok Pinjaman
                                    <br />
                                    <NumberField
                                        locale={"id"}
                                        options={{
                                            currency: "IDR",
                                            style: "currency",
                                            maximumFractionDigits: 0
                                        }}
                                        value={pokokPinjaman || ""}
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
                                    type="dashed"
                                    style={{ width: "100%" }}
                                    htmlType="submit"
                                    onClick={() => {
                                        createModalShow()
                                        return setTransactionType("Saving")
                                    }}
                                >
                                    {"Setor Simpanan"}
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
                                    type="dashed"
                                    style={{ width: "100%" }}
                                    htmlType="submit"
                                    onClick={() => {
                                        createModalShow()
                                        return setTransactionType("Saving Withdrawal")
                                    }}
                                >
                                    {"Tarik Simpanan"}
                                </Button>
                                <Button
                                    type="dashed"
                                    danger
                                    style={{ width: "100%" }}
                                    htmlType="submit"
                                    onClick={() => {
                                        createModalShow()
                                        return setTransactionType("Loan")
                                    }}
                                >
                                    {"Pinjaman Baru"}
                                </Button>
                                <Button
                                    type="dashed"
                                    style={{ width: "100%" }}
                                    htmlType="submit"
                                    onClick={() => {
                                        createModalShow()
                                        return setTransactionType("Loan Payment")
                                    }}
                                >
                                    {"Pembayaran Pinjaman"}
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
                                key="transactionTotal"
                                dataIndex={"transactionTotal"}
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
                            <Form.Item label="Amount" name="transactionTotal">
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
                            <Form.Item label="Bank" name="toBankAccountId">
                                <Select options={bankOptions} />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal {...modalProps} width="60%" footer={null} style={{ top: 10 }}>
                        {<PdfMutation bankInfo={farmer as unknown as IBankAccount} record={pdfRecord as unknown as ITransaction} />}
                    </Modal>
                    <Row gutter={[16, 16]}>
                        <Col xl={16} lg={24} xs={24}>

                        </Col>
                        <Col xl={8} xs={24}>

                        </Col>
                    </Row>
                </Col>
            </Row>

        </Show>
    );
};
