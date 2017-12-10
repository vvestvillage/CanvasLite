addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    //_canvas.addEventListener("mouseup", mouseup_canvas);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;

    //_bgVideo = undefined;

    //_logo = logo(_canvas, 15, 15);
    _html5 = new toile.Bitmap("../common/html5.png"); //html5.png");
    _html5.x = 15; //_canvas.width - 230;
    _html5.y = 15; //_canvas.height - 70;
    _canvas.addChild(_html5);

    //"50th Anniversary"
    _50th = new toile.Bitmap("../common/50thlogo.png");
    _50th.x = _canvas.width / 2 - 165;
    _50th.y = _canvas.height - 70;
    _50th.alpha = 1; //0.8;
    _canvas.addChild(_50th);

    //「シナノロゴ」関連
    //_shinanologo = new toile.Bitmap("../common/shinano.png");
    _shinanologo = new toile.Bitmap("../common/shinanologo.png");
    _shinanologo.x = _canvas.width - 64 - 245;
    _shinanologo.y = _canvas.height -37 -10; //10;
    //_shinanologo.alpha = 0.8;
    _canvas.addChild(_shinanologo);

    _gridStatus = "off"; //Gridの表示状態
    _yubi = undefined;

    //VideoLoopクラス
    _videoLoop = new VideoLoop(_canvas);

    _3colors = new toile.Bitmap("../common/3colors.png");
    _3colors.alpha = 0.6;
    _canvas.addChild(_3colors);

    //================================
    //3つのBitmapPlusボタンの表示準備
    //================================
    _blockWidth = _canvas.width / 17;
    _blockHeight = _canvas.height / 9;
    
    _button1 = new SpriteSheetPlus("btn1.png", true, "255,255,255", "0,0,0", 4);
    _button2 = new SpriteSheetPlus("btn2.png", true, "255,255,255", "0,0,0",4);
    _button3 = new SpriteSheetPlus("btn3.png", true, "255,255,255", "0,0,0",4);
    _buttonArray = [_button1, _button2, _button3];

    for (let i=0; i<_buttonArray.length; i++) {
        let _theButton = _buttonArray[i];
        _theButton.name = "button" + (i+1); //"buttun1" => "button2" => "button3"
        _theButton.addEventListener("mouseup", mouseup_button);
        _theButton.addEventListener("delete", delete_button);
        _theButton.x = _blockWidth * (2 + i * 5) - 2; //2 => 7 => 12; //-9e9;
        //_theButton.posX = _blockWidth * (2 + i * 5) - 2; //2 => 7 => 12
        _theButton.y = _blockHeight * 3 - 2; //-9e9;
        //_theButton.posY = _blockHeight * 3 - 2;
        _theButton.fps = 10; //各SpriteSheetPlusのfpsの値が異なる場合はfor文の外で処理
        _canvas.addChild(_theButton);
        //_theButton._timerID = setTimeout(callback_button_in, (640 + 330 * i), _theButton);
    }

    //挨拶文
    _hello = new toile.Bitmap("hello.png");
    _hello.addEventListener("mouseup", mouseup_hello);
    _canvas.addChild(_hello);

    if (location.href.indexOf("?", 0) != -1) {
        if (_hello != undefined) _canvas.deleteChild(_hello);
        start(_canvas);
    }
}

mouseup_hello = (_bitmap) => {
    //効果音
    _se1 = new toile.Sound("../common/se1.wav");
    _se1.play();

    _canvas.stopMouseUpEvent();
    _canvas.deleteChild(_bitmap);

    _helloTimerID = setTimeout(helloTimer, 500, this);
}

helloTimer = (_this) => {
    _this.start(_this._canvas);
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#fefefe"); //SpriteSheet内に白（#ffffff）がある場合
}

start = (_canvas) => {
    if (_gridStatus == "off") {
        _grid = new Grid(_canvas,17,9); //Canvasを横17,縦9に分割
        _grid.lineColor = "96,96,96"; //"187,187,187"; //初期値"0,0,0"
        _grid.lineWidth = 4; //初期値1
        _grid.lineAlpha = 0.3;
        _grid.in(); //初期値2（秒）
        _grid.addEventListener("in", in_grid);
        _gridStatus = "animate"; //Gridの表示状態

        _grid2 = new Grid(_canvas,34,18); //Canvasを横17,縦9に分割
        _grid2.lineColor = "96,96,96"; //初期値"0,0,0"
        _grid2.lineWidth = 1; //初期値1
        _grid2.lineAlpha = 0.2;
        _grid2.in(4); //初期値2（秒）

        for (let i=0; i<_buttonArray.length; i++) {
            let _theButton = _buttonArray[i];
            //_canvas.addChild(_theButton);
            //_theButton.x = _theButton.posX;
            //_theButton.y = _theButton.posY;
            _theButton._timerID = setTimeout(callback_button_in, (640 + 330 * i), _theButton);
        }
    }

    //_canvas.setDepthIndex(_logo, _canvas.getDepthMax());
    _canvas.setDepthIndex(_html5, _canvas.getDepthMax());
    _canvas.setDepthIndex(_50th, _canvas.getDepthMax());
    _canvas.setDepthIndex(_shinanologo, _canvas.getDepthMax());
}

in_grid = (_grid) => {
    _gridStatus = "on"; //Gridの表示状態
    _grid.removeEventListener("in");
    _grid.lineAlpha = 0.2;
    _grid2.lineAlpha = 0.1;
}

mouseup_button = (_button) => {
    //効果音
    _se1 = new toile.Sound("../common/se1.wav");
    _se1.play();

    _grid._timerID = setTimeout(callback_grid_out, 1520);
    _grid.lineAlpha = 0.3;
    //_grid2.lineAlpha = 0.2;

    switch (_button.name) {
        case "button1":
            _choiceNum = 1;
            _button2._timerID = setTimeout(callback_button_out, 300, _button2);
            _button3._timerID = setTimeout(callback_button_out, 600, _button3);
            _lastButton = _button3;
            break;
        case "button2":
            _choiceNum = 2;
            _button1._timerID = setTimeout(callback_button_out, 600, _button1);
            _button3._timerID = setTimeout(callback_button_out, 600, _button3);
            _lastButton = _button3;
            break;
        case "button3":
            _choiceNum = 3;
            _button1._timerID = setTimeout(callback_button_out, 600, _button1);
            _button2._timerID = setTimeout(callback_button_out, 300, _button2);
            _lastButton = _button1;
    }
    _videoLoop.end();
}

delete_button = (_button) => {
    _canvas.deleteChild(_button);
}

callback_button_in = (_button) => {
    _button.in(); //初期値1（秒）
    clearTimeout(_button._timerID);
}

callback_button_out = (_button) => {
    _button.out(); //初期値1（秒）
    clearTimeout(_button._timerID);

    _grid2FadeOutID = setInterval(grid2FadeOut, 17);
    //_grid.lineColor = "187,187,187";
}

grid2FadeOut = () => {
    _grid2.lineAlpha -= 0.003;
}

callback_grid_out = () => {
    _grid.out(1); //初期値2（秒）
    _grid.addEventListener("out", out_grid);
    _gridStatus = "animate"; //Gridの表示状態
}

out_grid = (_grid) => {
    _gridStatus = "off";
    _grid.removeEventListener("in");
    
    //location.href = "../main3/index3.html?param1=100&param2=200"
    //location.href = "../main" + _choiceNum + "/" + "index" + _choiceNum + ".html?" + "param1=100" + "&" + "param2=200";
    //location.href = "../main1/index1.html";
    //if (_choiceNum == 3) _choiceNum = 2; //DEBUG
    location.href = "../main" + _choiceNum + "/" + "index" + _choiceNum + ".html";
}