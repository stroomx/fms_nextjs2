'use client';

import axiosInstance from '@/axios';
import React, { useEffect, useState } from 'react';

import Skeleton from 'react-loading-skeleton';

const ParentProfile = () => {
    const [formData, setFormData] = useState({
        email: '',
        userid: '',
        familyid: '',
        timezone: '',
        lastName: '',
        firstName: '',
        timezones: [],
        registrationid: '',
        consentgiven: false
    });

    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [agreements, setAgreements] = useState([]);
    const [formStatus, setFormStatus] = useState(true);

    const fetchData = async () => {
        try {
            const { data } = await axiosInstance.get('/api/parentprofile.php');
            // console.log(data);
            setStudents(data?.students);
            setPolicies(data?.policies);
            setAgreements(data?.agreements);
            setFormData(data?.parentdetails);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        try {
            const { data } = await axiosInstance.post('/api/parentprofile.php', formData);
            console.log(data, 'response');
            setFormStatus(true);
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    const t = (e) => e;

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {/* {loading && <div className="loading-overlay">
                <div className="spinner"></div>
            </div>} */}
            <div className="home-section mt-4">
                <div className="card">
                    <div className="parent-info pb-4">
                        <div className="title">
                            <h6 className="text-grey font-bold">{t('Parent Info')}</h6>
                            <div className="flexed text-blue">
                                <img src="/assets/img/pencil.svg" alt="" />
                                <p className="text-14 font-semibold" onClick={() => { setFormStatus(false) }}>{t('Edit Profile')}</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-flex">
                                <div>
                                    <label htmlFor="first-name" className="mt-3">
                                        {t('Parent First Name')}
                                    </label>
                                    {!loading ? (<input
                                        type="text"
                                        id="first-name"
                                        name="firstName"
                                        className="input-style1"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                        required
                                    />) : (<Skeleton height={40} count={1} />)}
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="mt-3">
                                        {t('Parent Last Name')}
                                    </label>
                                    {!loading ? (<input
                                        type="text"
                                        id="last-name"
                                        name="lastName"
                                        className="input-style1"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                        required
                                    />) : (<Skeleton height={40} count={1} />)}
                                </div>
                            </div>
                            <div className="input-flex">
                                <div>
                                    <label htmlFor="email" className="mt-3">
                                        {t('Email')}
                                    </label>
                                    {!loading ? (<input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="input-style1"
                                        placeholder="doejohn125484@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                        required
                                    />) : (<Skeleton height={40} count={1} />)}
                                </div>
                                <div>
                                    <label htmlFor="registrationid" className="mt-3">
                                        {t('Registration Id')}
                                    </label>
                                    {!loading ? (<input
                                        type="registrationid"
                                        id="registrationid"
                                        name="registrationid"
                                        className="input-style1"
                                        placeholder="Registration Id"
                                        value={formData.registrationid ?? ''}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                    />) : (<Skeleton height={40} count={1} />)}
                                </div>
                                {/* <div>
                                <label htmlFor="timezone" className="mt-3">
                                    {t('Current Time Zone')}
                                </label>
                                <select
                                    id="timezone"
                                    name="timezone"
                                    className="input-style1"
                                    value={formData.timezone}
                                    onChange={handleChange}
                                    disabled={formStatus}
                                    required
                                >
                                    <option value="" disabled>
                                        {t('Select Time Zone')}
                                    </option>
                                    {Object.entries(formData.timezones).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div> */}

                            </div>
                            {/* <div className="d-flex flex-column gap-2 pt-4 pb-1">
                            <div className="d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="offers"
                                    name="consentgiven"
                                    checked={formData.consentgiven}
                                    onChange={handleChange}
                                />
                                <label className="mb-0" htmlFor="offers">
                                    {t('I would like to receive offers and marketing updates about Bricks 4 Kidz programs.')}
                                </label>
                            </div>
                        </div> */}
                            {
                                !formStatus &&
                                <button type="submit" className="btn btn-primary mt-3">
                                    {t('Save Changes')}
                                </button>
                            }
                        </form>
                    </div>
                    <StudentInfo students={students} loading={loading} />
                    <FranchisePolicies policies={policies} loading={loading} />
                    {agreements.length > 0 ? <FranchiseAgreements agreements={agreements} loading={loading} /> : ''}
                    <ActionButtons />
                </div>
            </div>
        </>
    );
};

const StudentInfo = ({ students, loading = true }) => {
    const t = (e) => e;
    const [formData, setFormData] = useState([]);

    const handleChange = (index, field, value) => {
        const updatedData = [...formData];
        updatedData[index][field] = value;
        setFormData(updatedData);
    };

    const updateStudent = (index) => {

    }

    useEffect(() => {
        setFormData([...students]);
    }, [students]);

    return <div className="student-info mt-4">
        <div className="title">
            <h6 className="text-grey font-bold">{t('Student')}</h6>
        </div>
        <div className="table-responsive mt-3">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <td className='text-center'>#</td>
                        <td className='text-center'>{t('Student')}</td>
                        <td className='text-center'>{t('Date of Birth')}</td>
                        <td className='text-center'>{t('Gender')}</td>
                        <td className='text-center'>{t('Balance')}</td>
                        <td className='text-center'>{t('Status')}</td>
                        <td className='text-center'>{t('View')}</td>
                    </tr>
                </thead>
                <tbody>
                    {!loading ? (students?.map((student, index) => (
                        <tr key={index}>
                            <td className='text-center'>{index + 1}</td>
                            <td className='text-center'>{student.studentname}</td>
                            <td className='text-center'>{student.studentbirthdate}</td>
                            <td className='text-center'>{student.studentgender}</td>
                            <td className='text-center'>{student.balance || 0}</td>
                            <td className={`${student.studentinactivateddate ? 'inactive' : 'active'} text-center`}>
                                {student.studentinactivateddate ? 'Inactive' : 'Active'}
                            </td>
                            <td className='text-center'>
                                <i className="mdi mdi-pencil text-primary cursor-pointer"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#student-editor-${index}`}
                                ></i>
                                <div className="modal fade" id={`student-editor-${index}`} aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content ">
                                            <div className="modal-header d-flex justify-content-between">
                                                <p className="font-bold text-blue fs-4" id="modalLabel">{student.studentname}</p>
                                                <img id="closeModal" src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" />
                                            </div>
                                            <div className="modal-body">
                                                <form method="post">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label className="mt-0" htmlFor="studentfirstname">{t('Student First Name')}</label>
                                                            <input
                                                                type="text"
                                                                value={formData[index]?.studentfirstname ?? ''}
                                                                onChange={(e) => handleChange(index, 'studentfirstname', e.target.value)}
                                                                className="form-control"
                                                                placeholder="First"
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="mt-0" htmlFor="studentlastname">{t('Student Last Name')}</label>
                                                            <input
                                                                type="text"
                                                                value={formData[index]?.studentlastname ?? ''}
                                                                onChange={(e) => handleChange(index, 'studentlastname', e.target.value)}
                                                                className="form-control"
                                                                placeholder="Last"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label className="mt-3" htmlFor="studentbirthdate">{t('Date of Birth')}</label>
                                                            <input
                                                                type="date"
                                                                name="studentbirthdate"
                                                                id="studentbirthdate"
                                                                autoComplete="off"
                                                                className="form-control"
                                                                onChange={(e) => handleChange(index, 'studentbirthdate', e.target.value)}
                                                                value={formData[index]?.studentbirthdate ?? ''}
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="mt-3" htmlFor="studentgender">{t('Gender')}</label>
                                                            <select
                                                                name="studentgender"
                                                                className="form-select"
                                                                value={formData[index]?.studentgender ?? ''}
                                                                onChange={(e) => handleChange(index, 'studentgender', e.target.value)}
                                                            >
                                                                <option value="Male">{t('Male')}</option>
                                                                <option value="Female">{t('Female')}</option>
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
                                                                        className="form-control"
                                                                        placeholder="School name"
                                                                        onChange={(e) => handleChange(index, 'studentschool', e.target.value)}
                                                                        value={formData[index]?.studentschool ?? ''}
                                                                    />
                                                                </div>
                                                                <div className="col-6">
                                                                    <label className="mt-3" htmlFor="studentgrade">{t('Grade')}</label>
                                                                    <input
                                                                        type="text"
                                                                        name="studentgrade"
                                                                        id="studentgrade"
                                                                        className="form-control"
                                                                        placeholder="Grade"
                                                                        onChange={(e) => handleChange(index, 'studentgrade', e.target.value)}
                                                                        value={formData[index]?.studentgrade ?? ''}
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
                                                                className="form-control"
                                                                placeholder="Teacher name"
                                                                onChange={(e) => handleChange(index, 'studentteacher', e.target.value)}
                                                                value={formData[index]?.studentteacher ?? ''}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label className="mt-3" htmlFor="studentparentpickup">{t('Student Pickup')}</label>
                                                            <select
                                                                name="studentparentpickup"
                                                                id="studentparentpickup"
                                                                className="form-select"
                                                                value={formData[index]?.studentparentpickup ?? ''}
                                                                onChange={(e) => handleChange(index, 'studentparentpickup', e.target.value)}
                                                            >
                                                                <option value="">{t('Select')}</option>
                                                                <option value="Parent Pickup">{t('Parent Pickup')}</option>
                                                                <option value="After School Care">{t('After School Care')}</option>
                                                                <option value="Walk/Ride Bike">{t('Walk/Ride Bike')}</option>
                                                                <option value="School Bus">{t('School Bus')}</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="mt-3" htmlFor="studentpickupauth">{t('Person Authorized to Pick Up')}</label>
                                                            <input
                                                                type="text"
                                                                name="studentpickupauth"
                                                                id="studentpickupauth"
                                                                className="form-control"
                                                                placeholder="Full name of authorized person"
                                                                value={formData[index]?.studentpickupauth ?? ''}
                                                                onChange={(e) => handleChange(index, 'studentpickupauth', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12">
                                                            <label className="mt-3" htmlFor="studentspecialinstruction">{t('Dismissal Instruction')}</label>
                                                            <textarea
                                                                value={formData[index]?.studentspecialinstruction ?? ''}
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
                                            <div className="modal-footer text-center">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))) : (<tr><td colSpan={7}><Skeleton count={3} /></td></tr>)}
                </tbody>
            </table>
        </div>
    </div>
};

const FranchisePolicies = ({ policies = [], loading = true }) => {
    const t = (e) => e;

    return <div className="student-info mt-4">
        <div className="title small-select">
            <h6 className="text-grey font-bold">{t('Franchise Policies')}</h6>
        </div>
        <div className="table-responsive mt-3">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <td className='text-center'>#</td>
                        <td className='text-center'>{t('Franchise')}</td>
                        <td className='text-center'>{t('Policy Version')}</td>
                        <td className='text-center'>{t('Signature Date & Time')}</td>
                        <td className='text-center'>{t('Status')}</td>
                        <td className='text-center'>{t('Details')}</td>
                    </tr>
                </thead>
                <tbody>
                    {!loading ? (policies.map((policy, index) => (
                        <tr key={index}>
                            <td className='text-center'>{index + 1}</td>
                            <td className='text-center'>{policy.franchisename}</td>
                            <td className='text-center'>{policy.version}</td>
                            <td className='text-center'>{policy.signeddate || t('Not Signed')}</td>
                            <td className={`${policy.signeddate ? 'active' : 'pending'} text-center`}>
                                {policy.signeddate ? 'Signed' : 'Pending'}
                            </td>
                            <td className='text-center'>
                                <i
                                    className="fa-solid fa-clipboard-list text-blue cursor-pointer"
                                    data-bs-toggle="modal"
                                    data-bs-target="#franchise-policy"
                                />
                            </td>
                        </tr>
                    ))) : (<tr><td colSpan={6}><Skeleton count={3} /></td></tr>)}
                </tbody>
            </table>
        </div>
    </div>
};

const FranchiseAgreements = ({ agreements = [], loading = true }) => {
    const t = (e) => e;

    return <div className="student-info mt-4">
        <div className="title small-select">
            <h6 className="text-grey font-bold">{t('Franchise Agreements')}</h6>
        </div>
        <div className="table-responsive mt-3">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <td className='text-center'>#</td>
                        <td className='text-center'>{t('Agreement Name')}</td>
                        <td className='text-center'>{t('Agreement Version')}</td>
                        <td className='text-center'>{t('Signature By')}</td>
                        <td className='text-center'>{t('Signature Date & Time')}</td>
                        <td className='text-center'>{t('Details')}</td>
                    </tr>
                </thead>
                <tbody>
                    {!loading ? (agreements.map((agreement, index) => (
                        <tr key={index}>
                            <td className='text-center'>{index + 1}</td>
                            <td className='text-center'>{agreement.name}</td>
                            <td className='text-center'>{agreement.version}</td>
                            <td className='text-center'>{agreement.signedby}</td>
                            <td className='text-center'>{agreement.signeddate}</td>
                            <td className='text-center'>
                                <i
                                    className="fa-solid fa-clipboard-list text-blue cursor-pointer"
                                    data-bs-toggle="modal"
                                    data-bs-target="#franchise-policy"
                                />
                            </td>
                        </tr>
                    ))) : (<tr><td colSpan={6}><Skeleton count={3} /></td></tr>)}
                </tbody>
            </table>
        </div>
    </div>
};

const ActionButtons = () => {
    const t = (e) => e;

    const deleteProfile = async (e) => {
        e.preventDefault();

        const obj = {
            useremail: e.target.useremail.value
        };

        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/deleteprofile.php', obj);
            console.log(response);
            const close = document.getElementById('closeModalDelete');
            console.log(close)
            close.click();
        } catch (err) {
            console.error('Error deleting profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async () => {
        try {

        } catch (err) {

        } finally {

        }
    };

    const [loading, setLoading] = useState(false);
    const downloadProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/downloadprofile.php', {
                responseType: 'blob',
            });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'userprofile.zip');
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return <>
        <div className="action-btns justify-content-center gap-5">
            <button className="btn btn-delete" data-bs-toggle="modal"
                data-bs-target="#delete-profile">
                <i className="mdi mdi-delete-outline"></i> {t('Remove My Profile')}
            </button>
            <button className="btn btn-profile" onClick={downloadProfile}>
                <i className="mdi mdi-download"></i> {t('Download Profile')}
            </button>
            {/* <button
                className="btn btn-password"
                data-bs-toggle="modal"
                data-bs-target="#change-pass"
            >
                <i className="mdi mdi-lock-outline"></i> {t('Change Password')}
            </button> */}
        </div>
        <div className="modal fade" id="change-pass" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content ">
                    <div className="modal-header d-flex justify-content-between border-0">
                        <p className="font-bold text-blue fs-5" id="modalLabel">{t('Change My Password')}</p>
                        <img id="closeModalChangePass" src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='fs-5 mb-3'>{t('Please enter your email below to confirm the removal of your profile.')}</div>
                        <form onSubmit={deleteProfile}>
                            <div>
                                <input
                                    type="email"
                                    id="useremail"
                                    name="useremail"
                                    className="input-style1"
                                    placeholder="Email"
                                    defaultValue=''
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="w-100 d-flex justify-content-center mt-4">
                                <button className='btn btn-danger w-75' disabled={loading}>
                                    {loading ? <><i className='fa fa-circle fa-spin'></i> {t('Submitting Removal Request')}</> : t('Remove Profile')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal fade" id="delete-profile" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content ">
                    <div className="modal-header d-flex justify-content-between border-0">
                        <p className="font-bold text-blue fs-5" id="modalLabel">{t('Remove My Profile')}</p>
                        <img id="closeModalDelete" src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className='fs-5 mb-3'>{t('Please enter your email below to confirm the removal of your profile.')}</div>
                        <form onSubmit={deleteProfile}>
                            <div>
                                <input
                                    type="email"
                                    id="useremail"
                                    name="useremail"
                                    className="input-style1"
                                    placeholder="Email"
                                    defaultValue=''
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="w-100 d-flex justify-content-center mt-4">
                                <button className='btn btn-danger w-75' disabled={loading}>
                                    {loading ? <><i className='fa fa-circle fa-spin'></i> {t('Submitting Removal Request')}</> : 'Remove Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>

};

export default ParentProfile;
