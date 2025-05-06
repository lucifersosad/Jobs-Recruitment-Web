function RelatedCompanies({ companies }) {
  if (!companies || companies.length === 0) {
    return null;
  }

  return (
    <div className="job-box-cutstom">
      <div className="mb-3">
        <h3>Công ty cùng lĩnh vực</h3>
      </div>
      <div className="record-with-job">
        {companies.map((item, index) => (
          <div key={index} className="record mb-4">
            <div className="flex">
              <div className="logo-company">
                <img src={item?.logoCompany} alt="" />
              </div>
              <div className="content">
                <div>
                  <a href={item?.slug} className="name-company">
                    CÔNG TY {item?.companyName}
                  </a>
                </div>

                <div className="count-job">
                  {item?.countJobs} việc làm
                </div>
              </div>
            </div>
            <div className="tag-tag">Cùng lĩnh vực</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedCompanies; 