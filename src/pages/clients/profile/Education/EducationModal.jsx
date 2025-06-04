
import { Modal, notification } from "antd";
import { useEffect, useState } from "react";
import FormEducation from "./FormEducation";

const EducationModal = ({
  open,
  setOpen,
  getData,
  education,
  educations,
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
        title="Học vấn"
        open={open}
        footer={null}
      >
        <FormEducation
          getData={getData}
          education={education}
          educations={educations}
          closeModal={() => setOpen(false)}
          api={api}
        />
      </Modal>
    </>
  );
};
export default EducationModal;
