'use client';

import React, { useState } from 'react';
import axiosInstance from '@/axios';
import axios from 'axios';
import alert from '@/app/components/SweetAlerts';
import AuthService from '@/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';

import { useTranslation } from 'react-i18next';

export default function SignUp() {
    const [formData, setFormData] = useState({
        zip: '',
        city: '',
        email: '',
        phone: '',
        state: '',
        street: '',
        country: '',
        password: '',
        lastname: '',
        firstname: '',
        studentgrade: '',
        studentgender: '',
        studentschool: '',
        studentteacher: '',
        confirmPassword: '',
        studentlastname: '',
        studentfirstname: '',
        studentbirthdate: '',
        studentpickupauth: '',
        studentphotorelease: true,
        studentparentpickup: '',
        studentspecialinstruction: 'None',
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [step, setStep] = useState(1); // To track the current step in the form
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type == "checkbox") {
            setFormData({ ...formData, [name]: checked });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        const form = document.getElementById('form');

        if (form.checkValidity() === false) {
            form.reportValidity();
            return;
        }

        e.preventDefault();

        if (!Cookies.get('consent_cookie')) {
            alert({ message: t('Please accept cookie notice.') });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/api/parentregistration.php', formData);
            console.log('Response:', data);
            // Handle success, maybe redirect or show success message

            const config = {
                headers: { Authorization: `Bearer ${data['token']}`, 'Content-Type': "application/json" }
            };

            axios.defaults.headers.common = config['headers'];
            const userDetails = await axios.get(`${apiUrl}/api/userdetails.php`);

            AuthService.login(userDetails['data'], data['token']);
            alert({ type: "success", message: t(data['message']), timer: 3000 });

            const franchise = searchParams.get('fid');
            const schedule = searchParams.get('sid');

            if (franchise && schedule) {
                router.push(`/profile/${franchise}/${schedule}/checkout`);
            } else {
                router.push(`/parent`);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = (e, targettedStep = 0) => {
        const form = document.getElementById('form');

        if (form.checkValidity() === false) {
            form.reportValidity();
        } else {
            e.preventDefault();
            if (targettedStep > 0) {
                setStep(targettedStep);
            } else {
                setStep(step + 1); // Move to the next step
            }
        }
    };

    const previousStep = () => {
        setStep(step - 1); // Go back to the previous step
    };

    return (
        <div className="padding-top">
            <div className="container">
                <div className="sign-up">
                    <h5 className="text-blue font-bold mt-3">{t('Create an account')}</h5>
                    <div className="menu-tab">
                        <div className={`arrow-pointer cursor-pointer ${step == 1 ? '' : 'd-none d-sm-flex'} ${step >= 1 ? 'active' : ''}`} style={{ minWidth: 'fit-content' }} onClick={(e) => { nextStep(e, 1) }}>
                            <p>{t('Account Profile')}</p>
                        </div>
                        <div className={`arrow-pointer1 cursor-pointer ${step == 2 ? '' : 'd-none d-sm-flex'} ${step >= 2 ? 'active' : ''}`} style={{ minWidth: 'fit-content' }} onClick={(e) => { nextStep(e, 2) }}>
                            <p>{t('Address')}</p>
                        </div>
                        <div className={`arrow-pointer1 cursor-pointer ${step == 3 ? '' : 'd-none d-sm-flex'} ${step >= 3 ? 'active' : ''}`} style={{ minWidth: 'fit-content' }} onClick={(e) => { nextStep(e, 3) }}>
                            <p>{t('Student info')}</p>
                        </div>
                    </div>
                    <form id="form" onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div>
                                <div className="row">
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="firstname" className="mt-3">
                                            {t('Parent\'s First Name')}
                                        </label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            className="form-control"
                                            placeholder="Parent's First Name"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required={true}
                                        />
                                    </div>
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="lastname" className="mt-3">
                                            {t('Parent\'s Last Name')}
                                        </label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            className="form-control"
                                            placeholder="Parent's Last Name"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="email" className="mt-3">
                                            {t('Email Address')}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="form-control"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="phone" className="mt-3">
                                            {t('Mobile Number')}
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            className="form-control"
                                            placeholder="Mobile Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <p className="font-semibold text-brown text-end mb-0">{t('Add Secondary Number')}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="password" className="mt-1">
                                            {t('Password')}
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="confirmPassword" className="mt-1">
                                            {t('Confirm Password')}
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <>
                                <div className="row">
                                    <div className='col-12'>
                                        <label htmlFor="street" className="mt-3">{t('Street Address')}</label>
                                        <input
                                            type="text"
                                            name="street"
                                            id="street"
                                            className="form-control"
                                            placeholder="Street Address"
                                            value={formData.street}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="city" className="mt-3">{t('City')}</label>
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            className="form-control"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="zip" className="mt-3">{t('Zip Code')}</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            id="zip"
                                            className="form-control"
                                            placeholder="Zip Code"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="country" className="mt-3">{t('Country')}</label>
                                        <input
                                            type="text"
                                            name="country"
                                            id="country"
                                            className="form-control"
                                            placeholder="Country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className='col-sm-6 col-12'>
                                        <label htmlFor="state" className="mt-3">{t('State')}</label>
                                        <input
                                            type="text"
                                            name="state"
                                            id="state"
                                            className="form-control"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                </div></>
                        )}

                        {step === 3 && (
                            <>
                                <div className="row">
                                    <div className="col-6">
                                        <label className="mt-0" htmlFor="studentfirstname">{t('Student First Name')}</label>
                                        <input
                                            type="text"
                                            name="studentfirstname"
                                            value={formData?.studentfirstname}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="First"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="mt-0" htmlFor="studentlastname">{t('Student Last Name')}</label>
                                        <input
                                            type="text"
                                            name="studentlastname"
                                            value={formData?.studentlastname}
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            value={formData?.studentbirthdate}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="mt-3" htmlFor="studentgender">{t('Gender')}</label>
                                        <select
                                            name="studentgender"
                                            className="form-select"
                                            value={formData?.studentgender}
                                            onChange={handleChange}
                                        >
                                            <option value="">{t('Select Gender')}</option>
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
                                                    onChange={handleChange}
                                                    value={formData?.studentschool}
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
                                                    onChange={handleChange}
                                                    value={formData?.studentgrade}
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
                                            onChange={handleChange}
                                            value={formData?.studentteacher}
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
                                            value={formData?.studentparentpickup}
                                            onChange={handleChange}
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
                                            value={formData?.studentpickupauth}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <label className="mt-3" htmlFor="studentspecialinstruction">{t('Dismissal Instruction')}</label>
                                        <textarea
                                            name="studentspecialinstruction"
                                            value={formData?.studentspecialinstruction}
                                            onChange={handleChange}
                                            className="form-control"
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
                            </>
                        )}

                        <div className="my-4 d-flex justify-content-between align-items-center">
                            {step > 1 && (
                                <button
                                    type="button"
                                    className="btn-style1"
                                    onClick={previousStep}
                                    disabled={loading}
                                >
                                    {t('Back')}
                                </button>
                            )}
                            {step < 3 ? (
                                <button type="submit" className="ms-auto btn-style1" onClick={nextStep}>
                                    {t('Next')}
                                </button>
                            ) : (
                                <button type="submit" className="btn-style1" disabled={loading}>
                                    {t('Submit')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
