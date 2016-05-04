import {IGovUkGlobalConfig, IGovUkPermissionsConfig} from '../../interfaces';

export class GovUkConfigService {

  static $inject = ['$http', '$q'];

  constructor(private _$http: ng.IHttpService, private _$q: ng.IQService) {}

  getGlobal(): ng.IPromise<IGovUkGlobalConfig> {
    return this._$q.all([
      this._$http.get('./app/config/app.config.json'),
      this._$http.get('./app/config/app.override.config.json')
    ])
      .then(results => angular.extend({}, results[0].data, results[1].data));
  }

  getPermissions(): ng.IPromise<IGovUkPermissionsConfig> {
    return this._$http.get('./app/config/permissions.config.json')
      .then(res => res.data);
  }
}