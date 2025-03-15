import "./profile.scss";
import { getProfile } from "../../../services/clients/user-userApi";
import { useEffect, useState } from "react";
import ExperienceCard from "./ExperienceCard";

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
        <div style={{marginBottom: "15px"}}>
          <ExperienceCard getData={getData} loading={loadingProfile} profile={profile} />
        </div>
        <div style={{marginBottom: "15px"}}>
          <ExperienceCard getData={getData} loading={loadingProfile} profile={profile} />
        </div>
        <div style={{marginBottom: "15px"}}>
          <ExperienceCard getData={getData} loading={loadingProfile} profile={profile} />
        </div>
      </div>
    </>
  );
};
export default Profile;
