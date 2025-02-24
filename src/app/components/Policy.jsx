'use client'

import { useEffect, useState } from "react";

export default function Policy({ policies, action = (acceptedPolicies) => { console.log(acceptedPolicies) } }) {

    const t = (t) => t;
    const [acceptedPolicies, setAcceptedPolicies] = useState(0);

    useEffect(() => {
        action(acceptedPolicies)
    }, [acceptedPolicies]);

    const handleChange = (e) => {
        const { checked } = e.target;

        const newValue = checked ? 1 : -1;

        setAcceptedPolicies(acceptedPolicies + newValue);
    };

    // useEffect(() => {
    //     setAcceptedPolicies(policies?.length);
    // }, [policies]);

    return <>
        <div className="check-group">
            {policies?.map((policy, index) => <div key={index}>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id={`policy-${index}`} onChange={handleChange} required />
                    <label className="form-check-label">
                        {t('I accept')} <span
                            className="text-blue cursor-pointer"
                            id={`policy-content-toggle-${index}`}
                            data-bs-toggle="modal"
                            data-bs-target={`#policy-content-${index}`}
                        >{policy?.policytitle}</span>
                    </label>
                </div>
                <div className="modal fade" id={`policy-content-${index}`} aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content ">
                            <div className="modal-header border-0 d-flex justify-content-between align-items-center ">
                                <p className="font-bold text-blue fs-5" id="modalLabel">{policy?.policytitle}</p>
                                <i className="mdi mdi-close" data-bs-dismiss="modal" aria-label="Close"></i>
                            </div>
                            <div className="modal-body pt-0" dangerouslySetInnerHTML={{ __html: policy?.policy }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    </>;
}