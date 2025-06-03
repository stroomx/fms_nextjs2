export default function formatTime(time, locale = navigator.language) {
    if (!time)
        return '';

    try {
        // Parse the ISO formatted date string into a Date object
        const date = new Date('2000-01-01 ' + time + "Z");

        // Check if the date is valid
        if (isNaN(date)) {
            throw new Error("Invalid date format");
        }

        // Create date formatting options based on whether time should be included
        const options = {
            year: undefined,
            month: undefined,
            day: undefined,
            hour: 'numeric',
            minute: 'numeric',
            second: undefined,
            hour12: false, // Use 24-hour clock by default
            timeZone: undefined // (User settgins first) if not set ( Franchise for the Schedule Timezone Second ) // Keep as franchise
        };

        // Format the date according to the specified locale
        const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

        return formattedDate;
    } catch (error) {
        return '';
    }
}