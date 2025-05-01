// UserCvPdf.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from "@react-pdf/renderer";

// Sample avatar
const avatarUrl = "/images/default-cv-pdf-avatar.jpg" || "https://static.topcv.vn/cv-builder/assets/default-avatar.fc9c40ba.png";

//Font
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '/fonts/Roboto-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: '/fonts/Roboto-Bold.ttf',
      fontWeight: 700,
    }
  ]
})

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Roboto",
    fontSize: 11,
  },
  leftColumn: {
    width: "35%",
    backgroundColor: "#353A3D",
    color: "#fff",
    padding: 10,
  },
  rightColumn: {
    width: "65%",
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    // marginBottom: 4,
    textTransform: "uppercase",
    color: "#ff277d",
    fontWeight: "bold",
  },
  text: {
    marginBottom: 2,
  },
  avatar: {
    width: "100%",
    height: 200,
    objectFit: "contain",
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divider: {
    borderBottom: "1px solid #ff277d",
    marginBottom: 4,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8, // nếu không dùng được gap, có thể dùng marginRight/Left
  },
  line: {
    flexGrow: 1,
    height: 1,
    backgroundColor: 'red',
  },
});

// Sample data
const personalData = [
  { label: "Ngày sinh", value: "26/02/2003" },
  { label: "Giới tính", value: "Nam" },
  { label: "Số điện thoại", value: "0933758487" },
  { label: "Email", value: "1@s" },
  { label: "Địa chỉ", value: "Thủ Đức, Hồ Chí Minh" },
];

const UserCvPdf = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Left Column */}
      <View style={styles.leftColumn}>
        <Image src={avatarUrl} style={styles.avatar} />
        <Text style={[styles.text, styles.bold, { fontSize: 16 }]}>
          Đặng Tiến Phát
        </Text>
        <Text style={[styles.text, { textTransform: "uppercase", color: "#ff277d" }]}>
          Lập trình viên
        </Text>

        

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.title}>Thông tin cá nhân</Text>
          {personalData.map((item, index) => (
            <Text style={styles.text} key={index}>
              {item.label}: {item.value}
            </Text>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.title}>Kỹ năng</Text>
          <Text style={styles.text}>
            • Có kiến thức vững về JavaScript{"\n"}
            • Thành thạo HTML, CSS, JS, GitLab, Node.js{"\n"}
            • Thành thạo SQL, noSQL{"\n"}
            • Có kiến thức về VueJS, Angular, React{"\n"}
            • Thành thạo C++, .NET{"\n"}
            • Thiết kế hệ thống, lập trình hướng đối tượng{"\n"}
            • Setup, bảo trì hệ thống Microsoft Windows{"\n"}
            • Quản lý hệ thống cơ sở dữ liệu SQL
          </Text>
        </View>
      </View>

      {/* Right Column */}
      <View style={styles.rightColumn}>
        {/* Career Objective */}
        <View style={styles.section}>
          <Text style={styles.title}>Mục tiêu nghề nghiệp</Text>
          <Text style={styles.text}>
            Với 6 năm trong nghề lập trình, triển khai trực tiếp hơn 30 dự án,
            tôi mong muốn ứng tuyển vào vị trí Senior để nâng cấp sản phẩm và
            mang lại giá trị cho doanh nghiệp. Mục tiêu 2 năm tới là trở thành
            một Lead giỏi.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.wrapper}>
            <Text style={styles.title}>Kinh nghiem lam viec</Text>
            <View style={styles.line} />
          </View>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.title}>Kinh nghiệm làm việc</Text>
          <View style={styles.rowBetween}>
            <Text style={[styles.text, styles.bold]}>Front End Developer</Text>
            <Text style={styles.text}>2021 - 2024</Text>
          </View>
          <Text style={styles.text}>Công ty XYZ TopCV</Text>
          <Text style={styles.text}>
            • Quản lý dự án, phát triển web, tối ưu trình duyệt{"\n"}
            • Đánh giá, thử nghiệm các tính năng mới{"\n"}
            • Hợp tác với lập trình viên và khách hàng{"\n"}
            • Đào tạo khách hàng sử dụng CMS{"\n"}
            • Hỗ trợ nhóm, đánh giá source code
          </Text>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.title}>Học vấn</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Công nghệ thông tin</Text>
            <Text style={styles.text}>2014 - 2017</Text>
          </View>
          <Text style={styles.text}>Đại học TopCV</Text>
          <Text style={styles.text}>
            Tốt nghiệp loại Giỏi, học bổng 2016-2017, giải nhì nghiên cứu KHCN
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default UserCvPdf;
