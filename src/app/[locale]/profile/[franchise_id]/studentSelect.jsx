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
            if (ele.edited == true)
                studentsToSubmit.push(ele);
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

                enrolled: student?.enrolled ? student?.enrolled : false,
                selected: passedStudents.includes(student?.studentid) ? true : false
            }));
            setFormData(adjustedValues);
            setStudents(adjustedValues);
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
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`}>
                            <div className="ms-4 w-100 d-flex gap-2">
                                <p className="fs-6 font-semibold">{student?.studentname}</p>
                                {student.studentbirthdate && <><span className="text-grey">|</span>
                                    <p className="text-grey">{student?.studentbirthdate}</p></>}
                                {student.studentgrade && <><span className="text-grey">|</span>
                                    <p className="text-grey">{`${t('Grade')} ${student?.studentgrade}`}</p></>}
                                {student.enrolled && <><span className="text-grey">|</span> <p className="text-danger">{t('Already Enrolled')}</p> </>}
                                {student.studentid == 0 && <><span className="text-grey">|</span> <p className="text-danger">{t('Save Student To Select.')}</p> </>}
                                {student.studentid == 0 && (<div className="ms-auto me-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => { deleteStudent(index) }}><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" /></svg></div>)}
                            </div>
                        </button>
                    </div>
                    <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#studentsAccordion">
                        <div className="custom-accordion-body small-select">
                            <form method="post">
                                <div className="row">
                                    <div className="col-6">
                                        <label className="mt-0" htmlFor="studentfirstname">Student First Name</label>
                                        <input
                                            type="text"
                                            value={formData[index]?.studentfirstname}
                                            onChange={(e) => handleChange(index, 'studentfirstname', e.target.value)}
                                            className="form-control"
                                            placeholder="First"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="mt-0" htmlFor="studentlastname">Student Last Name</label>
                                        <input
                                            type="text"
                                            value={formData[index]?.studentlastname}
                                            onChange={(e) => handleChange(index, 'studentlastname', e.target.value)}
                                            className="form-control"
                                            placeholder="Last"
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <label className="mt-3" htmlFor="studentbirthdate">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="studentbirthdate"
                                            id="studentbirthdate"
                                            autoComplete="off"
                                            className="form-control"
                                            onChange={(e) => handleChange(index, 'studentbirthdate', e.target.value)}
                                            value={formData[index]?.studentbirthdate}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="mt-3" htmlFor="studentgender">Gender</label>
                                        <select
                                            name="studentgender"
                                            className="form-select"
                                            value={formData[index]?.studentgender}
                                            onChange={(e) => handleChange(index, 'studentgender', e.target.value)}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-6">
                                                <label className="mt-3" htmlFor="studentschool">School They Attend</label>
                                                <input
                                                    type="text"
                                                    name="studentschool"
                                                    id="studentschool"
                                                    className="form-control"
                                                    placeholder="School name"
                                                    onChange={(e) => handleChange(index, 'studentschool', e.target.value)}
                                                    value={formData[index]?.studentschool}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="mt-3" htmlFor="studentgrade">Grade</label>
                                                <input
                                                    type="text"
                                                    name="studentgrade"
                                                    id="studentgrade"
                                                    className="form-control"
                                                    placeholder="Grade"
                                                    onChange={(e) => handleChange(index, 'studentgrade', e.target.value)}
                                                    value={formData[index]?.studentgrade}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label className="mt-3" htmlFor="studentteacher">Teacher</label>
                                        <input
                                            type="text"
                                            name="studentteacher"
                                            id="studentteacher"
                                            className="form-control"
                                            placeholder="Teacher name"
                                            onChange={(e) => handleChange(index, 'studentteacher', e.target.value)}
                                            value={formData[index]?.studentteacher}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <label className="mt-3" htmlFor="studentparentpickup">Student Pickup</label>
                                        <select
                                            name="studentparentpickup"
                                            id="studentparentpickup"
                                            className="form-select"
                                            value={formData[index]?.studentparentpickup}
                                            onChange={(e) => handleChange(index, 'studentparentpickup', e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Parent Pickup">Parent Pickup</option>
                                            <option value="After School Care">After School Care</option>
                                            <option value="Walk/Ride Bike">Walk/Ride Bike</option>
                                            <option value="School Bus">School Bus</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="mt-3" htmlFor="studentpickupauth">Person Authorized to Pick Up</label>
                                        <input
                                            type="text"
                                            name="studentpickupauth"
                                            id="studentpickupauth"
                                            className="form-control"
                                            placeholder="Full name of authorized person"
                                            value={formData[index]?.studentpickupauth}
                                            onChange={(e) => handleChange(index, 'studentpickupauth', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <label className="mt-3" htmlFor="studentspecialinstruction">Special Instruction</label>
                                        <textarea
                                            value={formData[index]?.studentspecialinstruction}
                                            onChange={(e) => handleChange(index, 'studentspecialinstruction', e.target.value)}
                                            className="form-control"
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
                <span>{t('Add Another Student')}</span>
            </span>
            <div className="d-flex justify-content-start gap-2 mt-2">
                <button className="btn-style1" onClick={onCheckout}>{t('Select Students')}</button>
                {update ? <button className="btn-style4 rounded-0" onClick={() => { onSubmit(students) }}>{t('Update Students')}</button> : ''}
            </div>
        </div>

    </>
}