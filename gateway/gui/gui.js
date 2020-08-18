$(document).ready(function(){

    var received = $('#received');
    var markup;

    //var socket = new WebSocket("ws://192.168.86.20:8080/ws");
    var socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = function(){
      console.log("Connected");
    };

    socket.onmessage = function (message) {
      console.log("Receiving: " + message.data);
      markup = "<tr><td>" + message.data + "</td></tr>";
      received.append(markup);
    };

    socket.onclose = function(){
      console.log("Disconnected");
      markup = "<tr><td>Disconnected</td></tr>";
      received.append(markup);
    };

    var sendMessage = function(message) {
      console.log("Sending:" + message.data);
      socket.send(message.data);
    };

    // GUI Stuff

    // send a command to the serial port
    $("#cmd_send").click(function(ev){
      ev.preventDefault();
      var cmd = $('#cmd_value').val();
      sendMessage({ 'data' : cmd});
      $('#cmd_value').val("");
    });

    $('#clear').click(function(){
      received.empty();
    });

});