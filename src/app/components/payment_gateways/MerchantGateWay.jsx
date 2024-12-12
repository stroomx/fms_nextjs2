import axiosInstance from "@/axios";
import { useEffect, useState } from "react"
import StripePaymentForm from "./StripePaymentForm";

export default function MerchantGateWay({ merchant_id, paymentData, cancelAction = () => { } }) {

    const [gateway, setgateway] = useState('');
    const fetchData = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/merchant.php?id=${merchant_id}`);
            console.log(data);
            setgateway(data);
        } catch (err) {
            console.log(err);
        }
    }

    const t = (t) => t;

    const showMerchant = () => {
        if (!gateway?.merchant)
            return '';

        switch (gateway?.merchant) {
            case 'stripe':
                console.log('stripe!');
                return <StripePaymentForm paymentData={paymentData} cancelAction={cancelAction} />;
            case 'izyico':
                return <>{t('Izyico')}</>;
            case 'paypal':
                return <>{t('Paypal!')}</>;
            case 'authorize':
                return <>{t('Authorize!')}</>;
            default:
                return <>{t('Merchant not setup, please contact your system admin.')}</>;
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return <>
        {/* {!gateway && <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>} */}
        <div>{showMerchant()}</div>
    </>
}