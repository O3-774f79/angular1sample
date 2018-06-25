(function () {
  'use strict';

  describe('Userguides Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserguidesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserguidesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserguidesService = _UserguidesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('userguides');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userguides');
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
          UserguidesController,
          mockUserguide;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userguides.view');
          $templateCache.put('modules/userguides/client/views/view-userguide.client.view.html', '');

          // create mock Userguide
          mockUserguide = new UserguidesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userguide Name'
          });

          // Initialize Controller
          UserguidesController = $controller('UserguidesController as vm', {
            $scope: $scope,
            userguideResolve: mockUserguide
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userguideId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userguideResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userguideId: 1
          })).toEqual('/userguides/1');
        }));

        it('should attach an Userguide to the controller scope', function () {
          expect($scope.vm.userguide._id).toBe(mockUserguide._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/userguides/client/views/view-userguide.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserguidesController,
          mockUserguide;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('userguides.create');
          $templateCache.put('modules/userguides/client/views/form-userguide.client.view.html', '');

          // create mock Userguide
          mockUserguide = new UserguidesService();

          // Initialize Controller
          UserguidesController = $controller('UserguidesController as vm', {
            $scope: $scope,
            userguideResolve: mockUserguide
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userguideResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/userguides/create');
        }));

        it('should attach an Userguide to the controller scope', function () {
          expect($scope.vm.userguide._id).toBe(mockUserguide._id);
          expect($scope.vm.userguide._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/userguides/client/views/form-userguide.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserguidesController,
          mockUserguide;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('userguides.edit');
          $templateCache.put('modules/userguides/client/views/form-userguide.client.view.html', '');

          // create mock Userguide
          mockUserguide = new UserguidesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userguide Name'
          });

          // Initialize Controller
          UserguidesController = $controller('UserguidesController as vm', {
            $scope: $scope,
            userguideResolve: mockUserguide
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userguideId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userguideResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userguideId: 1
          })).toEqual('/userguides/1/edit');
        }));

        it('should attach an Userguide to the controller scope', function () {
          expect($scope.vm.userguide._id).toBe(mockUserguide._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/userguides/client/views/form-userguide.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
