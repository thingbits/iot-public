module.exports = {
  //return TRUE if the string is ASCII

  isASCII: function (str) {
    return /^[\x00-\x7F]*$/.test(str);
  },
};
