'use client';

import axiosInstance from '@/axios';
import { useEffect, useState } from 'react';
import { AcceptHosted } from 'react-acceptjs';

import { useTranslation } from 'react-i18next';

export default function AuthorizePaymentFormHosted({ authData, environment = 'SANDBOX', paymentData = {} }) {

    const { t } = useTranslation();

    const [formToken, setFormToken] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.post('/api/_authorizeForm.php', { "auth": authData, "payment": paymentData, "enviroment": environment, "franchise": 6209 });
                setFormToken(data?.token);
                console.log(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    return formToken ? (
        <AcceptHosted formToken={formToken} integration="redirect">
            {t('Proceed to Payment2')}
        </AcceptHosted>
    ) : (
        <div>
            You must have a form token. Have you made a call to the
            getHostedPaymentPageRequestAPI?
        </div>
    );
};