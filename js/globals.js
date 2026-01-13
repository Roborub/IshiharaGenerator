let util;
const canvasSize = 500;
const maxFunctionIterations = 500;
let circleSize = 10;
const circleRemoveSize = 10;
let circleSizeVariation = 2;
let circles = [];
const colorLerpSpeed = 0.25;
let physicsTickRate = 1;
let getCellSize = () => { return circleSize * 4 };

let getGridCols = () => { return Math.floor(canvasSize / getCellSize()) };
let getGridRows = () => { return Math.floor(canvasSize / getCellSize()) };

let grid = new Array(getGridCols() * getGridRows()).fill(undefined);
let damping = 0.6;

let repulsionForce = 0.35;

let surfaceTension = 0.15;

const drawingCanvasPrimary = "#00F"
const drawingCanvasSecondary = "#0F0"

const drawingSmoothingIterations = 40;

let primaryColor = "#C48849"
let secondaryColor = "#499d46"

let maxColorTint = 25;

let circleSizeSlider;
let repulsionForceSlider;
let surfaceTensionSlider;
let dampingSlider;
let primaryColorPicker;
let secondaryColorPicker;
let tintStrengthSlider;
let circleSizeVariationSlider;
let physicsTickRateSlider;
let ishiharaCanvasReference;
let drawingCanvasReference;
