"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import alert from '@/app/components/SweetAlerts';
import AuthService from '@/auth.service';


/**
 * Switch this to server side component and add CSRF.
 */
export default function Login() {

    const router = useRouter();

    useEffect(() => {
        // Check if the user is authenticated when the component mounts
        if (AuthService.isAuthenticated()) {
            // If authenticated, redirect to /parent page
            router.push('/parent');
            console.log('User is authenticated');
        } else {
            console.log('User is not authenticated');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://fms3.bricks4kidznow.com/api/login.php", formData);
            const token = response.data.token;

            const config = {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': "application/json" }
            };

            axios.defaults.headers.common = config['headers'];
            const userDetails = await axios.get("https://fms3.bricks4kidznow.com/api/userdetails.php");

            AuthService.login(userDetails['data'], token);
            alert({ type: "success", message: t('Login Successful'), timer: 3000 });

            router.push(`/parent`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { t } = useTranslation();

    return <>
        <section>
            <div className="background">
                <img
                    alt=""
                    className="img-top"
                    src="/assets/img/logo-fade.png"
                />
                <img
                    alt=""
                    className="img-bottom"
                    src="/assets/img/logo-fade.png"
                />
                <div className="login">
                    <div className="card">
                        <div className="card-img">
                            <img
                                alt="..."
                                className="card-img-top"
                                src="/assets/img/signin.png"
                            />
                            <img
                                alt=""
                                className="logo-2"
                                src="/assets/img/big-logo.png"
                            />
                            <div className="ribbon">
                                <p className="text-white font-semibold">
                                    {t('Sign in')}
                                </p>
                            </div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="">
                                    {t('Email Address')}
                                </label>
                                <input
                                    className="input-style1"
                                    id="username"
                                    name="username"
                                    placeholder={t('Email Address')}
                                    type="email"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    className="mt-3"
                                    htmlFor=""
                                >
                                    {t('Password')}
                                </label>
                                <div className="input-wrap">
                                    <input
                                        className="input-style1 forgot"
                                        id="password"
                                        name="password"
                                        placeholder={t('Password')}
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Link href="/auth/forgotpassword">
                                        {t('Forgot Password')} {' ? '} 
                                    </Link>
                                </div>
                                <div className="buttons mt-3 mb-1">
                                    <Link
                                        className="btn-style3 w-100 p-2 rounded-0"
                                        href="/auth/signup"
                                    >
                                        {t('Registration')}
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn-style1 w-100"
                                    >
                                        {t('Sign in')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>;
}