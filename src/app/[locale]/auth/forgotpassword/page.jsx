'use client';

import axiosInstance from "@/axios";
import { useState } from "react";
import alert from '@/app/components/SweetAlerts';
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const t = (t) => t;

    const router = useRouter();

    const [email, setEmail] = useState('');

    const resetPassword = async () => {
        try {
            const { data } = await axiosInstance.post('/api/forgotpassword.php', { email: email });

            console.log(data);

            alert({ type: "success", message: data?.message, timer: 3000 });
            router.push(`/login`);

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
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
                                <div className="container">
                                    <div className="fs-4 text-center fw-bold my-1">
                                        {t('Forgot Password?')}
                                    </div>
                                    <div className="text-center mb-3">
                                        {t('Remember your password?')} <a href="/auth/login" className="text-primary">{t(' Login Here')}</a>
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
                                        {t('Reset Password')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >
            </section >
        </>
    );
}