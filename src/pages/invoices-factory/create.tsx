import React, { useEffect, useMemo, useState } from "react";
import { BaseRecord, IResourceComponentsProps, useApiUrl, useCustom, useCustomMutation, useInvalidate, useNavigation, useTranslate } from "@refinedev/core";
import { Create, CreateButton, NumberField, SaveButton, useForm, useModalForm, useSelect, useStepsForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Select, Card, Space, Button, notification, InputNumber, Modal, Switch, Steps, Typography, Table, Col, Row } from "antd";
import dayjs from "dayjs";
import { IBankAccount, IFactory, IFactoryOrderForm, IPrice, IVehicle } from "../../interfaces";
import { MinusCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Price } from "../../components/dashboard/recentOrders/styled";
import form from "antd/lib/form";

// Define a separate component to display the selected factory price
const SelectedFactoryPrice = ({ selectedFactoryPrice }: { selectedFactoryPrice: number }) => {
    return (
        <div>
            Factory Price: <NumberField value={selectedFactoryPrice} options={{
                currency: "IDR",
                style: "currency",
                maximumFractionDigits: 0,
            }} />
        </div>
    );
};

export const InvoiceCreate: React.FC<IResourceComponentsProps> = () => {

    const translate = useTranslate();
    const apiUrl = useApiUrl();

    const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);

    // Declare a new state variable at the beginning of your component
    const [selectedFactoryPrice, setSelectedFactoryPrice] = useState(0);


    const {
        modalProps: createModalProps,
        formProps: createFormProps,
        show: createModalShow,
        close,
        onFinish: onFinishCreateModal // This is the onFinish function for the modal form
    } = useModalForm<IVehicle>({
        action: "create",
        resource: "vehicles",
        invalidates: ["all"],
        redirect: false,
        warnWhenUnsavedChanges: false,
    });


    const {
        current,
        gotoStep,
        stepsProps,
        formProps,
        saveButtonProps,
        queryResult,
        onFinish,
        form: { getFieldValue, setFieldsValue },
    } = useStepsForm<IFactoryOrderForm>({
        action: "create",
        resource: "invoices/factory",
        warnWhenUnsavedChanges: false,
        invalidates: ["list"],
        redirect: "list",
        submit: (values) => {
            onFinish({
                factoryId: values.factoryId,
                vehicleOrders: (values.vehicleOrders as any[]).map((item: any) => ({
                    vehicleId: item.vehicleId,
                    qty: parseInt(item.qty),
                })),
                transactionDate: values.transactionDate,
                noRef: values.noRef,
            });
            saveButtonProps.loading = true;
        },
    });



    const { selectProps: vehicleSelectProps, queryResult: vehicleQueryResult, } = useSelect({
        resource: "vehicles",
        debounce: 100,
        onSearch: (value) => [
            {
                field: "q",
                operator: "eq",
                value,
            },
        ],
    });
    const selectedVehicleObjects = selectedVehicles.map((id) => {
        const vehicle = vehicleQueryResult?.data?.data?.find((item: BaseRecord) => item.id === id);
        return { id, vehicle };
    });



    const { selectProps: supplierSelectProps, queryResult: supplierQueryResult, } = useSelect({
        resource: "suppliers",
    });

    const { selectProps: bankSelectProps, queryResult: bankQueryResult } = useSelect<IBankAccount>({
        resource: "bank",
    });

    const bankOptions = bankQueryResult?.data?.data?.map((item: IBankAccount) => ({
        label: `${item.bankName} - ${item.accountName} - ${item.accountNumber}`,
        value: item.id,
    }));

    const { selectProps: factorySelectProps, queryResult: factoryQueryResult } = useSelect({
        resource: "factories",
    });

    const factoryOptions = factoryQueryResult?.data?.data?.map((item: BaseRecord) => ({
        label: `${item.code} - ${item.name}`,
        value: item.id,
    }));

    const supplierOptions = supplierQueryResult?.data?.data?.map((item: BaseRecord) => ({
        label: `${item.code} - ${item.name}`,
        value: item.id,
    }));

    const vehicleOptions = vehicleQueryResult?.data?.data?.map((item: BaseRecord) => ({
        label: `${item.plate} - ${item.brand} - ${item.color}`,
        value: item.id,
    }));


    const { goBack } = useNavigation();
    const handleFinish = async (values: any) => {

    };

    const invalidate = useInvalidate();

    const onFinishCreate = async (values: any) => {
        await onFinishCreateModal({
            plate: values.plate,
            brand: values.brand,
            color: values.color,
            chassis: values.chassis,
            supplierId: values.supplierId,
        });
        invalidate({
            resource: `vehicles`,
            invalidates: ['all'],
        })
        close();
    };


    const handleChange = (value: any, index: number) => {
        const updatedSelectedVehicles = [...selectedVehicles];
        updatedSelectedVehicles[index] = value as unknown as number;
        setSelectedVehicles(updatedSelectedVehicles);
    };

    const handleClear = (index: number) => {
        const updatedSelectedVehicles = [...selectedVehicles];
        updatedSelectedVehicles[index] = 0;
        setSelectedVehicles(updatedSelectedVehicles);
    };
    const handleQuantityChange = (index: number, qty: number) => {
        const vehicleOrders = getFieldValue('vehicleOrders');
        vehicleOrders[index].qty = qty;
        vehicleOrders[index].price = selectedVehicleObjects[index]?.vehicle?.price?.price || 0;
        setFieldsValue({ vehicleOrders });
    };

    const handlePriceChange = (index: number, price: number) => {
        const vehicleOrders = getFieldValue('vehicleOrders');
        vehicleOrders[index].price = price;
        setFieldsValue({ vehicleOrders });
    }

    const columns = [

        {
            title: 'Vehicle',
            dataIndex: 'vehicle',
            key: 'vehicle',
            render: (text: any, record: any) => `${record.vehicle.brand} - ${record.vehicle.color} - ${record.vehicle.plate}`,
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
            render: (text: any, record: any) => `${record.vehicle.supplier.name}`,
        },

        {
            title: 'Supplier Price',
            dataIndex: 'price',
            key: 'price',
            render: (text: any, record: any) => (
                <NumberField
                    options={{
                        currency: "IDR",
                        style: "currency",
                        maximumFractionDigits: 0,
                    }}
                    value={record.vehicle.price.price}
                />
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'qty',
            key: 'qty',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (text: any, record: any) => (
                <NumberField
                    options={{
                        currency: "IDR",
                        style: "currency",
                        maximumFractionDigits: 0,
                    }}
                    value={record.vehicle.price.price * record.qty}
                />
            ),
        }
    ];

    const formList = [
        <>
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

            <Form.Item
                label={translate("factory.fields.factory")}
                name={"factoryId"}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select
                    allowClear
                    {...factorySelectProps}
                    options={factoryOptions}
                    onChange={(value) => {
                        const factory = factoryQueryResult?.data?.data?.find((item: BaseRecord) => item.id ?? item.id === value);

                        // Get the selected date
                        const selectedDate = getFieldValue('date'); // Replace 'date' with the name of your date field

                        // Try to find a price for the selected date
                        const priceForSelectedDate = factory?.prices.find((price: IPrice) => new Date(price.created_at).toDateString() === new Date(selectedDate).toDateString());

                        // If no price is found for the selected date, use the latest price
                        const latestPrice = priceForSelectedDate ?? factory?.prices.reduce((prev: IPrice, current: IPrice) => (prev.id > current.id) ? prev : current);

                        const price = latestPrice?.price;
                        setFieldsValue({ selectedFactoryPrice: price });
                        setSelectedFactoryPrice(price); // Update the state variable
                    }
                    } />
            </Form.Item>

            <Form.Item
                name={"selectedFactoryPrice"}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <SelectedFactoryPrice selectedFactoryPrice={selectedFactoryPrice} />
            </Form.Item>
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

        </>,
        <>
            <Form.List name="vehicleOrders" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, index) => (
                            <Space key={`vehicleOrder-${index}`} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    style={{ width: 200 }}
                                    {...field}
                                    label="Vehicle"
                                    name={[field.name, "vehicleId"]}
                                    rules={[{ required: true, message: "Please select a vehicle" }]}
                                    key={`vehicleId-${index}`} // Unique key for vehicleId field
                                >
                                    <Select
                                        allowClear
                                        {...vehicleSelectProps}
                                        options={vehicleOptions}
                                        onChange={(value) => {
                                            if (value !== undefined && value !== null) {
                                                handleChange(value, index);
                                            }
                                        }}
                                        onClear={() => {
                                            handleClear(index);
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    style={{ width: 120 }}
                                    label="Quantity"
                                    name={[field.name, "qty"]}
                                    rules={[{ required: true, message: "Please input the quantity" }]}
                                    key={`qty-${index}`} // Unique key for qty field

                                >
                                    <InputNumber
                                        addonAfter="Kg"
                                        type="number"
                                        min={1}
                                        onChange={(value) => handleQuantityChange(index, value ?? 0)}
                                    />
                                </Form.Item>

                                <Form.Item label="Price" name={[field.name, 'price']}>
                                    <Typography.Text>
                                        <NumberField
                                            options={{
                                                currency: "IDR",
                                                style: "currency",
                                                maximumFractionDigits: 0,
                                            }}
                                            onChange={(value) => {
                                                handlePriceChange(index, Number(value) || 0);
                                            }}
                                            value={selectedVehicleObjects[index]?.vehicle ? selectedVehicleObjects[index]?.vehicle?.price?.price : 0}
                                        />
                                    </Typography.Text>
                                </Form.Item>
                                <Form.Item label="Total" name={[field.name, 'total']}>
                                    <Typography.Text>
                                        <NumberField
                                            options={{
                                                currency: "IDR",
                                                style: "currency",
                                                maximumFractionDigits: 0,
                                            }}
                                            onChange={(value) => {
                                                const vehicleOrders = getFieldValue("vehicleOrders");
                                                vehicleOrders[index].total = value;
                                                setFieldsValue({ vehicleOrders });
                                            }}
                                            value={(selectedVehicleObjects[index]?.vehicle?.price?.price || 0) * (getFieldValue(['vehicleOrders', index, 'qty']) || 0)}
                                        />
                                    </Typography.Text>
                                </Form.Item>


                                {index > 0 && (
                                    <Form.Item label="  ">
                                        <Button type="dashed" danger onClick={() => remove(field.name)} icon={<MinusOutlined />} style={{ marginLeft: 8 }} key={`remove-${index}`} >
                                            Remove Vehicle
                                        </Button>
                                    </Form.Item>
                                )}
                                {index === fields.length - 1 &&
                                    (<Form.Item
                                        label="  "
                                    >
                                        <Button type="primary" onClick={() => createModalShow()} icon={<PlusOutlined />} key="add-vehicle-order" style={{ marginLeft: 8 }}>
                                            Add new Vehicle
                                        </Button>
                                    </Form.Item>)}

                            </Space>
                        ))}

                        <Form.Item>
                            <Button type="dashed" onClick={() => {
                                add({ vehicleId: 0, qty: 1, price: 0, total: 0 });
                                const updatedSelectedVehicles = [...selectedVehicles];
                                updatedSelectedVehicles.push(0);
                                setSelectedVehicles(updatedSelectedVehicles);
                            }} block icon={<PlusOutlined />}>
                                Add field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            {/* <Form.Item
                label={"Bank Account"}
                name={"bankAccountId"}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select {...bankSelectProps} options={bankOptions} />
            </Form.Item> */}
            <Modal title="Create New Vehicle" {...createModalProps} width={300} >
                <Form {...createFormProps} onFinish={onFinishCreate}>
                    <Form.Item
                        label="Plate"
                        name={"plate"}
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
                        label="Brand"
                        name={"brand"}
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
                        label="Color"
                        name={"color"}
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
                        label="Chassis"
                        name={"chassis"}
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
                        label="Supplier"
                        name={'supplierId'}
                        rules={
                            [
                                {
                                    required: true,
                                },
                            ]
                        }>
                        <Select allowClear {...supplierSelectProps} options={supplierOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </>,
        <>
            <Typography.Title level={4}>Invoice Summary</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <Typography.Text>Factory</Typography.Text>
                    <br />
                    <Typography.Text>No. Ref</Typography.Text>
                    <br />
                    <Typography.Text>Transaction Date</Typography.Text>
                    <br />
                    {/* <Typography.Text>Bank Account</Typography.Text> */}
                    <br />
                </Col>
                <Col span={7}>
                    <Typography.Text strong>
                        : {getFieldValue('factoryId') && factoryOptions?.find((item) => item.value === getFieldValue('factoryId'))?.label}
                    </Typography.Text>
                    <br />
                    <Typography.Text >
                        : {getFieldValue('noRef')}
                    </Typography.Text>
                    <br />
                    <Typography.Text >
                        : {getFieldValue('transactionDate')?.format("DD MMM YYYY")}
                    </Typography.Text>
                    <br />
                    {/* <Typography.Text >
                        : {getFieldValue('bankAccountId') && bankOptions?.find((item) => item.value === getFieldValue('bankAccountId'))?.label}
                    </Typography.Text> */}
                    <br />
                </Col>
            </Row>

            <Table
                style={{ marginTop: 20 }}
                dataSource={
                    getFieldValue('vehicleOrders')
                        ? getFieldValue('vehicleOrders').map((order: any, index: any) => ({
                            key: index,
                            vehicle: selectedVehicleObjects[index]?.vehicle,
                            qty: order.qty,
                        }))
                        : []
                }
                columns={columns}
                pagination={false}
            />

            <Row justify="end" style={{ marginTop: 10 }}>
                <Col span={2}>
                    <Typography.Text>
                        Total Quantity
                    </Typography.Text>
                </Col>
                <Col span={3}>
                    <Typography.Text strong>
                        : {"  "} <NumberField
                            options={{
                                maximumFractionDigits: 0,
                            }}
                            value={getFieldValue('vehicleOrders')?.reduce((total: number, item: any) => total + item.qty, 0) || 0}
                        />
                    </Typography.Text>
                </Col>
                <Col span={5}>
                    <Typography.Text>
                        Total Price
                    </Typography.Text>
                    <Typography.Text strong>
                        : {"  "} <NumberField
                            options={{
                                currency: "IDR",
                                style: "currency",
                                maximumFractionDigits: 0,
                            }}
                            value={getFieldValue('vehicleOrders')?.reduce((total: number, item: any) => {
                                return total + (item.qty * item.price);
                            }, 0) || 0}
                        />
                    </Typography.Text>
                </Col>
            </Row>
        </>,
    ]


    return (
        <>
            <Create
                isLoading={queryResult?.isFetching}
                title={"Create New Factory Invoice"}
                footerButtons={
                    <>
                        {current > 0 && (
                            <Button
                                onClick={() => {
                                    gotoStep(current - 1);
                                }}
                            >
                                {translate("buttons.previousStep")}
                            </Button>
                        )}
                        {current < formList.length - 1 && (
                            <Button
                                onClick={() => {
                                    gotoStep(current + 1);
                                }}
                            >
                                {translate("buttons.nextStep")}
                            </Button>
                        )}
                        {current === formList.length - 1 && (
                            <SaveButton
                                style={{ marginRight: 10 }}
                                {...saveButtonProps}
                            />
                        )}
                    </>
                }
            >
                <Steps {...stepsProps} responsive>
                    <Steps.Step title={translate("Factory Data")} />
                    <Steps.Step title={translate("Transaction Data")} />

                    <Steps.Step title={translate("Summary")} />
                </Steps>
                <Form
                    {...formProps}
                    style={{ marginTop: 30 }}
                    layout="vertical"
                >
                    {formList[current]}
                </Form>
            </Create>
        </>
    );
};
