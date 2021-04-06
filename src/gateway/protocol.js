module.exports = {
  /*
   * Simple String XOR checksum
   *
   */
  verifyChecksum: function (data, checksumByte) {
    var cs = 0;
    for (let character of data) {
      cs = cs ^ character.charCodeAt(0);
    }
    if (String.fromCharCode(cs) === checksumByte) {
      return true;
    } else {
      return false;
    }
  },

  /*
   * Validate packet format
   *
   */
  isValidProtocol: function (data) {
    var packet = {
      rssi: null,
      protocolID: null,
      uid: null,
      sensorType: null,
      battery: null,
      payload: null,
    };
    var rssi = data.slice(0, 3);

    // First 3 characters must be Signal Strength between 0-100
    if (rssi >= 0 && rssi <= 100) {
      packet.rssi = parseInt(rssi);
    } else return false;

    // 4th character should be a single digit int
    if (Number.isInteger(parseInt(data.charAt(3)))) {
      packet.protocolID = parseInt(data.charAt(3));
    } else return false;

    // pipe delimitted fields follow.
    // TODO improve field validation
    // TODO Parse sensorToype
    var sensorPacket = data.slice(5).split('|');

    // sensor packet should contain 4 non-empty fields
    console.log('packet', packet);
    for (var i = 0; i < sensorPacket.length; i++) {
      if (sensorPacket[i] === '') return false;
    }
    packet.uid = sensorPacket[0];
    packet.sensorType = sensorPacket[1];
    packet.battery = parseFloat(sensorPacket[2]);
    packet.payload = sensorPacket[3];

    return packet;
  },
};
