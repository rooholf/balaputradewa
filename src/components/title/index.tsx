import { useLink } from "@refinedev/core";
import { Flex, Typography, theme } from "antd";

import { BikeWhiteIcon } from "../../components";
import { Logo } from "./styled";

const { useToken } = theme;

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const { token } = useToken();
    const Link = useLink();
    const { Title } = Typography;

    return (
        <Logo>
            <Link to="/">
                {collapsed ? (
                    <BikeWhiteIcon
                        style={{
                            fontSize: "32px",
                            color: token.colorTextHeading,
                        }}
                    />
                ) : (
                    <Flex gap="middle">
                        <Typography style={{ fontSize: "20px" }}>BALAPUTRADEWA</Typography>
                    </Flex>
                )}
            </Link>
        </Logo>
    );
};
