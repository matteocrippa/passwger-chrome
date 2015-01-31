(function (){
  angular
    .module('passwger', [])

  function passwgerController ($log, $window, $http) {

    var vm = this

    vm.lock = true

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
