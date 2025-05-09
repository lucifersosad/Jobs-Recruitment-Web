import { useEffect, useState } from "react";
import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  ShareAltOutlined,
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

const Profile = () => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState();

  const getData = async () => {
    const result = await getProfile("67585c031a46cc7de695328b");
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
              <Space key="edit" align="center">
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
                      src="https://static.topcv.vn/avatars/79523b7ead5d51646909902953e80160-67d693e974ad7.jpg"
                      alt="avatar default"
                    />
                  }
                />
              }
              title="Đặng Tiến Phát"
              description="Fullstack Developer"
            />
            <Typography.Paragraph style={{marginTop: "20px"}}>I have the ability to develop user interfaces and experiences and can quickly adapt to learning many other programming languages when needed.</Typography.Paragraph>
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
    </>
  );
};
export default Profile;
