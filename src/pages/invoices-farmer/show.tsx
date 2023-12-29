import React from "react";
import {
    IResourceComponentsProps,
    useShow,
    useTranslate,
} from "@refinedev/core";
import {
    Show,
    NumberField,
    TextField,
    DateField,
} from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const SupplierInvoiceShow: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>{translate("supplier.fields.id")}</Title>
            <NumberField value={record?.id ?? ""} />
            <Title level={5}>{translate("supplier.fields.invCode")}</Title>
            <TextField value={record?.invCode} />
            <Title level={5}>{translate("supplier.fields.invTotal")}</Title>
            <NumberField value={record?.invTotal ?? ""} />
            <Title level={5}>{translate("supplier.fields.invDate")}</Title>
            <DateField value={record?.invDate} />
            <Title level={5}>{translate("supplier.fields.supplier")}</Title>
            <TextField value={record?.supplier?.name} />
            <Title level={5}>{translate("supplier.fields.qty")}</Title>
            <NumberField value={record?.qty ?? ""} />
        </Show>
    );
};
