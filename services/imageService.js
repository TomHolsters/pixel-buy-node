const { exec } = require('child_process');

module.exports = {
	resetAlphaMask: function (alphaMaskPath) {
		cmd = `magick convert -size 700x700 xc:white "${alphaMaskPath}"`;
		executeCommand(cmd);
	},
	createAlphaMask: function (alphaMaskPath, rectCoords) {
		cmd = `magick convert "${alphaMaskPath}" -fill "#000000" -draw "rectangle ${rectCoords}" "${alphaMaskPath}"`;
		executeCommand(cmd);
	},
	compositeImage: function (baseImagePath, overlayImgPath, alphaMaskPath, outputPath) {
		cmd = 'magick convert "' + baseImagePath + '" "' + overlayImgPath + '" "' + alphaMaskPath + '" -composite "' + outputPath + '"';
		console.log('COMMAND:\t', cmd);
		executeCommand(cmd.trim());
	},
};

function executeCommand(cmd) {
	exec(cmd, (error, stdout, stderr) => {
		if (error) console.log(`error: ${error.message}`);
		if (stderr) console.log(`stderr: ${stderr}`);
	});
}
