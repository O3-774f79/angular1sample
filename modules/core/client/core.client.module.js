(function (app) {
  'use strict';

  app.registerModule('core');
  app.registerModule('core', ['ui.numericInput']);
  app.registerModule('core.routes', ['ui.router']);
  app.registerModule('core.admin', ['core']);
  app.registerModule('core.admin.routes', ['ui.router', 'ui.bootstrap']);
}(ApplicationConfiguration));
