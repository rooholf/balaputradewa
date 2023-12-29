import { Dayjs } from "dayjs";

export interface IOrderChart {
    count: number;
    status:
    | "waiting"
    | "ready"
    | "on the way"
    | "delivered"
    | "could not be delivered";
}

export interface IOrderTotalCount {
    total: number;
    totalDelivered: number;
}

export interface ISalesChart {
    date: string;
    title: "Order Count" | "Order Amount";
    value: number;
}

export interface IOrderStatus {
    id: number;
    text: "Pending" | "Paid";
}

export interface IFarmer {
    id: number;
    code: string;
    name: string;
    phone: number;
    address: string;
    farmerOrders: IFarmerOrder[];
    bankTransaction: IBankTransaction[];
    created_at: string;
}

export interface IPrice {
    id: number;
    price: number;
    isPPN: boolean;
    supplierId: number;
    factoryPriceId: number;
    created_at: string;
}

export interface IFactory {
    id: number;
    code: string;
    name: string;
    prices: IPrice[];
    vehicles: IVehicle[];
    address: string;
    created_at: string;
    factoryOrders: IOrder[];
    bankAccounts: IBankAccount[];
    suppliers: ISupplier[];

}

export interface IFactoryOrderForm {
    factoryId: number;
    factoryPriceId?: number;
    vehicleOrders: {
        vehicleId: number;
        qty: number;
    }[];
    noRef: string;
    transactionDate: string;
    bankAccountId: number;
}

export interface ITransaction {
    id: number;
    transactionDate: string;
    transactionCode: string;
    transactionType: string;
    amount: number;
    bankAccountId?: number;
    supplierInvCode?: string;
    factoryInvCode?: string;
    farmerOrderId?: string;
    supplierOrder?: IOrder;
    factoryOrder?: IOrder;
    farmerOrder?: IOrder;
    created_at: string;
}


export interface ISupplier {
    id: number;
    code: string;
    name: string;
    supplierOrder: IOrder[];
    prices: IPrice[];
    vehicles: IVehicle[];
    address: string;
    products: Iproduct;
    created_at: string;
}

export interface IVehicle {
    id: number;
    plate: string;
    color: string;
    brand: string;
    chassis: string;
    supplierId: number;
    supplier: ISupplier;
    price: IPrice;
}

export interface IIdentity {
    id: number;
    name: string;
    avatar: string;
}

export interface IAddress {
    text: string;
    coordinate: [string, string];
}

export interface IFile {
    name: string;
    percent: number;
    size: number;
    status: "error" | "success" | "done" | "uploading" | "removed";
    type: string;
    uid: string;
    url: string;
}

export interface IEvent {
    date: string;
    status: string;
}

export interface IStore {
    id: number;
    title: string;
    isActive: boolean;
    created_at: string;
    address: IAddress;
    products: IProduct[];
}

export interface ICourier {
    id: number;
    name: string;
    surname: string;
    email: string;
    gender: string;
    gsm: string;
    created_at: string;
    accountNumber: string;
    licensePlate: string;
    address: string;
    avatar: IFile[];
    store: IStore;
}

export interface IVehicleOrders {
    id: string;
    qty: number;
    invCode: string;
    vehicle: IVehicle;
    plate: string;
    supplierOrderId: number;
    factoryOrdersId: number;
}
export interface IOrder {
    id: number;
    status: string;
    invCode: string;
    invTotal: number;
    invDate: string;
    qty: string;
    supplier: ISupplier;
    supplierPrice: IPrice;
    vehicleOrders: IVehicleOrders[];
    created_at: string;
}

export interface IProduct {
    id: number;
    name: string;
    code: string;
    name: string;
    supplier: ISupplier[];
}

export interface IBankAccount {
    id: number;
    accountName: string;
    accountNumber: string;
    bankName: string;
    balance: string;
    created_at: string;
}

export interface ICategory {
    id: number;
    code: string;
    name: string;
}

export interface IOrderFilterVariables {
    q?: string;
    created_at?: [Dayjs, Dayjs];
    _status?: string;
}

export interface IUserFilterVariables {
    q: string;
    status: boolean;
    created_at: [Dayjs, Dayjs];
    gender: string;
    isActive: boolean;
}

export interface ICourier {
    id: number;
    name: string;
    surname: string;
    gender: string;
    gsm: string;
    created_at: string;
    isActive: boolean;
    avatar: IFile[];
}

export interface IReview {
    id: number;
    order: IOrder;
    user: IUser;
    star: number;
    createDate: string;
    status: "pending" | "approved" | "rejected";
    comment: string[];
}
