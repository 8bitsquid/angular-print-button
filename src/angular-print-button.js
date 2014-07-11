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

