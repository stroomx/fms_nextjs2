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
import PrintContent from "@/app/components/PrintContent";


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
        const selectedFranchise = document.getElementById('franchise-selector')?.value;
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
            const franchises = {};

            schedules.forEach(obj => {
                if (obj.hasOwnProperty('franchiseId')) {
                    franchises[obj?.franchise] = { id: obj?.franchiseId, name: obj?.franchise, locationName: obj?.locationName };
                }
            });

            // console.log(franchises);
            return [...Object.values(franchises)];
        }


        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get('/api/enrollments.php');
                if (data?.schedules?.length > 0) {
                    const unactive = data?.schedules.map(ele => {
                        ele['isActive'] = false;
                        return ele;
                    })
                    // console.log(unactive)
                    setSchedules(unactive);
                    filterSchedules(unactive[0]?.franchiseId, unactive);
                    setFranchises(getFranchises(unactive));
                    setSelectedFranchise(unactive[0]?.franchiseId);
                    setLoading(false);
                    setTimeout(() => {
                        handleEnrollment(unactive);
                    }, 1000);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        const handleEnrollment = (schedules) => {
            const studentIds = searchParams.get('id')?.split(',');
            const status = searchParams.get('redirect_status');
            const paymentType = searchParams.get('enrollment');

            replace(pathname); // Removes the params from the URL

            switch (paymentType) {
                case 'enrollment':
                    if (status == 'failed')
                        alert({ message: t(`${studentIds?.length} student(s) enrollment failed.`) })
                    else
                        alert({ type: "success", message: t(`${studentIds?.length} student(s) successfully enrolled.`) })
                    break;
                default:
                    const enrollmentId = searchParams.get('eid');
                    const amount = searchParams.get('amount');
                    if (amount && enrollmentId)
                        handlePayment(enrollmentId, amount, status, schedules);
            }
        }

        const handlePayment = (enrollmentId, amount, status, schedules = []) => {
            // Find the schedule in schedules
            // Change the filter to the specific franchise
            // Open the modal for the schedule
            // Set the active state for the schedule
            // Show success or failure message

            console.log(enrollmentId, 'EID');
            const schedule = schedules.filter((ele) => ele.scheduleenrollid == enrollmentId)[0];
            console.log(schedule);
            setSelectedFranchise(schedule['franchiseId']);

            // while (loading) {
            //     setTimeout(() => { }, 5000)
            // }

            const button = document.getElementById(`modal-button-${schedule?.scheduleenrollid}`);
            console.log(button);
            button.click();

            // This can be handled as a switch that takes the status as a variable and then redirects to the checkout page again if the payment has failed.
            // Create a .php file to take the payment intent id along with the franchise id and send back the metadata for the population of the checkout page.
            // This can also be redirected to a middle man page, which takes the call back and determines where to redirect and what status to trigger.
            alert({ type: status == 'failed' ? "error" : "success", message: t(`Payment of ${amount} ${status == 'failed' ? "has failed." : "successfully made."}.`) });
        }

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
                        <div className="d-inline-flex gap-3 align-items-center">
                            {/* <p className="text-grey fs-6 font-bold">{t('Locations')}</p> */}
                            <select className="form-select rounded-0 max-content" id="franchise-selector" defaultValue={franchises[0] ?? null} onChange={selectFranchise}>
                                {franchises.map((franchise) =>
                                    <option value={franchise['id']} key={franchise['id']}>{franchise['locationName'] ?? franchise['name']}</option>
                                )}
                            </select>
                        </div>
                    }
                    <p className="text-grey fs-6 font-bold">{t('Student Enrollments')}</p>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="heading end">
                    <button className="btn btn-outline-secondary py-1 rounded-0" title={t('Toggle Grid View')} onClick={() => setToggleGridView(!toggleGridView)}>
                        <i className={`mdi ${toggleGridView ? "mdi-grid" : "mdi-list-box-outline"} fs-4 px-1`}></i></button>
                    <button className="btn btn-outline-primary rounded-0" onClick={enrollIntoClass}>
                        <i className="mdi mdi-plus"></i>
                        {t('Enroll In New Class')}
                    </button>
                    {/* <div className="input-wrap">
                        <i className="fa-solid fa-magnifying-glass text-grey-200" />
                        <input
                            type="Search"
                            className="input-style1"
                            placeholder="Search Programs"
                        />
                    </div> */}
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

        {(!loading && filteredSchedules?.length == 0) && <div className="text-center fs-3">
            {t('No Enrollments Found.')}
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
        <div className="card rounded-0">
            <div className="row">
                <div className="col-md-3">
                    {loading ? (
                        <Skeleton height={200} width={'100%'} />
                    ) : (
                        <img
                            className="align-self-center img-fluid"
                            height={'100%'}
                            width={'100%'}
                            //TODO Update from CDN
                            src={schedule.image ? schedule.image : "https://bricks4kidz.us/wp-content/themes/brickly/assets/images/img-wide.svg"}
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
                    <div className="card rounded-0" style={{ backgroundColor: '#D8FBFE', marginBottom: 'unset' }}>
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
                                {loading ? '' :
                                    <PrintContent icon='mdi-printer' text={t('Invoice')} index={index}>
                                        <Invoice enrollment={schedule} />
                                    </PrintContent>
                                }
                            </div>
                            <button id={`modal-button-${schedule.scheduleenrollid}`} className="btn-payment-summary rounded-0" data-bs-toggle="modal" onMouseOver={hoverAction} onClick={() => { toggle('open'); hoverAction() }}
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
            <div className="card d-flex flex-column rounded-0">
                <div className="mb-1 flex-shrink-0">
                    {loading ? (
                        <Skeleton height={200} width={'100%'} />
                    ) : (
                        <>
                            {!isImageLoaded && <Skeleton height={200} width={'100%'} />}
                            <img
                                className="align-self-center img-fluid"
                                //TODO Update from CDN
                                src={schedule.image ? schedule.image : "https://bricks4kidz.us/wp-content/themes/brickly/assets/images/img-wide.svg"}
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
                            {loading ? '' :
                                <PrintContent icon='mdi-printer' text={t('Invoice')} index={index}>
                                    <Invoice enrollment={schedule} />
                                </PrintContent>
                            }
                        </div>
                        <button className="btn-payment-summary rounded-0" data-bs-toggle="modal" onMouseOver={hoverAction}
                            data-bs-target={`#payment-modal-${index}`} onClick={() => { toggle('open'); hoverAction() }}>{t('Payments')}
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

    const handleSubmit = async () => {
        console.log(formData);
        try {
            const obj = {
                ...formData,
                // students: studentIds,
                paymentoption: 'online' //TODO Allow for other paymentoptions (Will come in factor when doing franchise admin side.)
            };
            const { data } = await axiosInstance.post(`api/newPayment.php`, obj);
            alert({ type: "success", message: data?.message });
            cancelPayment(); // Used to switch off the payment screen and go back to regular screen.
            fetchData(); // Used to refetch the data from the backend and show the new payment on screen.
        } catch (err) {
            const { response } = err;
            console.log(err);
            alert({ type: "error", message: response?.data?.message });
        }
    }

    const tokenEnroll = (token) => {
        console.log(token);
        setFormData({ ...formData, token: token });
    }

    useEffect(() => {
        if (!formData?.token)
            return;
        handleSubmit();
    }, [formData]);

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
            setNotes(data?.notes?.reverse());
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
                        {/* <div className="d-flex justify-content-between">
                            <p className="fs-5">{t('Extra?')}</p>
                            <p>Something Goes Here</p>
                        </div> */}
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
                                    value={formData['amount'] ?? 0}
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
            {showPayment() ? <>
                <div className="fs-4 mb-2 mt-0 align-items-start">{t('Amount To Be Paid is')} {money(formData?.amount)}</div>
                <MerchantGateWay merchant_id={schedule?.franchiseId} paymentData={{
                    ...formData, students: [schedule.studentId], returnURL: [
                        { key: 'eid', value: schedule.scheduleenrollid },
                        { key: 'amount', value: formData?.amount },
                    ]
                }} cancelAction={cancelPayment} submitAction={(token) => { tokenEnroll(token) }} />
            </> : <>
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
                                        {/* <td className="text-center">
                                            {t('Transaction#')}
                                        </td> */}
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
                                            {/* <td className="text-center"><TextWithToggle description={payment?.paymenttransactionno} maxLength={10} showtext={false} /></td> */}
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
                        <div className="container">
                            <h6 className="font-bold text-grey my-3">{t('Active Recurring Payment')}</h6>
                            {recurringPayments?.map(((recurringpayment, index) => (
                                !recurringpayment?.paymentrecurterminateddate && <div className="row shadow-sm" key={index}>
                                    <div className="col-md-6 py-4 px-3">
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <span className="font-bold ">{t('Start Date')}</span>
                                            <span className="fs-5 ">{date(recurringpayment?.paymentrecurstartdate, false)}</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <span className="font-bold ">{t('Frequency')}</span>
                                            <span className="fs-5 ">{recurringpayment?.paymentrecurfrequency.toUpperCase()}</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <span className="font-bold ">{t('Total Cost')}</span>
                                            <span className="fs-5 ">{money(recurringpayment?.paymentrecurtotal)}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 py-4 px-3">
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <span className="font-bold ">{t('Paid')}</span>
                                            <span className="fs-5 ">{money(recurringpayment?.paymentrecurtotal - recurringpayment?.paymentrecurbalance)}</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <span className="font-bold ">{t('Remaining')}</span>
                                            <span className="fs-5 ">{money(recurringpayment?.paymentrecurbalance)}</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <span className="font-bold ">{t('Next Payment')}</span>
                                            <span className="fs-5 ">{date(recurringpayment.nextPaymentDateUTC, false)}</span>
                                        </div>
                                    </div>

                                    {recurringpayment?.paymentrecurterminateddate &&
                                        <small className="text-end text-danger font-bold">
                                            {t('Terminated on:')} {date(recurringpayment?.paymentrecurterminateddate, false)}
                                        </small>}
                                </div>
                            )))}

                        </div>
                        <h6 className="font-bold text-grey my-3">{t('Terminated Recurring Payments')}</h6>
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

const Invoice = ({ enrollment }) => {
    const t = (t) => t
    const [invoice, setInvoice] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/invoice.php?eid=${enrollment?.scheduleenrollid}&fid=${enrollment?.franchiseId}&stid=${enrollment?.studentId}&sid=${enrollment?.id}`);
                setInvoice(data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchData(); //TODO Need to prevent auto load on page load need to wait for on hover event
    }, []);

    return <>
        <div className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between align-items-start">
                <div className="fs-1">
                    {/* //TODO Adjust the image path */}
                    <img src="https://fms3.bricks4kidznow.com/images/headerlogo.png" />
                </div>
                <div className="d-flex flex-column gap-1">
                    <b>{t('Invoice By')}:</b>
                    <p className="mb-0">{invoice?.franchise}</p>
                    <p className="mb-0">{invoice?.franchiseEmail}</p>
                    <p className="mb-0">{invoice?.franchisePhone}</p>
                    <p className="mb-0">{invoice?.franchiseStreet}</p>
                    <p className="mb-0">{`${invoice?.franchiseCity}, ${invoice?.franchiseState}, ${invoice?.franchiseZip}`}</p>
                    <p className="mb-0">{invoice?.franchiseCountry}</p>
                </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex flex-column gap-1">
                    <p className="mb-0"><b>{t('Invoice Number')}{': '}</b>{enrollment?.scheduleenrollid}</p>
                    {/* <b>{t('Student')}:</b> */}
                    <p className="mb-0"><b>{t('Student')}{': '}</b>{invoice?.studentName}</p>
                    {invoice?.studentUrl && <p className="mb-0"><b>{t('Registration ID')}{': '}</b>{invoice?.studentUrl}</p>}
                </div>
                <div className="d-flex flex-column gap-1">
                    <b>{t('Bill to')}:</b>
                    <p className="mb-0">{invoice?.familyName}</p>
                    <p className="mb-0">{invoice?.familyEmail}</p>
                    {invoice?.familyUrl && <p className="mb-0">{invoice?.familyUrl}</p>}
                    <div className="mb-0">
                        {invoice?.familyStreet && <p className="mb-0">{invoice?.familyStreet}</p>}
                        {invoice?.familyCity && invoice.familyState && <p className="mb-0">{`${invoice?.familyCity}, ${invoice?.familyState}, ${invoice?.familyZip}`}</p>}
                        {invoice?.familyCountry && <p className="mb-0">{invoice?.familyCountry}</p>}
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
                            <td className="text-center text-nowrap">{date('2024-12-22', false)}</td>
                            <td>{`Enrolled ${invoice?.studentName} into ${enrollment?.name}`}</td>
                            <td className="text-center">{money(invoice?.costdata?.proratedcost > 0 ? invoice?.costdata?.proratedcost : invoice?.costdata?.totalcost)}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="text-end" ><b>{t('Base Cost')}:</b></td>
                            <td className="text-center">{money(invoice?.costdata?.basecost)}</td>
                        </tr>
                        {invoice?.addons?.map((addon, index) => (
                            < tr key={index} >
                                <td colSpan={2} className="text-end"><b>{addon?.name}</b></td>
                                <td className="text-center">{money(addon?.cost)}</td>
                            </tr>
                        ))}
                        {invoice?.tax && <tr>
                            <td colSpan={2} className="text-end" ><b>{t(invoice?.taxlable)}:</b></td>
                            <td className="text-center">{money(invoice?.costdata?.taxfee)}</td>
                        </tr>}
                        <tr>
                            <td colSpan={2} className="text-end"><b>{t('Total Cost')}:</b></td>
                            <td className="text-center">{money(invoice?.costdata?.totalcostadjusted)}</td>
                        </tr>
                        {invoice?.costdata?.totalcostadjusted - invoice?.paidAmount > 0 && <tr>
                            <td colSpan={2} className="text-end"><b>{t('Balance')}:</b></td>
                            <td className="text-center">{money(invoice?.costdata?.totalcostadjusted - invoice?.paidAmount)}</td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div >
        {(invoice?.costdata?.totalcostadjusted - invoice?.paidAmount) <= 0 && <p className="fs-3">{t('Invoice Fully Paid')}</p>}
    </>
}