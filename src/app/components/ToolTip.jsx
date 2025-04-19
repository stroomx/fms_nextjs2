'use client'

import React, { useState, useRef, useEffect } from "react";
import { usePopper } from "react-popper";

const Tooltip = ({ children, tooltipContent, placement = "top" }) => {
    const [visible, setVisible] = useState(false);
    const referenceRef = useRef(null);
    const popperRef = useRef(null);
    const arrowRef = useRef(null);

    const { styles, attributes } = usePopper(referenceRef.current, popperRef.current, {
        placement,
        modifiers: [
            { name: "offset", options: { offset: [0, 8] } },
            { name: "preventOverflow", options: { padding: 8 } },
            { name: "flip", options: { fallbackPlacements: ["top", "bottom", "left", "right"] } },
            { name: "arrow", options: { element: arrowRef.current, padding: 5 } },
        ],
    });

    const isTouchDevice = () =>
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const handleToggle = () => {
        if (isTouchDevice()) setVisible((v) => !v);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                popperRef.current &&
                !popperRef.current.contains(e.target) &&
                !referenceRef.current.contains(e.target)
            ) {
                setVisible(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("scroll", () => setVisible(false), true);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("scroll", () => setVisible(false), true);
        };
    }, []);

    return (
        <div
            ref={referenceRef}
            onMouseEnter={() => !isTouchDevice() && setVisible(true)}
            onMouseLeave={() => !isTouchDevice() && setVisible(false)}
            onClick={handleToggle}
            className="d-inline-block"
        >
            {children}
            {visible && (
                <div
                    ref={popperRef}
                    style={styles.popper}
                    {...attributes.popper}
                    className="tooltip bs-tooltip-auto show fade" // Bootstrap tooltip container style
                    role="tooltip"
                >
                    <div className="tooltip-inner" style={{
                        background: "white",
                        fontSize: "1rem",
                        width: "100%",            // allow flexible growth
                        // minWidth: "200px",        // starting size
                        maxWidth: "90vw",         // don't overflow screen
                        maxHeight: "50vh",        // limit vertical height
                        overflowY: "auto",        // scroll if content overflows vertically
                    }}>{tooltipContent}</div>
                    <div
                        ref={arrowRef}
                        style={styles.arrow}
                        className="tooltip-arrow"
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
