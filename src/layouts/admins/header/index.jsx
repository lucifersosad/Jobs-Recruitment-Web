import { Avatar, Flex } from "antd";
import "./header.scss";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

function Header(props) {
  const { collapsed, setCollapsed } = props;

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
          <div style={{marginLeft: "auto"}}>
            <Flex>
                <Flex align="center" gap={10} className="header-admin__avatar">
                    <Avatar src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"/>
                    <span>Admin</span>
                </Flex>
            </Flex>
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;
