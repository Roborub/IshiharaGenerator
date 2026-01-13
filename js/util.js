function initUtilities(canvas) {
  return {
    spawnCirclesAtPosition(x, y) {
      const point = canvas.createVector(x, y);

      point.velocity = canvas.createVector(0, 0)
      point.radius = circleSize + canvas.random(-circleSizeVariation, circleSizeVariation);
      point.color = canvas.color("#FFF");

      point.randomTint = {
        r: canvas.random(0, maxColorTint),
        g: canvas.random(0, maxColorTint),
        b: canvas.random(0, maxColorTint),
      }
      circles.push(point);

      const col = canvas.min(canvas.floor(x / getCellSize()), getGridCols() - 1);
      const row = canvas.min(canvas.floor(y / getCellSize()), getGridRows() - 1);
      const index = col + row * getGridCols();

      if (!grid[index]) {
        grid[index] = [];
      }
      grid[index].push(point);
    },
    removeCirclesAroundLocation(x, y) {
      circles = circles.filter(circle => {
        const dx = circle.x - x;
        const dy = circle.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const shouldKeep = dist > circleRemoveSize;

        if (!shouldKeep) {
          const gridX = Math.floor(circle.x / getCellSize());
          const gridY = Math.floor(circle.y / getCellSize());
          const gridIndex = gridX + gridY * getGridCols();

          const cell = grid[gridIndex];
          if (cell) {
            // Remove this circle from the cell
            const index = cell.indexOf(circle);
            if (index > -1) {
              cell.splice(index, 1);
            }
          }
        }
        return shouldKeep;
      });
    },
    onPhysicsTickRateSliderChange() {
      physicsTickRate = physicsTickRateSlider.value();
    },
    onCircleSizeSliderChange() {
      this.resetIshihara();
      circleSize = circleSizeSlider.value(); // move this ABOVE grid setup!
    },
    onCircleSizeVariationSliderChange() {
      this.resetIshihara();
      circleSizeVariation = circleSizeVariationSlider.value();
    },
    onTintStrengthSliderChange() {
      maxColorTint = tintStrengthSlider.value();
    },
    onRepulsionForceSliderChange() {
      repulsionForce = repulsionForceSlider.value(); // move this ABOVE grid setup!
    },

    onSurfaceTensionSliderChange() {
      surfaceTension = surfaceTensionSlider.value(); // move this ABOVE grid setup!
    },

    onDampingSliderChange() {
      damping = dampingSlider.value(); // move this ABOVE grid setup!
    },
    onPrimaryColorPickerChange() {
      primaryColor = primaryColorPicker.color();
    },
    onSecondaryColorPickerChange() {
      secondaryColor = secondaryColorPicker.color();
    },

    isGridFull() {
      return grid.every(cell => cell !== undefined && cell.length > 0);
    },

    createAndPositionSliders() {
      const sliders = {};

      const circleSizelabel = canvas.createSpan("<strong>Circle Size</strong>");
      circleSizelabel.position(10, 525);
      circleSizeSlider = canvas.createSlider(5, 25, circleSize);
      circleSizeSlider.position(10, 550);

      const circleSizeVariationlabel = canvas.createSpan("<strong>Circle Size Variation</strong>");
      circleSizeVariationlabel.position(150, 525);
      circleSizeVariationSlider = canvas.createSlider(0, 9, circleSizeVariation);
      circleSizeVariationSlider.position(150, 550);

      const repulsionForceLabel = canvas.createSpan("<strong>Repulsion Force</strong>");
      repulsionForceLabel.position(10, 585);
      repulsionForceSlider = canvas.createSlider(0, 2, repulsionForce, 0.0001);
      repulsionForceSlider.position(10, 610);

      const surfaceTensionLabel = canvas.createSpan("<strong>Surface Tension</strong>");
      surfaceTensionLabel.position(10, 635);
      surfaceTensionSlider = canvas.createSlider(0, 0.5, surfaceTension, 0.001);
      surfaceTensionSlider.position(10, 660);

      const dampingLabel = canvas.createSpan("<strong>Damping Multiplier (lower means more damping)</strong>");
      dampingLabel.position(10, 695);
      dampingSlider = canvas.createSlider(0, 1, damping, 0.01);
      dampingSlider.position(10, 720);

      const primaryColorLabel = canvas.createSpan("<strong>Primary Colour</strong>");
      primaryColorLabel.position(10, 750);
      primaryColorPicker = canvas.createColorPicker(primaryColor);
      primaryColorPicker.position(10, 770);

      const secondaryColorLabel = canvas.createSpan("<strong>Secondary Colour</strong>");
      secondaryColorLabel.position(10, 800);
      secondaryColorPicker = canvas.createColorPicker(secondaryColor);
      secondaryColorPicker.position(10, 820);

      const tintStrengthLabel = canvas.createSpan("<strong>Colour Tint</strong>");
      tintStrengthLabel.position(150, 800);
      tintStrengthSlider = canvas.createSlider(0, 50, maxColorTint);
      tintStrengthSlider.position(150, 820);

      const physicsTickRateLabel = canvas.createSpan("<strong>Physics Tick Rate</strong>");
      physicsTickRateLabel.position(10, 840);
      physicsTickRateSlider = canvas.createSlider(1, 5, physicsTickRate);
      physicsTickRateSlider.position(10, 860);

      sliders.circleSizeSlider = circleSizeSlider;
      sliders.repulsionForceSlider = repulsionForceSlider;
      sliders.surfaceTensionSlider = surfaceTensionSlider;
      sliders.dampingSlider = dampingSlider;
      sliders.primaryColorPicker = primaryColorPicker;
      sliders.secondaryColorPicker = secondaryColorPicker;
      sliders.tintStrengthSlider = tintStrengthSlider;
      sliders.circleSizeVariationSlider = circleSizeVariationSlider;
      sliders.physicsTickRateSlider = physicsTickRateSlider;

      return sliders;
    },

    drawCircles() {
      for (const cell of grid) {
        if (cell && Array.isArray(cell)) {
          for (const circle of cell) {
            const color = this.getColorBasedOnDrawingPosition(circle);

            if (color === undefined) {
              return;
            }

            circle.targetColor = color;
            circle.color = canvas.lerpColor(circle.color, circle.targetColor, colorLerpSpeed);
            circle.color.r += circle.randomTint.r;
            circle.color.g += circle.randomTint.g;
            circle.color.b += circle.randomTint.b;

            canvas.fill(circle.color);
            circle.velocity.mult(damping) // damp
            circle.add(circle.velocity);

            canvas.ellipse(circle.x, circle.y, circle.radius);
          }
        }
      }
    },

    getColorBasedOnDrawingPosition(circle) {
      if (drawingCanvasReference === undefined) {
        return
      }

      const can = drawingCanvasReference;
      const pixel = can.get(circle.x, circle.y);
      const color = can.color(...pixel);

      const r = can.hex(can.red(color), 1);
      const g = can.hex(can.green(color), 1);
      const b = can.hex(can.blue(color), 1);

      if (color === undefined || r === undefined || g === undefined || b === undefined) {
        return;
      }

      color.hex = `#${r}${g}${b}`;

      const primaryColorTinted = this.tintColor(circle, true);
      const secondaryColorTinted = this.tintColor(circle, false);

      if (color.hex.toLowerCase() === drawingCanvasPrimary.toLowerCase()) {
        return drawingCanvasReference.color(primaryColorTinted);
      }

      return drawingCanvasReference.color(secondaryColorTinted);
    },
    tintColor(circle, isPrimary) {
      const colorIn = isPrimary ? primaryColor : secondaryColor;

      const rOut = canvas.constrain(canvas.red(colorIn) + circle.randomTint.r, 0, 255);
      const gOut = canvas.constrain(canvas.green(colorIn) + circle.randomTint.g, 0, 255);
      const bOut = canvas.constrain(canvas.blue(colorIn) + circle.randomTint.b, 0, 255);

      return canvas.color(rOut, gOut, bOut);
    },
    spreadOutCircles() {
      for (let y = 0; y < getGridRows(); y++) {
        for (let x = 0; x < getGridCols(); x++) {
          const index = x + y * getGridCols();
          const currentCell = grid[index];

          if (!currentCell || currentCell.length === 0) {
            continue;
          }

          for (const circle of currentCell) {
            this.applySurfaceTension(circle);
            for (let i = -2; i < 2; i++) {
              for (let k = -2; k < 2; k++) {
                const nx = x + k;
                const ny = y + i;

                if (nx < 0 || ny < 0 || nx >= getGridCols() || ny >= getGridRows()) continue;

                const neighborIndex = nx + ny * getGridCols();
                const neighbors = grid[neighborIndex];

                if (!neighbors) {
                  continue;
                }

                for (const neighbor of neighbors) {
                  if (circle === neighbor) continue;

                  const dir = p5.Vector.sub(circle, neighbor);
                  const dist = dir.mag();
                  const minDist = circle.radius + neighbor.radius;

                  if (dist < minDist) {
                    const strength = (minDist - dist) * repulsionForce;
                    dir.normalize();
                    dir.mult(strength);
                    circle.velocity.add(dir);
                    neighbor.velocity.sub(dir);
                  }
                }
              }
            }
          }
        }
      }
    },

    applySurfaceTension(circle) {
      const maxDist = canvasSize / 2;
      const center = canvas.createVector(canvasSize / 2, canvasSize / 2);
      const toCenter = p5.Vector.sub(center, circle);
      const dist = toCenter.mag();

      const pullStrength = canvas.map(dist, 0, maxDist, 0, surfaceTension);

      toCenter.setMag(pullStrength);
      circle.velocity.add(toCenter);
    },

    resetIshihara() {
      canvas.clear();
      grid = new Array(getGridCols() * getGridRows()).fill().map(() => []);
      circles.length = 0;
    },

    resetGrid() {
      grid.fill(undefined);
      const keptCircles = [];
      for (const circle of circles) {
        const col = canvas.min(canvas.floor(circle.x / getCellSize()), getGridCols() - 1);
        const row = canvas.min(canvas.floor(circle.y / getCellSize()), getGridRows() - 1);
        const index = col + row * getGridCols();

        if (!grid[index]) {
          grid[index] = [];
        }

        grid[index].push(circle);
        keptCircles.push(circle);
      }
      circles.length = 0;
      circles.push(...keptCircles);
    },
  }
}
