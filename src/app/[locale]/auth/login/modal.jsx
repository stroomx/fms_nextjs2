'use client';

import EmbeddedLogin from "@/app/[locale]/auth/login/embedded";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import EmbeddedSignUp from "../signup/embedded";

export default function LoginModal({ franchise_id, schedule_id }) {
    const router = useRouter();

    const t = (text) => text;

    const [signupToggle, setSignupToggle] = useState(false);

    const onLogin = () => {
        document.getElementById(`closeModal-${schedule_id}`).click();
        router.push(`/profile/${franchise_id}/${schedule_id}/checkout`);
    }

    const onSignup = () => {
        setSignupToggle(true);
    }

    const onCancelSignup = () => {
        setSignupToggle(false);
    }

    return (
        <div className="modal fade" id={`selectSchedule${schedule_id}`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header border-0 d-flex justify-content-between align-items-center pb-0">
                        <h3 className="text-blue font-bold" id="modalLabel">{signupToggle ? t('Create an account') : t('Sign in')}</h3>
                        {/* <a id={`closeModal-${schedule_id}`} className="mdi mdi-close" data-bs-dismiss="modal" aria-label="Close"></a> */}
                        <img id={`closeModal-${schedule_id}`} src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body pt-0">
                        {
                            signupToggle ?
                                <EmbeddedSignUp loginAction={onLogin} cancelAction={onCancelSignup} /> :
                                <EmbeddedLogin loginAction={onLogin} signupAction={onSignup} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};



