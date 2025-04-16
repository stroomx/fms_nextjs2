// import BirthdayPartyRequest from "../birthdayPartyRequest";
// import TeacherApplication from "../teacher/page";

import Calendar from "@/app/components/calendar/Calendar";

export default function home() {

    const specialDates = ['2025-04-16', '2025-04-25', '2025-05-01'];

    return <div className="container px-5 mt-5">
        <h2>Bootstrap React Calendar</h2>
        <Calendar highlightedDates={specialDates} />
    </div>
        ;
}