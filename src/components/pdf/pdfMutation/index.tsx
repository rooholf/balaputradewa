import { useRef } from "react";

import { Document, Image, Page, StyleSheet, View, Text, PDFViewer } from "@react-pdf/renderer";
import { IBankAccount, IOrder, ITransaction } from "../../../interfaces";
import dayjs from "dayjs";

type PdfProps = {
    record: ITransaction | undefined;
    bankInfo: IBankAccount | undefined;
};

export const PdfMutation: React.FC<PdfProps> = ({ record, bankInfo }) => {

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

    return (
        <PDFViewer style={styles.viewer}>
            <Document>
                <Page style={styles.page} size="A4">
                    <View>
                        {/* <Image src={API_URL + record?.company?.logo?.url} style={{ width: "120px", height: "auto" }} /> */}
                        <View style={styles.invoiceTextNumberContainer}>
                            <Text style={styles.invoiceId}>
                                {`Rekening: `}
                                <Text style={styles.invoiceText}>
                                    {bankInfo?.accountName} - {bankInfo?.accountNumber}
                                </Text>
                            </Text>
                            <Text style={styles.invoiceId}>
                                {`Tanggal: ${getParsedInvDate(record?.created_at)}`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.dividerLG} />

                    <View style={styles.invoiceForFromContainer}>



                        <View style={styles.invoiceFrom}>
                            <Text style={styles.invoiceForFromTitle}>CV. BALA PUTRA DEWA</Text>
                            <View>
                                <Text style={styles.invoiceForFromText}>
                                    {/* {record?.company.name} */}
                                    Alamat :
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    {/* {record?.company.city} */}
                                    Senawar Jaya, Rt 17, Rw 03 Kec. Bayung
                                    Lencir. Kab Musi Banyuasin
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    {/* {record?.company.address}, {record?.company.country} */}
                                </Text>
                            </View>
                            <View style={styles.dividerSM} />
                            <View>
                                <Text style={styles.invoiceForFromText}>
                                    {`Nama Bank : ${bankInfo?.bankName}`}
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    {/* {`Invoice Custom ID: ${record?.custom_id}`} */}
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    {`Untuk Tanggal : ${getParsedInvDate(record?.transactionDate)}`}
                                </Text>
                            </View>
                        </View>

                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderItem, { width: "10%" }]}>No</Text>
                            <Text style={[styles.tableHeaderItem, { width: "20%" }]}>Tanggal Transaksi</Text>
                            <Text style={[styles.tableHeaderItem, { width: "30%" }]}>Keterangan</Text>
                            <Text style={[styles.tableHeaderItem, { width: "20%" }]}>Jenis Transaksi</Text>
                            <Text style={[styles.tableHeaderItem, { width: "20%" }]}>Nominal(Rp)</Text>
                        </View>
                        {Array.isArray(record) && record.map((item, index) => {
                            return (
                                <View key={item.id} style={styles.tableRow}>
                                    <Text style={[styles.tableCol, { width: "10%" }, { textAlign: "center" }]}>
                                        {index + 1}
                                    </Text>
                                    <Text style={[styles.tableCol, { width: "20%" }]}>
                                        {getParsedInvDate(item.transactionDate)}
                                    </Text>
                                    <Text style={[styles.tableCol, { width: "30%" }, { textAlign: "left" }]}>
                                        {item.description.substring(0, 50)}
                                    </Text>
                                    <Text style={[styles.tableCol, { width: "20%" }, { textAlign: "center" }]}>
                                        {`${item.transactionType}`}
                                    </Text>
                                    <Text style={[styles.tableCol, { width: "20%" }, { textAlign: "right" }]}>
                                        {parseCurrency(item.amount as number)}
                                    </Text>
                                </View>
                            );
                        })}
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, { width: "10%" }, { textAlign: "center" }]}>
                            </Text>
                            <Text style={[styles.tableCol, { width: "20%" }, { textAlign: "right" }]}>
                                {/* {Array.isArray(record) && record.reduce((prev: any, cur: any): any => {
                                    return prev + cur.amount as number;
                                }
                                    , 0)} */}

                            </Text>
                            <Text style={[styles.tableCol, { width: "30%" }]}>
                                Total
                            </Text>
                            <Text style={[styles.tableCol, { width: "40%" }, { textAlign: "right" }, { fontWeight: "extrabold" }]}>
                                Rp.  {Array.isArray(record) && parseCurrency(record.reduce((prev: any, cur: any): any => {
                                    return prev + cur.amount as number;
                                }, 0) as number)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.signatureTotalContainer}>
                        <View style={styles.signatureContainer}>
                            <Text style={styles.signatureText}>Signature: ________________</Text>
                            <br />
                            <Text style={styles.signatureText}> {" "}
                                {dayjs(Date.now()).format("DD MMMM YYYY").toString().slice(0, 16)}
                            </Text>
                        </View>

                        <View style={styles.totalContainer}>
                            {/* <Text style={styles.totalText}>SUBTOTAL :  {parseCurrency(record?.invTotal as number)}
                            </Text> */}
                            {/* <Text style={styles.totalText}>PPN (11%): {record?.supplierPrice?.isPPN ? record?.invTotal * 0.11 : "0"}
                            </Text> */}
                            {/* <Text style={styles.totalText}>
                                Total:  {parseCurrency(record?.invTotal as number, "currency")}
                            </Text> */}
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            {/* {record?.company.city} */}
                        </Text>
                        <Text style={styles.footerText}>
                            {/* {record?.company.address}, {record?.company.country} */}
                        </Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
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