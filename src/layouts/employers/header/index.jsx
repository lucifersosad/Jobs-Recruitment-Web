import "./header.scss";
import {} from "@ant-design/icons";

import { NavLink } from "react-router-dom";
import { Menu } from "antd";
import { useEffect } from "react";

import { useSelector } from "react-redux";

function Header() {
  const authenMainEmployer = useSelector(
    (status) => status.authenticationReducerEmployer
  );

  useEffect(() => {}, []);

  const itemsMenuNav = [
    {
      label: "Giới Thiệu",
      key: "1",
      icon: null,
    },
    {
      label: "Dịch vụ",
      key: "2",
      icon: null,
    },
    {
      label: "Báo giá",
      key: "3",
      icon: null,
    },
    {
      label: "Hỗ trợ",
      key: "4",
      icon: null,
    },
    {
      label: "Blog tuyển dụng",
      key: "5",
      icon: null,
    },
  ];

  return (
    <>
      <header className="header-employers">
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center">
            <div className="header-employers__logo col-2">
              <NavLink className="mr-1" to="/">
                UTEM
              </NavLink>
            </div>
            <div className="header-employers__search col-5 text-center">
              <Menu mode="horizontal" items={itemsMenuNav} />
            </div>

            <div className="header-employers__boxUsers col-3 text-center">
              <div className="row col-12 justify-content-end align-items-center">
                {!authenMainEmployer.status ? (
                  <>
                    <div className="header-employers__boxUsers-user col-3">
                      <NavLink className="mr-1" to={"/nha-tuyen-dung/login"}>
                        Đăng nhập
                      </NavLink>
                      <div className="inner-dir "></div>
                    </div>
                    <div className="header-employers__boxUsers-user col-3">
                      <NavLink className="ml-1" to={"/nha-tuyen-dung/register"}>
                        Đăng ký
                      </NavLink>
                      <div className="inner-dir"></div>
                    </div>
                  </>
                ) : (
                  <div className="header-employers__boxUsers-user login col-3">
                    <NavLink className="ml-1" to={"/nha-tuyen-dung/app/dashboard"}>
                      Đăng tin
                    </NavLink>
                    <div className="inner-dir"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;
