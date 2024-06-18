export const formatDate = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    const day = date.getUTCDate(); // Get day of the month (1-31)
    const month = date.toLocaleString('id-ID', { month: 'long' }); // Get full month name
    const year = date.getUTCFullYear(); // Get full year (4 digits)

    return `${day} ${month} ${year}`;
}

export const formatDateOriginal = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    const day = date.toLocaleString('id-ID', { day: '2-digit' });
    const month = date.toLocaleString('id-ID', { month: '2-digit' });
    const year = date.getUTCFullYear();
    
    return `${year}-${month}-${day} `;
}