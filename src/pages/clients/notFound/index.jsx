import React from 'react'
import { Button } from 'antd'
import { RollbackOutlined } from '@ant-design/icons';
import "./notFound.scss"
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="no-match">
      <div className="no-match__img">
        <img src="/images/404ErrorImg.png" alt="" className="img-fluid" />
        <Button type='primary' size='large' icon={<RollbackOutlined />} onClick={() => navigate("/")}>
          Trở về trang chủ
        </Button>
      </div>
    </div>
  )
}

export default NotFound
