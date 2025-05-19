'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@/axios';
import { useRouter } from 'next/navigation';
import alert from '@/app/components/SweetAlerts';

export default function BirthdayPartyRequest({ params: { franchise_id } }) {
    const { t } = useTranslation();
    const router = useRouter();

    const [franchise, setFranchise] = useState('');

    const [formData, setFormData] = useState({
        guardianname: '',
        phonenumber: '',
        objectemail: '',
        addresszip: '',
        schedulerequestdate: '',
        schedulerequesttime: '',
        schedulerequestcomment: '',
        franchiseid: franchise_id,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
        setLoading(true);

        try {
            const { data } = await axiosInstance.post('/api/birthdayRequest.php', formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            alert({ type: 'success', message: data?.message || t('Request submitted successfully!') });
            setFormData({
                guardianname: '',
                phonenumber: '',
                objectemail: '',
                addresszip: '',
                schedulerequestdate: '',
                schedulerequesttime: '',
                schedulerequestcomment: '',
                franchiseid: franchise.id,
            });
        } catch (err) {
            const msg = err?.response?.data?.message || t('Something went wrong.');
            alert({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper2">
            <div className="container">
                <div className="main">
                    <div className="form-card rounded-0">
                        <div className="row">
                            <div className="col-4">
                                <h4 className="font-bold mb-2">{t('Birthday Party Request')}</h4>
                                <p className="font-bold">{'Bricks 4 Kidz ' + franchise?.franchiselocationdisplay}</p>
                                <div className="img-party">
                                </div>
                            </div>
                            <div className="col-8">
                                <form onSubmit={onSubmit}>
                                    <div>
                                        <label className="mt-3 required">{t('Parent Name')}</label>
                                        <input
                                            type="text"
                                            name="guardianname"
                                            value={formData.guardianname}
                                            onChange={handleChange}
                                            className="input-style1 rounded-0"
                                            placeholder={t('Parent Name')}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mt-3 required">{t('Mobile Number')}</label>
                                        <input
                                            type="text"
                                            name="phonenumber"
                                            value={formData.phonenumber}
                                            onChange={handleChange}
                                            className="input-style1 rounded-0"
                                            placeholder={t('Mobile Number')}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mt-3 required">{t('Email Address')}</label>
                                        <input
                                            type="email"
                                            name="objectemail"
                                            value={formData.objectemail}
                                            onChange={handleChange}
                                            className="input-style1 rounded-0"
                                            placeholder={t('Email Address')}
                                            required
                                        />
                                    </div>
                                    <div className="input-flex">
                                        <div>
                                            <label className="mt-3 required">{t('Zip Code')}</label>
                                            <input
                                                type="text"
                                                name="addresszip"
                                                value={formData.addresszip}
                                                onChange={handleChange}
                                                className="input-style1 rounded-0"
                                                placeholder={t('Zip Code')}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mt-3 required">{t('Requested Date')}</label>
                                        <input
                                            type="date"
                                            name="schedulerequestdate"
                                            value={formData.schedulerequestdate}
                                            onChange={handleChange}
                                            className="input-style1 rounded-0"
                                            required
                                        />
                                    </div>
                                    <div className="input-flex">
                                        <div>
                                            <label className="mt-3 required">{t('Time')}</label>
                                            <input
                                                type="time"
                                                name="schedulerequesttime"
                                                value={formData.schedulerequesttime}
                                                onChange={handleChange}
                                                className="input-style1 rounded-0"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mt-3 required">{t('Comment')}</label>
                                        <textarea
                                            name="schedulerequestcomment"
                                            value={formData.schedulerequestcomment}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder={t('Write your comments..')}
                                            className="input-style1 rounded-0"
                                            required
                                        />
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end mt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-grow-1 rounded-0"
                                            disabled={loading}
                                        >
                                            {loading ? t('Submitting...') : t('Submit')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="btn btn-danger rounded-0"
                                        >
                                            {t('Cancel')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
