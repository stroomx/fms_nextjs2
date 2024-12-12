'use client';

import axiosInstance from "@/axios";
import { useState } from "react";
import alert from '@/app/components/SweetAlerts';
import { useRouter } from "next/navigation";


export default function Login() {
    const t = (t) => t;

    const router = useRouter();

    const [email, setEmail] = useState('');

    const resetPassword = async () => {
        try {
            const { data } = await axiosInstance.post('/api/forgotpassword.php', { email: email });

            console.log(data);

            alert({ type: "success", message: data?.message, timer: 3000 });
            // router.push(`/login`);

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className="background">
                <div className="login">
                    <div className="card rounded-0">
                        <div className="card-header p-3">
                            {t('Forgot Password')}
                        </div>
                        <div className="card-body">
                            <label htmlFor="email">{t('Enter your email')}</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-control rounded-0"
                                placeholder="jhondoe@example.com"
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }} />
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-primary rounded-0" onClick={resetPassword}>
                                {t('Reset Password')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}