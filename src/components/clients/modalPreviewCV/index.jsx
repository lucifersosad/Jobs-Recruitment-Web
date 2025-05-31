import { Button, Modal, Spin } from "antd";
import { useEffect, useState } from "react";

import { convertFileCvDriverToUrl } from "../../../helpers/convertFileCvDriverToUrl";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import catLoading from "/images/cat.gif";
import { getPdfToDriverClient } from "../../../services/clients/jobsApi";
import { getMyCvFile } from "../../../services/clients/myCvsApi";
function ModalPreviewCV({ isModalOpen, setIsModalOpen, record }) {
  const [linkPdf, setLinkPdf] = useState("");
  const [loadingCv, setLoadingCv] = useState(true);
  const [idFilBackup, setIdFilBackup] = useState("");

  const showModal = async () => {
    try {
      if (record.linkFile) {
        setLinkPdf(record.linkFile)
        return;
      }
      const idFile = record?.idFile || "";
      if (idFilBackup === idFile) return;
      if (idFile) {
        setIdFilBackup(idFile);
        const result = await getMyCvFile(idFile);
        if (result.code === 200) {
          const url = convertFileCvDriverToUrl(result.data);
          setLinkPdf(url);
        }
      }
    } catch (error) {
      console.log("🚀 ~ showModal ~ error:", error)
      setLinkPdf(null) 
    }
  };

  useEffect(() => {
    showModal()
  }, [isModalOpen])

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleDocumentLoad = () => {
    setLoadingCv(false);
  };
  return (
    <>
      <Modal
        title="Xem CV"
        open={isModalOpen}
        onOk={handleCancel}
        className="model-view-cv-client"
        onCancel={handleCancel}
        width={950}
        height={700}
        footer={[
          <Button
            style={{ background: "rgb(87, 213, 252)" }}
            key="submit"
            type="primary"
            onClick={handleCancel}
          >
            Xong
          </Button>,
        ]}
        style={{
          top: 20,
        }}
      >
        <div className="full-info">
          <div
            className="view-cv"
            style={{ width: "100%", height: loadingCv ? "680px" : "100%" }}
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
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              {linkPdf && (
                <Worker
                  style={{ width: "100%", height: "750px" }}
                  workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"
                >
                  <Viewer
                    style={{ width: "100%", height: "750px" }}
                    defaultScale={1.5}
                    onDocumentLoad={handleDocumentLoad}
                    fileUrl={linkPdf}
                  />
                </Worker>
              )}
            </Spin>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default ModalPreviewCV;
