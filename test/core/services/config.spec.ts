import {govUkCore, GovUkConfigService} from '../../../src/index';

describe('GovUkConfigService', () => {

  let service: GovUkConfigService;
  let $httpBackend: ng.IHttpBackendService;
  let promiseValue: any;

  beforeEach(angular.mock.module(govUkCore));

  beforeEach(inject((GovUkConfigService: GovUkConfigService, _$httpBackend_: ng.IHttpBackendService) => {
    service = GovUkConfigService;
    $httpBackend = _$httpBackend_;
    promiseValue = null;
  }));

  function setPromiseValue(result) {
    promiseValue = result;
  }

  describe('#getGlobal', () => {

    it('fetches configuration from the api', () => {
      $httpBackend.whenGET('./app/config/app.config.json').respond({
        apiRoot:     'coreApiRoot',
        errorServer: 'coreErrorServer'
      });
      $httpBackend.whenGET('./app/config/app.override.config.json').respond({
        apiRoot:     'overrideApiRoot'
      });
      service.getGlobal().then(setPromiseValue);
      $httpBackend.flush();
      expect(promiseValue).toEqual({
        apiRoot: 'overrideApiRoot',
        errorServer: 'coreErrorServer'
      });
    });
  });

  describe('#getPermissions', () => {

    it('fetches permissions', () => {
      $httpBackend.whenGET('./app/config/permissions.config.json').respond({permission: 1});
      service.getPermissions().then(setPromiseValue);
      $httpBackend.flush();
      expect(promiseValue).toEqual({permission: 1});
    });
  });
});