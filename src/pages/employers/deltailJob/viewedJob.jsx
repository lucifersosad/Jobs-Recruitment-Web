import { Popconfirm, Table, message } from "antd";
import { memo, useEffect, useState } from "react";
import {
  buyUserPreviewJob,
  followUserProfile,
  userPreviewJob,
} from "../../../services/employers/jobsApi";
import MemoizedFilterDropdownCustom from "../../../components/employers/filterDropdownCustom";
import { removeAccents } from "../../../helpers/removeAccents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClock,
  faCoins,
  faEnvelope,
  faPhone,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";
import { useDispatch } from "react-redux";
import { UpdateDataAuthEmployer } from "../../../update-data-reducer/employers/updateDataEmployers";
import UserProfile from "../../../components/employers/userProfile";

function ViewedJob({ record }) {
  const [data, setData] = useState([]);
  console.log("🚀 ~ ViewedJob ~ data:", data)
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const fetchApi = async () => {
    const objectNew = {
      idJob: record._id,
    };
    const result = await userPreviewJob(objectNew);
    if (result.code === 200) {
      setData(result?.data);
      //   setData(result.data);
    }
  };
  const handleConfirm = async (idUser) => {
    messageApi.open({
      key: 'fetching',
      type: 'loading',
      content: 'Đang xử lý...',
      duration: 0,
    });

    try {
      const objectData = {
        idJob: record._id,
        idUser,
      };
      const result = await buyUserPreviewJob(objectData);
      if (result.code === 200) {
        await UpdateDataAuthEmployer(dispatch);
        await fetchApi();
        messageApi.open({
          key: 'fetching',
          type: "success",
          content: result.success,
          icon: (
            <span className="icon-message-employer-success">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ),
        });
      } else {
        messageApi.open({
          key: 'fetching',
          type: "error",
          content: result.error,
          icon: (
            <span className="icon-message-employer-error">
              <FontAwesomeIcon icon={faXmark} />
            </span>
          ),
        });
      }
    } catch (error) {
      messageApi.open({
        key: 'fetching',
        type: "error",
        content: "Lỗi không xác định",
        icon: (
          <span className="icon-message-employer-error">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        ),
      });
    }
  };

  useEffect(() => {
    if (!record) return;
    if (Object.keys(record).length > 0) {
      fetchApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);
    
  const saveProfileUser = async (idUser) => {
    messageApi.open({
      key: 'fetching',
      type: 'loading',
      content: 'Đang xử lý...',
      duration: 0,
    });
    
    try {
      const objectNew = {
        idProfile: idUser,
        idJob: record?._id,
      };
      const result = await followUserProfile(objectNew);
      if (result.code === 200) {
        await fetchApi();
        messageApi.open({
          key: 'fetching',
          type: "success",
          content: result.success,
          icon: (
            <span className="icon-message-employer-success">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ),
        });
      } else {
        messageApi.open({
          key: 'fetching',
          type: "error",
          content: result.error,
          icon: (
            <span className="icon-message-employer-error">
              <FontAwesomeIcon icon={faXmark} />
            </span>
          ),
        });
      }
    } catch (error) {
      messageApi.open({
        key: 'fetching',
        type: "error",
        content: "Lỗi không xác định",
        icon: (
          <span className="icon-message-employer-error">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        ),
      });
    }
  };
  const columns = [
    {
      title: "Ứng viên",
      dataIndex: "candidate",
      key: "candidate",
      render: (_, dataRecord) => {
        return (
          <div className="box-candidate">
            <div className="images">
              <img src={dataRecord?.avatar || ""} alt="avatr" />
            </div>
            <div className="box-content">
              <div>{dataRecord?.fullName}</div>
              {dataRecord?.countView > 0 && (
                <div className="cv-seen">Đã xem</div>
              )}
              {dataRecord?.countView === 0 && (
                <div className="cv-no-seen">Chưa xem</div>
              )}
            </div>
          </div>
        );
      },
      filterDropdown: (props) => {
        return <MemoizedFilterDropdownCustom {...props} />;
      },
      onFilter: (value, record) => {
        return (
          removeAccents(record.fullName)
            .toLowerCase()
            .includes(removeAccents(value).toLowerCase()) ||
          removeAccents(record.fullName)
            .toLowerCase()
            .includes(removeAccents(value).toLowerCase())
        );
      },
    },
    {
      title: "Thông tin liên hệ",
      dataIndex: "contact",
      key: "contact",
      render: (_, dataRecord) => {
        return dataRecord?.email || dataRecord?.phone ? (
          <div className="box-contact">
            <div className="mb-2">
              <FontAwesomeIcon icon={faEnvelope} />
              <span style={{ fontSize: "13px", color: "#575656" }}>
                {dataRecord?.email}
              </span>
            </div>
            <div>
              <FontAwesomeIcon icon={faPhone} />
              <span style={{ fontSize: "13px", color: "#575656" }}>
                {dataRecord?.phone || "Người dùng chưa cập nhật SĐT"}
              </span>
            </div>
          </div>
        ) : (
          <Popconfirm
            onConfirm={() => {
              handleConfirm(dataRecord._id);
            }}
            overlayClassName="popconfirm-contact"
            title="Xem thông tin liên hệ"
            description={
              <span>
                Vui lòng xác nhận việc sử dụng{" "}
                <strong style={{ color: "#f8700c" }}>10GP</strong> để xem thông
                tin liên hệ.
              </span>
            }
            icon={
              <FontAwesomeIcon
                style={{ marginRight: "10px", color: "#ffb516" }}
                icon={faCoins}
              />
            }
            okText="Yes"
            style={{ width: "100px" }}
            className="popconfirm-contact"
            cancelText="No"
          >
            <div className="hide-contact">
              <span>Nhấn hiện Thông Tin</span>
              <FontAwesomeIcon icon={faCheck} />
            </div>
          </Popconfirm>
        );
      },
      filterDropdown: (props) => {
        return <MemoizedFilterDropdownCustom {...props} />;
      },
      onFilter: (value, record) => {
        const textConvert = record?.phone + "-" + record?.email;
        return (
          removeAccents(textConvert)
            .toLowerCase()
            .includes(removeAccents(value).toLowerCase()) ||
          removeAccents(textConvert)
            .toLowerCase()
            .includes(removeAccents(value).toLowerCase())
        );
      },
    },
    {
      title: "Ngành nghề",
      dataIndex: "job_categorie_title",
      key: "job_categorie_title",
      render: (_, dataRecord) => {
        return (
          <strong style={{ fontSize: "13px", color: "#575656" }}>
            {dataRecord?.job_categorie_id?.title}
          </strong>
        );
      },
      filterDropdown: (props) => {
        return <MemoizedFilterDropdownCustom {...props} />;
      },
      onFilter: (value, record) => {
        const textConvert = record?.job_categorie_id?.title;
        return (
          removeAccents(textConvert)
            .toLowerCase()
            .includes(removeAccents(value).toLowerCase()) ||
          removeAccents(textConvert)
            .toLowerCase()
            .includes(removeAccents(value).toLowerCase())
        );
      },
    },
    {
      title: "Thời gian xem",
      key: "dataTime",
      dataIndex: "dataTime",
      render: (_, record) => (
        <div className="box-insights">
          <div className="mb-2">
            <FontAwesomeIcon icon={faClock} />
            <span>{moment(record.dataTime).format("YYYY/MM/DD HH:mm")}</span>
          </div>
        </div>
      ),

      sorter: (a, b) => {
        return new Date(a.dataTime) - new Date(b.dataTime);
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Thao tác",
      key: "action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <div className="box-action">
            <UserProfile record={record} />
            <button
              disabled={record.followed}
              onClick={() => {
                saveProfileUser(record?._id);
              }}
            >
              Lưu hồ sơ
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="viewwed-job">
      {contextHolder}
      <div className="title-head">
        <div className="head">
          <FontAwesomeIcon icon={faAddressBook} />
          <div>
            <span>
              Bạn cần phải có <strong>10GP</strong> để hiện thông tin người dùng
            </span>
            . Mua GP ngay để liên hệ ứng viên, tăng tốc độ tuyển dụng!
          </div>
        </div>
        <div className="body-d">
          <button>
            <FontAwesomeIcon icon={faPlus} />
            <span>Mua thêm</span>
          </button>
        </div>
      </div>
      <div className="table-view">
        <Table
          rowKey={"_id"}
          columns={columns}
          dataSource={data}
          showSorterTooltip={false}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}
const MemoizedViewedJob = memo(ViewedJob);
export default MemoizedViewedJob;
