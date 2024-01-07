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

import { IFactory, IUserFilterVariables } from "../../interfaces";
import React from "react";

export const FactoryList: React.FC<IResourceComponentsProps> = () => {



    const { tableProps, searchFormProps } = useTable<
        IFactory,
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
    });

    const t = useTranslate();





    const {
        modalProps: createModalProps,
        formProps: createFormProps,
        show: createModalShow,
        close,
        onFinish: onFinishCreateModal // This is the onFinish function for the modal form
    } = useModalForm<IFactory>({
        action: "create",
        resource: "factories",
        invalidates: ["all"],
        redirect: "show",
        warnWhenUnsavedChanges: false,
    });

    const onFinishCreate = (values: any) => {
        onFinishCreateModal({
            code: values.code,
            name: values.name,
            price: values.price,
            isPPN: values.isPPN ? true : false,
        });

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
                            key="code"
                            dataIndex="code"
                            title={t("factory.fields.code")}
                        />
                        <Table.Column
                            key="name"
                            dataIndex="name"
                            title={t("factory.fields.name")}
                        />


                        <Table.Column
                            key="created_at"
                            dataIndex="created_at"
                            title={t("factory.fields.createdAt")}
                            render={(value) => (
                                <DateField value={value} format="LLL" />
                            )}
                            sorter
                        />
                        <Table.Column<IFactory>
                            fixed="right"
                            title={t("table.actions")}
                            render={(_, record) => (
                                <ShowButton hideText recordItemId={record.id} />
                            )}
                        />
                    </Table>
                </List>

                <Modal title="Create New Factory" {...createModalProps} width={300} >
                    <Form {...createFormProps} onFinish={onFinishCreate}>
                        <Form.Item
                            label="Factory Code"
                            name={"code"}
                            rules={
                                [
                                    {
                                        required: true,
                                    },
                                    {
                                        min: 3,
                                    }
                                ]
                            }>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Factory Name"
                            name={"name"}
                            rules={
                                [
                                    {
                                        required: true,
                                    },
                                    {
                                        min: 3,
                                        max: 30,
                                    }
                                ]
                            }>
                            <Input />
                        </Form.Item>
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
