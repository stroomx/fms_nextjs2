'use client';

import axiosInstance from '@/axios';
import React, { useEffect, useState } from 'react';

import datef from '@/app/localization/date';
import money from '@/app/localization/currency';
import PrintContent from '@/app/components/PrintContent';

import Skeleton from 'react-loading-skeleton';

export default function ParentPayment() {

    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [data, setData] = useState({
        balance: 0,
        credit: 0
    });

    const t = (text) => text;

    const paymentTypes = {
        "cash": "Cash",
        "check": "Check",
        "creditcard": "Online",
        "outsidefmt": "Outside FMS",
        "removecredit": "Credit Removal"
    };

    const getPayments = async () => {
        try {
            const { data } = await axiosInstance.get('/api/parentpayments.php');

            const sortedPayments = data?.payments
                .sort((a, b) => {
                    const paymentDateComparison = b['paymentdate'].localeCompare(a['paymentdate']);

                    if (paymentDateComparison === 0) {
                        return b['student'].localeCompare(a['student']);
                    }

                    return paymentDateComparison;
                });

            setPayments(sortedPayments);
            setLoading(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPayments();
    }, [])

    return (
        <>
            <div className="home-section mt-4">
                <div className="pay-details justify-content-between gap-3 align-items-center mb-3">
                    <div className="d-flex gap-3">
                        <p className="text-grey-200 font-semibold text-14">
                            {t('Balance')}: <span className="text-red font-bold">{money(data?.balance)}</span>
                        </p>
                        <p className="text-grey-200 font-semibold text-14">
                            {t('Credit')}: <span className="text-green font-bold">{money(data?.credit)}</span>
                        </p>
                    </div>
                    <div className="title2 d-flex justify-content-end align-items-center gap-3 ">
                        <div className="dates">
                            <div className='d-flex justify-content-start gap-2 align-items-center'>
                                <label className="text-grey-200">{t('Start')}</label>
                                <input type="date" />
                            </div>
                            <div className='d-flex justify-content-start gap-2 align-items-center'>
                                <label className="text-grey-200">{t('End')}</label>
                                <input type="date" />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="table-responsive table-2 pb-5">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <td className='text-center'>#</td>
                                <td className='text-center'>{t('Txn. ID')}</td>
                                <td className='text-start'>{t('Student')}</td>
                                <td className='text-center'>{t('Schedule')}</td>
                                <td className='text-center'>{t('Amount')}</td>
                                <td className='text-center'>{t('Date & Time')}</td>
                                <td className='text-center'>{t('Method')}</td>
                                <td className='text-center'>{t('Status')}</td>
                                <td className='text-center'>{t('Receipt')}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? ((<tr><td colSpan={9}><Skeleton count={5} /></td></tr>)) :
                                (payments?.map((transaction, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>{transaction.paymentid}</td>
                                        <td className='text-start'>{transaction.student || "N/A"}</td>
                                        <td className='text-center'>{transaction.schedule || "N/A"}</td>
                                        <td className={`${transaction.amount.startsWith('-') ? 'debit' : 'credit'} text-center`}>
                                            {money(transaction.amount)}
                                        </td>
                                        <td className='text-center'>{datef(transaction.paymentdate)}</td>
                                        <td className='text-center'>{paymentTypes[transaction.paymenttype]}</td>
                                        <td className={`${transaction.paymentstatus == 'pending' ? 'debit' : 'credit'} text-center`}>
                                            {transaction.paymentstatus?.toUpperCase() || "SUCCESS"}
                                        </td>
                                        <td className='text-center'>
                                            <PrintContent icon='mdi-download' classes='text-danger' index={index}>
                                                <PaymentReciept payment={transaction} />
                                            </PrintContent>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
                <div className="flexed text-blue justify-content-end my-5">

                </div>
            </div>
        </>
    );
}

const PaymentReciept = ({ payment }) => {
    return <>
        <p className="fs-1 text-danger">Printing Payment #{payment?.paymentid}</p>
    </>
}
