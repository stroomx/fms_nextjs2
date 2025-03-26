'use client';

import axiosInstance from '@/axios';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

export default function IzyicoPaymentForm({ authData, returnUrl = 'SANDBOX', paymentData = {} }) {
    const { t } = useTranslation();

    const [paymentUrl, setPaymentUrl] = useState('');

    const getPaymentUrl = () => {
        axiosInstance.post('/api/_iyzico.php', paymentData)
            .then((response) => {
                setPaymentUrl(response?.url);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getPaymentUrl();
    }, [paymentData]);

    return <>
        {
            paymentUrl && <>
                {paymentUrl}
            </>
        }
    </>;


}