import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./midChatBox.scss";
import { faFaceSmile, faImage } from "@fortawesome/free-regular-svg-icons";
import { Form, Input, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useIsMobile from "../../../hooks/useIsMobile";
import audioMp3 from "./mp3/tb.mp3";
import TypingIndicator from "../../../components/alls/Typing";
function MidChatBox({
  socket,
  userData,
  contentChat,
  loadMore,
  typeRoom = "friend",
}) {

  const [idClient, setIdClient] = useState("");
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const boxChatAllRef = useRef(null);
  const [status, setStatus] = useState("");
  const authenMainClient = useSelector(
    (status) => status.authenticationReducerClient
  );

  const [form] = Form.useForm();
  const typingTimer = useRef(null);
  const inputRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const { idUser } = useParams();

  //Tạo state lưu trữ tin nhắn
  const [arrayChat, setArrayChat] = useState([]);
  useEffect(() => {
    if (contentChat.length > 0) {
      setArrayChat(contentChat);
    }else{
      setArrayChat([]);
    }
  }, [contentChat]);

  //Check trang thái online offline khi vào trang
  useEffect(() => {
    setStatus(userData?.statusOnline ? "Hoạt động" : "Dừng hoạt động");
  }, [userData?.statusOnline, socket]);

  //Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (boxChatAllRef.current) {
      boxChatAllRef.current.scrollTop = boxChatAllRef.current.scrollHeight;
    }
  }, [arrayChat]);

  //Nhận tin nhắn từ server
  useEffect(() => {
    if (idClient === "") return;
    if (!socket) return;

    //Hàm này check xem user có online hay không
    const handleOnline = (data) => {
      if (idUser === data?.user_id) {
        setStatus("Hoạt động");
      }
    };

    //Hàm này check xem user có offline hay không
    const handleOffline = (data) => {
      if (idUser === data?.user_id) {
        setStatus("Dừng hoạt động");
      }
    };
    //Hàm này nhận tin nhắn từ server
    const handleMessage = (data) => {
      setArrayChat((prev) => [...prev, data]);
    };
    //Hàm này load thêm tin nhắn khi có tin nhắn mới tin nhắn mới nhất
    const handleLoadMore = (data) => {
      const idCheck = data?.id_check;
      //Chưa mở khung chat nào thì server không xử lý seen, load lại luôn
      if (!idUser) {
        loadMore();
        return;
      }
      //Nếu mà hiện tại đang ở khung chat của đối phương thì sẽ đổi read = true luôn vì đang ở khung chat đối phương mà
      //Đợi server cập nhật read xong (ack) mới load lại lịch sử, timeout để không bị treo nếu server không phản hồi
      socket.timeout(5000).emit(
        "CLIENT_SEND_REQUEST_SEEN_CHAT",
        {
          idUser: idUser,
          idCheck: idCheck,
        },
        () => loadMore()
      );
      // if (idClient !== idCheck &&  arrayChat.length > 0) {
      //   const audio = new Audio(audioMp3);
      //   audio.play();
      // }
    };
    //Chức năng typing
    const handleTypingServer = () => {
      setTyping(true);
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
      typingTimer.current = setTimeout(() => {
        setTyping(false);
      }, 3000);
    };

    socket.on("SERVER_RETURN_REQUEST_ONLINE", handleOnline);
    socket.on("SERVER_RETURN_REQUEST_OFFLINE", handleOffline);
    socket.on("SERVER_RETURN_MESSAGE", handleMessage);
    socket.on("SERVER_RETURN_REQUEST_LOADMORE", handleLoadMore);
    socket.on("SERVER_RETURN_TYPING", handleTypingServer);

    setLoading(false);
    //Nếu mà component bị unmount thì sẽ xóa hết listener
    return () => {
      socket.off("SERVER_RETURN_REQUEST_ONLINE", handleOnline);
      socket.off("SERVER_RETURN_REQUEST_OFFLINE", handleOffline);
      socket.off("SERVER_RETURN_MESSAGE", handleMessage);
      socket.off("SERVER_RETURN_REQUEST_LOADMORE", handleLoadMore);
      socket.off("SERVER_RETURN_TYPING", handleTypingServer);
      setTyping(false);
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idClient, socket]);

  useEffect(() => {
    if (authenMainClient?.status) {
      const { infoUser } = authenMainClient;
      setIdClient(infoUser?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenMainClient?.infoUser?.id]);

  //Gửi tin nhắn đi
  const handleSendChat = (value) => {
    const { content } = value;
    if (!socket) return;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      //Không dùng resetFields vì nó remount Input làm mất focus, chỉ xoá nội dung ô nhập
      form.setFieldsValue({ content: "" });
      inputRef.current?.focus();
    }
  };

  const handleTyping = () => {
    socket.emit("CLIENT_SEND_TYPING");
  };

  return (
    <div className="mid-chat-client  ">
      {!isMobile && (
        <div className="mid-chat-client__slogan p-3 mb-1">
          <div className="content">
            Embrace a fresh approach to <span>pursue your opportunities</span>.
          </div>
        </div>
      )}
      <div className={`mid-chat-client__header ${isMobile ? "p-2" : "p-3"}`}>
        <div className="box-info">
          {isMobile && (
            <Link to="/chat-box" className="back-button" aria-label="Quay lại">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          )}
          <div className="image">
            <img src={userData?.logoCompany} alt="avatar" style={{objectFit: "contain"}} />
          </div>
          <div className="info">
            <div className="name">{userData?.fullName}</div>
            <div
              className={`status ${
                status === "Hoạt động" ? "online" : "offline"
              }`}
            >
              {status}
            </div>
          </div>
        </div>
      </div>
      <div className="mid-chat-client__body ">
        <Spin spinning={loading}>
          <div className="box-chat-all p-3" ref={boxChatAllRef}>
            {arrayChat?.length > 0 &&
              arrayChat.map((item, index) => {
                return (
                  <div key={index}>
                    {item?.user_id === idClient ? (
                      <div className="me mb-2 align-items-center" style={{ textAlign: "end" }}>
                        <div className="content ">{item?.content}</div>
                      </div>
                    ) : (
                      <div
                        className="friend  mb-2"
                        style={{ textAlign: "left" }}
                      >
                        <div className="image">
                          <img src={item?.avatar} alt="avatar" />
                        </div>
                        <div className="content ">{item?.content}</div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </Spin>
      </div>
      <div className="mid-chat-client__footer p-3 pt-0">
        <TypingIndicator
          fullName={userData?.fullName}
          isTyping={typing}
          color="#fda4c8"
        />
        <div className="input-chat row align-items-center">
          {typeRoom === "group" ? (
            <>
              <div className="box-disable col-12">
                <div>
                  Chỉ có{" "}
                  <span
                    style={{ color: "#fda4c8", fontWeight: "500" }}
                  >
                    trưởng nhóm
                  </span>{" "}
                  được gửi tin nhắn vào cộng đồng.
                </div>
              </div>
            </>
          ) : (
            <>
              {!isMobile && (
                <div className="col-1">
                  <div className="box-icon">
                    <FontAwesomeIcon icon={faImage} />
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </div>
                </div>
              )}
              <div className={isMobile ? "col-12" : "col-11"}>
                <div className="box-input">
                  <>
                    <Form form={form} onFinish={handleSendChat} layout="inline" autoComplete="off">
                      <Form.Item name="content" style={{ flex: "1" }}>
                        <Input
                          ref={inputRef}
                          autoComplete="off"
                          disabled={typeRoom === "group"}
                          onChange={handleTyping}
                          placeholder="Aa"
                        />
                      </Form.Item>
                      <Form.Item>
                        <button type="submit" onMouseDown={(e) => e.preventDefault()}>Gửi</button>
                      </Form.Item>
                    </Form>
                  </>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default MidChatBox;
