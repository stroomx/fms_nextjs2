'use client';

import axiosInstance from '@/axios';
import React, { useEffect, useState } from 'react';
import alert from '@/app/components/SweetAlerts';

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
            setStudents(data?.students);
            setPolicies(data?.policies);
            setAgreements(data?.agreements);
            setFormData(data?.parentdetails);
        } catch (err) {
            console.error(err);
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
        try {
            const { data } = await axiosInstance.post('/api/parentprofile.php', formData);
            setFormStatus(true);
            alert({ type: "success", message: data?.message });
        } catch (err) {
            console.error(err);
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
                <div className="card rounded-0">
                    <div className="parent-info pb-4 mb-4">
                        <div className="title">
                            <h6 className="text-grey font-bold">{t('Parent Info')}</h6>
                            <div className="flexed text-blue">
                                <img src="/assets/img/pencil.svg" alt="" />
                                <p className="text-14 font-semibold cursor-pointer" onClick={() => { setFormStatus(false) }}>{t('Edit Profile')}</p>
                            </div>
                        </div>
                        <form className='pt-0' onSubmit={handleSubmit}>
                            <div className="input-flex">
                                <div>
                                    <label htmlFor="first-name" className="mt-3">
                                        {t('Parent First Name')}
                                    </label>
                                    {!loading ? (<input
                                        type="text"
                                        id="first-name"
                                        name="firstName"
                                        className="form-control rounded-0"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                        required
                                    />) : (<Skeleton height={40} />)}
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="mt-3">
                                        {t('Parent Last Name')}
                                    </label>
                                    {!loading ? (<input
                                        type="text"
                                        id="last-name"
                                        name="lastName"
                                        className="form-control rounded-0"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                        required
                                    />) : (<Skeleton height={40} />)}
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
                                        className="form-control rounded-0"
                                        placeholder="doejohn125484@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                        required
                                    />) : (<Skeleton height={40} />)}
                                </div>
                                <div>
                                    <label htmlFor="registrationid" className="mt-3">
                                        {t('Registration Id')}
                                    </label>
                                    {!loading ? (<input
                                        type="registrationid"
                                        id="registrationid"
                                        name="registrationid"
                                        className="form-control rounded-0"
                                        placeholder="Registration Id"
                                        value={formData.registrationid ?? ''}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                    />) : (<Skeleton height={40} />)}
                                </div>
                                {/* <div>
                                <label htmlFor="timezone" className="mt-3">
                                    {t('Current Time Zone')}
                                </label>
                                <select
                                    id="timezone"
                                    name="timezone"
                                    className="form-control rounded-0"
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
                                <div className="d-flex gap-1">
                                    <button type="submit" className="btn btn-primary mt-3 rounded-0">
                                        {t('Save Changes')}
                                    </button>
                                    <button type="button" className="btn btn-danger mt-3 rounded-0" onClick={() => { setFormStatus(true) }}>
                                        {t('Cancel')}
                                    </button>
                                </div>
                            }
                        </form>
                    </div>
                    <ParentAddress></ParentAddress>
                    <StudentInfo students={students} loading={loading} update={fetchData} />
                    <FranchisePolicies policies={policies} loading={loading} />
                    {agreements.length > 0 ? <FranchiseAgreements agreements={agreements} loading={loading} /> : ''}
                    <ActionButtons />
                </div>
            </div>
        </>
    );
};

const ParentAddress = () => {
    const [formStatus, setFormStatus] = useState(true);
    const [formData, setFormData] = useState({
        countries: [],
        addressid: '',
        addresszip: '',
        addresscity: '',
        addressstate: '',
        addressstreet: '',
        addresscountryid: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/api/parentaddress.php');
            setFormData({
                countries: data?.countries,
                addressid: data?.address.addressid ?? '',
                addresszip: data?.address.addresszip ?? '',
                addresscity: data?.address.addresscity ?? '',
                addressstate: data?.address.addressstate ?? '',
                addressstreet: data?.address.addressstreet ?? '',
                addresscountryid: data?.address.addresscountryid ?? ''
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const obj = {
            ...formData,
            countries: []
        }

        try {
            const { data } = await axiosInstance.post('/api/parentaddress.php', obj);
            setFormStatus(true);
            alert({ type: "success", message: data?.message });
        } catch (err) {
            console.error(err);
        }
    };

    const t = (e) => e;

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="parent-info pb-4">
            <div className="title">
                <h6 className="text-grey font-bold">{t('Address')}</h6>
                <div className="flexed text-blue">
                    <img src="/assets/img/pencil.svg" alt="Edit Address" />
                    <p
                        className="text-14 font-semibold cursor-pointer"
                        onClick={() => setFormStatus(false)}
                    >{t('Edit Address')}</p>
                </div>
            </div>
            <form className='pt-0' onSubmit={handleSubmit}>
                <div className="input-flex">
                    <div>
                        <label htmlFor="addressstreet" className="mt-3">{t('Street Address')}</label>
                        {!loading ? (
                            <input
                                type="text"
                                name="addressstreet"
                                id="addressstreet"
                                className="form-control rounded-0"
                                value={formData.addressstreet}
                                onChange={handleChange}
                                disabled={formStatus}
                            />
                        ) : (
                            <Skeleton height={40} />
                        )}
                    </div>
                </div>
                <div className="input-flex">
                    <div>
                        <label htmlFor="addresscity" className="mt-3">{t('City')}</label>
                        {!loading ? (
                            <input
                                type="text"
                                name="addresscity"
                                id="addresscity"
                                className="form-control rounded-0"
                                value={formData.addresscity}
                                onChange={handleChange}
                                disabled={formStatus}
                            />
                        ) : (
                            <Skeleton height={40} />
                        )}
                    </div>
                    <div>
                        <label htmlFor="addresszip" className="mt-3">{t('Zip Code')}</label>
                        {!loading ? (
                            <input
                                type="text"
                                name="addresszip"
                                id="addresszip"
                                className="form-control rounded-0"
                                value={formData.addresszip}
                                onChange={handleChange}
                                disabled={formStatus}
                            />
                        ) : (
                            <Skeleton height={40} />
                        )}
                    </div>
                </div>
                <div className="input-flex">
                    <div>
                        <label htmlFor="addresscountryid" className="mt-3">{t('Country')}</label>
                        {!loading ? (
                            <select
                                className='form-select rounded-0'
                                name="addresscountryid"
                                id="addresscountryid"
                                value={formData.addresscountryid}
                                onChange={handleChange}
                                disabled={formStatus}>
                                <option value="" hidden>{t('Select Country')}</option>
                                {formData?.countries.map((country, index) =>
                                    <option key={index} value={country?.id}>
                                        {country?.name}
                                    </option>
                                )}
                            </select>
                        ) : (
                            <Skeleton height={40} />
                        )}
                    </div>
                    <div>
                        <label htmlFor="addressstate" className="mt-3">{t('State')}</label>
                        {!loading ? (
                            <input
                                type="text"
                                name="addressstate"
                                id="addressstate"
                                className="form-control rounded-0"
                                value={formData.addressstate}
                                onChange={handleChange}
                                disabled={formStatus}
                            />
                        ) : (
                            <Skeleton height={40} />
                        )}
                    </div>
                </div>
                {
                    !formStatus &&
                    <div className="d-flex gap-1">
                        <button type="submit" className="btn btn-primary mt-3 rounded-0">
                            {t('Save Changes')}
                        </button>
                        <button type="button" className="btn btn-danger mt-3 rounded-0" onClick={() => { setFormStatus(true) }}>
                            {t('Cancel')}
                        </button>
                    </div>
                }
            </form>
        </div>
    );
};

const StudentInfo = ({ students, loading = true, update = () => { } }) => {
    const t = (e) => e;
    const [formData, setFormData] = useState([]);

    const handleChange = (index, field, value) => {
        const updatedData = [...formData];
        updatedData[index][field] = value;
        setFormData(updatedData);
    };

    const updateStudent = async (index) => {
        try {
            const form = document.getElementById(`student-${index}`);

            if (form.checkValidity() === false) {
                form.reportValidity();
                return;
            }

            const student = {
                ...formData[index],
                studentname: `${formData[index]?.studentfirstname} ${formData[index]?.studentlastname}`
            }

            const { data } = await axiosInstance.post("api/students.php", { 'students': [student] });
            alert({ type: "success", message: data });
            update();
            const button = document.getElementById(`hide-button-${index}`);
            button.click();
        } catch (err) {
            console.error(err);
        }
    }

    const getMaxDate = () => {
        const max = new Date();
        max.setFullYear(max.getFullYear() - process.env.NEXT_PUBLIC_MIN_STUDENT_AGE);

        const year = max.getFullYear();
        const month = (max.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = max.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        setFormData([...students]);
    }, [students]);

    return <div className="student-info mt-4">
        <div className="title">
            <h6 className="text-grey font-bold">{t('Student')}</h6>
        </div>
        <div className="table-responsive table-2 pb-5 mt-3 rounded-0">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <td className='text-center'>#</td>
                        <td className='text-center'>{t('Student')}</td>
                        <td className='text-center'>{t('Date of Birth')}</td>
                        <td className='text-center'>{t('Gender')}</td>
                        <td className='text-center'>{t('Photo Release')}</td>
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
                            <td className='text-center'>{student.studentphotorelease == 1 ? <span className="badge text-bg-success">{t('Consented')}</span>
                                : <span className="badge text-bg-danger">{t('No Consent')}</span>
                            }</td>
                            <td className={`text-${student.studentinactivateddate ? 'danger' : 'success'} text-center`}>
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
                                            <div className="modal-body text-start">
                                                <form id={`student-${index}`}>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label className="mt-0 required" htmlFor="studentfirstname">{t('Student First Name')}</label>
                                                            <input
                                                                type="text"
                                                                value={formData[index]?.studentfirstname ?? ''}
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
                                                                value={formData[index]?.studentlastname ?? ''}
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
                                                                className="form-control rounded-0"
                                                                onChange={(e) => handleChange(index, 'studentbirthdate', e.target.value)}
                                                                max={getMaxDate()}
                                                                value={formData[index]?.studentbirthdate ?? ''}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="mt-3 required" htmlFor="studentgender">{t('Gender')}</label>
                                                            <select
                                                                name="studentgender"
                                                                className="form-select rounded-0"
                                                                value={formData[index]?.studentgender ?? ''}
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
                                                                        className="form-control rounded-0"
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
                                                                className="form-control rounded-0"
                                                                placeholder="Teacher name"
                                                                onChange={(e) => handleChange(index, 'studentteacher', e.target.value)}
                                                                value={formData[index]?.studentteacher ?? ''}
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
                                                                value={formData[index]?.studentparentpickup ?? ''}
                                                                onChange={(e) => handleChange(index, 'studentparentpickup', e.target.value)}
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
                                                                value={formData[index]?.studentpickupauth ?? ''}
                                                                onChange={(e) => handleChange(index, 'studentpickupauth', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12">
                                                            <label className="mt-3" htmlFor="studentspecialinstruction">{t('Dismissal Instruction')}</label>
                                                            <textarea
                                                                value={formData[index]?.studentspecialinstruction ?? ''}
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
                                            <div className="modal-footer justify-content-start">
                                                <button type="button" className="btn btn-primary rounded-0" onClick={() => { updateStudent(index) }}>{t('Save changes')}</button>
                                                <button type="button" id={`hide-button-${index}`} className="btn btn-secondary rounded-0" data-bs-dismiss="modal">{t('Close')}</button>
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
                                    className="mdi mdi-clipboard-outline text-primary cursor-pointer"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#franchise-policy-${index}`}
                                />
                                <div className="modal fade" id={`franchise-policy-${index}`} aria-hidden="true" >
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content ">
                                            <div className="modal-header border-0 d-flex justify-content-between align-items-center ">
                                                <p className="font-bold text-blue fs-5" id="modalLabel">{policy?.franchisename + ' ' + t('Franchise Policy')}</p>
                                                <i className="mdi mdi-close-circle fs-4 text-primary cursor-pointer" id={`student-close-${index}`} data-bs-dismiss="modal" aria-label="Close"></i>
                                            </div>
                                            <div className="modal-body pt-0" dangerouslySetInnerHTML={{ __html: policy?.policy }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
            const close = document.getElementById('closeModalDelete');
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
            <button className="btn btn-outline-danger rounded-0" data-bs-toggle="modal"
                data-bs-target="#delete-profile">
                <i className="mdi mdi-delete-outline"></i> {t('Remove My Profile')}
            </button>
            <button className="btn btn-outline-primary rounded-0" onClick={downloadProfile}>
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
                                    className="form-control rounded-0"
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
                                    className="form-control rounded-0"
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
