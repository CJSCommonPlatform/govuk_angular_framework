import {govUkCore, IGovUkGlobalConfig} from '../../../src/index';

describe('$log decorator', () => {

  let err = new Error('Error!');
  let $log: ng.ILogService;
  let govUkConfig: IGovUkGlobalConfig;
  let $httpBackend: ng.IHttpBackendService;
  let $window: ng.IWindowService;

  beforeEach(angular.mock.module(govUkCore));

  beforeEach(inject((_$log_: ng.ILogService, _$httpBackend_: ng.IHttpBackendService,
                     _govUkConfig_: IGovUkGlobalConfig, _$window_: ng.IWindowService) => {
    govUkConfig  = _govUkConfig_;
    $httpBackend = _$httpBackend_;
    $log         = _$log_;
    $window      = _$window_;
  }));

  it('invokes a function call when an error server is configured', () => {
    $log.error(err, 'blah');
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();

    govUkConfig.errorServer = '/api/test';
    $httpBackend.expectPOST('/api/test', {
      errorUrl:      $window.location.href,
      errorMessage: 'Error: Error!',
      stackTrace:   {},
      cause:        'blah'
    }).respond(200);
    $log.error(err, 'blah');
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('logs an error when the remote call fails', () => {
    spyOn($log, 'warn');
    spyOn($log, 'log');
    govUkConfig.errorServer = '/api/test';
    $httpBackend.whenPOST('/api/test').respond(400, 'http error');
    $log.error(err, 'blah');
    $httpBackend.flush();
    expect($log.warn).toHaveBeenCalledWith('Error logging failed');
    expect($log.log).toHaveBeenCalledWith('http error');
  });
});