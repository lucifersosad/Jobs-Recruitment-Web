import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Badge, Flex, notification, Popover, Typography } from "antd";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { onMessageListener, requestForToken } from "../../../helpers/firebase";
import ListNotification from "./listNotification";
import "./notification.scss";

const NotificationEmployer = () => {
  const [api, contextHolder] = notification.useNotification();

  const { Text, Title, Link } = Typography;

  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    requestForToken();
  }, []);

  onMessageListener((payload) => {
    console.log("🚀 ~ Message received:", payload);
    api.info({
      message: payload.notification.title,
      description: (
        <>
          <i>{payload.notification.body}</i>
        </>
      ),
    });
  });

  return (
    <>
      {contextHolder}
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        trigger={["click", "focus"]}
        overlayClassName="popover-notification"
        placement="bottomRight"
        arrow={false}
        content={<ListNotification hide={hide}/>}
        title={
          <Flex
            className="popover-notification__title"
            justify="space-between"
            align="center"
          >
            <Title level={5} style={{ marginBottom: 0 }}>
              Thông báo
            </Title>
            {/* <Avatar
              size={35}
              // style={{ background: "#fff", color: "green" }}
              shape="square"
              icon={<CheckCircleOutlined />}
            /> */}
            <Link>Đã xem tất cả</Link>
          </Flex>
        }
      >
        <Badge count={1}>
          <Avatar shape="square" icon={<FontAwesomeIcon icon={faBell} />} />
        </Badge>
      </Popover>
    </>
  );
};
export default NotificationEmployer;
