
import { Modal, notification } from "antd";
import { useEffect, useState } from "react";
import FormExperience from "./FormExperience";

const ExperienceModal = ({
  open,
  setOpen,
  getData,
  experience,
  experiences,
}) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        style={{ top: 20 }}
        onCancel={() => setOpen(false)}
        width={"50%"}
        title="Kinh nghiệm"
        open={open}
        footer={null}
      >
        <FormExperience
          getData={getData}
          experience={experience}
          experiences={experiences}
          closeModal={() => setOpen(false)}
          api={api}
        />
      </Modal>
    </>
  );
};
export default ExperienceModal;
