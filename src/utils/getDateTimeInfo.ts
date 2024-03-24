export const getDateTimeInfo = (date?: Date) => {
  if (!date) {
    return undefined;
  }

  const currentDate = new Date(date).toLocaleTimeString('pt-br', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return currentDate;
};
