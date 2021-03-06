const fs = require('fs');
const wget = require('wget-improved');
const exec = require('child_process').exec;
const path = require('path');

module.exports = function(blankShirtMockupDirectory, blankFileNameHashed, remoteFile, width, callbackFunction) {
    let localFile = path.join(blankShirtMockupDirectory, blankFileNameHashed);
    try {
        if(fs.statSync(localFile).isFile()) {
            scale(blankShirtMockupDirectory, blankFileNameHashed, width, callbackFunction);
        }
    } catch(e) {
        console.log("We don't have it yet so we're downloading ", remoteFile)
		const options = {};
		let download = wget.download(remoteFile, localFile, options);
		download.on('error', function(err) {
		    console.log(err);
		});
		download.on('start', function(fileSize) {
		    console.log(fileSize);
		});
		download.on('end', function(output) {
		    console.log(output);
            scale(blankShirtMockupDirectory, blankFileNameHashed, width, callbackFunction);
		});
		download.on('progress', function(progress) {
		    typeof progress === 'number'
		    // code to show progress bar
		});
    }
    
};

function scale(blankShirtMockupDirectory, blankFileNameHashed, width, callbackFunction) {
    let scaledFileName = blankShirtMockupDirectory + "/scaled/" + width + "x" + blankFileNameHashed
    try {
        if(fs.statSync(scaledFileName).isFile()) {
            callbackFunction
        }
    } catch(e) {
        let cliCommand = "convert -resize " + width + "x " + blankShirtMockupDirectory + '/' + blankFileNameHashed + " " + scaledFileName
        // let cliCommand = "cp " + blankShirtMockupDirectory + '/' + blankFileNameHashed + " " + scaledFileName
        exec(cliCommand, 
            function (error, stdout, stderr) {
        	console.log(cliCommand)
                if(error) console.log("there isn't really an error with scaling the image down so.... idk.... ERROR")
                // This callback is invoked once the child terminates
                // You'd want to check err/stderr as well!
    
    			callbackFunction
    
                console.log(stdout)
           } 
        );
    }
}