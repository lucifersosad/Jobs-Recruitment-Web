import { memo, useEffect, useState } from "react";
import "./talentNetwork.scss";
import { getListEmployers } from "../../../services/clients/employersApi";
import { decData } from "../../../helpers/decData";

function TalentNetwork() {
  const [listCompany, setListCompany] = useState([]);
  useEffect(() => {
    const fetchApi = async () => {
      const recordEmployers = await getListEmployers("1", "8");

      if (recordEmployers.code === 200) {
        setListCompany(recordEmployers.data);
      }
    };
    fetchApi();
  }, []);

  return (
    <>
      <div className="cb-section">
        <div className="telent-network">
          <div className="container">
            <div className="row">
              <div className="col-5">
                <div className="telent-network__bg">
                  <div className="title">
                    <h2>
                      Gia tăng cơ hội nghề nghiệp
                      <span>
                        Kết nối với các công ty trên khắp đất nước Việt Nam!
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
              <div className="col-7">
                <div className="telent-network__comppany">
                  <div className="row">
                    {listCompany.length > 0 &&
                      listCompany.map((data, index) => (
                        <div key={index} className="col-3">
                          <div className="item">
                            <div className="image">
                              <img
                                src={`${data.logoCompany}`}
                                alt="test.jpg"
                                style={{ objectFit: "contain" }}
                              ></img>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const MemoizedTalentNetwork = memo(TalentNetwork);
export default MemoizedTalentNetwork;
