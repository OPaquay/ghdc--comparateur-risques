'use strict';

/**
 * @ngdoc function
 * @name comparateurRisquesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the comparateurRisquesApp
 */
angular.module('comparateurRisquesApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $timeout) {

    if(patients === undefined){
      var patients = [];
      // Get patients data from JSON file
      $http.get('../data/MOCK_DATA.JSON').then(function(data){
        patients = data.data;
      });
    }
    if($rootScope.selectedPatients === undefined) {
      $rootScope.selectedPatients = [];
    }

    $scope.minBirthDate = new Date(1930, 0, 1);
    $scope.maxBirthDate = new Date(2017, 11, 31);

    $scope.searchInput = {
      lastName: "",
      firstName: "",
      birthDate: ""
    };

    $scope.searchPatient = function(){
      if($scope.searchInput.birthDate === ""){
        $scope.searchForm.birthDate.$setValidity('valid', true);
      }
      if($scope.searchForm.$valid) {
        console.log('valid form');
        // Return an array of the corresponding patient(s)
        $scope.searchResult = patients.filter(function(o){
          var birthDate = new Date(o.admin['date_de _naissance']);
          birthDate.setHours(0, 0, 0);
          if($scope.searchInput.firstName.toLowerCase() === o.admin.prenom.toLowerCase() && $scope.searchInput.lastName.toLowerCase() === o.admin.nom.toLowerCase() && ($scope.searchInput.birthDate === "" || $scope.searchInput.birthDate.getTime() === birthDate.getTime())){
             return true;
          } else {
            return false;
          }
        });
        // Check if the listed patients are already selected or not
        var compareId = function(o){
          return o.id === $scope.searchResult[i].id;
        };
        for(var i=0; i<$scope.searchResult.length; i++){
          var isPatientSelected = $rootScope.selectedPatients.find(compareId);
          if(isPatientSelected !== undefined){
            $scope.searchResult[i].selected = true;
          } else {
            $scope.searchResult[i].selected = false;
          }
        }
        $scope.searchDone = true;
        $timeout(function(){
          $scope.$apply();
        });
      }
    };

    // Mark patient as selected and add it in the selectedPatients array
    $scope.selectPatient = function(index){
      $scope.searchResult[index].selected = true;
      $rootScope.selectedPatients.push($scope.searchResult[index]);
      $timeout(function(){
        $scope.$apply();
      });
    };

    // Remove patient from the selectedPatients array and mark it as not selected
    $scope.unselectPatient = function(index){
      var patientId = $rootScope.selectedPatients[index].id;
      $rootScope.selectedPatients.splice(index, 1);
      if($scope.searchResult !== undefined && $scope.searchResult.length > 0) {
        var patientIndexInSearchResult = $scope.searchResult.findIndex(function(o){return o.id === patientId;});
        $scope.searchResult[patientIndexInSearchResult].selected = false;
      }
    };
  });
