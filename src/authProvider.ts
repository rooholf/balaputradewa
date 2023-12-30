import { AuthBindings, useCustomMutation } from "@refinedev/core";
import { notification } from "antd";
import { disableAutoLogin, enableAutoLogin } from "./hooks";
import axios from "axios";

export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthBindings = {
    login: async ({ email, password }) => {
        const response = await axios.post("https://balaputradewa-api.fly.dev/api/v1/auth/login", { email, password });
        if (response.status === 200) {
            enableAutoLogin();
            localStorage.setItem(TOKEN_KEY, `${response.data.access_token}`);
            localStorage.setItem("user", JSON.stringify(response.data));
            return {
                success: true,
                redirectTo: "/",
            };
        }
        return {
            success: false,
            error: {
                message: "Invalid credentials",
                name: "Invalid credentials",
            },
        };
    },
    register: async ({ email, password }) => {
        try {
            await authProvider.login({ email, password });
            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Register failed",
                    name: "Invalid email or password",
                },
            };
        }
    },
    updatePassword: async () => {
        notification.success({
            message: "Updated Password",
            description: "Password updated successfully",
        });
        return {
            success: true,
        };
    },
    forgotPassword: async ({ email }) => {
        notification.success({
            message: "Reset Password",
            description: `Reset password link sent to "${email}"`,
        });
        return {
            success: true,
        };
    },
    logout: async () => {
        disableAutoLogin();
        localStorage.removeItem(TOKEN_KEY);
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    onError: async (error) => {
        console.error(error);
        return { error };
    },
    check: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            redirectTo: "/login",
            error: {
                message: "Check failed",
                name: "Token not found",
            },
            logout: true,

        };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const userData = localStorage.getItem("user");
        if (!token) {
            return null;
        }

        const parsedUserData = JSON.parse(userData || "{}");
        return {
            id: parsedUserData.id,
            name: parsedUserData.email,
            avatar: "https://i.pravatar.cc/150",
        };
    },
};
