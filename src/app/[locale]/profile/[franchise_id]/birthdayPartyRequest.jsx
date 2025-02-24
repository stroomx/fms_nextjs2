export default function BirthdayPartyRequest({ franchise = { name: 'Testing Franchise' } }) {
    const t = (text) => text;
    return <>
        <div className="wrapper2">
            <div className="container">
                <div className="main">
                    <a href="parent-signed.html">
                        <img src="assets/img/cancel-button.svg" alt="" className="cancel-btn" />
                    </a>
                    <div className="form-card">
                        <div className="row">
                            <div className="col-4">
                                <div>
                                    <h4 className="font-bold  mb-2">{t('Birthday party Request')}</h4>
                                    <p className="font-bold">{'Bricks 4 Kidz ' + franchise?.name}</p>
                                </div>
                                <div className="img-party">
                                    <img src="assets/img/gift (1).svg" alt="" className="m-auto" />
                                </div>
                            </div>
                            <div className="col-8">
                                <form action="" className="">
                                    <div>
                                        <label htmlFor="" className="mt-3">
                                            Parent Name
                                        </label>
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            className="input-style1"
                                            placeholder="Parent Name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="mt-3">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            className="input-style1"
                                            placeholder="Mobile Number"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="mt-3">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name=""
                                            id=""
                                            className="input-style1"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                    <div className="input-flex">
                                        <div>
                                            <label htmlFor="" className="mt-3">
                                                Party Location
                                            </label>
                                            <select
                                                className="input-style1 wide"
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
                                        <label htmlFor="" className="mt-3">
                                            Requested Date
                                        </label>
                                        <input
                                            type="date"
                                            name=""
                                            id=""
                                            className="input-style1"
                                            placeholder="Requested Date"
                                        />
                                    </div>
                                    <div className="input-flex">
                                        <div>
                                            <label htmlFor="" className="mt-3">
                                                Time
                                            </label>
                                            <div className="time-format">
                                                <input
                                                    type="text"
                                                    name=""
                                                    id=""
                                                    className="input-style1"
                                                    placeholder="HH"
                                                />
                                                <span>:</span>
                                                <input
                                                    type="text"
                                                    name=""
                                                    id=""
                                                    className="input-style1"
                                                    placeholder="HH"
                                                />
                                                <span>:</span>
                                                <select
                                                    className="input-style1 wide"
                                                    aria-label="Default select example"
                                                >
                                                    <option selected="">AM</option>
                                                    <option value={1}>PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="" className="mt-3">
                                            Comment
                                        </label>
                                        <textarea
                                            name=""
                                            id=""
                                            cols={30}
                                            rows={5}
                                            placeholder="Write your comments.."
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end mt-3">
                                        <button className="btn btn-primary rounded-0">{t('Submit')}</button>
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