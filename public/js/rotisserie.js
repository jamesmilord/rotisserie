"use strict";

window.onload = function () {
  updateIframe();
  setInterval(updateIframe, 15000);
};

var data = {};
var currentStreamName = "";

/**
 * Updates webpage on a 15s interval if a new best stream is determined.
 */
function updateIframe() {
  var pin = document.getElementById("buttonPin").value;
  if (pin === "on") {
    return;
  }
  getJSON();
}

/**
 * Set current and closest stream
 * @param {array} data - array of streams
 * @param {int} index - index of current stream
 * @param {string} type - determines if we need to pin stream
 */
function setStream(data, index, type) {
  var currentStreamSrc = document.getElementById("twitch_iframe").src;
  var currentStream = data[index];
  currentStreamName = currentStream["stream_name"];
  document.getElementById("streamer_name").innerHTML = currentStream["stream_name"] + " - " + currentStream["alive"];
  var closestStreamIndex = index + 1;
  if (closestStreamIndex >= data.length) {
    closestStreamIndex = 0;
  }
  var closestStream = data[closestStreamIndex];
  document.getElementById("next_closest").innerHTML = closestStream["stream_name"] + " - " + closestStream["alive"];
  if (currentStreamSrc !== currentStream["stream_url"]) {
    document.getElementById("twitch_iframe").src = currentStream["stream_url"];
  }
  if (type === "pin") {
    document.getElementById("buttonPin").value = "on";
    document.getElementById("buttonPin").innerHTML = "Unpin Stream";
  }
}

/**
 * Call API to get JSON from server.
 */
function getJSON() {
  var options = {
    url: "/all",
    method: "GET"
  };

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      data = JSON.parse(xhr.response);
      setStream(data, 0, "set");
      document.getElementsByClassName("container__streamer-closest")[0].style.display = "flex";
    }
  };
  xhr.open(options.method, options.url);
  xhr.send();
};

document.getElementById("buttonPin").addEventListener("click", function () {
  var element = document.getElementById("buttonPin");
  var pinned = element.value;
  if (pinned === "off") {
    element.value = "on";
    element.innerHTML = "Unpin Stream";
  } else {
    element.value = "off";
    element.innerHTML = "Pin Stream";
  }
});

document.getElementById("next_closest").addEventListener("click", function () {
  var currentStreamIndex = data.findIndex(function (dataObj) {
    return dataObj.stream_name === currentStreamName;
  });
  var newStreamIndex = currentStreamIndex + 1;
  if (newStreamIndex < data.length) {
    setStream(data, newStreamIndex, "pin");
    if (newStreamIndex === data.length - 1) {
      document.getElementsByClassName("container__streamer-closest")[0].style.display = "none";
    }
  }
});

/**
 * Apply colors to buttons
 * @param {int} a - value of a
 * @param {int} b - value of b
 * @param {int} c - value of c
 * @param {string} white - rgb for white
 * @param {string} green - rgb for green
 *  @param {string} abcColor - rgb for a,b,c
 * @param {array} buttonItems - array of buttons
 */
function changeButtonColor(a, b, c, white, green, abcColor, buttonItems) {
  if (a !== 255 && b !== 255 && c !== 255) {
    buttonItems[0].style.backgroundColor = green;
    buttonItems[0].style.color = abcColor;
    buttonItems[1].style.backgroundColor = green;
    buttonItems[2].style.backgroundColor = green;
    buttonItems[1].getElementsByTagName("a")[0].style.color = abcColor;
    buttonItems[2].getElementsByTagName("a")[0].style.color = abcColor;
  } else {
    buttonItems[0].style.backgroundColor = white;
    buttonItems[0].style.color = green;
    buttonItems[1].style.backgroundColor = white;
    buttonItems[2].style.backgroundColor = white;
    buttonItems[1].getElementsByTagName("a")[0].style.color = green;
    buttonItems[2].getElementsByTagName("a")[0].style.color = green;
  }
}

/**
 * Apply text color
 * @param {string} element - html element
 *  @param {string} color - color to change to
 */
function changeTextColor(element, color) {
  for (var i = 0; i < element.length; i++) {
    element[i].style.color = color;
  }
}

document.getElementById("myRange").addEventListener("input", function (evt) {
  var sliderValue = document.getElementById("myRange").value;
  // body and button text color
  var a = 255 * sliderValue / 100;
  var b = 255 * sliderValue / 100;
  var c = 255 * sliderValue / 100;
  // navbar and button - background,border color
  var a1 = 0 * sliderValue / 100;
  var b1 = 170 * sliderValue / 100;
  var c1 = 94 * sliderValue / 100;

  var white = "rgb(" + Math.floor(a1) + ",\n    " + Math.floor(b1) + ", " + Math.floor(c1) + ")";
  // original color is green
  var green = "rgb(" + Math.floor(a) + ", " + Math.floor(b) + ", " + Math.floor(c) + ")";

  var navbar = document.getElementById("navbar");
  var navbarLinks = navbar.getElementsByTagName("a");
  var about = document.getElementById("about");
  var contact = document.getElementById("contact");
  var buttons = document.getElementById("container__button");
  var buttonItems = buttons.getElementsByTagName("button");
  var contactUs = document.getElementById("contactUs");
  var contactLinks = contact.getElementsByTagName("a");

  document.body.style.backgroundColor = green;
  navbar.style.backgroundColor = white;
  navbar.style.border = white;
  navbar.style.color = green;
  about.style.backgroundColor = white;
  about.style.border = white;
  about.style.color = green;
  contact.style.color = white;
  contactUs.style.borderRight = "2px solid " + white;

  changeTextColor(contactLinks, white);
  changeTextColor(navbarLinks, green);
  changeButtonColor(a, b, c, "rgb(255, 255, 255)", "rgb(0, 170, 94)", white, buttonItems);
});