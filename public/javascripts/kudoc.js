// angular.module('kudoc', ['live2skull.navbar'])
angular.module('kudoc', ['kudoc.clientAPI'])

.run(['$anchorScroll', function($anchorScroll) {
    $anchorScroll.yOffset = 50;
    console.log('live2skull kudoc AngularJS Loaded!')
}])