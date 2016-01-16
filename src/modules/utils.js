const moment = require('moment');
const debug = require("debug")("utils");

function utils (workHours) {
  try {
    let check = [];
    check.push(moment(workHours.monday.open, "HH:mm", true).isValid());
    check.push(moment(workHours.monday.close, "HH:mm", true).isValid());
    check.push(moment(workHours.tuesday.open, "HH:mm", true).isValid());
    check.push(moment(workHours.tuesday.close, "HH:mm", true).isValid());
    check.push(moment(workHours.wednesday.open, "HH:mm", true).isValid());
    check.push(moment(workHours.wednesday.close, "HH:mm", true).isValid());
    check.push(moment(workHours.thursday.open, "HH:mm", true).isValid());
    check.push(moment(workHours.thursday.close, "HH:mm", true).isValid());
    check.push(moment(workHours.friday.open, "HH:mm", true).isValid());
    check.push(moment(workHours.friday.close, "HH:mm", true).isValid());
    check.push(moment(workHours.saturday.open, "HH:mm", true).isValid());
    check.push(moment(workHours.saturday.close, "HH:mm", true).isValid());
    check.push(moment(workHours.sunday.open, "HH:mm", true).isValid());
    check.push(moment(workHours.sunday.close, "HH:mm", true).isValid());

    check.forEach((e, i) => {
      if (!e) throw `One or more times are not vaild! (index: ${i})`;
    })
  } catch (e) {
    if (e instanceof TypeError)
        return('Invalid workHours object!')
    return(e);
  }
  return false;
}

module.exports = utils;
