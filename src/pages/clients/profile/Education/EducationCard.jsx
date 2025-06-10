import { Avatar, Button, Card, Flex, Image, List, Space, Typography } from "antd";
import { PlusSquareOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import EducationModal from "./EducationModal";

const EducationCard = ({canAddOrEdit, profile, loading, getData}) => {
  const [open, setOpen] = useState(false);
  const [education, setEducation] = useState();

  const handleAdd = () => {
    setOpen(true);
    setEducation(undefined);
  }

  return (
    <>
      <div className="profile-card">
        <Card
          loading={loading}
          className="box-profile"
          extra={canAddOrEdit && 
            profile?.educations?.length > 0 && (
              <Flex>
                <PlusSquareOutlined
                  className="icon-edit"
                  onClick={handleAdd}
                />
              </Flex>
            )
          }
          title={"Học vấn"}
        >
          {profile?.educations && profile?.educations?.length === 0 ? (
            <Flex align="center">
              {canAddOrEdit ? (
                <Space size={"large"} direction="vertical" style={{width: "50%"}}>
                <Typography.Text style={{fontSize: "20px"}}>
                  Cập nhật thông tin học vấn của bạn 
                </Typography.Text>
              </Space>
              ): (
                <Space size={"large"} direction="vertical" style={{width: "50%"}}>
                  <Typography.Text style={{fontSize: "20px"}}>
                    Không có thông tin học vấn
                  </Typography.Text>
                </Space>
              )}
              <Avatar size={150} src={"https://www.topcv.vn/v3/profile/profile-png/profile-education.png"} shape="square" style={{marginLeft: "auto"}} className="ml-5"/>
            </Flex>
          ) : (
            <List className="box-profile__list" itemLayout="vertical">
              {profile?.educations?.map((item, index) => (
                <List.Item
                  key={index}
                  className="box-profile__item"
                  extra={canAddOrEdit && 
                    <EditOutlined
                      className="icon-edit"
                      onClick={() => {
                        setOpen(true);
                        setEducation(item);
                      }}
                    />
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <img style={{width: "60px", height: "full"}} src={item.school_logo || `https://www.topcv.vn/v3/profile/profile-icon-svg/icon-education.svg`}/>
                    }
                    title={item.school_name}
                    description={
                      <Space direction="vertical">
                        <span>{item.title}</span>
                        <span>
                          {`${item.start_month}/${item.start_year} - ` +
                            (item.end_month && item.end_year
                              ? `${item.end_month}/${item.end_year}`
                              : "Hiện tại")}
                        </span>
                      </Space>
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
      <EducationModal
        open={open}
        setOpen={setOpen}
        getData={getData}
        education={education}
        educations={profile?.educations || []}
      />
    </>
  );
};
export default EducationCard;
