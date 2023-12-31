import React from "react";
import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import {
    notificationProvider,
    ErrorComponent,
} from "@refinedev/antd";

import { ThemedLayoutV2 } from "./components/layout";
import { ThemedSiderV2 } from "./components/layout/sider";

import routerProvider, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
    DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import {
    ShoppingOutlined,
    UsergroupAddOutlined,
    DashboardOutlined,
    AuditOutlined,
    DatabaseFilled,
    HomeOutlined,
    TransactionOutlined,
    CarOutlined,
    ReconciliationOutlined,
    ReconciliationFilled,
    BankFilled,
    GroupOutlined,
    BankOutlined,
    InboxOutlined,
    FormOutlined,
} from "@ant-design/icons";
import jsonServerDataProvider from "@refinedev/simple-rest";
import { authProvider } from "./authProvider.js";

import "dayjs/locale/de";

import { DashboardPage } from "./pages/dashboard";
import { OrderList, } from "./pages/orders";
import { AuthPage } from "./pages/auth";
import { FarmerList, FarmerShow } from "./pages/farmers/index.js";
import { FactoryList, FactoryShow } from "./pages/factories/index.js";
import { useTranslation } from "react-i18next";
import { Header, Title, OffLayoutArea } from "./components";
import { BikeWhiteIcon, PizzaIcon } from "./components/icons";
import { ConfigProvider } from "./context";
import { useAutoLoginForDemo } from "./hooks";
import { dataProvider } from "./rest-data-provider/index.js";

import "@refinedev/antd/dist/reset.css";
import { SupplierList } from "./pages/suppliers/list.js";
import { SupplierShow } from "./pages/suppliers/show.js";
import { VehicleList } from "./pages/vehicles/list.js";

import { AntdInferencer } from "@refinedev/inferencer/antd";
import { InvoiceCreate } from "./pages/invoices-factory/create.js";
import { InvoiceList } from "./pages/invoices-factory/list.js";
import { InvoiceSupplierList } from "./pages/invoices-supplier/list.js";
import { BankList, BankShow } from "./pages/banks";
import { SupplierInvoiceShow } from "./pages/invoices-supplier";

const App: React.FC = () => {
    // This hook is used to automatically login the user.
    // We use this hook to skip the login page and demonstrate the application more quickly.
    const { loading } = useAutoLoginForDemo();

    const API_URL = "https://balaputradewa-api.fly.dev/api/v1";
    const DataProvider = dataProvider(API_URL);
    const InvDataProvider = dataProvider(API_URL + "/invoices");

    const { t, i18n } = useTranslation();

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    if (loading) {
        return null;
    }

    return (
        <BrowserRouter>
            <ConfigProvider>
                <RefineKbarProvider>
                    <Refine

                        routerProvider={routerProvider}
                        dataProvider={{
                            default: DataProvider,
                            invoices: InvDataProvider,
                        }}
                        authProvider={authProvider}
                        i18nProvider={i18nProvider}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}
                        notificationProvider={notificationProvider}
                        resources={[
                            {
                                name: "dashboard",
                                list: "/",
                                meta: {
                                    label: "Dashboard",
                                    icon: <DashboardOutlined />,
                                },
                            },

                            {
                                name: "masters",
                                meta: {
                                    label: "Data Master",
                                    icon: <DatabaseFilled />,
                                },
                            },
                            {
                                name: "invoices",
                                meta: {
                                    label: "Invoices",
                                    icon: <AuditOutlined />,
                                },
                            },

                            {
                                name: "report",
                                meta: {
                                    label: "Report",
                                    icon: <TransactionOutlined />
                                }
                            },
                            {
                                name: "transactions",
                                list: "/invoices/factory/create",
                                meta: {
                                    label: "Transactions",
                                    icon: <FormOutlined />
                                },
                            },

                            {
                                name: "factories",
                                list: "/factories",
                                show: "/factories/show/:id",
                                meta: {
                                    icon: <HomeOutlined />,
                                    parent: "masters",
                                },
                            },
                            {
                                name: "suppliers",
                                list: "/suppliers",
                                create: "/suppliers/create",
                                edit: "/suppliers/edit/:id",
                                show: "/suppliers/show/:id",
                                meta: {
                                    icon: <ShoppingOutlined />,
                                    parent: "masters",
                                },
                            },
                            {
                                name: "orders",
                                list: "/orders",
                                create: "/orders/create",
                                edit: "/orders/edit/:id",
                                show: "/orders/show/:id",
                                meta: {
                                    label: "Master Invoice",
                                    icon: <ReconciliationFilled />,
                                    parent: "invoices"
                                },
                            },
                            {
                                name: "invoices/factory",
                                list: "invoices/factory",
                                create: "invoices/factory/create",
                                edit: "invoices/factory/edit/:id",
                                show: "invoices/factory/show/:id",
                                meta: {
                                    label: "Factory Invoice",
                                    icon: <ReconciliationOutlined />,
                                    parent: "invoices"
                                },
                            },
                            {
                                name: "invoices/supplier",
                                list: "invoices/supplier",
                                create: "invoices/supplier/create",
                                edit: "invoices/supplier/edit/:id",
                                show: "invoices/supplier/show/:id",
                                meta: {
                                    label: "Supplier Invoice",
                                    icon: <ShoppingOutlined />,
                                    parent: "invoices"
                                },
                            },
                            // {
                            //     name: "invoices/farmer",
                            //     list: "invoices/farmer",
                            //     create: "invoices/farmer/create",
                            //     edit: "invoices/farmer/edit/:id",
                            //     show: "invoices/farmer/show/:id",
                            //     meta: {
                            //         label: "farmer Invoice",
                            //         icon: <UsergroupAddOutlined />,
                            //         parent: "invoices"
                            //     },
                            // },
                            // {
                            //     name: "transaction/report",
                            //     list: "/transaction/report",
                            //     meta: {
                            //         icon: <BankOutlined />,
                            //         label: "Report",
                            //         parent: "report",
                            //     },
                            // },
                            // {
                            //     name: "transaction",
                            //     list: "transaction",
                            //     create: "transaction/create",
                            //     edit: "transaction/edit/:id",
                            //     show: "transaction/show/:id",
                            //     meta: {
                            //         label: "Bank Transactions",
                            //         icon: <BankFilled />,
                            //         canDelete: false,
                            //         parent: "report"

                            //     },
                            // },
                            {
                                name: "vehicles",
                                list: "/vehicles",
                                create: "/vehicles/create",
                                show: "/vehicles/show/:id",
                                edit: "/vehicles/edit/:id",
                                canDelete: true,
                                meta: {
                                    icon: <CarOutlined />,
                                    parent: "masters",
                                },
                            },

                            {
                                name: "farmers",
                                list: "/farmers",
                                show: "/farmers/show/:id",
                                edit: "/farmers/edit/:id",
                                meta: {
                                    icon: <UsergroupAddOutlined />,
                                    label: "Farmers",
                                    parent: "masters",
                                },
                            },
                            {
                                name: "bank",
                                list: "/bank",
                                show: "/bank/show/:id",
                                edit: "/bank/edit/:id",
                                meta: {
                                    icon: <BankOutlined />,
                                    label: "Bank",
                                    parent: "masters",
                                },
                            },

                        ]}
                    >
                        <Routes>
                            <Route
                                element={
                                    <Authenticated
                                        key={"login"}
                                        fallback={<CatchAllNavigate to="/login" />}
                                    >
                                        <ThemedLayoutV2
                                            Header={Header}
                                            Title={Title}
                                            Sider={() => <ThemedSiderV2 fixed Title={Title} />}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route index element={<DashboardPage />} />

                                <Route path="/suppliers">
                                    <Route index element={<SupplierList />} />
                                    <Route path="show/:id" element={<SupplierShow />} />
                                </Route>
                                <Route path="/factories">
                                    <Route index element={<FactoryList />} />
                                    <Route path="show/:id" element={<FactoryShow />} />
                                </Route>
                                <Route path="/farmers">
                                    <Route index element={<FarmerList />} />
                                    <Route path="show/:id" element={<FarmerShow />} />
                                </Route>
                                <Route path="/invoices/factory">
                                    <Route index element={<InvoiceList />} />
                                    <Route path="show/:id" element={<AntdInferencer />} />
                                    <Route path="create" element={<InvoiceCreate />} />
                                    <Route path="edit/:id" element={<AntdInferencer />} />
                                </Route>
                                <Route path="/invoices/supplier">
                                    <Route index element={<InvoiceSupplierList />} />
                                    <Route path="show/:id" element={<SupplierInvoiceShow />} />
                                    <Route path="create" element={<AntdInferencer />} />
                                    <Route path="edit/:id" element={<AntdInferencer />} />
                                </Route>
                                <Route path="/transaction">
                                    <Route index element={<AntdInferencer />} />
                                    <Route path="show/:id" element={<AntdInferencer />} />
                                    <Route path="create" element={<AntdInferencer />} />
                                    <Route path="edit/:id" element={<AntdInferencer />} />
                                </Route>

                                <Route path="/bank">
                                    <Route index element={<BankList />} />
                                    <Route path="show/:id" element={<BankShow />} />
                                </Route>



                                <Route path="/vehicles" element={<VehicleList />} />
                                <Route path="/orders" element={<OrderList />} />

                            </Route>

                            <Route
                                element={
                                    <Authenticated key={"dashboard"} fallback={<Outlet />}>
                                        <NavigateToResource resource="dashboard" />
                                    </Authenticated>
                                }
                            >
                                <Route
                                    path="/login"
                                    element={
                                        <AuthPage
                                            type="login"
                                            formProps={{
                                                initialValues: {
                                                    email: "user1@example.com",
                                                    password: "password1",
                                                },
                                            }}
                                        />
                                    }
                                />
                                <Route
                                    path="/register"
                                    element={
                                        <AuthPage
                                            type="register"
                                            formProps={{
                                                initialValues: {
                                                    email: "user1@example.com",
                                                    password: "password1",
                                                },
                                            }}
                                        />
                                    }
                                />
                                <Route
                                    path="/forgot-password"
                                    element={<AuthPage type="forgotPassword" />}
                                />
                                <Route
                                    path="/update-password"
                                    element={<AuthPage type="updatePassword" />}
                                />
                            </Route>

                            <Route
                                element={
                                    <Authenticated key={"layout"}>
                                        <ThemedLayoutV2
                                            Header={Header}
                                            Title={Title}
                                            OffLayoutArea={OffLayoutArea}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route path="*" element={<ErrorComponent />} />
                            </Route>
                        </Routes>
                        <UnsavedChangesNotifier />
                        <DocumentTitleHandler />
                    </Refine>
                </RefineKbarProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
};

export default App;
