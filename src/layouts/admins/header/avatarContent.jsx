import { Avatar, Flex, List, Typography } from "antd";
import { EditOutlined, LogoutOutlined } from "@ant-design/icons";

const AvatarContent = () => {
  const { Text } = Typography;
  return (
    <div className="header-admin__avatar-content">
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={10}>
          <Avatar
            size={"large"}
            src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"
          />
          <Flex vertical>
            <Text>Admin</Text>
            <Text type="secondary">admin</Text>
          </Flex>
        </Flex>
        <div className="button-logout">
          <LogoutOutlined />
        </div>
      </Flex>
      <List>
        <List.Item className="header-admin__avatar-content-item">
          <Flex gap={10}>
            <EditOutlined />
            <Text>Sửa Thông Tin</Text>
          </Flex>
        </List.Item>
        <List.Item className="header-admin__avatar-content-item">
          <Flex gap={10}>
            <LogoutOutlined />
            <Text>Đăng Xuất</Text>
          </Flex>
        </List.Item>
      </List>
    </div>
  );
};
export default AvatarContent;
