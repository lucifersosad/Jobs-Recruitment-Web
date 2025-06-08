import { USER_EDUCATION_LEVEL, USER_EXPERIENCE, USER_LEVEL } from "../../../../common/constants"

export const optionsSalary = [
    {
        label: "Dưới 10 triệu",
        value: "duoi_10_trieu",
    },
    {
        label: "10 - 15 triệu",
        value: "10_15_trieu",

    },
    {
        label: "15 - 20 triệu",
        value: "15_20_trieu",

    },
    {
        label: "20 - 25 triệu",
        value: "20_25_trieu",

    },
    {
        label: "25 - 30 triệu",
        value: "25_30_trieu",

    },
    {
        label: "30 - 35 triệu",
        value: "30_35_trieu",

    },
    {
        label: "Trên 50 triệu",
        value: "tren_50_trieu ",
    },
    {
        label: "Thỏa thuận",
        value: "thoa_thuan",

    }
]
export const optionsYearsOfExperience =  [
    {
        label: "Dưới 1 năm",
        value: "duoi_1_nam",
    },
    {
        label: "1 năm",
        value: "1_nam",

    },
    {
        label: "2 năm",
        value: "2_nam",

    },
    {
        label: "3 năm",
        value: "3_nam",

    },
    {
        label: "4 năm",
        value: "4_nam",

    },
    {
        label: "Trên 5 năm",
        value: "tren_5_nam",
    }
]

export const dataExperience  = [
    {
        value: USER_EXPERIENCE.NONE,
        label:"Chưa có kinh nghiệm"
    },
    {
        value: USER_EXPERIENCE.UNDER_ONE_YEAR,
        label:"Dưới 1 Năm"
    },
    {
        value: USER_EXPERIENCE.ONE_YEAR,
        label:"1 Năm"
    },
    {
        value: USER_EXPERIENCE.TWO_YEAR,
        label:"2 Năm"
    },
    {
        value: USER_EXPERIENCE.THREE_YEAR,
        label:"3 Năm"
    },
    {
        value: USER_EXPERIENCE.FOUR_YEAR,
        label:"4 Năm"
    },
    {
        value: USER_EXPERIENCE.FIVE_YEAR,
        label:"5 Năm"
    },
 
    {
        value: USER_EXPERIENCE.OVER_FIVE_YEAR,
        label:"Trên 5 Năm"
    },
]

export const dataLevel = [
    {
        value: USER_LEVEL.STUDENT_INTERN,
        label:"Sinh Viên/Thực Tập Sinh"
    },
    {
        value: USER_LEVEL.JUST_HAVE_GRADUATED,
        label:"Mới Tốt Nghiệp"
    },
    {
        value: USER_LEVEL.STAFF,
        label:"Nhân Viên"
    },
    {
        value: USER_LEVEL.TEAMLEADER_SUPERVISOR,
        label:"Trường Nhóm/Giám Sát"
    },
    {
        value: USER_LEVEL.MANAGER,
        label:"Quản Lý"
    },
    {
        value: USER_LEVEL.VICE_DIRECTOR,
        label:"Phó Giám Đốc"
    },
    {
        value: USER_LEVEL.GENERAL_DIRECTOR,
        label:"Tổng Giám Đốc"
    },
]

export const dataDegree  = [
    {
        value: USER_EDUCATION_LEVEL.HIGH_SCHOOL,
        label:"Trung Học"
    },
    {
        value: USER_EDUCATION_LEVEL.INTERMEDIATE,
        label:"Trung Cấp"
    },
    {
        value: USER_EDUCATION_LEVEL.COLLEGE,
        label:"Cao Đẳng"
    },
    {
        value: USER_EDUCATION_LEVEL.UNIVERSITY,
        label:"Đại Học"
    },
    {
        value: USER_EDUCATION_LEVEL.POSTGRADUATE,
        label:"Thạc Sĩ/Tiến Sĩ"
    },
    {
        value: USER_EDUCATION_LEVEL.OTHER,
        label: "Khác"
    },
]