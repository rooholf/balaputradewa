import { useRef } from "react";

import { Document, Image, Page, StyleSheet, View, Text, PDFViewer } from "@react-pdf/renderer";
import { IOrder } from "../../../interfaces";
import dayjs from "dayjs";

type PdfProps = {
    record: IOrder | undefined;
    // componentRef?: any;
    // content: React.ReactNode;
};

export const FactoryPdf: React.FC<PdfProps> = ({ record }) => {

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

    // if (content) {
    // return (
    //     <PDFViewer style={styles.viewer}>
    //         <Document>
    //             <Page size="A4">
    //                 {content}
    //             </Page>
    //         </Document>
    //     </PDFViewer>
    // );
    // }

    console.log(record)

    return (
        <PDFViewer style={styles.viewer}>
            <Document>
                <Page style={styles.page} size="A4">
                    <View>
                        {/* <Image src={API_URL + record?.company?.logo?.url} style={{ width: "120px", height: "auto" }} /> */}
                        <View style={styles.invoiceTextNumberContainer}>
                            <Text style={styles.invoiceId}>
                                {`No: `}
                                <Text style={styles.invoiceText}>
                                    {record?.invCode}
                                </Text>
                            </Text>
                            <Text style={styles.invoiceId}>
                                {`Tanggal: ${getParsedInvDate(record?.created_at)}`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.dividerLG} />

                    <View style={styles.invoiceForFromContainer}>
                        <View style={styles.invoiceFor}>
                            <Text style={styles.invoiceForFromTitle}>Ditujukan Kepada:</Text>

                            <View>
                                <Text style={styles.invoiceForFromTitle}>
                                    {record?.factory?.name}
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    Di :
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    {/* {record?.company.city} */}
                                    {record?.factory?.code}
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    {/* {record?.company.address}, {record?.company.country} */}
                                </Text>
                            </View>
                        </View>

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
                                    {`Invoice ID: ${record?.id}`}
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    {/* {`Invoice Custom ID: ${record?.custom_id}`} */}
                                </Text>
                                <Text style={styles.invoiceForFromText}>
                                    {`Invoice Date: ${getParsedInvDate(record?.invDate)}`}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderItem, { width: "10%" }]}>No</Text>
                            <Text style={[styles.tableHeaderItem, { width: "20%" }]}>Keterangan</Text>
                            <Text style={[styles.tableHeaderItem, { width: "20%" }]}>Netto(Kg)</Text>
                            <Text style={[styles.tableHeaderItem, { width: "20%" }]}>Harga / Kg</Text>
                            <Text style={[styles.tableHeaderItem, { width: "30%" }]}>Jumlah(Rp)</Text>
                        </View>
                        {record?.vehicleOrders.map((item, index) => {
                            return (
                                <View key={item.id} style={styles.tableRow}>
                                    <Text style={[styles.tableCol, { width: "10%" }, { textAlign: "center" }]}>
                                        {index + 1}
                                    </Text>
                                    <Text style={[styles.tableCol, { width: "20%" }]}>
                                        {item?.supplierOrder.supplier.products.name}
                                    </Text>
                                    <Text style={[styles.tableCol, { width: "20%" }, { textAlign: "right" }]}>
                                        {item.qty}
                                    </Text>
                                    <Text style={[styles.tableCol, { width: "20%" }, { textAlign: "right" }]}>
                                        {`${record?.factoryPrice?.price}`}
                                    </Text>
                                    <Text style={[styles.tableCol, { width: "30%" }, { textAlign: "right" }]}>
                                        {parseCurrency(item.qty * record?.factoryPrice?.price as number)}
                                    </Text>
                                </View>
                            );
                        })}
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, { width: "30%" }, { textAlign: "center" }]}>
                                Jumlah
                            </Text>
                            <Text style={[styles.tableCol, { width: "20%" }, { textAlign: "right" }]}>
                                {record?.vehicleOrders.reduce((prev: any, cur: any): any => {
                                    return prev + cur.qty;
                                }
                                    , 0)}
                            </Text>
                            <Text style={[styles.tableCol, { width: "20%" }]}>
                            </Text>
                            <Text style={[styles.tableCol, { width: "30%" }, { textAlign: "right" }, { fontWeight: "extrabold" }]}>
                                {parseCurrency(record?.vehicleOrders.reduce((prev: any, cur: any): any => {
                                    return prev + cur.qty * record?.factoryPrice?.price as number;
                                }, 0) as number, "currency")}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.signatureTotalContainer}>
                        <View style={styles.signatureContainer}>
                            <Text style={styles.signatureText}>Signature: ________________</Text>
                            <Text style={styles.signatureText}>Date:
                                {/* {record?.date.toString()} */}
                            </Text>
                        </View>

                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>DPP :  {parseCurrency(record?.vehicleOrders.reduce((prev: any, cur: any): any => {
                                return prev + cur.qty * record?.factoryPrice?.price as number;
                            }, 0) as number, "currency")}
                            </Text>
                            <Text style={styles.totalText}>PPH (0.25%): {parseCurrency(record!.invTotal * 0.025, "currency")}
                            </Text>
                            <Text style={styles.totalText}>PPN (11%): {record?.factory?.isPPN ? parseCurrency(record?.invTotal * 0.11, "currency") : "0"}
                            </Text>
                            <Text style={styles.totalText}>
                                Total:  {parseCurrency(record?.invTotal as number, "currency")}
                            </Text>
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