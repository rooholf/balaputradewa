import { useTranslate } from "@refinedev/core";
import { Tag } from "antd";

type OrderStatusProps = {
    status: "Pending" | "Transfer" | "Debit" | "Paid" | "Credit" | "Saving" | "Loan" | "Saving Withdrawal" | "Loan Payment" | "Expense";
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
    const t = useTranslate();
    let color;

    switch (status) {
        case "Pending":
            color = "orange";
            break;
        case "Transfer":
            color = "cyan";
            break;
        case "Debit":
            color = "green";
            break;
        case "Paid":
            color = "blue";
            break;
        case "Credit":
            color = "red";
            break;
        case "Saving":
            color = "purple";
            break;
        case "Loan":
            color = "gold";
            break;
        case "Saving Withdrawal":
            color = "lime";
            break;
        case "Loan Payment":
            color = "magenta";
            break;
        case "Expense":
            color = "red";
            break;
    }

    return <Tag color={color}>{t(`enum.orderStatuses.${status}`)}</Tag>;
};
