// canvas
var startCanvas;
var ctxstart;

var click_num = 0;

// mouse
var mousepos = new Point();

// set canvas
startCanvas = document.getElementById('start');
ctxstart = startCanvas.getContext('2d');
startCanvas.width = 1000;
startCanvas.height = 728;

// events
startCanvas.addEventListener('mousedown', mDown, true);

// start
function startMenu() {
    isGameStarted = false;
    startCanvas.style.display = "inline";

    screenCanvas.style.display = "none";
    menuCanvas.style.display = "none";
    unitCanvas.style.display = "none";

    // render start menu
    ctxstart.fillStyle = "rgba(127, 143, 166,1.0)";
    ctxstart.fillRect(0, 0, startCanvas.width, startCanvas.height);

    ctxstart.font = "bold 144px uzura";
    ctxstart.strokeStyle = 'rgba(245, 246, 250,1.0)';
    ctxstart.lineWidth = 3;
    ctxstart.lineJoin = "round";
    ctxstart.fillStyle = 'rgba(47, 54, 64,1.0)';
    ctxstart.fillText('しゅ～てぃんぐげいむ', 20, 200, 960);
    ctxstart.strokeText('しゅ～てぃんぐげいむ', 20, 200, 960);

    ctxstart.font = "bold 64px uzura";
    ctxstart.lineWidth = 1.0;
    ctxstart.fillText('うぃず　たわーでぃふぇんす(?)', 60, 300, 840);
    ctxstart.strokeText('うぃず　たわーでぃふぇんす(?)', 60, 300, 840);

    ctxstart.fillText('ダブルクリックでゲームスタート', 80, 480, 840);
    ctxstart.strokeText('ダブルクリックでゲームスタート', 80, 480, 840);

    var count = 0;
    (function () {
        count += 1;
        if(count % 30 == 0 && click_num > 0 ){
            click_num = 0;
        }
        if(click_num >= 2){
            isGameStarted = true;
            startCanvas.style.display = "none";
            main();
        }
        if (!isGameStarted) { setTimeout(arguments.callee, FPS); }
    })();
};

function mDown() {
    click_num += 1;
}
