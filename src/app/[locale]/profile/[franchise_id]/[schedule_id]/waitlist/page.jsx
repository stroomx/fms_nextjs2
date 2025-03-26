'use client';

import { useTranslation } from "react-i18next";
import axiosInstance from "@/axios"
import { useEffect, useState } from "react";
import TextWithToggle from "@/app/components/TextWithToggle";
import alert from '@/app/components/SweetAlerts';
import { useRouter } from "next/navigation";


export default function WaitList({ params: { franchise_id, schedule_id } }) {
    const { t } = useTranslation();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState({});
    const [studentData, setStudentData] = useState([]);
    const [students, setStudents] = useState({});

    const getBorder = (index) => {
        if (studentData?.length == 1)
            return 'border rounded';

        const total = studentData?.length - 1;
        let borderClass = '';

        switch (index) {
            case 0:
                borderClass = 'border border-bottom-0 ';
                break;
            case total:
                borderClass = 'border ';
                break;
            default:
                borderClass = 'border border-bottom-0 ';
        }

        return borderClass;
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const obj = {
            schedule_id: schedule_id,
            students: Object.values(students),
        }

        try {
            const { data } = await axiosInstance.post('/api/waitlist.php', obj);
            alert({ type: "success", message: data?.message });
            await fetch();
            router.push(`/profile/${franchise_id}`);

        } catch (err) {
            console.error(err);
        }

    }

    const handleChange = (e, index, id = '') => {
        const { value, type, checked } = e.target;
        const localStudentsData = [...studentData];
        const localStudents = { ...students };

        if (type == 'checkbox') {
            if (checked) {
                localStudents[id] = {
                    id: id,
                    name: studentData[index]['studentname'],
                    note: document.getElementById(`note-${id}`).value,
                };

                localStudentsData[index]['selected'] = true;

            } else {
                localStudentsData[index]['selected'] = false;
                delete localStudents[id];
            }
        } else {
            if (localStudents[id]) {
                localStudents[id] = {
                    ...localStudents[id],
                    note: value
                }
            }
        }

        setStudents(localStudents);
        setStudentData(localStudentsData);
    };

    const fetch = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/waitlist.php?sid=${schedule_id}`);

            if (data?.schedule?.waitlist == '0') {
                router.push(`/profile/${franchise_id}`);
                alert({ message: t('Schedule does not have a waitlist.') });
                return;
            }

            const localStudentData = [...data?.waitlist?.map((ele) => { ele['onWaitlist'] = true; return ele; }), ...data?.nonwaitlist];

            if (localStudentData.length < 1) {
                const button = document.getElementById('new-student');
                button.click();
            }

            setSchedule(data?.schedule);
            setStudentData(localStudentData);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetch();
    }, []);

    return <>
        {loading && <div className="loading-overlay">
            <div className="spinner"></div>
        </div>}
        <div className="padding-top container">
            <div className="d-flex justify-content-end">
                <span id="new-student" className="pt-3 px-1 text-primary cursor-pointer fw-bold" data-bs-toggle="modal" data-bs-target={`#new-student-modal`}>
                    <i className="mdi mdi-plus-circle pe-1"></i>
                    {t('Add New Student')}
                </span>
            </div>
            <div className="d-flex flex-column align-items-center">
                <div className="d-flex flex-column align-items-center card p-3 w-50 rounded-0">
                    <h4>{schedule?.name}</h4>
                    <p>{schedule?.location_name}</p>
                    <p>{schedule?.firstdate + ' - ' + schedule?.lastdate}</p>
                    <div className="text-center"><TextWithToggle description={schedule?.description} maxLength={200}></TextWithToggle></div>
                </div>
                {studentData?.length < 1 ? <h4>{t('No Students Found')}</h4> : <h4>{t('Select Students')}</h4>}
                <form onSubmit={onSubmit} className="w-50">
                    <div className="accordion" id="studentsAccordion">
                        {studentData?.map((student, index) =>
                            <div className="accordion-item border-0" key={student.studentid}>
                                <div className={`accordion-header align-items-center d-flex ${getBorder(index)}`}>
                                    <div className="input-checkbox ms-3 position-absolute" style={{ "zIndex": 4, "width": "1rem" }}>
                                        <input
                                            id={`checkbox${index}`}
                                            className="d-none"
                                            type="checkbox"
                                            value={1}
                                            checked={student.selected ?? false}
                                            onChange={(e) => { handleChange(e, index, student['studentid']) }}
                                            disabled={student.onWaitlist}
                                        />
                                        <label className={student?.selected ? 'mb-0 text-blue' : 'mb-0'} htmlFor={`checkbox${index}`}><i className={(student?.selected || student.onWaitlist) ? 'fs-5 mdi mdi-check-circle' : 'fs-5 mdi mdi-circle-outline'}></i></label>
                                    </div>
                                    <button className="accordion-button collapsed" type="button" id={`student-button-${index}`} data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`} disabled={student?.onWaitlist}>
                                        <div className="ms-4 w-100 d-flex gap-2">
                                            <p className="fs-6 font-semibold">{student?.studentname}</p>
                                            {student.onWaitlist && <><span className="text-grey">|</span> <p className="text-danger">{t('Already on waitlist')}</p> </>}
                                        </div>
                                    </button>
                                </div>
                                <div id={`collapse${index}`} className="accordion-collapse collapse mb-3" data-bs-parent="#studentsAccordion">
                                    <div className="custom-accordion-body small-select">
                                        <textarea
                                            type="text"
                                            className="form-control rounded-0"
                                            placeholder={t('Note')}
                                            id={`note-${student['studentid']}`}
                                            onChange={(e) => { handleChange(e, index, student['studentid']) }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {studentData?.length > 0 && <button className="btn btn-primary rounded-0 mt-3 w-100 mb-3">{t('Enroll on waitlist')}</button>}
                </form>
                <AddStudent refresh={fetch}></AddStudent>
            </div>
        </div>
    </>
};

function AddStudent({ refresh = async () => { } }) {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        studentbirthdate: "",
        studentfirstname: "",
        studentgender: "",
        studentgrade: "",
        studentlastname: "",
        studentname: "",
        studentparentpickup: "",
        studentphotorelease: true,
        studentpickupauth: "",
        studentschool: "",
        studentspecialinstruction: t("None"),
        studentteacher: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const updatedData = { ...formData };

        if (type == 'checkbox') {
            updatedData[name] = checked;
        } else {
            updatedData[name] = value;
        }

        setFormData(updatedData);
    };

    const getMaxDate = () => {
        const max = new Date();
        max.setFullYear(max.getFullYear() - process.env.NEXT_PUBLIC_MIN_STUDENT_AGE);

        const year = max.getFullYear();
        const month = (max.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = max.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const onSubmit = async (e) => {
        try {
            e.preventDefault();

            const student = {
                ...formData,
                studentname: `${formData?.studentfirstname} ${formData?.studentlastname}`
            }

            const { data } = await axiosInstance.post("api/students.php", { 'students': [student] });
            alert({ type: "success", message: data });

            await refresh();
            const button = document.getElementById(`closeModal`);
            button.click();

            setFormData({});
        } catch (err) {
            console.error(err);
        }
    }

    return <>
        <div className="modal fade" id={`new-student-modal`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content ">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="font-bold text-blue fs-4" id="modalLabel">{t('Add New Student ')}</p>
                        <img id="closeModal" src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body text-start">
                            <div className="row">
                                <div className="col-6">
                                    <label className="mt-0 required" htmlFor="studentfirstname">{t('Student First Name')}</label>
                                    <input
                                        type="text"
                                        name="studentfirstname"
                                        value={formData?.studentfirstname ?? ''}
                                        onChange={handleChange}
                                        className="form-control rounded-0"
                                        placeholder="First"
                                        required
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="mt-0 required" htmlFor="studentlastname">{t('Student Last Name')}</label>
                                    <input
                                        type="text"
                                        name="studentlastname"
                                        value={formData?.studentlastname ?? ''}
                                        onChange={handleChange}
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
                                        className="form-control rounded-0"
                                        onChange={handleChange}
                                        max={getMaxDate()}
                                        value={formData?.studentbirthdate ?? ''}
                                        required
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="mt-3 required" htmlFor="studentgender">{t('Gender')}</label>
                                    <select
                                        name="studentgender"
                                        className="form-select rounded-0"
                                        value={formData?.studentgender ?? ''}
                                        onChange={handleChange}
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
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-6">
                                            <label className="mt-3" htmlFor="studentschool">{t('School They Attend')}</label>
                                            <input
                                                type="text"
                                                name="studentschool"
                                                id="studentschool"
                                                className="form-control rounded-0"
                                                placeholder="School name"
                                                onChange={handleChange}
                                                value={formData?.studentschool ?? ''}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="mt-3" htmlFor="studentgrade">{t('Grade')}</label>
                                            <input
                                                type="text"
                                                name="studentgrade"
                                                id="studentgrade"
                                                className="form-control rounded-0"
                                                placeholder="Grade"
                                                onChange={handleChange}
                                                value={formData?.studentgrade ?? ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label className="mt-3" htmlFor="studentteacher">{t('Teacher')}</label>
                                    <input
                                        type="text"
                                        name="studentteacher"
                                        id="studentteacher"
                                        className="form-control rounded-0"
                                        placeholder="Teacher name"
                                        onChange={handleChange}
                                        value={formData?.studentteacher ?? ''}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <label className="mt-3 required" htmlFor="studentparentpickup">{t('Student Pickup')}</label>
                                    <select
                                        name="studentparentpickup"
                                        id="studentparentpickup"
                                        className="form-select rounded-0"
                                        value={formData?.studentparentpickup ?? ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" hidden>{t('Select')}</option>
                                        <option value="Parent Pickup">{t('Parent Pickup')}</option>
                                        <option value="After School Care">{t('After School Care')}</option>
                                        <option value="Walk/Ride Bike">{t('Walk/Ride Bike')}</option>
                                        <option value="School Bus">{t('School Bus')}</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="mt-3 required" htmlFor="studentpickupauth">{t('Person Authorized to Pick Up')}</label>
                                    <input
                                        type="text"
                                        name="studentpickupauth"
                                        id="studentpickupauth"
                                        className="form-control rounded-0"
                                        placeholder="Full name of authorized person"
                                        value={formData?.studentpickupauth ?? ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <label className="mt-3" htmlFor="studentspecialinstruction">{t('Dismissal Instruction')}</label>
                                    <textarea
                                        name="studentspecialinstruction"
                                        value={formData?.studentspecialinstruction ?? ''}
                                        onChange={handleChange}
                                        className="form-control rounded-0"
                                        rows="4"
                                    />
                                </div>
                            </div>

                            <div className="check-group pt-3">
                                <div className="form-check">
                                    <label className="form-check-label" htmlFor="studentphotorelease">{t('Yes, I consent for use of any photographs or video recordings that are taken of my child while participating in our programs')}</label>
                                    <input className="form-check-input" type="checkbox" value={1} checked={formData?.studentphotorelease == 1} id="studentphotorelease" name="studentphotorelease" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-start">
                            <button className="btn btn-primary rounded-0">{t('Submit')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    </>;
}