const digitMap: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(val: number | string): string {
  const str = String(val);
  return str.split('').map((char) => digitMap[char] || char).join('');
}

export function formatSerial(num: number): string {
  const padded = String(num).padStart(2, '0');
  return toBengaliNumber(padded);
}

export function formatTimeWithMs(isoString: string): string {
  const d = new Date(isoString);
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');

  return `${toBengaliNumber(hours)}:${toBengaliNumber(minutes)}:${toBengaliNumber(seconds)}.${ms} ${ampm}`;
}

export function getBengaliDayName(dayIndex: number): string {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  return days[dayIndex] || '';
}

export function getBengaliMonthName(monthIndex: number): string {
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  return months[monthIndex] || '';
}

export function formatBengaliDate(dateStr: string): string {
  const d = new Date(dateStr);
  const dayName = getBengaliDayName(d.getDay());
  const day = toBengaliNumber(d.getDate());
  const month = getBengaliMonthName(d.getMonth());
  const year = toBengaliNumber(d.getFullYear());
  return `${dayName}, ${day} ${month} ${year}`;
}
