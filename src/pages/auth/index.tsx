import { AuthPage as AntdAuthPage, AuthProps } from "@refinedev/antd";
import React from "react";

const authWrapperProps = {
    style: {
        background:
            "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/login-bg.png')",
        backgroundSize: "cover",
    },
};

const renderAuthContent = (content: React.ReactNode) => {
    return (
        <div
            style={{
                maxWidth: 408,
                margin: "auto",
            }}
        >
            {content}
        </div>
    );
};

export const AuthPage: React.FC<AuthProps> = ({ type, formProps }) => {
    return (
        <AntdAuthPage
            type={type}
            renderContent={renderAuthContent}
            formProps={formProps}
        />
    );
};
