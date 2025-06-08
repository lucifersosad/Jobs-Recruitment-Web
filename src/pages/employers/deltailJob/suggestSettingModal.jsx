
import { Modal, notification } from "antd";
import { useEffect, useState } from "react";

const SuggestSettingModal = ({
  open,
  setOpen,
  getData,
  skill,
  skills,
}) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <Modal
        centered
        destroyOnClose
        // style={{ top: 20 }}
        onCancel={() => setOpen(false)}
        width={"50%"}
        title="Cài đặt chân dung ứng viên"
        open={open}
        footer={null}
      >
        <div style={{height: "400px"}}></div>
      </Modal>
    </>
  );
};
export default SuggestSettingModal;
