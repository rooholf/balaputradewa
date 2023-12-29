import React from "react";
import { BaseRecord, IResourceComponentsProps, useApiUrl, useCustomMutation, useInvalidate, useTranslate } from "@refinedev/core";
import { Create, CreateButton, SaveButton, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Select, Card, Space, Button, notification } from "antd";
import dayjs from "dayjs";
import { IBankAccount, IFactory, IFactoryOrderForm, IVehicle } from "../../interfaces";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export const CreateFactoryOrder: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const apiUrl = useApiUrl();
    const { formProps, saveButtonProps, } = useForm();

    const { selectProps: factorySelectProps, queryResult: factoryQueryResult } = useSelect({
        resource: "factories",
    });

    const { selectProps: vehicleSelectProps, queryResult: vehicleQueryResult } = useSelect({
        resource: "vehicles",
    });

    const { selectProps: bankSelectProps, queryResult: bankQueryResult } = useSelect<IBankAccount>({
        resource: "bank",
    });

    const bankOptions = bankQueryResult?.data?.data?.map((item: IBankAccount) => ({
        label: `${item.bankName} - ${item.accountName} - ${item.accountNumber}`,
        value: item.id,
    }));

    const factoryOptions = factoryQueryResult?.data?.data?.map((item: BaseRecord) => ({
        label: `${item.code} -${item.name}`,
        value: item.id,
    }));


    const vehicleOptions = vehicleQueryResult?.data?.data?.map((item: BaseRecord) => ({
        label: `${item.plate} - ${item.brand} - ${item.color}`,
        value: item.id,
    }));



    const invalidate = useInvalidate();

    const { mutate } = useCustomMutation<IFactoryOrderForm>();

    const handleFinish = (values: any) => {
        mutate(
            {
                url: apiUrl + '/invoices/factory',
                method: "post",
                values: {
                    factoryId: values.factoryId,
                    vehicleOrders: values.vehicleOrders.map((item: any) => ({
                        vehicleId: item.vehicleId,
                        qty: parseInt(item.qty),
                    })),
                    bankAccountId: values.bankAccountId,
                    transactionDate: values.transactionDate,
                    noRef: values.noRef,
                },
            },
            {
                onSuccess(data) {
                    data.data &&
                        notification.success({
                            message: "Success",
                            description: "Invoice has been created",
                        });
                    invalidate({
                        resource: "recentOrders",
                        invalidates: ["list"],
                    });
                },
            }
        );
    };




    return (
        < >
            <Form {...formProps} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label={translate("factory.fields.factory")}
                    name={"factoryId"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...factorySelectProps} options={factoryOptions} />
                </Form.Item>

                <Form.Item
                    label={"Transaction Date"}
                    name={"transactionDate"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : undefined,
                    })}
                >
                    <DatePicker />
                </Form.Item>

                <Form.List name="vehicleOrders">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, index) => (
                                <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        style={{ width: 200 }}
                                        {...field}
                                        label="Vehicle"
                                        name={[field.name, "vehicleId"]}
                                        rules={[{ required: true, message: "Please select a vehicle" }]}
                                    >
                                        <Select {...vehicleSelectProps} options={vehicleOptions} />
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        style={{ width: 100 }}
                                        label="Quantity"
                                        name={[field.name, "qty"]}
                                        rules={[{ required: true, message: "Please input the quantity" }]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                    {index > 0 && (
                                        <MinusCircleOutlined onClick={() => remove(field.name)} style={{ marginLeft: 8 }} />
                                    )}
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Vehicle Order
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item
                    label={"No. Ref"}
                    name={"noRef"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* <Form.Item
                    label={"vehicleOrders"}
                    name={["vehicle", "id"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...vehicleSelectProps} options={vehicleOptions} />
                </Form.Item> */}


                <Form.Item
                    label={"Bank Account"}
                    name={"bankAccountId"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...bankSelectProps} options={bankOptions} />
                </Form.Item>
                <Space style={{ marginTop: "20px" }} >
                    <CreateButton {...saveButtonProps} />
                </Space>
            </Form>

        </>
    );
};
