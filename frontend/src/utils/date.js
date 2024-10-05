export const formatJoinedDate = (inputDate) => {
  const date = new Date(inputDate);

  if(isNaN(date.getTime())){
    return "Invalid Date";
  }

  return date.toLocaleDateString("en-IN",  {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const formatLastLoginDate = (dateString) => {
  const date = new Date(dateString);

  if(isNaN(date.getTime())){
    return "Invalid Date";
  }

  return date.toLocaleString("en-IN",{
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}