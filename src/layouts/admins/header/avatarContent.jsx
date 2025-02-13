import { Avatar, Flex, List, Typography } from "antd";
import { EditOutlined, LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const AvatarContent = ({infoUser}) => {
  const { Text } = Typography;

  const handleLogout = () => {
      Cookies.remove("token-admin");
      window.location.href = "/admin/login";
    };
  
  return (
    <div className="header-admin__avatar-content">
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={10}>
          <Avatar
            size={"large"}
            src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"
          />
          <Flex vertical>
            <Text>{infoUser.fullName}</Text>
            <Text type="secondary">{infoUser.role_title}</Text>
          </Flex>
        </Flex>
        <div className="button-logout" onClick={handleLogout}>
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
        <List.Item className="header-admin__avatar-content-item" onClick={handleLogout}>
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
