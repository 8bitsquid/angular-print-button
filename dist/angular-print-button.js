angular.module('printButton', ['8bitsquid.printButton']);

angular.module('8bitsquid.printButton', ['templates.printButton'])

    .factory('PrintFactory', ['$window', '$templateCache', '$compile', '$rootScope', function($window, $templateCache, $compile, $rootScope){

        var templates = {
            html: 'print_templates/print_image/print-image.tpl.html',
            css: 'print_templates/print_image/print-image.tpl.css'
        };

        function setTemplates(tpl){
            angular.copy(tpl, templates);
        }
        
        function getTemplate(type){
            return $templateCache.get(templates[type]);
        }

        return function(items){
            // Inspiration from printThis.js: https://github.com/jasonday/printThis/blob/master/printThis.js#L40-L69
            var IE = navigator.userAgent.match(/msie/i);
            var strFrameName = "printThis-" + (new Date()).getTime();
            var frame = angular.element("<iframe scrolling='no' id='" + strFrameName + "' name='printIframe' />");
            angular.element(document.body).append(frame);

            var $iframe = angular.element(document.getElementById(strFrameName));
            $iframe.css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: '-150%',
                left: '-150%',
                border: 'none',
                margin: '0'
            });
            $iframe[0].contentWindow.document.write($templateCache.get('print_templates/print-page.tpl.html'));

            var $doc = $iframe.contents();
            if (IE){
                $doc.find("head").append('<script>document.domain="' + document.domain + '";</script>');
            }

            setTimeout(function(){

                var html = getTemplate('html');
                var css = getTemplate('css');

                $doc.find('style').append(css);
                $doc.find('body').append(html);

                var scope = $rootScope.$new(true);
                scope.items = items;
                $compile($doc)(scope);
                scope.$apply();

                setTimeout(function() {
                    if (IE) {
                        window.frames["printIframe"].focus();
                        $iframe[0].contentWindow.document.execCommand('print', false, null);

                    } else {
                        $iframe[0].contentWindow.focus();
                        $iframe[0].contentWindow.print();
                    }
                    var close = setInterval(function(){
                        if(document.readyState=="complete") {
                            $iframe.remove();
                            clearInterval(close);
                        }
                    }, 400);
                }, 300);
            }, 200);
        };
    }])

    .factory('PrintImage', ['PrintFactory', '$q', function(PrintFactory, $q){

        function loadImage(src, index){
            var deferred = $q.defer();
            var img = new Image();

            img.onload = function(){
                deferred.resolve({img: img, index: index});
            };
            img.src = src;

            return deferred.promise;
        }

        return function(items){
            var total = items.length;
            var loaded = 1;
            for (var i=0; i<total; i++){
                loadImage(items[i].src, i).then(function(item){
                    items[item.index].orientation = item.img.width > item.img.height ? 'landscape' : 'portrait';
                    if (loaded < total) loaded++;
                    else {
                        PrintFactory(items);
                    }
                })
            }
        }
    }])

    .directive('printImage', ['PrintImage', function(PrintImage){
        return {
            restrict: 'AC',
            link: function(scope){
                scope.print = function(items){
                    PrintImage(items);
                }
            }
        }
    }]);



angular.module('templates.printButton', ['print_templates/print-page.tpl.html', 'print_templates/print_image/print-image.tpl.css', 'print_templates/print_image/print-image.tpl.html']);

angular.module("print_templates/print-page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("print_templates/print-page.tpl.html",
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "    <head>\n" +
    "        <title>Printing Items</title>\n" +
    "        <style type=\"text/css\" rel=\"stylesheet\" media=\"all\">\n" +
    "            html, body{\n" +
    "                height: 100%;\n" +
    "                width: 100%;\n" +
    "            }\n" +
    "        </style>\n" +
    "    </head>\n" +
    "    <body>\n" +
    "    </body>\n" +
    "</html>");
}]);

angular.module("print_templates/print_image/print-image.tpl.css", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("print_templates/print_image/print-image.tpl.css",
    "@page{size: auto; margin: 0mm;}\n" +
    "body{margin: 0px}\n" +
    "img { max-width: 100% !important; max-height: 100% !important; display: block; page-break-before: always;}\n" +
    ".landscape { width: 100%; height: auto; }\n" +
    ".portrait {height: 100%;width: auto; }");
}]);

angular.module("print_templates/print_image/print-image.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("print_templates/print_image/print-image.tpl.html",
    "<img print-image ng-src=\"{{item.src}}\" ng-class=\"item.orientation\" ng-repeat=\"item in items\"/>");
}]);
