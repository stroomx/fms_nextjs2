'use client';

import axiosInstance from "@/axios";
import { useState } from "react";

export default function TeacherApplication({ franchise = { name: 'Testing Franchise' } }) {

    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const onSubmit = async () => {
        console.log(formData);

        formData.forEach((ele) => {
            ele.studentname = `${ele.studentfirstname} ${ele.studentlastname}`;
        });

        try {
            const result = await axiosInstance.post("api/students.php", { 'students': formData });
            console.log(result);
            fetchData();
            // buttonAction();
        } catch (err) {
            console.log(err);
        }
    }

    const t = (text) => text;
    return <>
        <div className="wrapper">
            <div className="container">
                <div className="main">
                    <div className="form-card">
                        <div className="flexed mb-4">
                            <img src="assets/img/teacher-logo.svg" alt="" />
                            <div>
                                <h4 className="font-bold  mb-2">{t('Apply For Teacher')}</h4>
                                <p className="font-bold">{t('Bricks 4 Kidz ') + franchise?.name}</p>
                            </div>
                        </div>
                        <form action="" onChange={handleChange}>
                            <h6 className="text-brown text-14 font-bold">{t('Personal Information')}</h6>
                            <div className="input-flex">
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('Applicant First Name')}
                                    </label>
                                    <input
                                        type="text"
                                        name="objectfirstname"
                                        className="input-style1"
                                        placeholder="Applicant First Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('Applicant Last Name')}
                                    </label>
                                    <input
                                        type="text"
                                        name="objectlastname"
                                        className="input-style1"
                                        placeholder="Applicant Last Name"
                                    />
                                </div>
                            </div>
                            <div className="input-flex">
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('Email Address')}
                                    </label>
                                    <input
                                        type="email"
                                        name="objectemail"
                                        className="input-style1"
                                        placeholder="Email Address"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('Contact Number')}
                                    </label>
                                    <input
                                        type="text"
                                        name="applicationmobilephone"
                                        className="input-style1"
                                        placeholder="Personal Contact Number"
                                    />
                                </div>
                            </div>
                            <div className="input-flex">
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('Alternate Contact Number')}
                                    </label>
                                    <input
                                        type="email"
                                        name="applicationsecondaryphone"
                                        className="input-style1"
                                        placeholder="Alternate Contact Number"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('Best Time To Contact')}
                                    </label>
                                    <input
                                        type="text"
                                        name="applicationbesttimetocall"
                                        className="input-style1"
                                        placeholder="Best Time To Contact"
                                    />
                                </div>
                            </div>
                            <h6 className="text-brown text-14 font-bold mt-4">
                                {t('Residential Address')}
                            </h6>
                            <div className="input-flex">
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('Street Name')}
                                    </label>
                                    <input
                                        type="text"
                                        name="addressstreet"
                                        className="input-style1"
                                        placeholder="Home , Apartment , Residential etc."
                                    />
                                </div>
                            </div>
                            <div className="input-flex">
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('City')}
                                    </label>
                                    <input
                                        type="email"
                                        name="addresscity"
                                        className="input-style1"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('Zip Code')}
                                    </label>
                                    <input
                                        type="email"
                                        name="addresszip"
                                        className="input-style1"
                                        placeholder="Zip Code"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="" className="mt-3">
                                        {t('State')}
                                    </label>
                                    <input
                                        type="text"
                                        name="addressstate"
                                        className="input-style1"
                                        placeholder="State"
                                    />
                                </div>
                            </div>
                            <h6 className="text-brown text-14 font-bold mt-4">{t('Attachment')}</h6>
                            <label htmlFor="" className="mt-3">
                                {t('Upload Resume')}
                            </label>
                            <div className="">
                                <div className="div">
                                    <div className="text-center icon">
                                        <i className="fa-solid fa-arrow-up-from-bracket" />

                                    </div>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        name="applicationresumefileid"
                                        onchange="displayFileName()"
                                        accept=".pdf, .doc, .docx, .txt"
                                    />
                                </div>
                            </div>
                            <button className="btn-style1 mt-3 w-100">{t('Submit')}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}