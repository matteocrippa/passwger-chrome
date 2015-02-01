(function() {
  angular
    .module('passwger', ['angular-underscore'])

  function passwgerController($log, $window, $http, $scope) {

    var vm = this

    vm.lock = true
    vm.passwords = []
    vm.domainPasswords = null


    $scope.$watch(angular.bind(this, function() {
      return this.host
    }), function(newVal, oldVal) {
      vm.populateList()
    })

    $scope.$watch(angular.bind(this, function() {
      return this.passwords
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

        vm.host = link.hostname

      })
    }
    
    vm.injectPassword = function(item) {
      angular.forEach(element.find('input'), function(node){ 
        //dosomething(node)
        $log.log(node.val())
      })
    }

    angular.element(document).ready(function() {
      vm.getCurrentTabDomain()
    })

    vm.populateList = function() {
      vm.domainPasswords = $scope.find(vm.passwords, function(item) {
        return vm.host.indexOf(item.domain) != -1
      })

      $log.log(vm.domainPasswords)

      if(vm.domainPasswords && !$scope.isArray(vm.domainPasswords)){
        tmp = vm.domainPasswords
        vm.domainPasswords = []
        vm.domainPasswords.push(tmp)
      }
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
