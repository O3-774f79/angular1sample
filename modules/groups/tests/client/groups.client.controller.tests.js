(function () {
  'use strict';

  describe('Groups Controller Tests', function () {
    // Initialize global variables
    var GroupsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      GroupsService,
      mockGroup;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _GroupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      GroupsService = _GroupsService_;

      // create mock Group
      mockGroup = new GroupsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Group Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Groups controller.
      GroupsController = $controller('GroupsController as vm', {
        $scope: $scope,
        groupResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleGroupPostData;

      beforeEach(function () {
        // Create a sample Group object
        sampleGroupPostData = new GroupsService({
          name: 'Group Name'
        });

        $scope.vm.group = sampleGroupPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (GroupsService) {
        // Set POST response
        $httpBackend.expectPOST('api/groups', sampleGroupPostData).respond(mockGroup);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Group was created
        expect($state.go).toHaveBeenCalledWith('groups.view', {
          groupId: mockGroup._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/groups', sampleGroupPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Group in $scope
        $scope.vm.group = mockGroup;
      });

      it('should update a valid Group', inject(function (GroupsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/groups\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('groups.view', {
          groupId: mockGroup._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (GroupsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/groups\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Groups
        $scope.vm.group = mockGroup;
      });

      it('should delete the Group and redirect to Groups', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/groups\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('groups.list');
      });

      it('should should not delete the Group and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
