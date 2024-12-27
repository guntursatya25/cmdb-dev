const FormatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().slice(0, 5); 
    return `${formattedDate} ${formattedTime}`;
};
export default FormatDateTime