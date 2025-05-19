'use client';

import axiosInstance from "@/axios";
import { useEffect, useState } from "react";
import alert from '@/app/components/SweetAlerts';
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';

export default function TeacherApplication({ params: { franchise_id } }) {

    const [franchise, setFranchise] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/franchise.php?id=${franchise_id}`);
                setFranchise(data);
            } catch (err) {
                const { response } = err;
                alert({ type: "error", message: response?.data });
            }
        };
        fetchData();
    }, [franchise_id]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // 👈 Disable button

        const form = e.target;
        const formData = new FormData(form);

        formData.set('objectparentid', franchise_id);
        if (!formData.get('applicationresumefileid')) {
            formData.set('applicationresumefileid', 'NA');
        }

        try {
            const { data } = await axiosInstance.post("api/teacherApplication.php", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert({ type: "success", message: data?.message });
            form.reset();
            router.push(`/profile/${franchise_id}`);
        } catch (err) {
            const { response } = err;
            alert({ type: "error", message: response?.data?.message });
        } finally {
            setLoading(false); // 👈 Re-enable button
        }
    };


    return (
        <>
            {!franchise && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="wrapper">
                <div className="container">
                    <div className="form-card rounded-0">
                        <div className="flexed mb-4">
                            <img src="assets/img/teacher-logo.svg" alt="" />
                            <div className="text-center">
                                <h4 className="font-bold">{t('Apply For Teacher')}</h4>
                                <p className="font-bold">
                                    {t('Bricks 4 Kidz ') + franchise?.franchiselocationdisplay}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={onSubmit}>
                            <h6 className="text-brown font-bold">{t('Personal Information')}</h6>
                            <div className="input-flex">
                                <div>
                                    <label className="mt-3 required">{t('Applicant First Name')}</label>
                                    <input
                                        type="text"
                                        name="objectfirstname"
                                        className="input-style1 rounded-0"
                                        placeholder="Applicant First Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mt-3 required">{t('Applicant Last Name')}</label>
                                    <input
                                        type="text"
                                        name="objectlastname"
                                        className="input-style1 rounded-0"
                                        placeholder="Applicant Last Name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-flex">
                                <div>
                                    <label className="mt-3 required">{t('Email Address')}</label>
                                    <input
                                        type="email"
                                        name="objectemail"
                                        className="input-style1 rounded-0"
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mt-3 required">{t('Contact Number')}</label>
                                    <input
                                        type="text"
                                        name="phonenumber"
                                        className="input-style1 rounded-0"
                                        placeholder="Personal Contact Number"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-flex">
                                <div>
                                    <label className="mt-3 required">{t('Alternate Contact Number')}</label>
                                    <input
                                        type="text"
                                        name="applicationsecondaryphone"
                                        className="input-style1 rounded-0"
                                        placeholder="Alternate Contact Number"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mt-3 required">{t('Best Time To Contact')}</label>
                                    <input
                                        type="time"
                                        name="applicationbesttimetocall"
                                        className="input-style1 rounded-0"
                                        placeholder="Best Time To Contact"
                                        required
                                    />
                                </div>
                            </div>

                            <h6 className="text-brown font-bold mt-4">{t('Residential Address')}</h6>
                            <div className="input-flex">
                                <div>
                                    <label className="mt-3 required">{t('Street Name')}</label>
                                    <input
                                        type="text"
                                        name="addressstreet"
                                        className="input-style1 rounded-0"
                                        placeholder="Home , Apartment , Residential etc."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-flex">
                                <div>
                                    <label className="mt-3 required">{t('City')}</label>
                                    <input
                                        type="text"
                                        name="addresscity"
                                        className="input-style1 rounded-0"
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mt-3 required">{t('Zip Code')}</label>
                                    <input
                                        type="text"
                                        name="addresszip"
                                        className="input-style1 rounded-0"
                                        placeholder="Zip Code"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mt-3 required">{t('State')}</label>
                                    <input
                                        type="text"
                                        name="addressstate"
                                        className="input-style1 rounded-0"
                                        placeholder="State"
                                        required
                                    />
                                </div>
                            </div>

                            <h6 className="text-brown font-bold mt-4">{t('Attachment')}</h6>
                            <label className="mt-3">{t('Upload Resume')}</label>
                            <div>
                                <div className="text-center icon">
                                    <i className="fa-solid fa-arrow-up-from-bracket" />
                                </div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    name="applicationresumefileid"
                                    accept=".pdf, .doc, .docx, .txt"
                                />
                            </div>

                            <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
                                <button className="btn btn-primary rounded-0" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                            {t('Submitting...')}
                                        </>
                                    ) : t('Submit')}
                                </button>
                                <button
                                    type='button'
                                    onClick={() => router.push(`/profile/${franchise_id}`)}
                                    className="btn btn-danger rounded-0"
                                >
                                    {t('Cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
