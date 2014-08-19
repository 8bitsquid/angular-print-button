module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('default', ['html2js', 'concat', 'clean']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/*.tpl.js'],
        html2js: {
            build: {
                options:{
                    base: 'src/'
                },
                src: 'src/**/*.tpl.*',
                dest: 'dist/angular-print-button.tpl.js',
                module: 'templates.printButton'
            }
        },
        concat: {
            js: {
                src: ['src/**/*.js', 'dist/*.tpl.js'],
                dest: 'dist/angular-print-button.js'
            },
            css: {
                src: ['src/**/*.css'],
                dest: 'dist/angular-print-button.css'
            }
        }
    });
};