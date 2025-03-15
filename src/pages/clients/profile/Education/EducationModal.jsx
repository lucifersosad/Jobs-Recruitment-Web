
import { Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { getSkillList } from "../../../../services/clients/skillApi";
import FormEducation from "./FormEducation";

const EducationModal = ({
  open,
  setOpen,
  getData,
  education,
  educations,
}) => {
  const [skills, setSkills] = useState();
  const [api, contextHolder] = notification.useNotification();

  const getDataDropdown = async () => {
    const skills = await getSkillList();
    setSkills(skills)
  }

  useEffect(() => {
    getDataDropdown()
  }, [])

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
          skills={skills}
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
