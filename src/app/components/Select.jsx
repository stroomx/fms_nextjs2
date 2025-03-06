import { useEffect, useState } from "react";

export default function Select({ displayKey, valueKey, id = 'customSelect', name = 'customSelect', placeholder = 'Default Placeholder', options = [{ id: 1, name: "Testing" }, { id: 2, name: "Testing2" }], onChange = () => { } }) {

    const [state, setState] = useState(false);
    const [selected, setSelected] = useState('');

    const selectOption = (option) => {
        const selectDOM = document.getElementById(id);

        var onChangeEvent = new Event('onchange');
        selectDOM.value = option[valueKey];
        selectDOM.dispatchEvent(onChangeEvent); //TODO This does not work.

        setSelected(option[displayKey]);
    };

    useEffect(() => {
        if (displayKey && valueKey)
            setState(true);
    }, []);

    return (
        state ? <>
            <div className="dropdown">
                <button className="btn btn-bd-light dropdown-toggle rounded-0 border" type="button" id={`${id}-dropdown`} data-bs-toggle="dropdown" aria-expanded="false">
                    {selected ? selected : placeholder}
                </button>
                <ul className="dropdown-menu rounded-0">
                    {options?.map((option, index) =>
                        <li key={index} className="cursor-pointer" onClick={() => { selectOption(option) }}><span className="dropdown-item">{option[displayKey]}</span></li>
                    )}
                </ul>
            </div>
            <select name={name} id={id} onChange={onChange} className="">
                {options?.map((option, index) =>
                    <option key={index} value={option[valueKey]}>{option[displayKey]}</option>
                )}
            </select>
        </> : "ERROR SETTING UP SELECT"
    );
}