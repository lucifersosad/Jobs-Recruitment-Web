import { memo, useCallback, useEffect, useState } from "react";
import { getPdfToDriver } from "../../../services/employers/jobsApi";
import { convertFileCvDriverToUrl } from "../../../helpers/convertFileCvDriverToUrl";
import { Spin } from "antd";
import catLoading from "./images/cat.gif";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { getMyCvFile } from "../../../services/employers/myCvsApi";

function CvProfileUser({ record }) {
  const [linkCv, setLinkCv] = useState("");
  console.log("🚀 ~ CvProfileUser ~ linkCv:", linkCv)
  // dùng state linkCv để lưu trữ link cv cho đỡ bị render lại nhiều lần
  const [loadingCv, setLoadingCv] = useState(true);

  const fetchApi = async () => {
    try {
      if (Object.keys(record).length === 0) return;

      const cvPrimary = record?.cv?.find(item => item?.is_primary) || record?.cv[0]

      const cv = cvPrimary || "";
      const idFile = cv?.idFile || "";

      if (idFile) {
        const result = await getMyCvFile(idFile)
        console.log("🚀 ~ fetchApi ~ response:", result)
      if (result.code === 200) {
          const url = convertFileCvDriverToUrl(result.data);
          setLinkCv(url);
        } else {
          setLinkCv("")
        }
      }
    } catch (error) {
      console.log("🚀 ~ fetchApi ~ error:", error)
      setLinkCv("")
    }
    setLoadingCv(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);
  

  const handleDocumentLoad = () => {
    setLoadingCv(false);
  };

  return (
    <div>
      <div className="title mb-3">CV PROFILE USER</div>
      <div
        className="model-view-cv-info model-view-cv"
        style={{ width: "100%", height: loadingCv ? "474px" : "100%" }}
      >
        <Spin
          indicator={
            <img
              style={{
                width: "300px",
                height: "300px",
              }}
              src={catLoading}
            />
          }
          spinning={loadingCv}
        >
          {!loadingCv && (record?.cv?.length === 0 || linkCv === "") && <div>Người dùng chưa có CV</div>}
          {linkCv && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                defaultScale={1.2}
                onDocumentLoad={handleDocumentLoad}
                fileUrl={linkCv}
              />
            </Worker>
          )}
        </Spin>
      </div>
    </div>
  );
}
const MemoizedCvProfileUser = memo(CvProfileUser);
export default MemoizedCvProfileUser;
