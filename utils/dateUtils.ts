function getFutureDate(days:any) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toISOString().split('T')[0];
} // Usage const futureEventDate = getFutureDate(30); console.log(futureEventDate);

export default getFutureDate;