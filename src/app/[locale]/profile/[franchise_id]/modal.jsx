'use client';

import { useState } from "react";

import ScheduleCard from "./scheduleCard";
import StudentSelection from "./studentSelect";
import EmbeddedLogin from "@/app/[locale]/auth/login/embedded";
import { useRouter } from 'next/navigation';
import AuthService from "@/auth.service";

export default function ScheduleModal({ franchise_id, schedule, empty = false, closeModal = () => { } }) {
    const router = useRouter();

    const [step, setStep] = useState('enroll');

    const close = () => {
        closeModal(null);
    }

    const viewContent = () => {
        switch (step) {
            case 'login':
                return <EmbeddedLogin></EmbeddedLogin>;
            case 'enroll':
                return <ScheduleCard schedule={schedule} modal={true} buttonAction={AuthService.isAuthenticated() ? onSelectStudents : onLogin} />;
            case 'selectStudents':
                return <StudentSelection buttonAction={onCheckout} />;
            default:
                close();
        }
    }

    const onLogin = () => setStep('login');
    const onSelectStudents = () => setStep('selectStudents');
    const onScheduleCard = () => setStep('enroll');

    const onCheckout = (studentids) => {
        const ids = studentids.join(',');
        document.getElementById("closeModal").click();
        router.push(`/profile/${franchise_id}/${schedule.id}/checkout?id=${ids}`);
    }

    return (
        <div className="modal fade" id="select-shedule" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content ">
                    <div className="modal-header border-0">
                        <p className="font-bold text-blue fs-5" id="modalLabel">Select Student for Schedule</p>
                        <img id="closeModal" src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <button onClick={close}>X</button>
                        <button onClick={onSelectStudents}>Select Students</button>
                        <button onClick={onLogin}>Login</button>
                        <button onClick={onScheduleCard}>Card</button>
                        {!empty && viewContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};



