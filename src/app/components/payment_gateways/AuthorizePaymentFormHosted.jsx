'use client';

import axiosInstance from '@/axios';
import { useEffect, useState } from 'react';
import { AcceptHosted } from 'react-acceptjs';



export default function AuthorizePaymentFormHosted({ authData, environment = 'SANDBOX', paymentData = {} }) {

    const t = (text) => text;

    const [formToken, setFormToken] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axiosInstance.post('/api/_authorizeForm.php', { "auth": authData, "payment": paymentData, "enviroment": environment, "franchise": 6209 });
                setFormToken(data?.token);
                console.log(data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, []);

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