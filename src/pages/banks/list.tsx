import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    HttpError,
    BaseRecord,
} from "@refinedev/core";
import {
    List,
    useTable,
    DateField,
    BooleanField,
    ShowButton,
    useModalForm,
    useSelect,
    NumberField,
} from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import {
    Table,
    Avatar,
    Card,
    Input,
    Form,
    DatePicker,
    Button,
    Select,
    FormProps,
    Row,
    Col,
    Modal,
    InputNumber,
    Switch,
} from "antd";

import { IBankAccount, IUserFilterVariables } from "../../interfaces";
import React from "react";

export const BankList: React.FC<IResourceComponentsProps> = () => {



    const { tableProps, searchFormProps } = useTable<
        IBankAccount,
        HttpError,
        IUserFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "asc",
            },
        ],
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { q, status, created_at, gender, isActive } = params;

            filters.push({
                field: "q",
                operator: "eq",
                value: q,
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

            filters.push({
                field: "gender",
                operator: "eq",
                value: gender,
            });

            filters.push({
                field: "isActive",
                operator: "eq",
                value: isActive,
            });

            filters.push({
                field: "status.text",
                operator: "eq",
                value: status,
            });

            return filters;
        },
        syncWithLocation: false,
        pagination: {
            mode: "client",
            pageSize: 8
        },
    });

    const t = useTranslate();


    const {
        modalProps: createModalProps,
        formProps: createFormProps,
        show: createModalShow,
        close,
        onFinish: onFinishCreateModal // This is the onFinish function for the modal form
    } = useModalForm<IBankAccount>({
        action: "create",
        resource: "bank",
        invalidates: ["all"],
        redirect: "show",
        warnWhenUnsavedChanges: false,
    });

    const onFinishCreate = (values: any) => {
        onFinishCreateModal(values);
        close();
    }


    return (
        <Row gutter={[16, 16]}>
            <Col
                xl={6}
                lg={24}
                xs={24}
                style={{
                    marginTop: "48px",
                }}
            >
                <Card title={t("factory.filter.title")}>
                    <Filter formProps={searchFormProps} />
                </Card>
            </Col>

            <Col xl={18} xs={24}>
                <List
                    createButtonProps={{
                        onClick: () => {
                            createModalShow();
                        },
                    }}
                    canCreate={true}
                    breadcrumb={null}
                >
                    <Table {...tableProps} rowKey="id" >
                        <Table.Column
                            key="accountName"
                            dataIndex="accountName"
                            title={t("Nama Di Rekening")}
                        />
                        <Table.Column
                            key="accountNumber"
                            dataIndex="accountNumber"
                            title={t("No. Rekening")}
                        />
                        <Table.Column
                            key="bankName"
                            dataIndex="bankName"
                            title={t("Nama Bank")}
                        />
                        <Table.Column
                            key="balance"
                            dataIndex="balance"
                            title={t("Saldo")}
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

                        <Table.Column<IBankAccount>
                            fixed="right"
                            title={t("table.actions")}
                            render={(_, record) => (
                                <ShowButton hideText recordItemId={record.id} />
                            )}
                        />
                    </Table>
                </List>

                <Modal {...createModalProps} width={300} >
                    <Form {...createFormProps} onFinish={onFinishCreate}>
                        <Form.Item
                            label="Nama Bank"
                            name={"bankName"}
                            rules={
                                [
                                    {
                                        required: true,
                                    },

                                ]
                            }>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="No. Rekening"
                            name={"accountNumber"}
                            rules={
                                [
                                    {
                                        required: true,
                                    },

                                ]
                            }>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Nama Di Rekening"
                            name={"accountName"}
                            rules={
                                [
                                    {
                                        required: true,
                                    },
                                ]
                            }>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Saldo Awal" name="balance">
                            <InputNumber addonBefore="Rp" />
                        </Form.Item>

                    </Form>
                </Modal>
            </Col>
        </Row>
    );
};

const Filter: React.FC<{ formProps: FormProps }> = (props) => {
    const t = useTranslate();

    const { RangePicker } = DatePicker;

    return (
        <Form layout="vertical" {...props.formProps}>
            <Row gutter={[10, 0]} align="bottom">
                <Col xs={24} xl={24} md={12}>
                    <Form.Item label={t("factory.filter.search.label")} name="q">
                        <Input
                            placeholder={t("factory.filter.search.placeholder")}
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={24} md={12}>
                    <Form.Item
                        label={t("factory.filter.createdAt.label")}
                        name="createdAt"
                    >
                        <RangePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={24} md={8}>
                    <Form.Item>
                        <Button
                            style={{ width: "100%" }}
                            htmlType="submit"
                            type="primary"
                        >
                            {t("factory.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
