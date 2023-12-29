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
    EditButton,
    NumberField,
} from "@refinedev/antd";
import { CheckOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
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

import { IFarmer, ISupplier, IUserFilterVariables } from "../../interfaces";
import React from "react";
import TextArea from "antd/lib/input/TextArea";

export const SupplierList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, searchFormProps } = useTable<
        ISupplier,
        HttpError,
        IUserFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
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


    const { selectProps: factorySelectProps, queryResult: factoryQueryResult } = useSelect({
        resource: "factories",
    });

    const factoryOptions = factoryQueryResult?.data?.data?.map((item: BaseRecord) => ({
        label: `${item.code} - ${item.name}`,
        value: item.id,

    }));

    const { selectProps: productSelectProps, queryResult: productQueryResult } = useSelect({
        resource: "products",
    });

    const productOptions = productQueryResult?.data?.data?.map((item: BaseRecord) => ({
        label: `${item.code} - ${item.name}`,
        value: item.id,

    }));


    //// Create Modal
    const {
        modalProps: createModalProps,
        formProps: createFormProps,
        show: createModalShow,
        close,
        onFinish: onFinishCreateModal // This is the onFinish function for the modal form
    } = useModalForm<ISupplier>({
        action: "create",
        resource: "suppliers",
        invalidates: ["all"],
        redirect: "show",
        warnWhenUnsavedChanges: false,
        id: undefined,
    });

    const onFinishCreate = (values: any) => {
        onFinishCreateModal(values);
        close();
    }

    //// Edit Modal
    const {
        modalProps: editModalProps,
        formProps: editFormProps,
        show: editModalShow,
        close: editModalClose,
        onFinish: onFinishEditModal,
    } = useModalForm<ISupplier>({
        action: "edit",
        resource: "suppliers",
        invalidates: ["all"],
        redirect: false,
        warnWhenUnsavedChanges: false,
    });

    const onFinishEdit = (values: any) => {
        onFinishEditModal(values);
        editModalClose();
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
                <Card title={t("farmers.filter.title")}>
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
                        {/* <Table.Column
                            align="center"
                            key="avatar"
                            dataIndex={["avatar"]}
                            title={t("users.fields.avatar.label")}
                            render={(value) => <Avatar src={value[0].url} />}
                        /> */}
                        <Table.Column
                            key="code"
                            dataIndex="code"
                            title={t("suppliers.fields.code")}
                        />
                        <Table.Column
                            key="name"
                            dataIndex="name"
                            title={t("suppliers.fields.name")}
                        />
                        <Table.Column
                            key="lastCreatedPrice"
                            dataIndex="lastCreatedPrice"
                            title={t("Current Price")}
                            render={(value) => {
                                return (
                                    value ?
                                        <NumberField
                                            options={{
                                                currency: "IDR",
                                                style: "currency",
                                            }}
                                            value={value?.price}
                                        />
                                        : <span> - </span>
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
                            title={t("suppliers.fields.createdAt")}
                            render={(value) => (
                                <DateField value={value} format="LLL" />
                            )}
                            sorter
                        />
                        <Table.Column<ISupplier>
                            fixed="right"
                            title={t("table.actions")}
                            render={(_, record) => (
                                <>
                                    <ShowButton hideText recordItemId={record.id} />
                                    <EditButton
                                        hideText
                                        recordItemId={record.id}
                                        onClick={() => {
                                            editModalShow(record.id);
                                            editFormProps.id = record.id as unknown as string;
                                        }}
                                        style={{ marginLeft: 10 }}
                                    />
                                </>
                            )}
                        />
                    </Table>
                </List>

                <Modal title="Create New Supplier" {...createModalProps} width={500} >
                    <Form {...createFormProps} onFinish={onFinishCreate}  >
                        <Form.Item
                            label="Code"
                            name={"code"}
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
                            label="Name"
                            name={"name"}
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
                            label="Product "
                            name={"productId"}
                            rules={
                                [
                                    {
                                        required: true,
                                    },
                                ]
                            }>
                            <Select {...productSelectProps} options={productOptions} />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name={"address"}
                            rules={
                                [
                                    {
                                        required: true,
                                    },
                                ]
                            }>
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            label={"Related Factory"}
                            name={"factoryId"}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select allowClear {...factorySelectProps} options={factoryOptions} />
                        </Form.Item>

                        <Form.Item label="Price" name="price">
                            <InputNumber addonBefore="Rp" />
                        </Form.Item>
                        <Form.Item label="Is PPN" name="isPPN">
                            <Switch />
                        </Form.Item>



                    </Form>
                </Modal>

                <Modal title="Edit Supplier" {...editModalProps} width={500} >
                    <Form {...editFormProps} onFinish={onFinishEdit}  >
                        <Form.Item
                            label="Supplier Code"
                            name={"code"}
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
                            label="Supplier Name"
                            name={"name"}
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
                            label={"Factory"}
                            name={"factoryId"}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select {...factorySelectProps} options={factoryOptions} />
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
                    <Form.Item label={t("suppliers.filter.search.label")} name="q">
                        <Input
                            placeholder={t("suppliers.filter.search.placeholder")}
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={24} md={12}>
                    <Form.Item
                        label={t("suppliers.filter.createdAt.label")}
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
                            {t("suppliers.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
