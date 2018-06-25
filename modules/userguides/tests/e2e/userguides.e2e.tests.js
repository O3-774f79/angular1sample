'use strict';

describe('Userguides E2E Tests:', function () {
  describe('Test Userguides page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userguides');
      expect(element.all(by.repeater('userguide in userguides')).count()).toEqual(0);
    });
  });
});
