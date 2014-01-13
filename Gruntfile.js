/*
 * Code licensed under the MIT License:
 * https://github.com/abricos/abricos.js/blob/master/LICENSE
 *
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

var path = require('path');

// -- Globals ------------------------------------------------------------------
var ROOT = process.cwd();

// -- Config -------------------------------------------------------------------
module.exports = function(grunt) {
	grunt.initConfig({

		clean: {
	        main: ['build/']
	    },
	    
		jshint: {
		    options: {
		        jshintrc: '.jshintrc'
		    },
		    files: 'src/**/*.js'
		},
		
        concat: {
            main: {
                src: [
                    'src/abricos.js'
                ],
                dest: 'build/abricos.js'
            }
        },
        
        uglify: {
        	options: {
        		mangle: false
    	    },        	
            main: {
                files: {
                    'build/abricos-min.js': '<%= concat.main.dest %>'
                }
            }
        }
    });
	
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');    
    
    grunt.registerTask('default', ['clean', 'concat', 'uglify']);
    
};