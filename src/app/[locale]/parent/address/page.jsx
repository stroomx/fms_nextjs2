'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axios';
import Skeleton from 'react-loading-skeleton';

export default function ParentAddress() {
    const [formStatus, setFormStatus] = useState(true);
    const [formData, setFormData] = useState({
        addressid: '',
        addresszip: '',
        addresscity: '',
        addressstate: '',
        addressstreet: '',
        addresscountryid: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/api/parentaddress.php');
            console.log(data);
            setFormData({
                addressid: data?.address.addressid ?? '',
                addresszip: data?.address.addresszip ?? '',
                addresscity: data?.address.addresscity ?? '',
                addressstate: data?.address.addressstate ?? '',
                addressstreet: data?.address.addressstreet ?? '',
                addresscountryid: data?.address.addresscountryid ?? ''
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        try {
            const { data } = await axiosInstance.post('/api/parentaddress.php', formData);
            console.log(data, 'response');
            setFormStatus(true);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const t = (e) => e;

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="home-section mt-4">
            <div className="card mb-5">
                <div className="parent-info pb-4 p-2 border-0">
                    <div className="title">
                        <h6 className="text-grey font-bold">{t('Address')}</h6>
                        <div className="flexed text-blue">
                            <img src="/assets/img/pencil.svg" alt="Edit Address" />
                            <p
                                className="text-14 font-semibold cursor-pointer"
                                onClick={() => setFormStatus(false)}
                            >{t('Edit Address')}</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-flex">
                            <div>
                                <label htmlFor="addressstreet" className="mt-3">{t('Street Address')}</label>
                                {!loading ? (
                                    <input
                                        type="text"
                                        name="addressstreet"
                                        id="addressstreet"
                                        className="input-style1 rounded-0"
                                        value={formData.addressstreet}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                    />
                                ) : (
                                    <Skeleton height={40} count={1} />
                                )}
                            </div>
                        </div>
                        <div className="input-flex">
                            <div>
                                <label htmlFor="addresscity" className="mt-3">{t('City')}</label>
                                {!loading ? (
                                    <input
                                        type="text"
                                        name="addresscity"
                                        id="addresscity"
                                        className="input-style1 rounded-0"
                                        value={formData.addresscity}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                    />
                                ) : (
                                    <Skeleton height={40} count={1} />
                                )}
                            </div>
                            <div>
                                <label htmlFor="addresszip" className="mt-3">{t('Zip Code')}</label>
                                {!loading ? (
                                    <input
                                        type="text"
                                        name="addresszip"
                                        id="addresszip"
                                        className="input-style1 rounded-0"
                                        value={formData.addresszip}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                    />
                                ) : (
                                    <Skeleton height={40} count={1} />
                                )}
                            </div>
                        </div>
                        <div className="input-flex">
                            <div>
                                <label htmlFor="addresscountryid" className="mt-3">{t('Country')}</label>
                                {!loading ? (
                                    <input
                                        type="text"
                                        name="addresscountryid"
                                        id="addresscountryid"
                                        className="input-style1 rounded-0"
                                        value={formData.addresscountryid}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                    />
                                ) : (
                                    <Skeleton height={40} count={1} />
                                )}
                            </div>
                            <div>
                                <label htmlFor="addressstate" className="mt-3">{t('State')}</label>
                                {!loading ? (
                                    <input
                                        type="text"
                                        name="addressstate"
                                        id="addressstate"
                                        className="input-style1 rounded-0"
                                        value={formData.addressstate}
                                        onChange={handleChange}
                                        disabled={formStatus}
                                    />
                                ) : (
                                    <Skeleton height={40} count={1} />
                                )}
                            </div>
                        </div>
                        {
                            !formStatus &&
                            <button type="submit" className="btn btn-primary mt-3 rounded-0">
                                {t('Save Changes')}
                            </button>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}
