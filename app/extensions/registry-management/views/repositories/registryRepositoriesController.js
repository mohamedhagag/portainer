angular.module('portainer.extensions.registrymanagement')
.controller('RegistryRepositoriesController', ['$transition$', '$scope',  'RegistryService', 'RegistryV2Service', 'Notifications',
function ($transition$, $scope, RegistryService, RegistryV2Service, Notifications) {

  $scope.state = {
    displayInvalidConfigurationMessage: false
  };


  $scope.paginationAction = function (repositories) {
    RegistryV2Service.getRepositoriesDetails($scope.state.registryId, repositories)
    .then(function success(data) {
      for (var i = 0; i < data.length; i++) {
        var idx = _.findIndex($scope.repositories, {'Name': data[i].Name});
        if (idx !== -1) {
          $scope.repositories[idx].TagsCount = data[i].TagsCount;
        }
      }
    }).catch(function error(err) {
      Notifications.error('Failure', err, 'Unable to retrieve repositories details');
    });
  };

  function initView() {
    $scope.state.registryId = $transition$.params().id;

    RegistryService.registry($scope.state.registryId)
    .then(function success(data) {
      $scope.registry = data;

      RegistryV2Service.ping($scope.state.registryId, false)
      .then(function success() {
        return RegistryV2Service.repositories($scope.state.registryId);
      })
      .then(function success(data) {
        $scope.repositories = data;
      })
      .catch(function error() {
        $scope.state.displayInvalidConfigurationMessage = true;
      });
    })
    .catch(function error(err) {
      Notifications.error('Failure', err, 'Unable to retrieve registry details');
    });
  }

  initView();
}]);
