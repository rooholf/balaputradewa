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
} from "antd";

import { ISupplier, IUserFilterVariables, IVehicle } from "../../interfaces";

export const VehicleList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, searchFormProps } = useTable<
        IVehicle,
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


    const { selectProps: supplierSelectProps, queryResult: supplierQueryResult } = useSelect({
        resource: "suppliers",
    });

    const supplierOptions = supplierQueryResult?.data?.data?.map((item: BaseRecord) => ({
        label: `${item.code} -${item.name}`,
        value: item.id,
    }));


    const {
        modalProps: createModalProps,
        formProps: createFormProps,
        show: createModalShow,
        close,
        onFinish: onFinishCreateModal // This is the onFinish function for the modal form
    } = useModalForm<ISupplier>({
        action: "create",
        resource: "vehicles",
        invalidates: ["all"],
        redirect: false,
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
                <Card title={t("vehicles.filter.title")}>
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
                    <Table {...tableProps} rowKey="id">

                        <Table.Column
                            key="plate"
                            dataIndex="plate"
                            title={t("vehicles.fields.plate")}
                        />
                        <Table.Column
                            key="color"
                            dataIndex="color"
                            title={t("vehicles.fields.color")}
                        />
                        <Table.Column
                            key="brand"
                            dataIndex="brand"
                            title={t("vehicles.fields.brand")}
                        />
                        <Table.Column
                            key="chassis"
                            dataIndex="chassis"
                            title={t("vehicles.fields.chassis")}
                        />
                        <Table.Column
                            key="created_at"
                            dataIndex="created_at"
                            title={t("vehicles.fields.createdAt")}
                            render={(value) => (
                                <DateField value={value} format="LLL" />
                            )}
                            sorter
                        />
                        <Table.Column<ISupplier>
                            fixed="right"
                            title={t("table.actions")}
                            render={(_, record) => (
                                <ShowButton hideText recordItemId={record.id} />
                            )}
                        />
                    </Table>
                </List>
                <Modal title="Create New Vehicle" {...createModalProps} width={300} >
                    <Form {...createFormProps} onFinish={onFinishCreate}>
                        <Form.Item
                            label="Plate"
                            name={"plate"}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Brand"
                            name={"brand"}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Color"
                            name={"color"}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Chassis"
                            name={"chassis"}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Supplier"
                            name={'supplierId'}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select {...supplierSelectProps} options={supplierOptions} />
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
                    <Form.Item label={t("vehicles.filter.search.label")} name="q">
                        <Input
                            placeholder={t("vehicles.filter.search.placeholder")}
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={24} md={12}>
                    <Form.Item
                        label={t("vehicles.filter.createdAt.label")}
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
                            {t("vehicles.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
