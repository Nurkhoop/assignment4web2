const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format the date as needed
};

const formatMessage = (message: string): string => {
    return message.trim(); // Trim whitespace from the message
};

export { formatTimestamp, formatMessage };