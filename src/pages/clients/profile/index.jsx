import { Avatar, Card, Flex, List, Space, Typography } from "antd";
import "./profile.scss";
import UploadImage from "../../../components/alls/UploadImage";
import ExperienceModal from "./ExperienceModal";

const Profile = () => {
  const { Title, Text } = Typography;

  return (
    <>
      <div className="col-8">
        <div className="profile">
          <Card className="box-profile" extra={<>+</>} title={"Học vấn"}>
            <List className="box-profile__list" itemLayout="vertical">
              <List.Item className="box-profile__item" extra={<ExperienceModal />} actions={[<><div>cc</div></>]}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://static.topcv.vn/school_logos/c7679964258d8323fd8e95779b481665-5cde1bcebd071.jpg`}
                    />
                  }
                  title={"Cao Đẳng Sư Phạm Hưng Yên"}
                  description={
                    <Space direction="vertical">
                      <span>Aerospace Engineering</span>
                      <span>09/2016 - Hiện tại</span>
                    </Space>
                  }
                />
                <div style={{paddingLeft: "48px"}}>content</div>
              </List.Item>
              <List.Item className="box-profile__item" extra={<ExperienceModal />}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://static.topcv.vn/school_logos/c7679964258d8323fd8e95779b481665-5cde1bcebd071.jpg`}
                    />
                  }
                  title={"Cao Đẳng Sư Phạm Hưng Yên"}
                  description={
                    <Space direction="vertical">
                      <span>Aerospace Engineering</span>
                      <span>09/2016 - Hiện tại</span>
                    </Space>
                  }
                />
              </List.Item>
            </List>
            {/* <UploadImage /> */}
          </Card>
        </div>
      </div>
      
    </>
  );
};
export default Profile;
