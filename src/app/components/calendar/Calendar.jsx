'use client'

import React, { useState } from 'react';

const getDaysInMonth = (year, month) => {
    const date = new Date(Date.UTC(year, month, 1));
    const days = [];

    const firstDayIndex = date.getDay();
    const lastDate = new Date(Date.UTC(year, month + 1, 0)).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
        days.push(null);
    }

    for (let i = 1; i <= lastDate; i++) {
        days.push(new Date(Date.UTC(year, month, i)));
    }

    return days;
};

const getFirstUpcomingDate = (dates) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    for (let dateStr of dates) {
        const date = new Date(dateStr);
        if (date >= today) {
            return date;
        }
    }

    return null; // If all dates have passed
}

const formatDate = (date) => date.toISOString().split('T')[0];

const Calendar = ({ highlightedDates = [] }) => {

    const today = new Date();
    const firstDate = getFirstUpcomingDate(highlightedDates);

    if (!firstDate)
        return <>
            {t('All dates have passed')}
        </>

    const [currentDate, setCurrentDate] = useState(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = getDaysInMonth(year, month);

    const isHighlighted = (date) => date && highlightedDates.includes(formatDate(date));
    const isToday = (date) => date && formatDate(date) === formatDate(today);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="card shadow-sm p-3 calendar-component">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={handlePrevMonth}>
                    &lt;
                </button>
                <h5 className="mb-0 d-md-block d-none">
                    {currentDate.toLocaleString('default', { month: 'long' })} {year}
                </h5>
                <h5 className="mb-0 d-md-none">
                    {currentDate.toLocaleString('default', { month: 'short' })} {year}
                </h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleNextMonth}>
                    &gt;
                </button>
            </div>

            <div className="row text-center fw-bold border-bottom pb-2 mb-2 d-none d-md-flex px-3">
                {dayLabels.map((day, index) => (
                    <div className="col text-uppercase small" key={index}>
                        {day}
                    </div>
                ))}
            </div>
            <div className="row text-center fw-bold border-bottom pb-2 mb-2 d-md-none px-3">
                {dayLetters.map((day, index) => (
                    <div className="col text-uppercase small" key={index}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="d-flex flex-wrap text-center calendar-grid">
                {days.map((day, idx) => (
                    <div className="calendar-day" key={idx}>
                        {day ? (
                            <div
                                className={`rounded-circle d-inline-block calendar-cell ${isHighlighted(day)
                                    ? 'text-bg-primary'
                                    : ''
                                    }`}
                            >
                                {day.getDate()}
                            </div>
                        ) : (
                            <div className="calendar-cell">&nbsp;</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;