import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Badge, Flex, notification, Popover, Typography } from "antd";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
// import { onMessageListener, requestForToken } from "../../../helpers/firebase";
import ListNotification from "./listNotification";
import "./notification.scss";
import {
  countUnreadNotifications,
  getAllNotificationsEmployer,
  readAllNotifications,
  readNotification,
} from "../../../services/employers/notificationsApi";

const NotificationEmployer = () => {
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isRemaining, setIsRemaining] = useState(true)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    countUnread();
  }, [notifications])

  const countUnread = async () => {
    try {
      const res = await countUnreadNotifications();
      setUnread(res.data);
    } catch (error) {
      console.log("🚀 ~ handleReadAll ~ error:", error);
    }
  };

  const getData = async () => {
    const res = await getAllNotificationsEmployer();
    setNotifications(res.data);
    setIsRemaining(res.metadata.remaining_items > 0)
  };

  const handleReadAll = async () => {
    try {
      await readAllNotifications();
      const updatedNotifications = notifications.map((item) => ({
        ...item,
        is_seen: true
      }))
      setNotifications(updatedNotifications)
      // countUnread()
    } catch (error) {
      console.log("🚀 ~ handleReadAll ~ error:", error);
    }
  };

  const handleRead = async(id) => {
    try {    
      await readNotification(id);
      const updatedNotifications = notifications.map((item) =>
        item._id === id ? { ...item, is_seen: true } : item
      );
      setNotifications(updatedNotifications)
      // countUnread()
    } catch (error) {
      console.log("🚀 ~ handleRead ~ error:", error)
    }
  }

  const { Title, Link } = Typography;

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  // useEffect(() => {
  //   requestForToken();
  // }, []);

  // onMessageListener(async (payload) => {
  //   api.info({
  //     message: payload.notification.title,
  //     description: (
  //       <>
  //         <i>{payload.notification.body}</i>
  //       </>
  //     ),
  //   });
  //   const res = await getAllNotificationsEmployer();
  //   const newNotification = res.data[0]
  //   setNotifications([
  //     newNotification,
  //     ...notifications
  //   ]);
  // });

  const listNotification = useMemo(
    () => (
      <ListNotification
        isRemaining={isRemaining}
        setIsRemaining={setIsRemaining}
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
            <Link onClick={handleReadAll}>Đã xem tất cả</Link>
          </Flex>
        }
      >
        <Badge count={unread}>
          <Avatar shape="square" icon={<FontAwesomeIcon icon={faBell} />} />
        </Badge>
      </Popover>
    </>
  );
};
export default NotificationEmployer;
