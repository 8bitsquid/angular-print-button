angular.module('printButton', ['8bitsquid.printButton']);

angular.module('8bitsquid.printButton', ['templates.printButton'])

    .service('PrintService', ['$window', '$templateCache', '$q', function($window, $templateCache, $q){
        var items, printwin;
        var tpl = $templateCache.get('templates/print-page.tpl.html');

        this.print = function(itemsList){
            items = itemsList;
            printwin = $window.open('about:blank', '_print');

            loadItems().then(function(){
                printwin.document.write(tpl);
                printwin.document.close();
            });
        }

        function loadItems(){
            var deferred = $q.defer();

            setTimeout(function(){
                printwin.document.open();
                printwin.items = items;
                deferred.resolve();
            }, 100)

            return deferred.promise;
        }
    }])

    .directive('printButton', ['PrintService', function(PrintService){
        return {
            restrict: 'AC',
            link: function(scope){
                scope.print = function(items){
                    PrintService.print(items);
                }
            }
        }
    }]);


angular.module('templates.printButton', ['templates/print-page.tpl.html']);

angular.module("templates/print-page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/print-page.tpl.html",
    "<html ng-app=\"print\">\n" +
    "    <head>\n" +
    "        <title>Printing Items</title>\n" +
    "        <style type=\"text/css\">\n" +
    "            @page{size: auto; margin: 0mm;}\n" +
    "            body{margin: 0px}  @media all { display: block; page-break-before: always; }\n" +
    "            img { max-width: 100% !important; max-height: 100% !important; }\n" +
    "            .landscape { width: 100%; height: auto; }\n" +
    "            .portrait {height: 100%;width: auto; }\n" +
    "        </style>\n" +
    "    </head>\n" +
    "    <body ng-controller=\"PrintCtrl\">\n" +
    "        <img print-image ng-src=\"{{item.src}}\" ng-class=\"item.orientation\" ng-repeat=\"item in items\" />\n" +
    "        <script src=\"//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.min.js\"></script>\n" +
    "        <script>\n" +
    "            angular.module('print', [])\n" +
    "                    .controller('PrintCtrl', ['$scope', '$q', function($scope, $q){\n" +
    "                        $scope.items = window.items;\n" +
    "                    }])\n" +
    "                    .directive('printImage', [function(){\n" +
    "                        return {\n" +
    "                            restrict: 'AC',\n" +
    "                            controller: ['$q', function($q){\n" +
    "                                this.loadImage = function(src){\n" +
    "                                    var deferred = $q.defer();\n" +
    "                                    var img = new Image();\n" +
    "\n" +
    "                                    img.onload = function(){\n" +
    "                                        deferred.resolve(img);\n" +
    "                                    };\n" +
    "                                    img.src = src;\n" +
    "\n" +
    "                                    return deferred.promise;\n" +
    "                                };\n" +
    "                            }],\n" +
    "                            link: function(scope, elm, attrs, Ctrl){\n" +
    "                                console.log(scope);\n" +
    "                                Ctrl.loadImage(scope.item.src).then(function(img){\n" +
    "                                    scope.item.orientation = img.width > img.height ? 'landscape' : 'portrait';\n" +
    "                                    if (scope.$last){\n" +
    "                                        var t = setTimeout(function(){\n" +
    "                                            window.focus(); window.print(); window.close();\n" +
    "                                            clearTimeout(t);\n" +
    "                                        }, 100);\n" +
    "                                    }\n" +
    "                                });\n" +
    "                            }\n" +
    "                        }\n" +
    "                    }])\n" +
    "        </script>\n" +
    "    </body>\n" +
    "</html>");
}]);
