import axiosInstance from "@/axios";
import { useEffect, useState } from "react"
import StripePaymentForm from "./StripePaymentForm";
import AuthorizePaymentForm from "./AuthorizePaymentForm";

import { useTranslation } from 'react-i18next';
import AuthorizePaymentFormHosted from "./AuthorizePaymentFormHosted";


export default function MerchantGateWay({ merchant_id, paymentData, cancelAction = () => { }, submitAction = () => { } }) {

    const [gateway, setgateway] = useState('');
    const fetchData = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/merchant.php?id=${merchant_id}`);
            setgateway(data);
        } catch (err) {
            console.log(err);
        }
    }

    const { t } = useTranslation();

    const showMerchant = () => {
        if (!gateway?.merchant)
            return '';

        switch (gateway?.merchant) {
            case 'stripe':
                return <StripePaymentForm paymentData={paymentData} cancelAction={cancelAction} />;
            case 'izyico':
                return <>{t('Izyico')}</>;
            case 'paypal':
                return <>{t('Paypal!')}</>;
            case 'authorizenet':
                return <AuthorizePaymentForm paymentData={paymentData} authData={{ apiLoginID: gateway?.apiKey, clientKey: gateway?.publicKey }} saveNonce={submitAction} />;
                // console.log(paymentData, 'pdata');
                // return <AuthorizePaymentFormHosted paymentData={paymentData} authData={{ apiLoginID: gateway?.apiKey, clientKey: gateway?.publicKey }} />;
            default:
                console.log(gateway?.merchant)
                return <>{t('Merchant not setup, please contact your system admin.')}</>;
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return <>
        <div>{showMerchant()}</div>
    </>
}