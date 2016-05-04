import {GovUkConfigService} from './services/config';
import {CONFIG} from './constants/config';
import {logDecorator} from './decorators/log';
import {PERMISSIONS} from './constants/permissions';

export * from './services/config';

const module = angular.module('govuk-angularjs-framework', [
  'ui.router',
  'permission'
])
  .constant('govUkConfig', CONFIG)
  .constant('govUkPermissions', PERMISSIONS)
  .service('GovUkConfigService', GovUkConfigService)
  .decorator('$log', logDecorator);

export const govUkCore: string = module.name;