
import { Row, Col, Card, Statistic, Space } from 'antd';
import { 
  UserOutlined, 
  BankOutlined, 
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

function DashBoard() {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Demo data - cần thay thế bằng dữ liệu thực từ API
  const applicationData = [
    { month: 'T1', value: 350 },
    { month: 'T2', value: 420 },
    { month: 'T3', value: 390 },
    { month: 'T4', value: 480 },
    { month: 'T5', value: 520 },
    { month: 'T6', value: 450 },
  ];

  const jobStatusData = [
    { name: 'Đang hiển thị', value: 27 },
    { name: 'Chưa duyệt', value: 15 },
    { name: 'Hết hạn', value: 8 },
  ];

  const industryData = [
    { name: 'CNTT', value: 45 },
    { name: 'Marketing', value: 35 },
    { name: 'Tài chính', value: 30 },
    { name: 'Bán hàng', value: 25 },
    { name: 'Khác', value: 20 },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng số ứng viên"
              value={12}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng số công ty"
              value={9}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tin tuyển dụng"
              value={45}
              prefix={<FileSearchOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Lượt ứng tuyển"
              value={78}
              prefix={<FileDoneOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Xu hướng ứng tuyển" hoverable>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Lượt ứng tuyển" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  dot={{ stroke: '#1890ff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Trạng thái tin tuyển dụng" hoverable>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
export default DashBoard;