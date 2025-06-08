
import { Modal, notification } from "antd";

import FormInfo from "./FormInfo";

const InfoModal = ({
  open,
  setOpen,
  getData,
  profile
}) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        // centered
        style={{ top: 20 }}
        onCancel={() => setOpen(false)}
        width={"50%"}
        title="Thông tin cá nhân"
        open={open}
        footer={null}
      >
        <FormInfo
          profile={profile}
          getData={getData}
          closeModal={() => setOpen(false)}
          api={api}
        />
      </Modal>
    </>
  );
};
export default InfoModal;
