'use client';

import EmbeddedLogin from "@/app/[locale]/auth/login/embedded";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import EmbeddedSignUp from "../signup/embedded";
import axiosInstance from "@/axios";

import { useTranslation } from 'react-i18next';


export default function LoginModal({ franchise_id, schedule_id, checkout = true }) {
    const router = useRouter();

    const { t } = useTranslation();

    const [signupToggle, setSignupToggle] = useState(false);
    const [policies, setPolicies] = useState([]);

    const onLogin = () => {
        closeModal();
        router.push(`/profile/${franchise_id}/${schedule_id}/${checkout ? 'checkout' : 'waitlist'}`);
    }

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const { data } = await axiosInstance.get('/api/parentregistration.php');
                setPolicies(data);
                console.log(data);
            } catch (err) {
                console.log(err);
            }
        }

        if (signupToggle) {
            fetchPolicies();
        }
    }, [signupToggle]);

    const onSignup = () => {
        setSignupToggle(true);
    }

    const onCancelSignup = () => {
        setSignupToggle(false);
    }

    const closeModal = () => {
        document.getElementById(`closeModal-${schedule_id}`).click();
    }

    return (
        <>
            <div className="modal fade" id={`selectSchedule${schedule_id}`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header border-0 d-flex justify-content-between align-items-center pb-0">
                            <h3 className="text-blue font-bold" id="modalLabel">{signupToggle ? t('Create an account') : t('Sign in')}</h3>
                            <img id={`closeModal-${schedule_id}`} src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body pt-0">
                            {
                                signupToggle ?
                                    <EmbeddedSignUp
                                        loginAction={onLogin}
                                        cancelAction={onCancelSignup}
                                        policies={policies}
                                        schedule_id={schedule_id}
                                        franchise_id={franchise_id}
                                    /> :
                                    <EmbeddedLogin
                                        loginAction={onLogin}
                                        signupAction={onSignup}
                                        closeAction={closeModal}
                                    />
                            }
                        </div>
                    </div>
                </div>
            </div>

            {policies?.map((policy, index) => <>
                <div key={index} className="modal fade" id={`policy-content-${schedule_id}-${index}`} aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content ">
                            <div className="modal-header border-0 d-flex justify-content-between align-items-center ">
                                <p className="font-bold text-blue fs-5" id="modalLabel">{policy?.policytitle}</p>
                            </div>
                            <div className="modal-body pt-0" dangerouslySetInnerHTML={{ __html: policy?.policy }}>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary rounded-0 w-100" type="button" data-bs-toggle="modal" data-bs-target={`#selectSchedule${schedule_id}`}>
                                    {t('Back to Signup')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>)}
        </>
    );
};



