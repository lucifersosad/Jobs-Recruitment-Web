import { useEffect, useState } from "react";
import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./profile.scss";
import { getProfile } from "../../../services/clients/user-userApi";
import ExperienceCard from "./Experience/ExperienceCard";
import { Avatar, Card, Flex, Space, Typography } from "antd";
import EducationCard from "./Education/EducationCard";
import SkillCard from "./Skill/SkillCard";
import MemoizedNewsJobHeader from "../../../components/clients/newsJobHeader";
import AwardCard from "./Award/AwardCard";
import CertificationCard from "./Certification/CertificationCard";
import ProjectCard from "./Project/ProjectCard";
import { useParams } from "react-router-dom";
import InfoModal from "./Info/InfoModal";

const Profile = () => {
  const { id } = useParams();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState();

  const getData = async () => {
    const result = await getProfile(id);
    setProfile(result?.data);
  };

  useEffect(() => {
    const getProfile = async () => {
      await getData();
      setLoadingProfile(false);
    };
    getProfile();
  }, []);

  return (
    <>
      <div className="col-8">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card
            bordered={false}
            cover={<MemoizedNewsJobHeader />}
            actions={[
              <Space key="edit" align="center" onClick={() => setOpen(true)}>
                <EditOutlined />
                <Typography.Text strong>Chỉnh sửa</Typography.Text> 
              </Space>,
              <Space key="download" align="center">
                <DownloadOutlined />
                <Typography.Text strong>Tải xuống</Typography.Text> 
              </Space>,
              <Space key="share" align="center">
                <ShareAltOutlined />
                <Typography.Text strong>Chia sẻ</Typography.Text> 
              </Space>,
            ]}
          >
            <Card.Meta
              avatar={
                <Avatar
                  style={{ width: "150px", overflow: "visible" }}
                  src={
                    <img
                      style={{
                        width: "100%",
                        height: "150px",
                        position: "absolute",
                        left: 0,
                        top: "-100px",
                        boxShadow: "0 3px 12px -8px rgba(0,0,0,.75)",
                        borderRadius: "50%",
                      }}
                      src={profile?.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                      alt="avatar"
                    />
                  }
                />
              }
              title={profile?.fullName}
              description={profile?.jobTitle || "[Chưa cập nhật]"}
            />
            <Typography.Paragraph style={{marginTop: "20px"}}>{profile?.jobObjective}</Typography.Paragraph>
          </Card>
          <EducationCard
            getData={getData}
            loading={loadingProfile}
            profile={profile}
          />
          <ExperienceCard
            getData={getData}
            loading={loadingProfile}
            profile={profile}
          />
          <SkillCard
            getData={getData}
            loading={loadingProfile}
            profile={profile}
          />
          <CertificationCard 
            loading={loadingProfile}
            profile={profile}
          />
          <AwardCard 
            loading={loadingProfile}
            profile={profile}
          />
          <ProjectCard
            loading={loadingProfile}
            profile={profile}
          />
        </Space>
      </div>
      <InfoModal open={open} setOpen={setOpen} getData={getData} profile={profile}/>
    </>
  );
};
export default Profile;
