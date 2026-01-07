export const formatTime = (timeString: string) => {
  
  const [hours, minutes] = timeString.split(':');
  
  let hour = parseInt(hours, 10);
  
  const ampm = hour >= 12 ? 'PM' : 'AM';
  
  hour = hour % 12;
  hour = hour ? hour : 12; 
  
  return `${hour}:${minutes} ${ampm}`;
};