// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/*
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

    var link = document.createElement('a')
    link.setAttribute('href', url)

    var domain = link.hostname

    renderHost(domain)

  });
});
*/

function renderHost(host) {
  document.getElementById('host').value = host
}
