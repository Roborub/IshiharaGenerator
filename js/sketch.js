const ishiharaSketch = (ishiharaCanvas) => {
  ishiharaCanvas.setup = () => {
    ishiharaCanvasReference = ishiharaCanvas;
    util = initUtilities(ishiharaCanvas);

    let cnv = ishiharaCanvas.createCanvas(canvasSize, canvasSize);

    cnv.elt.oncontextmenu = () => false;
    ishiharaCanvas.ellipseMode(ishiharaCanvas.RADIUS);
    ishiharaCanvas.noStroke();

    sliders = util.createAndPositionSliders();

    sliders.circleSizeSlider.input(util.onCircleSizeSliderChange.bind(util));
    sliders.repulsionForceSlider.input(util.onRepulsionForceSliderChange.bind(util));
    sliders.surfaceTensionSlider.input(util.onSurfaceTensionSliderChange.bind(util));
    sliders.dampingSlider.input(util.onDampingSliderChange.bind(util));
    sliders.primaryColorPicker.input(util.onPrimaryColorPickerChange.bind(util));
    sliders.secondaryColorPicker.input(util.onSecondaryColorPickerChange.bind(util));
    sliders.circleSizeVariationSlider.input(util.onCircleSizeVariationSliderChange.bind(util));
    sliders.tintStrengthSlider.input(util.onTintStrengthSliderChange.bind(util));
    sliders.physicsTickRateSlider.input(util.onPhysicsTickRateSliderChange.bind(util));
  };
  ishiharaCanvas.draw = () => {
    ishiharaCanvas.background(240);

    if (ishiharaCanvas.mouseIsPressed) {
      util.spawnCirclesAtPosition(ishiharaCanvas.mouseX, ishiharaCanvas.mouseY);
      // if (ishiharaCanvas.mouseButton === ishiharaCanvas.LEFT) {

      //   const mouseX = ishiharaCanvas.mouseX;
      //   const mouseY = ishiharaCanvas.mouseY;

      //   if (mouseX > 0 && mouseX <= canvasSize && mouseY > 0 && mouseY <= canvasSize) {
      //     util.spawnCirclesAtPosition(mouseX, mouseY);
      //   }
      // }
      // else {

      //   const mouseX = ishiharaCanvas.mouseX;
      //   const mouseY = ishiharaCanvas.mouseY;
      //   if (mouseX > 0 && mouseX <= canvasSize && mouseY > 0 && mouseY <= canvasSize) {
      //     util.removeCirclesAroundLocation(mouseX, mouseY);
      //   }

      //   if (ishiharaCanvas.frameCount % physicsTickRate === 0) {
      //     util.spreadOutCircles();
      //     util.resetGrid();
      //   }

      //   util.drawCircles();
      // }
    }
  }
}
const drawingSketch = (drawingCanvas) => {
  drawingCanvas.setup = () => {
    drawingCanvasReference = drawingCanvas;
    let cnv = drawingCanvas.createCanvas(canvasSize, canvasSize);
    cnv.position(canvasSize + canvasSize * 0.25, 0);
    cnv.elt.oncontextmenu = () => false;
    drawingCanvas.noStroke();
    drawingCanvas.frameRate(1000);
    drawingCanvas.background(drawingCanvasSecondary);
  };

  let previousX;
  let previousY;
  let midStroke = false;
  const drawingBaseSize = 20;

  drawingCanvas.draw = () => {
    if (!drawingCanvas.mouseIsPressed) {
      midStroke = false;
      return;
    }

    let iterations = midStroke ? drawingSmoothingIterations : 1;

    for (let i = 0; i <= iterations; i++) {
      let x = drawingCanvas.mouseX;
      let y = drawingCanvas.mouseY;

      if (midStroke) {
        x = drawingCanvas.lerp(previousX, drawingCanvas.mouseX, i / drawingSmoothingIterations);
        y = drawingCanvas.lerp(previousY, drawingCanvas.mouseY, i / drawingSmoothingIterations);
      }

      let drawingSize = drawingBaseSize;

      if (drawingCanvas.mouseButton === drawingCanvas.LEFT) {
        drawingCanvas.fill(drawingCanvasPrimary);
      } else {
        drawingSize += 20;
        drawingCanvas.fill(drawingCanvasSecondary);
      }

      drawingCanvas.ellipse(x, y, drawingSize, drawingSize);
    }

    previousX = drawingCanvas.mouseX;
    previousY = drawingCanvas.mouseY;
    midStroke = true;
  };
};

new p5(ishiharaSketch);
new p5(drawingSketch);
