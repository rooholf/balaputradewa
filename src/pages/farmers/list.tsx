import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    HttpError,
} from "@refinedev/core";
import {
    List,
    useTable,
    DateField,
    BooleanField,
    ShowButton,
    useModalForm,
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

import { IFarmer, ISupplier, IUserFilterVariables } from "../../interfaces";
import TextArea from "antd/lib/input/TextArea";

export const FarmerList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, searchFormProps } = useTable<
        IFarmer,
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
    } = useModalForm<IFarmer>({
        action: "create",
        resource: "farmers",
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
                <Card title={t("farmers.filter.title")}>
                    <Filter formProps={searchFormProps} />
                </Card>
            </Col>

            <Col xl={18} xs={24}>
                <List
                    breadcrumb={null}
                    canCreate={true}
                    createButtonProps={{
                        onClick: () => {
                            createModalShow();
                        },
                    }}>
                    <Table {...tableProps} rowKey="id">
                        <Table.Column
                            key="phone"
                            dataIndex="phone"
                            title={t("farmers.fields.phone")}

                        />

                        <Table.Column
                            key="name"
                            dataIndex="name"
                            title={t("farmers.fields.name")}
                        />
                        <Table.Column
                            key="address"
                            dataIndex="address"
                            title={t("farmers.fields.address")}
                        />

                        <Table.Column
                            key="created_at"
                            dataIndex="created_at"
                            title={t("farmers.fields.createdAt")}
                            render={(value) => (
                                <DateField value={value} format="LLL" />
                            )}
                            sorter
                        />
                        <Table.Column<IFarmer>
                            fixed="right"
                            title={t("table.actions")}
                            render={(_, record) => (
                                <ShowButton hideText recordItemId={record.id} />
                            )}
                        />
                    </Table>
                </List>
                <Modal title="Create New Farmer" {...createModalProps} width={300} >
                    <Form {...createFormProps} onFinish={onFinishCreate}>
                        <Form.Item
                            label="Email"
                            name={"email"}
                            rules={[
                                {
                                    required: true,

                                },
                                {
                                    type: "email",
                                    message: "Email tidak valid!",
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Nama"
                            name={"name"}
                            rules={[
                                {
                                    required: true,

                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name={"phone"}
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    pattern: new RegExp(/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/),
                                    message: "No. Telpon tidak valid!",
                                }
                            ]}
                        >
                            <Input />
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
                    <Form.Item label={t("farmers.filter.search.label")} name="q">
                        <Input
                            placeholder={t("farmers.filter.search.placeholder")}
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={24} md={12}>
                    <Form.Item
                        label={t("farmers.filter.createdAt.label")}
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
                            {t("farmers.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
