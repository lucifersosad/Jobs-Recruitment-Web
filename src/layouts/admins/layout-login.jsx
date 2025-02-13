/* eslint-disable no-unused-vars */
import { Flex, Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;
function LayoutMainAdminNoHeaderAndNoFooter() {
  return (
    <>
      <Layout className="scroll-css">
        <Content
          className=""
          style={{
            overflow: "hidden",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to right, #1a2980, #26d0ce)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </>
  );
}
export default LayoutMainAdminNoHeaderAndNoFooter;
