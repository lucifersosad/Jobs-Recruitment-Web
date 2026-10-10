/* eslint-disable react/jsx-no-comment-textnodes */
import { Drawer, Layout } from "antd";
import Header from "./header";
import { Outlet, useLocation } from "react-router-dom";
// import FooterMain from "./footer";
import Sider from "antd/es/layout/Sider";
import SliderHome from "./SliderHome";
import { useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import Cookies from "js-cookie";
import "./layout.scss";
import "./mobilePages.scss";
const { Content } = Layout;

function LayoutMainEmployerAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  //Mobile: đổi trang thì đóng menu
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    Cookies.remove("token-employer");
    window.location.href = "/nha-tuyen-dung/login";
  };

  return (
    <>
      <Layout className={`layout__employer-admin${isMobile ? " layout__employer-admin--mobile" : ""}`}>
        <Header
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
          onOpenMenu={() => setMenuOpen(true)}
          className="layout__header"
        />
        <Layout className="employer-full">
          {isMobile ? (
            <Drawer
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              placement="left"
              width="85%"
              rootClassName="employer-menu-drawer"
              zIndex={1100} //cao hơn header cố định (1030)
              title={<img className="employer-menu-drawer__logo" src="/images/UTEM_LOGO.svg" alt="UTEM" />}
              footer={
                <button type="button" className="employer-menu-drawer__logout" onClick={handleLogout}>
                  Đăng xuất
                </button>
              }
            >
              <SliderHome />
            </Drawer>
          ) : (
            <Sider
              breakpoint="xxl"

              onBreakpoint={(boolean) => {
                setIsCollapsed(boolean);
              }}

              collapsed={isCollapsed}
              className="mt-3 mb-3 sider-fixed"
            >
              <SliderHome />
            </Sider>
          )}
          <Content className="layout__main">
            <Outlet />
          </Content>
        </Layout>

        {/* <FooterMain /> */}
      </Layout>
    </>
  );
}
export default LayoutMainEmployerAdmin;
