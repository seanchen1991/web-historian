var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var crypto = require('cryptojs');
var req = require("request");
var saltwaterc = require("http-request");

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */
var sites = [];

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public/'),
  'archivedSites' : path.join(__dirname, '../archives/sites/'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};


// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf-8', function(error, data) {
    if (!error) {
      sites = data.split('\n');
    }
    callback(error);
  });
};

exports.isUrlInList = function(url){
  return (sites.indexOf(url) !== -1);
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths, url, function(error) {
    callback(error);
  });
};

exports.isURLArchived = function(url, callback){
  var hash = crypto.Crypto.SHA1(url);
  console.log("hashed url: " + hash);
  console.log("checking to see if url is archived: " + url);
  fs.exists(exports.paths.archivedSites + hash, function(exists) {
    callback(exists, url);
  });
};

exports.downloadUrl = function(url, callback){
    var hash = crypto.Crypto.SHA1(url);
    exports.log("downloading: "+url+" to: "+hash);


  saltwaterc.get({ url: url }, exports.paths.archivedSites + hash, function (err, res) {
    callback(err);
  });
};




exports.downloadUrls = function(callback){
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i=0; i<args.length; i++) {
    downloadUrl(args[i], callback);
  }
};

exports.log = function(string) {
  fs.appendFile("web-historian.log", string+'\n');
};

