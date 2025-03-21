'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function CookieConsent() {

    const [cookie, setCookie] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCookie(Cookies.get('consent_cookie'));
        setLoading(false);
    }, [])

    const setBrowserCookie = (value) => {
        Cookies.set('consent_cookie', value);
        setCookie(Cookies.get('consent_cookie'));
    }

    return !loading && !cookie && <div className="fixed-bottom p-4">
        <div className="bg-light w-100 mw-100" data-autohide="false">
            <div className="container p-4 d-flex flex-column">
                <div className="text-center mb-3">
                    We use cookies to personalise content and ads, to provide social media features, and to analyse our traffic. We also share information about your use of our site with our social media, advertising, and analytics partners, who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.
                </div>
                <div className="d-flex justify-content-center align-items-center gap-3">
                    <button type="button" className="btn btn-outline-secondary rounded-0">
                        Terms and Privacy Policy
                    </button>
                    <button type="button" className="btn btn-outline-secondary rounded-0" onClick={() => { setBrowserCookie('basic') }}>
                        Only essential cookies
                    </button>
                    <button type="button" className="btn btn-success rounded-0" onClick={() => { setBrowserCookie('all') }}>
                        Allow all cookies
                    </button>
                </div>
            </div>
        </div>
    </div>;
}