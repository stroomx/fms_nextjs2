export default function formatDate(dateStr, showTime = true, locale = navigator.language) {
    if (!dateStr)
        return;
    
    // Parse the ISO formatted date string into a Date object
    const date = new Date(dateStr + "Z");

    // Check if the date is valid
    if (isNaN(date)) {
        throw new Error("Invalid date format");
    }

    // Create date formatting options based on whether time should be included
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: showTime ? 'numeric' : undefined,
        minute: showTime ? 'numeric' : undefined,
        second: showTime ? 'numeric' : undefined,
        hour12: false, // Use 24-hour clock by default
        timeZone: undefined // (User settgins first) if not set ( Franchise for the Schedule Timezone Second ) // Keep as franchise
    };

    // Format the date according to the specified locale
    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

    return formattedDate;
}