window.onload = function () {
    let file = document.getElementById("file")
    let canvas = document.getElementById("canvas")
    let audio = document.getElementById("audio")

    file.onchange = function () {
        let files = this.files
        audio.src = URL.createObjectURL(files[0])
        audio.load()
        audio.play()

        let audioContext = new AudioContext()
        let source = audioContext.createMediaElementSource(audio)
        let analyser = audioContext.createAnalyser()

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        let ctx = canvas.getContext("2d")

        source.connect(analyser)
        analyser.connect(audioContext.destination)

        analyser.fftSize = 256

        let bufferLength = analyser.frequencyBinCount
        
        let dataArray = new Uint8Array(bufferLength)

        let w = canvas.width
        let h = canvas.height

        let barWidth = (w / bufferLength) * 2
        let barHeight

        let x = 0

        function renderFrame() {
            requestAnimationFrame(renderFrame)
            x = 0
            analyser.getByteFrequencyData(dataArray)

            ctx.fillStyle = "black"
            ctx.fillRect(0, 0, w, h)

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i]
                
                let r = barHeight + (25 * (i / bufferLength))
                let g = 250 * (i / bufferLength)
                let b = 50

                ctx.fillStyle = `rgb(${r},${g},${b})`
                ctx.fillRect(x, h - barHeight, barWidth, barHeight)

                x += barWidth + 1
            }
        }

        renderFrame()
        audio.play()
    }
}