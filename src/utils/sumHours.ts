export const sumHours = (time1?: string, time2?: string) => {
  const [hours1, minutes1] = time1?.split(':').map(Number) || [0, 0];
  const [hours2, minutes2] = time2?.split(':').map(Number) || [0, 0];

  let totalHours = hours1 + hours2;
  let totalMinutes = minutes1 + minutes2;

  if (totalMinutes >= 60) {
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
  }

  const formattedHours = String(totalHours).padStart(2, '0');
  const formattedMinutes = String(totalMinutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};
