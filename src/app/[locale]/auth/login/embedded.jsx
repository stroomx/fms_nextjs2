'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';

import axios from "axios";
import Link from "next/link";
import AuthService from "@/auth.service";
import alert from "@/app/components/SweetAlerts";

export default function EmbeddedLogin({ franchise_id, loginAction = () => { router.push(navigateTo); } }) {

    const router = useRouter();

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

            loginAction();
        } catch (error) {
            const { response } = error;
            alert({ type: "error", message: t(response?.data?.error), timer: 3000 });
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
        <h3 className="text-blue font-bold mb-2">{t('Sign in')}</h3>
        <p>{t('Please sign in to enroll your child')}</p>

        <form onSubmit={handleSubmit}>
            <label htmlFor="">
                {t('Email Address')}
            </label>
            <input
                className="input-style1"
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
                    name="password"
                    placeholder={t('Password')}
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="check-group my-2">
                <div className="form-check">

                </div>
                <Link href="/auth/forgotpassword" className="text-brown font-semibold">
                    {t('Forgot Password')} {' ? '}
                </Link>
            </div>
            <div className="my-4">
                <button
                    type="submit"
                    className="btn-style1 w-100 m-auto"
                >
                    {t('Sign in')}
                </button>
            </div>
            <div className=" text-center">
                <a href={`/auth/signup?fid=${franchise_id}`} className="text-brown font-semibold">{t('New user? Create an account')}</a>
            </div>
        </form>
    </>;
}