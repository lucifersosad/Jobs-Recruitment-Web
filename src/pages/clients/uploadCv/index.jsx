import { useRef, useState } from "react";
import banner from "./images/banner.png";
import uploadCloud from "./images/upload-cloud.webp";
import "./uploadCv.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileZipper } from "@fortawesome/free-regular-svg-icons";
import { Alert, Spin, message } from "antd";
import { handleFileChangeCustom } from "../../../helpers/imagesHelper";
import { convertThumbUrl } from "../../../helpers/convertThumbUrl";
import { uploadCV } from "../../../services/clients/user-userApi";
import {
  faChartColumn,
  faEnvelope,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { uploadMyCv } from "../../../services/clients/myCvsApi";

function UploadCv() {
  const [filePdf, setFilePdf] = useState(null); // [1
  const [warning, setWarning] = useState(false); // [2
  const [loading, setLoading] = useState(false); // [3
  const [messageApi, contextHolder] = message.useMessage();
  const refFile = useRef(null);
  const handleChanges = (e) => {
    if (e.target.files.length === 0) return;
    console.log("🚀 ~ handleChanges ~ e.target.files[0].type:", e.target.files[0].type)
    if (
      e.target.files[0].type !== "application/pdf" ||
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
  //Hàm này để xử lý kéo thả file vào ô input nó sẽ set file vào state chỉ một file duy nhất
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
  //
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!filePdf) {
        messageApi.open({
          type: "error",
          content: "Vui lòng chọn CV!",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData()

      if (filePdf) {
        formData.append("file", filePdf)
      }

      const result = await uploadMyCv(formData);
      if (result.code === 200) {
        messageApi.success({
          type: "success",
          content: result.success,
        });
      } else {
        messageApi.error({
          type: "error",
          content: result.error,
        });
      }
      setFilePdf(null)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      messageApi.error({
        type: "error",
        content: "Lỗi gì đó rồi!",
      });
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="cb-section cb-section-padding-bottom bg-grey2">
        <div className="container">
        {contextHolder}
      <div className="box-settings-info__banner">
        <div className="left">
          <h1 className="title">
            Upload CV để các cơ hội việc làm tự tìm đến bạn
          </h1>
          <h2 className="sub-title">
            Giảm đến 50% thời gian cần thiết để tìm được một công việc phù hợp
          </h2>
        </div>
        <div className="right">
          <img src={banner} alt="" />
        </div>
      </div>
      <div className="box-upload-cv">
        <div className="head-upload-cv mb-3">
          <p className="desc">
            Bạn đã có sẵn CV của mình, chỉ cần tải CV lên, hệ thống sẽ tự động
            đề xuất CV của bạn tới những nhà tuyển dụng uy tín.
            <br />
            Tiết kiệm thời gian, tìm việc thông minh, nắm bắt cơ hội và làm chủ
            đường đua nghề nghiệp của chính mình.
          </p>
        </div>
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
        <div className="footer-upload-cv">
          <div className="footer-grid">
            <div className="item-box">
              <div className="icon bg-1">
                <FontAwesomeIcon icon={faFileZipper} />
              </div>
              <div className="title">Nhận về các cơ hội tốt nhất</div>
              <div className="sub-title">
                CV của bạn sẽ được ưu tiên trình bày với các nhà tuyển dụng đã
                xác minh, tạo điều kiện thuận lợi cho việc nhận lời mời từ các
                doanh nghiệp hàng đầu và có uy tín.
              </div>
            </div>

            <div className="item-box">
              <div className="icon bg-2">
                <FontAwesomeIcon icon={faChartColumn} />
              </div>
              <div className="title">Theo dõi số liệu, tối ưu CV</div>
              <div className="sub-title">
                Theo dõi số lượt xem CV và nhận thông tin chính xác về các nhà
                tuyển dụng đang quan tâm đến hồ sơ của bạn trên UTEM.
              </div>
            </div>

            <div className="item-box">
              <div className="icon bg-3">
                <FontAwesomeIcon icon={faPaperPlane} />
              </div>
              <div className="title">Chia sẻ CV bất cứ nơi đâu</div>
              <div className="sub-title">
                Upload một lần và sử dụng đường link gửi tới nhiều nhà tuyển
                dụng.
              </div>
            </div>

            <div className="item-box">
              <div className="icon bg-4">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className="title">
                Kết nối nhanh chóng với nhà tuyển dụng
              </div>
              <div className="sub-title">
                Dễ dàng kết nối với các nhà tuyển dụng đang xem và quan tâm đến
                hồ sơ của bạn.
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
    
    </div>
  );
}
export default UploadCv;
