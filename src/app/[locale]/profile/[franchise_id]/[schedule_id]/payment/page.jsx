'use client';

import { useRouter, useSearchParams } from "next/navigation";
import money from "@/app/localization/currency";
import date from "@/app/localization/date";
import time from "@/app/localization/time";
import { useEffect, useState } from "react";
import axiosInstance from "@/axios";

import { useTranslation } from 'react-i18next';

const PaymentConfirmationPage = ({ params: { franchise_id, schedule_id } }) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    let status = searchParams.get('redirect_status');
    let paidAmount = searchParams.get('amount');
    let enrollmentId = searchParams.get('eid') ?? searchParams.get('payment_intent') ?? false;

    const [data, setData] = useState({});

    const { t } = useTranslation();

    const fetchData = async () => {
        const { data } = await axiosInstance.get(`/api/schedule.php?fid=${franchise_id}&id=${schedule_id}`);
        const schedule = data?.schedule;
        setData({
            scheduleDateFrom: schedule?.firstdate,
            scheduleDateTo: schedule?.lastdate,
            scheduleDays: schedule?.days,
            scheduleTimeFrom: "16:00",
            scheduleTimeTo: "18:00",
            paidAmount: paidAmount,
            franchiseName: schedule?.franchise_name,
            scheduleName: schedule?.name,
            enrollmentid: enrollmentId
        });
    }

    useEffect(() => {
        if (!status)
            router.push(`/profile/${franchise_id}`);

        fetchData();
    }, []);

    return (
        <div className="payment-page text-center">
            <div className="container">
                <div className="page-wrapper">
                    <i className="mdi mdi-check-circle mb-3 fs-1"></i>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-circle</title><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg> */}
                    <h3 className="mb-3">{t('Enrollment Successful')}</h3>
                    <h4 className="mb-4">{data?.franchiseName ? `Bricks 4 Kidz - ${data?.franchiseName}` : 'Bricks 4 Kidz'}</h4>
                    <h5>{data?.scheduleName}</h5>
                    <p className="mb-1">{date(data?.scheduleDateFrom, false) + ' - ' + date(data?.scheduleDateTo, false)}</p>
                    <p className="mb-1">{time(data?.scheduleTimeFrom) + " " + t('to') + " " + time(data?.scheduleTimeTo)}</p>
                    <div className="days flexed justify-content-center mb-2">
                        {data.scheduleDays?.length === 7
                            ? <p className="font-semibold text-13">{t('All Week')}</p>
                            : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                data.scheduleDays?.includes(day) ? (<span
                                    key={day}
                                >
                                    {day.slice(0, 2).toUpperCase()}
                                </span>) : (<p
                                    key={day}
                                >
                                    {day.slice(0, 2).toUpperCase()}
                                </p>)
                            ))}
                    </div>
                    <p className="mb-2">{t('Total paid')} : <span>{money(data?.paidAmount)}</span></p>
                    {data?.enrollmentid ? <p className="dotted mt-1">{t('Reference ID')} : <span> #{data?.enrollmentid}</span> </p> :
                        <p className="dotted mt-1">{t('Payment under proccessing, once payment clears you\'ll recieve confirmation email.')}</p>}
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-5 mb-3">
                        <button className="btn btn-outline-primary rounded-0 flex-fill">
                            <span className="mdi mdi-calendar"></span>
                            &nbsp;{t('Add to Calendar')}
                        </button>
                        <button className="btn btn-outline-primary rounded-0 flex-fill">
                            <span className="mdi mdi-grid"></span>
                            &nbsp;{t('Enroll in another Class')}
                        </button>
                    </div>

                    <button className="btn btn-primary rounded-0 w-100" onClick={() => { router.push('/parent') }}>
                        <span className="mdi mdi-home-variant-outline"></span>
                        {t('Take me to Home')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmationPage;
