import {Component, Directive, Filter} from '../../src/util';

describe('angular-utils', () => {

  describe('Component', () => {

    it('decorates a class as a component', () => {
      let dependency;

      @Component({
        bindings: {
          foo: '@'
        },
        template: '<p>{{$ctrl.foo}}</p>'
      })
      class TestComponent {
        constructor($q) {
          dependency = $q;
        }
      }
      angular.mock.module(($compileProvider: ng.ICompileProvider) => {
        $compileProvider.component('testComponent', TestComponent);
      });
      inject(($compile: ng.ICompileService, $rootScope: ng.IRootScopeService, $q: ng.IQService) => {
        const element = $compile('<test-component foo="Foo!"></test-component>')($rootScope);
        $rootScope.$digest();
        // assert component configuration
        expect(element.find('p').text()).toEqual('Foo!');
        // assert dependency injection
        expect(dependency).toEqual($q);
      });
    });
  });

  describe('Directive', () => {

    it('decorates a class as a directive', () => {
      let dependency;

      @Directive({
        require: {
          ngModel: 'ngModel'
        }
      })
      class TestDirective {
        constructor($q) {
          dependency = $q;
        }
      }
      angular.mock.module(($compileProvider: ng.ICompileProvider) => {
        $compileProvider.directive('testDirective', TestDirective);
      });
      inject(($compile: ng.ICompileService, $rootScope: ng.IRootScopeService, $q: ng.IQService) => {
        const element = $compile('<input ng-model="model" test-directive>')($rootScope);
        const ctrl = element.controller('testDirective');

        // assert controller available
        expect(ctrl).toBeDefined();
        // assert directive configuration
        expect(ctrl.ngModel).toEqual(element.controller('ngModel'));
        // assert dependency injection
        expect(dependency).toEqual($q);
      });
    });
  });

  describe('Filter', () => {

    it('decorates a class a filter', () => {
      let dependency;

      @Filter()
      class TestFilter {

        constructor($q) {
          dependency = $q;
        }
        transform(val: string): string {
          return val + ' bar!';
        }
      }
      angular.module('test', []).filter('testFilter', TestFilter);
      angular.mock.module('test');
      inject((testFilterFilter: Function, $q: ng.IQService) => {
        // assert configuration
        expect(testFilterFilter('foo')).toEqual('foo bar!');
        // asset dependency injection
        expect(dependency).toEqual($q);
      });
    });
  });
});