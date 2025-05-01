/* eslint-disable no-unused-vars */
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
const { Content } = Layout;

function LayoutClient() {
    return (
    <>
      <Layout>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </>
  );
}
export default LayoutClient;
