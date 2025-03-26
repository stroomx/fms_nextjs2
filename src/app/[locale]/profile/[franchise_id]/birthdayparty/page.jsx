'use client';

import { useTranslation } from 'react-i18next';

export default function BirthdayPartyRequest({ franchise = { name: 'Testing Franchise' } }) {
    const { t } = useTranslation();
    return <>
        <div className="wrapper2">
            <div className="container">
                <div className="main">
                    <a href="parent-signed.html">
                        <img src="assets/img/cancel-button.svg" alt="" className="cancel-btn" />
                    </a>
                    <div className="form-card rounded-0">
                        <div className="row">
                            <div className="col-4">
                                <div>
                                    <h4 className="font-bold  mb-2">{t('Birthday Party Request')}</h4>
                                    <p className="font-bold">{'Bricks 4 Kidz ' + franchise?.name}</p>
                                </div>
                                <div className="img-party">
                                    <img src="assets/img/gift(1).svg" alt="" className="m-auto" />
                                </div>
                            </div>
                            <div className="col-8">
                                <form action="" className="">
                                    <div>
                                        <label htmlFor="" className="mt-3 required">
                                            {t('Parent Name')}
                                        </label>
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            className="input-style1 rounded-0"
                                            placeholder={t('Parent Name')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="mt-3 required">
                                            {t('Mobile Number')}
                                        </label>
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            className="input-style1 rounded-0"
                                            placeholder={t('Mobile Number')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="mt-3 required">
                                            {t('Email Address')}
                                        </label>
                                        <input
                                            type="email"
                                            name=""
                                            id=""
                                            className="input-style1 rounded-0"
                                            placeholder={t('Email Address')}
                                        />
                                    </div>
                                    <div className="input-flex">
                                        <div>
                                            <label htmlFor="" className="mt-3 required">
                                                {t('Zip Code')}
                                            </label>
                                            <select
                                                className="input-style1 rounded-0 wide"
                                                aria-label="Default select example"
                                            >
                                                <option selected="">Open this select menu</option>
                                                <option value={1}>One</option>
                                                <option value={2}>Two</option>
                                                <option value={3}>Three</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="" className="mt-3 required">
                                            {t('Requested Date')}
                                        </label>
                                        <input
                                            type="date"
                                            name=""
                                            id=""
                                            className="input-style1 rounded-0"
                                            placeholder={t('Requested Date')}
                                        />
                                    </div>
                                    <div className="input-flex">
                                        <div>
                                            <label htmlFor="" className="mt-3 required">
                                                {t('Time')}
                                            </label>
                                            <input
                                                type="time"
                                                name="schedulerequesttime"
                                                id="schedulerequesttime"
                                                className="input-style1 rounded-0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="" className="mt-3 required">
                                            {t('Comment')}
                                        </label>
                                        <textarea
                                            name=""
                                            id=""
                                            cols={30}
                                            rows={5}
                                            placeholder={t('Write your comments..')}
                                            defaultValue={""}
                                            className="rounded-0"
                                        />
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end mt-3">
                                        <button className="btn btn-primary flex-grow-1 rounded-0">{t('Submit')}</button>
                                        <button className="btn btn-danger rounded-0">{t('Cancel')}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

// guardianname: Ahmed
// phonenumber: Adi
// objectemail: ahmed@b4k.com
// addresszip: 11111
// schedulerequestdate: 03/19/2025
// schedulerequesttime: 23:12:00
// schedulerequestcomment: qewrds
// franchiseid: 6209
// container: 1
// submit: save
// save: Submit