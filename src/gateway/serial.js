const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const { list } = require('serialport');

var serialPortName;
var disconnected = true;
var bootup = true;

/*
 * Set up Serial Port. Reconnect when unplugged/plugged
 *
 */
setInterval(async () => {
  await getSerialPort(function (error, result) {
    if (error) {
      //console.log("Error: " + error);
      //console.log("Exiting!");
      //process.exit(1);
      if (bootup) {
        console.log('Serial server:   Receiver not connected');
        bootup = false;
      }
    } else {
      serialPortName = result;

      if (disconnected) {
        console.log('Serial server:   started on' + serialPortName);
        var serialPort = new SerialPort(serialPortName, {
          baudRate: 57600,
          //autoOpen: false
        });
        const parser = new Readline();
        serialPort.pipe(parser);
        parser.on('data', function (data) {
          rxQueue.enqueue(data);
          console.log(data);
        });
        serialPort.on('close', function () {
          console.log('Serial server:   receiver disconnected');
          disconnected = true;
        });
        disconnected = false;
        bootup = false;
      }
    }
  });
}, 1000);

/*
 * Return  serial port the receiver is plugged in
 *
 */
async function getSerialPort(callback) {
  var path;
  await SerialPort.list().then(function (ports) {
    ports.forEach(function (port) {
      if (port.manufacturer === 'FTDI') {
        //console.log(port.path);
        path = port.path;
      }
    });
  });

  if (path) callback(undefined, path);
  else callback('Receiver not found', undefined);
}
