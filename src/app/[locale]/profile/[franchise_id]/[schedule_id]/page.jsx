// import BirthdayPartyRequest from "../birthdayPartyRequest";
// import TeacherApplication from "../teacher/page";

import Calendar from "@/app/components/calendar/Calendar";
import Tooltip from "@/app/components/ToolTip";

export default function home() {

    return <div className="p-5 mt-5 text-center">
        <Tooltip
            tooltipContent={
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.2928559555467!2d-121.90689992359339!3d37.40655233328482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb51b951287cd%3A0x1c62d7dd84f54a4d!2sBricks%204%20Kidz%20Bayarea!5e0!3m2!1sen!2sae!4v1714587630373!5m2!1sen!2sae" width="100%" height="100%" className='border-0' allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            }
            placement="bottom"
        >
            <button className="btn btn-primary">Hover or Tap</button>
        </Tooltip>
        <Tooltip
            tooltipContent={
                <Calendar highlightedDates={['2024-04-04']} />
            }
            placement="bottom"
        >
            <button className="btn btn-primary">Hover or Tap</button>
        </Tooltip>
    </div>;
}