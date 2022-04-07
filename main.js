
// Connecting to ROS
///////////////////////////////////////////////////////////////


  var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
  });

  ros.on('connection', function() {
    document.getElementById("status").innerHTML = "Connected";
    document.getElementById("status").style.color = "green";
  });
  
  ros.on('error', function(error) {
    document.getElementById("status").innerHTML = "Error";
    document.getElementById("status").style.color = "red";
  });
  
  ros.on('close', function() {
    document.getElementById("status").innerHTML = "Closed";
    document.getElementById("status").style.color = "red";

});

///////////////////////////////////////////////////////////////////
// ROS Subscribers
///////////////////////////////////////////////////////////////////
var fill_level_array = []

var fill_level_sub = new ROSLIB.Topic({
  ros : ros,
  name : '/GrainCart/grain_distribution',
  messageType : 'std_msgs/Float64MultiArray'
});

fill_level_sub.subscribe(function(m) {
  fill_level_array = m.data
  updatePlot()
});

var auger_location = 0.0
var auger_location_sub = new ROSLIB.Topic({
  ros : ros,
  name : '/GrainCart/positionOverAuger',
  messageType : 'std_msgs/Float32'
});

auger_location_sub.subscribe(function(m) {
  auger_location = m.data
  updateAugerLocation()
});
var overall_fill_level = 0.0
var overall_fill_level_sub = new ROSLIB.Topic({
  ros : ros,
  name : '/GrainCart/overallFillLevel',
  messageType : 'std_msgs/Float32'
});

overall_fill_level_sub.subscribe(function(m) {
  overall_fill_level = m.data
  updateOverallFillLevel()
});

var led_board_level = 3
var led_board_message = ""
var led_board_status_sub = new ROSLIB.Topic({
  ros : ros,
  name : '/Combine/ledBoardStatus',
  messageType : 'diagnostic_msgs/DiagnosticStatus'
});

led_board_status_sub.subscribe(function(m) {
  led_board_level = m.level
  led_board_message = m.message
  updateLedBoard()
  updateActionMessage()
});

//////////////////////////////////////////////////////////////////////
// ROS Publishers
///////////////////////////////////////////////////////////////////////
var goForwardButton = new ROSLIB.Topic({
  ros : ros,
  name : '/go_forward_button',
  messageType : 'std_msgs/Bool'
});

var goBackwardButton = new ROSLIB.Topic({
  ros : ros,
  name : '/go_backward_button',
  messageType : 'std_msgs/Bool'
});


///////////////////////////////////////
// The item (or items) to press and hold on
let item = document.querySelector("#item");
let timerID;
item.addEventListener("mousedown", pressingDown, false);
item.addEventListener("mouseup", notPressingDown, false);
item.addEventListener("mouseleave", notPressingDown, false);

item.addEventListener("touchstart", pressingDown, false);
item.addEventListener("touchend", notPressingDown, false);

function pressingDown(e) {
  // Start the timer
  requestAnimationFrame(timer);
  e.preventDefault();
  console.log("Pressing!");
}
function notPressingDown(e) {
  // Stop the timer
  cancelAnimationFrame(timerID);
  // item.style.setProperty("--scale-value", 1);
  console.log("Not pressing!");
}
var cnt = 0
function timer() {
  console.log("Timer tick!");
  timerID = requestAnimationFrame(timer);
  var go_forward_status = true
  var go_forward_msg = new ROSLIB.Message({data:go_forward_status});
  if(cnt>5)
  {
    goForwardButton.publish(go_forward_msg);
    cnt=0
  }
  cnt++
}

let item_backward = document.querySelector("#item_backward");
let timerIDback;
item_backward.addEventListener("mousedown", pressingDownBackward, false);
item_backward.addEventListener("mouseup", notPressingDownBackward, false);
item_backward.addEventListener("mouseleave", notPressingDownBackward, false);
item_backward.addEventListener("touchstart", pressingDownBackward, false);
item_backward.addEventListener("touchend", notPressingDownBackward, false);

function pressingDownBackward(e) {
  // Start the timer
  requestAnimationFrame(timerBack);
  e.preventDefault();
  console.log("Pressing! Back");
}

function notPressingDownBackward(e) {
  // Stop the timer
  cancelAnimationFrame(timerIDback);
  console.log("Not pressing! Back");
}
var cnt2 = 0
function timerBack() {
  console.log("Timer tick Back!");
  timerIDback = requestAnimationFrame(timerBack);
  var go_backward_status = true
  var go_backward_msg = new ROSLIB.Message({data:go_backward_status});
  if(cnt2 >5)
  {
    goBackwardButton.publish(go_backward_msg);
    cnt2 =0
  }
  cnt2++
}
//////////////////////////////////////////

var unloadButton = new ROSLIB.Topic({
  ros : ros,
  name : '/unload_button',
  messageType : 'std_msgs/Bool'
});

$('#button_unload').on('touchstart', function() {
  var unload_status = true
  console.log("Unload")
  var unload_msg = new ROSLIB.Message({data:unload_status});
unloadButton.publish(unload_msg);
});

var resetButton = new ROSLIB.Topic({
  ros : ros,
  name : '/reset_button',
  messageType : 'std_msgs/Bool'
});

$('#button_reset').on('touchstart', function() {
  var reset_status = true
  console.log("Reset")
  var reset_msg = new ROSLIB.Message({data:reset_status});
resetButton.publish(reset_msg);
});

//////////////////////////////////////////////////////////////////////
// MISC
///////////////////////////////////////////////////////////////////////
function updatePlot()
{
  var x_array = Array.from(Array(fill_level_array.length).keys())
  var data = [
    {
      x: x_array ,
      y: fill_level_array,
      type: 'bar',
      name: 'Fill level',
      marker: {
        color: 'rgb(255,215,0)'
      }
    }
  ];
  
  var layout = {
    autosize: false,
    width: screen.width*0.715,
    height: screen.height*0.4,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 10
    },
    paper_bgcolor: '#7f7f7f',
    plot_bgcolor: '#c7c7c7',
    yaxis: {
      autorange:false,
      fixedrange: true,
      range:[0,1]
    },
    xaxis: {
      autorange:false,
      fixedrange: true,
      range:[-0.5,fill_level_array.length-0.5]
    }
  };
  
  Plotly.newPlot('grain_cart', data, layout);
}

var overall_fill_level_tag = document.getElementById("overallFillLevel");

function updateOverallFillLevel()
{
  overall_fill_level_tag.innerHTML = String((overall_fill_level*100).toFixed(2))
}

var forward_led = document.getElementById("forward");
var stay_led = document.getElementById("stay");
var reverse_led = document.getElementById("reverse");

function updateLedBoard()
{
  if(led_board_level == 2)
  {
    forward_led.style.backgroundColor = "#bbb"
    stay_led.style.backgroundColor = "#bbb"
    reverse_led.style.backgroundColor = "#00FF00"
  }
  if (led_board_level == 1)
  {
    forward_led.style.backgroundColor = "#bbb"
    stay_led.style.backgroundColor = "#0000FF"
    reverse_led.style.backgroundColor = "#bbb"
  }
  if (led_board_level == 0)
  {
    forward_led.style.backgroundColor = "#FF0000"
    stay_led.style.backgroundColor = "#bbb"
    reverse_led.style.backgroundColor = "#bbb"
  } 
}

var required_action = document.getElementById("requiredAction")

function updateActionMessage()
{
  if(led_board_message == "ACCELERATE")
  {
    required_action.style.color = "green"
  }
  else if(led_board_message == "KEEP SPEED")
  {
    required_action.style.color = "black"
  }
  else if(led_board_message == "BRAKE")
  {
    required_action.style.color = "red"
  }
  required_action.innerHTML = led_board_message
}
var auger_animation = document.getElementById("augerAnimation");

function updateAugerLocation()
{
  if (auger_location < 1.2 && auger_location>-0.2)
  {
    auger_animation.style.display = "block"
    var auger_location_pixels = convertAugerLocationToPixel(auger_location)
    auger_animation.style.left = auger_location_pixels + 'px';
    // forward_led.style.backgroundColor = "#00FF00"

  }
  else
  {
    auger_animation.style.display = "none"
    // forward_led.style.backgroundColor = "#bbb"
    // stay_led.style.backgroundColor = "#bbb"
    // reverse_led.style.backgroundColor = "#bbb"
  }
  
}

function convertAugerLocationToPixel(auger_location_normal)
{
  var offset_right = 200
  var offset_left = 240
  var b = screen.width-offset_left
  var m = offset_right-b


  return m*auger_location_normal+b

}

