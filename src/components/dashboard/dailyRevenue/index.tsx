import { useMemo, useState } from "react";
import { useApiUrl, useCustom, useTranslate } from "@refinedev/core";
import { NumberField } from "@refinedev/antd";
import { TimeRangePickerProps, Typography } from "antd";
import { Line } from "@ant-design/charts";
import { LineConfig } from "@ant-design/plots/lib/components/line";
import dayjs, { Dayjs } from "dayjs";
import PresetDate from "antd/lib/calendar/index"; // Import PresetDate with default import syntax

import { IncreaseIcon, DecreaseIcon } from "../../../components/icons";

import { ISalesChart } from "../../../interfaces";
import {
    DailyRevenueWrapper,
    TitleAreNumber,
    TitleArea,
    TitleAreaAmount,
    RangePicker,
} from "./styled";

export const DailyRevenue: React.FC = () => {
    const t = useTranslate();
    const API_URL = useApiUrl();

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        dayjs().subtract(7, "days").startOf("day"),
        dayjs().startOf("day"),
    ]);
    const [start, end] = dateRange;

    const query = {
        start,
        end,
    };

    const url = `${API_URL}/dailyRevenue`;
    const { data, isLoading } = useCustom<{
        data: ISalesChart[];
        total: number;
        trend: number;
    }>({
        url,
        method: "get",
        config: {
            query,
        },
    });

    const config = useMemo(() => {
        const config: LineConfig = {
            data: data?.data.data || [],
            loading: isLoading,
            padding: "auto",
            xField: "date",
            yField: "value",
            color: "rgba(255, 255, 255, 0.5)",
            tooltip: {
                customContent: (_title: string, data: ISalesChart[]) => { // Remove unused 'title' parameter
                    return `<div style="padding: 8px 4px; font-size:16px; font-weight:600">Rp ${data[0]?.value}K </div>`;
                },
            },

            xAxis: {
                label: null,
                line: null,
            },
            yAxis: {
                label: null,
                grid: null,
            },
            smooth: true,
            lineStyle: {
                lineWidth: 4,
            },
        };

        return config;
    }, [data]);

    const disabledDate = (date: Dayjs) => date > dayjs();

    const presets: { [key: string]: { startDate: Dayjs; endDate: Dayjs } } = { // Update type of 'presets'
        "This Week": {
            startDate: dayjs().startOf("week"),
            endDate: dayjs().endOf("week"),
        },
        "Last Month": {
            startDate: dayjs().startOf("month").subtract(1, "month"),
            endDate: dayjs().endOf("month").subtract(1, "month"),
        },
        "This Month": {
            startDate: dayjs().startOf("month"),
            endDate: dayjs().endOf("month"),
        },
        "This Year": {
            startDate: dayjs().startOf("year"),
            endDate: dayjs().endOf("year"),
        },
    };

    const rangePresets: TimeRangePickerProps['presets'] = [
        { label: 'This Week', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
        { label: 'Last Month', value: [dayjs().startOf('month').subtract(1, 'month'), dayjs().endOf('month').subtract(1, 'month')] },
        { label: 'This Month', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
        { label: 'This Year', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
    ];



    return (
        <DailyRevenueWrapper>
            <TitleArea>
                <TitleAreaAmount>
                    <Typography.Title level={3}>
                        {t("dashboard.dailyRevenue.title")}
                    </Typography.Title>
                    <TitleAreNumber>
                        <NumberField
                            style={{ fontSize: 36 }}
                            strong
                            options={{
                                currency: "IDR",
                                style: "currency",
                                notation: "compact",
                            }}
                            value={data?.data.total ?? 0}

                        />
                        {(data?.data?.trend ?? 0) > 0 ? (
                            <IncreaseIcon />
                        ) : (
                            <DecreaseIcon />
                        )}
                    </TitleAreNumber>
                </TitleAreaAmount>

                <RangePicker
                    presets={rangePresets}
                    size="small"
                    value={dateRange}
                    onChange={(values) => {
                        if (values && values[0] && values[1]) {
                            setDateRange([values[0], values[1]]);
                        }
                    }}
                    disabledDate={disabledDate}
                    style={{
                        float: "right",
                        color: "#fffff !important",
                        background: "rgba(255, 255, 255, 0.3)",
                    }}

                    format="YYYY/MM/DD"
                />
            </TitleArea>
            <Line
                padding={0}
                appendPadding={10}
                height={135}
                style={{ maxHeight: "135px" }}
                {...config}
            />
        </DailyRevenueWrapper>
    );
};