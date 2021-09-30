/** helpers.js */

/**
  * @param { string } str user entered text string
  * @returns safe text string by escaping unsafe chars - prevents XSS (cross-site scripting)
  */
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

export { escape };