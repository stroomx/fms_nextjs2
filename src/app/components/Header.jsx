'use client';

import React, { useEffect, useState } from 'react';
import LanguageChanger from './LanguageChanger';
import initTranslations from '@/app/i18n';
import AuthService from '@/auth.service';
import alert from '@/app/components/SweetAlerts';
import { useRouter } from 'next/navigation';

export default function Header({ locale }) {
    const [t, setT] = useState(() => (key) => key);  // Default fallback translation (identity function)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const router = useRouter();

    const logout = () => {
        AuthService.logout();
        router.push('/auth/login');
        setTimeout(() => {
            alert({ message: "Logged Out Successfully" });
        }, 1000);
    }

    useEffect(() => {
        // Fetch translations only once after the component mounts
        const fetchTranslations = async () => {
            const { t } = await initTranslations(locale);
            setT(() => t);  // Set the translation function once fetched
        };

        fetchTranslations();
    }, [locale]);  // Re-run the effect if locale changes

    useEffect(() => {
        setInterval(() => {
            setIsAuthenticated(AuthService.isAuthenticated())
        }, 100);
    }, []);

    return (
        <header>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6 col-6">
                        <div className="logo">
                            <img
                                alt="Bricks 4 Kidz Logo"
                                src="/assets/img/B4Klogo.png"
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-6">
                        <div className="d-flex gap-3 justify-content-end align-items-center">
                            <LanguageChanger />
                            {isAuthenticated ? (
                                <div className="profile">
                                    <div className="btn-group">
                                        <button
                                            aria-expanded="false"
                                            className="btn dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            type="button"
                                        >
                                            <i className="mdi mdi-account fs-5"></i>
                                            <p className="font-semibold">
                                                {AuthService.getUser()['name']}
                                            </p>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end rounded-0">
                                            <li>
                                                <button
                                                    className="dropdown-item text-blue d-flex align-items-center justify-content-start"
                                                    type="button"
                                                    onClick={() => { router.push('/parent') }}
                                                >
                                                    <i className='mdi fs-5 mdi-home-account'></i>
                                                    {t('Home')}
                                                </button>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider m-0" />
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-blue d-flex align-items-center justify-content-start"
                                                    type="button"
                                                    onClick={() => { router.push('/parent/profile') }}
                                                >
                                                    <i className='mdi fs-5 mdi-face-man-profile'></i>
                                                    {t('Parent Profile')}
                                                </button>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider m-0" />
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-blue d-flex align-items-center justify-content-between"
                                                    type="button"
                                                    onClick={() => { router.push('/parent/payment') }}
                                                >
                                                    <i className='mdi fs-5 mdi-cash-100'></i>
                                                    {t('Payment History')}
                                                </button>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider m-0" />
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-blue d-flex align-items-center justify-content-between"
                                                    type="button"
                                                    onClick={logout}
                                                >
                                                    {t('Logout')}
                                                    <i className='mdi fs-5 mdi-logout'></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) :
                                // (
                                //     <Link href="/auth/login" passHref>
                                //         <div className="sign-in">
                                //             <img
                                //                 alt="Login Icon"
                                //                 src="/assets/img/login.svg"
                                //             />
                                //             <span className="font-semibold text-blue">
                                //                 {t('Sign In')}
                                //             </span>
                                //         </div>
                                //     </Link>
                                // )
                                ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
