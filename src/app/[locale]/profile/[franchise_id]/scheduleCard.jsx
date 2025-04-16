import { useTranslation } from 'react-i18next';

import TextWithToggle from '@/app/components/TextWithToggle';
import AuthService from '@/auth.service';
import LoginModal from '../../auth/login/modal';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Calendar from '@/app/components/calendar/Calendar';
import useClickOutside from '@/app/hooks/useClickOutside';

export default function ScheduleCard({ franchise_id, schedule, modal = false, buttonAction = () => { }, }) {
    const { t } = useTranslation();
    const searchParams = useSearchParams();

    const [showDate, setShowDate] = useState(false);

    const isLoggedIn = AuthService.isAuthenticated();
    const isWaitlist = (schedule.availablespots <= 0 && schedule.waitlist);

    const calendarRef = useRef();
    useClickOutside(calendarRef, () => setShowDate(false));

    const scheduleSelection = () => {
        const selected_schedule = searchParams.get('selected_schedule');

        if (selected_schedule == schedule.id) {
            if (isLoggedIn) {
                buttonAction(schedule.id, isWaitlist);
                return;
            }

            const enrollButton = document.getElementById(`enroll-button-${schedule.id}`);
            enrollButton.click();
        }
    }

    const toggleDate = () => {
        setShowDate(!showDate);
    }

    useEffect(() => {
        scheduleSelection();
    }, []);

    return (
        <>
            <div className={modal ? "" : "card mb-2 p-3"} style={{ borderRadius: 0 }}>
                <div className="row g-2">
                    <div className="col-12 col-md-3">
                        <img
                            alt="..."
                            className="img-fluid rounded-0"
                            //TODO Update from CDN
                            src={schedule.image ? schedule.image : "https://bricks4kidz.us/wp-content/themes/brickly/assets/images/img-wide.svg"}
                        />
                    </div>
                    <div className="col-12 d-md-none pb-2">
                        <div className="row">
                            <div className="col-md-9 col-8">
                                <p className="font-bold fs-5">
                                    {schedule.name || 'N/A'}
                                </p>
                                <span className='text-danger'>{schedule.program}</span>
                            </div>
                            <div className="col-md-3 col-4">
                                <p className="text-blue font-bold text-end fs-2">
                                    {schedule.cost || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 px-md-3">
                        <p className="font-bold fs-5 d-none d-md-block">
                            {schedule.name || 'N/A'}
                        </p>
                        <span className='text-danger pb-1 d-none d-md-block'>{schedule.program}</span>
                        <div className="d-flex flex-wrap justify-content-lg-start align-items-lg-center gap-1 flex-column flex-lg-row justify-content-center align-items-start position-relative">
                            {/* Date Toggle Button */}
                            <div
                                className="d-flex gap-1 align-items-center font-semibold me-lg-2 cursor-pointer"
                                onClick={toggleDate}
                                style={{ userSelect: 'none' }}
                            >
                                <i className="mdi mdi-calendar-today fs-5"></i> {schedule.daterange || 'N/A'}
                            </div>

                            {/* Floating Calendar */}
                            {showDate && (
                                <div
                                    ref={calendarRef}
                                    className="position-absolute bg-white border rounded shadow-sm p-2 mt-1"
                                    style={{
                                        zIndex: 1050,
                                        top: '100%',
                                        left: 0,
                                        minWidth: '250px',
                                        maxWidth: '90vw',
                                        width: 'fit-content',
                                    }}
                                >
                                    <Calendar highlightedDates={schedule.dates} />
                                </div>
                            )}

                            {/* Weekdays Display */}
                            <div className="d-flex align-items-center gap-1">
                                <i className="mdi mdi-calendar-week fs-5"></i>
                                <div className="days flexed">
                                    {schedule.days?.length === 7
                                        ? t('All Week')
                                        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) =>
                                            schedule.days?.includes(day) ? (
                                                <span key={day}>{day.slice(0, 2).toUpperCase()}</span>
                                            ) : (
                                                <p key={day}>{day.slice(0, 2).toUpperCase()}</p>
                                            )
                                        )}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between flex-wrap">
                            <div className="d-flex align-items-center gap-1">
                                <i className='mdi mdi-face-man fs-5'></i>
                                <p className="font-semibold text-danger">
                                    {`${schedule.minage || 0} - ${schedule.maxage || 'N/A'} years`}
                                </p>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                <i className='mdi mdi-map-marker fs-5'></i>
                                <p className="font-semibold ">
                                    {schedule.location || 'Location not specified'}
                                </p>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                <i className='mdi mdi-human-male-board fs-5'></i>
                                <p className="font-semibold ">
                                    {(schedule.teachers?.length > 0 ? schedule.teachers.join(', ') : 'No teachers assigned')}
                                </p>
                            </div>
                        </div>
                        <div className=''>
                            <TextWithToggle description={schedule.description || ''} maxLength={110}></TextWithToggle>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 text-end align-content-center d-none d-md-block">
                        <span className="text-grey font-semibold">
                            {t('Schedule Cost')}
                        </span>
                        <p className="text-blue font-bold text-end fs-2">
                            {schedule.cost || 0}
                        </p>
                        <p className="font-semibold text-danger">
                            {
                                !isWaitlist ?
                                    (schedule.availablespots || 0) + ' ' + t('Available Spots')
                                    : t('No Available Spots')
                            }
                        </p>
                        {
                            (!modal &&
                                (isLoggedIn ? <button className={`${isWaitlist ? 'btn btn-warning rounded-0' : 'btn-style1'} mt-1 d-inline`} type="button" onClick={() => buttonAction(schedule.id, isWaitlist)}>
                                    {!isWaitlist ? t('Enroll Now') : t('Join Waitlist')}
                                </button> : <button className={`${isWaitlist ? 'btn btn-warning rounded-0' : 'btn-style1'} mt-1 d-inline`} id={`enroll-button-${schedule.id}`} type="button" data-bs-toggle="modal" data-bs-target={`#selectSchedule${schedule.id}`}>
                                    {!isWaitlist ? t('Enroll Now') : t('Join Waitlist')}
                                </button>))
                        }

                    </div>
                    {modal && schedule.description &&
                        <div className="col-12 pt-2">
                            {schedule.description}
                        </div>
                    }
                    <div className="col-12 text-center d-md-none">
                        {modal ?
                            <>
                                <button className="btn-style1 mt-3 d-inline" type="button" onClick={() => buttonAction()}>
                                    {isLoggedIn ? t('Enroll') : t('Login')}
                                </button>
                                {!isLoggedIn && <button className="btn-style1 mt-3 d-inline" type="button" onClick={() => buttonAction()}>
                                    {t('Signup')}
                                </button>}
                            </>
                            :
                            (
                                <>
                                    <p className="font-semibold text-danger">
                                        {
                                            !isWaitlist ?
                                                (schedule.availablespots || 0) + ' ' + t('Available Spots')
                                                : t('No Available Spots')
                                        }
                                    </p>
                                    {isLoggedIn ? <button className={`${isWaitlist ? 'btn btn-warning rounded-0' : 'btn-style1'} mt-1 d-inline w-100`} type="button" onClick={() => buttonAction(schedule.id, isWaitlist)}>
                                        {!isWaitlist ? t('Enroll Now') : t('Join Waitlist')}
                                    </button> : <button className={`${isWaitlist ? 'btn btn-warning rounded-0' : 'btn-style1'} mt-1 d-inline w-100`} type="button" data-bs-toggle="modal" data-bs-target={`#selectSchedule${schedule.id}`}>
                                        {!isWaitlist ? t('Enroll Now') : t('Join Waitlist')}
                                    </button>}
                                </>
                            )}
                    </div>
                    {modal &&
                        <div className="col-12 pt-3 d-flex justify-content-center g-3">
                            <button className="btn-style3 me-3" type="button" onClick={() => buttonAction()}>
                                {isLoggedIn ? t('Enroll') : t('Login')}
                            </button>
                            {!isLoggedIn && <button className="btn-style4" type="button" onClick={() => buttonAction()}>
                                {t('Signup')}
                            </button>}
                        </div>}
                </div>
            </div>
            {isLoggedIn ? '' : <LoginModal schedule_id={schedule.id} franchise_id={franchise_id} isWaitlist={isWaitlist} />}
        </>

    );
}