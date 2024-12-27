 const FormatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return `${formattedDate}`;
  };

  export default FormatDate