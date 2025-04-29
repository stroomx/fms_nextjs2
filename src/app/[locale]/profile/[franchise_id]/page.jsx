"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import axiosInstance from "@/axios";
import ScheduleCard from "./scheduleCard";
import SocialIcons from '@/app/components/SocialIcons';
import AuthService from "@/auth.service";
import MultiRangeSlider from "@/app/components/DualSlider";
import { useDebugTranslation } from "@/app/hooks/useDebugTranslation";

export default function FranchiseProfile({ params: { franchise_id } }) {

    const { t } = useDebugTranslation();

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const router = useRouter();

    const [clear, setClear] = useState(false);
    const [loading, setLoading] = useState(true);
    const [programs, setPrograms] = useState([]);
    const [ageRange, setAgeRange] = useState({});
    const [locations, setLocations] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [franchise, setFranchise] = useState(null);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [emailFormData, setEmailFormData] = useState({
        franchise: franchise_id
    });

    const [filterData, setFilterData] = useState({
        locations: searchParams.get('locations') ? searchParams.get('locations').split(',') : [],
        programs: searchParams.get('programs') ? searchParams.get('programs').split(',') : [],
        date: {
            start: searchParams.get('startdate') || '',
            end: searchParams.get('enddate') || ''
        },
        age: {
            min: 1,
            max: 16
        }
    });

    const scrollY = useRef(0);

    const handleFilterChange = (type, value, checked) => {
        setFilterData((prev) => {
            if (type === 'programs' || type === 'locations') {
                // Handle checkbox selection for programs and locations
                const updatedFilter = checked
                    ? [...prev[type], value]
                    : prev[type].filter((item) => item !== value);
                return { ...prev, [type]: updatedFilter };
            } else if (type === 'date') {
                // Handle date changes (start or end)
                return {
                    ...prev,
                    date: {
                        ...prev.date,
                        [value.name]: value.value
                    }
                };
            } else if (type === 'age') {
                // Handle age range change (min or max)
                return {
                    ...prev,
                    age: {
                        ...prev.age,
                        [value.type]: value.value
                    }
                };
            }
            return prev;
        });
    };

    const applyFilters = () => {
        const currentScrollY = scrollY.current;

        const { programs = [], locations = [], date = {}, age = {} } = filterData;
        const { start: startDate, end: endDate } = date;
        const { min: minAge, max: maxAge } = age;

        const filteredSchedules = schedules.filter((schedule) => {
            const programMatch = !programs.length || programs.includes(schedule.programid);
            const locationMatch = !locations.length || locations.includes(schedule.locationid);
            const dateMatch = (!startDate || schedule.startdate >= startDate) &&
                (!endDate || schedule.enddate <= endDate);
            const ageMatch = Number(schedule.minage) >= minAge && Number(schedule.maxage) <= maxAge;

            return programMatch && locationMatch && dateMatch && ageMatch;
        });

        const filterParams = new URLSearchParams(searchParams);

        if (programs.length) filterParams.set('programs', programs.join(','));
        if (locations.length) filterParams.set('locations', locations.join(','));
        if (startDate) filterParams.set('startdate', startDate);
        if (endDate) filterParams.set('enddate', endDate);

        const filterURI = filterParams.toString() ? `?${filterParams.toString()}` : '';

        replace(`${pathname}${filterURI}`);
        setFilteredSchedules(filteredSchedules);
        setTimeout(() => {
            window.scrollTo(0, currentScrollY);
        }, 300);
    };

    const clearFilters = () => {
        const currentScrollY = scrollY.current;

        setFilteredSchedules(schedules);
        setFilterData({
            locations: [],
            programs: [],
            date: {
                start: '',
                end: ''
            },
            age: {
                min: ageRange['min'],
                max: ageRange['max']
            }
        });
        setClear(true);
        setTimeout(() => {
            setClear(false);
        }, 1)

        replace(`${pathname}`);
        setTimeout(() => {
            window.scrollTo(0, currentScrollY);
        }, 300);
    }

    const silderChange = (min = 0, max = 0) => {
        // console.log(min, max, 'pre')
        if (max == 0)
            return;

        // console.log(
        //     { min: min, max: max }
        // )
        setFilterData({
            ...filterData, age: {
                min: min,
                max: max
            }
        });
    }

    const sendEmail = async (e) => {
        e.preventDefault();
        try {
            const obj = {
                franchise: 6209,
                email: 'ahmed@stroomx.com',
                body: 'HI THIS IS AN EMAIL FROM AHMED',
                subject: 'test email from UI',
                name: 'AHMED ABDELSALAM'
            };
            const { data } = await axiosInstance.post('api/sendmail.php', obj);
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }

    const enroll = (scheduleid, isWaitlist = false) => {
        if (AuthService.isAuthenticated()) {
            if (isWaitlist) {
                router.push(`/profile/${franchise_id}/${scheduleid}/waitlist`)
            } else {
                router.push(`/profile/${franchise_id}/${scheduleid}/checkout`)
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`api/profile.php?id=${franchise_id}`);
                setPrograms(response.data?.programs || []);
                setLocations(response.data?.locations || []);
                setAgeRange(response.data?.ageRange || { min: 1, max: 16 });
                setFilterData({ ...filterData, age: response.data?.ageRange });
                setSchedules(response.data?.schedules || []);
                setFranchise(response.data?.franchise);
                setFilteredSchedules(response.data?.schedules || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        const handleScroll = () => {
            scrollY.current = window.scrollY;
        };

        fetchData();

        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        applyFilters()
    }, [schedules]);


    return (
        <div className="program-cards p-0">
            {loading && <div className="loading-overlay">
                <div className="spinner"></div>
            </div>}

            <section>
                <div
                    className="banner"
                    style={{
                        backgroundImage: 'url(/assets/img/banner.png)'
                    }}
                >
                </div>
            </section>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12 company-details p-5" style={{ borderRadius: '0' }}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md col-sm-12 align-items-md-start align-items-center ps-md-0">
                                        <div className="text-md-start text-center font-bold fs-3 pb-1">{`Bricks 4 Kidz - ${franchise?.displayname ?? franchise?.name ?? ''}`}</div>
                                        <div className="text-md-start text-center font-semibold fs-5 pb-1">{franchise?.name}</div>
                                        <div className="text-md-start text-center fs-5">{franchise?.phone}</div>
                                    </div>
                                    <div className="col-md col-sm-12 d-flex justify-content-center flex-column align-items-md-end align-items-center">
                                        <div className="d-flex gap-1 details pt-4 pb-1">
                                            <button className='btn rounded-0 text-nowrap btn-outline-primary d-flex align-items-center gap-1' data-bs-toggle="modal" data-bs-target={`#email-us`}>
                                                <i className="mdi mdi-email-outline"></i>
                                                {t('Contact Us')}
                                            </button>
                                            <></>
                                            <button className='btn rounded-0 text-nowrap btn-outline-primary d-flex align-items-center gap-1'>
                                                <i className="mdi mdi-cake"></i>
                                                {t('Birthday Party Request')}
                                            </button>
                                        </div>
                                        <div className="d-flex gap-1 details pb-4">
                                            <button className='btn rounded-0 text-nowrap btn-outline-primary d-flex align-items-center gap-1' onClick={() => {
                                                router.push(`/profile/${franchise_id}/teacher`);
                                            }}>
                                                <i className="mdi mdi-human-male-board"></i>
                                                {t('Teacher Application')}
                                            </button>
                                            <a href={franchise?.website ? `https://${franchise['website']}` : "#"} target="_blank" className='btn rounded-0 text-nowrap btn-outline-primary d-flex align-items-center gap-1'>
                                                <i className="mdi mdi-web"></i>
                                                {t('Visit Our Website')}
                                            </a>
                                        </div>

                                        <div className="row d-block social-icons">
                                            {franchise?.twitter && <SocialIcons icon="x" href={franchise['twitter']}></SocialIcons>}
                                            {franchise?.youtube && <SocialIcons icon="youtube" href={franchise['youtube']}></SocialIcons>}
                                            {franchise?.facebook && <SocialIcons icon="facebook" href={franchise['facebook']}></SocialIcons>}
                                            {franchise?.linkedin && <SocialIcons icon="linkedin" href={franchise['linkedin']}></SocialIcons>}
                                            {franchise?.whatsapp && <SocialIcons icon="whatsapp" href={franchise['whatsapp']}></SocialIcons>}
                                            {franchise?.instagram && <SocialIcons icon="instagram" href={franchise['instagram']}></SocialIcons>}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 w-75" style={{ borderTop: "1px solid rgb(0,0,0, 0.1)", margin: "auto" }}></div>
                                {/* <div className="row mt-4 franchise-description"> */}
                                <div className="row mt-4" dangerouslySetInnerHTML={franchise?.description}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="email-us" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-0 d-flex justify-content-between align-items-center pb-0">
                                <h3 className="text-blue font-bold" id="modalLabel">{t('Contact Us')}</h3>
                                <i id="email-us-close" className="mdi mdi-close-circle text-primary fs-4 cursor-pointer" data-bs-dismiss="modal" aria-label="Close"></i>
                            </div>
                            <div className="modal-body pt-0">
                                <form onSubmit={sendEmail}>
                                    <div className="row">

                                        <div className='col-12 col-md-6'>
                                            <label className="required" htmlFor="name">
                                                {t('Name')}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="form-control rounded-0"
                                                required={true}
                                            />
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <label className="required" htmlFor="from">
                                                {t('Email')}
                                            </label>
                                            <input
                                                type="email"
                                                name="from"
                                                id="from"
                                                className="form-control rounded-0"
                                                required={true}
                                            />
                                        </div>
                                        <div className='col-12 mt-2'>
                                            <label className="required" htmlFor="subject">
                                                {t('Subject')}
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                id="subject"
                                                className="form-control rounded-0"
                                                required={true}
                                            />
                                        </div>
                                        <div className='col-12 mt-2'>
                                            <label className="required" htmlFor="body">
                                                {t('Email Body')}
                                            </label>
                                            <textarea
                                                type="text"
                                                name="body"
                                                id="body"
                                                rows={6}
                                                className="form-control rounded-0"
                                                required={true}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary w-100 rounded-0 mt-3">{t('Send Mail')}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="programs">
                    {schedules.length > 0 && <div className="container d-block d-lg-none p-0">
                        <div className="card rounded-0 mb-2 h-100">
                            <div className="row mb-3">
                                <div className="col-md-4 col-6">
                                    <div className="text-primary fw-bold mb-2">{t('Programs')}</div>
                                    <div className="checkbox-group">
                                        {
                                            programs?.map((ele, index) => (
                                                <div className="form-check" key={index}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={ele.id}
                                                        id={`programCheck-${index}`}
                                                        checked={filterData['programs'].includes(ele.id)}
                                                        onChange={(e) => handleFilterChange('programs', e.target.value, e.target.checked)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`programCheck-${index}`}>
                                                        {ele.name}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>


                                {/* <hr className="my-3 m-auto w-75 text-center" /> */}
                                <div className="col-md-4 col-6">
                                    <div className="text-primary fw-bold mb-2">{t('Locations')}</div>
                                    <div className="checkbox-group">
                                        {
                                            locations?.map((ele, index) => (
                                                <div className="form-check" key={index}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={ele.id}
                                                        id={`locationCheck-${index}`}
                                                        checked={filterData['locations'].includes(ele.id)}
                                                        onChange={(e) => handleFilterChange('locations', e.target.value, e.target.checked)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`locationCheck-${index}`}>
                                                        {ele.name}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                {/* <hr className="my-3 m-auto w-75 text-center" /> */}
                                <div className="col-md-4 col-12">
                                    <div className="text-primary fw-bold mb-2">{t('Date')}</div>
                                    <div className="title2">
                                        <div className="container-fluid">
                                            <div className="row g-2">
                                                <div className="col-12 col-md-2 d-flex justify-content-md-end align-items-center">
                                                    <label className="text-grey-200 mb-0">{t('Start')}</label>
                                                </div>
                                                <div className="col-12 col-md-10">
                                                    <input
                                                        type="date"
                                                        name="start"
                                                        className="form-control rounded-0 p-1"
                                                        value={filterData['date']['start'] ?? ''}
                                                        onChange={(e) =>
                                                            handleFilterChange('date', { name: 'start', value: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                <div className="col-12 col-md-2 d-flex justify-content-md-end align-items-center">
                                                    <label className="text-grey-200 mb-0">{t('End')}</label>
                                                </div>
                                                <div className="col-12 col-md-10">
                                                    <input
                                                        type="date"
                                                        name="end"
                                                        className="form-control rounded-0 p-1"
                                                        value={filterData['date']['end'] ?? ''}
                                                        onChange={(e) =>
                                                            handleFilterChange('date', { name: 'end', value: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* <hr className="my-3 m-auto w-75 text-center" /> */}
                                {/* <div>
                                    <div className="text-primary fw-bold mb-2">{t('Age')}
                                        <span className="fw-normal text-black ms-1">
                                            {`(${filterData?.age?.min} - ${filterData?.age?.max})`}
                                        </span>
                                    </div>

                                    {(ageRange['min'] && !clear) && <MultiRangeSlider
                                        min={ageRange['min']}
                                        max={ageRange['max']}
                                        changeFunction={silderChange}
                                    />}
                                </div> */}

                                {/* <hr className="my-3" /> */}
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary fw-bold w-100 rounded-0"
                                    onClick={applyFilters}
                                >
                                    {t('Apply Filters')}
                                </button>
                                <button className="btn btn-danger fw-bold rounded-0" onClick={clearFilters}>{t('Clear')}</button>
                            </div>
                        </div>
                    </div>}
                    <div className="program-cards">
                        <div className="container ps-md-0">
                            {schedules.length > 0 ?
                                <div className="row">
                                    <div className="col-md-3 d-none d-lg-block card rounded-0 mb-2 h-100">
                                        <div className="text-primary fw-bold mb-2">{t('Programs')}</div>
                                        <div className="checkbox-group">
                                            {
                                                programs?.map((ele, index) => (
                                                    <div className="form-check" key={index}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={ele.id}
                                                            id={`programCheck-${index}`}
                                                            checked={filterData['programs'].includes(ele.id)}
                                                            onChange={(e) => handleFilterChange('programs', e.target.value, e.target.checked)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`programCheck-${index}`}>
                                                            {ele.name}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <hr className="my-3 m-auto w-75 text-center" />
                                        <div className="text-primary fw-bold mb-2">{t('Locations')}</div>
                                        <div className="checkbox-group">
                                            {
                                                locations?.map((ele, index) => (
                                                    <div className="form-check" key={index}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={ele.id}
                                                            id={`locationCheck-${index}`}
                                                            checked={filterData['locations'].includes(ele.id)}
                                                            onChange={(e) => handleFilterChange('locations', e.target.value, e.target.checked)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`locationCheck-${index}`}>
                                                            {ele.name}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <hr className="my-3 m-auto w-75 text-center" />
                                        <div className="text-primary fw-bold mb-2">{t('Date')}</div>
                                        <div className="title2 container-flex">
                                            <div className="dates row">
                                                <div className="col-12 col-md-6">
                                                    <label className="text-grey-200">{t('Start')}</label>
                                                    <input
                                                        type="date"
                                                        name="start"
                                                        className="rounded-0 p-1 w-100"
                                                        value={filterData['date']['start'] ?? ''}
                                                        onChange={(e) => handleFilterChange('date', { name: 'start', value: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="text-grey-200">{t('End')}</label>
                                                    <input
                                                        type="date"
                                                        name="end"
                                                        value={filterData['date']['end'] ?? ''}
                                                        className="rounded-0 p-1 w-100"
                                                        onChange={(e) => handleFilterChange('date', { name: 'end', value: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {(ageRange['min'] && ageRange['max']) && <>
                                            <hr className="my-3 m-auto w-75 text-center" />
                                            <div className="text-primary fw-bold mb-2">{t('Age')} <span className="fw-normal text-black ms-1">{`(${filterData?.age?.min} - ${filterData?.age?.max})`}</span></div>

                                            {(ageRange['min'] && !clear) && <MultiRangeSlider
                                                min={ageRange['min']}
                                                max={ageRange['max']}
                                                changeFunction={silderChange}
                                            />}
                                        </>}

                                        <hr className="my-3" />
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-primary fw-bold w-100 rounded-0"
                                                onClick={applyFilters}
                                            >
                                                {t('Apply Filters')}
                                            </button>
                                            <button className="btn btn-danger fw-bold rounded-0" onClick={clearFilters}>{t('Clear')}</button>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-9 pe-0 overflow-y-auto">
                                        {filteredSchedules?.map((schedule) => <ScheduleCard franchise_id={franchise_id} schedule={schedule} buttonAction={enroll} key={schedule.id} />)}
                                        {!filteredSchedules.length > 0 &&
                                            <div className="card rounded-0 d-flex justify-content-center gap-3 align-items-center flex-column">
                                                <img src="/assets/img/Kid.png" alt="" />
                                                <span className="fs-3">{t('No Schedules Match The Filter')}</span>
                                            </div>

                                        }
                                    </div>
                                </div>
                                :
                                <div className="d-flex justify-content-center gap-5 align-items-center">
                                    <span className="fs-3">{t('No Available Schedules')}</span>
                                    <img src="/assets/img/Kid.png" alt="" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
};

