'use client';

import EmbeddedLogin from "@/app/[locale]/auth/login/embedded";
import { useRouter } from 'next/navigation';

export default function LoginModal({ franchise_id, schedule_id }) {
    const router = useRouter();

    const t = (text) => text;

    const onLogin = () => {
        document.getElementById(`closeModal-${schedule_id}`).click();
        router.push(`/profile/${franchise_id}/${schedule_id}/checkout`);
    }

    return (
        <div className="modal fade" id={`selectSchedule${schedule_id}`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content ">
                    <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                        <p className="font-bold text-blue fs-5" id="modalLabel">{t('Please login to enroll in a schedule.')}</p>
                        <img id={`closeModal-${schedule_id}`} src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <EmbeddedLogin loginAction={onLogin} />
                    </div>
                </div>
            </div>
        </div>
    );
};



