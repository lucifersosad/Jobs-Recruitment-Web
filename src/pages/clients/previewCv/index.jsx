import { PDFViewer } from "@react-pdf/renderer";
import "./previewCv.scss";
import UserCv from "./UserCv";
import UserCvPdf from "./UserCvPdf";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyCv } from "../../../services/clients/myCvsApi";
import NotFound from "../notFound";
import { Button } from "antd";

const PreviewCv = () => {
  const { idCv } = useParams();
  const [loading, setLoading] = useState(true)
  const [cv, setCv] = useState();

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
  }, []);

  if (loading) return;

  if (cv === null) return <NotFound />

  return (
    <>
      <div className="non-print" style={{padding: "20px", display: "flex", justifyContent: "end", alignItems: "center", height: "50px", background: "rgba(0,0,0,.5)", zIndex: "1", position: "fixed", inset: 0}}>
        <Button>
          Tải CV
        </Button>
      </div>
      <div className="preview-cv__layout">
        <div className="preview-cv__container">
          <div className="preview-cv__content">
            <UserCv data={cv}/>
          </div>
        </div>
      </div>
    </>
  );
};
export default PreviewCv;
