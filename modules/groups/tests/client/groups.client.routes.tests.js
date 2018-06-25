(function () {
  'use strict';

  describe('Groups Route Tests', function () {
    // Initialize global variables
    var $scope,
      GroupsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GroupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GroupsService = _GroupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('groups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/groups');
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
          GroupsController,
          mockGroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('groups.view');
          $templateCache.put('modules/groups/client/views/view-group.client.view.html', '');

          // create mock Group
          mockGroup = new GroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Group Name'
          });

          // Initialize Controller
          GroupsController = $controller('GroupsController as vm', {
            $scope: $scope,
            groupResolve: mockGroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:groupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.groupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            groupId: 1
          })).toEqual('/groups/1');
        }));

        it('should attach an Group to the controller scope', function () {
          expect($scope.vm.group._id).toBe(mockGroup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/groups/client/views/view-group.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GroupsController,
          mockGroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('groups.create');
          $templateCache.put('modules/groups/client/views/form-group.client.view.html', '');

          // create mock Group
          mockGroup = new GroupsService();

          // Initialize Controller
          GroupsController = $controller('GroupsController as vm', {
            $scope: $scope,
            groupResolve: mockGroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.groupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/groups/create');
        }));

        it('should attach an Group to the controller scope', function () {
          expect($scope.vm.group._id).toBe(mockGroup._id);
          expect($scope.vm.group._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/groups/client/views/form-group.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GroupsController,
          mockGroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('groups.edit');
          $templateCache.put('modules/groups/client/views/form-group.client.view.html', '');

          // create mock Group
          mockGroup = new GroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Group Name'
          });

          // Initialize Controller
          GroupsController = $controller('GroupsController as vm', {
            $scope: $scope,
            groupResolve: mockGroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:groupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.groupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            groupId: 1
          })).toEqual('/groups/1/edit');
        }));

        it('should attach an Group to the controller scope', function () {
          expect($scope.vm.group._id).toBe(mockGroup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/groups/client/views/form-group.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
