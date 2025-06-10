import { Avatar, Button, Card, Flex, Image, List, Rate, Space, Typography } from "antd";
import { PlusSquareOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import SkillModal from "./SkillModal";

const SkillCard = ({canAddOrEdit, profile, loading, getData}) => {
  const [open, setOpen] = useState(false);
  const [skill, setSkill] = useState();

  const handleAdd = () => {
    setOpen(true);
    setSkill(undefined);
  }

  return (
    <>
      <div className="profile-card">
        <Card
          loading={loading}
          className="box-profile"
          extra={canAddOrEdit && 
            profile?.skills?.length > 0 && (
              <Flex>
                <PlusSquareOutlined
                  className="icon-edit"
                  onClick={handleAdd}
                />
              </Flex>
            )
          }
          title={"Kỹ năng"}
        >
          {!profile?.skills || profile.skills?.length === 0 ? (
            <Flex align="center">
              {canAddOrEdit ? (
                <Space size={"large"} direction="vertical" style={{width: "50%"}}>
                <Typography.Text style={{fontSize: "20px"}}>
                  Cập nhật thông tin kỹ năng của bạn 
                </Typography.Text>
              </Space>
              ) : (
                <Space size={"large"} direction="vertical" style={{width: "50%"}}>
                  <Typography.Text style={{fontSize: "20px"}}>
                    Không có thông tin kỹ năng
                  </Typography.Text>
                </Space>
              )}
              <Avatar size={150} src={"https://www.topcv.vn/v3/profile/profile-png/profile-skills.png"} shape="square" style={{marginLeft: "auto"}} className="ml-5"/>
            </Flex>
          ) : (
            <List className="box-profile__list" itemLayout="vertical">
              {profile?.skills?.map((item, index) => (
                <List.Item
                  key={index}
                  className="box-profile__item"
                  extra={canAddOrEdit && 
                    <EditOutlined
                      className="icon-edit"
                      onClick={() => {
                        setOpen(true);
                        setSkill(item);
                      }}
                    />
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={60}
                        src={`https://www.topcv.vn/v3/profile/profile-icon-svg/icon-skills.svg`}
                      />
                    }
                    title={item.title}
                    description={
                      <Rate style={{fontSize: "28px"}} disabled allowHalf value={parseFloat(item.rate)}/>
                    }
                  />
                  <Space
                    style={{ paddingLeft: "76px", width: "100%" }}
                    direction="vertical"
                  >
                    {item?.description && (
                      <Typography.Paragraph
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {item.description}
                      </Typography.Paragraph>
                    )}
                  </Space>
                </List.Item>
              ))}
            </List>
          )}
        </Card>
      </div>
      <SkillModal
        open={open}
        setOpen={setOpen}
        getData={getData}
        skill={skill}
        skills={profile?.skills || []}
      />
    </>
  );
};
export default SkillCard;
