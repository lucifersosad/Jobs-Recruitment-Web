import { Avatar, List, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getAllNotificationsEmployer } from "../../../services/employers/notificationsApi";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../../helpers/formartDate";
import { CheckCircleFilled, UserOutlined } from "@ant-design/icons";

const ListNotification = ({hide}) => {
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const res = await getAllNotificationsEmployer();
      console.log("🚀 ~ getData ~ res.data:", res.data);
      setNotifications(res.data);
    };

    getData();
  }, []);

  const { Text } = Typography;

  console.log("🚀 ~ useEffect ~ res:", "cc");

  return (
    <>
      <List
        className="list-notification"
        style={{ width: "470px" }}
        dataSource={notifications}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            extra={!item?.is_seen && <Avatar size={10} style={{ backgroundColor: "#0064D1" }} onClick={(e) => {
              e.preventDefault()
            }}/>}
            className="list-notification__item"
            onClick={() => {
              navigate(`/nha-tuyen-dung/app/detail-jobs/${item?.extra?.job_id}/?active_tab=apply_cv`)
              hide()
            }}
          >
            {/* <Link
              to={`/nha-tuyen-dung/app/detail-jobs/${item?.extra?.job_id}/?active_tab=apply_cv`}
              style={{
                width: "100%",
                paddingLeft: "12px",
                paddingRight: "12px",
              }}
              // className="py-1"
            >
              
            </Link> */}
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
                description={formatDateTime(item.createdAt)}
              />
          </List.Item>
        )}
      ></List>
    </>
  );
};
export default ListNotification;
