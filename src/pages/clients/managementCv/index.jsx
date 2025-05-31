import { Form, Input, Modal, Space, Table } from "antd";
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
function ManagementCv() {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (value) => {
    form.setFieldsValue({
      idCv: value._id,
      nameFile:value.nameFile.replace(".pdf", "")
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
    if (valueForm.idCv && valueForm.nameFile) {
      valueForm.newNameCv = valueForm.nameFile + ".pdf";
    }
    console.log("🚀 ~ handleEditCv ~ valueForm:", valueForm)
    const result = await editMyCv(valueForm);
    console.log("🚀 ~ handleEditCv ~ result:", result)
    if (result.code === 200) {
      fetchApi();
      handleCancel();
    }
    if (result.code === 201) {
      handleCancel();
    }
  };
  const columns = [
    {
      title: "Tên CV",
      dataIndex: "nameFile",
      key: "nameFile",
      align: "center",
      render: (text) => (
        <span title={text} className="label-ok">
          {text}
        </span>
      ),
    },

    {
      title: "Chức năng",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
   
        return (
          <Space className="box-button" size="middle">
            <DemoCvProfile record={record} />
            <button onClick={()=>{showModal(record)}} className="edit">
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>Chỉnh sử CV</span>
            </button>
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
                  className="form-submit"
                  style={{ textAlign: "right" }}
                  rules={[{ required: true, message: "Vui lòng nhập tên CV" }]}
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
              <Table rowKey={"_id"} columns={columns} dataSource={data} />
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
