import { ConfigProvider, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faFacebook,
  faSquareInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

function ShareCard({ currentPath }) {
  const { Search } = Input;

  return (
    <div className="info-contact">
      <div className="box-contact mb-2">
        <div className="title-header1">
          <h2>Chia sẻ công ty tới bạn bè</h2>
        </div>
        <div className="box-item-content">
          <div className="share-box mb-3">
            <div className="p-content mb-2">Sao chép đường dẫn</div>
            <div className="input">
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#5dcaf9",
                  },
                  components: {
                    Input: {
                      paddingInlineLG: 16,
                      paddingBlockLG: 7,
                    },
                  },
                }}
              >
                <Search
                  defaultValue={currentPath}
                  placeholder="Text..."
                  allowClear
                  enterButton={<FontAwesomeIcon icon={faCopy} />}
                  size="large"
                  onSearch={(value) => {
                    navigator.clipboard.writeText(value);
                  }}
                />
              </ConfigProvider>
            </div>
          </div>
          <div className="box-icon">
            <div className="p-content mb-2">
              Chia sẻ qua mạng xã hội
            </div>
            <div className="icon-icon">
              <div className="facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </div>
              <div className="twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </div>
              <div className="instagram">
                <FontAwesomeIcon icon={faSquareInstagram} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareCard; 