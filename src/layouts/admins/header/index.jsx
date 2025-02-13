import { Avatar, Flex, Popover, Skeleton, Space, Typography } from "antd";
import "./header.scss";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import AvatarContent from "./avatarContent";
import { useSelector } from "react-redux";

function Header(props) {
  const { collapsed, setCollapsed } = props;

  const infoUser = useSelector(
    (data) => data.authenticationReducerAdmin.infoUser
  );

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
              {infoUser ? (
                <Popover
                  trigger="click"
                  arrow={false}
                  content={<AvatarContent infoUser={infoUser}/>}
                >
                  <Flex
                    align="center"
                    gap={10}
                    className="header-admin__avatar"
                  >
                    <Avatar src={infoUser.avatar} alt={infoUser.fullName} />
                    <Text strong>{infoUser.fullName}</Text>
                  </Flex>
                </Popover>
              ) : (
                <Space style={{padding: "10px"}}>
                  <Skeleton.Avatar active={true} shape="circle" />
                  <Skeleton.Input active={true} size="small" />
                </Space>
              )}
            </Flex>
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;
