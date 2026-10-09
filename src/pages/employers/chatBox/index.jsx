/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import LeftChatBox from "./leftChatBox";
import MidChatBox from "./midChatBox";
import RightChatBox from "./rightChatBox";
import EmptyChatBox from "../../../components/alls/EmptyChatBox";
import "./chatBox.scss";
import { useParams } from "react-router-dom";
import { getCookie } from "../../../helpers/cookie";
import { io } from "socket.io-client";

import { fetchApi, loadMore } from "./js";
import { DOMAIN } from "../../../utils/api-domain";

const checkTokenEmployer = getCookie("token-employer") || "";

function ChatBox() {
  const [socketEmployer, setSocketEmployer] = useState(null);
  const [userData, setUserData] = useState({});
  const [contentChat, setContentChat] = useState([]);
  const [historyChat, setHistoryChat] = useState([]);
  const { idUser } = useParams();


  useEffect(() => {
    
    fetchApi(setUserData, setContentChat, setHistoryChat, idUser);

  }, [idUser]);

  //Kết nối socket với server
  useEffect(() => {
   
    if(socketEmployer){
      //Phải disconnect socket cũ trước khi tạo socket mới
     
      socketEmployer.disconnect();
    }
    setSocketEmployer(
      io(DOMAIN, {
        auth: {
          token: checkTokenEmployer,
          role: "employer",
          idUser: idUser,
        },
      })
    );
      loadMore(setHistoryChat);
  }, [idUser]);

  //Chưa mở khung chat nào thì MidChatBox không render, tự load lại lịch sử khi có tin nhắn mới
  useEffect(() => {
    if (!socketEmployer || idUser) return;
    const handleLoadMore = () => loadMore(setHistoryChat);
    socketEmployer.on("SERVER_RETURN_REQUEST_LOADMORE", handleLoadMore);
    return () => {
      socketEmployer.off("SERVER_RETURN_REQUEST_LOADMORE", handleLoadMore);
    };
  }, [socketEmployer, idUser]);

  return (
    <div className="chat-box chat-box-layout">
      <div className="row gx-0">
        <div className="col-3">
          <LeftChatBox  idUser={idUser}  historyChat = {historyChat}/>
        </div>
        <div className="col-6 reset-button-employer">
          {idUser ? (
            <MidChatBox
              loadMore= {()=>{loadMore(setHistoryChat)}}
              contentChat={contentChat}
              userData={userData}
              socket={socketEmployer}
            />
          ) : (
            <EmptyChatBox role="employer" />
          )}
        </div>
        <div className="col-3 reset-button-employer">
          <RightChatBox />
        </div>
      </div>
    </div>
  );
}
export default ChatBox;
