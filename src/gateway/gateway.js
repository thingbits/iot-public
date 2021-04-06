/*
 * gateway.js
 *
 *
 *
 */

const { mainModule } = require('process');

/* Local imports */
const lib = require('./lib.js');
const protocol = require('./protocol.js');
const serial = require('./serial.js');
const { Console } = require('console');

main();

async function main() {
  var Queue = require('queue-fifo');
  global.rxQueue = new Queue();
  setInterval(checkRXQueue, 100);

  /********************* Set up complete ************************************/

  function checkRXQueue() {
    if (!rxQueue.isEmpty()) {
      var data = rxQueue.dequeue();

      handleSerialDataIn(data);
    }
  }

  /*
   * Serial port data handler
   *
   */
  function handleSerialDataIn(data) {
    // check if its the bootup message from the receiver
    if (data.substring(0, 9) === 'THINGBITS') {
      logToConsole(data);
      return;
    }

    // Remove newline
    if (data.charAt(data.length - 1) === '\r')
      data = data.slice(0, -1);

    // Remove checksum byte
    checksumByte = data.charAt(data.length - 1);
    data = data.slice(0, -1);

    if (!protocol.verifyChecksum(data.substring(3), checksumByte)) {
      logToConsole('Checksum failed (' + data + ')');
      return;
    }

    if (!lib.isASCII(data)) {
      logToConsole(data);
    }

    var packet = protocol.isValidProtocol(data);
    if (packet === false) {
      logToConsole(data);
    }

    // Packet recevied from receiver is GOOD
    else {
      console.log(packet);
    }
  }

  /*
   * Log sensor data to console, and web
   *
   */
  function logToConsole(str) {
    var date = new Date();
    var now = date.toLocaleString();

    process.stdout.write(now + ' - ');
    console.log('Ignoring: ' + str);
  }
}
