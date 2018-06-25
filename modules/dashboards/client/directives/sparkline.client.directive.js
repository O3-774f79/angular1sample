// (function () {
//   'use strict';

//   // Focus the element on page load
//   // Unless the user is on a small device, because this could obscure the page with a keyboard

//   angular.module('dashboards')
//     .directive('sparklinechart', sparklinechart);

//   sparklinechart.$inject = [];

//   function sparklinechart() {
//     return {
//       restrict: 'E',
//       scope: {
//         data: '@'
//       },
//       compile: function (tElement, tAttrs, transclude) {
//         tElement.replaceWith('<span>' + tAttrs.data + '</span>');
//         return function (scope, element, attrs) {
//           attrs.$observe('data', function (newValue) {
//             element.html(newValue);
//             element.sparkline('html', { type: 'line', width: '96%', height: '80px', barWidth: 11, barColor: 'blue' });
//           });
//         };
//       }
//     };
//   }
// }());
