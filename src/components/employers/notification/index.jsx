import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Badge, Flex, notification, Popover, Typography } from "antd";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { onMessageListener, requestForToken } from "../../../helpers/firebase";
import ListNotification from "./listNotification";
import "./notification.scss";
import {
  getAllNotificationsEmployer,
  readAllNotifications,
  readNotification,
} from "../../../services/employers/notificationsApi";

const NotificationEmployer = () => {
  const [api, contextHolder] = notification.useNotification();

  const [notifications, setNotifications] = useState([]);

  const getData = async () => {
    const res = await getAllNotificationsEmployer();
    console.log("🚀 ~ getData ~ res.data:", res.data);
    setNotifications(res.data);
  };

  const handleReadAll = async () => {
    try {
      const updatedNotifications = notifications.map((item) => ({
        ...item,
        is_seen: true
      }))
      console.log("🚀 ~ updatedNotification ~ updatedNotification:", updatedNotifications)
      setNotifications(updatedNotifications)
      await readAllNotifications();
      // getData();
    } catch (error) {
      console.log("🚀 ~ handleReadAll ~ error:", error);
    }
  };

  const handleRead = async(id) => {
    try {
      
      const updatedNotifications = notifications.map((item) =>
        item._id === id ? { ...item, is_seen: true } : item
      );
      console.log("🚀 ~ updatedNotification ~ updatedNotification:", updatedNotifications)
      setNotifications(updatedNotifications)
      await readNotification(id);
    } catch (error) {
      console.log("🚀 ~ handleRead ~ error:", error)
    }
  }

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

  onMessageListener(async (payload) => {
    console.log("🚀 ~ Message received:", payload);
    api.info({
      message: payload.notification.title,
      description: (
        <>
          <i>{payload.notification.body}</i>
        </>
      ),
    });
    const res = await getAllNotificationsEmployer();
    const newNotification = res.data[0]
    setNotifications([
      newNotification,
      ...notifications
    ]);
  });

  const listNotification = useMemo(
    () => (
      <ListNotification
        hide={hide}
        notifications={notifications}
        setNotifications={setNotifications}
        getData={getData}
        handleRead={handleRead}
      />
    ),
    // eslint-disable-next-line
    [notifications]
  );

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
        content={listNotification}
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
            <Link onClick={handleReadAll}>Đã xem tất cả</Link>
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
