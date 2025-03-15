
import { Modal, notification } from "antd";
import { useEffect, useState } from "react";
import FormExperience from "./FormExperience";
import { getSkillList } from "../../../../services/clients/skillApi";

const ExperienceModal = ({
  open,
  setOpen,
  getData,
  experience,
  experiences,
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
        title="Kinh nghiệm"
        open={open}
        footer={null}
      >
        <FormExperience
          skills={skills}
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
