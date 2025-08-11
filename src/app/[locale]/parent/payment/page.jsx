'use client';

import axiosInstance from '@/axios';
import React, { useEffect, useState } from 'react';

import datef from '@/app/localization/date';
import money from '@/app/localization/currency';
import PrintContent from '@/app/components/PrintContent';

import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';


export default function ParentPayment() {

    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [franchises, setFranchises] = useState([]);
    const [history, setHistory] = useState({
        balance: 0,
        credit: 0,
        franchise: ""
    });

    const { t } = useTranslation();

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

            var franchiseObject = {};

            data?.payments?.map(payment => {
                franchiseObject[payment.franchise] = { id: payment.franchise, name: (payment.locationName ?? payment.franchiseName) }
            });

            const franchiseArray = Object.values(franchiseObject);

            setPayments(sortedPayments);
            setFranchises(franchiseArray);

            if (franchiseArray.length === 1) {
                onFranchiseSelect({ target: { value: franchiseArray[0]?.id } })
            } else {
                console.log(franchiseArray);
            }

            setLoading(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onFranchiseSelect = async (e) => {
        const franchiseId = e.target.value;

        if (!franchiseId) {
            setHistory({
                credit: 0,
                balance: 0,
                franchise: franchiseId
            });
            return;
        }

        const { data } = await axiosInstance.get(`/api/parentfranchisehistory.php?fid=${franchiseId}`);

        setHistory({
            credit: data?.credit,
            balance: data?.balance,
            franchise: franchiseId,
            countryCode: data?.countryCode
        });
    }

    useEffect(() => {
        getPayments();
    }, [])

    return (
        <>
            <div className="home-section mt-4">
                <div className="pay-details justify-content-between gap-3 align-items-center mb-3 rounded-0">
                    <select
                        className="form-select max-content rounded-0"
                        name="franchise-selector"
                        id="franchise-selector"
                        value={history?.franchise}
                        onChange={onFranchiseSelect}>
                        <option value="">{t('All Franchises')}</option>
                        {
                            franchises?.map((franchise, index) => <option key={index} value={franchise.id}>{franchise.name}</option>)
                        }
                    </select>

                    {history?.franchise && <div className="d-flex gap-3">
                        <p className="text-grey-200 font-semibold text-14">
                            {t('Balance')}: <span className="text-red font-bold">{money(history?.balance, history?.countryCode)}</span>
                        </p>
                        <p className="text-grey-200 font-semibold text-14">
                            {t('Credit')}: <span className="text-green font-bold">{money(history?.credit, history?.countryCode)}</span>
                        </p>
                    </div>}
                    {/* <div className="title2 d-flex justify-content-end align-items-center gap-3 ">
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
                    </div> */}

                </div>

                <div className="table-responsive table-2 pb-5 rounded-0">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <td className='text-center'>#</td>
                                <td className='text-center'>{t('ID')}</td>
                                <td className='text-start'>{t('Student')}</td>
                                <td className='text-center'>{t('Schedule')}</td>
                                <td className='text-center'>{t('Amount')}</td>
                                <td className='text-center'>{t('Date & Time')}</td>
                                <td className='text-center'>{t('Franchise')}</td>
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
                                            {money(transaction.amount, transaction.countryCode)}
                                        </td>
                                        <td className='text-center'>{datef(transaction.paymentdate)}</td>
                                        <td className='text-center'>{transaction.locationName ?? transaction.franchiseName}</td>
                                        <td className={`${transaction.paymentstatus == 'pending' ? 'debit' : 'credit'} text-center`}>
                                            {transaction.paymentstatus?.toUpperCase() || t("success").toUpperCase()}
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
    const t = (t) => t;
    return <>
        <div className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between align-items-start">
                <div className="fs-1">
                    {/* //TODO Adjust the image path */}
                    <img src="https://fms3.bricks4kidznow.com/images/headerlogo.png" />
                </div>
                <div className="d-flex flex-column gap-1">
                    <b>{t('Reciept By')}:</b>
                    <p className="mb-0">{payment?.franchisename}</p>
                    <p className="mb-0">{payment?.franchiseEmail}</p>
                    <p className="mb-0">{payment?.franchisePhone}</p>
                    <p className="mb-0">{payment?.franchiseStreet}</p>
                    <p className="mb-0">{`${payment?.franchiseCity}, ${payment?.franchiseState}, ${payment?.franchiseZip}`}</p>
                    <p className="mb-0">{payment?.franchiseCountry}</p>
                </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex flex-column gap-1">
                    <p className="mb-0"><b>{t('Reciept Number')}{': '}</b>{payment?.paymentapplyid}</p>
                    <p className="mb-0"><b>{t('Student')}{': '}</b>{payment?.studentName}</p>
                    {payment?.studentUrl && <p className="mb-0"><b>{t('Registration ID')}{': '}</b>{payment?.studentUrl}</p>}
                </div>
                <div className="d-flex flex-column gap-1">
                    <b>{t('Bill to')}:</b>
                    <p className="mb-0">{payment?.familyName}</p>
                    <p className="mb-0">{payment?.familyEmail}</p>
                    {payment?.familyUrl && <p className="mb-0">{payment?.familyUrl}</p>}
                    <div className="mb-0">
                        {payment?.familyStreet && <p className="mb-0">{payment?.familyStreet}</p>}
                        {payment?.familyCity && payment.familyState && <p className="mb-0">{`${payment?.familyCity}, ${payment?.familyState}, ${payment?.familyZip}`}</p>}
                        {payment?.familyCountry && <p className="mb-0">{payment?.familyCountry}</p>}
                    </div>
                </div>
            </div>
            <div className="table-responsive mt-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">{t('Date')}</th>
                            <th scope="col">{t('Description')}</th>
                            <th scope="col" className="text-center">{t('Cost')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center text-nowrap">{datef(payment?.paymentdate, false)}</td>
                            <td>{payment?.description}</td>
                            <td className="text-center">{money(payment?.amount, payment?.countryCode)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    </>
}
