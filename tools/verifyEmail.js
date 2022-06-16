//Verify email
const verifyEmail = (email) => {
  //Check if email is greater than 1 and include @
  if (email && email.length > 1 && email.includes("@")) {
    const test = email.trim().toLowerCase().split("@");
    //Check if there is more than one @
    if (test.length === 2) {
      const server = test[1];
      const name = test[0];
      //Tab of what is allowed in the server address
      const allowedInServer =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.".split(
          ""
        );
      //Tab of what is allowed in the name
      const allowedInName =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~.".split(
          ""
        );
      //Check that there is only one . in server
      let dotcount = 0;
      server.split("").forEach((char) => {
        if (char === ".") {
          return dotcount++;
        }
      });
      //Check chars in server and name
      const validServer = server.split("").map((char) => {
        if (allowedInServer.indexOf(char) === -1) {
          return false;
        } else {
          return true;
        }
      });
      const validName = name.split("").map((char) => {
        if (allowedInName.indexOf(char) === -1) {
          return false;
        } else {
          return true;
        }
      });
      if (
        dotcount === 1 &&
        !validServer.includes(false) &&
        !validName.includes(false)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = verifyEmail;
