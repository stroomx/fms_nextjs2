'use client';

import { useRouter } from "next/navigation";
// import money from "@/app/localization/currency";
import date from "@/app/localization/date";
import time from "@/app/localization/time";
import { useEffect, useState } from "react";
import axiosInstance from "@/axios";


const PaymentConfirmationPage = ({ params: { franchise_id, schedule_id } }) => {

    const router = useRouter();

    const [daata, setData] = useState({});

    const t = (text) => text;

    const data = {
        scheduleDateFrom: '2024-12-12',
        scheduleDateTo: '2024-12-12',
        scheduleDays: ['Saturday', 'Wednesday', 'Monday'],
        scheduleTimeFrom: "16:00",
        scheduleTimeTo: "18:00",
        paidAmount: 290,
        franchiseName: "Bricks 4 Kidz - Home Office",
        scheduleName: "Air, Land & Sea"
    };

    const fetchData = async () => {
        const { data } = await axiosInstance.get('/api/paymentconfirmation.php');
        console.log(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (

        <div className="payment-page text-center">
            <div className="container">
                <div className="page-wrapper">
                    <i className="mdi mdi-check-circle mb-3 fs-1"></i>
                    <h3 className="mb-3">{t('Enrollment Successful')}</h3>
                    <h4 className="mb-4">{data?.franchiseName}</h4>
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
                    {/* <p className="mb-1">{t('Total paid')} : <span>{money(data?.paidAmount)}</span></p> */}
                    <p className="dotted mt-1">{t('Reference ID')} : <span> #{data?.enrollmentid}</span> </p>
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-5 mb-3">
                        <button className="btn btn-outline-primary rounded-0 flex-fill">
                            <span className="mdi mdi-calendar"></span>
                            &nbsp;{t('Add to Calendar')}
                        </button>
                        <button className="btn btn-outline-primary rounded-0 flex-fill">
                            <span class="mdi mdi-grid"></span>
                            &nbsp;{t('Enroll in another Class')}
                        </button>
                        {/* <button type="button" class="btn btn-secondary"><span class="mdi mdi-grid"></span>&nbsp;Search</button> */}
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
