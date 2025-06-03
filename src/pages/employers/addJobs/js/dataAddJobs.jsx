import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSuitcaseMedical,faPlane,faUsd,faUserMd,faGraduationCap,faLineChart,faLaptop,faMoneyBill,
    faTaxi,faUserTie,faBriefcase,faHeartbeat
} from '@fortawesome/free-solid-svg-icons'
import { JOB_EDUCATION_LEVEL, JOB_EXPERIENCE, JOB_LEVEL, JOB_TYPE } from '../../../../common/constants'
export const dataJobType = [
    {
        value: JOB_TYPE.OFFICIAL_EMPLOYEE,
        label:"Nhân Viên Chính Thức"
    },
    {
        value: JOB_TYPE.PART_TIME,
        label:"Bán Thời Gian"
    },
    {
        value: JOB_TYPE.SEASONAL_FREELANCE,
        label:"Thời Vụ - Nghề Tự Do"
    },
    {
        value: JOB_TYPE.INTERN,
        label:"Thực Tập"
    }
]

export const dataExperience  = [
    {
        value: JOB_EXPERIENCE.NO_REQUIRED,
        label:"Không Yêu Cầu Kinh Nghiệm"
    },
    {
        value: JOB_EXPERIENCE.UNDER_ONE_YEAR,
        label:"Dưới 1 Năm"
    },
    {
        value: JOB_EXPERIENCE.ONE_YEAR,
        label:"1 Năm"
    },
    {
        value: JOB_EXPERIENCE.TWO_YEAR,
        label:"2 Năm"
    },
    {
        value: JOB_EXPERIENCE.THREE_YEAR,
        label:"3 Năm"
    },
    {
        value: JOB_EXPERIENCE.FOUR_YEAR,
        label:"4 Năm"
    },
    {
        value: JOB_EXPERIENCE.FIVE_YEAR,
        label:"5 Năm"
    },
 
    {
        value: JOB_EXPERIENCE.OVER_FIVE_YEAR,
        label:"Trên 5 Năm"
    },


]

export const dataReceiveEmail  = [
    {
        value:"vietnamese",
        label:"Tiếng Việt"
    },
    {
        value:"english",
        label:"Tiếng Anh"
    },
    {
        value:"no-email",
        label:"Không Nhận Email"
    },
   
]


export const dataDegree  = [
    {
        value: JOB_EDUCATION_LEVEL.NO_REQUIRED,
        label: "Không giới hạn"
    },
    {
        value: JOB_EDUCATION_LEVEL.HIGH_SCHOOL,
        label:"Trung Học"
    },
    {
        value: JOB_EDUCATION_LEVEL.INTERMEDIATE,
        label:"Trung Cấp"
    },
    {
        value: JOB_EDUCATION_LEVEL.COLLEGE,
        label:"Cao Đẳng"
    },
    {
        value: JOB_EDUCATION_LEVEL.UNIVERSITY,
        label:"Đại Học"
    },
    {
        value: JOB_EDUCATION_LEVEL.POSTGRADUATE,
        label:"Thạc Sĩ/Tiến Sĩ"
    },
]

export const dataLevel = [
    {
        value: JOB_LEVEL.STUDENT_INTERN,
        label:"Sinh Viên/Thực Tập Sinh"
    },
    {
        value: JOB_LEVEL.JUST_HAVE_GRADUATED,
        label:"Mới Tốt Nghiệp"
    },
    {
        value: JOB_LEVEL.STAFF,
        label:"Nhân Viên"
    },
    {
        value: JOB_LEVEL.TEAMLEADER_SUPERVISOR,
        label:"Trường Nhóm/Giám Sát"
    },
    {
        value: JOB_LEVEL.MANAGER,
        label:"Quản Lý"
    },
    {
        value: JOB_LEVEL.VICE_DIRECTOR,
        label:"Phó Giám Đốc"
    },
    {
        value: JOB_LEVEL.GENERAL_DIRECTOR,
        label:"Tổng Giám Đốc"
    },
]

export const dataProfileRequirement = [
    {
        value:"english",
        label:"Tiếng Anh"
    },
    {
        value:"vietnamese",
        label:"Tiếng Việt"
    },
   
    {
        value:"french",
        label:"Tiếng Pháp"
    },
    {
        value:"chinese",
        label:"Tiếng Trung"
    },
    {
        value:"japanese",
        label:"Tiếng Nhật"
    },
    {
        value:"korean",
        label:"Tiếng Hàn"
    },
]

export const dataWelfare = [
    {
        value:"insurance",
        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faSuitcaseMedical} /></span> 
            <span>Chế Độ Bảo Hiểm</span>
        </>),
       
    },
  
   
    {
        value:"bonus",
        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faUsd} /></span> 
            <span>Chế Độ Thưởng</span>
        </>),
       
       
    },
   
    {
        value:"health-care",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faUserMd} /></span> 
            <span>Chăm Sóc Sức Khỏe</span>
        </>),
       
    },
    {
        value:"training",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faGraduationCap} /></span> 
            <span>Đào Tạo</span>
        </>),
       
    },
    {
        value:"salary-increase",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faLineChart} /></span> 
            <span>Tăng Lương</span>
        </>),
    },
    {
        value:"laptop",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faLaptop} /></span> 
            <span>Laptop</span>
        </>),
       
    },
    {
        value:"allowance",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faMoneyBill} /></span> 
            <span>Phụ Cấp</span>
        </>),
       
    },
    {
        value:"shuttle",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faTaxi} /></span> 
            <span>Xe Đưa Đón</span>
        </>),
       
    },
    {
        value:"tourism",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faPlane} /></span> 
            <span>Du Lịch</span>
        </>),
       
    },
    {
        value:"uniform",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faUserTie} /></span> 
            <span>Đồng Phục</span>
        </>),
    },
    {
        value:"seniority-allowances",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faMoneyBill} /></span> 
            <span>Phụ Cấp Thâm Niên</span>
        </>),
    },
    {
        value:"annual-leave",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faBriefcase} /></span> 
            <span>Nghỉ Phép Năm</span>
        </>),
    },
    {
        value:"sport-club",

        label:(<>
            <span style={{marginRight:"10px"}}><FontAwesomeIcon icon={faHeartbeat} /></span> 
            <span>Câu Lạc Bộ Thể Thao</span>
        </>),
    },
    
]