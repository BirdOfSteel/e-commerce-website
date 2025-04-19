export default function getCurrentDate() {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date();

    const currentDate = 
        `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear().toString()}`;
    
    return currentDate;
}