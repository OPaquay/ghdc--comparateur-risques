'use strict';

/**
 * @ngdoc function
 * @name comparateurRisquesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the comparateurRisquesApp
 */
angular.module('comparateurRisquesApp')
  .controller('ResultatsCtrl', function ($scope, $rootScope, $location, moment) {

    if($rootScope.selectedPatients === undefined || $rootScope.selectedPatients.length === 0){
      $location.path('main');
    }

    var chartColors = ['#4BC0C0', '#36A2EB', '#FF9F40', '#FFCD56'];

    var now = moment();
    // Min and max birthDate
    var minDate = moment('2017-12-31T23:59:59Z');
    var maxDate = moment('1930-01-01T00:00:00Z');

    // Set data rules : min, max and unit
    var dataRules = {
      age: {
        min: now.diff(minDate, 'years'),
        max: now.diff(maxDate, 'years'),
        unite: 'ans'
      },
      bmi: {
        min: 45 / (1.95 * 1.95),
        max: 140 / (1.55 * 1.55),
        unite: ''
      },
      hba1c: {
        min: 0.05,
        max: 0.12,
        unite: '(ratio)'
      },
      cholesterol_total: {
        min: 130,
        max: 320,
        unite: 'mg/dl'
      },
      cholesterol_hdl: {
        min: 20,
        max: 100,
        unite: 'mg/dl'
      },
      pression_sanguine: {
        min: 90,
        max: 200,
        unite: 'mmHg'
      },
      consommation_tabagique: {
        min: 0,
        max: 80,
        unite: 'paquets par année'
      }
    };

    // Convert data to display a percentage between 0 -> 100%
    $scope.prepareData = function(patientData){
      var patientDataFormatted = {};

      for(var param in patientData){
        // value in percentage = (value - minValue) / ((maxValue - minValue)/100)
        patientDataFormatted[param] = (patientData[param] - dataRules[param].min) / ((dataRules[param].max - dataRules[param].min)/100);
      }

      return patientDataFormatted;
    };

    // Collect and manipulate patient data
    var collectData = function(patient){
      var now = moment();

      // Collect and transform data for display
      var patientData = {
        age: now.diff(moment(patient.admin['date_de _naissance']), 'years'),
        bmi: (patient.biometrie.poids / (patient.biometrie.taille/100 * patient.biometrie.taille/100)).toFixed(1), // weight(kg) / (size(m) * size(m))
        hba1c: patient.const_biologique.HbA1c,
        cholesterol_total: patient.const_biologique.Cholesterol_total,
        cholesterol_hdl: patient.const_biologique.Cholesterol_HDL,
        pression_sanguine: patient.parametres.PSS,
        consommation_tabagique: patient.assuetudes.Consommation_tabagique
      };

      return patientData;
    };

    // Return a dataSets array containing the datas for each patient
    var getDataSets = function(){
      var dataSets = [];

      $rootScope.selectedPatients.forEach(function(patient, index){

        // Convert data to a percentage
        var patientDataFormatted = $scope.prepareData(collectData(patient));

        var data = {
          label: patient.admin.prenom + ' ' + patient.admin.nom + ' (' + patient.admin.Genre.substring(0, 1) + ')',
          backgroundColor: chartColors[index],
          borderColor: chartColors[index],
          data: [patientDataFormatted.age, patientDataFormatted.bmi, patientDataFormatted.hba1c, patientDataFormatted.cholesterol_total, patientDataFormatted.cholesterol_hdl, patientDataFormatted.pression_sanguine, patientDataFormatted.consommation_tabagique],
        };

        dataSets.push(data);
      });
      return dataSets;
    };

    // Create chart
    var ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',

        // The data for our dataset
        data: {
            labels: ["Age", "BMI", "HbA1c", "Cholestérol total", "Cholestérol HDL", "PSS", "Consommation tabagique"],
            datasets: getDataSets()
        },

        // Configuration options go here
        options: {
          legend: {
            labels: {
              fontSize: 16
            }
          },
          scales: {
            xAxes: [{
              ticks: {
                steps: 10,
                max: 100,
                min: 0
              }
            }]
          },
          tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
              // Change the tooltip to show the data with its own unit (and not in percentage)
              label: function(tooltipItems){
                var dataIndex = tooltipItems.index;
                var datasetIndex = tooltipItems.datasetIndex;
                var patientData = collectData($rootScope.selectedPatients[datasetIndex]);
                return patientData[Object.keys(patientData)[dataIndex]] + ' ' + dataRules[Object.keys(dataRules)[dataIndex]].unite;
              }
            }
          }
        }
      });
  });
