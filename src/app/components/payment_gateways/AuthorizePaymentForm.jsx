'use client';

import { useState } from 'react';
import Script from 'next/script';
import { HostedForm } from 'react-acceptjs';


export default function AuthorizePaymentForm({ authData, environment = 'SANDBOX', paymentData = {}, saveNonce = () => { } }) {

    const [card, setCard] = useState(false);

    const handleSubmit = (response) => {
        // Write a function that takes the payment details along with the payment amount and submits it to the backend for it to be charged.
        // Await the response and then redirect to the main page.
        // Look at what can be done to move the amount calculation to the backend, to prevent changing of the amount to be charged.

        // console.log('Received response:', response); // This will include the Payment Nonce
        saveNonce(response['opaqueData']['dataValue']);
        setCard(response?.messages?.message[0]?.text ? true : false);
    };

    const t = (text) => text;

    return <>
        <HostedForm
            authData={authData}
            onSubmit={handleSubmit}
            environment={environment}
            billingAddressOptions={{ show: true, required: false }}
            buttonText={t('Proceed to Payment')}
            formButtonText={t('Make Payment')}
            formHeaderText={t('Input Card Details')}
            buttonStyle={{
                width: '100%',
                color: 'white',
                textAlign: 'center',
                fontSize: '1.25rem',
                padding: '0.5rem 1rem',
                display: 'inline-block',
                backgroundColor: '#198754',
            }}
            errorTextStyle={{ color: 'red' }}
        />
        {
            environment == 'SANDBOX' ?
                <Script src={"https://jstest.authorize.net/v3/AcceptUI.js" + '?' + (new Date()).getTime()} />
                : <Script src={"https://js.authorize.net/v3/AcceptUI.js" + '?' + (new Date()).getTime()} />
        }
        {card && <p className="text-success">{t('Card Successfully Added')}</p>}
    </>;


}