import { useTranslate, BaseKey, useInvalidate } from "@refinedev/core";
import { useDrawerForm, useSelect } from "@refinedev/antd";
import {
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Input,
    Select,
    ButtonProps,
    Typography,
    Grid,
    Button,
    DatePicker,
} from "antd";

import { IBankAccount } from "../../interfaces";
import dayjs from "dayjs";

const { Text } = Typography;

type EditOrderProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    editId?: BaseKey;
    isRecentOrders?: boolean;
    tableQueryResult?: any;
};

export const EditOrder: React.FC<EditOrderProps> = ({
    drawerProps,
    editId,
    isRecentOrders,
    tableQueryResult,
}) => {
    const t = useTranslate();
    const breakpoint = Grid.useBreakpoint();

    const { selectProps: categorySelectProps, queryResult } = useSelect<IBankAccount>({
        resource: "bank",
    });

    const options = queryResult?.data?.data?.map((item: IBankAccount) => ({
        label: `${item.bankName} - ${item.accountNumber} - ${item.accountName} `,
        value: item.id,
    }));

    const resource = "invoices/supplier/" + encodeURIComponent(String(editId))

    const {
        formProps,
        onFinish,
    } = useDrawerForm({
        action: "create",
        resource: resource,
        invalidates: ["list"],
        redirect: "show",
        warnWhenUnsavedChanges: false,
    });

    const invalidate = useInvalidate();


    const onFinishHandler = async (values: any) => {
        await onFinish(values);
        queryResult.refetch();
        tableQueryResult.refetch();
        invalidate({
            resource: 'invoices/supplier',
            invalidates: ["resourceAll"],
        })
        drawerProps.onClose?.({} as React.MouseEvent | React.KeyboardEvent) ?? (() => { });

    };

    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            zIndex={1001}
        >
            <Form {...formProps} layout="vertical" onFinish={onFinishHandler} resource={resource} >
                <Form.Item
                    label={t("orders.fields.invCode")}
                    initialValue={editId}
                >
                    <Input value={editId} disabled />
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
                <Form.Item
                    label={t("Bank Account")}
                    name={"bankAccountId"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...categorySelectProps} options={options} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>

        </Drawer>
    );
};