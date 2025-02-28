import { Alert, Avatar, List, Skeleton, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllNotificationsEmployer,
  readAllNotifications,
} from "../../../services/employers/notificationsApi";
import { useEffect, useState } from "react";
import { formatDateTime, formatNotificationTime } from "../../../helpers/formartDate";
import { CheckCircleFilled, LoadingOutlined, UserOutlined } from "@ant-design/icons";

const ListNotification = ({
  isRemaining,
  setIsRemaining,
  hide,
  notifications,
  setNotifications,
  getData,
  handleRead,
}) => {
  const navigate = useNavigate();
  const { Text, Link } = Typography;

  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getList = async () => {
      await getData();
      setInitLoading(false);
    };
    getList();
  }, []);

  const onLoadMore = async () => {
    setLoading(true);
    setNotifications(
      notifications.concat(
        Array.from({
          length: 3,
        }).map(() => ({
          loading: true,
        }))
      )
    );
    const res = await getAllNotificationsEmployer(notifications[notifications.length - 1]?._id, 3);
    const newNotifications = notifications.concat(res.data);
    setNotifications(newNotifications);
    setIsRemaining(res.metadata.remaining_items > 0)
    setLoading(false);
  };

  const loadMore =
    isRemaining && !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: "5px",
          marginBottom: "5px",
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Link onClick={onLoadMore}>Xem thêm</Link>
      </div>
    ) : null;

  console.log("🚀 ~ ListNotification ~ notifications:", notifications);

  return (
    <>
      <List
        className="list-notification"
        style={{ width: "470px" }}
        dataSource={notifications}
        loadMore={loadMore}
        loading={{spinning: initLoading}}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            extra={
              item?.is_seen === false && (
                <Avatar
                  size={12}
                  style={{ backgroundColor: "#0064D1" }}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                />
              )
            }
            className="list-notification__item"
            onClick={() => {
              handleRead(item?._id);
              navigate(
                `/nha-tuyen-dung/app/detail-jobs/${item?.extra?.job_id}/?active_tab=apply_cv`
              );
              hide();
            }}
          >
            <Skeleton avatar={{size: 50}} title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar size={50} src={item?.image} />}
                title={
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Text strong>{item?.extra?.candidate_name}</Text> đã ứng
                    tuyển vào chiến dịch{" "}
                    <Text strong>{item?.extra?.job_title}</Text>
                  </div>
                }
                description={formatNotificationTime(item?.createdAt)}
              />
            </Skeleton>
          </List.Item>
        )}
      ></List>
    </>
  );
};
export default ListNotification;
