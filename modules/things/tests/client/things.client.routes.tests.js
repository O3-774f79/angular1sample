(function () {
  'use strict';

  describe('Things Route Tests', function () {
    // Initialize global variables
    var $scope,
      ThingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ThingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ThingsService = _ThingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('things');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/things');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ThingsController,
          mockThing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('things.view');
          $templateCache.put('modules/things/client/views/view-thing.client.view.html', '');

          // create mock Thing
          mockThing = new ThingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Thing Name'
          });

          // Initialize Controller
          ThingsController = $controller('ThingsController as vm', {
            $scope: $scope,
            thingResolve: mockThing
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:thingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.thingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            thingId: 1
          })).toEqual('/things/1');
        }));

        it('should attach an Thing to the controller scope', function () {
          expect($scope.vm.thing._id).toBe(mockThing._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/things/client/views/view-thing.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ThingsController,
          mockThing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('things.create');
          $templateCache.put('modules/things/client/views/form-thing.client.view.html', '');

          // create mock Thing
          mockThing = new ThingsService();

          // Initialize Controller
          ThingsController = $controller('ThingsController as vm', {
            $scope: $scope,
            thingResolve: mockThing
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.thingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/things/create');
        }));

        it('should attach an Thing to the controller scope', function () {
          expect($scope.vm.thing._id).toBe(mockThing._id);
          expect($scope.vm.thing._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/things/client/views/form-thing.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ThingsController,
          mockThing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('things.edit');
          $templateCache.put('modules/things/client/views/form-thing.client.view.html', '');

          // create mock Thing
          mockThing = new ThingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Thing Name'
          });

          // Initialize Controller
          ThingsController = $controller('ThingsController as vm', {
            $scope: $scope,
            thingResolve: mockThing
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:thingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.thingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            thingId: 1
          })).toEqual('/things/1/edit');
        }));

        it('should attach an Thing to the controller scope', function () {
          expect($scope.vm.thing._id).toBe(mockThing._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/things/client/views/form-thing.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
