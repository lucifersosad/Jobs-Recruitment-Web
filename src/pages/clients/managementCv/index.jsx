import { Button, Form, Input, Modal, Popconfirm, Space, Switch, Table, Tooltip, Typography } from "antd";
import banner from "./images/banner.png";
import "./managementCv.scss";
import { useEffect, useState } from "react";
import {
  editCvByUser,
  getCvByUser,
} from "../../../services/clients/user-userApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import DemoCvProfile from "../../../components/clients/demoCVProfile";
import MemoizedItemBoxCustom from "../../../components/clients/itemBoxCustom";
import { editMyCv, getMyCvs } from "../../../services/clients/myCvsApi";
import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import useIsMobile from "../../../hooks/useIsMobile";
function ManagementCv() {
  const [data, setData] = useState([]);
  const isMobile = useIsMobile();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false)
  const { Link } = Typography
  const showModal = (value) => {
    form.setFieldsValue({
      idCv: value._id,
      nameFile:value.nameFile.replace(".pdf", ""),
      is_primary: value.is_primary,
    });
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const fetchApi = async () => {
    const result = await getMyCvs();
    if (result.code === 200) {
      setData(result.data);
    }
  };
  useEffect(() => {
    fetchApi();
  }, []);

  const handleEditCv = async (valueForm) => {
    try {
      if (valueForm.idCv && valueForm.nameFile) {
        valueForm.newNameCv = valueForm.nameFile + ".pdf";
      }
      const result = await editMyCv(valueForm);
      if (result.code === 200) {
        fetchApi();
        handleCancel();
      }
    } catch (error) {
      console.log("🚀 ~ handleEditCv ~ error:", error)
    }
  };

  const handleDeleteCv = async (idCv) => {
    try {
      const data = {
        idCv,
        is_deleted: true
      }
      const result = await editMyCv(data);
      if (result.code === 200) {
        fetchApi();
      }
    } catch (error) {
      console.log("🚀 ~ handleDeleteCv ~ error:", error)
    }
  };

  const columns = [
    {
      title: "Tên CV",
      dataIndex: "nameFile",
      key: "nameFile",
      align: "center",
      render: (text, record) => (
        <span title={text} className="label-ok">
          {text}{" "}
          {record?.is_primary && <Link>{"("}Chính{")"}</Link>}
        </span>
      ),
    },

    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
   
        return (
          <Space className="box-button" size="middle">
            <DemoCvProfile record={record} />
            
            <Tooltip title="Chỉnh sửa">
              <Button onClick={()=>{showModal(record)}} shape="circle" icon={<EditOutlined />} style={{background: "#ddd"}} type="primary"/>
            </Tooltip>
            <Popconfirm
              okButtonProps={{ danger: true, loading: loadingDelete }}
              title="Xóa CV"
              description="Bạn Có Muốn Xóa CV Này Không ?"
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => {
                handleDeleteCv(record?._id)
              }}
            >
              <Button color="danger" danger type="primary" shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
            {/* <button onClick={()=>{showModal(record)}} className="edit">
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>Chỉnh sử CV</span>
            </button> */}
            <Modal
              title="Chỉnh sửa CV Upload"
              className="modal-edit-cv"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                form={form}
                className="form-controller"
                layout="vertical"
                onFinish={(valueForm) => {
                  handleEditCv(valueForm);
                }}
             
              >
                <Form.Item
                  hidden
                  name="idCv"
                >
                  <Input size="large" suffix=".pdf" />
                </Form.Item>
                <Form.Item
                  label="Tên CV (thường là vị trí ứng tuyển)"
                  name="nameFile"
                  rules={[{ required: true, message: "Vui lòng nhập tên CV" }]}
                >
                  <Input size="large" suffix=".pdf"/>
                </Form.Item>
                <Form.Item
                  label="Đặt làm CV chính"
                  name="is_primary"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  className="form-submit"
                  style={{ textAlign: "right" }}
                >
                  <span onClick={handleCancel}>Hủy</span>
                  <button type="submit">Cập nhật</button>
                </Form.Item>
              </Form>
            </Modal>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="col-8">
      <div className="box-settings-info mb-3">
        <div className="management-cv">
          <div className="banner mb-2">
            <img src={banner} alt="banne-cv.jpg" />
          </div>
          <div className="content">
            <div className="title">Quản lý CV</div>
            <div className="table">
              <Table rowKey={"_id"} columns={columns} dataSource={data} size={isMobile ? "small" : "middle"} />
            </div>
          </div>
        </div>
      </div>
      <div className="box-settings-info">
        <MemoizedItemBoxCustom/>
      </div>
    </div>
  );
}
export default ManagementCv;
