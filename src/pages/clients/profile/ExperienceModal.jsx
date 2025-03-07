import { EditOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { handleCancel } from "../../../helpers/modelHelper";
import FormExperience from "./FormExperience";

const ExperienceModal = () => {
  
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditOutlined className="icon-edit" onClick={() => setOpen(true)}/>

      <Modal
        centered
        onCancel={() => handleCancel("", setOpen)}
        width={"50%"}
        title="Kinh nghiệm"
        className="reset-button-employer"
        open={open}
        footer={null}
      >
        <FormExperience />
      </Modal>
    </>
  );
};
export default ExperienceModal;
