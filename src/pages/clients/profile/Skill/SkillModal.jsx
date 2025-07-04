
import { Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { getSkillList } from "../../../../services/clients/skillApi";
import FormSkill from "./FormSkill";

const SkillModal = ({
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
        destroyOnClose
        style={{ top: 20 }}
        onCancel={() => setOpen(false)}
        width={"50%"}
        title="Kỹ năng"
        open={open}
        footer={null}
      >
        <FormSkill
          getData={getData}
          skill={skill}
          skills={skills}
          closeModal={() => setOpen(false)}
          api={api}
        />
      </Modal>
    </>
  );
};
export default SkillModal;
