import React from 'react';
import Link from "next/link";
import initTranslations from '@/app/i18n';

export default async function Footer({ locale }) {

    const { t } = await initTranslations(locale);

    return (
        <footer>
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="text">
                        <p className="font-semibold">
                            {t('All Rights Reserved © Copyright 2025')}
                        </p>
                    </div>

                    <div className="text">
                    <p className="font-semibold">
                            {t('Powered By © Technowland')}
                        </p>
                    </div>

                    <div className="links">
                        <Link
                            className="text-blue font-semibold"
                            href="https://www.bricks4kidz.com/about/contact-us/"
                        />
                        {t('Contact Us')}
                        <Link
                            className="text-blue font-semibold"
                            href=""
                        />
                        {t('Privacy Policy')}
                    </div>
                </div>
            </div>
        </footer>
    );
}