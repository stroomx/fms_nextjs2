'use client';

import axiosInstance from "@/axios";
import { useEffect, useState } from "react";
import alert from '@/app/components/SweetAlerts';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const t = (t) => t;

    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('flid');
    const secret = searchParams.get('flverify');

    const [email, setEmail] = useState('');
    const [verify, setVerify] = useState(false);
    const [loading, setLoading] = useState(true);

    const [password, setPassword] = useState({
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setPassword({
            ...password,
            [name]: value
        });
    }

    const resetPassword = async () => {
        try {
            const { data } = await axiosInstance.post('/api/forgotpassword.php', { email: email });

            alert({ type: "success", message: data?.message, timer: 3000 });
            router.push(`/login`);

        } catch (err) {
            console.log(err);
        }
    }

    const submitReset = async () => {
        try {
            const { data } = await axiosInstance.post('/api/forgotpassword.php', {
                verify: true,
                password: password['password'],
                confirmpassword: password['confirmPassword'],
                flid: userId,
                flverify: secret
            });

            alert({ type: "success", message: data?.message, timer: 3000 });

            router.push('/login');
        } catch (err) {
            alert({ type: "error", message: err?.response?.data?.message, timer: 3000 });

            console.log(err)
        }
    }

    const verifySecret = () => {
        setLoading(true);

        if (userId && secret) {
            setVerify(true);
        }

        setLoading(false);
    }

    useEffect(() => {
        verifySecret();
    }, []);

    return (
        <>
            {loading && <div className="loading-overlay">
                <div className="spinner"></div>
            </div>}
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
                        <div className="card rounded-0">
                            <div className="card-body">
                                {verify ?
                                    <div className="container">
                                        <div className="fs-4 text-center fw-bold my-1">
                                            {t('Input new password below')}
                                        </div>
                                        <div className="text-center mb-3">
                                            {t('Remember your password? ')} <a href="/auth/login" className="text-primary">{t('Login Here')}</a>
                                        </div>
                                        <label htmlFor="password">{t('Password')}</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className="form-control rounded-0 mb-3"
                                            onChange={handleChange} />
                                        <label htmlFor="confirmPassword">{t('Confirm Password')}</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            className="form-control rounded-0"
                                            onChange={handleChange} />
                                        <button className="btn btn-primary rounded-0 w-100 mt-3" onClick={submitReset} disabled={password['password'] !== password['confirmPassword']}>
                                            {t('Reset Password')}
                                        </button>
                                        {password['password'] !== password['confirmPassword'] && <div className="text-danger text-center small mb-2">{t('Password and confirm password do not match.')}</div>}
                                        <div className="text-center small">{t('Passwords must contain one lowercase and one uppercase letter, one number and one symbol and must be at least 8 characters.')}</div>
                                    </div>
                                    : <div className="container">
                                        <div className="fs-4 text-center fw-bold my-1">
                                            {t('Forgot Password?')}
                                        </div>
                                        <div className="text-center mb-3">
                                            {t('Remember your password? ')} <a href="/auth/login" className="text-primary">{t('Login Here')}</a>
                                        </div>
                                        <label htmlFor="email">{t('Email Address')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="form-control rounded-0"
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }} />
                                        <button className="btn btn-primary rounded-0 w-100 mt-3 mb-2" onClick={resetPassword}>
                                            {t('Send Reset Email')}
                                        </button>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </>
    );
}