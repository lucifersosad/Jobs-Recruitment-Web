import { useEffect, useState } from "react";

import LeftChatBox from "./leftChatBox";
import MidChatBox from "./midChatBox";
import RightChatBox from "./rightChatBox";
import EmptyChatBox from "../../../components/alls/EmptyChatBox";
import "./chatBox.scss";

import { getCookie } from "../../../helpers/cookie";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

import { fetchApi, loadMore } from "./js";
import { DOMAIN } from "../../../utils/api-domain";
import useIsMobile from "../../../hooks/useIsMobile";
const checkTokenClient = getCookie("token-user") || "";

function ChatBoxClient() {
  const [socketClient, setSocketClient] = useState(null);
  const [userData, setUserData] = useState({});
  const [contentChat, setContentChat] = useState([]);
  const [historyChat, setHistoryChat] = useState([]);
  const [typeRoom, setTypeRoom] = useState("friend");
  const { idUser } = useParams();
  const isMobile = useIsMobile();

  useEffect(() => {
  
    fetchApi(setUserData,setContentChat, setHistoryChat,setTypeRoom, idUser );
  }, [idUser]);

  //Kết nối socket với server
  useEffect(() => {
    if (socketClient) {
      //Phải disconnect socket cũ trước khi tạo socket mới
     
      socketClient?.disconnect();
    }
    setSocketClient(
      io(DOMAIN, {
        auth: {
          token: checkTokenClient,
          role: "client",
          idUser: idUser,
        },
      })
    );
    loadMore(setHistoryChat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUser]);

  //Chưa mở khung chat nào thì MidChatBox không render, tự load lại lịch sử khi có tin nhắn mới
  useEffect(() => {
    if (!socketClient || idUser) return;
    const handleLoadMore = () => loadMore(setHistoryChat);
    socketClient.on("SERVER_RETURN_REQUEST_LOADMORE", handleLoadMore);
    return () => {
      socketClient.off("SERVER_RETURN_REQUEST_LOADMORE", handleLoadMore);
    };
  }, [socketClient, idUser]);

  return (
    <div className={`chat-box-client chat-box-layout${isMobile ? " chat-box-layout--mobile" : ""}`}>
      <div className="row gx-0">
        {/* Mobile: chưa chọn hội thoại thì hiện danh sách, đã chọn thì hiện khung chat */}
        {(!isMobile || !idUser) && (
          <div className={isMobile ? "col-12" : "col-3"}>
            <LeftChatBox  idUser={idUser}  historyChat = {historyChat}/>
          </div>
        )}
        {(!isMobile || idUser) && (
          <div className={`${isMobile ? "col-12" : "col-6"} reset-button-employer`}>
            {idUser ? (
              <MidChatBox
                loadMore={() => {
                  loadMore(setHistoryChat);
                }}
                typeRoom={typeRoom}
                contentChat={contentChat}
                userData={userData}
                socket={socketClient}
              />
            ) : (
              <EmptyChatBox role="client" />
            )}
          </div>
        )}
        {!isMobile && (
          <div className="col-3 reset-button-employer">
            <RightChatBox />
          </div>
        )}
      </div>
    </div>
  );
}
export default ChatBoxClient;
