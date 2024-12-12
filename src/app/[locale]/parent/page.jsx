'use client';

import axiosInstance from "@/axios";
import alert from '@/app/components/SweetAlerts';
import money from '@/app/localization/currency';
import date from '@/app/localization/date';

import { useEffect, useState } from "react"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import TextWithToggle from "@/app/components/TextWithToggle";
import MerchantGateWay from "@/app/components/payment_gateways/MerchantGateWay";


export default function ParentProfile() {
    const router = useRouter();
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState([]);
    const [franchises, setFranchises] = useState([]);
    const [toggleGridView, setToggleGridView] = useState(false);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [selectedFranchise, setSelectedFranchise] = useState('');

    const enrollIntoClass = () => {
        const selectedFranchise = document.getElementById('franchise-selector').value;
        const url = selectedFranchise ? `/profile/${selectedFranchise}` : '/profile/6209';
        router.push(url);
    }

    const selectFranchise = (e) => {
        setSelectedFranchise(e.target.value);
    }

    const setActiveState = (i, activeState = false) => {
        if (activeState)
            return;

        const editedSchedules = filteredSchedules.map((ele, index) => {
            if (index === i) {
                ele['isActive'] = true;
                ele['isClosed'] = false;
            }

            return ele;
        });

        setFilteredSchedules(editedSchedules);
    }

    const onClose = (i) => {
        const editedSchedules = filterSchedules.map((ele, index) => {
            if (index === i)
                ele['isClosed'] = true;
        })
    }

    const t = (string) => string;

    const filterSchedules = (franchise, data) => {
        const result = data
            .filter((ele) => ele.franchiseId == franchise) // Filter by franchiseId
            .sort((a, b) => {
                // First compare by the student name
                const studentName = a['studentName'].localeCompare(b['studentName']);

                // If the student name results in 0 (i.e., they are equal), compare by schedule name
                if (studentName === 0) {
                    return a['name'].localeCompare(b['name']);
                }

                return studentName;
            });

        setFilteredSchedules(result);
    }

    useEffect(() => {
        const getFranchises = (schedules = []) => {
            const franchises = new Set();

            schedules.forEach(obj => {
                if (obj.hasOwnProperty('franchiseId')) {
                    franchises.add(obj['franchiseId']);
                }
            });

            return [...franchises];
        }


        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get('/api/enrollments.php');
                if (data?.schedules?.length > 0) {
                    const unactive = data?.schedules.map(ele => {
                        ele['isActive'] = false;
                        return ele;
                    })

                    setSchedules(unactive);
                    filterSchedules(unactive[0]?.franchiseId, unactive);
                    setFranchises(getFranchises(unactive));
                    setSelectedFranchise(unactive[0]?.franchiseId);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        const handleEnrollment = () => {
            const studentIds = searchParams.get('id')?.split(',');
            const status = searchParams.get('status');

            if (!studentIds)
                return;

            if (status == 'success')
                alert({ type: "success", message: t(`${studentIds?.length} student(s) successfully enrolled.`) })
            else
                alert({ message: t(`${studentIds?.length} student(s) enrollment failed.`) })

            replace(`${pathname}`);

        }

        handleEnrollment();
        fetchData();
    }, []);


    useEffect(() => {
        if (selectedFranchise) {
            filterSchedules(selectedFranchise, schedules)
        }
    }, [selectedFranchise]);

    return <div className="home-section mt-4">
        <div className="row">
            <div className="col-lg-6 m-auto">
                <div className="d-flex justify-content-start flex-column gap-2">
                    {(loading || franchises?.length == 0) ? '' :
                        <div className="d-flex gap-3 align-items-center">
                            <p className="text-grey fs-6 font-bold">{t('Locations')}</p>
                            <select id="franchise-selector" defaultValue={franchises[0] ?? null} onChange={selectFranchise}>
                                {franchises.map((franchise) =>
                                    <option value={franchise} key={franchise}>{franchise}</option>
                                )}
                            </select>
                        </div>
                    }
                    <p className="text-grey fs-6 font-bold">{t('Student Enrollments')}</p>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="heading end">
                    <button className="btn btn-outline-secondary py-1" title={t('Toggle Grid View')} onClick={() => setToggleGridView(!toggleGridView)}>
                        <i className="mdi mdi-grid fs-4 px-1"></i></button>
                    <button className="btn btn-1" onClick={enrollIntoClass}>
                        <img src="assets/img/add-button.svg" alt="" />
                        {t('Enroll In New Class')}
                    </button>
                    <div className="input-wrap">
                        <i className="fa-solid fa-magnifying-glass text-grey-200" />
                        <input
                            type="Search"
                            className="input-style1"
                            placeholder="Search Programs"
                        />
                    </div>
                </div>
            </div>
        </div>
        {!toggleGridView && <div className="mt-4">
            {((!loading) ? filteredSchedules : [{}, {}])?.map((schedule, i) =>
                <ParentScheduleCard schedule={schedule} hoverAction={() => { setActiveState(i, schedule.isActive) }} loading={loading} index={i} key={i} />
            )}
        </div>}
        {toggleGridView && <div className="mt-4 row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {((!loading) ? filteredSchedules : [{}, {}])?.map((schedule, i) => (
                <ParentScheduleCardGrid schedule={schedule} hoverAction={() => { setActiveState(i, schedule.isActive) }} loading={loading} index={i} key={i} />
            ))}
        </div>}

    </div>
}

const ParentScheduleCard = ({ schedule, index, loading, hoverAction = () => { } }) => {
    const t = (text) => text;
    const [internalSchedule, setInternalSchedule] = useState({ ...schedule });

    const toggle = (status = 'open') => {
        setInternalSchedule({
            ...internalSchedule,
            isClosed: status == 'open' ? true : false
        });
        console.log(internalSchedule['isClosed'], status);
    }

    return (
        <div className="card">
            <div className="row">
                <div className="col-md-3">
                    {loading ? (
                        <Skeleton height={200} width={'100%'} />
                    ) : (
                        <img
                            className="align-self-center img-fluid"
                            height={'100%'}
                            width={'100%'}
                            // src="/assets/img/program-1.png"
                            src={"https://s3-us-west-2.amazonaws.com/bricks4kidz-files/files/64/19/WeLearnWeBuildWePlay.jpg"}
                            alt="Schedule Image"
                        />
                    )}
                </div>
                <div className="col-md-5">
                    <div className="fs-4">
                        {loading ? <Skeleton width={200} /> : <b>{schedule.name}</b>}
                    </div>
                    <div className="fs-6">
                        {loading ? <><Skeleton width={350} /> <Skeleton count={4} /></> : <TextWithToggle description={schedule.description} />}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card" style={{ backgroundColor: '#D8FBFE', marginBottom: 'unset' }}>
                        <div className="informations mb-3">
                            <p className="text-grey fs-5 font-semibold">
                                {loading ? <Skeleton width={120} /> : `${schedule.studentName || "Ahmed Red"}`}
                            </p>
                            {/* <p className="text-grey fs-5 font-semibold">
                                {t('Enrollment Date')}{': '}
                                {loading ? <Skeleton width={100} /> : `${schedule.enrollmentDate?.split(' ')[0] || "22/12/2024"}`}
                            </p> */}
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="font-semibold text-grey fs-5">
                                {t('Payment Summary')}
                            </p>
                            {/* <div className="invoice">
                                <i className="fa-solid fa-file-lines" />
                                <p className="font-semibold fs-6">
                                    {t('Invoice')}
                                </p>
                            </div> */}
                        </div>
                        <div className="">
                            <div className="d-flex justify-content-between">
                                <p className="font-bold fs-6">{t('Cost')}</p>
                                <p className="font-bolder fs-6">
                                    {loading ? <Skeleton width={80} /> : `${money(schedule.cost)}`}
                                </p>
                            </div>
                            {schedule.addons?.map((addon, index) => (
                                <div className="d-flex justify-content-between" key={index}>
                                    <p className="font-bold text-12">
                                        {loading ? <Skeleton width={100} /> : `${addon.name}`}
                                    </p>
                                    <p className="font-bold text-12">
                                        {loading ? <Skeleton width={40} /> : `${money(addon.price)}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="font-bold fs-6">{t('Paid')}</p>
                            <p className="font-bolder fs-6">
                                {loading ? <Skeleton width={80} /> : `${money(schedule.paidAmount)}`}
                            </p>
                        </div>
                        {(schedule.cost - schedule.paidAmount) > 0 && (
                            <div className="">
                                <div className="d-flex justify-content-between">
                                    <p className="font-bold fs-6">{t('Balance')}</p>
                                    <p className="font-bolder fs-6">
                                        {loading ? <Skeleton width={80} /> : `${money(schedule.cost - schedule.paidAmount)}`}
                                    </p>
                                </div>
                                <p className="font-bold text-12 text-green-dark">
                                    {loading ? (
                                        <Skeleton width={250} />
                                    ) : (
                                        schedule.recurringPayment &&
                                        t(`Payment of ${schedule.paymentDueTillDate} due on ${schedule.nextPaymentDateUTC}`)
                                    )}
                                </p>
                            </div>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-2 ">
                            <div className="print flexed text-blue" style={{ cursor: 'pointer' }}>
                                {loading ? '' : <p className="font-semibold fs-6">{t('Invoice')}</p>}
                            </div>
                            <button className="btn-payment-summary" data-bs-toggle="modal" onMouseOver={hoverAction} onClick={() => { toggle('open') }}
                                data-bs-target={`#payment-modal-${index}`}>{t('Payments')}{schedule.isActive}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id={`payment-modal-${index}`} aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content ">
                        <div className="modal-header border-0 d-flex justify-content-between align-items-center ">
                            <p className="font-bold text-blue fs-5" id="modalLabel">{t(`Payment Summary`)}</p>
                            <img id="closeModal" src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" onClick={() => { toggle('close') }} />
                        </div>
                        <div className="modal-body pt-0">
                            <PaymentDetails index={index} schedule={schedule} active={schedule.isActive} key={internalSchedule.isClosed} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ParentScheduleCardGrid = ({ schedule, index, loading, hoverAction = () => { } }) => {
    const t = (text) => text;

    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const [internalSchedule, setInternalSchedule] = useState({ ...schedule });

    const toggle = (status = 'open') => {
        setInternalSchedule({
            ...internalSchedule,
            isClosed: status == 'open' ? true : false
        });
        console.log(internalSchedule['isClosed'], status);
    }

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    return (
        <div className="col">
            <div className="card d-flex flex-column">
                <div className="mb-1 flex-shrink-0">
                    {loading ? (
                        <Skeleton height={200} width={'100%'} />
                    ) : (
                        <>
                            {!isImageLoaded && <Skeleton height={200} width={'100%'} />}
                            <img
                                className="align-self-center img-fluid"
                                src={"https://s3-us-west-2.amazonaws.com/bricks4kidz-files/files/64/19/WeLearnWeBuildWePlay.jpg"}
                                alt="Schedule Image"
                                style={{ display: isImageLoaded ? "block" : "none" }}
                                onLoad={handleImageLoad}
                            />
                        </>
                    )}
                </div>
                <div className="card-body d-flex flex-column justify-content-between" style={{ flexGrow: 1 }}>
                    <div className="fs-5">
                        {loading ? <Skeleton width={200} /> : <b>{schedule.name}</b>}
                    </div>
                    <div className="mb-1">
                        <p className="text-grey fs-5 font-semibold">
                            {t('Student')}: {loading ? <Skeleton width={120} /> : `${schedule.studentName}`}
                        </p>
                        <p className="text-grey fs-5 font-semibold">
                            {t('Enrollment Date')}{': '}
                            {loading ? <Skeleton width={100} /> : `${schedule.enrollmentDate?.split(' ')[0]}`}
                        </p>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="print flexed text-blue" style={{ cursor: 'pointer' }}>
                            {loading ? '' : <p className="font-semibold fs-6">{t('Invoice')}</p>}
                        </div>
                        <button className="btn-payment-summary" data-bs-toggle="modal" onMouseOver={hoverAction}
                            data-bs-target={`#payment-modal-${index}`} onClick={() => { toggle('open') }}>{t('Payments')}
                        </button>
                    </div>
                </div>
                {/* Payment Modal */}
                <div className="modal fade" id={`payment-modal-${index}`} tabIndex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                        <div className="modal-content">
                            <div className="modal-header border-0 d-flex justify-content-between align-items-center ">
                                <p className="font-bold text-blue fs-5" id="modalLabel">{t(`Payment Details`)}</p>
                                <img id="closeModal" src="/assets/img/cancel-btn.svg" data-bs-dismiss="modal" aria-label="Close" onClick={() => { toggle('close') }} />
                            </div>
                            <div className="modal-body pt-0">
                                <PaymentDetails index={index} schedule={schedule} active={schedule.isActive} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const PaymentDetails = ({ schedule, index, active = false }) => {
    const t = (text) => text;

    const [notes, setNotes] = useState([]);
    const [payments, setPayments] = useState([]);
    const [recurringPayments, setRecurringPayments] = useState([]);
    const [merchantPaymentActive, setMerchantPaymentActive] = useState(false);

    const [details, setDetails] = useState({
        parent: {},
        student: {},
        schedule: {},
        recurringPayment: {},
    });

    const [formData, setFormData] = useState({
        schedule: schedule?.id, // Schedule ID
        franchise: schedule?.franchiseId, // Franchise ID
        useCredit: '', // Use Credit Checkbox
        paymentoption: 'online', // Payment Option
        students: [], // Array of students
        amount: schedule?.cost - schedule?.paidAmount,
        noEnrollment: true,
        scheduleenrollid: schedule.scheduleenrollid
    });

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        const newValue = type === 'checkbox' ? checked : value;

        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const cancelPayment = () => {
        setMerchantPaymentActive(false);
    }

    const showPayment = () => {
        if (formData['paymentoption'] && formData['paymentoption'] != 'cash' && merchantPaymentActive) {
            return true
        }

        return false;
    }

    const activatePayment = (e) => {
        console.log('hit')
        //TODO Setup the form validation checks to work here.
        // e.preventDefault();

        if (formData.amount > 0 && formData.amount <= (schedule?.cost - schedule?.paidAmount))
            setMerchantPaymentActive(true);
    }

    const fetchData = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/paymentdetails.php?scheduleenrollid=${schedule.scheduleenrollid}`);
            console.log(data);
            setNotes(data?.notes);
            setPayments(data?.payments);
            setRecurringPayments(data?.recurringpayments);

            // setDetails();
        } catch (err) {
            console.log(err);
        } finally {
            console.log('done');
        }
    };

    useEffect(() => {
        setFormData({
            ...formData,
            schedule: schedule?.id, // Schedule ID
            students: [schedule?.studentId], // Student ID
            franchise: schedule?.franchiseId // Franchise ID  
        });
    }, [schedule]);

    useEffect(() => {
        if (!active)
            return;

        fetchData();

    }, [active]);

    return <div className="row">

        <div className="col-lg-4">
            <div className="card bg-primary text-white rounded-0 h-100">
                <div className="card-body p-0 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-4">{t('Enrollment Details')}</span>
                    </div>
                    <div className="mt-3 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <p className="fs-5">{t('Schedule')}</p>
                            <p>{schedule.name}</p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <p className="fs-5">{t('Student')}</p>
                            <p>{schedule.studentName}</p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <p className="fs-5">{t('Parent')}</p>
                            <p>{schedule.familyName}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="fs-5">{t('Extra?')}</p>
                            <p>Something Goes Here</p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="fs-5">{t('Base Cost')}</p>
                        <p>{money(schedule.cost)}</p>
                    </div>
                    {/* Addons should come here */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="fs-5">{t('Total Cost')}</p>
                        <p>{money(schedule.cost)}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="fs-5">{t('Paid Amount')}</p>
                        <p>{money(schedule.paidAmount)}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="fs-5">{t('Remaining Amount')}</p>
                        <p>{money(schedule.cost - schedule.paidAmount)}</p>
                    </div>
                    {(schedule.cost - schedule.paidAmount > 0) && (true /** Schedule should have online paymend option available otherwise no payment should show */) && !showPayment() && <>
                        <hr className="my-4" />
                        <div className="">
                            <h6 className="font-bold">{t('Amount')}</h6>
                        </div>
                        <form action={activatePayment}>
                            <div className="d-flex">
                                <input
                                    type="number"
                                    className="input-style1 rounded-0"
                                    name="amount"
                                    id="amount"
                                    value={formData['amount']}
                                    onChange={handleChange}
                                    min={1}
                                    max={schedule?.cost - schedule?.paidAmount}
                                />
                                <button className="btn btn-success rounded-0 text-nowrap">{t('Pay Now')}</button>
                            </div>
                        </form>
                    </>}
                </div>
            </div>
        </div>
        <div className="col-lg-8">
            {/* {action == 'makepayment' && <div className="p-0 border rounded-0">
                <div className="tab-content" id="v-pills-tabContent">
                    <div className="tab-pane fade show active" id={`v-pills-payment-${index}`} role="tabpanel" aria-labelledby={`v-pills-payment-tab-${index}`}>
                        <div className="p-3">
                            <div className="mb-3">
                                <h6 className="font-bold">{t('Payment Options')}</h6>
                            </div>
                            <div className="d-flex flex-column">
                                {true ? <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentoption"
                                        id="online"
                                        value="online"
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="online">{t('Online Payment')}</label>
                                </div> : ''}

                                {true ? <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentoption"
                                        id="cash"
                                        value="cash"
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="cash">{t('Cash / Cheque')}</label>
                                </div> : ''}

                                {schedule.schedulerecurringpayments !== 0 ? <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentoption"
                                        id="recurringPayments"
                                        value="recurringPayments"
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="recurringPayments"> {`${schedule.schedulerecurringpaymentsnum} ${t(schedule.schedulerecurringpaymentsfrequency)} ${t('Payments')} @ ${money(schedule.schedulerecurringpaymentsamount)}`}</label>
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

                            

                            {showPayment() ? <>
                                <div className="line"></div>
                                <MerchantGateWay merchant_id={schedule?.franchiseId} paymentData={{ ...formData, students: [schedule.studentId] }} cancelAction={cancelPayment} />
                            </> : ''}

                        </div>
                    </div>
                    <div className="tab-pane fade" id={`v-pills-profile-${index}`} role="tabpanel" aria-labelledby={`v-pills-profile-tab-${index}`}>

                    </div>
                    <div className="tab-pane fade" id={`v-pills-messages-${index}`} role="tabpanel" aria-labelledby={`v-pills-messages-tab-${index}`}>

                    </div>
                </div>
            </div>} */}
            {showPayment() ? <>
                <div className="fs-4 mb-2 mt-0 align-items-start">{t('Amount To Be Paid is')} {money(formData?.amount)}</div>
                <MerchantGateWay merchant_id={schedule?.franchiseId} paymentData={{ ...formData, students: [schedule.studentId] }} cancelAction={cancelPayment} />
            </> : ''}
            {!showPayment() && <>
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-0 active" id={`pills-history-tab-${index}`} data-bs-toggle="pill" data-bs-target={`#pills-history-${index}`} type="button" role="tab" aria-controls={`pills-history-${index}`} aria-selected="true">{t('Payment History')}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-0" id={`pills-recurring-payments-tab-${index}`} data-bs-toggle="pill" data-bs-target={`#pills-recurring-payments-${index}`} type="button" role="tab" aria-controls={`pills-recurring-payments-${index}`} aria-selected="false">{t('Recurring Payments')}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-0" id={`pills-logs-tab-${index}`} data-bs-toggle="pill" data-bs-target={`#pills-logs-${index}`} type="button" role="tab" aria-controls={`pills-logs-${index}`} aria-selected="false">{t('Enrollment Logs')}</button>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active table-scrollable" id={`pills-history-${index}`} role="tabpanel" aria-labelledby="pills-history-tab">
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered mb-0">
                                <thead>
                                    <tr>
                                        <td className="text-center">
                                            #
                                        </td>
                                        <td className="text-center">
                                            {t('Payment Date')}
                                        </td>
                                        <td className="text-center">
                                            {t('Method')}
                                        </td>
                                        <td className="text-center">
                                            {t('Amount')}
                                        </td>
                                        <td className="text-center">
                                            {t('Description')}
                                        </td>
                                        <td className="text-center">
                                            {t('Transaction#')}
                                        </td>
                                        {/* <td>
                                    {t('Status')}
                                </td> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments?.map((payment, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-nowrap text-center">{date(payment?.paymentcreateddate)}</td>
                                            <td className="text-center">{payment?.paymenttype}</td>
                                            <td className="text-center">{money(payment?.paymentapplyamount)}</td>
                                            <td className="text-center"><TextWithToggle description={payment?.paymentapplydescription} maxLength={15} showtext={false} /></td>
                                            <td className="text-center"><TextWithToggle description={payment?.paymenttransactionno} maxLength={10} showtext={false} /></td>
                                            {/* <td>{payment?.paymentstatus}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="tab-pane small-scroll-region fade" id={`pills-logs-${index}`} role="tabpanel" aria-labelledby="pills-logs-tab">
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered mb-0">
                                <thead>
                                    <tr>
                                        <td className="text-center">
                                            #
                                        </td>
                                        <td className="text-center">
                                            {t('ID')}
                                        </td>
                                        <td className="text-center">
                                            {t('Note')}
                                        </td>
                                        <td className="text-center">
                                            {t('Date')}
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notes?.map((note, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{note?.noteid}</td>
                                            <td className="text-center"><TextWithToggle description={note?.notetext} maxLength={50} showtext={false} /></td>
                                            <td className="text-center">{date(note?.notecreateddate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="tab-pane small-scroll-region fade" id={`pills-recurring-payments-${index}`} role="tabpanel" aria-labelledby="pills-recurring-payments-tab">
                        <div className="mb-3">
                            <h6 className="font-bold text-grey">{t('Active Recurring Payment')}</h6>
                        </div>
                        <div className="d-flex gap-3 justify-content-center">
                            {recurringPayments?.map(((recurringpayment, index) => (
                                !recurringpayment?.paymentrecurterminateddate && <div className="card rounded-0 d-flex gap-2 w-75" key={index}>
                                    <div className="d-flex align-items-center justify-content-between gap-3">
                                        <span className="font-bold ">Start Date</span>
                                        <span className="fs-5 ">{date(recurringpayment?.paymentrecurstartdate, false)}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between gap-3">
                                        <span className="font-bold ">Frequency</span>
                                        <span className="fs-5 ">{recurringpayment?.paymentrecurfrequency.toUpperCase()}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between gap-3">
                                        <span className="font-bold ">Total Cost</span>
                                        <span className="fs-5 ">{money(recurringpayment?.paymentrecurtotal)}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between gap-3">
                                        <span className="font-bold ">Paid</span>
                                        <span className="fs-5 ">{money(recurringpayment?.paymentrecurtotal - recurringpayment?.paymentrecurbalance)}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between gap-3">
                                        <span className="font-bold ">Remaining</span>
                                        <span className="fs-5 ">{money(recurringpayment?.paymentrecurbalance)}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between gap-3">
                                        <span className="font-bold ">Next Payment</span>
                                        <span className="fs-5 ">{date(recurringpayment.nextPaymentDateUTC, false)}</span>
                                    </div>
                                    {recurringpayment?.paymentrecurterminateddate &&
                                        <small className="text-end text-danger font-bold">
                                            Terminated on: {date(recurringpayment?.paymentrecurterminateddate, false)}
                                        </small>}
                                </div>
                            )))}
                        </div>
                        <div className="mb-3">
                            <h6 className="font-bold text-grey">{t('Terminated Recurring Payments')}</h6>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered mb-0">
                                <thead>
                                    <tr>
                                        <td className="text-center">
                                            #
                                        </td>
                                        <td className="text-center">
                                            {t('Start Date')}
                                        </td>
                                        <td className="text-center">
                                            {t('Frequency')}
                                        </td>
                                        <td className="text-center">
                                            {t('Total Cost')}
                                        </td>
                                        <td className="text-center">
                                            {t('Paid')}
                                        </td>
                                        <td className="text-center">
                                            {t('Remaining')}
                                        </td>
                                        <td>
                                            {t('Termination Date')}
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recurringPayments?.map((recurringpayment, index) => (
                                        recurringpayment.paymentrecurterminateddate && <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-nowrap text-center">{date(recurringpayment?.paymentrecurstartdate, false)}</td>
                                            <td className="text-center">{recurringpayment?.paymentrecurfrequency.toUpperCase()}</td>
                                            <td className="text-center">{money(recurringpayment?.paymentrecurtotal)}</td>
                                            <td className="text-center">{money(recurringpayment.paymentrecurtotal - recurringpayment.paymentrecurbalance)}</td>
                                            <td className="text-center">{money(recurringpayment.paymentrecurbalance)}</td>
                                            <td className="text-center">{date(recurringpayment.paymentrecurterminateddate, false)}</td>
                                            {/* <td>{payment?.paymentstatus}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
            }
        </div>
    </div>

}