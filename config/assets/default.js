'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
         // bower:css
        'public/font/DB_Ozone_X/stylesheet.css',
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/slick-carousel/slick/slick.css',
        'public/lib/slick-carousel/slick/slick-theme.css',
        'public/lib/angular-tooltips/dist/angular-tooltips.min.css',
        'public/lib/angucomplete-alt/angucomplete-alt.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/jquery/dist/jquery.js',
        'public/lib/jquery-ui/jquery-ui.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-route/angular-route.min.js',
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-bootstrap/ui-bootstrap.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angularjs-gauge/src/angularjs-gauge.js',
        'public/lib/chart.js/dist/Chart.min.js',
        'public/lib/angular-chart.js/dist/angular-chart.min.js',
        'public/lib/ngmap/build/scripts/ng-map.min.js',
        'public/lib/angular-ui-sortable/sortable.min.js',
        'public/lib/angular-qr-scanner/src/jsqrcode-combined.min.js',
        'public/lib/angular-tooltips/dist/angular-tooltips.min.js',
        'public/lib/angucomplete-alt/angucomplete-alt.js',
        'public/lib/angular-mqtt/src/browserMqtt.js',
        'public/lib/JavaScript-Load-Image/js/load-image.all.min.js',
        'public/lib/angular-numeric-input/dist/angular-numeric-input.min.js',
        'public/lib/angular-mqtt/src/angular-MQTT.js',
        // 'public/lib/angular-sanitize/angular-sanitize.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js',
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    // sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
