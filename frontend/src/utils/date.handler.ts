export const formatDate = (date: string | Date): string => {
    if (!date) {
        return "Date required";
    }
    try {
        const newDate = new Date(date);
        return newDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};