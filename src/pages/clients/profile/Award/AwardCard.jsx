import { Avatar, Button, Card, Flex, Image, List, Space, Typography } from "antd";
import { PlusSquareOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";

const AwardCard = ({profile, loading, getData}) => {
  const [open, setOpen] = useState(false);
  const [experience, setExperience] = useState();

  const handleAdd = () => {
    setOpen(true);
    setExperience(undefined);
  }

  const handleEdit = (item) => {
    setOpen(true);
    setExperience(item);
  }

  return (
    <>
      <div className="profile-card">
        <Card
          loading={loading}
          className="box-profile"
          extra={
            profile?.experiences?.length > 0 && (
              <Flex>
                <PlusSquareOutlined
                  className="icon-edit"
                  onClick={handleAdd}
                />
              </Flex>
            )
          }
          title={"Giải thưởng"}
        >
          {!profile?.awards || profile?.awards?.length === 0 ? (
            <Flex align="center">
              <Space size={"large"} direction="vertical" style={{width: "50%"}}>
                <Typography.Text style={{fontSize: "20px"}}>
                  Cập nhật thông tin giải thưởng của bạn 
                </Typography.Text>
                <Button type="primary" ghost size="large" onClick={handleAdd}>Thêm mục</Button>
              </Space>
              <Avatar size={150} src={"https://www.topcv.vn/v3/profile/profile-png/profile-prize.png"} shape="square" style={{marginLeft: "auto"}} className="ml-5"/>
            </Flex>
          ) : (
            <List className="box-profile__list" itemLayout="vertical">
              {profile?.experiences?.map((item, index) => (
                <List.Item
                  key={index}
                  className="box-profile__item"
                  extra={
                    <EditOutlined
                      className="icon-edit"
                      onClick={() => handleEdit(item)}
                    />
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={60}
                        src={`https://www.topcv.vn/v3/profile/profile-icon-svg/icon-exp.svg`}
                      />
                    }
                    title={item.company_name}
                    description={
                      <Space direction="vertical">
                        <span>{item.position_name}</span>
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
                    <Image.PreviewGroup
                      preview={{
                        onChange: (current, prev) =>
                          console.log(
                            `current index: ${current}, prev index: ${prev}`
                          ),
                      }}
                    >
                      <Flex
                        direction="horizontal"
                        wrap="wrap"
                        gap={"20px"}
                        justify="space-between"
                        align="center"
                      >
                        {item?.attachments?.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              height: "300px",
                              width: "calc(50% - 10px)",
                              border: "1px solid #ddd",
                            }}
                          >
                            <Image
                              height={"100%"}
                              width={"100%"}
                              src={item?.image}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        ))}
                      </Flex>
                    </Image.PreviewGroup>
                  </Space>
                </List.Item>
              ))}
            </List>
          )}
        </Card>
      </div>
    </>
  );
};
export default AwardCard;
