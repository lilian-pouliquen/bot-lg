exports.getLocalisedString = function getLocalisedString(_locale, _string, ..._vars) {
    const translations = require(`./${_locale}.json`);
    let string = translations[_string];

    let count = 0;
    string = string.replace(/%VAR%/g, () => null !== _vars[count] ? _vars[count] : '%VAR%');

    return string;
}
