import { Avatar, Flex, Popover, Typography } from "antd";
import "./header.scss";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import AvatarContent from "./avatarContent";

function Header(props) {
  const { collapsed, setCollapsed } = props;

  const { Text } = Typography;

  return (
    <>
      <div className="header-admin">
        <div className="header-admin__menu">
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="button-collapse"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Flex>
              <Popover trigger="click" arrow={false} content={<AvatarContent />}>
                <Flex align="center" gap={10} className="header-admin__avatar">
                  <Avatar src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png" />
                  <Text strong>Admin</Text>
                </Flex>
              </Popover>
            </Flex>
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;
