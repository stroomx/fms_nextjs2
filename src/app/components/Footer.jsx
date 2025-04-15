import React from 'react';
import Link from "next/link";
import initTranslations from '@/app/i18n';

export default async function Footer({ locale }) {

    const { t } = await initTranslations(locale);

    return (
        <footer className="py-3 mt-auto">
            <div className="container">
                <div className="row align-items-center text-center text-md-start">
                    <div className="col-md-4 mb-2 mb-md-0">
                        <p className="mb-0 fw-semibold">
                            {t('All Rights Reserved © Copyright 2025')}
                        </p>
                    </div>

                    <div className="col-md-4 mb-2 mb-md-0">
                        <p className="mb-0 fw-semibold">
                            {t('Powered By © Technowland')}
                        </p>
                    </div>

                    <div className="col-md-4 d-flex flex-column flex-md-row justify-content-md-end gap-2">
                        <a
                            className="text-primary fw-semibold text-decoration-none"
                            href="https://www.bricks4kidz.com/about/contact-us/"
                        >
                            {t('Contact Us')}
                        </a>
                        <a
                            className="text-primary fw-semibold text-decoration-none"
                            href="https://bricks4kidz.us/privacy-policy/"
                        >
                            {t('Privacy Policy')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    );
}