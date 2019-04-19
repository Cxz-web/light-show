const { desktopCapturer } = require('electron')


function get() {
	
	desktopCapturer.getSources({ types: ['window'] }, (error, sources) => {
	  if (error) throw error
	  for (let i = 0; i < sources.length; ++i) {
		  console.log(sources[i].name )
	    if (sources[i].name === 'ReadyBoy') {
	      navigator.mediaDevices.getUserMedia({
	        audio: false,
	        video: {
	          mandatory: {
	            chromeMediaSource: 'desktop',
	            chromeMediaSourceId: sources[i].id,
	            minWidth: 1280,
	            maxWidth: 1280,
	            minHeight: 720,
	            maxHeight: 720
	          }
	        }
	      }).then((stream) => handleStream(stream))
	        .catch((e) => handleError(e))
	      return
	    }
	  }
	})
	
	function handleStream (stream) {
		console.log(stream)
	  const video = document.getElementById('my')
	  video.srcObject = stream
	  video.onloadedmetadata = (e) => video.play()
	}
	
	function handleError (e) {
	  console.log(e)
	}
}


export default get