const sharp = require('sharp');

module.exports = {
	resize: function (input, output) {
		sharp(input)
			.resize(300, 200)
			.toFile(output, function (err) {
				if (err) console.log(err);
				// output.jpg is a 300 pixels wide and 200 pixels high image
				// containing a scaled and cropped version of input.jpg
			});
	},
	tile: function (input, output) {
		input = `./public/${input}`;
		output = `./public/${output}`;
		console.log(input, output);
		sharp(input)
			.png()
			.tile({
				size: 512,
				depth: 'onetile',
				// skipBlanks: hexToDec('80'), //32768, // number
				container: 'fs', //'zip',
				layout: 'dz', // 'iiif' 'zoomify' 'google'
			})
			.toFile(output, function (err, info) {
				// output.dzi is the Deep Zoom XML definition
				// output_files contains 512x512 tiles grouped by zoom level
			});
	},
};

const hexToDec = (n) => parseInt(n, 16);
