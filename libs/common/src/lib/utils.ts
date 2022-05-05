export const prettyPrint = (object: any) => {
  return JSON.stringify(object);
};
export const raw = (doc: any) => {
  const ret = doc.toJSON ? doc.toJSON() : { ...doc };
  delete ret.__v;
  delete ret.createdAt;
  delete ret.updatedAt;
  return ret;
};

export const centerEllipsis = (text: string) => {
  // return text;
  return `${text.substr(0, 6)}...${text.substr(-6)}`;
};

export const etherToWei = (number: number) => {
  return (number * Math.pow(10, 18)).toString();
};

export const millisecToSec = (millisec: number) => {
  return Math.floor(millisec / 1000);
};

export const secToMillisec = (sec: number) => {
  return Math.floor(sec * 1000);
};

export const toUnixTime = (date: Date) => Math.floor(date.getTime() / 1000);
export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export const sleepSync = (ms: number) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < ms);
};

export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 24);
  return tomorrow;
};
export const getYesterday = () => {
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() - 24);
  return tomorrow;
};
export const getLastSeconds = (seconds = 1) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() - seconds);
  return date;
};
export const getLastMinutes = (minutes = 1) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date;
};
export const getMinuteDifference = (timeStamp: number) => {
  const today = new Date().getTime();
  return Math.floor((today - timeStamp) / 1000 / 60);
  // return ;
};

export const getLastHour = (hours = 1) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};
export const getLastDays = (days = 1) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};
export const getLastMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
};
export const getLastWeek = (weeks = 1) => {
  const date = new Date();
  date.setDate(date.getDate() - 7 * weeks);
  return date;
};
export const getNextYear = (inputDate?: Date) => {
  const date = inputDate ?? new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};
export const randomPick = <T = any>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
export const randomPicks = <T = any>(
  arr: T[],
  count = 1,
  allowDuplicate?: boolean
): T[] => {
  if (!allowDuplicate && arr.length <= count) return arr;
  const idxs: number[] = [];
  let pickIdx;
  for (let i = 0; i < count; i++) {
    do {
      pickIdx = Math.floor(Math.random() * arr.length);
    } while (!allowDuplicate && idxs.includes(pickIdx));
    idxs.push(pickIdx);
  }
  return idxs.map((idx) => arr[idx]);
};
export const weightedPick = <T = any>(
  arr: T[],
  weights: number[],
  tWeight?: number
) => {
  if (arr.length !== weights.length)
    throw new Error('Array and Weight Length should be equal');
  const totalWeight = tWeight ?? weights.reduce((acc, w) => acc + w, 0);
  let sample = Math.random() * totalWeight;
  const idx = weights.findIndex((w) => (sample -= w) < 0);
  return arr[idx];
};

export const shuffle = <T>(arr: T[]): T[] =>
  arr.sort((a, b) => 0.5 - Math.random());
export const trueShuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};
export const groupByFields = <TElement extends { [key: string]: any }>(
  arr: TElement[],
  fieldName: string
): { [key: string]: TElement[] } => {
  const group: { [key: string]: TElement[] } = {};
  arr.map((data: TElement) => {
    data[fieldName] &&
      (group[data[fieldName]] ??
        (() => {
          group[data[fieldName]] = [];
        })());
    group[data[fieldName]].push(data);
  });
  return group;
};
