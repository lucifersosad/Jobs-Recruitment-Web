/* eslint-disable no-unused-vars */
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
const { Content } = Layout;

function LayoutClient() {
    return (
    <>
      <Layout>
        <Content style={{background: "#EDF1F5", paddingTop: "20px"}}>
          <Outlet />
        </Content>
      </Layout>
    </>
  );
}
export default LayoutClient;
