import { useEffect, useState } from "react";
import "./profile.scss";
import { getProfile } from "../../../services/clients/user-userApi";
import ExperienceCard from "./Experience/ExperienceCard";
import { Space } from "antd";
import EducationCard from "./Education/EducationCard";

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
      setLoadingProfile(false)
    }
    getProfile();
  }, []);

  return (
    <>
      <div className="col-8">
        <Space direction="vertical" size="large" style={{width: "100%"}}>
          <EducationCard getData={getData} loading={loadingProfile} profile={profile} />
          <ExperienceCard getData={getData} loading={loadingProfile} profile={profile} />
        </Space>
      </div>
    </>
  );
};
export default Profile;
