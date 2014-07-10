angular.module('printButton', ['8bitsquid.printButton']);

angular.module('8bitsquid.printButton', ['templates.printButton'])

    .service('PrintService', ['$window', '$compile', function($window, $compile){
        var tplvars = {};
        tplvars.css = "@page{size: auto; margin: 0mm;} body{margin: 0px}  @media all { display: block; page-break-before: always; } .landscape { width: 100%; height: auto;} .portrait {height: 100%;width: auto;}";
        tplvars.js = "function print_items(){ window.focus(); window.print(); window.close(); ";

        this.print = function(items){
            tplvars.items = items;
            var tpl = $templateCache.get('templates/print-page.tpl.html');
            if (tpl){
                var printpage = $compile(tpl)(tplvars);
                var printwin = $window.open('about:blank', '_print');
                printwin.document.open();
                printwin.document.write(printpage);
                printwin.document.close();
            }
            else{
                console.log('template not found');
            }
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
    }])

    .directive('printImage', [function(){
        return {
            restrict: 'AC',
            scope: {},
            link: function(scope, elm, attrs){
                if (angule.isDefined(attrs.item.src)){
                    var img = new Image();
                    img.onload = function(){
                        scope.orientation = img.width > img.height ? 'landscape' : 'portrait';
                    }
                }
            }
        }
    }])

