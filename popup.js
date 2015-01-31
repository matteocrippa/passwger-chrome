// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 **/
function getCurrentTabUrl(callback) {

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var tab = tabs[0];

    console.log('url: '+tab.url)

    callback(tab.url);
  });

}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {

    getPasswordUrl(url, function(pwds) {

      renderHost(pwds)

    }, function(errorMessage) {
      alert('Cannot display image. ' + errorMessage);
    });
  });
});


function getPasswordUrl(url, callback, errorCallback) {

  var link = document.createElement('a')
  link.setAttribute('href', url)

  var domain = link.hostname

  renderHost('Host: ' + domain)

  var x = new XMLHttpRequest()

  x.open('POST', 'http://localhost:12358/getPassword', true)
  x.responseType = 'json'
  x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

  x.onload = function() {
    var response = x.response

    if (!response) {
      errorCallback('No response')
      return
    }

    if (response.error) {
      errorCallback(response.error)
      return
    }

    var results = response.pwds

    callback(results)
  }

  x.onerror = function() {
    errorCallback('Network error')
  }

  x.send('pwd=test')
}

function renderHost(host) {
  document.getElementById('host').value = host
}
