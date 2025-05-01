import { PDFViewer } from "@react-pdf/renderer";
import "./previewCv.scss";
import UserCv from "./UserCv";
import UserCvPdf from "./UserCvPdf";

const PreviewCv = () => {
  return (
    <>
      <div className="preview-cv__layout">
        <div className="preview-cv__container">
          <div className="preview-cv__content">
            <UserCv />
          </div>
        </div>
      </div>
    </>
  );
};
export default PreviewCv;
