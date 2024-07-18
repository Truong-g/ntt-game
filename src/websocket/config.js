const base64Chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function convertWebsocketIdToObject(input) {
  let i = 0;
  let enc1, enc2, enc3, enc4;
  const inputBuffer = Buffer.alloc((input.length / 4) * 3);
  let p = 0;
  while (i < input.length) {
    enc1 = base64Chars.indexOf(input.charAt(i++));
    enc2 = base64Chars.indexOf(input.charAt(i++));
    enc3 = base64Chars.indexOf(input.charAt(i++));
    enc4 = base64Chars.indexOf(input.charAt(i++));

    inputBuffer[p++] = (enc1 << 2) | (enc2 >> 4);
    if (enc3 !== 64) {
      inputBuffer[p++] = ((enc2 & 15) << 4) | (enc3 >> 2);
    }
    if (enc4 !== 64) {
      inputBuffer[p++] = ((enc3 & 3) << 6) | enc4;
    }
  }
  const result = inputBuffer.toString("utf-8").replace(/\0+$/, "");
  try {
    return JSON.parse(result);
  } catch (error) {
    return null;
  }
}

module.exports = {
  convertWebsocketIdToObject,
};
