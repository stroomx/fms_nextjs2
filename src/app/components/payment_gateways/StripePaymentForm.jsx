'use client';
// components/StripePaymentForm.js
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axiosInstance from '@/axios';

const StripePaymentForm = ({ paymentData, mode = 'paymentintent', cancelAction = () => { } }) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [stripePublicKey, setStripePublicKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the client secret when the component mounts
        const fetchClientSecret = async () => {
            if (loading) {

                try {
                    const url =
                        mode === 'setupintent'
                            ? `/api/_paymentintent.php`
                            : `/api/_paymentintent.php`;

                    const { data } = await axiosInstance.post(url, paymentData);

                    if (data.status !== 'success') {
                        setError(data.error);
                        setLoading(false);
                        return;
                    }

                    setClientSecret(data.client_secret);
                    setStripePublicKey(data.public_key);
                    setLoading(false);

                } catch (err) {
                    setError('Error fetching client secret');
                    console.log(err);
                    setLoading(false);
                }
            }
        };

        fetchClientSecret();
    }, [paymentData, mode]);

    if (loading) {
        return <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className='text-danger'>{error}</div>;
    }

    return (
        <div id="popup-stripe-form">
            {clientSecret && <Elements stripe={loadStripe(stripePublicKey)} options={{ clientSecret }}>

                <PaymentForm mode={mode} students={paymentData['students']} return_url_params={paymentData['returnURL']} cancelAction={cancelAction} />
            </Elements>}
        </div>
    );
};

const PaymentForm = ({ mode, students, return_url_params = [], cancelAction = () => { } }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);


    const getReturnUrl = () => {
        let url = `${window.location.origin}/parent?`;

        return_url_params.forEach(ele => {
            url += `${ele['key']}=${ele['value']}&`;
        });


        return url;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            let result;

            if (mode === 'setupintent') {
                result = await stripe.confirmSetup({
                    elements,
                    redirect: 'if_required',
                });
            } else {
                result = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: return_url_params.length > 0 ? getReturnUrl() : `${window.location.origin}/parent?id=${students.join(',')}`,
                    },
                });
            }

            if (result.error) {
                setErrorMessage(result.error.message);
                setIsProcessing(false);
            } else {
                // Process result (send data back to parent window)
                const data = {
                    token: mode === 'setupintent' ? result.setupIntent.payment_method : result.paymentIntent.id,
                };
                if (window.opener) {
                    window.opener.postMessage(data, '*');
                    window.close();
                }
            }
        } catch (err) {
            setErrorMessage('An unexpected error occurred.' + err);
            setIsProcessing(false);
        }
    };

    return (
        <form id="popup-stripe-form" onSubmit={handleSubmit}>
            <div id={`stripelement`}>
                <PaymentElement />
            </div>
            {errorMessage && <div className="stripeccerroroutput text-danger mt-2">{errorMessage}</div>}
            <div className="d-flex justify-content-start align-items-center mt-3 gap-3">
                <button className='btn btn-success w-50 rounded-0' type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
                <button type='button' className="btn btn-danger w-50 rounded-0" onClick={cancelAction}>Cancel</button>
            </div>
        </form>
    );
};

export default StripePaymentForm;
