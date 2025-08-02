import dayjs from "dayjs";

const isObject = data => data === Object(data) && !isArray(data);

const isArray = data => Array.isArray(data);

const convertToCamelCase = key =>
  key.replace(/([_][a-z])/gi, data => data.toUpperCase().replace("_", ""));

export const convertSnakeCaseKeysToCamelCase = data => {
  if (isObject(data)) {
    const objectWithCamelCaseKeys = {};

    Object.keys(data).forEach(key => {
      const camelCaseKey = convertToCamelCase(key);
      objectWithCamelCaseKeys[camelCaseKey] = convertSnakeCaseKeysToCamelCase(
        data[key]
      );
    });

    return objectWithCamelCaseKeys;
  } else if (isArray(data)) {
    return data.map(element => convertSnakeCaseKeysToCamelCase(element));
  }

  return data;
};

export const formatTimeStampToDate = dateTime =>
  dayjs(dateTime).format("MMMM Do, YYYY");

export const formatTimeStampToTimeAndDate = dateTime =>
  dayjs(dateTime).format("hh:mm A, DD/MM/YYYY");

export const calculateCreatedAgo = dateTime => dayjs(dateTime).fromNow();

export const formatTimeStampToDayDateAndTime = dateTime =>
  dayjs(dateTime).format("dddd MMMM DD, YYYY hh:mm A");
