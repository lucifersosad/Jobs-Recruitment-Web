import { Alert, message, Modal, notification, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileZipper } from "@fortawesome/free-regular-svg-icons";
import { handleFileChangeCustom } from "../../../helpers/imagesHelper";
import { convertThumbUrl } from "../../../helpers/convertThumbUrl";
import { uploadCV } from "../../../services/clients/user-userApi";
import uploadCloud from "/images/upload-cloud.webp";
import { extractMyCv } from "../../../services/clients/myCvsApi";

const DropCvModal = ({ open, setOpen, handleImportCv }) => {
  const [filePdf, setFilePdf] = useState(null);
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const refFile = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleChanges = (e) => {
    if (e.target.files.length === 0) return;
    if (
      e.target.files[0].type !== "application/pdf" &&
      e.target.files[0].size > 5 * 1024 * 1024
    ) {
      setWarning(true);
      return;
    }
    setFilePdf(e.target.files[0]);
    setWarning(false);
  };

  //Hàm này để mở file input lấy ảnh
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    refFile.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      for (var i = 0; i < 1; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          var file = e.dataTransfer.items[i].getAsFile();
          if (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
            setFilePdf(e.dataTransfer.files[0]);
            setWarning(false);
            // Note: refFile.current.files is read-only, so you can't directly assign new files to it
          } else {
            setWarning(true);
          }
        }
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let objectNew = {};
      if (!filePdf) {
        messageApi.open({
          type: "error",
          content: "Vui lòng chọn CV!",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();

      if (filePdf) {
        console.log("🚀 ~ handleSubmit ~ filePdf:", filePdf);
        formData.append("file", filePdf);
      }

      const result = await extractMyCv(formData);
      console.log("🚀 ~ handleSubmit ~ result:", result);

      if (result.code === 200) {
        messageApi.success({
          type: "success",
          content: result.success,
        });
        handleImportCv(result.data)
        setOpen(false)
      } else {
        messageApi.error({
          type: "error",
          content: result.error,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      messageApi.error({
        type: "error",
        content: "Lỗi gì đó rồi!",
      });
      setLoading(false);
      console.log(error);
    }
  };

  const converToFormData = (data) => {
    const formData = new FormData();

    return formData;
  };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        onCancel={() => setOpen(false)}
        width={"50%"}
        title="Upload CV"
        open={open}
        footer={null}
        centered
      >
        <div className="box-upload-cv" style={{ padding: 0 }}>
          <div className="body-upload-cv mb-2">
            <div className="form-ok mb-3">
              {warning && (
                <Alert
                  className="mb-3"
                  onClose={() => setWarning(false)}
                  message="Thông báo"
                  description="Bạn chỉ được upload file theo định dạng PDF và kích thước file nhỏ hơn 5MB."
                  type="warning"
                  showIcon
                  closable
                />
              )}
              <Spin spinning={loading}>
                <div
                  className="form-upload"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    onChange={handleChanges}
                    ref={refFile}
                    type="file"
                    style={{ display: "none" }}
                  />
                  <div className="box-css">
                    <div className="headt mb-2">
                      <img src={uploadCloud} alt="upload-cloud" />
                      <span>Tải lên Cv từ máy tính, chọn kéo thả</span>
                    </div>
                    <div className="bodyt mb-2">
                      <span>Hỗ trợ định dạng PDF có kích thước dưới 5MB</span>
                    </div>
                    <div className="footert">
                      {filePdf && (
                        <div className="view-file mb-2">
                          <FontAwesomeIcon icon={faFile} />
                          <span>{filePdf?.name}</span>
                        </div>
                      )}

                      <button onClick={onButtonClick}>Chọn CV</button>
                    </div>
                  </div>
                </div>
              </Spin>
            </div>
            <div className="button-ok">
              <button onClick={handleSubmit}>Tải CV lên</button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default DropCvModal;
