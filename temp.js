let currentTime = new Date();
let currentOffset = currentTime.getTimezoneOffset();

let ISTOffset = 330;
let ISTTime = new Date(
  currentTime.getTime() + (ISTOffset + currentOffset) * 60000
);
const timestamp = `${ISTTime.getDate()}/${ISTTime.getMonth()}/${ISTTime.getFullYear()} ${ISTTime.getHours()}:${ISTTime.getMinutes()}`;

const str = "true";
const truthValue = "true" === str;
console.log(truthValue);
