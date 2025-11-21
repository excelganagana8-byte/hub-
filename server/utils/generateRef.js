import crypto from "crypto";
export const generateRef = (length = 6, alphaNum = false) => {
  let pin = "";
  if (alphaNum && length > 0) {
    let len = Math.round(length / 2);
    pin = crypto.randomBytes(len).toString("hex");
  } else {
    for (let i = 0; i < length; i++) {
      pin += Math.floor(Math.random() * 10);
    }
  }
  return pin;
};
console.log(generateRef());
