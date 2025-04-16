'use client';

import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import alert from '@/app/components/SweetAlerts';

import axiosInstance from "@/axios";

export default function StudentSelection({ studentDetails = [], passedStudents = [], schedule_id = '', buttonAction = () => { } }) {

    const { t } = useTranslation();

    const [update, setUpdate] = useState(false);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState([]);

    const handleChange = (index, field, value) => {
        const updatedData = [...formData];
        updatedData[index][field] = value;
        updatedData[index]['edited'] = true;

        setFormData(updatedData);
    };

    const addStudent = () => {
        setFormData([...formData, {
            studentid: 0,
            studentname: '',
            studentgrade: '',
            studentschool: '',
            studentgender: '',
            studentteacher: '',
            studentlastname: 'Child',
            studentfirstname: 'New',
            studentbirthdate: '',
            studentpickupauth: '',
            studentparentpickup: '',
            studentphotorelease: 1,
            studentspecialinstruction: 'None',
            selected: false,
            enrolled: false,
            edited: true,
        }]);
        setStudents([...students, {
            studentid: 0,
            studentgrade: '',
            studentschool: '',
            studentgender: '',
            studentteacher: '',
            studentname: 'New Child',
            studentlastname: 'Child',
            studentfirstname: 'New',
            studentbirthdate: '',
            studentpickupauth: '',
            studentparentpickup: '',
            studentphotorelease: 1,
            studentspecialinstruction: 'None',
            selected: false,
            enrolled: false,
            edited: true,
        }]);

        setTimeout(() => {
            const button = document.getElementById(`student-button-${students?.length}`);
            button.click();
        }, 1);

        setUpdate(true);
    };

    const deleteStudent = (index) => {
        const newStudents = students.filter((ele, i) => i !== index);
        const newFormData = formData.filter((ele, i) => i !== index);

        setFormData(newFormData);
        setStudents(newStudents);
    }

    const onSubmit = async () => {
        let studentsToSubmit = [];

        formData.forEach((ele) => {
            ele.studentname = `${ele.studentfirstname} ${ele.studentlastname}`;
            if (ele.edited == true) {
                const form = document.getElementById(`student-form-${ele.studentid}`);

                if (form.checkValidity() === false) {
                    form.reportValidity();
                    return;
                }

                studentsToSubmit.push(ele);
            }
        });

        try {
            if (studentsToSubmit <= 0)
                return;

            const { data } = await axiosInstance.post("api/students.php", { 'students': studentsToSubmit });

            fetchData();
            alert({ type: "success", message: data });

            setUpdate(false);
        } catch (err) {
            console.log(err);
        }
    }

    const onCheckout = () => {
        const ids = formData.reduce((selectedStudents, ele) => {
            if (ele.selected == true && ele.studentid !== 0 && !ele.enrolled) {
                selectedStudents[ele.studentid] = ele;
            }
            return selectedStudents;
        }, {});
        if (Object.values(ids).length > 0)
            buttonAction(ids, students);
        else {
            alert({ type: "error", message: t('Please make a selection to proceed.') });
        }
    }

    const outDatedDetails = (date) => {
        if (!date)
            return false;

        const dateObject = new Date(date);
        const currentDate = new Date();

        const monthDiff = (currentDate.getFullYear() - dateObject.getFullYear()) * 12 + currentDate.getMonth() - dateObject.getMonth();

        return monthDiff >= 6;
    }

    const fetchData = async () => {
        try {
            const url = `api/students.php${schedule_id ? `?sid=${schedule_id}` : ''}`;
            const response = await axiosInstance.get(url);
            const adjustedValues = response?.data?.students?.map((student) => ({
                studentid: student?.studentid ? student?.studentid : "",
                studentname: student?.studentname ? student?.studentname : "",
                studentgrade: student?.studentgrade ? student?.studentgrade : "",
                studentschool: student?.studentschool ? student?.studentschool : "",
                studentgender: student?.studentgender ? student?.studentgender : "",
                studentteacher: student?.studentteacher ? student?.studentteacher : "",
                studentlastname: student?.studentlastname ? student?.studentlastname : "",
                studentfirstname: student?.studentfirstname ? student?.studentfirstname : "",
                studentbirthdate: student?.studentbirthdate ? student?.studentbirthdate : "",
                studentpickupauth: student?.studentpickupauth ? student?.studentpickupauth : "",
                studentparentpickup: student?.studentparentpickup ? student?.studentparentpickup : "",
                studentphotorelease: student?.studentphotorelease ? student?.studentphotorelease : "",
                studentspecialinstruction: student?.studentspecialinstruction ? student?.studentspecialinstruction : "",
                studentupdateddate: student?.studentupdateddate ? student?.studentupdateddate : "",

                enrolled: student?.enrolled ? student?.enrolled : false,
                selected: passedStudents.includes(student?.studentid) ? true : false
            }));

            if (adjustedValues?.length == 0)
                addStudent();
            else {
                setFormData(adjustedValues);
                setStudents(adjustedValues);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (studentDetails.length > 0) {
            setFormData(studentDetails);
            setStudents(studentDetails);
        } else {
            fetchData();
        }
    }, []);

    const showUpdateButton = (e) => {
        if (e.target.type !== 'checkbox') {
            setUpdate(true);
        }
    }

    const getBorder = (index) => {
        if (students?.length == 1)
            return 'border rounded';

        const total = students?.length - 1;
        let borderClass = '';

        switch (index) {
            case 0:
                borderClass = 'border border-bottom-0 rounded-top ';
                break;
            case total:
                borderClass = 'border rounded-bottom ';
                break;
            default:
                borderClass = 'border border-bottom-0 ';
        }

        return borderClass;
    }

    const getMaxDate = () => {
        const max = new Date();
        max.setFullYear(max.getFullYear() - process.env.NEXT_PUBLIC_MIN_STUDENT_AGE);

        const year = max.getFullYear();
        const month = (max.getMonth() + 1).toString().padStart(2, '0');
        const day = max.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    return <>
        <div className="accordion" id="studentsAccordion" onChange={showUpdateButton}>
            {students?.map((student, index) =>
                <div className="accordion-item border-0" key={student.studentid}>
                    <div className={`accordion-header align-items-center d-flex ${getBorder(index)}`}>
                        <div className="input-checkbox ms-3 position-absolute" style={{ "zIndex": 4, "width": "1rem" }}>
                            <input id={`checkbox${index}`} className="d-none" type="checkbox" value={1} onChange={(e) => handleChange(index, 'selected', e.target.checked ? 1 : 0)} checked={(student.selected && !student.enrolled) ? true : false} disabled={student.enrolled} />
                            {/* <label htmlFor={`checkbox${index}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg></label> */}
                            <label className={student.selected ? 'mb-0 text-blue' : 'mb-0'} htmlFor={`checkbox${index}`}><i className={(student.selected || student.enrolled) ? 'fs-5 mdi mdi-check-circle' : 'fs-5 mdi mdi-circle-outline'}></i></label>
                        </div>
                        <button className="accordion-button collapsed" type="button" id={`student-button-${index}`} data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`}>
                            <div className="ms-4 w-100 d-flex gap-2">
                                <p className="fs-6 font-semibold">{student?.studentname}</p>
                                {student.studentbirthdate && <><span className="text-grey d-none d-md-block">|</span>
                                    <p className="text-grey d-none d-md-block">{student?.studentbirthdate}</p></>}
                                {student.studentgrade && <><span className="text-grey d-none d-md-block">|</span>
                                    <p className="text-grey d-none d-md-block">{`${t('Grade')} ${student?.studentgrade}`}</p></>}
                                {student.enrolled && <><span className="text-grey">|</span> <p className="text-danger">{t('Already Enrolled')}</p> </>}
                                {student.studentid == 0 && <><span className="text-grey">|</span> <p className="text-danger">{t('Save Student To Select.')}</p> </>}
                                {outDatedDetails(student.studentupdateddate) && (<div className="ms-auto me-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>{t('Student Details Are Outdated')}</title><path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg></div>)}
                                {student.studentid == 0 && (<div className="ms-auto me-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => { deleteStudent(index) }}><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" /></svg></div>)}
                            </div>
                        </button>
                    </div>
                    <div id={`collapse${index}`} className="accordion-collapse collapse mb-3" data-bs-parent="#studentsAccordion">
                        <div className="custom-accordion-body small-select">
                            <form id={`student-form-${student.studentid}`} method="post">
                                <div className="row">
                                    <div className="col-6">
                                        <label className="mt-0 required" htmlFor="studentfirstname">{t('Student First Name')}</label>
                                        <input
                                            type="text"
                                            value={formData[index]?.studentfirstname}
                                            onChange={(e) => handleChange(index, 'studentfirstname', e.target.value)}
                                            className="form-control rounded-0"
                                            placeholder="First"
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="mt-0 required" htmlFor="studentlastname">{t('Student Last Name')}</label>
                                        <input
                                            type="text"
                                            value={formData[index]?.studentlastname}
                                            onChange={(e) => handleChange(index, 'studentlastname', e.target.value)}
                                            className="form-control rounded-0"
                                            placeholder="Last"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <label className="mt-3 required" htmlFor="studentbirthdate">{t('Date of Birth')}</label>
                                        <input
                                            type="date"
                                            name="studentbirthdate"
                                            id="studentbirthdate"
                                            autoComplete="off"
                                            max={getMaxDate()}
                                            className="form-control rounded-0"
                                            onChange={(e) => handleChange(index, 'studentbirthdate', e.target.value)}
                                            value={formData[index]?.studentbirthdate}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="mt-3 required" htmlFor="studentgender">{t('Gender')}</label>
                                        <select
                                            name="studentgender"
                                            className="form-select rounded-0"
                                            value={formData[index]?.studentgender}
                                            onChange={(e) => handleChange(index, 'studentgender', e.target.value)}
                                            required
                                        >
                                            <option value="" hidden>{t('Select')}</option>
                                            <option value="Male">{t('Male')}</option>
                                            <option value="Female">{t('Female')}</option>
                                            <option value="Other">{t('Other')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-6 col-12">
                                        <div className="row">
                                            <div className="col-12 col-lg-6">
                                                <label className="mt-3" htmlFor="studentschool">{t('School They Attend')}</label>
                                                <input
                                                    type="text"
                                                    name="studentschool"
                                                    id="studentschool"
                                                    className="form-control rounded-0"
                                                    placeholder="School name"
                                                    onChange={(e) => handleChange(index, 'studentschool', e.target.value)}
                                                    value={formData[index]?.studentschool}
                                                />
                                            </div>
                                            <div className="col-lg-6 col-12">
                                                <label className="mt-3" htmlFor="studentgrade">{t('Grade')}</label>
                                                <input
                                                    type="text"
                                                    name="studentgrade"
                                                    id="studentgrade"
                                                    className="form-control rounded-0"
                                                    placeholder="Grade"
                                                    onChange={(e) => handleChange(index, 'studentgrade', e.target.value)}
                                                    value={formData[index]?.studentgrade}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <label className="mt-3" htmlFor="studentteacher">{t('Teacher')}</label>
                                        <input
                                            type="text"
                                            name="studentteacher"
                                            id="studentteacher"
                                            className="form-control rounded-0"
                                            placeholder="Teacher name"
                                            onChange={(e) => handleChange(index, 'studentteacher', e.target.value)}
                                            value={formData[index]?.studentteacher}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <label className="mt-3 required" htmlFor="studentparentpickup">{t('Student Pickup')}</label>
                                        <select
                                            name="studentparentpickup"
                                            id="studentparentpickup"
                                            className="form-select"
                                            value={formData[index]?.studentparentpickup}
                                            onChange={(e) => handleChange(index, 'studentparentpickup', e.target.value)}
                                            required
                                        >
                                            <option value="">{t('Select')}</option>
                                            <option value="Parent Pickup">{t('Parent Pickup')}</option>
                                            <option value="After School Care">{t('After School Care')}</option>
                                            <option value="Walk/Ride Bike">{t('Walk/Ride Bike')}</option>
                                            <option value="School Bus">{t('School Bus')}</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <label className="mt-3 required" htmlFor="studentpickupauth">{t('Person Authorized to Pick Up')}</label>
                                        <input
                                            type="text"
                                            name="studentpickupauth"
                                            id="studentpickupauth"
                                            className="form-control rounded-0"
                                            placeholder="Full name of authorized person"
                                            value={formData[index]?.studentpickupauth}
                                            onChange={(e) => handleChange(index, 'studentpickupauth', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <label className="mt-3" htmlFor="studentspecialinstruction">{t('Special Instruction')}</label>
                                        <textarea
                                            value={formData[index]?.studentspecialinstruction}
                                            onChange={(e) => handleChange(index, 'studentspecialinstruction', e.target.value)}
                                            className="form-control rounded-0"
                                            rows="4"
                                        />
                                    </div>
                                </div>

                                <div className="check-group pt-3">
                                    <div className="form-check">
                                        <label className="form-check-label" htmlFor="studentphotorelease">{t('Yes, I consent for use of any photographs or video recordings that are taken of my child while participating in our programs')}</label>
                                        <input className="form-check-input" type="checkbox" value={1} checked={formData[index]?.studentphotorelease == 1} id="studentphotorelease" name="studentphotorelease" onChange={(e) => handleChange(index, 'studentphotorelease', e.target.checked ? 1 : 0)} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="buttons mt-3">
            <span className="text-brown font-semibold cursor-pointer" onClick={addStudent}>
                <i className="mdi mdi-plus-circle pe-1"></i>
                <span>{t(`Add ${students?.length > 0 ? 'Another' : 'a'} Student`)}</span>
            </span>
            <div className="d-flex justify-content-start gap-2 mt-2">

                {update ?
                    <>
                        <button className="btn btn-primary rounded-0" onClick={() => { onSubmit(students) }}>{t('Save Students')}</button>
                        <button className="btn btn-danger rounded-0" onClick={() => { setUpdate(false) }}>{t('Cancel')}</button>
                    </>
                    : <button className="btn btn-primary rounded-0" onClick={onCheckout}>{t('Select Students')}</button>}
            </div>
        </div>

    </>
}