import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DrawCanvas from './components/DrawCanvas';
import { resetCanvasAction, setCoordinatesAction } from './store/canvas/actions';
import { CanvasState } from './store/canvas/reducer';
import OpenSeadragon from 'openseadragon';

function App(): JSX.Element {
	let base_url = 'localhost';
	let port = '3030';
	const dispatch = useDispatch();
	const [imgLocation, setImgLocation] = useState<string>('result.jpg');
	const coordinates = useSelector(
		(state: CanvasState) => state.data.coordinates,
		(nextState, previousState) => false
	);

	const buyPixels = async () => {
		dispatch(
			setCoordinatesAction({
				startX: 0,
				startY: 0,
				endX: 0,
				endY: 0,
			})
		);
		dispatch(resetCanvasAction(true));

		const params = new URLSearchParams();
		params.append('startX', coordinates.startX.toString());
		params.append('startY', coordinates.startY.toString());
		params.append('endX', coordinates.endX.toString());
		params.append('endY', coordinates.endY.toString());

		await axios.post(`http://${base_url}:${port}/buy`, params, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},
		});
		await axios.post(`http://${base_url}:${port}/composite_image`);

		let result = await axios.get(`http://${base_url}:${port}/latest_image`);
		let hash = Date.now();
		//setImgLocation(`${result.data.location}?${hash}`);
		setImgLocation(`${result.data.location}?${hash}`);
	};

	const reset = async () => {
		await axios.get(`http://${base_url}:${port}/reset`, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},
		});
		let hash = Date.now();
		let imgLoc = imgLocation.indexOf('?') === -1 ? imgLocation + '?' + hash : imgLocation.substr(0, imgLocation.indexOf('?')) + '?' + hash;
		setImgLocation(imgLoc);
	};

	const resize = async () => {
		await axios.get(`http://${base_url}:${port}/resizer`, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},
		});
	};

	const tile = async () => {
		let r = await axios.get(`http://${base_url}:${port}/tile`, {
			headers: {
				// 'content-type': 'application/x-www-form-urlencoded',
			},
		});

    console.log(r.data);
    
    let source = await axios.get(`http://${base_url}:${port}/${r.data.dzi}`, {
			headers: {
				// 'content-type': 'application/x-www-form-urlencoded',
			},
    });
    
    console.log(source)

		OpenSeadragon({
      id: 'osd',
      prefixUrl: '/openseadragon/images/',
      // crossOriginPolicy: 'use-credentials',
      ajaxHeaders: {'Access-Control-Allow-Origin': true},
      tileSources: {
        url: `http://${base_url}:${port}/${source.data.dzi}`,
        
        ajaxWithCredentials: true,
      },
			// tileSources: {
      //   type: 'image',
      //   Image: {
      //     // url: `http://${base_url}:${port}/${r.data.location}`,
      //     Url: `http://${base_url}:${port}/resize/${r.data.location}/`,
      //     Format: 'png',
      //     Overlap: '0',
      //     xmlns: 'http://schemas.microsoft.com/deepzoom/2008',
      //     TileSize: '512',
      //     Size: {
      //       Height: '3000',
      //       Width: '4000'
      //     }
      //   },
			// },
		});
	};

	const updateImg = async () => {
		const result = await axios.get(`http://${base_url}:${port}/latest_image`);
		const loc = `http://${base_url}:${port}/${result.data.location}`;
		console.log(loc);
		setImgLocation(loc);
	};

	return (
		<div className='App'>
			<h1>Pixel buy POC</h1>
			<p>{`http://${base_url}:${port}/${imgLocation}`}</p>
			<div className='grid'>
				<div className='column-12 position-relative'>
					<DrawCanvas />
					<img className='img-position' src={`http://${base_url}:${port}/${imgLocation}`} />
				</div>
				<div className='column-12'>
					<p>
						Start coordinates: {coordinates.startX} - {coordinates.startY}
					</p>
					<p>
						End coordinates: {coordinates.endX} - {coordinates.endY}
					</p>
					<button onClick={buyPixels}>Buy pixels</button>
					<p></p>
					<button onClick={reset}>DEV: Reset mask</button>
					<p></p>
					<button onClick={resize}>DEV: Resize</button>
					<p></p>
					<button onClick={tile}>DEV: Tile</button>
					<p>VIEWER</p>
					<div id='osd'></div>
				</div>
			</div>
		</div>
	);
}

export default App;
