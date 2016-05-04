import {GovUkConfigService} from '../core/services/config';
import {IGovUkBootstrapConfig} from '../interfaces';

/**
 * @ngdoc function
 * @name bootstrap
 * @description
 * Use this function to bootstrap any cpp application.
 *
 * This is a wrapper around angular.bootstrap that will fetch global configuration and
 * permissions prior to calling angular.bootstrap on the passed module(s). Subsequently, the
 * bootstrapped modules will be configured with the ui.router states for the application, and the
 * `cppGlobalConfig` and `cppPermissions` constants, which can be injected into the configuration
 * stage of the app.
 *
 * ```html
 * <!doctype html>
 * <html>
 * <body>
 *   <script>
 *     cpp.bootstrap(document, ['my-cpp-app']);
 *   </script>
 * </body>
 * </html>
 * ```
 *
 * @param {DOMElement} element DOM element which is the root of angular application.
 * @param {Array<String|Function|Array>=} modules an array of modules to load into the application.
 *     Each item in the array should be the name of a predefined module or a (DI annotated)
 *     function that will be invoked by the injector as a `config` block.
 *     See: {@link angular.module modules}
 * @param {Object=} config an object for defining configuration options for the application. The
 *     following keys are supported:
 *
 * * `strictDi` - disable automatic function annotation for the application. This is meant to
 *   assist in finding bugs which break minified code. Defaults to `false`.
 * * `global` - global configuration to use in place of a remote source
 * * `permissions` - permissions configuration to use in place of a remote source
 *
 * @return {Promise} promise a promise that resolves when the element is bootstrapped
 */

export function bootstrap(element: string|Element|JQuery|Document,
  modules?: (string|Function|any[])[], config?: IGovUkBootstrapConfig): ng.IPromise<any> {

  const injector = angular.injector(['ng']);
  const $q = <ng.IQService> injector.get('$q');
  const cps = <GovUkConfigService> injector.get('GovUkConfigService');
  const {global, permissions} = config || <IGovUkBootstrapConfig> {};

  return $q.all([
    global      ? $q.when(global)      : cps.getGlobal(),
    permissions ? $q.when(permissions) : cps.getPermissions()
  ])
    .then(results => {
      const defer = $q.defer();

      modules.unshift('cpp-core');
      modules.push(applyConfig);

      angular.element(document).ready(function () {
        angular.bootstrap(element, modules, config);
        defer.resolve();
      });

      function applyConfig($stateProvider, $provide): void {
        $provide.constant('cppGlobalConfig', results[0]);
        $provide.constant('cppPermissions',  results[1]);

        angular.forEach(results[2], (conf: any, state: string) => {
          $stateProvider.state(state, conf);
        });
      }
      return defer.promise;
    });
}