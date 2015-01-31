(function (){
  angular
    .module('passwger', ['angular-underscore'])

  function passwgerController ($log, $window, $http, $scope) {

    var vm = this

    vm.lock = true
    vm.passwords = []
    vm.domainPasswords = []


    $scope.$watch(angular.bind(this, function(){
      return this.host
    }), function(newVal, oldVal){
      $log.log(vm.host)
      vm.populateList()
    })

    $scope.$watch(angular.bind(this, function(){
      return this.passwords
    }), function(newVal, oldVal){
      vm.populateList()
    })

    vm.populateList = function (){
      $log.log(vm.host)
      vm.domainPasswords = $scope.find(vm.passwords, function(item){ return item.domain.indexOf(vm.host) != -1 })
      $log.log(vm.domainPasswords)
    }

    vm.checkPassword = function (){
      if(vm.lockedPassword.length == 0){
        alert('Please enter your unlock password')
        return
      }

      $http
        .post('http://localhost:12358/getPassword', {
          pwd: vm.lockedPassword
        })
        .success(function (data, status, headers, config) {
          if(data.error){
            alert('Error, wrong password')
          }else{
            vm.lock = false
            vm.passwords = data.pwds
            $log.log(vm.passwords)
          }
        })
        .error(function (data, status, headers, config) {
          alert('Error, please open Passwger app')
        })

    }

  }

  angular
    .module('passwger')
    .controller('PasswgerController', passwgerController)
})()
