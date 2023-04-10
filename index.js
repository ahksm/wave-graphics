window.onload = function () {
    class WaveDrawer {
        constructor(
            canvasId,
            canvasWidthInputId,
            canvasHeightInputId,
            waveLengthInputId,
            waveHeightInputId,
            waveDistortionInputId,
            bgColorInputId,
            lineColorInputId,
            lineWidthInputId,
            canvasNameInputId
        ) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext("2d");

            let id = canvasId.split("-").pop();

            this.newCanvas = document.getElementById(`newCanvas-${id}`);

            this.canvasWidthInput = document.getElementById(canvasWidthInputId);
            this.canvasHeightInput =
                document.getElementById(canvasHeightInputId);
            this.canvas.width = this.canvasWidthInput.value;
            this.canvas.height = this.canvasHeightInput.value;

            this.newCanvas.width = this.canvasWidthInput.value;
            this.newCanvas.height = this.canvasHeightInput.value;

            this.width = 300;
            this.height = 300;

            this.amplitude = this.canvas.height / 20;
            this.frequency = 0.0001;
            this.speed = 0.0009;
            this.numWaves = (this.canvas.height / this.amplitude) * 2;
            this.waveInterval = (this.amplitude * 34) / this.numWaves;

            this.lineWidthInputId = lineWidthInputId;
            this.lineColorInputId = lineColorInputId;
            this.bgColorInputId = bgColorInputId;
            this.lineColor = "#000000";
            this.bgColor = "#FFFFFF";
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = this.lineColor;
            this.newCanvas.style.backgroundColor = this.bgColor;

            this.canvasNameInputId = canvasNameInputId;

            this.waveLengthInputId = waveLengthInputId;
            this.waveHeightInputId = waveHeightInputId;
            this.waveDistortionInputId = waveDistortionInputId;
        }

        drawWave(yOffset, waveAmplitude, waveFrequency, prevLine) {
            this.ctx.beginPath();
            this.ctx.moveTo(-this.width / 2, yOffset);
            for (let i = 0; i < this.width; i++) {
                let y =
                    yOffset +
                    waveAmplitude * Math.sin(waveFrequency * i + this.speed);
                if (prevLine && y < prevLine[i] - 5) {
                    y = prevLine[i] - 5;
                }
                this.ctx.lineTo(i - this.width / 2, y);
                this.ctx.__currentY = y;
            }
            this.ctx.stroke();
            return this.ctx.__currentY;
        }

        draw() {
            this.canvas.width = this.canvasWidthInput.value;
            this.canvas.height = this.canvasHeightInput.value;

            this.newCanvas.width = this.canvasWidthInput.value;
            this.newCanvas.height = this.canvasHeightInput.value;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            this.ctx.scale(
                this.canvas.width / this.width,
                this.canvas.height / this.height
            );
            this.ctx.translate(this.width / 2, this.height / 2);

            let prevLine;
            const waveLength = parseFloat(
                document.getElementById(this.waveLengthInputId).value
            );
            const waveHeight = parseFloat(
                document.getElementById(this.waveHeightInputId).value
            );
            const waveDistortion = parseFloat(
                document.getElementById(this.waveDistortionInputId).value
            );
            const bgColor = document.getElementById(this.bgColorInputId).value;
            this.newCanvas.style.backgroundColor = bgColor;
            const lineColor = document.getElementById(
                this.lineColorInputId
            ).value;
            this.ctx.strokeStyle = lineColor;
            const lineWidth = document.getElementById(
                this.lineWidthInputId
            ).value;
            this.ctx.lineWidth = lineWidth;
            for (let i = 0; i < this.numWaves; i++) {
                let waveAmplitude, waveFrequency;
                if (i > this.numWaves / 3 || i >= (this.numWaves * 2) / 3) {
                    waveAmplitude = waveHeight + i * 0.001;
                    waveFrequency =
                        waveLength +
                        (i - this.numWaves / 6) *
                            (0.001 + waveDistortion * 0.00001);
                } else if (i < (this.numWaves * 2) / 3) {
                    waveAmplitude = waveHeight + i * 0.01;
                    waveFrequency =
                        waveLength -
                        (i - this.numWaves / 2) *
                            (0.001 + waveDistortion * 0.00001);
                }
                prevLine = this.drawWave(
                    i * this.waveInterval - (this.height * 0.75) / 2,
                    waveAmplitude,
                    waveFrequency,
                    prevLine
                );
            }

            this.ctx.restore();
        }
    }

    const waveDrawer = new WaveDrawer(
        "myCanvas-1",
        "canvas-width",
        "canvas-height",
        "wave-length-1",
        "wave-height-1",
        "wave-distortion-1",
        "bg-color",
        "line-color",
        "line-width",
        "canvas-name"
    );

    const canvasWidthInput = document.getElementById("canvas-width");
    canvasWidthInput.addEventListener("input", () => {
        waveDrawer.draw();
    });

    const canvasHeightInput = document.getElementById("canvas-height");
    canvasHeightInput.addEventListener("input", (event) => {
        document.querySelectorAll(".newCanvas").forEach((element) => {
            element.style.height = event.target.value + "px";
        });
        waveDrawer.draw();
    });

    const waveLengthInput = document.getElementById("wave-length-1");
    waveLengthInput.addEventListener("input", () => {
        waveDrawer.draw();
    });

    const waveHeightInput = document.getElementById("wave-height-1");
    waveHeightInput.addEventListener("input", () => {
        waveDrawer.draw();
    });

    const waveDistortionInput = document.getElementById("wave-distortion-1");
    waveDistortionInput.addEventListener("input", () => {
        waveDrawer.draw();
    });

    const bgColorInput = document.getElementById("bg-color");
    bgColorInput.addEventListener("input", () => {
        waveDrawer.draw();
    });

    const lineColorInput = document.getElementById("line-color");
    lineColorInput.addEventListener("input", () => {
        waveDrawer.draw();
    });

    const lineWidthInput = document.getElementById("line-width");
    lineWidthInput.addEventListener("input", () => {
        waveDrawer.draw();
    });

    waveDrawer.draw();

    const maxCanvasCount = 6;
    let canvasCount = 2;

    function addCanvas() {
        if (canvasCount == 6) {
            document.getElementById("add-canvas").style.display = "none";
        }
        if (canvasCount > maxCanvasCount) {
            return;
        }
        const canvasName = `myCanvas-${canvasCount}`;
        const canvasContainer = document.createElement("div");
        canvasContainer.classList.add("layer");
        canvasContainer.setAttribute("id", `layer-${canvasCount}`);
        canvasContainer.innerHTML = `
                      <div class="inputs">
                          <h2>Wavelayer${canvasCount}</h2>
                          <div class="input-form">
                              <label for="wave-length-${canvasCount}">Wave Length:</label>
                              <input type="number" id="wave-length-${canvasCount}" value="0.01" step="0.001" />
                          </div>
                          <div class="input-form">
                              <label for="wave-height-${canvasCount}">Wave Height:</label>
                              <input type="number" id="wave-height-${canvasCount}" value="25" step="1" />
                          </div>
                          <div class="input-form">
                              <label for="wave-distortion-${canvasCount}">Wave Distortion:</label>
                              <input type="number" id="wave-distortion-${canvasCount}" value="50" step="1" />
                          </div>
                          <button class="download" data-id="${canvasCount}">Download</button>
                      </div>
                      <div id="canvas-container">
                          <canvas class="myCanvas" id="${canvasName}"></canvas>
                          <canvas class="newCanvas" id="newCanvas-${canvasCount}"></canvas>
                      </div>
                  `;
        const mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(canvasContainer);

        const waveDrawer = new WaveDrawer(
            `myCanvas-${canvasCount}`,
            `canvas-width`,
            `canvas-height`,
            `wave-length-${canvasCount}`,
            `wave-height-${canvasCount}`,
            `wave-distortion-${canvasCount}`,
            `bg-color`,
            `line-color`,
            `line-width`,
            `canvas-name`
        );

        canvasCount++;

        waveDrawer.draw();

        for (let i = 1; i < canvasCount; i++) {
            const canvasWidthInput = document.getElementById(`canvas-width`);
            canvasWidthInput.addEventListener("input", () => {
                waveDrawer.draw();
            });

            const canvasHeightInput = document.getElementById(`canvas-height`);
            canvasHeightInput.addEventListener("input", (event) => {
                document.querySelectorAll(".newCanvas").forEach((element) => {
                    element.style.height = event.target.value + "px";
                });
                waveDrawer.draw();
            });

            const waveLengthInput = document.getElementById(`wave-length-${i}`);
            waveLengthInput.addEventListener("input", () => {
                waveDrawer.draw();
            });

            const waveHeightInput = document.getElementById(`wave-height-${i}`);
            waveHeightInput.addEventListener("input", () => {
                waveDrawer.draw();
            });

            const waveDistortionInput = document.getElementById(
                `wave-distortion-${i}`
            );
            waveDistortionInput.addEventListener("input", () => {
                waveDrawer.draw();
            });

            const bgColorInput = document.getElementById(`bg-color`);
            bgColorInput.addEventListener("input", () => {
                waveDrawer.draw();
            });

            const lineColorInput = document.getElementById(`line-color`);
            lineColorInput.addEventListener("input", () => {
                waveDrawer.draw();
            });

            const lineWidthInput = document.getElementById(`line-width`);
            lineWidthInput.addEventListener("input", () => {
                waveDrawer.draw();
            });
        }

        initializeCanvas(canvasCount - 1);

        console.log(document.querySelectorAll(".download"));
        document.querySelectorAll(".download").forEach((element) => {
            element.addEventListener("click", (event) => {
                let format = document.querySelector(
                    'input[name="format"]:checked'
                ).value;
                if (format === "png") {
                    downloadPNG(event.target.getAttribute("data-id"));
                } else if (format === "svg") {
                    downloadCanvasAsSVG(event.target.getAttribute("data-id"));
                }
            });
        });

        document.querySelectorAll(".delete").forEach((element) => {
            console.log(element);
            element.addEventListener("click", (event) => {
                let id = event.target.getAttribute("data-id");
                document.getElementById(`layer-${id}`).remove();
            });
        });
    }

    document.getElementById("add-canvas").addEventListener("click", addCanvas);

    function selectElementsWithIdsTill(id) {
        let selectors = [];
        for (let i = 1; i <= id; i++) {
            selectors.push("#myCanvas-" + i);
        }
        let query = selectors.join(", ");
        return document.querySelectorAll(query);
    }

    function initializeCanvas(id) {
        const newCanvas = document.getElementById(`newCanvas-${id}`);
        const newCtx = newCanvas.getContext("2d");

        const canvasElements = selectElementsWithIdsTill(id);

        function redraw() {
            newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);

            for (let i = 0; i < canvasElements.length; i++) {
                const canvas = canvasElements[i];
                const ctx = canvas.getContext("2d");

                newCtx.drawImage(canvas, 0, 0);

                newCanvas.style.zIndex = i + 1;
            }

            requestAnimationFrame(redraw);
        }

        redraw();
    }

    let name = document.getElementById("canvas-name");
    name.addEventListener("input", (event) => {
        name.value = event.target.value;
        console.log(name.value);
    });

    function downloadCanvasAsSVG(id) {
        const newCanvas = document.getElementById(`newCanvas-${id}`);
        const canvasElements = document.querySelectorAll(".myCanvas");

        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        svg.setAttribute("width", newCanvas.width);
        svg.setAttribute("height", newCanvas.height);

        for (let i = 0; i < canvasElements.length; i++) {
            const canvas = canvasElements[i];
            const ctx = canvas.getContext("2d");

            const dataURL = canvas.toDataURL("image/png");
            const img = document.createElement("img");
            img.src = dataURL;

            const svgImage = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "image"
            );
            svgImage.setAttribute("x", "0");
            svgImage.setAttribute("y", "0");
            svgImage.setAttribute("width", canvas.width);
            svgImage.setAttribute("height", canvas.height);
            svgImage.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                "xlink:href",
                dataURL
            );

            svg.appendChild(svgImage);
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        const downloadLink = document.createElement("a");
        downloadLink.setAttribute(
            "href",
            "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString)
        );
        downloadLink.setAttribute("download", `${name.value}.svg`);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    initializeCanvas(1);

    function downloadPNG(id) {
        let canvas = document.getElementById(`newCanvas-${id}`);
        let anchor = document.createElement("a");
        anchor.href = canvas.toDataURL("image/png");
        anchor.download = `${name.value}.png`;
        anchor.click();
    }

    document.querySelectorAll(".download").forEach((element) => {
        element.addEventListener("click", (event) => {
            let format = document.querySelector(
                'input[name="format"]:checked'
            ).value;
            console.log(format);
            if (format === "png") {
                downloadPNG(event.target.getAttribute("data-id"));
            } else if (format === "svg") {
                downloadCanvasAsSVG(event.target.getAttribute("data-id"));
            }
        });
    });

    document.querySelectorAll(".newCanvas").forEach((element) => {
        let canvasHeightInput = document.getElementById("canvas-height").value;
        element.style.height = canvasHeightInput + "px";
    });
};