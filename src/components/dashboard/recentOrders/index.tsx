import { useNavigation, useTranslate } from "@refinedev/core";
import { DateField, useDrawerForm, useTable } from "@refinedev/antd";
import { Typography, Table, Avatar, Space, Tag } from "antd";
import {
    RecentOrdersColumn,
    Price,
    OrderId,
    Title,
    TitleWrapper,
} from "./styled";

import { OrderActions, OrderStatus } from "../../../components";

import { IOrder } from "../../../interfaces";
import { EditOrder } from "../../editOrder";

const { Text, Paragraph } = Typography;



export const RecentOrders: React.FC = () => {
    const t = useTranslate();
    const { tableProps, tableQueryResult } = useTable<IOrder>({
        resource: "recentOrders",
        initialSorter: [
            {
                field: "created_at",
                order: "desc",
            },
        ],
        initialPageSize: 4,
        permanentFilter: [
            {
                field: "_status",
                operator: "eq",
                value: "Pending",
            },
        ],
        syncWithLocation: false,

    });

    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
        id: editId,
    } = useDrawerForm<IOrder>({
        action: "create",
        resource: "recentOrders",
        redirect: "list",
        invalidates: ["all"],
        warnWhenUnsavedChanges: false,
    });

    return (<>
        <Table
            {...tableProps}
            pagination={{ ...tableProps.pagination, simple: true }}
            showHeader={false}
            rowKey="id"
            onRow={(record) => ({
                onClick: () => {
                    editShow(record.invCode);
                },
            })
            }
        >
            <RecentOrdersColumn
                key="summary"
                render={(_, record) => (
                    <TitleWrapper>
                        <Title strong><DateField value={record?.invDate} format="LLL" /></Title>
                        <Paragraph
                            ellipsis={{
                                rows: 2,
                                tooltip: record.invDate,
                                symbol: <span>...</span>,
                            }}
                        >
                            {record.supplier?.name}
                        </Paragraph>
                        <Paragraph
                            ellipsis={{
                                rows: 2,
                                tooltip: record.invDate,
                                symbol: <span>...</span>,
                            }}
                            style={{ fontSize: "12px" }}
                        >
                            {record.invCode}
                        </Paragraph>
                    </TitleWrapper>
                )}
            />
            <RecentOrdersColumn
                key="summary"
                render={(_, record) => (
                    <Space direction="vertical">
                        <Title
                            strong
                        >Quantity</Title>
                        <Text>{parseInt(record.qty)} Kg</Text>
                    </Space>
                )}
            />
            <Table.Column<IOrder>
                dataIndex="amount"
                render={(value, record) => (
                    <Space
                        size="large"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Price
                            strong
                            options={{
                                currency: "IDR",
                                style: "currency",
                                notation: "standard",
                                maximumFractionDigits: 0,
                            }}
                            value={record.invTotal}
                        />

                        <OrderStatus status={record.status as "Pending" | "Paid" | "Saving" | "Saving Withdrawal" | "Loan" | "Loan Payment" | "Transfer" | "Debit" | "Credit"} />

                    </Space>
                )}
            />
            <Table.Column<IOrder>
                fixed="right"
                key="actions"
                align="center"
                render={(_, record) => <OrderActions record={record} editShow={editShow} />}
            />
        </Table>
        <EditOrder
            drawerProps={editDrawerProps}
            formProps={editFormProps}
            saveButtonProps={editSaveButtonProps}
            editId={editId}
            isRecentOrders={true}
            tableQueryResult={tableQueryResult}
        />
    </>

    );
};
