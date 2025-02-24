'use client';

import axiosInstance from '@/axios';
import { useEffect, useState } from 'react';

export default function IzyicoPaymentForm({ authData, returnUrl = 'SANDBOX', paymentData = {} }) {
    const t = (text) => text;

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