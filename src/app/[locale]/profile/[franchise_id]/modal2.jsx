'use client';

import { useState } from "react";

import { ScheduleCard } from "./page";
import EmbeddedLogin from "@/app/[locale]/auth/login/embedded";
import { useTranslation } from "react-i18next";

export default function Modal2({ schedule, closeModal = () => { } }) {

    // 
    const isLoggedIn = true;

    const [step, setStep] = useState('enroll');

    const close = () => {
        closeModal(null);
    }

    const viewContent = () => {
        switch (step) {
            case 'login':
                return <EmbeddedLogin></EmbeddedLogin>;
            case 'enroll':
                return <ScheduleCard schedule={schedule} modal={true} buttonAction={isLoggedIn ? onSelectStudents : onLogin} />;
            case 'selectStudents':
                return <StudentSelection />;
            default:
                close();
        }
    }

    const onLogin = () => setStep('login');
    const onSelectStudents = () => setStep('selectStudents');

    return (
        <>
            <div className="modal fade" id="select-shedule" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content ">
                        <div className="modal-header border-0">
                            <h5 className="font-bold text-blue" id="exampleModalLabel">Select Student for Schedule</h5>
                            <img src="/assets/img/cancel-btn.svg" alt data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            {viewContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


function StudentSelection({ buttonAction = () => { } }) {

    const { t } = useTranslation();
    const students = [];

    return <>
        <div>
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <div>
                                <h6 className="text-14 font-semibold">Jhon Doe</h6>
                                <span className="text-grey">|</span>
                                <p className="text-14 text-grey">10/10/2023</p>
                                <span className="text-grey">|</span>
                                <p className="text-14 text-grey">Grade 2</p>
                                <img src="assets/img/check-red.svg" alt />
                            </div>
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div className="accordion-body small-select">
                            <div className="inputs">
                                <div className="flexed">
                                    <p className="text-14 text-grey-200">Pick Up : </p>
                                    <select className="right">
                                        <option data-display="Select">Nothing</option>
                                        <option value={1}>Some option</option>
                                        <option value={2}>Another option</option>
                                        <option value={3}>A disabled option</option>
                                        <option value={4}>Potato</option>
                                    </select>
                                </div>
                                <div className="flexed">
                                    <p className="text-14 text-grey-200">Person Authorized to Pick Up : </p>
                                    <input type="text" placeholder="John Doe" />
                                </div>
                                <div className="pen-icon">
                                    <img src="assets/img/pencil.svg" alt />
                                </div>
                            </div>
                            <div className="line" />
                            <h6 className="text-14 text-grey font-bold mb-2">Program Add Ons</h6>
                            <div className="check-group">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" defaultChecked />
                                    <label className="form-check-label mt-2" htmlFor="flexCheckDefault">
                                        <p className="text-12">Extra half hour <span className="text-grey-200 text-12">(Required)</span> <span className="text-green text-12 font-bold">$10</span></p>
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" />
                                    <label className="form-check-label mt-2" htmlFor="flexCheckChecked">
                                        <p className="text-12"> Hellium Latex Balloon <span className="text-green text-12 font-bold">$10</span></p>
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" />
                                    <label className="form-check-label mt-2" htmlFor="flexCheckChecked">
                                        <p className="text-12">Lego Candles <span className="text-green text-12 font-bold">$10</span></p>
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" />
                                    <label className="form-check-label mt-2" htmlFor="flexCheckChecked">
                                        <p className="text-12"> Bricks 4 Kidz Goody Bags <span className="text-green text-12 font-bold">$10</span></p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <div>
                                <h6 className="text-14 font-semibold">Jhon Doe</h6>
                                <span className="text-grey">|</span>
                                <p className="text-14 text-grey">10/10/2023</p>
                                <span className="text-grey">|</span>
                                <p className="text-14 text-grey">Grade 2</p>
                                <img src="assets/img/check-grey.svg" alt />
                            </div>
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body small-select">
                            <div className="inputs">
                                <div className="flexed">
                                    <p className="text-14 text-grey-200">Pick Up : </p>
                                    <select className="right">
                                        <option data-display="Select">Nothing</option>
                                        <option value={1}>Some option</option>
                                        <option value={2}>Another option</option>
                                        <option value={3}>A disabled option</option>
                                        <option value={4}>Potato</option>
                                    </select>
                                </div>
                                <div className="flexed">
                                    <p className="text-14 text-grey-200">Person Authorized to Pick Up : </p>
                                    <input type="text" placeholder="John Doe" />
                                </div>
                                <div className="pen-icon">
                                    <img src="assets/img/pencil.svg" alt />
                                </div>
                            </div>
                            <div className="line" />
                            <h6 className="text-14 text-grey font-bold mb-2">Program Add Ons</h6>
                            <div className="check-group">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" defaultChecked />
                                    <label className="form-check-label mt-2" htmlFor="flexCheckDefault">
                                        <p className="text-12">Extra half hour <span className="text-grey-200 text-12">(Required)</span> <span className="text-green text-12 font-bold">$10</span></p>
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" />
                                    <label className="form-check-label mt-2" htmlFor="flexCheckChecked">
                                        <p className="text-12"> Hellium Latex Balloon <span className="text-green text-12 font-bold">$10</span></p>
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" />
                                    <label className="form-check-label mt-2" htmlFor="flexCheckChecked">
                                        <p className="text-12">Lego Candles <span className="text-green text-12 font-bold">$10</span></p>
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" />
                                    <label className="form-check-label mt-2" htmlFor="flexCheckChecked">
                                        <p className="text-12"> Bricks 4 Kidz Goody Bags <span className="text-green text-12 font-bold">$10</span></p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="buttons mt-5">
                <a href="add-student.html">
                    <div className="flexed cursor-pointer">
                        <img src="assets/img/add-button-red.svg" alt height={15} />
                        <p className="text-brown font-semibold text-14">Add Another Student</p>
                    </div>
                </a>
                <button className="btn-style4">Add to Cart</button>
                <a href="checkout.html"> <button className="btn-style1">Proceed to Checkout</button></a>
            </div>
        </div>
    </>
}


