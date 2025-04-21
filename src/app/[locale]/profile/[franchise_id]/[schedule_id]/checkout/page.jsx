'use client';

import axiosInstance from "@/axios";
import alert from '@/app/components/SweetAlerts';

import { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import StudentSelection from "../../studentSelect";
import money from "@/app/localization/currency";
import MerchantGateWay from "@/app/components/payment_gateways/MerchantGateWay";
import Policy from "@/app/components/Policy";


export default function ScheduleCheckout({ params: { franchise_id, schedule_id } }) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    let studentIds = searchParams.get('id')?.split(',') ?? [];
    let status = searchParams.get('redirect_status');

    const appURL = process.env.NEXT_PUBLIC_APP_URL;

    const [formData, setFormData] = useState({
        schedule: schedule_id, // Schedule ID
        franchise: franchise_id, // Franchise ID
        coupon: '', // Coupon Code
        useCredit: '', // Use Credit Checkbox
        paymentoption: '', // Payment Option
        students: [], // Array of students
        marketingagreed: false, // Marketing Checkbox
        minimumDeposit: false, // Minimum Payment Checkbox
        returnURL: `${appURL}/profile/${franchise_id}/${schedule_id}/payment`,
        cancelURL: `${appURL}/profile/${franchise_id}/${schedule_id}/checkout`
    });

    const [paymentCardSettings, setPaymentCardSettings] = useState({
        credit: 0,
        useCredit: false,
        useCoupon: false,
        enrollment: true,
        discount: 0,
        recurringPayment: false
    });

    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState({});
    const [students, setStudents] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [studentDetails, setStudentDetails] = useState([]);
    const [selectingStudents, setSelectingStudents] = useState(true);

    const validateCoupon = async () => {
        try {
            const { data } = await axiosInstance.get(`api/validateCoupon.php?id=${couponCode}&sid=${schedule_id}`);
            setCoupon(data?.coupon);
            setCouponCode('');
            document.getElementById('coupon').value = '';
            const paymentMethod = formData['paymentoption'];
            console.log(data?.coupon?.couponcode);
            setFormData({
                ...formData,
                paymentoption: '',
            });
            setTimeout(() => {
                setFormData({
                    ...formData,
                    paymentoption: paymentMethod
                });
            }, 1);
            alert({ type: "success", message: data?.message });
        } catch (err) {
            const { response } = err;
            alert({ type: "error", message: response?.data?.message });
        }
    };

    const clearCoupon = () => {
        setCoupon(null);
        const paymentMethod = formData['paymentoption'];
        setFormData({
            ...formData,
            paymentoption: '',
        });
        setTimeout(() => {
            setFormData({
                ...formData,
                paymentoption: paymentMethod
            });
        }, 1);
        alert({ type: "success", message: t('Coupon has been removed.') })
    }

    const backToFranchise = () => {
        router.push(`/profile/${franchise_id}`);
    }

    const enroll = async () => {
        try {
            const obj = {
                ...formData,
                students: studentIds,
                paymentoption: paymentCardSettings?.enrollmentCost == 0 ? 'cash' : formData['paymentoption'],
                coupon: coupon?.couponcode
            };
            const { data } = await axiosInstance.post(`api/checkout.php`, obj);
            // console.log(data);
            // alert({ type: "success", message: data?.message });
            router.push(`/profile/${franchise_id}/${schedule_id}/payment?amount=${data?.amount}&redirect_status=success`);
        } catch (err) {
            alert({ type: "error", message: err?.response?.message });
        }
    }

    const tokenEnroll = (token) => {
        setFormData({ ...formData, token: token });
    }

    useEffect(() => {
        if (!formData?.token)
            return;
        enroll();
    }, [formData]);


    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        const newValue = type === 'checkbox' ? checked : value;

        setFormData({ ...formData, [name]: newValue });
    };

    const handlePolicies = (count) => {
        setFormData({ ...formData, policies: count });
    }

    const selectStudents = (students, studentList = []) => {
        const params = new URLSearchParams(searchParams);
        params.set('id', Object.keys(students).join(','));
        studentIds = Object.keys(students);
        replace(`${pathname}?${params.toString()}`);

        setStudents(Object.values(students));
        calculatePayment();

        const closeBtn = document.getElementById('selectStudentClose');
        closeBtn.click();
        setStudentDetails(studentList);
        setTimeout(() => {
            setSelectingStudents(false);
        }, 500);
    }

    const calculateCouponDiscount = (price) => {
        //apply discounts to paymentdue from coupon
        let costAfterCoupon = price;
        if (coupon['couponfree']) {
            costAfterCoupon = 0;
        }
        else if (coupon['couponpercentoff'] && coupon['couponpercentoff'] !== '0.00') {
            costAfterCoupon *= (1.0 - coupon['couponpercentoff']); //TODO Set FloatVal for percent
        }
        else if (coupon['couponamountoff']) {
            if (coupon['couponamountoff'] > costAfterCoupon)
                costAfterCoupon = 0;
            else {
                costAfterCoupon = costAfterCoupon - coupon['couponamountoff'];
            }
        }
        if (costAfterCoupon < 0)
            costAfterCoupon = 0;

        if (price != costAfterCoupon) {
            const discount = price - costAfterCoupon;
            return discount;
        } else {
            return 0;
        }

    }

    const toggleStudentSelection = () => {
        setSelectingStudents(true);
    }

    const showPaymentGateway = (checkPaymentOption = true) => {
        if (!formData['paymentoption'] && checkPaymentOption)
            return false;
        if (formData['paymentoption'] == 'cash' && checkPaymentOption)
            return false;
        if (
            ((formData['paymentoption'] == 'online' || formData['paymentoption'] == 'minimumDeposit') && paymentCardSettings?.totalPayable <= 0)
            && checkPaymentOption) {
            return false;
        }
        if (schedule?.policies && formData['policies'] !== schedule?.policies?.length)
            return false;

        return true;
    }

    const fetchData = async () => {
        const url = `api/schedule.php?fid=${franchise_id}&id=${schedule_id}` + (studentIds ? `&sid=${studentIds.join(',')}` : '')
        try {
            const { data } = await axiosInstance.get(url);
            setSchedule(data?.schedule);
            setStudents(data?.students);
            if (data?.schedule?.availablespots <= 0) {
                alert({ type: "error", message: t(`Schedule (${data?.schedule?.name}) has no available spots.`) });
                const redirectRoute = false ? `/profile/${franchise_id}` : `/profile/${franchise_id}/${schedule_id}/waitlist`;
                router.push(redirectRoute);
                return;
            }
            if (studentIds.length <= 0) {
                const btn = document.getElementById('selectStudents')
                btn.click();
            }
        } catch (err) {
            const { response } = err;
            router.push(`/profile/${franchise_id}`);
        } finally {
            setLoading(false);

            if (status == 'failed') {
                alert({ type: "error", message: t(`Payment Failed, please try again.`) });
            }
        }
    };

    function ageWarning(name, dob) {
        const dobDate = new Date(dob);

        const diff_ms = Date.now() - dobDate.getTime();

        const age_dt = new Date(diff_ms);

        const age = Math.abs(age_dt.getUTCFullYear() - 1970);

        if (age < schedule.minage) {
            return `${name} ` + t("is below the recommended age for this schedule.");
        } else if (age > schedule.minage) {
            return `${name} ` + t("is above the recommended age for this schedule.");
        }

        return false;
    }

    const calculatePayment = () => {
        let newTotalCost = schedule.cost?.totalcost * studentIds.length;
        let totalPayable = newTotalCost;

        let discount = 0;
        let creditToUse = 0;
        let newPaymentCardSettings = { ...paymentCardSettings };


        if (formData?.paymentoption == 'recurringPayments') {
            newPaymentCardSettings = {
                ...newPaymentCardSettings,
                useCredit: false,
                useCoupon: false,
                useMinimum: false,
                enrollmentCost: newTotalCost,
                totalPayable: schedule.schedulerecurringpaymentsamount
            };

            setPaymentCardSettings(newPaymentCardSettings);
            return;
        }


        if ((coupon && coupon != null) && formData?.paymentoption !== 'recurringPayments') {
            discount = calculateCouponDiscount(newTotalCost);
            newPaymentCardSettings = { ...newPaymentCardSettings, useCoupon: true, couponDiscount: discount };
        } else {
            newPaymentCardSettings = { ...newPaymentCardSettings, useCoupon: false, couponDiscount: 0 };
        }

        const enrollmentCost = newTotalCost - discount;
        totalPayable = enrollmentCost; //TODO Make sure this is solid.

        if (formData?.paymentoption == 'minimumDeposit') {
            // Make sure to always pay minimum deposit unless the amount remaining after discount is less than minimum desposit, then pay remaining amount.
            totalPayable = schedule['scheduleminimumdeposit'] * studentIds.length;
            totalPayable = (newTotalCost - discount) > totalPayable ? totalPayable : (newTotalCost - discount);

            newPaymentCardSettings = { ...newPaymentCardSettings, useMinimum: true, minimumAmount: totalPayable };
        } else {
            newPaymentCardSettings = { ...newPaymentCardSettings, useMinimum: false };
        }

        if (formData?.useCredit && (formData?.paymentoption !== 'recurringPayments' || !schedule.schedulerecurringpaymentsautocharge)) {
            creditToUse = Math.min(totalPayable, schedule.creditAvailable);
            totalPayable = totalPayable - creditToUse;

            newPaymentCardSettings = { ...newPaymentCardSettings, useCredit: true };
        } else {
            newPaymentCardSettings = { ...newPaymentCardSettings, useCredit: false };
        }

        newPaymentCardSettings = {
            ...newPaymentCardSettings,
            creditToUse: creditToUse,
            totalPayable: totalPayable,
            enrollmentCost: enrollmentCost
        };

        setPaymentCardSettings(newPaymentCardSettings);
    }

    useEffect(() => {
        calculatePayment();
    }, [coupon, schedule, formData]);

    useEffect(() => {
        const firstRadioButton = document.querySelector('#paymentoption-radios input[type="radio"]:first-of-type')?.value;

        setFormData({
            ...formData,
            paymentoption: firstRadioButton
        });
    }, [schedule]);

    useEffect(() => {
        fetchData();
    }, []);

    return <>
        {loading && <div className="loading-overlay">
            <div className="spinner"></div>
        </div>}
        <section>
            <div className="padding-top mb-5">
                <div className="container mt-4">
                    <div className="text-primary fw-bold small cursor-pointer mb-1" onClick={backToFranchise}> <i className="mdi mdi-arrow-left fw-bold"></i> {t('Back to class selection')}</div>
                    <div className="row book-party">
                        <div className="col-lg-7">
                            <div className="mb-3">
                                <h6 className="font-bold text-grey">{t('Schedule')}</h6>
                            </div>
                            <div className="check-out">
                                <div className="row">
                                    <div className="col-md-3 col-12">

                                        <img
                                            alt="..."
                                            className="card-img"
                                            src={schedule.image ? schedule.image : "/assets/img/program-1.png"}
                                        />
                                    </div>
                                    <div className="col-md-5 col-12 mt-md-0 mt-2">
                                        <h6 className="font-bold mb-2">{schedule.name || 'N/A'}</h6>
                                        <p className="font-semibold text-13 mb-2">{schedule.daterange || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-4 col-12 cost mt-md-0 mt-2">
                                        <p className=" text-grey-200 font-semibold mb-2">{t('Schedule Cost')} : <span className="font-bolder text-black">{money(schedule.cost?.totalcost) || 0}</span></p>
                                        <p className="font-semibold text-13 text-orange">{(schedule.availablespots || 0) + ' ' + t('Available Spots')}
                                        </p>
                                    </div>
                                </div>
                                <div className="details mt-2">
                                    <div className="items">
                                        <img src="/assets/img/pin-icon.svg" alt="..." />
                                        <p className="font-semibold text-13">{schedule.location || 'Location not specified'}</p>
                                    </div>
                                    <div className="items">
                                        <img src="/assets/img/teacher-icon.svg" alt="..." />
                                        <p className="font-semibold text-13">{(schedule.teachers?.length > 0 ? schedule.teachers.join(', ') : 'No teachers assigned')}</p>
                                    </div>
                                    <div className="items">
                                        <img alt="" src="/assets/img/pin-icon.svg" />
                                        <p className="font-semibold text-13 text-orange">
                                            {`${schedule.minage || 1} - ${schedule.maxage || 'N/A'} years`}
                                        </p>
                                    </div>
                                    <div className="items">
                                        <img src="/assets/img/clock-icon.svg" alt="..." />
                                        <div className="days flexed">
                                            {schedule.days?.length === 7
                                                ? <p className="font-semibold text-13">{t('All Week')}</p>
                                                : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                                    schedule.days?.includes(day) ? (<span
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
                                    </div>
                                </div>
                            </div>
                            <div className="line" />
                            <div className="mb-3 d-flex justify-content-between align-items-center">
                                <p className="fs-6 font-bold text-grey">{t('Students to enroll')}</p>
                                <span id="selectStudents" data-bs-toggle="modal" data-bs-target="#select-student" className="fs-6 font-bold text-blue cursor-pointer" onClick={toggleStudentSelection}><i className="mdi mdi-pencil"></i> {('Update Students')}</span>
                            </div>
                            {
                                students?.map((student) => {
                                    return <div className="flexed mb-3" key={student.studentid}>
                                        <p className=" text-grey-200 font-semibold">{`${t('Student')}: `}
                                            <span className=" text-black">{student.studentname}</span>
                                        </p>
                                        {ageWarning(student?.studentname, student?.studentbirthdate) && <i className="mdi mdi-alert-circle text-danger" title={ageWarning(student?.studentname, student?.studentbirthdate)}></i>}
                                    </div>
                                })
                            }

                            {(schedule.cost?.totalcost > 0 || formData?.useCredit) && <>
                                <div className="line" />
                                <div className="mb-3">
                                    <h6 className="font-bold text-grey">{t('Payment Options')}</h6>
                                </div>

                                <div className="radio-group" id="paymentoption-radios">
                                    {schedule.scheduleallowonlinepayment != 0 ? <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentoption"
                                            id="online"
                                            value="online"
                                            checked={formData?.paymentoption == "online"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="online">{t('Pay In Full')}</label>
                                    </div> : ''}

                                    {schedule.scheduleuseminimumdeposit != 0 ? <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentoption"
                                            id="minimumDeposit"
                                            value="minimumDeposit"
                                            checked={formData?.paymentoption == "minimumDeposit"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="minimumDeposit">{`${t('Pay')} ${money(schedule.scheduleminimumdeposit * studentIds.length)} Deposit`}</label>
                                    </div> : ''}

                                    {false ? <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentoption"
                                            id="cash"
                                            value="cash"
                                            checked={formData?.paymentoption == "cash"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="cash">{t('Cash / Cheque')}</label>
                                    </div> : ''}

                                    {(schedule.scheduleallowonlinepayment != 0 && schedule.schedulerecurringpayments != 0) ? <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentoption"
                                            id="recurringPayments"
                                            value="recurringPayments"
                                            checked={formData?.paymentoption == "recurringPayments"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="recurringPayments"> {`${schedule.schedulerecurringpaymentsnum} ${t(schedule.schedulerecurringpaymentsfrequency)} ${t('Payments')} @ ${money(schedule.schedulerecurringpaymentsamount * studentIds.length)}`}</label>
                                    </div> : ''}
                                </div>

                                <div className="check-group mt-2">
                                    {(schedule.creditAvailable > 0 && (formData?.paymentoption !== 'recurringPayments' || !schedule.schedulerecurringpaymentsautocharge)) ? (
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                name="useCredit"
                                                type="checkbox"
                                                id="useCredit"
                                                checked={formData?.useCredit || false}
                                                onChange={handleChange}  // Handle the change
                                            />
                                            <label className="form-check-label" htmlFor="useCredit">
                                                {`${t('Use Credit')} (${schedule.creditAvailable})`}
                                            </label>
                                        </div>
                                    ) : ''}
                                </div>
                            </>}

                            <div className="line" />
                            <div className="mb-1">
                                <h6 className="font-bold text-grey">{t('Our Policies')}</h6>
                            </div>
                            <Policy policies={schedule?.policies} action={handlePolicies}></Policy>
                            {/* <small className="text-small text-danger">{t('Please accept the policy to proceed.')}</small> */}
                        </div>
                        <div className="col-lg-5">
                            <div className="coupon mb-4 mt-4 mt-md-0">
                                {formData?.paymentoption !== 'recurringPayments' ? <>
                                    <input type="text" id="coupon" maxLength={16} className="input-style1 rounded-0" placeholder="Have coupon code ? Enter here" onChange={(e) => setCouponCode(e.target.value)} />
                                    <button className="btn btn-outline-primary fs-5 rounded-0" disabled={couponCode == ''} onClick={validateCoupon}>{t('Apply')}</button>
                                </> : ''}
                            </div>
                            <div className="card cart-card rounded-0">
                                <div className="middle-section pt-1 pb-3">
                                    <h6 className="text-grey font-bold mb-3">{t('Payment Summary')}</h6>
                                    <div className="row">
                                        <div className="col text-start">
                                            <p className="text-grey-200  font-semibold">{t('Schedule Cost')}</p>
                                        </div>
                                        <div className="col text-center">
                                            <p className="text-black font-semibold">{`${money(schedule.cost?.basecost)} x ${studentIds.length}`}</p>
                                        </div>
                                        <div className="col text-end">
                                            <p className="text-grey-200  font-semibold"> <span className=" text-black font-bold">{money(schedule.cost?.basecost * studentIds.length) || money(0)}</span></p>
                                        </div>
                                    </div>
                                </div>
                                {schedule.addons && Object.values(schedule?.addons).map((addon, i) => {
                                    return (<div className="middle-section pt-3 pb-3" key={i}>
                                        <div className="row">
                                            <div className="col text-start">
                                                <p className="text-grey-200  font-semibold">{`${addon.programaddonname || 'Addon Name'} ${addon.scheduleprogramaddonqty > 1 ? `X ${addon.scheduleprogramaddonqty}` : ''}`}</p>
                                            </div>
                                            <div className="col text-center">
                                                <p className="text-black font-semibold">{`${money(addon.programaddonamount * addon.scheduleprogramaddonqty)} x ${studentIds.length}`}</p>
                                            </div>
                                            <div className="col text-end">
                                                <p className="text-grey-200  font-semibold"> <span className=" text-black font-bold">{money(addon.programaddonamount * addon.scheduleprogramaddonqty * studentIds.length)}</span></p>
                                            </div>
                                        </div>
                                    </div>);
                                })}
                                {paymentCardSettings?.useCoupon && <div className="middle-section pt-3 pb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-grey-200  font-semibold">{`${coupon?.couponname}`}</p>
                                            <div className="d-flex align-items-end gap-1">
                                                <p className="text-grey-200  font-semibold">{t('Coupon Applied')}</p>
                                                <p className="small text-danger cursor-pointer" onClick={clearCoupon}>{t('remove')}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-grey-200  font-semibold"> <span className=" text-green font-bold">- {money(paymentCardSettings.couponDiscount)}</span></p>
                                        </div>
                                    </div>
                                </div>}
                                <div className="bottom-section mt-3 pt-3 pb-3 bg-primary text-white">
                                    <div className="d-flex justify-content-between align-items-center px-4">
                                        <p className="fs-5 font-semibold">{t('Total Amount')} </p>
                                        <p className="fs-5 font-semibold"> <span className="font-bold">{money(paymentCardSettings?.enrollmentCost)}</span></p>
                                    </div>

                                    {paymentCardSettings?.useCredit && <div className="pt-1 pb-3">
                                        <div className="d-flex justify-content-between align-items-center px-4">
                                            <p className="font-semibold">{t('Credit Applied')}</p>
                                            <p className="font-semibold"> <span className="font-bold">- {money(paymentCardSettings?.creditToUse)}
                                            </span></p>
                                        </div>
                                    </div>}

                                    {paymentCardSettings?.useMinimum && <div className="pb-1">
                                        <div className="d-flex justify-content-between align-items-center px-4">
                                            <p className="fs-5 font-semibold">{t('Minimum Deposit')}</p>
                                            <p className="fs-5 font-semibold"> <span className="font-bold">{money(paymentCardSettings?.minimumAmount)}
                                            </span></p>
                                        </div>
                                    </div>}

                                    <div className="d-flex justify-content-between align-items-center px-4">
                                        <p className="fs-5 font-semibold">{t('Due Now')} </p>
                                        <p className="fs-5 font-semibold"> <span className="font-bold">{money(paymentCardSettings?.totalPayable)}</span></p>
                                    </div>
                                </div>
                            </div>
                            {!showPaymentGateway() && (!paymentCardSettings?.totalPayable == 0 && formData['paymentoption']) && <p className="text-danger text-center">{t('Please select a payment option and accept our policies to proceed.')}</p>}

                            <div className="d-flex gap-2 flex-column">
                                {showPaymentGateway() && <MerchantGateWay key={formData['paymentoption']} merchant_id={franchise_id} paymentData={{ ...formData, students: studentIds, coupon: coupon?.couponcode }} cancelAction={() => setFormData({ ...formData, paymentoption: '' })} submitAction={(token) => { tokenEnroll(token) }} />}
                                {((formData['paymentoption'] == 'cash' || paymentCardSettings?.totalPayable == 0) && showPaymentGateway(false)) && <button className="btn btn-success btn-lg w-100 rounded-0" onClick={enroll}>{t('Enroll Now')}</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
        <div className="modal fade" id="select-student" aria-hidden="true" data-bs-backdrop={studentIds?.length > 0 ? "true" : "static"} data-bs-keyboard={studentIds?.length > 0 ? "true" : "false"}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header border-0 d-flex justify-content-between align-items-center pb-0">
                        <p className="font-bold text-blue fs-5" id="modalLabel">{t('Select students to enroll.')}</p>
                        <i className={`mdi mdi-close-circle text-red fs-5 cursor-pointer ${studentIds?.length > 0 ? '' : ' d-none'}`} id="selectStudentClose" data-bs-dismiss="modal" aria-label="Close"></i>
                        <i className={`mdi mdi-close-circle text-red fs-5 cursor-pointer ${studentIds?.length > 0 ? ' d-none' : ''}`} data-bs-dismiss="modal" aria-label="Close" onClick={backToFranchise}></i>
                    </div>
                    <div className="modal-body">
                        <StudentSelection key={selectingStudents ? 'SS' : 'NSS'} passedStudents={studentIds} studentDetails={studentDetails} schedule_id={schedule_id} buttonAction={selectStudents} />
                    </div>
                </div>
            </div>
        </div>
    </>;
}