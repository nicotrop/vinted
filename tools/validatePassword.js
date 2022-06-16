// verify password
const validatePassword = (p) => {
  if (p.length < 8) {
    return "Your password must be at least 8 characters";
  }
  if (p.length > 32) {
    return "Your password must be at max 32 characters";
  }
  if (p.search(/[a-z]/) < 0) {
    return "Your password must contain at least one lower case letter.";
  }
  if (p.search(/[A-Z]/) < 0) {
    return "Your password must contain at least one upper case letter.";
  }
  if (p.search(/[0-9]/) < 0) {
    return "Your password must contain at least one digit.";
  }
  if (p.search(/[!@#\$%\^&\*_]/) < 0) {
    return "Your password must contain at least special char from -[ ! @ # $ % ^ & * _ ]";
  }
  return true;
};

module.exports = validatePassword;
