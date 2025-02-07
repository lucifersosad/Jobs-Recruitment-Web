import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import TinyMce from "../../../components/admins/tinyEditor";
import { LoadingOutlined } from "@ant-design/icons";
import {
  editCategories,
  getTreeCategories,
} from "../../../services/admins/jobsCategoriesApi";
import { SelectTree } from "../../../helpers/selectTree";
import { convertThumbUrl } from "../../../helpers/convertThumbUrl";
import { decData } from "../../../helpers/decData";
import {
  handleCancel,
  handleUpdateDataAccounts,
  handleUpdateDataCategories,
} from "../../../helpers/modelHelper";
import { handleFileChange } from "../../../helpers/imagesHelper";
import { getContentTiny } from "../../../helpers/getContentTinymce";
import { editAdmins } from "../../../services/admins/adminsApi";
import { formatDate, formatDateTime } from "../../../helpers/formartDate";

function FormView(props) {
  const { record } = props;
  const { Text, Link } = Typography;
  const [isModal, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  return (
    <>
      <span
        onClick={() => handleUpdateDataAccounts(form, setIsModalOpen, record)}
        className="button-eye"
      >
        <EyeOutlined />
      </span>
      <Modal
        centered
        open={isModal}
        onCancel={() => handleCancel(form, setIsModalOpen)}
        footer={null}
        width={"50%"}
      >
        <Space
          direction="vertical"
          size="middle"
          style={{ width: "100%" }}
          split={<Divider type="horizontal" style={{ margin: 0 }} />}
        >
          <Flex gap="middle" align="center">
            <Avatar src={record.avatar} alt={record.avatar} size="large" />
            <Flex vertical>
              <Text strong>{record.fullName}</Text>
              <Text type="secondary">{record.email}</Text>
            </Flex>
          </Flex>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Card size="small">
              <List itemLayout="vertical">
                <List.Item>
                  <Row>
                    <Col span={12}>
                      <Flex vertical>
                        <Text type="secondary">Email</Text>
                        <Text>{record.email}</Text>
                      </Flex>
                    </Col>
                    <Col span={12}>
                      <Flex vertical>
                        <Text type="secondary">Số Điện Thoại</Text>
                        <Text>{record.phoneNumber}</Text>
                      </Flex>
                    </Col>
                  </Row>
                </List.Item>
                <List.Item>
                  <Row>
                    <Col span={12}>
                      <Flex vertical>
                        <Text type="secondary">Giới Tính</Text>
                        <Text>{record.gender}</Text>
                      </Flex>
                    </Col>
                    <Col span={12}>
                      <Flex vertical>
                        <Text type="secondary">Vai Trò</Text>
                        <Text>{record.role_id.title}</Text>
                      </Flex>
                    </Col>
                  </Row>
                </List.Item>
                <List.Item>
                  <Row>
                    <Col span={12}>
                      <Flex vertical>
                        <Text type="secondary">Địa Chỉ</Text>
                        <Text>{record.address}</Text>
                      </Flex>
                    </Col>
                  </Row>
                </List.Item>
              </List>
            </Card>
            <Card size="small">
              <List itemLayout="vertical">
                <List.Item>
                  <Row>
                    <Col span={12}>
                      <Flex vertical>
                        <Text type="secondary">Ngày Tạo</Text>
                        <Text>{formatDate(record.createdAt)}</Text>
                      </Flex>
                    </Col>
                    <Col span={12}>
                      <Flex vertical>
                        <Text type="secondary">Cập Nhật Gần Nhất</Text>
                        {record.updatedBy.length > 0 && (
                          <Text>
                            {`${formatDateTime(
                              record.updatedBy[record.updatedBy.length - 1]
                                .updatedAt
                            )} - ${
                              record.updatedBy[record.updatedBy.length - 1]
                                .email
                            }
                            `}
                          </Text>
                        )}
                      </Flex>
                    </Col>
                  </Row>
                </List.Item>
              </List>
            </Card>
          </Space>
        </Space>
      </Modal>
    </>
  );
}
export default FormView;
