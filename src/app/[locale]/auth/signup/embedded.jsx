'use client';

import React, { useState } from 'react';
import axiosInstance from '@/axios';
import axios from 'axios';
import alert from '@/app/components/SweetAlerts';
import AuthService from '@/auth.service';
import Cookies from 'js-cookie';

import { useTranslation } from 'react-i18next';


export default function EmbeddedSignUp({ loginAction = () => { }, cancelAction = () => { }, policies = [], schedule_id = 0, franchise_id = 0 }) {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        lastname: '',
        firstname: '',
        franchiseid: franchise_id
    });

    const [loading, setLoading] = useState(false);
    const [secondaryNumber, setSecondaryNumber] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const { t } = useTranslation();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type == "checkbox") {
            setFormData({ ...formData, [name]: checked });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };


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

            const config = {
                headers: { Authorization: `Bearer ${data['token']}`, 'Content-Type': "application/json" }
            };

            axios.defaults.headers.common = config['headers'];
            const userDetails = await axios.get(`${apiUrl}/api/userdetails.php`);

            AuthService.login(userDetails['data'], data['token']);
            alert({ type: "success", message: t(data['message']), timer: 3000 });

            loginAction();
        } catch (err) {
            console.error('Error submitting form:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form id="form" onSubmit={handleSubmit}>
                <div>
                    <div className="row">
                        <div className='col-sm-6 col-12'>
                            <label htmlFor="firstname" className="mt-3 required">
                                {t('Parent\'s First Name')}
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                id="firstname"
                                className="form-control rounded-0"
                                placeholder="Parent's First Name"
                                value={formData.firstname}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className='col-sm-6 col-12'>
                            <label htmlFor="lastname" className="mt-3 required">
                                {t('Parent\'s Last Name')}
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                id="lastname"
                                className="form-control rounded-0"
                                placeholder="Parent's Last Name"
                                value={formData.lastname}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-sm-6 col-12'>
                            <label htmlFor="email" className="mt-3 required">
                                {t('Email Address')}
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-control rounded-0"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className='col-sm-6 col-12'>
                            <label htmlFor="phone" className="mt-3 required">
                                {t('Mobile Number')}
                            </label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                className="form-control rounded-0"
                                placeholder="Mobile Number"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                            {!secondaryNumber && <p className="font-semibold text-brown text-end mb-0 cursor-pointer" onClick={() => { setSecondaryNumber(true) }}>{t('Add Secondary Number')}</p>}
                        </div>
                        {secondaryNumber && <div className='col-sm-6 offset-sm-6 col-12 my-3'>
                            <label htmlFor="phone">
                                {t('Secondary Mobile Number')}
                            </label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                className="form-control rounded-0"
                                placeholder="Secondary Mobile Number"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>}
                    </div>
                    <div className="row">
                        <div className='col-sm-6 col-12'>
                            <label htmlFor="password" className="mt-1 required">
                                {t('Password')}
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-control rounded-0"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className='col-sm-6 col-12'>
                            <label htmlFor="confirmPassword" className="mt-1 required">
                                {t('Confirm Password')}
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="form-control rounded-0"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>
                    <div className="check-group mt-2">
                        {
                            policies?.map((policy, index) => <>
                                <div key={index} className="form-check">
                                    <input className="form-check-input" type="checkbox" id={`policy-${index}`} required />
                                    <label className="form-check-label required">
                                        {t('I accept')} <span
                                            className="text-blue cursor-pointer"
                                            id={`policy-content-toggle`}
                                            data-bs-toggle="modal"
                                            data-bs-target={`#policy-content-${schedule_id}-${index}`}
                                        >{policy?.policytitle}</span>
                                    </label>
                                </div>
                            </>)
                        }
                    </div>
                </div>

                <div className="my-4 d-flex justify-content-start gap-2 align-items-center">
                    <button type="submit" className="btn btn-primary rounded-0" disabled={loading}>
                        {t('Sign Up')}
                    </button>
                    <button type="button" className="btn btn-danger rounded-0" onClick={cancelAction}>
                        {t('Cancel')}
                    </button>
                </div>
            </form >
        </>
    );
}
