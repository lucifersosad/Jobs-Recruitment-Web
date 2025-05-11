import { PDFViewer } from "@react-pdf/renderer";
import "./previewCv.scss";
import UserCv from "./UserCv";
import UserCvPdf from "./UserCvPdf";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadMyCv, getMyCv } from "../../../services/clients/myCvsApi";
import NotFound from "../notFound";
import { Button, Typography } from "antd";
import { convertFileCvDriverToUrl } from "../../../helpers/convertFileCvDriverToUrl";

const PreviewCv = () => {
  const { idCv } = useParams();
  const [loading, setLoading] = useState(true)
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [cv, setCv] = useState();
  const { Title } = Typography

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyCv(idCv);
        if (response.code === 404) {
          setCv(null)
        } else {
          setCv(response.data);
        }
        setLoading(false)
      } catch (error) {
        console.log("🚀 ~ getData ~ error:", error);
        setCv(null)
      }
    };
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleDownloadCV = async () => {
  //   try {
  //     // const url = "https://s3-utem.s3.ap-southeast-2.amazonaws.com/my-cvs/cv.pdf";
  //     const result = await downloadMyCv(idCv)
  //     console.log("🚀 ~ handleDownloadCV ~ result:", result)
      
  //     return;

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `cv-${idCv}.pdf`;  // tên file khi download
  //     // Nếu bạn đang dùng signed URL từ S3, chắc chắn nó cho phép download
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     } catch (error) {
  //       console.log("🚀 ~ handleDownloadCV ~ error:", error)
  //     }
  // }

  const handleDownloadCV = async () => {
    try {
      setLoadingDownload(true)
      const response = await downloadMyCv(idCv);
      const url = response.data
      window.open(url, "_blank");
      setLoadingDownload(false)
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (cv === null) return <NotFound />

  return (
    <>
      <div className="non-print" style={{padding: "25px", display: "flex", alignItems: "center", height: "50px", background: "rgba(0,0,0,.5)", zIndex: "1", position: "fixed", inset: 0}}>
        {/* <Button onClick={handleDownloadCV}>
          <a 
            href={"https://s3-utem.s3.ap-southeast-2.amazonaws.com/my-cvs/cv.pdf"}
            download={`CV-${cv.fullName}-${cv.email}.pdf`}
          >Tải CV</a>
        </Button> */}
        {!loading && <Title level={5} style={{margin: 0, color: "#ddd"}}>Xem CV online trên UTEM của {cv.fullName}</Title>}
        <Button style={{color: "#ddd", marginLeft: "auto", fontWeight: "bold"}} size="middle" type="text" onClick={handleDownloadCV} loading={loadingDownload} icon={<DownloadOutlined />}>
          <spa>Tải CV</spa>
        </Button>
      </div>
      <div className="preview-cv__layout">
        <div className="preview-cv__container">
          <div className="preview-cv__content">
            {!loading && <UserCv data={cv}/>}
          </div>
        </div>
      </div>
    </>
  );
};
export default PreviewCv;
