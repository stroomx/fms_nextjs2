import React from 'react';
import Link from "next/link";
import initTranslations from '@/app/i18n';

export default async function Footer({ locale }) {

    const { t } = await initTranslations(locale);

    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 col-md-12">
                        <div className="text">
                            <p className="font-semibold">
                                {t('All Rights Reserved © Copyright 2024')}
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-12">
                        <div className="links">
                            <Link
                                className="text-blue font-semibold"
                                href=""
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
            </div>
        </footer>
    );
}