// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var fs = require('fs');
var path = require('path');
//var archive = require('../helpers/archive-helpers.js');
var archive = require(path.join(__dirname, '../helpers/archive-helpers.js'));
var crypto = require('cryptojs');

var toArchive = [];
var cronJob = function() {

  // read sites.txt
  var sites = fs.readFileSync(archive.paths.list, 'utf-8').trim().split('\n');

  // iterate through sites
  for (var i=0; i<sites.length; i++) {
    archive.isURLArchived(sites[i], doDownload);
  }
};

// call download urls

var doDownload = function(exists, url) {
  if (!exists) {
    archive.downloadUrl(url, function() {
    });
  }
};

console.log("crypto: " + JSON.stringify(crypto));
cronJob();
