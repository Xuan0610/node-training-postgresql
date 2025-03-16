// 若不是字串格式
const isNotValidSting = (value) => {
  return typeof value !== "string" || value.trim().length === 0 || value === "";
};

// 若不是數字格式
const isNotValidInteger = (value) => {
  return typeof value !== "number" || value < 0 || value % 1 !== 0;
};

// 若為Undefined
const isUndefined = (value) => {
  return value === undefined;
};

const isValidPassword = (value) => {
  const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/;
  return passwordPattern.test(value);
};

module.exports = {
  isNotValidSting,
  isNotValidInteger,
  isUndefined,
  isValidPassword,
};
