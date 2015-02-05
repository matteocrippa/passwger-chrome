(function() {
  angular
    .module('passwger', ['angular-underscore'])

  function passwgerController($log, $window, $http, $scope) {

    var vm = this

    vm.lock = true
    vm.passwords = []
    vm.domainPasswords = null

    $scope.host = ''

    if (localStorage.passwgerExpiry > new Date().getTime()) {
      vm.lock = false
      vm.passwords = JSON.parse(localStorage.passwgerData)
    } else {
      localStorage.passwgerData = null
    }

    $scope.$watch('host', function(){
      //$log.log('host: '+$scope.host)
      vm.populateList()
    })

    $scope.$watch(angular.bind(vm, function() {
      return vm.passwords
    }), function(newVal, oldVal) {
      vm.populateList()
    })

    vm.getCurrentTabDomain = function() {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {

        var tab = tabs[0];

        var link = document.createElement('a')
        link.setAttribute('href', tab.url)

        $scope.host = link.hostname

        $scope.$apply()

      })
    }

    vm.injectPassword = function(itemId) {

      var item = $scope.find(vm.passwords, function(item) {
        return item.id == itemId
      })

      //$log.log(item)

      var src = 'var passwgerData = {\
        inputs:  document.getElementsByTagName("input"),\
        index: -1\
      };\
      for (var i=passwgerData.inputs.length-1; i>0; i--){\
        var item = passwgerData.inputs[i];\
        if(item.type){\
          if(item.type.toLowerCase() === "password"){\
            item.value = "' + item.password + '";\
            passwgerData.index = i-1;\
            break;\
          }\
        }\
      }\
      for (var j=passwgerData.index;j>=0;j--){ \
        var item = passwgerData.inputs[j];\
        if(item.type){\
          if(item.type.toLowerCase() === "text" || item.type.toLowerCase() === "email"){\
            item.value = "' + item.username + '";\
            break;\
          }\
        }\
      }'

      //$log.log(src)

      chrome.tabs.executeScript({
        code: src
      });

    }

    angular.element(document).ready(function() {
      vm.getCurrentTabDomain()

    })

    vm.populateList = function() {

      if($scope.host){
        vm.domainPasswords = $scope.find(vm.passwords, function(item) {
          return $scope.host.indexOf(item.domain) != -1
        })

        //$log.log(vm.domainPasswords)

        if (vm.domainPasswords && !$scope.isArray(vm.domainPasswords)) {
          tmp = vm.domainPasswords
          vm.domainPasswords = []
          vm.domainPasswords.push(tmp)
        }
      }

      vm.host = $scope.host

    }

    vm.checkPassword = function() {
      if (vm.lockedPassword.length == 0) {
        alert('Please enter your unlock password')
        return
      }

      $http
        .post('http://localhost:12358/getPassword', {
          pwd: vm.lockedPassword
        })
        .success(function(data, status, headers, config) {
          if (data.error) {
            alert('Error, wrong password')
          } else {
            vm.lock = false
            vm.passwords = data.pwds
            localStorage.passwgerData = JSON.stringify(data.pwds)
            localStorage.passwgerExpiry = new Date().getTime() + 5 * 60 * 1000
          }
        })
        .error(function(data, status, headers, config) {
          alert('Error, please open Passwger app')
        })

    }

  }

  angular
    .module('passwger')
    .controller('PasswgerController', passwgerController)
})()
