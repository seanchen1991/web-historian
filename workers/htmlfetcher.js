
// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var fs = require('fs');
var path = require('path');
var archive = require(path.join(__dirname, '../helpers/archive-helpers.js'));
var crypto = require('cryptojs');



var cronJob = function() {
  archive.readListOfUrls(function(error, result) {

    if(error) {

      archive.log("selecting urls failed");

    } else {


      for (var i = 0; i < result.length; i++) {

        archive.log("downloading: "+result[i]['url']);
        archive.downloadUrl(result[i]['url'], function(error) {
          if (error) {
            archive.log("Download failed for: " + result[i]['url']);
          }
        });
      }

    }
    archive.closeMysql();
  });


};

cronJob();
