const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const imgService = require('./services/imageService');
const dzi = require('./services/dziService');

const app = express();
const port = 3030;

const alpha = './assets/alphas/alpha.jpg';
const result = 'result.jpg';

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var corsOptions = {
	origin: true,
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.get('/reset', (req, res) => {
	imgService.resetAlphaMask(alpha);
	imgService.compositeImage('./assets/base_image.jpg', './assets/base_overlay.jpg', alpha, `./public/${result}`);
	res.sendStatus(200);
});

app.get('/latest_image', (req, res) => {
	let r = Math.floor(Math.random() * 1001);
	console.log('Latest:\t', r);
	res.send({ location: `${result}` });
});
app.post('/composite_image', (req, res) => {
	imgService.compositeImage('./assets/base_image.jpg', './assets/base_overlay.jpg', alpha, `./public/${result}`);
	res.sendStatus(204);
});

app.get('/tile', cors(corsOptions), (req, res) => {
	let output = 'resize/output';
	dzi.tile('result1.jpg', output);
	res.send({ dzi: 'resize/output.dzi', location: `resize/output_files` });
});

app.post('/buy', (req, res) => {
	let rectangle = Object.keys(req.body).map((key) => req.body[key]);
	imgService.createAlphaMask(alpha, rectangle);
	//	imgService.compositeImage('./assets/base_image.jpg', './assets/base_overlay.jpg', alpha, `./public/${result}`);

	res.sendStatus(200);
});

app.listen(port, () => console.log(`Node app listening @ http://localhost:${port}`));
