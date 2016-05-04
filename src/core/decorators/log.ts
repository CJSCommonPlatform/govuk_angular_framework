import {IGovUkGlobalConfig} from '../../interfaces';

export const logDecorator = ($delegate: ng.ILogService, $injector: ng.auto.IInjectorService,
  $window: ng.IWindowService, govUkConfig: IGovUkGlobalConfig): ng.ILogService => {
  const _error = $delegate.error;
  const $http  = <ng.IHttpService> $injector.get('$http');

  $delegate.error = <ng.ILogCall> function(...args: any[]): void {
    if (govUkConfig.errorServer) {
      const errorMessage = args[0].toString();
      const cause = args[1] || '';
      const stackTrace = args[0];
      $http({
        method: 'POST',
        url: govUkConfig.errorServer,
        data: {
          errorUrl: $window.location.href,
          errorMessage,
          stackTrace,
          cause
        }
      })
        .catch((err: any) => {
          $delegate.warn('Error logging failed');
          $delegate.log(err.data);
        });
    }
    return _error.apply(this, args);
  };

  angular.extend($delegate.error, _error);

  return $delegate;
};