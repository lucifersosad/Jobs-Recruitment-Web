import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLocationDot,
  faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { Skeleton } from "antd";
import { Fragment } from "react";

const BoxNewSkeleton = ({ colGrid }) => {
  return (
    <div className={`items-box__news ${colGrid}`}>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <Fragment key={index}>
            <div className="items-box__news-item ">
              <Skeleton.Image
                style={{ width: 100, height: 100, borderRadius: 8 }}
                active
              />
              <div className="items-box__body">
                <div className="title_all" style={{marginBottom: "10px"}}>
                  <h3 className="title">
                    <a target="_blank" rel="noreferrer">
                      <Skeleton paragraph={false} active />
                    </a>
                  </h3>
                  <div className="title-salary">
                    <Skeleton paragraph={false} active style={{ width: 100 }} />
                  </div>
                </div>
                <div className="company">
                  <Skeleton paragraph={false} active style={{ width: 100 }} />
                </div>
                <div className="updateAt">
                  <Skeleton paragraph={false} active style={{ width: 150 }} />
                </div>
                <div className="info-job">
                  <div className="time-line">
                    <Skeleton paragraph={false} active style={{ width: 200 }} />
                  </div>
                  <div className="button-line">
                    <Skeleton.Button active style={{ width: 95 }} block />
                    <Skeleton.Button active style={{ width: 34 }} block />
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
    </div>
  );
};
export default BoxNewSkeleton;
