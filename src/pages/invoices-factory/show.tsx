import React, { useState } from "react";
import {
    IResourceComponentsProps,
    useShow,
    useTranslate,
} from "@refinedev/core";
import {
    Show,
    NumberField,
    TextField,
    DateField,
    useModal,
    ExportButton,
    SaveButton,
} from "@refinedev/antd";
import { Button, Card, Col, Flex, Grid, List, Modal, Row, Table, Typography } from "antd";
import { Document, Image, Page, StyleSheet, View, Text, PDFViewer } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { IOrder, IVehicleOrders } from "../../interfaces";
import { PdfLayout } from "../../components/pdf/pdfLayout";
import { FactoryPdf } from "../../components/pdf/factoryPdf";


const { Title } = Typography;
const { useBreakpoint } = Grid;

export const FactoryInvoiceShow: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    const { xl } = useBreakpoint();

    const getParsedInvDate = (invDate: string | undefined): string => {
        return dayjs(invDate).format("DD MMMM YYYY").toString().slice(0, 16);
    };

    const parseCurrency = (amount: number, style?: string): string => {
        const formatter = new Intl.NumberFormat("id", {
            style,
            currency: "IDR",
            maximumFractionDigits: 0,
        });

        return formatter.format(amount);
    };

    const { show, modalProps } = useModal();

    const columns = [
        { title: 'No', dataIndex: 'index', key: 'index', },
        { title: 'No Lorry', dataIndex: 'plate', key: 'plate', },
        { title: 'Produk', dataIndex: "product", key: 'product' },
        { title: 'Netto(Kg)', dataIndex: 'qty', key: 'qty', width: 200 },
        { title: 'Harga / Kg', dataIndex: 'price', key: 'price' },
        { title: 'Total', dataIndex: 'total', key: 'total' },
    ];

    const dataSource = record?.vehicleOrders.map((item: IVehicleOrders, index: any) => ({
        key: item.id,
        index: index + 1,
        plate: item.vehicle.plate,
        product: item.supplierOrder.supplier.products.name,
        qty: item.qty,
        price: record?.factoryPrice.price,
        total: parseCurrency(item.qty * record?.factoryPrice?.price as number),
    }));

    const subTotal = record?.dpp

    const pph = record?.pph

    const taxes = record?.ppn;


    const total = subTotal + taxes - pph;


    const invoiceRender = (
        <>
            <Typography.Title level={4}>Invoice Summary</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <Typography.Text>{record?.supplier?.name ? "Supplier" : "Factory"}</Typography.Text>
                    <br />
                    <Typography.Text>No. Ref</Typography.Text>
                    <br />
                    <Typography.Text>Transaction Date</Typography.Text>
                    <br />
                    <Typography.Text>Bank Account</Typography.Text>
                    <br />
                </Col>
                <Col span={7}>
                    <Typography.Text strong>
                        : {record?.factory?.name}
                    </Typography.Text>
                    <br />
                    <Typography.Text >
                        : {record?.noRef}
                    </Typography.Text>
                    <br />
                    <Typography.Text >
                        : {getParsedInvDate(record?.invDate)}
                    </Typography.Text>
                    <br />
                    <Typography.Text >
                        : {record?.BankTransactions?.bankAccounts?.bankName} - {record?.BankTransactions?.bankAccounts?.accountNumber}
                    </Typography.Text>
                    <br />
                </Col>
            </Row>

            <Table
                style={{ marginTop: 20 }}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
            />

            <List style={{ width: 500, justifyContent: "end", textAlign: "end", float: "right", marginTop: xl ? "5em" : "1em", }} >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text>DPP :</Text>
                    </Col>
                    <Col span={12}>
                        <NumberField
                            locale={"id"}
                            options={{
                                currency: "IDR",
                                style: "currency",
                                maximumFractionDigits: 0,
                            }}
                            value={subTotal || 0}
                        />
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text>PPH (0.25%) :</Text>
                    </Col>
                    <Col span={12}>

                        <NumberField
                            locale={"id"}
                            options={{
                                currency: "IDR",
                                style: "currency",
                                maximumFractionDigits: 0,
                            }}
                            value={pph}
                        />

                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text>Taxes (11%) :</Text>
                    </Col>
                    <Col span={12}>
                        {record?.factory?.isPPN ?
                            <NumberField
                                locale={"id"}
                                options={{
                                    currency: "IDR",
                                    style: "currency",
                                    maximumFractionDigits: 0,
                                }}
                                value={taxes}
                            />
                            : 0}
                    </Col>
                </Row>

                <Row gutter={[16, 16]} >
                    <Col span={12}>
                        <hr />
                        <Title level={5} >Total :</Title>
                    </Col>
                    <Col span={12}>
                        <hr />
                        <Title level={5}>
                            <NumberField
                                locale={"id"}
                                options={{
                                    currency: "IDR",
                                    style: "currency",
                                    maximumFractionDigits: 0,
                                }}
                                value={total || 0}
                            /></Title>
                    </Col>
                </Row>
            </List>
        </>
    )

    return (
        <Show
            isLoading={isLoading}
            canEdit={false}
            headerButtons={({ defaultButtons }) => (
                <>
                    {defaultButtons}
                    <SaveButton onClick={() => { show() }}  >Print</SaveButton>
                </>
            )}
            canDelete={true}
        >
            {invoiceRender}
            <Modal {...modalProps} width="60%" footer={null} style={{ top: 10 }}>
                <FactoryPdf record={record as IOrder} />
            </Modal>
        </Show>
    );
};



const styles = StyleSheet.create({

    viewer: {
        paddingTop: 32,
        width: "100%",
        height: "80vh",
        border: "none",
    },
    page: {
        display: "flex",
        padding: "0.4in 0.4in",
        fontSize: 12,
        color: "#333",
        backgroundColor: "#fff",
    },
    invoiceTextNumberContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    invoiceText: {
        color: "#3aabf0",
    },
    invoiceId: {
        textAlign: "center",
    },
    invoiceForFromContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    invoiceForFromTitle: {
        marginBottom: 24,
    },
    invoiceFor: {
        flex: 1.5,
    },
    invoiceFrom: {
        flex: 1,
    },
    invoiceForFromText: {
        color: "#787878",
        lineHeight: 1.5,
    },
    dividerSM: {
        width: "100%",
        height: 1,
        marginTop: 12,
        marginBottom: 12,
        backgroundColor: "#e5e5e5",
    },
    dividerLG: {
        width: "100%",
        height: 1,
        marginTop: 40,
        marginBottom: 40,
        backgroundColor: "#e5e5e5",
    },
    table: {
        marginTop: 32,
        border: "1px solid #000",
        cellpadding: 0,
        cellspacing: 0,
    },
    tableHeader: {
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
    },
    tableHeaderItem: {
        paddingVertical: 8,
        border: "1px solid #000",
        borderBottom: "none",
    },
    tableRow: {
        display: "flex",
        flexDirection: "row",
    },
    tableCol: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        border: "1px solid #000",
        alignItems: "flex-end"
    },
    signatureTotalContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 200,
    },
    signatureContainer: {},
    totalContainer: {
    },
    signatureText: {
        marginTop: 32,
    },
    totalText: {
        marginTop: 16,
    },
    footer: {
        borderTop: "1px solid #e5e5e5",
        paddingTop: 8,
        marginTop: "auto",
    },
    footerText: {
        color: "#787878",
        lineHeight: 1.5,
    },
});