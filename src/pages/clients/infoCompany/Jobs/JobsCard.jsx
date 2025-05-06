import MemoizedJobByCompany from "../../../../components/clients/jobByCompany";

function JobsCard({ slug }) {
  return (
    <div className="job-box mb-4">
      <div className="title-header1">
        <h2>Tuyển dụng</h2>
      </div>
      <div className="box-item-content">
        <MemoizedJobByCompany slug={slug} />
      </div>
    </div>
  );
}

export default JobsCard; 