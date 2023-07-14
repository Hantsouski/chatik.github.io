import { div } from "@thi.ng/hiccup-html";
import { centerL } from "../../../../components";

import './day.css';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const day = (date: number) => {
  const day = new Date(date * 1000);

  const today = new Date();

  const dayFormatted = `${months[day.getMonth()]} ${day.getDate()}`;
  const todayFormatted = `${months[today.getMonth()]} ${today.getDate()}`;
  const yesterdayFormatted = `${months[today.getMonth()]} ${today.getDate() - 1}`;

  if (dayFormatted === todayFormatted) {
    return centerL({ class: 'day-container' }, div({ class: 'day' }, 'Today'));
  }

  if (dayFormatted === yesterdayFormatted) {
    return centerL({ class: 'day-container' }, div({ class: 'day' }, 'Yesterday'));
  }

  return centerL({ class: 'day-container' }, div({ class: 'day' }, dayFormatted));
}
