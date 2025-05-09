/* eslint-disable react/jsx-no-comment-textnodes */
import { Layout } from "antd";
import Header from "./header";
import { Outlet } from "react-router-dom";
// import FooterMain from "./footer";
import Sider from "antd/es/layout/Sider";
import SliderHome from "./SliderHome";
import { useSelector } from "react-redux";
import { useState } from "react";
import "./layout.scss";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Content } = Layout;

function LayoutMainAdmin() {
  //Lấy ra trạng thái của authenticationReducerAdmin false là chưa đăng nhập true là đã đăng nhập
  const authenMainAdmin = useSelector(
    (status) => status.authenticationReducerAdmin
  );
  const authenMainClient = useSelector((status) => status);

  const [collapsed, setCollapsed] = useState(false);

  const siderStyle = {
    overflow: "auto",
    maxHeight: "100vh",
    position: "fixed",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    borderRight: "1px solid #ddd",
  };

  const layoutMainStyle = {
    minHeight: "100vh",
    maxHeight: "100vh",
    overflow: "hidden",
  };

  const contentStyle = {
    maxHeight: "100vh",
    overflowY: "auto",
    scrollbarWidth: "thin",
    padding: "20px",
  };

  return (
    <>
      <Layout style={layoutMainStyle}>
        {authenMainAdmin.status && (
          <Sider
            style={siderStyle}
            collapsed={collapsed}
            className="sider-admin"
          >
            <SliderHome collapsed={collapsed}/>
          </Sider>
        )}
        <Layout>
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content style={contentStyle}>
            <Outlet />
          </Content>
        </Layout>

        {/* <FooterMain /> */}
      </Layout>
    </>
  );
}
export default LayoutMainAdmin;
