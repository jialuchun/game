var DEBUG = !1,
    SCREEN_W = 320,
    SCREEN_H = 416,
    PROJECT_PATH = "",
    IMAGE_PATH = PROJECT_PATH + "images",
    AUDIO_PATH = PROJECT_PATH + "audio",
    COOKI_NAME = "crazycowboy",
    GROUP_MAP = "map",
    GROUP_COW = "cow",
    GROUP_LARIAT = "lariat",
    GROUP_GAME_UI = "game_ui",
    GROUP_MENU = "menu",
    GROUP_GAME_MENU = "game_menu",
    GROUP_WIN = "win",
    GROUP_LOSE = "lose",
    GROUP_HELP = "help",
    GROUP_RANK = "rank",
    GROUP_BACK_CALL = "back_call",
    LAYER_MENU = "menu_layer",
    LAYER_GAME = "game_layer",
    LAYER_GAMEMENU = "game_menu_layer",
    LAYER_WIN = "win_layer",
    LAYER_LOSE = "lose_layer",
    LAYER_HELP = "help_layer",
    LAYER_RANK = "rank_layer",
    GAME_DESCRIPTION = "套牛达人",
    Random = new function() {
        this.random = function(a, b) {
            switch (arguments.length) {
                case 0:
                    a = 0;
                    b = 100;
                    break;
                case 1:
                    b = 0
            }
            var c = a < b ? a : b;
            return Math.floor(Math.random() * (Math.abs((a > b ? a : b) - c) + 1) + c)
        }
    };

function setupTouch() {
    isIPhone ? setEventListener(document.body) : setEventListener(gbox._screen)
}

function setEventListener(a) {
    checkForTouch() ? (a.addEventListener("touchmove", touchMove, !1), a.addEventListener("touchstart", touchStart, !1), a.addEventListener("touchend", touchEnd, !1)) : (a.addEventListener("mousedown", mouseDown, !1), a.addEventListener("mousemove", mouseMove, !1), a.addEventListener("mouseup", mouseUp, !1))
}
function checkForTouch() {
    var a = document.createElement("div");
    a.setAttribute("ontouchmove", "return;");
    return typeof a.ontouchmove == "function" ? !0 : !1
}
var touchX = 0,
    touchY = 0,
    touchStartX = 0,
    touchStartY = 0,
    touchMoveX = 0,
    touchMoveY = 0,
    lastTouchMoveX = 0,
    lastTouchMoveY = 0,
    hasTouchMoveEvent = !1,
    firstClick = !1,
    bTouch = !1,
    iContrast = -1;

function touchStart(a) {
    setTimeout(function() {
        window.scrollTo(0, 1)
    }, 10);
    a.preventDefault();
    a.stopPropagation();
    a = {
        x: a.touches[0].pageX,
        y: a.touches[0].pageY
    };
    isIPhone && (a.x /= 2, a.y /= 2);
    isTouchX = a.x;
    isTouchY = a.y;
    touchStartX = a.x;
    touchStartY = a.y;
    bTouch = firstClick = !0;
    downTouch()
}

function touchEnd(a) {
    a.preventDefault();
    touchMoveX = touchMoveY = 0;
    touch();
    bTouch = !1
}
function touchMove(a) {
    a.preventDefault();
    hasTouchMoveEvent = isBgMoving = !0;
    a = {
        x: a.touches[0].pageX,
        y: a.touches[0].pageY
    };
    isIPhone && (a.x /= 2, a.y /= 2);
    firstClick ? (touchMoveX = a.x - touchStartX, touchMoveY = a.y - touchStartY, firstClick = !1) : (touchMoveX = a.x - lastTouchMoveX, touchMoveY = a.y - lastTouchMoveY);
    lastTouchMoveX = a.x;
    lastTouchMoveY = a.y;
    touchMoveX *= touchSpeed;
    touchMoveY *= touchSpeed
}
var mouseClick = !1;

function mouseDown(a) {
    mouseClick = !0;
    touchStartX = a.pageX;
    touchStartY = a.pageY;
    bTouch = firstClick = !0;
    downTouch()
}
function mouseUp() {
    mouseClick = !1;
    touchMoveX = touchMoveY = 0;
    touch();
    bTouch = !1
}
function mouseMove(a) {
    if (mouseClick) hasTouchMoveEvent = !0, firstClick ? (touchMoveX = a.pageX - touchStartX, touchMoveY = a.pageY - touchStartY, firstClick = !1) : (touchMoveX = a.pageX - lastTouchMoveX, touchMoveY = a.pageY - lastTouchMoveY), lastTouchMoveX = a.pageX, lastTouchMoveY = a.pageY, touchMoveX *= 3, touchMoveY *= 3
}

function touch() {
    if (hasTouchMoveEvent == !1) touchX = touchStartX, touchY = touchStartY, processTouch();
    else for (var a in clickObjectList) if (tool.pointInPoly([lastTouchMoveX, lastTouchMoveY], clickObjectList[a].poly) && iContrast === a) {
        clickObjectList[a].myclick();
        break
    }
    hasTouchMoveEvent = !1;
    iContrast = -1
}
function downTouch() {
    for (var a in clickObjectList) if (tool.pointInPoly([touchStartX, touchStartY], clickObjectList[a].poly)) {
        iContrast = a;
        break
    }
}
var clickObjectList = [];

function processTouch() {
    for (var a in clickObjectList) if (tool.pointInPoly([touchX, touchY], clickObjectList[a].poly)) {
        clickObjectList[a].myclick();
        break
    }
}

function registerLayerToList(a) {
    var b = gbox.getGroupsInLayer(a);
    DEBUG && console.log("groups in layer [" + a + "] = " + b.length);
    for (var c in b) if (gbox.getGroupShow(b[c]) == 1) {
        a = gbox.getObjectsInGroup(b[c]);
        DEBUG && console.log("objects in group [" + b[c] + "] = " + a.length);
        for (var e in a) try {
            typeof a[e] != "undefined" && a[e].poly.length > 0 && clickObjectList.push(a[e])
        } catch (f) {
            alert(a[e] + " " + f.toString())
        }
    }
}
var createImage = function() {
    var a = IMAGE_PATH;
    gbox.addImage("img_command", a + "/command.png");
    gbox.addTiles({
        id: "tile_command",
        image: "img_command",
        tilew: 0,
        tileh: 0,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_menu_bg", a + "/menu_bg.jpg");
    gbox.addTiles({
        id: "tile_menu_bg",
        image: "img_menu_bg",
        tilew: SCREEN_W,
        tileh: SCREEN_H,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_mainmenu", a + "/mainmenu.png");
    gbox.addTiles({
        id: "tile_mainmenu",
        image: "img_mainmenu",
        tilew: 0,
        tileh: 0,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_ground_bg", a + "/ground_bg.jpg");
    gbox.addTiles({
        id: "tile_ground_bg",
        image: "img_ground_bg",
        tilew: SCREEN_W,
        tileh: SCREEN_H,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_ground", a + "/ground.jpg");
    gbox.addTiles({
        id: "tile_ground",
        image: "img_ground",
        tilew: SCREEN_W,
        tileh: SCREEN_H,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_ui", a + "/ui.png");
    gbox.addTiles({
        id: "tile_ui",
        image: "img_ui",
        tilew: 0,
        tileh: 0,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_coin", a + "/coin.png");
    gbox.addTiles({
        id: "tile_coin",
        image: "img_coin",
        tilew: 0,
        tileh: 0,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_levelup", a + "/levelup.png");
    gbox.addTiles({
        id: "tile_levelup",
        image: "img_levelup",
        tilew: 0,
        tileh: 0,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_shop", a + "/shop.png");
    gbox.addTiles({
        id: "tile_shop",
        image: "img_shop",
        tilew: 0,
        tileh: 0,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    for (var b = 0; b < 5; b++) gbox.addImage("img_num_" + b, a + "/num_" + b + ".png"), gbox.addTiles({
        id: "tile_num_" + b,
        image: "img_num_" + b,
        tilew: 0,
        tileh: 0,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    for (b = 0; b < 5; b++) gbox.addImage("img_cow_" + b, a + "/cow_" + b + ".png"), gbox.addTiles({
        id: "tile_cow_" + b,
        image: "img_cow_" + b,
        tilew: 57,
        tileh: 66,
        tilerow: 2,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_lariat", a + "/lariat.png");
    gbox.addTiles({
        id: "tile_lariat",
        image: "img_lariat",
        tilew: 32,
        tileh: 408,
        tilerow: 15,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_help_bg", a + "/help_bg.jpg");
    gbox.addTiles({
        id: "tile_help_bg",
        image: "img_help_bg",
        tilew: 320,
        tileh: 480,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    });
    gbox.addImage("img_help", a + "/help.png");
    gbox.addTiles({
        id: "tile_help",
        image: "img_help",
        tilew: 290,
        tileh: 214,
        tilerow: 1,
        gapx: 0,
        gapy: 0
    })
};

function startGame() {
    console.log("NetMode : " + isNetMode);
    isNetMode && (curCoins = serverGameCoin, curLevel = serverGameLevel, curExp = serverGameExp, console.log("curCoins : " + curCoins), console.log("curLevel : " + curLevel), console.log("curExp : " + curExp));
    DEBUG && console.log("ScreenSize : " + window.innerWidth + "x" + window.innerHeight);
    isIPhone ? (SCREEN_W = window.innerWidth / 2, SCREEN_H = window.innerHeight / 2, SCREEN_H === 356 && (SCREEN_H = 416)) : SCREEN_H = 460;
    gbox.onLoad(function() {
        help.akihabaraInit({
            title: "Crazy Cowboy",
            portrait: !0,
            width: SCREEN_W,
            height: SCREEN_H,
            padmode: "none",
            zoom: 1
        });
        gbox.setDoubleBuffering(!1);
        gbox.setAutoskip(null);
        gbox.addImage("img_loading", IMAGE_PATH + "/loading.png");
        gbox.addImage("logo", IMAGE_PATH + "/logo.jpg");
        createImage();
        gbox.setFps(25);
        setupTouch();
        initMenu();
        initGame();
        initGameMenu();
        initHelp();
        initRank();
        gbox.loadAll(main)
    }, !1)
}

function main() {
    gbox.setGroups([GROUP_MAP, GROUP_COW, GROUP_LARIAT, GROUP_GAME_UI, GROUP_MENU, GROUP_GAME_MENU, GROUP_WIN, GROUP_LOSE, GROUP_HELP, GROUP_RANK, GROUP_BACK_CALL]);
    gbox.addObject(obj_backcall);
    enterMenu();
    gbox.lastTime = (new Date).getTime();
    gbox.go()
}
var obj_backcall = new function() {
        this.id = "obj_backcall";
        this.group = GROUP_BACK_CALL;
        var a = [];
        this.invokeLater = function(a) {
            this.callBack = a
        };
        this.registerFrameUpdate = function(b) {
            for (var c in a) if (a[c] === b) return;
            a.push(b)
        };
        this.first = function() {
            for (var b in a) {
                var c = a[b];
                if (c.frame && c.action) c.frame = AnimMgr.nextFrame(c.action)
            }
            if (this.callBack) this.callBack(), this.callBack = null
        };
        this.blit = function() {
            DEBUG && gbox.blitSystemText(gbox.getBufferContext(), {
                text: "FPS:" + (1E3 * gbox.frames / gbox.totalTime).toFixed(2),
                color: "#FF0000",
                font: "bold 16px sans-serif",
                x: 0,
                y: 2
            })
        }
    },
    currentLayer, lastLayer;

function setCurrentLayer(a) {
    lastLayer = currentLayer;
    currentLayer = a
}
var toLayer;

function changeMap(a) {
    setCurrentLayer(a);
    clickObjectList = [];
    gbox.setLayerShow(a);
    registerLayerToList(a);
    clickObjectList.reverse();
    DEBUG && console.log("clickObjectList = " + clickObjectList.length)
}
var FrameList = function(a, b) {
        this.speed = a;
        this.frames = b;
        this.cnt = 0;
        this.time = (new Date).getTime();
        this.reset = function() {
            this.cnt = 0;
            this.time = (new Date).getTime()
        };
        this.clone = function(a) {
            if (!a) return this;
            return new FrameList(this.speed, this.frames.concat())
        }
    },
    AnimMgr = new function() {
        this.changeAction = function(a, b, c) {
            if (a.action != b) b.reset(), a.action = b.clone(c), a.frame = b.frames[0]
        };
        this.getFrameID = function(a, b) {
            return a.frames[b]
        };
        this.nextFrame = function(a, b) {
            if ((new Date).getTime() - a.time > a.speed) a.cnt++, a.time = (new Date).getTime();
            if (b) return a.frames[a.cnt >= a.frames.length ? a.frames.length - 1 : a.cnt];
            a.cnt = Math.floor(a.cnt % a.frames.length);
            return a.frames[a.cnt]
        };
        this.isActionFinished = function(a) {
            return a.cnt >= a.frames.length - 1
        };
        this.draw = function(a, b) {
            if (a != null) {
                var c = gbox.getImage(b.anim.image),
                    e = b.anim;
                gbox._implicitsargs(b);
                a.save();
                a.globalAlpha = b.alpha ? b.alpha : 1;
                var f = b.dx,
                    h = b.dy;
                if (b.rotate != void 0) a.translate(f, h), a.rotate(b.rotate), b.dx = 0, b.dy = 0;
                f = e.frame[b.tile];
                for (h = 0; h < f.length; h++) {
                    var g = e.clip[f[h][0]],
                        d = g[0],
                        j = g[1],
                        l = g[2],
                        k = g[3],
                        g = f[h][2],
                        m = f[h][3] ^ b.fliph,
                        q = f[h][4] ^ b.flipv,
                        r = b.dx,
                        s = b.dy;
                    r += f[h][1] * (b.fliph ? -1 : 1);
                    s += g * (b.flipv ? -1 : 1);
                    var g = a,
                        n = c,
                        t = m,
                        u = q,
                        m = b.dw,
                        q = b.dh;
                    g.save();
                    g.scale(t ? -1 : 1, u ? -1 : 1);
                    var o = l,
                        p = k;
                    r *= t ? -1 : 1;
                    s *= u ? -1 : 1;
                    l = m ? m : l;
                    k = q ? q : k;
                    if (n && g) {
                        d < 0 && (r -= l / o * d, o += d, d = 0);
                        j < 0 && (s -= k / p * j, p += j, j = 0);
                        d + o > n.width && (l = l / o * (n.width - d), o = n.width - d);
                        j + p > n.height && (k = k / p * (n.height - j), p = n.height - j);
                        try {
                            p > 0 && o > 0 && d < n.width && j < n.height && g.drawImage(n, Math.floor(d), Math.floor(j), Math.floor(o), Math.floor(p), Math.floor(r), Math.floor(s), Math.floor(l), Math.floor(k))
                        } catch (v) {
                            console.log("AnimMgr.drawImage() : " + v), console.log(d + ", " + j + ", " + o + ", " + p + ", " + r + ", " + s + ", " + l + ", " + k)
                        }
                    }
                    g.restore()
                }
                a.restore()
            }
        };
        this.isCollidedWith = function(a, b) {
            return toys.topview.collides(a, b)
        };
        this.updatePolyWithAnim = function(a) {
            var b = a.anim.coll[a.frame],
                c = b[0],
                e = b[1],
                f = b[2] + c,
                b = b[3] + e;
            if (a.fliph) var h = c,
                c = f,
                f = h;
            a.flipv && (h = e, e = b, b = h);
            a.poly = [
                [a.x + c, a.y + e],
                [a.x + f, a.y + e],
                [a.x + f, a.y + b],
                [a.x + c, a.y + b]
            ]
        };
        this.updateCollWithAnim = function(a) {
            var b = a.anim.coll[a.frame];
            a.colx = b[0];
            a.coly = b[1];
            a.colw = b[2];
            a.colh = b[3];
            if (a.fliph) a.colx = -(a.colw + a.colx);
            if (a.flipv) a.coly = -(a.colh + a.coly)
        }
    },
    animNum_0 = new function() {
        this.clip = [
            [0, 0, 15, 19],
            [16, 0, 10, 19],
            [27, 0, 15, 19],
            [43, 0, 15, 19],
            [59, 0, 15, 19],
            [75, 0, 15, 19],
            [91, 0, 15, 19],
            [107, 0, 15, 19],
            [123, 0, 15, 19],
            [139, 0, 15, 19]
        ];
        this.frame = [
            [
                [0, 0, 0, !1, !1]
            ],
            [
                [1, 3, 0, !1, !1]
            ],
            [
                [2, 0, 0, !1, !1]
            ],
            [
                [3, 0, 0, !1, !1]
            ],
            [
                [4, 0, 0, !1, !1]
            ],
            [
                [5, 0, 0, !1, !1]
            ],
            [
                [6, 0, 0, !1, !1]
            ],
            [
                [7, 0, 0, !1, !1]
            ],
            [
                [8, 0, 0, !1, !1]
            ],
            [
                [9, 0, 0, !1, !1]
            ],
            []
        ];
        this.coll = [
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 15, 19],
            [0, 0, 16, 19]
        ];
        this.action = [];
        this.action.num = new FrameList(500, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.action["/"] = new FrameList(50, [10])
    },
    animNum_1 = new function() {
        this.clip = [
            [15, 0, 6, 13],
            [22, 0, 14, 13],
            [37, 0, 14, 13],
            [52, 0, 14, 13],
            [67, 0, 14, 13],
            [82, 0, 15, 13],
            [98, 0, 15, 13],
            [114, 0, 14, 13],
            [129, 0, 15, 13],
            [0, 0, 14, 13],
            [145, 0, 6, 17]
        ];
        this.frame = [
            [
                [9, 0, 0, !1, !1]
            ],
            [
                [0, 0, 0, !1, !1]
            ],
            [
                [1, 0, 0, !1, !1]
            ],
            [
                [2, 0, 0, !1, !1]
            ],
            [
                [3, 0, 0, !1, !1]
            ],
            [
                [4, 0, 0, !1, !1]
            ],
            [
                [5, 0, 0, !1, !1]
            ],
            [
                [6, 0, 0, !1, !1]
            ],
            [
                [7, 0, 0, !1, !1]
            ],
            [
                [8, 0, 0, !1, !1]
            ],
            [
                [10, 0, -2, !1, !1]
            ]
        ];
        this.coll = [
            [0, 0, 14, 13],
            [0, 0, 6, 13],
            [0, 0, 14, 13],
            [0, 0, 14, 13],
            [0, 0, 14, 13],
            [0, 0, 14, 13],
            [0, 0, 15, 13],
            [0, 0, 15, 13],
            [0, 0, 14, 13],
            [0, 0, 15, 13],
            [0, 0, 7, 13]
        ];
        this.action = [];
        this.action.num = new FrameList(50, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        this.action["/"] = new FrameList(50, [10])
    },
    animNum_2 = new function() {
        this.clip = [
            [6, 0, 3, 8],
            [10, 0, 5, 8],
            [16, 0, 5, 8],
            [22, 0, 5, 8],
            [28, 0, 5, 8],
            [34, 0, 5, 8],
            [40, 0, 5, 8],
            [46, 0, 5, 8],
            [52, 0, 5, 8],
            [0, 0, 5, 8]
        ];
        this.frame = [
            [
                [9, 0, 0, !1, !1]
            ],
            [
                [0, 1, 0, !1, !1]
            ],
            [
                [1, 0, 0, !1, !1]
            ],
            [
                [2, 0, 0, !1, !1]
            ],
            [
                [3, 0, 0, !1, !1]
            ],
            [
                [4, 0, 0, !1, !1]
            ],
            [
                [5, 0, 0, !1, !1]
            ],
            [
                [6, 0, 0, !1, !1]
            ],
            [
                [7, 0, 0, !1, !1]
            ],
            [
                [8, 0, 0, !1, !1]
            ],
            []
        ];
        this.coll = [
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 5, 8],
            [0, 0, 0, 0]
        ];
        this.action = [];
        this.action.num = new FrameList(50, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.action["/"] = new FrameList(50, [10])
    },
    animNum_3 = new function() {
        this.clip = [
            [0, 0, 17, 16],
            [18, 0, 7, 16],
            [26, 0, 16, 16],
            [43, 0, 16, 16],
            [60, 0, 17, 16],
            [78, 0, 16, 16],
            [95, 0, 16, 16],
            [112, 0, 17, 16],
            [130, 0, 16, 16],
            [147, 0, 17, 16]
        ];
        this.frame = [
            [
                [0, 0, 0, !1, !1]
            ],
            [
                [1, 0, 0, !1, !1]
            ],
            [
                [2, 0, 0, !1, !1]
            ],
            [
                [3, 0, 0, !1, !1]
            ],
            [
                [4, 0, 0, !1, !1]
            ],
            [
                [5, 0, 0, !1, !1]
            ],
            [
                [6, 0, 0, !1, !1]
            ],
            [
                [7, 0, 0, !1, !1]
            ],
            [
                [8, 0, 0, !1, !1]
            ],
            [
                [9, 0, 0, !1, !1]
            ],
            []
        ];
        this.coll = [
            [0, 0, 17, 16],
            [0, 0, 7, 16],
            [0, 0, 16, 16],
            [0, 0, 16, 16],
            [0, 0, 17, 16],
            [0, 0, 16, 16],
            [0, 0, 16, 16],
            [0, 0, 17, 16],
            [0, 0, 16, 16],
            [0, 0, 17, 16],
            [0, 0, 17, 16]
        ];
        this.action = [];
        this.action.num = new FrameList(50, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.action["/"] = new FrameList(50, [10])
    },
    animNum_4 = new function() {
        this.clip = [
            [0, 0, 10, 16],
            [11, 0, 7, 16],
            [19, 0, 10, 16],
            [30, 0, 10, 16],
            [41, 0, 10, 16],
            [52, 0, 10, 16],
            [63, 0, 10, 16],
            [74, 0, 10, 16],
            [85, 0, 10, 16],
            [96, 0, 10, 16]
        ];
        this.frame = [
            [
                [0, 0, 0, !1, !1]
            ],
            [
                [1, 2, 0, !1, !1]
            ],
            [
                [2, 0, 0, !1, !1]
            ],
            [
                [3, 0, 0, !1, !1]
            ],
            [
                [4, 0, 0, !1, !1]
            ],
            [
                [5, 0, 0, !1, !1]
            ],
            [
                [6, 0, 0, !1, !1]
            ],
            [
                [7, 0, 0, !1, !1]
            ],
            [
                [8, 0, 0, !1, !1]
            ],
            [
                [9, 0, 0, !1, !1]
            ],
            []
        ];
        this.coll = [
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16],
            [0, 0, 10, 16]
        ];
        this.action = [];
        this.action.num = new FrameList(50, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.action["/"] = new FrameList(50, [10])
    };
animNum_0.image = "img_num_0";
animNum_1.image = "img_num_1";
animNum_2.image = "img_num_2";
animNum_3.image = "img_num_3";
animNum_4.image = "img_num_4";
for (var ImageNumber = new function() {
    this.drawNum = function(b, c, e, f, h, g, d) {
        for (var j = 0, l = d.coll[0][3], c = "" + c, k = 0; k < c.length; k++) {
            var m = a(d, c[k]);
            j += d.coll[m][2] + h
        }
        j -= h;
        g == void 0 && (g = "TL");
        g = g.toUpperCase();
        g.indexOf("R") != -1 ? e -= j : g.indexOf("H") != -1 && (e -= j / 2);
        g.indexOf("B") != -1 ? f -= l : g.indexOf("V") != -1 && (f -= l / 2);
        for (k = 0; k < c.length; k++) m = a(d, c[k]), AnimMgr.draw(b, {
            tile: m,
            dx: e,
            dy: f,
            anim: d
        }), e += d.coll[m][2] + h
    };
    var a = function(a, c) {
        return c >= "0" && c <= "9" ? a.action.num.frames[c] : a.action[c].frames[0]
    }
}, animMainMenu = new function() {
    this.clip = [
        [0, 0, 111, 31],
        [0, 64, 111, 31],
        [0, 96, 111, 31],
        [0, 128, 110, 31],
        [0, 32, 111, 31],
        [0, 160, 149, 50],
        [0, 211, 96, 25]
    ];
    this.frame = [
        [
            [5, -74, -9, !1, !1],
            [0, -55, 0, !1, !1]
        ],
        [
            [5, -74, -9, !1, !1],
            [4, -55, 0, !1, !1]
        ],
        [
            [5, -74, -9, !1, !1],
            [1, -55, 0, !1, !1]
        ],
        [
            [5, -74, -9, !1, !1],
            [2, -55, 0, !1, !1]
        ],
        [
            [5, -74, -9, !1, !1],
            [3, -55, 0, !1, !1]
        ],
        [
            [5, -74, 0, !1, !1]
        ],
        [
            [5, -74, 0, !1, !1],
            [6, -48, 12, !1, !1]
        ]
    ];
    this.coll = [
        [-74, -9, 149, 50],
        [-74, -9, 149, 50],
        [-74, -9, 149, 50],
        [-74, -9, 149, 50],
        [-74, -9, 149, 50],
        [-74, 0, 149, 50],
        [-74, 0, 149, 50]
    ];
    this.action = [];
    this.action.start = new FrameList(50, [0]);
    this.action.charge = new FrameList(50, [1]);
    this.action.help = new FrameList(50, [2]);
    this.action.rank = new FrameList(50, [3]);
    this.action.exit = new FrameList(50, [4]);
    this.action.item_bg = new FrameList(50, [5]);
    this.action["continue"] = new FrameList(50, [6])
}, animCow_0 = new function() {
    this.clip = [
        [0, 0, 240, 169],
        [0, 169, 240, 169],
        [0, 338, 240, 169],
        [0, 507, 240, 169],
        [0, 676, 240, 169],
        [0, 845, 240, 169],
        [0, 1183, 240, 169],
        [0, 1352, 240, 169],
        [0, 1521, 240, 169]
    ];
    this.frame = [
        [],
        [
            [2, -120, -169, !1, !1]
        ],
        [
            [0, -120, -189, !1, !1]
        ],
        [
            [1, -120, -179, !1, !1]
        ],
        [
            [0, -83, -180, !1, !0]
        ],
        [
            [0, -83, -124, !1, !0]
        ],
        [
            [0, -83, -60, !1, !0]
        ],
        [
            [3, -120, -169, !1, !1]
        ],
        [
            [4, -120, -169, !1, !1]
        ],
        [
            [5, -120, -169, !1, !1]
        ],
        [
            [6, -120, -169, !1, !1]
        ],
        [
            [7, -120, -169, !1, !1]
        ],
        [
            [8, -120, -169, !1, !1]
        ]
    ];
    this.coll = [
        [0, 0, 0, 0],
        [-85, -150, 45, 150],
        [-85, -150, 45, 150],
        [-85, -150, 45, 150],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-90, -150, 50, 150],
        [-85, -150, 45, 150],
        [-85, -150, 45, 150],
        [-85, -150, 45, 150],
        [-85, -150, 45, 150],
        [-85, -150, 45, 150]
    ];
    this.action = [];
    this.action.hide = new FrameList(50, [0]);
    this.action.run_left = new FrameList(100, [1, 2, 3]);
    this.action.is_being_pulled = new FrameList(1E3, [4, 5, 6]);
    this.action.becatched = new FrameList(50, [7, 7, 7, 7, 7]);
    this.action.laugh = new FrameList(100, [8, 9, 8, 10, 11, 12, 11])
}, animCow_1 = new function() {
    this.clip = [
        [0, 0, 240, 169],
        [0, 169, 240, 169],
        [0, 338, 240, 169],
        [0, 507, 240, 169],
        [0, 676, 240, 169],
        [0, 845, 240, 169],
        [0, 1014, 240, 169]
    ];
    this.frame = [
        [],
        [
            [2, -120, -169, !1, !1]
        ],
        [
            [0, -120, -189, !1, !1]
        ],
        [
            [1, -120, -179, !1, !1]
        ],
        [
            [0, -83, -180, !1, !0]
        ],
        [
            [0, -83, -124, !1, !0]
        ],
        [
            [0, -83, -60, !1, !0]
        ],
        [
            [3, -120, -169, !1, !1]
        ],
        [
            [4, -120, -169, !1, !1]
        ],
        [
            [5, -120, -169, !1, !1]
        ],
        [
            [6, -120, -169, !1, !1]
        ]
    ];
    this.coll = [
        [0, 0, 0, 0],
        [-80, -150, 40, 150],
        [-80, -150, 40, 150],
        [-80, -150, 40, 150],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150]
    ];
    this.action = [];
    this.action.hide = new FrameList(50, [0]);
    this.action.run_left = new FrameList(100, [1, 2, 3]);
    this.action.is_being_pulled = new FrameList(1E3, [4, 5, 6]);
    this.action.becatched = new FrameList(50, [7, 7, 7, 7, 7]);
    this.action.laugh = new FrameList(100, [8, 9, 10, 9, 10, 9, 10])
}, animCow_2 = new function() {
    this.clip = [
        [0, 0, 240, 169],
        [0, 169, 240, 169],
        [0, 338, 240, 169],
        [0, 507, 240, 169],
        [0, 676, 240, 169],
        [0, 845, 240, 169],
        [0, 1014, 240, 169],
        [0, 1183, 240, 169],
        [0, 1352, 240, 169]
    ];
    this.frame = [
        [],
        [
            [2, -120, -169, !1, !1]
        ],
        [
            [0, -120, -189, !1, !1]
        ],
        [
            [1, -120, -179, !1, !1]
        ],
        [
            [0, -83, -180, !1, !0]
        ],
        [
            [0, -83, -124, !1, !0]
        ],
        [
            [0, -83, -60, !1, !0]
        ],
        [
            [3, -120, -169, !1, !1]
        ],
        [
            [4, -120, -169, !1, !1]
        ],
        [
            [5, -120, -169, !1, !1]
        ],
        [
            [6, -120, -169, !1, !1]
        ],
        [
            [7, -120, -169, !1, !1]
        ],
        [
            [8, -120, -169, !1, !1]
        ]
    ];
    this.coll = [
        [0, 0, 0, 0],
        [-80, -150, 40, 150],
        [-80, -150, 40, 150],
        [-80, -150, 40, 150],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150]
    ];
    this.action = [];
    this.action.hide = new FrameList(50, [0]);
    this.action.run_left = new FrameList(100, [1, 2, 3]);
    this.action.is_being_pulled = new FrameList(1E3, [4, 5, 6]);
    this.action.becatched = new FrameList(50, [7, 7, 7, 7, 7]);
    this.action.laugh = new FrameList(100, [8, 9, 10, 11, 12, 11, 12])
}, animCow_3 = new function() {
    this.clip = [
        [0, 0, 240, 169],
        [0, 169, 240, 169],
        [0, 338, 240, 169],
        [0, 507, 240, 169],
        [0, 676, 240, 169],
        [0, 845, 240, 169],
        [0, 1014, 240, 169]
    ];
    this.frame = [
        [],
        [
            [2, -120, -169, !1, !1]
        ],
        [
            [0, -120, -189, !1, !1]
        ],
        [
            [1, -120, -179, !1, !1]
        ],
        [
            [0, -83, -180, !1, !0]
        ],
        [
            [0, -83, -124, !1, !0]
        ],
        [
            [0, -83, -60, !1, !0]
        ],
        [
            [3, -120, -169, !1, !1]
        ],
        [
            [4, -120, -169, !1, !1]
        ],
        [
            [5, -120, -169, !1, !1]
        ],
        [
            [6, -120, -169, !1, !1]
        ]
    ];
    this.coll = [
        [0, 0, 0, 0],
        [-80, -150, 40, 150],
        [-80, -150, 40, 150],
        [-80, -150, 40, 150],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150]
    ];
    this.action = [];
    this.action.hide = new FrameList(50, [0]);
    this.action.run_left = new FrameList(100, [1, 2, 3]);
    this.action.is_being_pulled = new FrameList(1E3, [4, 5, 6]);
    this.action.becatched = new FrameList(50, [7, 7, 7, 7, 7]);
    this.action.laugh = new FrameList(100, [8, 9, 10, 9, 8, 9, 10])
}, animCow_4 = new function() {
    this.clip = [
        [0, 0, 240, 169],
        [0, 169, 240, 169],
        [0, 338, 240, 169],
        [0, 507, 240, 169],
        [0, 676, 240, 169],
        [0, 845, 240, 169],
        [0, 1014, 240, 169],
        [0, 1352, 240, 169]
    ];
    this.frame = [
        [],
        [
            [2, -120, -169, !1, !1]
        ],
        [
            [0, -120, -189, !1, !1]
        ],
        [
            [1, -120, -179, !1, !1]
        ],
        [
            [0, -83, -180, !1, !0]
        ],
        [
            [0, -83, -124, !1, !0]
        ],
        [
            [0, -83, -60, !1, !0]
        ],
        [
            [3, -120, -169, !1, !1]
        ],
        [
            [4, -120, -169, !1, !1]
        ],
        [
            [5, -120, -169, !1, !1]
        ],
        [
            [6, -120, -169, !1, !1]
        ],
        [
            [7, -120, -169, !1, !1]
        ]
    ];
    this.coll = [
        [0, 0, 0, 0],
        [-80, -150, 40, 150],
        [-80, -150, 40, 150],
        [-80, -150, 40, 150],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150],
        [-90, -150, 50, 150]
    ];
    this.action = [];
    this.action.hide = new FrameList(50, [0]);
    this.action.run_left = new FrameList(100, [1, 2, 3]);
    this.action.is_being_pulled = new FrameList(1E3, [4, 5, 6]);
    this.action.becatched = new FrameList(50, [7, 7, 7, 7, 7]);
    this.action.laugh = new FrameList(100, [8, 9, 10, 8, 11, 8, 11])
}, animLariat = new function() {
    this.clip = [
        [0, 98, 46, 45],
        [47, 98, 28, 46],
        [46, 0, 78, 32],
        [46, 33, 30, 64],
        [76, 101, 28, 45],
        [93, 33, 31, 67],
        [0, 0, 45, 97],
        [0, 145, 74, 33],
        [105, 100, 20, 46],
        [83, 90, 9, 10],
        [75, 147, 45, 50],
        [77, 33, 5, 60],
        [125, 0, 143, 334],
        [269, 0, 142, 363],
        [412, 0, 170, 295]
    ];
    this.frame = [
        [],
        [
            [0, -24, -47, !1, !1],
            [2, -50, -105, !1, !1],
            [4, -35, -82, !1, !1]
        ],
        [
            [0, -16, -47, !1, !1],
            [2, -41, -105, !1, !1],
            [1, -5, -83, !1, !1]
        ],
        [
            [0, -19, -50, !1, !1],
            [2, -40, -106, !1, !1],
            [3, -8, -105, !1, !1]
        ],
        [
            [0, -23, -50, !1, !1],
            [2, -48, -108, !1, !1],
            [5, -34, -107, !1, !1]
        ],
        [
            [6, -10, -107, !1, !1],
            [7, -45, -133, !1, !1]
        ],
        [
            [6, -10, -107, !1, !1],
            [8, -10, -146, !1, !1],
            [7, -45, -173, !1, !1]
        ],
        [
            [6, -10, -107, !1, !1],
            [8, -10, -146, !1, !1],
            [8, -10, -186, !1, !1],
            [7, -45, -212, !1, !1]
        ],
        [
            [6, -10, -107, !1, !1],
            [8, -10, -146, !1, !1],
            [8, -10, -186, !1, !1],
            [8, -10, -225, !1, !1],
            [7, -45, -251, !1, !1]
        ],
        [
            [6, -10, -107, !1, !1],
            [8, -10, -146, !1, !1],
            [8, -10, -186, !1, !1],
            [8, -10, -225, !1, !1],
            [8, -10, -263, !1, !1],
            [7, -45, -289, !1, !1]
        ],
        [
            [10, -12, -68, !1, !1],
            [11, -3, -128, !1, !1],
            [11, -3, -188, !1, !1],
            [11, -3, -248, !1, !1],
            [9, -5, -258, !1, !1]
        ],
        [
            [10, -12, -68, !1, !1],
            [11, -3, -128, !1, !1],
            [11, -3, -188, !1, !1],
            [9, -5, -198, !1, !1]
        ],
        [
            [10, -12, -68, !1, !1],
            [11, -3, -128, !1, !1],
            [9, -5, -138, !1, !1]
        ],
        [
            [12, -61, -466, !1, !1]
        ],
        [
            [13, -67, -398, !1, !1]
        ],
        [
            [14, -75, -295, !1, !1]
        ]
    ];
    this.coll = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-5, -460, 10, 460],
        [-5, -460, 10, 460],
        [-5, -460, 10, 460],
        [-5, -460, 10, 460],
        [-5, -460, 10, 460],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-10, -161, 20, 161],
        [-10, -64, 20, 64],
        [0, 0, 0, 0]
    ];
    this.action = [];
    this.action.hide = new FrameList(1E3, [0]);
    this.action.wait = new FrameList(100, [1, 2, 3, 4]);
    this.action["throw"] = new FrameList(50, [5, 6, 7, 8, 9]);
    this.action.pull = new FrameList(150, [13, 14, 15, 15, 15, 15]);
    this.action["catch"] = new FrameList(50, [10, 10, 10, 10, 10])
}, animGround = new function() {
    this.clip = [
        [0, 0, 98, 85]
    ];
    this.frame = [
        [],
        [
            [0, 154, -179, !1, !1]
        ]
    ];
    this.coll = [
        [0, -240, 320, 480],
        [0, -240, 320, 480]
    ];
    this.action = [];
    this.action.bg = new FrameList(1E3, [0, 1])
}, animUI = new function() {
    this.clip = [
        [119, 90, 86, 40],
        [0, 90, 58, 56],
        [59, 90, 59, 47],
        [187, 131, 22, 26],
        [0, 45, 39, 44],
        [0, 0, 39, 44],
        [40, 45, 40, 44],
        [40, 0, 40, 44],
        [178, 45, 37, 44],
        [178, 0, 37, 44],
        [81, 45, 42, 44],
        [81, 0, 42, 44],
        [124, 45, 53, 44],
        [124, 0, 53, 44],
        [0, 189, 36, 18],
        [0, 170, 36, 18],
        [0, 155, 186, 14],
        [119, 131, 56, 23],
        [37, 189, 36, 18],
        [37, 170, 36, 18],
        [59, 138, 36, 16],
        [187, 159, 2, 5],
        [74, 189, 36, 18],
        [74, 170, 36, 18],
        [111, 189, 36, 18],
        [111, 170, 36, 18],
        [148, 189, 36, 18],
        [148, 170, 36, 18],
        [189, 165, 1, 5],
        [190, 159, 2, 5]
    ];
    this.frame = [
        [
            [0, 0, -40, !1, !1]
        ],
        [
            [1, -58, -56, !1, !1]
        ],
        [
            [2, -29, 0, !1, !1],
            [2, -90, 0, !1, !1],
            [2, -151, 0, !1, !1],
            [2, 32, 0, !1, !1],
            [2, 93, 0, !1, !1],
            [4, -141, 0, !1, !1],
            [6, -81, 0, !1, !1],
            [8, -18, 0, !1, !1],
            [10, 41, 0, !1, !1],
            [12, 96, 0, !1, !1],
            [17, -150, 45, !1, !1],
            [17, -89, 45, !1, !1],
            [17, -28, 45, !1, !1],
            [17, 33, 45, !1, !1],
            [17, 94, 45, !1, !1],
            [14, -140, 48, !1, !1],
            [18, -79, 48, !1, !1],
            [22, -17, 48, !1, !1],
            [24, 43, 48, !1, !1],
            [26, 104, 48, !1, !1]
        ],
        [
            [5, -141, 0, !1, !1],
            [15, -140, 48, !1, !1],
            [3, -132, 73, !1, !1]
        ],
        [
            [5, -141, 0, !1, !1],
            [15, -140, 48, !1, !1],
            [3, -132, 69, !1, !1]
        ],
        [
            [5, -141, 0, !1, !1],
            [15, -140, 48, !1, !1],
            [3, -132, 65, !1, !1]
        ],
        [
            [5, -141, 0, !1, !1],
            [15, -140, 48, !1, !1],
            [3, -132, 61, !1, !1]
        ],
        [
            [7, -81, 0, !1, !1],
            [19, -79, 48, !1, !1],
            [3, -72, 73, !1, !1]
        ],
        [
            [7, -81, 0, !1, !1],
            [19, -79, 48, !1, !1],
            [3, -72, 69, !1, !1]
        ],
        [
            [7, -81, 0, !1, !1],
            [19, -79, 48, !1, !1],
            [3, -72, 65, !1, !1]
        ],
        [
            [7, -81, 0, !1, !1],
            [19, -79, 48, !1, !1],
            [3, -72, 61, !1, !1]
        ],
        [
            [9, -18, 0, !1, !1],
            [23, -17, 48, !1, !1],
            [3, -11, 73, !1, !1]
        ],
        [
            [9, -18, 0, !1, !1],
            [23, -17, 48, !1, !1],
            [3, -11, 69, !1, !1]
        ],
        [
            [9, -18, 0, !1, !1],
            [23, -17, 48, !1, !1],
            [3, -11, 65, !1, !1]
        ],
        [
            [9, -18, 0, !1, !1],
            [23, -17, 48, !1, !1],
            [3, -11, 61, !1, !1]
        ],
        [
            [11, 41, 0, !1, !1],
            [25, 43, 48, !1, !1],
            [3, 50, 73, !1, !1]
        ],
        [
            [11, 41, 0, !1, !1],
            [25, 43, 48, !1, !1],
            [3, 50, 69, !1, !1]
        ],
        [
            [11, 41, 0, !1, !1],
            [25, 43, 48, !1, !1],
            [3, 50, 65, !1, !1]
        ],
        [
            [11, 41, 0, !1, !1],
            [25, 43, 48, !1, !1],
            [3, 50, 61, !1, !1]
        ],
        [
            [13, 96, 0, !1, !1],
            [27, 104, 48, !1, !1],
            [3, 111, 73, !1, !1]
        ],
        [
            [13, 96, 0, !1, !1],
            [27, 104, 48, !1, !1],
            [3, 111, 69, !1, !1]
        ],
        [
            [13, 96, 0, !1, !1],
            [27, 104, 48, !1, !1],
            [3, 111, 65, !1, !1]
        ],
        [
            [13, 96, 0, !1, !1],
            [27, 104, 48, !1, !1],
            [3, 111, 61, !1, !1]
        ],
        [
            [16, -93, -14, !1, !1],
            [20, -90, -30, !1, !1]
        ],
        [
            [21, -75, -10, !1, !1]
        ],
        [
            [28, -74, -10, !1, !1]
        ],
        [
            [29, -1, -10, !1, !1]
        ]
    ];
    this.coll = [
        [41, -25, 39, 19],
        [-58, -56, 58, 56],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-122, 0, 61, 47],
        [-52, -14, 60, 7],
        [-75, -10, 164, 5],
        [-74, -10, 1, 5],
        [-75, -10, 164, 5]
    ];
    this.action = [];
    this.action.coin = new FrameList(50, [0]);
    this.action.clock = new FrameList(50, [1]);
    this.action.cow_type = new FrameList(50, [2]);
    this.action.cursor_0 = new FrameList(50, [3, 4, 5, 6, 5, 4]);
    this.action.cursor_1 = new FrameList(50, [7, 8, 9, 10, 9, 8]);
    this.action.cursor_2 = new FrameList(50, [11, 12, 13, 14, 13, 12]);
    this.action.cursor_3 = new FrameList(50, [15, 16, 17, 18, 17, 16]);
    this.action.cursor_4 = new FrameList(50, [19, 20, 21, 22, 21, 20]);
    this.action.lv = new FrameList(50, [23, 24, 25, 26])
}, animCoin = new function() {
    this.clip = [
        [39, 48, 23, 19],
        [73, 45, 22, 22],
        [73, 67, 22, 19],
        [39, 67, 23, 7],
        [39, 74, 23, 22],
        [95, 0, 19, 23],
        [73, 0, 23, 13],
        [73, 13, 23, 19],
        [73, 32, 23, 13],
        [0, 0, 39, 43],
        [0, 43, 39, 36],
        [39, 0, 34, 27],
        [0, 79, 25, 24],
        [73, 86, 20, 18],
        [39, 27, 24, 21]
    ];
    this.frame = [
        [
            [0, -137, -238, !1, !1],
            [7, -125, -236, !1, !1],
            [2, -124, -232, !1, !1],
            [3, -131, -202, !1, !1],
            [8, -142, -227, !1, !1],
            [5, -116, -227, !1, !1],
            [4, -128, -221, !1, !1],
            [1, -140, -224, !1, !1],
            [6, -133, -239, !1, !1],
            [9, -126, -236, !1, !1]
        ],
        [
            [0, -106, -203, !1, !1],
            [7, -106, -189, !1, !1],
            [2, -90, -201, !1, !1],
            [3, -93, -141, !1, !1],
            [8, -86, -180, !1, !1],
            [5, -96, -163, !1, !1],
            [4, -106, -173, !1, !1],
            [1, -78, -164, !1, !1],
            [6, -111, -182, !1, !1],
            [9, -93, -157, !1, !1],
            [9, -124, -171, !1, !1],
            [12, -115, -218, !1, !1]
        ],
        [
            [0, -100, -174, !1, !1],
            [7, -14, -114, !1, !1],
            [2, -71, -149, !1, !1],
            [3, -36, -150, !1, !1],
            [8, -66, -128, !1, !1],
            [5, -45, -113, !1, !1],
            [4, -45, -139, !1, !1],
            [1, -21, -78, !1, !1],
            [6, -57, -114, !1, !1],
            [9, -90, -156, !1, !1],
            [10, -114, -205, !1, !1],
            [11, -25, -124, !1, !1],
            [14, -25, -103, !1, !1],
            [9, -28, -95, !1, !1],
            [10, -61, -112, !1, !1],
            [11, -59, -211, !1, !1]
        ],
        [
            [0, 6, -134, !1, !1],
            [7, 16, -77, !1, !1],
            [2, -17, -103, !1, !1],
            [3, -2, -56, !1, !1],
            [8, -30, -63, !1, !1],
            [5, -25, -39, !1, !1],
            [4, 0, -96, !1, !1],
            [1, -5, -41, !1, !1],
            [6, -18, -111, !1, !1],
            [9, -18, -50, !1, !1],
            [10, 13, -156, !1, !1],
            [11, -46, -120, !1, !1],
            [14, -21, -52, !1, !1],
            [10, -21, -86, !1, !1],
            [9, -56, -94, !1, !1],
            [11, -33, -161, !1, !1],
            [10, -47, -60, !1, !1],
            [9, 19, -120, !1, !1]
        ],
        [
            [0, 6, -76, !1, !1],
            [7, 25, -25, !1, !1],
            [2, 4, -62, !1, !1],
            [3, 21, -17, !1, !1],
            [8, 18, -6, !1, !1],
            [5, 13, -9, !1, !1],
            [4, 9, -26, !1, !1],
            [1, 4, 10, !1, !1],
            [6, 13, -41, !1, !1],
            [9, -7, -48, !1, !1],
            [10, -7, -22, !1, !1],
            [11, 17, -83, !1, !1],
            [14, 41, -32, !1, !1],
            [10, -5, 2, !1, !1],
            [12, 5, -64, !1, !1],
            [10, -5, -89, !1, !1],
            [12, -35, -118, !1, !1],
            [13, -11, -100, !1, !1],
            [14, -46, -137, !1, !1],
            [12, -14, -118, !1, !1]
        ],
        [
            [0, -26, 18, !1, !1],
            [7, -95, 88, !1, !1],
            [2, -21, -7, !1, !1],
            [3, -113, 104, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -53, 51, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -39, 41, !1, !1],
            [6, -83, 77, !1, !1],
            [9, -54, 30, !1, !1],
            [10, -52, 59, !1, !1],
            [11, -29, -28, !1, !1],
            [14, -20, -8, !1, !1],
            [10, -152, 104, !1, !1],
            [12, -41, 22, !1, !1],
            [12, 0, 6, !1, !1],
            [10, -81, 55, !1, !1],
            [9, -86, 81, !1, !1]
        ],
        [
            [0, -69, 75, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -67, 53, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -88, 96, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -129, 98, !1, !1],
            [6, -110, 105, !1, !1],
            [9, -102, 66, !1, !1],
            [10, -79, 78, !1, !1],
            [11, -29, -28, !1, !1],
            [14, -50, 60, !1, !1],
            [10, -143, 99, !1, !1],
            [12, -61, 38, !1, !1],
            [12, -23, 8, !1, !1],
            [10, -50, 31, !1, !1],
            [9, -114, 96, !1, !1],
            [12, -5, -13, !1, !1],
            [10, -37, 21, !1, !1]
        ],
        [
            [0, -137, 109, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -134, 115, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -133, 112, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -139, 113, !1, !1],
            [6, -137, 116, !1, !1],
            [9, -105, 88, !1, !1],
            [10, -142, 90, !1, !1],
            [11, -76, 89, !1, !1],
            [14, -85, 89, !1, !1],
            [10, -122, 94, !1, !1],
            [12, -115, 68, !1, !1],
            [12, -93, 75, !1, !1],
            [10, -78, 67, !1, !1],
            [9, -139, 102, !1, !1],
            [12, -73, 64, !1, !1],
            [10, -80, 35, !1, !1]
        ],
        [
            [0, -137, 109, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -134, 115, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -133, 112, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -139, 113, !1, !1],
            [6, -137, 116, !1, !1],
            [9, -149, 99, !1, !1],
            [10, -142, 90, !1, !1],
            [11, -76, 89, !1, !1],
            [14, -123, 104, !1, !1],
            [10, -157, 111, !1, !1],
            [12, -142, 103, !1, !1],
            [12, -144, 106, !1, !1],
            [10, -110, 103, !1, !1],
            [9, -151, 63, !1, !1],
            [12, -142, 97, !1, !1],
            [10, -118, 92, !1, !1],
            [5, -136, 83, !1, !1],
            [8, -135, 57, !1, !1]
        ],
        [
            [0, -137, 109, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -134, 115, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -133, 112, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -139, 113, !1, !1],
            [6, -137, 116, !1, !1],
            [9, -149, 99, !1, !1],
            [10, -142, 90, !1, !1],
            [11, -76, 89, !1, !1],
            [14, -123, 104, !1, !1],
            [10, -157, 111, !1, !1],
            [12, -142, 103, !1, !1],
            [12, -144, 106, !1, !1],
            [10, -110, 103, !1, !1],
            [9, -139, 54, !1, !1],
            [12, -142, 97, !1, !1],
            [10, -118, 92, !1, !1],
            [8, -136, 46, !1, !1],
            [6, -136, 72, !1, !1],
            [5, -133, 85, !1, !1]
        ],
        [
            [0, -137, 109, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -134, 115, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -133, 112, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -139, 113, !1, !1],
            [6, -137, 116, !1, !1],
            [9, -149, 99, !1, !1],
            [10, -142, 90, !1, !1],
            [11, -76, 89, !1, !1],
            [14, -123, 104, !1, !1],
            [10, -157, 111, !1, !1],
            [12, -142, 103, !1, !1],
            [12, -144, 106, !1, !1],
            [10, -110, 103, !1, !1],
            [9, -147, 66, !1, !1],
            [12, -142, 97, !1, !1],
            [10, -118, 92, !1, !1],
            [1, -133, 31, !1, !1],
            [3, -134, 57, !1, !1],
            [8, -140, 70, !1, !1],
            [5, -135, 3, !1, !1],
            [6, -142, 92, !1, !1]
        ],
        [
            [0, -137, 109, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -134, 115, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -133, 112, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -139, 113, !1, !1],
            [6, -137, 116, !1, !1],
            [9, -149, 99, !1, !1],
            [10, -142, 90, !1, !1],
            [11, -76, 89, !1, !1],
            [14, -123, 104, !1, !1],
            [10, -157, 111, !1, !1],
            [12, -142, 103, !1, !1],
            [12, -144, 106, !1, !1],
            [10, -110, 103, !1, !1],
            [9, -147, 66, !1, !1],
            [12, -142, 97, !1, !1],
            [10, -118, 92, !1, !1],
            [1, -133, 59, !1, !1],
            [3, -134, 78, !1, !1],
            [8, -136, 79, !1, !1],
            [5, -137, 83, !1, !1],
            [6, -142, 92, !1, !1]
        ],
        [
            [0, -137, 109, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -134, 115, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -133, 112, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -139, 113, !1, !1],
            [6, -137, 116, !1, !1],
            [9, -149, 99, !1, !1],
            [10, -142, 90, !1, !1],
            [2, -136, 99, !1, !1],
            [11, -113, 91, !1, !1],
            [14, -123, 104, !1, !1],
            [10, -157, 111, !1, !1],
            [12, -142, 103, !1, !1],
            [12, -144, 106, !1, !1],
            [10, -110, 103, !1, !1],
            [9, -141, 98, !1, !1],
            [12, -142, 97, !1, !1],
            [10, -141, 62, !1, !1]
        ],
        [
            [0, -137, 109, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -134, 115, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -133, 112, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -139, 113, !1, !1],
            [6, -137, 116, !1, !1],
            [9, -149, 99, !1, !1],
            [10, -142, 90, !1, !1],
            [11, -76, 89, !1, !1],
            [14, -123, 104, !1, !1],
            [10, -157, 111, !1, !1],
            [12, -142, 103, !1, !1],
            [12, -144, 106, !1, !1],
            [10, -110, 103, !1, !1],
            [9, -147, 66, !1, !1],
            [12, -142, 97, !1, !1],
            [10, -118, 92, !1, !1],
            [1, -127, 64, !1, !1],
            [3, -139, 85, !1, !1],
            [8, -140, 70, !1, !1],
            [5, -129, 83, !1, !1],
            [6, -142, 92, !1, !1]
        ],
        [
            [0, -74, -239, !1, !1],
            [7, -62, -237, !1, !1],
            [2, -61, -233, !1, !1],
            [3, -68, -203, !1, !1],
            [8, -79, -228, !1, !1],
            [5, -53, -228, !1, !1],
            [4, -65, -222, !1, !1],
            [1, -77, -225, !1, !1],
            [6, -70, -240, !1, !1],
            [9, -63, -237, !1, !1]
        ],
        [
            [0, -54, -188, !1, !1],
            [7, -54, -174, !1, !1],
            [2, -37, -191, !1, !1],
            [3, -41, -126, !1, !1],
            [8, -34, -165, !1, !1],
            [5, -44, -148, !1, !1],
            [4, -54, -158, !1, !1],
            [1, -26, -149, !1, !1],
            [6, -59, -167, !1, !1],
            [9, -39, -143, !1, !1],
            [9, -69, -183, !1, !1],
            [11, -48, -217, !1, !1],
            [12, -68, -223, !1, !1]
        ],
        [
            [0, -55, -184, !1, !1],
            [7, -20, -104, !1, !1],
            [2, -71, -149, !1, !1],
            [3, -67, -156, !1, !1],
            [8, -66, -128, !1, !1],
            [5, -45, -113, !1, !1],
            [4, -62, -87, !1, !1],
            [1, -21, -78, !1, !1],
            [6, -57, -114, !1, !1],
            [9, -87, -176, !1, !1],
            [10, -66, -205, !1, !1],
            [11, -66, -134, !1, !1],
            [14, -25, -103, !1, !1],
            [9, -28, -95, !1, !1],
            [10, -62, -108, !1, !1],
            [11, -59, -211, !1, !1]
        ],
        [
            [0, -13, -239, !1, !1],
            [7, -1, -237, !1, !1],
            [2, 0, -233, !1, !1],
            [3, -7, -203, !1, !1],
            [8, -18, -228, !1, !1],
            [5, 8, -228, !1, !1],
            [4, -4, -222, !1, !1],
            [1, -16, -225, !1, !1],
            [6, -9, -240, !1, !1],
            [9, 3, -227, !1, !1]
        ],
        [
            [7, -16, -176, !1, !1],
            [2, -2, -211, !1, !1],
            [3, -5, -87, !1, !1],
            [8, 0, -164, !1, !1],
            [5, -10, -147, !1, !1],
            [4, -8, -130, !1, !1],
            [1, 2, -149, !1, !1],
            [6, -17, -140, !1, !1],
            [9, -5, -101, !1, !1],
            [9, -13, -128, !1, !1],
            [11, -14, -216, !1, !1],
            [12, 2, -214, !1, !1],
            [0, 5, -178, !1, !1]
        ],
        [
            [0, 6, -76, !1, !1],
            [7, 25, -25, !1, !1],
            [2, 4, -62, !1, !1],
            [3, 21, -17, !1, !1],
            [8, 18, -6, !1, !1],
            [5, 13, -9, !1, !1],
            [4, 9, -26, !1, !1],
            [1, 4, 10, !1, !1],
            [6, 13, -41, !1, !1],
            [9, -7, -48, !1, !1],
            [10, -7, -22, !1, !1],
            [11, 17, -83, !1, !1],
            [14, 41, -32, !1, !1],
            [10, -5, 2, !1, !1],
            [12, 5, -64, !1, !1],
            [10, -5, -89, !1, !1],
            [12, -35, -118, !1, !1],
            [13, -11, -100, !1, !1],
            [14, -46, -137, !1, !1],
            [12, -14, -118, !1, !1]
        ],
        [
            [0, 53, -239, !1, !1],
            [7, 65, -237, !1, !1],
            [2, 66, -233, !1, !1],
            [3, 59, -203, !1, !1],
            [8, 48, -228, !1, !1],
            [5, 74, -228, !1, !1],
            [4, 62, -222, !1, !1],
            [1, 50, -225, !1, !1],
            [6, 57, -240, !1, !1],
            [9, 69, -227, !1, !1]
        ],
        [
            [7, 45, -170, !1, !1],
            [2, 62, -187, !1, !1],
            [3, 61, -89, !1, !1],
            [8, 58, -141, !1, !1],
            [5, 44, -144, !1, !1],
            [4, 10, -30, !1, !1],
            [1, 62, -112, !1, !1],
            [6, 41, -144, !1, !1],
            [9, 18, -111, !1, !1],
            [9, 27, -204, !1, !1],
            [11, 51, -213, !1, !1],
            [12, 67, -211, !1, !1],
            [0, 63, -166, !1, !1],
            [8, 54, -206, !1, !1],
            [1, 31, -62, !1, !1],
            [5, 22, -122, !1, !1],
            [1, 43, -30, !1, !1],
            [4, -5, -53, !1, !1],
            [8, 50, -76, !1, !1],
            [0, 16, -85, !1, !1],
            [6, 2, -64, !1, !1],
            [9, -5, -53, !1, !1],
            [10, 43, -43, !1, !1],
            [9, 49, -97, !1, !1]
        ],
        [
            [0, 75, -131, !1, !1],
            [7, 86, -73, !1, !1],
            [2, 89, -92, !1, !1],
            [3, 8, -41, !1, !1],
            [8, -2, -33, !1, !1],
            [5, -41, -92, !1, !1],
            [4, -31, -69, !1, !1],
            [1, -21, -20, !1, !1],
            [6, 56, -67, !1, !1],
            [9, 49, -85, !1, !1],
            [10, -36, -113, !1, !1],
            [11, 20, -144, !1, !1],
            [14, 0, -32, !1, !1],
            [10, -23, -39, !1, !1],
            [12, 80, -105, !1, !1],
            [10, 1, -168, !1, !1],
            [12, 51, -174, !1, !1],
            [13, -11, -100, !1, !1],
            [14, 51, -187, !1, !1],
            [12, 81, -161, !1, !1],
            [8, -22, -132, !1, !1],
            [5, -18, -106, !1, !1],
            [8, 16, -103, !1, !1],
            [5, 24, -58, !1, !1],
            [9, 84, -82, !1, !1]
        ],
        [
            [0, 45, -194, !1, !1],
            [7, 106, -75, !1, !1],
            [2, 146, -122, !1, !1],
            [3, 36, 5, !1, !1],
            [8, 65, -24, !1, !1],
            [5, 132, -119, !1, !1],
            [4, -77, -56, !1, !1],
            [1, -51, 2, !1, !1],
            [6, -57, -35, !1, !1],
            [9, 72, -58, !1, !1],
            [10, -31, -125, !1, !1],
            [11, 114, -135, !1, !1],
            [14, 42, -9, !1, !1],
            [10, -9, -46, !1, !1],
            [12, 108, -120, !1, !1],
            [10, 1, -168, !1, !1],
            [12, 51, -174, !1, !1],
            [13, -11, -100, !1, !1],
            [14, 51, -187, !1, !1],
            [12, 81, -161, !1, !1],
            [8, -2, -160, !1, !1],
            [5, 46, -17, !1, !1],
            [8, 68, -214, !1, !1],
            [5, 8, -9, !1, !1],
            [5, 99, -170, !1, !1],
            [8, 67, -161, !1, !1],
            [6, -11, 31, !1, !1],
            [3, 87, -46, !1, !1],
            [5, -102, -126, !1, !1],
            [2, 141, -149, !1, !1],
            [7, -88, -72, !1, !1],
            [0, -67, -160, !1, !1],
            [8, -41, -170, !1, !1],
            [5, -42, 34, !1, !1],
            [1, -58, -21, !1, !1],
            [1, -88, -98, !1, !1],
            [4, -97, -152, !1, !1],
            [5, 130, -96, !1, !1],
            [8, -10, 4, !1, !1],
            [9, -63, -29, !1, !1],
            [9, -101, -88, !1, !1],
            [10, 126, -165, !1, !1],
            [3, 34, -158, !1, !1]
        ],
        [
            [0, 4, -81, !1, !1],
            [7, 79, -28, !1, !1],
            [2, 80, -150, !1, !1],
            [3, 1, 48, !1, !1],
            [8, 48, -38, !1, !1],
            [5, -38, -119, !1, !1],
            [4, -36, -60, !1, !1],
            [1, -64, -30, !1, !1],
            [6, -69, -145, !1, !1],
            [9, 22, -84, !1, !1],
            [10, -10, -141, !1, !1],
            [11, 20, -144, !1, !1],
            [14, -2, -25, !1, !1],
            [10, 12, -19, !1, !1],
            [12, 75, -96, !1, !1],
            [10, 1, -168, !1, !1],
            [12, 51, -174, !1, !1],
            [13, -72, -109, !1, !1],
            [14, 51, -187, !1, !1],
            [12, 81, -161, !1, !1],
            [8, -17, -73, !1, !1],
            [5, -22, -18, !1, !1],
            [8, 77, -90, !1, !1],
            [5, -80, -85, !1, !1],
            [5, 37, -28, !1, !1],
            [8, 34, -120, !1, !1],
            [6, -34, 30, !1, !1],
            [3, 38, -67, !1, !1],
            [9, 80, -44, !1, !1],
            [9, -20, -70, !1, !1],
            [10, -55, -33, !1, !1],
            [11, -26, -37, !1, !1],
            [13, -14, -19, !1, !1],
            [5, -6, -60, !1, !1],
            [9, -6, -95, !1, !1],
            [8, -9, -124, !1, !1],
            [9, -87, -93, !1, !1],
            [1, -71, -120, !1, !1]
        ],
        [
            [0, -137, 109, !1, !1],
            [7, -131, 110, !1, !1],
            [2, -134, 115, !1, !1],
            [3, -143, 113, !1, !1],
            [8, -127, 116, !1, !1],
            [5, -133, 112, !1, !1],
            [4, -140, 117, !1, !1],
            [1, -139, 113, !1, !1],
            [6, -137, 116, !1, !1],
            [9, -149, 99, !1, !1],
            [10, -142, 90, !1, !1],
            [11, -76, 89, !1, !1],
            [14, -123, 104, !1, !1],
            [10, -157, 111, !1, !1],
            [12, -142, 103, !1, !1],
            [12, -144, 106, !1, !1],
            [10, -110, 103, !1, !1],
            [9, -147, 66, !1, !1],
            [12, -142, 97, !1, !1],
            [10, -118, 92, !1, !1],
            [1, -127, 64, !1, !1],
            [3, -139, 85, !1, !1],
            [8, -140, 70, !1, !1],
            [5, -129, 83, !1, !1],
            [6, -142, 92, !1, !1]
        ],
        [
            [0, 109, -240, !1, !1],
            [7, 121, -238, !1, !1],
            [2, 122, -234, !1, !1],
            [3, 115, -204, !1, !1],
            [8, 104, -229, !1, !1],
            [5, 130, -229, !1, !1],
            [4, 118, -223, !1, !1],
            [1, 106, -226, !1, !1],
            [6, 113, -241, !1, !1],
            [9, 125, -228, !1, !1]
        ],
        [
            [7, 109, -156, !1, !1],
            [2, 126, -173, !1, !1],
            [3, 125, -75, !1, !1],
            [8, 122, -127, !1, !1],
            [5, 108, -130, !1, !1],
            [4, 74, -16, !1, !1],
            [1, 126, -98, !1, !1],
            [6, 105, -130, !1, !1],
            [9, 82, -97, !1, !1],
            [9, 91, -190, !1, !1],
            [11, 115, -199, !1, !1],
            [12, 131, -197, !1, !1],
            [0, 127, -152, !1, !1],
            [8, 118, -192, !1, !1],
            [1, 95, -48, !1, !1],
            [5, 86, -108, !1, !1],
            [1, 107, -16, !1, !1],
            [4, 59, -39, !1, !1],
            [8, 114, -62, !1, !1],
            [0, 80, -71, !1, !1],
            [6, 66, -50, !1, !1],
            [9, 59, -39, !1, !1],
            [10, 107, -29, !1, !1],
            [9, 113, -83, !1, !1]
        ],
        [
            [7, 93, -84, !1, !1],
            [2, 110, -101, !1, !1],
            [3, 93, 16, !1, !1],
            [8, 106, -55, !1, !1],
            [5, 92, -58, !1, !1],
            [4, 5, 37, !1, !1],
            [1, 109, -21, !1, !1],
            [6, 89, -58, !1, !1],
            [9, 66, -25, !1, !1],
            [9, 87, -105, !1, !1],
            [11, 99, -127, !1, !1],
            [12, 131, -149, !1, !1],
            [0, 111, -80, !1, !1],
            [8, 130, -134, !1, !1],
            [1, 55, 37, !1, !1],
            [5, 81, -33, !1, !1],
            [1, 29, 46, !1, !1],
            [4, 1, 26, !1, !1],
            [8, 81, 24, !1, !1],
            [0, 61, 1, !1, !1],
            [6, 32, 11, !1, !1],
            [9, -11, 13, !1, !1],
            [10, 22, 31, !1, !1],
            [9, 113, -83, !1, !1]
        ],
        [
            [7, 71, -18, !1, !1],
            [2, 94, -48, !1, !1],
            [3, 93, 16, !1, !1],
            [8, 98, -28, !1, !1],
            [5, 23, 6, !1, !1],
            [4, -14, 43, !1, !1],
            [1, 48, 26, !1, !1],
            [6, 89, -3, !1, !1],
            [9, 36, 23, !1, !1],
            [9, -48, -17, !1, !1],
            [11, 93, -38, !1, !1],
            [12, 25, 0, !1, !1],
            [0, 65, 4, !1, !1],
            [8, -56, -21, !1, !1],
            [1, 11, 43, !1, !1],
            [5, 37, 2, !1, !1],
            [1, -38, 37, !1, !1],
            [4, -24, 4, !1, !1],
            [8, -3, 15, !1, !1],
            [0, -46, 13, !1, !1],
            [6, 57, -13, !1, !1],
            [9, -32, -8, !1, !1],
            [10, 19, -45, !1, !1],
            [9, -25, 29, !1, !1]
        ],
        [
            [7, 52, -6, !1, !1],
            [2, 85, -19, !1, !1],
            [3, 16, 20, !1, !1],
            [8, 22, -4, !1, !1],
            [5, -31, -2, !1, !1],
            [4, -14, 43, !1, !1],
            [1, 30, 29, !1, !1],
            [6, 66, 10, !1, !1],
            [9, -21, 24, !1, !1],
            [9, -71, -70, !1, !1],
            [11, 16, -13, !1, !1],
            [12, -60, -34, !1, !1],
            [0, 52, 18, !1, !1],
            [8, -70, -57, !1, !1],
            [1, 11, 43, !1, !1],
            [5, -47, -25, !1, !1],
            [1, -81, -6, !1, !1],
            [4, -65, 12, !1, !1],
            [8, -42, 24, !1, !1],
            [0, -91, -53, !1, !1],
            [6, -8, 13, !1, !1],
            [9, -92, -56, !1, !1],
            [10, -31, -10, !1, !1],
            [9, 25, 11, !1, !1]
        ],
        [
            [7, 61, -7, !1, !1],
            [2, 0, 28, !1, !1],
            [3, -48, 10, !1, !1],
            [8, -19, 19, !1, !1],
            [5, -30, -94, !1, !1],
            [4, 14, -24, !1, !1],
            [1, -56, 3, !1, !1],
            [6, 29, 25, !1, !1],
            [9, -48, -79, !1, !1],
            [9, -71, -70, !1, !1],
            [11, -15, -4, !1, !1],
            [12, -54, -68, !1, !1],
            [0, -41, 19, !1, !1],
            [8, 18, -64, !1, !1],
            [1, -68, -51, !1, !1],
            [5, -84, -16, !1, !1],
            [1, -84, -35, !1, !1],
            [4, -53, -81, !1, !1],
            [8, -69, -3, !1, !1],
            [0, -70, -74, !1, !1],
            [6, -10, -74, !1, !1],
            [9, 14, -33, !1, !1],
            [10, 13, -38, !1, !1],
            [9, -76, -19, !1, !1]
        ],
        []
    ];
    this.coll = [
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [-130, 0, 130, 125],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-130, 0, 130, 125]
    ];
    this.action = [];
    this.action["2"] = new FrameList(100, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    this.action["5"] = new FrameList(100, [14, 15, 16, 4, 5, 6, 8, 10, 11, 12]);
    this.action["8"] = new FrameList(100, [17, 18, 19, 5, 6, 7, 8, 9, 10, 11, 12]);
    this.action["10"] = new FrameList(100, [20, 21, 22, 23, 24, 5, 6, 7, 8, 9, 10, 11, 13, 12]);
    this.action["50"] = new FrameList(100, [26, 27, 28, 29, 30, 31, 5, 6, 7, 8, 9, 10, 11, 12]);
    this.action.data = new FrameList(50, [32])
}, animLevelUp = new function() {
    this.clip = [
        [78, 139, 38, 36],
        [116, 139, 34, 36],
        [53, 129, 17, 18],
        [53, 151, 25, 24],
        [169, 62, 15, 15],
        [169, 47, 16, 15],
        [57, 106, 22, 22],
        [150, 138, 26, 37],
        [121, 0, 69, 47],
        [116, 47, 53, 44],
        [0, 176, 51, 32],
        [53, 175, 31, 33],
        [84, 175, 36, 33],
        [120, 175, 36, 33],
        [156, 175, 36, 33],
        [192, 175, 31, 33],
        [80, 106, 36, 33],
        [187, 54, 36, 33],
        [0, 0, 121, 45],
        [183, 88, 40, 39],
        [57, 45, 59, 61],
        [177, 127, 46, 48],
        [190, 0, 33, 54],
        [0, 129, 53, 47],
        [116, 91, 52, 47],
        [0, 45, 57, 84]
    ];
    this.frame = [
        [],
        [
            [1, -20, 145, !1, !1],
            [3, -52, 133, !1, !1],
            [5, -13, 117, !1, !1],
            [2, 51, 148, !1, !1],
            [5, 25, 140, !1, !1],
            [4, -56, 91, !1, !1],
            [19, -9, 147, !1, !1],
            [1, 17, 131, !1, !1],
            [0, -24, 142, !1, !1],
            [11, -41, 156, !1, !1],
            [0, -83, 99, !1, !1],
            [3, 56, 127, !1, !1],
            [5, 14, 113, !1, !1],
            [2, -38, 117, !1, !1],
            [5, -58, 156, !1, !1],
            [1, -47, 138, !1, !1],
            [3, 0, 138, !1, !1]
        ],
        [
            [1, -20, 145, !1, !1],
            [3, -52, 133, !1, !1],
            [5, -13, 117, !1, !1],
            [2, 51, 148, !1, !1],
            [5, 25, 140, !1, !1],
            [4, -56, 91, !1, !1],
            [19, -83, 85, !1, !1],
            [1, 17, 131, !1, !1],
            [0, -24, 142, !1, !1],
            [11, -33, 111, !1, !1],
            [21, 28, 109, !1, !1],
            [0, 36, 92, !1, !1],
            [12, -9, 85, !1, !1],
            [0, -19, 59, !1, !1],
            [0, -106, 67, !1, !1],
            [3, -78, 56, !1, !1],
            [5, -34, 73, !1, !1],
            [2, -105, 53, !1, !1],
            [0, 65, 143, !1, !1],
            [5, -62, 154, !1, !1]
        ],
        [
            [1, -21, 102, !1, !1],
            [3, -13, 68, !1, !1],
            [5, -10, 75, !1, !1],
            [2, 54, 106, !1, !1],
            [5, 28, 98, !1, !1],
            [4, -53, 49, !1, !1],
            [19, -98, 31, !1, !1],
            [1, 20, 89, !1, !1],
            [0, -54, 89, !1, !1],
            [11, -63, 59, !1, !1],
            [21, 64, 59, !1, !1],
            [0, 39, 50, !1, !1],
            [12, -39, 37, !1, !1],
            [0, -36, 18, !1, !1],
            [0, -109, -2, !1, !1],
            [3, -55, 29, !1, !1],
            [5, -31, 31, !1, !1],
            [2, -105, 34, !1, !1],
            [0, 62, 61, !1, !1],
            [5, -59, 112, !1, !1],
            [13, 50, 44, !1, !1],
            [14, -15, 61, !1, !1],
            [15, 48, 68, !1, !1],
            [16, 93, 58, !1, !1],
            [17, 23, 61, !1, !1],
            [0, -2, 52, !1, !1],
            [1, 64, 35, !1, !1],
            [3, -75, 46, !1, !1],
            [2, 106, 73, !1, !1],
            [1, 93, 49, !1, !1],
            [0, 77, 42, !1, !1]
        ],
        [
            [1, -25, 114, !1, !1],
            [3, -17, 80, !1, !1],
            [5, -14, 87, !1, !1],
            [2, 50, 118, !1, !1],
            [5, 24, 110, !1, !1],
            [4, -57, 61, !1, !1],
            [19, -85, 54, !1, !1],
            [1, 16, 101, !1, !1],
            [0, -58, 101, !1, !1],
            [11, -111, 36, !1, !1],
            [21, 51, 55, !1, !1],
            [0, 35, 62, !1, !1],
            [12, -74, 41, !1, !1],
            [0, -33, 6, !1, !1],
            [0, -132, 37, !1, !1],
            [3, -79, 26, !1, !1],
            [5, -35, 43, !1, !1],
            [2, -127, 23, !1, !1],
            [0, 58, 73, !1, !1],
            [5, -63, 124, !1, !1],
            [13, -2, 25, !1, !1],
            [14, -37, 55, !1, !1],
            [15, 18, 55, !1, !1],
            [16, 89, 70, !1, !1],
            [17, 56, 36, !1, !1],
            [0, 2, -9, !1, !1],
            [1, 60, 47, !1, !1],
            [3, -68, 15, !1, !1],
            [2, 102, 85, !1, !1],
            [1, 89, 61, !1, !1],
            [0, 67, 45, !1, !1],
            [20, -21, 66, !1, !1],
            [0, -22, 75, !1, !1],
            [10, -16, 62, !1, !1]
        ],
        [
            [1, -25, 89, !1, !1],
            [3, -16, 80, !1, !1],
            [5, -13, 87, !1, !1],
            [2, 51, 88, !1, !1],
            [5, 20, 106, !1, !1],
            [4, -56, 61, !1, !1],
            [1, 17, 71, !1, !1],
            [11, -118, 43, !1, !1],
            [21, 84, 33, !1, !1],
            [0, 50, 22, !1, !1],
            [20, 7, 32, !1, !1],
            [12, -84, 33, !1, !1],
            [0, -32, 6, !1, !1],
            [19, -97, 54, !1, !1],
            [0, -135, 29, !1, !1],
            [3, -78, 26, !1, !1],
            [5, -34, 43, !1, !1],
            [2, -122, -2, !1, !1],
            [0, 75, 10, !1, !1],
            [5, -62, 124, !1, !1],
            [13, -45, 25, !1, !1],
            [14, -9, 13, !1, !1],
            [15, 28, 2, !1, !1],
            [16, 60, 8, !1, !1],
            [17, 97, 16, !1, !1],
            [0, 3, -9, !1, !1],
            [1, 125, -21, !1, !1],
            [0, -48, 40, !1, !1],
            [3, -59, 30, !1, !1],
            [2, 103, 85, !1, !1],
            [1, 60, -31, !1, !1],
            [0, 98, 29, !1, !1],
            [0, 29, 17, !1, !1],
            [10, 21, 25, !1, !1]
        ],
        [
            [1, -24, 31, !1, !1],
            [3, 18, 15, !1, !1],
            [5, 7, 12, !1, !1],
            [2, 50, 42, !1, !1],
            [5, 19, 60, !1, !1],
            [4, -57, 15, !1, !1],
            [1, 16, 25, !1, !1],
            [11, -122, 44, !1, !1],
            [21, 83, -13, !1, !1],
            [0, 73, -25, !1, !1],
            [20, 28, 5, !1, !1],
            [12, -88, 20, !1, !1],
            [0, -33, -40, !1, !1],
            [19, -112, 13, !1, !1],
            [0, -129, 12, !1, !1],
            [3, -108, -15, !1, !1],
            [5, -35, -3, !1, !1],
            [2, -87, -30, !1, !1],
            [0, 105, -20, !1, !1],
            [5, -77, 63, !1, !1],
            [13, -55, 13, !1, !1],
            [14, -26, -4, !1, !1],
            [15, 9, -25, !1, !1],
            [16, 71, -29, !1, !1],
            [17, 104, -34, !1, !1],
            [0, -11, -31, !1, !1],
            [1, 121, -48, !1, !1],
            [0, -50, 20, !1, !1],
            [3, -57, -5, !1, !1],
            [2, 102, 39, !1, !1],
            [1, 12, -41, !1, !1],
            [0, 85, -43, !1, !1],
            [0, 30, 2, !1, !1],
            [9, 30, -33, !1, !1],
            [10, 30, -25, !1, !1]
        ],
        [
            [20, 36, -55, !1, !1],
            [1, -83, -14, !1, !1],
            [3, -4, -2, !1, !1],
            [5, 22, -7, !1, !1],
            [2, 50, 42, !1, !1],
            [5, 12, 70, !1, !1],
            [4, -57, 15, !1, !1],
            [1, 16, 25, !1, !1],
            [11, -122, 29, !1, !1],
            [21, 94, -47, !1, !1],
            [0, 73, -25, !1, !1],
            [12, -83, 4, !1, !1],
            [0, -33, -40, !1, !1],
            [19, -114, 2, !1, !1],
            [0, -111, -15, !1, !1],
            [3, -108, -15, !1, !1],
            [5, -35, -3, !1, !1],
            [2, -87, -30, !1, !1],
            [0, 121, -67, !1, !1],
            [5, -24, 73, !1, !1],
            [13, -52, -13, !1, !1],
            [14, -34, -44, !1, !1],
            [15, 3, -62, !1, !1],
            [16, 73, -65, !1, !1],
            [17, 107, -65, !1, !1],
            [0, -5, -66, !1, !1],
            [1, 60, -83, !1, !1],
            [0, -38, 4, !1, !1],
            [3, -57, -5, !1, !1],
            [2, 102, 39, !1, !1],
            [1, 11, -69, !1, !1],
            [0, 98, -83, !1, !1],
            [0, 31, -51, !1, !1],
            [9, 30, -74, !1, !1],
            [10, 30, -71, !1, !1]
        ],
        [
            [1, 23, 17, !1, !1],
            [3, -33, 35, !1, !1],
            [5, -23, 7, !1, !1],
            [2, 14, 7, !1, !1],
            [5, 19, 60, !1, !1],
            [4, -57, 15, !1, !1],
            [1, 21, -29, !1, !1],
            [11, -124, 30, !1, !1],
            [21, 94, -62, !1, !1],
            [0, 87, -66, !1, !1],
            [20, 45, -67, !1, !1],
            [12, -97, 0, !1, !1],
            [0, -33, -40, !1, !1],
            [19, -121, -16, !1, !1],
            [0, -78, -9, !1, !1],
            [3, -108, -15, !1, !1],
            [5, -35, -3, !1, !1],
            [2, -87, -30, !1, !1],
            [0, 117, -83, !1, !1],
            [5, -33, 63, !1, !1],
            [13, -65, -38, !1, !1],
            [14, -33, -62, !1, !1],
            [15, 3, -62, !1, !1],
            [16, 73, -65, !1, !1],
            [17, 107, -65, !1, !1],
            [0, -5, -66, !1, !1],
            [1, 122, -101, !1, !1],
            [0, -52, -50, !1, !1],
            [3, -57, -5, !1, !1],
            [2, 80, 11, !1, !1],
            [1, 12, -75, !1, !1],
            [0, 82, -96, !1, !1],
            [0, 79, -59, !1, !1],
            [9, 30, -73, !1, !1],
            [10, 30, -65, !1, !1]
        ],
        [
            [1, 2, -16, !1, !1],
            [3, -115, -36, !1, !1],
            [5, -130, -23, !1, !1],
            [2, 40, -27, !1, !1],
            [5, -109, 13, !1, !1],
            [4, -119, -12, !1, !1],
            [1, 11, -49, !1, !1],
            [11, -134, -58, !1, !1],
            [21, 94, -62, !1, !1],
            [0, 87, -66, !1, !1],
            [20, 45, -70, !1, !1],
            [12, -102, -58, !1, !1],
            [0, -34, -62, !1, !1],
            [19, -95, -93, !1, !1],
            [0, -70, -54, !1, !1],
            [3, -135, -58, !1, !1],
            [5, -75, -21, !1, !1],
            [2, -68, -12, !1, !1],
            [0, 117, -83, !1, !1],
            [5, -18, 14, !1, !1],
            [13, -67, -59, !1, !1],
            [14, -33, -62, !1, !1],
            [15, 3, -62, !1, !1],
            [16, 73, -65, !1, !1],
            [17, 107, -65, !1, !1],
            [0, -5, -66, !1, !1],
            [1, 119, -87, !1, !1],
            [0, -56, -51, !1, !1],
            [3, -114, -40, !1, !1],
            [2, 72, -27, !1, !1],
            [1, 12, -75, !1, !1],
            [0, 93, -76, !1, !1],
            [0, 110, -33, !1, !1],
            [9, 30, -74, !1, !1],
            [10, 29, -71, !1, !1]
        ],
        [
            [1, -10, -40, !1, !1],
            [3, -64, -80, !1, !1],
            [5, -87, -17, !1, !1],
            [2, -136, -24, !1, !1],
            [5, -22, 17, !1, !1],
            [4, -39, 1, !1, !1],
            [1, 21, -29, !1, !1],
            [11, -140, -57, !1, !1],
            [21, 117, -89, !1, !1],
            [0, 87, -66, !1, !1],
            [20, 44, -104, !1, !1],
            [12, -106, -58, !1, !1],
            [0, -33, -40, !1, !1],
            [19, -126, -95, !1, !1],
            [0, -83, -50, !1, !1],
            [3, -142, -74, !1, !1],
            [5, -23, -102, !1, !1],
            [2, -87, -30, !1, !1],
            [0, 117, -83, !1, !1],
            [8, 52, -96, !1, !1],
            [5, 2, -120, !1, !1],
            [13, -69, -59, !1, !1],
            [14, -34, -59, !1, !1],
            [15, 3, -60, !1, !1],
            [16, 75, -65, !1, !1],
            [17, 113, -65, !1, !1],
            [0, -117, -60, !1, !1],
            [1, 136, -76, !1, !1],
            [0, -58, -52, !1, !1],
            [3, -64, -90, !1, !1],
            [2, 63, -27, !1, !1],
            [1, 11, -75, !1, !1],
            [0, 102, -69, !1, !1],
            [0, 65, -62, !1, !1],
            [9, 30, -71, !1, !1],
            [10, 30, -62, !1, !1],
            [1, -90, -56, !1, !1],
            [5, -119, -103, !1, !1]
        ],
        [
            [5, -26, -33, !1, !1],
            [2, 2, -44, !1, !1],
            [5, -22, 17, !1, !1],
            [4, -60, -11, !1, !1],
            [1, 8, -45, !1, !1],
            [11, -138, -57, !1, !1],
            [21, 109, -110, !1, !1],
            [0, 87, -66, !1, !1],
            [20, 45, -131, !1, !1],
            [12, -105, -57, !1, !1],
            [19, -126, -95, !1, !1],
            [0, -83, -50, !1, !1],
            [3, -119, -26, !1, !1],
            [5, -49, -25, !1, !1],
            [2, -87, -30, !1, !1],
            [0, 117, -83, !1, !1],
            [5, 11, -18, !1, !1],
            [13, -69, -57, !1, !1],
            [18, 24, -79, !1, !1],
            [1, -87, -71, !1, !1],
            [14, -34, -57, !1, !1],
            [15, 1, -57, !1, !1],
            [16, 80, -57, !1, !1],
            [17, 114, -57, !1, !1],
            [0, -34, -83, !1, !1],
            [3, -14, -35, !1, !1],
            [2, 32, -37, !1, !1],
            [1, 15, -70, !1, !1],
            [0, 62, -55, !1, !1],
            [9, 30, -71, !1, !1],
            [10, 30, -63, !1, !1],
            [0, 12, -70, !1, !1],
            [8, 59, -126, !1, !1],
            [5, -120, -102, !1, !1]
        ],
        [
            [3, 55, -108, !1, !1],
            [5, -26, -33, !1, !1],
            [2, 2, -44, !1, !1],
            [5, -22, 17, !1, !1],
            [4, -60, -11, !1, !1],
            [1, 8, -45, !1, !1],
            [11, -138, -57, !1, !1],
            [21, 109, -110, !1, !1],
            [0, 87, -66, !1, !1],
            [20, 45, -131, !1, !1],
            [12, -105, -57, !1, !1],
            [19, -126, -95, !1, !1],
            [0, -83, -50, !1, !1],
            [3, -119, -26, !1, !1],
            [5, -49, -25, !1, !1],
            [2, -87, -30, !1, !1],
            [0, 117, -83, !1, !1],
            [5, 11, -18, !1, !1],
            [13, -69, -57, !1, !1],
            [18, 24, -79, !1, !1],
            [1, -87, -71, !1, !1],
            [14, -34, -57, !1, !1],
            [9, 18, -68, !1, !1],
            [15, 1, -57, !1, !1],
            [0, -117, -71, !1, !1],
            [10, 18, -66, !1, !1],
            [1, 117, -110, !1, !1],
            [0, -34, -83, !1, !1],
            [0, 46, -83, !1, !1],
            [3, -14, -35, !1, !1],
            [2, 32, -37, !1, !1],
            [1, 15, -70, !1, !1],
            [0, 120, -78, !1, !1],
            [0, 62, -55, !1, !1],
            [23, 89, -61, !1, !1],
            [24, 42, -61, !1, !1],
            [8, 59, -126, !1, !1],
            [22, 140, -65, !1, !1],
            [1, -123, -112, !1, !1],
            [0, -30, -86, !1, !1],
            [1, 31, -140, !1, !1],
            [1, 103, -139, !1, !1],
            [0, 138, -80, !1, !1],
            [0, 48, -115, !1, !1],
            [1, 27, -43, !1, !1],
            [3, 42, -30, !1, !1],
            [4, 50, -42, !1, !1]
        ],
        [
            [6, -8, -16, !1, !1],
            [7, 14, -24, !1, !1],
            [5, 28, -28, !1, !1],
            [4, -14, -12, !1, !1],
            [5, 25, -2, !1, !1]
        ],
        [
            [6, -8, -16, !1, !1],
            [25, 15, -63, !1, !1],
            [0, 35, -85, !1, !1],
            [1, -7, -32, !1, !1],
            [5, 59, -21, !1, !1],
            [0, 47, -47, !1, !1]
        ]
    ];
    this.coll = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    this.action = [];
    this.action.hide = new FrameList(50, [0]);
    this.action.up = new FrameList(100, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 12, 12, 12, 12, 12]);
    this.action.buff = new FrameList(50, [13, 13, 13, 14, 14, 14])
}, animShop = new function() {
    this.clip = [
        [0, 0, 96, 105],
        [0, 106, 96, 105],
        [97, 0, 96, 105],
        [97, 106, 96, 105],
        [0, 212, 125, 66],
        [130, 214, 54, 59]
    ];
    this.frame = [
        [],
        [
            [4, -62, 0, !1, !1]
        ],
        [
            [0, -96, -105, !1, !1]
        ],
        [
            [0, -96, -105, !1, !1],
            [5, -102, -111, !1, !1],
            [5, 6, -111, !0, !1],
            [5, -102, 6, !1, !0],
            [5, 6, 6, !0, !0]
        ],
        [
            [2, 0, -105, !1, !1]
        ],
        [
            [2, 0, -105, !1, !1],
            [5, -6, -111, !1, !1],
            [5, 102, -111, !0, !1],
            [5, -6, 6, !1, !0],
            [5, 102, 6, !0, !0]
        ],
        [
            [1, -96, 0, !1, !1]
        ],
        [
            [1, -96, 0, !1, !1],
            [5, -102, -6, !1, !1],
            [5, 6, -6, !0, !1],
            [5, -102, 111, !1, !0],
            [5, 6, 111, !0, !0]
        ],
        [
            [3, 0, 0, !1, !1]
        ],
        [
            [3, 0, 0, !1, !1],
            [5, -6, -6, !1, !1],
            [5, 102, -6, !0, !1],
            [5, -6, 111, !1, !0],
            [5, 102, 111, !0, !0]
        ]
    ];
    this.coll = [
        [0, 0, 0, 0],
        [-61, 0, 123, 66],
        [-96, -105, 96, 105],
        [-96, -105, 96, 105],
        [0, -105, 96, 105],
        [0, -105, 96, 105],
        [-96, 0, 96, 105],
        [-96, 0, 96, 105],
        [0, 0, 96, 105],
        [0, 0, 96, 105]
    ];
    this.action = [];
    this.action.title = new FrameList(50, [1]);
    this.action.item_0 = new FrameList(400, [2]);
    this.action.item_1 = new FrameList(400, [4]);
    this.action.item_2 = new FrameList(400, [6]);
    this.action.item_3 = new FrameList(400, [8]);
    this.action.select_0 = new FrameList(400, [3, 2]);
    this.action.select_1 = new FrameList(400, [5, 4]);
    this.action.select_2 = new FrameList(400, [7, 6]);
    this.action.select_3 = new FrameList(400, [9, 8])
}, animCommand = new function() {
    this.clip = [
        [0, 0, 68, 40],
        [0, 40, 68, 40]
    ];
    this.frame = [
        [
            [0, -68, -40, !1, !1]
        ],
        [
            [1, 0, -40, !1, !1]
        ]
    ];
    this.coll = [
        [-68, -40, 68, 40],
        [0, -40, 68, 40]
    ];
    this.action = [];
    this.action.resume = new FrameList(50, [0]);
    this.action.shop = new FrameList(50, [1])
}, animHelp = new function() {
    this.clip = [
        [0, 0, 291, 54],
        [112, 55, 110, 30],
        [0, 55, 111, 30],
        [292, 0, 37, 37],
        [292, 38, 33, 18],
        [292, 57, 32, 18],
        [223, 55, 33, 18],
        [257, 55, 33, 18]
    ];
    this.frame = [
        [
            [2, -145, -134, !1, !1]
        ],
        [
            [1, -145, -134, !1, !1]
        ],
        [
            [3, -115, -41, !1, !1],
            [4, -113, -31, !1, !1]
        ],
        [
            [3, -65, -41, !1, !1],
            [6, -63, -31, !1, !1]
        ],
        [
            [3, -15, -41, !1, !1],
            [7, -14, -31, !1, !1]
        ],
        [
            [3, 35, -41, !1, !1],
            [5, 37, -31, !1, !1]
        ],
        [
            [0, -146, 0, !1, !1]
        ],
        [],
        [],
        []
    ];
    this.coll = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-120, -40, 48, 36],
        [-70, -40, 48, 36],
        [-20, -40, 48, 36],
        [30, -40, 48, 36],
        [-146, 0, 292, 54],
        [-153, -140, 306, 38],
        [-152, -100, 304, 275],
        [100, -122, 0, 0]
    ];
    this.action = [];
    this.action.help = new FrameList(50, [0]);
    this.action.rank = new FrameList(50, [1]);
    this.action.home = new FrameList(50, [2]);
    this.action.prev = new FrameList(50, [3]);
    this.action.next = new FrameList(50, [4]);
    this.action.end = new FrameList(50, [5]);
    this.action.item_bg = new FrameList(50, [6]);
    this.action.box = new FrameList(50, [7, 8, 9])
}, gameState = 0, isGamePausing = !1, comannd_w = 70, comannd_h = 40, maxCoins = 999999, curCoins = 50, curLevel = 0, curExp = 0, topNumTotal = 32, topNumPerPage = 4, topNumMaxPage = topNumTotal / topNumPerPage, topList = [], i = 0; i < topNumTotal; i++) topList[i] = "暂无排名";
var initTopList = function(a) {
        for (var b in a) topList[b] = a[b];
        console.log(topList)
    },
    lvUpExp = [51, 58, 77, 114, 175, 266, 393, 562, 779, 1050, 1381, 1778, 2247, 2794, 3425, 4146, 4963, 5882, 6909, 8050, 9311, 10698, 12217, 13874, 15675, 17626, 19733, 22002, 24439, 27050, 29841, 32818, 35987, 39354, 42925, 46706, 50703, 54922, 59369, 64050, 68971, 74138, 79557, 85234, 91175, 97386, 103873, 110642, 117699, 125050],
    cowArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4],
    curCowType = 0,
    cowAnim = [animCow_0, animCow_1, animCow_2, animCow_3, animCow_4],
    cowSpeed = [-6, -7, -8, -9, -10],
    cowGold = [2, 5, 8, 10, 50],
    cowExp = [4, 10, 16, 20, 100],
    cowRate = [60, 40, 30, 20, 15],
    buffTimer = 0,
    isNetMode = !1,
    KEY = "fegh58YASI94S87yhjkm",
    resetGame = function(a) {
        loopCowArray();
        nextCow(a)
    },
    nextCow = function(a) {
        var b = Random.random(cowArray.length - 1);
        curCowType = cowArray[b];
        cowArray.splice(b, 1);
        a.anim = cowAnim[curCowType];
        AnimMgr.changeAction(a, a.anim.action.run_left)
    },
    loopCowArray = function() {
        cowArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4]
    },
    addExp = function(a, b) {
        if (curLevel >= lvUpExp.length - 1) return !1;
        b === void 0 && (b = cowExp[curCowType]);
        a && (b *= 2);
        curExp += b;
        if (curExp >= lvUpExp[curLevel]) {
            for (; curExp >= lvUpExp[curLevel];) if (curExp -= lvUpExp[curLevel], curLevel++, curLevel == lvUpExp.length - 1) {
                curExp = 0;
                break
            }
            buffTimer = gbox.getFps() * 50;
            if (isNetMode) {
                var c = curExp,
                    e = curLevel,
                    f = 0,
                    h = GAME_DESCRIPTION + " : 升级",
                    g = "" + c + e + f + h,
                    d = getRadomSign(),
                    g = g + getKey(g, KEY, d) + d;
                sgi(c, e, f, h, g, d)
            }
            return !0
        } else isNetMode && (c = curExp, e = curLevel, f = 0, h = GAME_DESCRIPTION + " : 升级", g = "" + c + e + f + h, d = getRadomSign(), g = g + getKey(g, KEY, d) + d, sgi(c, e, f, h, g, d))
    },
    addCoin = function(a, b) {
        b === void 0 && (b = cowGold[curCowType]);
        a && (b *= 2);
        curCoins += b;
        if (isNetMode) {
            var c = b,
                e = GAME_DESCRIPTION + " : 获得金币",
                f = "" + c + e,
                h = getRadomSign(),
                f = f + getKey(f, KEY, h) + h;
            agc(c, e, f, h)
        }
    },
    animLoading = new function() {
        this.clip = [
            [0, 0, 39, 44],
            [39, 0, 40, 44],
            [79, 0, 37, 44],
            [116, 0, 42, 44],
            [158, 0, 53, 44]
        ];
        this.frame = [
            [
                [0, -19, -22, !1, !1]
            ],
            [
                [1, -20, -22, !1, !1]
            ],
            [
                [2, -18, -22, !1, !1]
            ],
            [
                [3, -21, -22, !1, !1]
            ],
            [
                [4, -26, -22, !1, !1]
            ]
        ];
        this.coll = [
            [-20, -22, 40, 44],
            [-20, -22, 40, 44],
            [-20, -22, 40, 44],
            [-20, -22, 40, 44],
            [-20, -22, 40, 44]
        ];
        this.action = [];
        this.action.head = new FrameList(200, [0, 1, 2, 3, 4])
    },
    loadingFrame = 0;
gbox.drawLoadingBar = function(a) {
    var b = Math.floor((gbox.getScreenH() - gbox._splash.gaugeHeight) / 2) + 120,
        c = gbox.getScreenW() - 80,
        e = gbox._splash.gaugeHeight + 5,
        f = Math.floor((c - 4) * gbox._loaderqueue.getDone() / gbox._loaderqueue.getTotal());
    a.globalAlpha = 1;
    a.fillStyle = gbox._splash.gaugeBackColor;
    a.fillRect(40, b, c, e);
    a.fillStyle = gbox._splash.gaugeColor;
    a.fillRect(42, b + 2, f > 0 ? f : 0, e - 4);
    animLoading.image = "img_loading";
    AnimMgr.draw(a, {
        tile: loadingFrame,
        dx: 42 + f,
        dy: b + Math.floor(e / 2),
        alpha: 1,
        anim: animLoading
    });
    loadingFrame = AnimMgr.nextFrame(animLoading.action.head);
    if (DEBUG) a.fillStyle = gbox._splash.gaugeColor, a.font = "normal 12px sans-serif", a.textAlign = "left", a.textBaseline = "top", a.fillText(curentImage, 0, 10)
};
var listMenuObj = null,
    initMenu = function() {
        listMenuObj = null;
        var a = new function() {
                this.id = "obj_menu_bg";
                this.group = GROUP_MENU;
                this.tileset = "tile_menu_bg";
                this.y = this.x = 0;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.initialize = function() {
                    toys.topview.initialize(this, {})
                };
                this.first = function() {};
                this.myclick = function() {};
                this.blit = function() {
                    gbox.blitFade(gbox.getBufferContext(), {
                        alpha: 1
                    });
                    gbox.blitTile(gbox.getBufferContext(), {
                        tileset: "tile_menu_bg",
                        tile: 0,
                        dx: this.x,
                        dy: this.y,
                        fliph: this.fliph,
                        flipv: this.flipv,
                        camera: this.camera,
                        alpha: 1
                    })
                }
            },
            b = SCREEN_W - 75 - 5,
            c = SCREEN_H - 260,
            e = new function() {
                this.id = "btn_start";
                this.group = GROUP_MENU;
                this.tileset = "tile_mainmenu";
                this.x = b;
                this.y = c;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animMainMenu;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.start);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    gbox.dataLoad(COOKI_NAME) != null && (level = parseInt(gbox.dataLoad(COOKI_NAME)), console.log("load level = " + level));
                    initGame();
                    enterGame()
                };
                this.blit = function() {
                    this.anim.image = "img_mainmenu";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            f = new function() {
                this.id = "btn_charge";
                this.group = GROUP_MENU;
                this.tileset = "tile_mainmenu";
                this.x = b;
                this.y = c + 52;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animMainMenu;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.charge);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    if (isNetMode && charge_url) window.location.href = charge_url
                };
                this.blit = function() {
                    this.anim.image = "img_mainmenu";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            h = new function() {
                this.id = "btn_help";
                this.group = GROUP_MENU;
                this.tileset = "tile_mainmenu";
                this.x = b;
                this.y = c + 104;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animMainMenu;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.help);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    enterHelp()
                };
                this.blit = function() {
                    this.anim.image = "img_mainmenu";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            g = new function() {
                this.id = "btn_rank";
                this.group = GROUP_MENU;
                this.tileset = "tile_mainmenu";
                this.x = b;
                this.y = c + 156;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animMainMenu;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.rank);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    isNetMode && enterRank()
                };
                this.blit = function() {
                    this.anim.image = "img_mainmenu";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            d = new function() {
                this.id = "btn_exit";
                this.group = GROUP_MENU;
                this.tileset = "tile_mainmenu";
                this.x = b;
                this.y = c + 208;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animMainMenu;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.exit);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    window.location.href = url_exit ? url_exit : ""
                };
                this.blit = function() {
                    this.anim.image = "img_mainmenu";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            };
        listMenuObj = [a, e, f, h, g, d]
    },
    enterMenu = function() {
        DEBUG && console.log("\nenterMenu()");
        if (listMenuObj != null) for (var a in listMenuObj) gbox.addObject(listMenuObj[a]);
        gbox.setRenderOrder([GROUP_MENU, GROUP_BACK_CALL]);
        gbox.getGroupsInLayer(LAYER_MENU).length == 0 && gbox.setGroupsToLayer([GROUP_MENU], LAYER_MENU);
        changeMap(LAYER_MENU)
    },
    listGameObj = null,
    initGame = function() {
        listGameObj = null;
        var a = new function() {
                this.id = "obj_ground";
                this.group = GROUP_MAP;
                this.tileset = "tile_ground";
                this.x = 0;
                this.y = SCREEN_H / 2;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animGround;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.bg)
                };
                this.first = function() {
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.myclick = function() {
                    curCoins > 0 && c.throwOut()
                };
                this.blit = function() {
                    gbox.blitFade(gbox.getBufferContext(), {
                        alpha: 1
                    });
                    var a = gbox.getImage("img_ground_bg");
                    gbox.blitAll(gbox.getBufferContext(), a, {
                        dx: Math.floor(SCREEN_W / 2 - a.width / 2),
                        dy: Math.floor(SCREEN_H / 2 - a.height / 2)
                    });
                    this.anim.image = "img_ground";
                    a = {
                        tileset: "tile_ground",
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        fliph: this.fliph,
                        flipv: this.flipv,
                        camera: this.camera,
                        alpha: 1,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            b = new function() {
                this.id = "obj_cow";
                this.group = GROUP_COW;
                this.tileset = "tile_cow_0";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H / 2 + 40;
                this.colh = this.colw = this.coly = this.colx = 0;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.flipv = this.fliph = this.isVisible = !1;
                this.frame = 0;
                this.anim = this.action = null;
                var a = SCREEN_W * 2 + (this.colx + this.colw),
                    d = -SCREEN_W - (this.colx + this.colw),
                    c = null;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    obj_backcall.registerFrameUpdate(this);
                    this.x = SCREEN_W * 2 + (this.colx + this.colw);
                    this.isVisible = !0
                };
                this.first = function() {
                    AnimMgr.updateCollWithAnim(this);
                    switch (this.action) {
                        case this.anim.action.run_left:
                            this.move(cowSpeed[curCowType], 0);
                            if (this.x <= d) this.x = a, cowArray.length == 0 && loopCowArray(), nextCow(this), AnimMgr.changeAction(f, f.anim.action["cursor_" + curCowType]);
                            break;
                        case this.anim.action.is_being_pulled:
                            AnimMgr.isActionFinished(this.action) && (c = j);
                            break;
                        case this.anim.action.laugh:
                            AnimMgr.isActionFinished(this.action) && (c = e)
                    }
                };
                var j = function() {
                        AnimMgr.changeAction(b, b.anim.action.hide);
                        b.isVisible = !1
                    },
                    e = function() {
                        AnimMgr.changeAction(b, b.anim.action.run_left)
                    };
                this.myclick = function() {};
                this.move = function(a, b) {
                    this.x += a;
                    this.y += b;
                    AnimMgr.updateCollWithAnim(this)
                };
                this.isBeingPulled = function() {
                    Random.random(0, "100")
                };
                this.remove = function() {
                    this.x = -SCREEN_W - this.colx - this.colw
                };
                this.blit = function() {
                    if (this.isVisible) {
                        this.action == this.anim.action.becatched && this.action.cnt % 2 == 0 && gbox.blitFade(gbox.getBufferContext(), {
                            alpha: 1
                        });
                        this.anim.image = "img_cow_" + curCowType;
                        var a = {
                            tileset: "tile_cow",
                            tile: this.frame,
                            dx: this.x,
                            dy: this.y,
                            fliph: this.fliph,
                            flipv: this.flipv,
                            camera: this.camera,
                            alpha: 1,
                            anim: this.anim
                        };
                        AnimMgr.draw(gbox.getBufferContext(), a);
                        this.after()
                    }
                };
                this.after = function() {
                    c && (c(), c = null)
                }
            },
            c = new function() {
                this.id = "obj_lariat";
                this.group = GROUP_LARIAT;
                this.tileset = "tile_lariat";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H;
                this.colh = this.colw = this.coly = this.colx = 0;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.isVisible = !1;
                this.frame = this.direction = 0;
                this.action = null;
                this.anim = animLariat;
                var a = null;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    obj_backcall.registerFrameUpdate(this);
                    AnimMgr.changeAction(this, this.anim.action.wait)
                };
                this.first = function() {
                    AnimMgr.updateCollWithAnim(this);
                    switch (this.action) {
                        case this.anim.action.wait:
                            this.move(this.direction === 0 ? -5 : 5, 0);
                            if (this.x <= SCREEN_W / 2 - 40) this.x = SCREEN_W / 2 - 40, this.direction = 1;
                            else if (this.x >= SCREEN_W / 2 + 40) this.x = SCREEN_W / 2 + 40, this.direction = 0;
                            break;
                        case this.anim.action["throw"]:
                            AnimMgr.isActionFinished(this.action) && (a = e);
                            break;
                        case this.anim.action["catch"]:
                            AnimMgr.isActionFinished(this.action) && (a = f);
                            break;
                        case this.anim.action.pull:
                            AnimMgr.isActionFinished(this.action) && (a = g)
                    }
                };
                var e = function() {
                        AnimMgr.isCollidedWith(c, b) ? Random.random() <= cowRate[curCowType] ? (AnimMgr.changeAction(c, c.anim.action["catch"]), AnimMgr.changeAction(b, b.anim.action.becatched)) : (AnimMgr.changeAction(c, c.anim.action.wait), AnimMgr.changeAction(b, b.anim.action.laugh), buffTimer = 0) : (AnimMgr.changeAction(c, c.anim.action.wait), buffTimer = 0)
                    },
                    f = function() {
                        AnimMgr.changeAction(c, c.anim.action.pull);
                        AnimMgr.changeAction(b, b.anim.action.hide)
                    },
                    g = function() {
                        AnimMgr.changeAction(c, c.anim.action.wait);
                        b.remove();
                        AnimMgr.changeAction(b, b.anim.action.run_left);
                        AnimMgr.changeAction(d, d.anim.action["" + cowGold[curCowType]]);
                        var a = buffTimer > 0;
                        buffTimer = 0;
                        addCoin(a);
                        addExp(a) && AnimMgr.changeAction(j, j.anim.action.up)
                    };
                this.myclick = function() {};
                this.move = function(a, b) {
                    this.x += a;
                    this.y += b
                };
                this.throwOut = function() {
                    this.action == this.anim.action.wait && (AnimMgr.changeAction(this, this.anim.action["throw"]), h.resetTime(), addCoin(!1, -1))
                };
                this.blit = function() {
                    this.anim.image = "img_lariat";
                    var a = {
                        tileset: "tile_lariat",
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        fliph: this.fliph,
                        flipv: this.flipv,
                        camera: this.camera,
                        alpha: 1,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.after()
                };
                this.after = function() {
                    a && (a(), a = null)
                }
            },
            e = new function() {
                this.id = "obj_cowtype";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_ui";
                this.x = SCREEN_W / 2;
                this.y = 0;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animUI;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.cow_type);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {};
                this.blit = function() {
                    this.anim.image = "img_ui";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            f = new function() {
                this.id = "obj_cowtype_cursor";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_ui";
                this.x = SCREEN_W / 2;
                this.y = 0;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animUI;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action["cursor_" + curCowType])
                };
                this.first = function() {};
                this.myclick = function() {};
                this.blit = function() {
                    this.anim.image = "img_ui";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            h = new function() {
                this.id = "obj_clock";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_ui";
                this.x = SCREEN_W;
                this.y = SCREEN_H - comannd_h;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animUI;
                this.center = {
                    x: 0,
                    y: 0
                };
                this.count = 30;
                this.time = (new Date).getTime();
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.clock);
                    AnimMgr.updatePolyWithAnim(this);
                    var a = this.anim.coll[AnimMgr.getFrameID(this.anim.action.clock, 0)];
                    this.center.x = this.x + a[0];
                    this.center.y = this.y + a[1] + a[3]
                };
                this.first = function() {};
                this.resetTime = function() {
                    h.count = 30;
                    h.time = (new Date).getTime()
                };
                this.myclick = function() {};
                this.blit = function() {
                    this.anim.image = "img_ui";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action);
                    if (this.count < 0) c.throwOut();
                    else {
                        ImageNumber.drawNum(gbox.getBufferContext(), this.count, this.center.x, this.center.y, 0, "BL", animNum_0);
                        if ((new Date).getTime() - this.time > 1E3) this.count--, this.time = (new Date).getTime();
                        curCoins <= 0 && this.resetTime()
                    }
                }
            },
            g = new function() {
                this.id = "obj_coin";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_ui";
                this.x = 0;
                this.y = SCREEN_H - comannd_h;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animUI;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.coin);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {};
                this.blit = function() {
                    this.anim.image = "img_ui";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action);
                    ImageNumber.drawNum(gbox.getBufferContext(), curCoins, this.poly[2][0], this.poly[2][1], 0, "RB", animNum_4)
                }
            },
            d = new function() {
                this.id = "obj_coin_eff";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_coin";
                this.x = 17;
                this.y = SCREEN_H - 60;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animCoin;
                var a = null;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.data);
                    var a = this.anim.coll[AnimMgr.getFrameID(this.anim.action.data, 0)];
                    this.x += a[2];
                    this.y -= a[3]
                };
                this.first = function() {
                    AnimMgr.updateCollWithAnim(this);
                    switch (this.action) {
                        case this.anim.action["2"]:
                        case this.anim.action["5"]:
                        case this.anim.action["8"]:
                        case this.anim.action["10"]:
                        case this.anim.action["50"]:
                            AnimMgr.isActionFinished(this.action) && (a = b)
                    }
                };
                var b = function() {
                    AnimMgr.changeAction(d, d.anim.action.data)
                };
                this.blit = function() {
                    this.anim.image = "img_coin";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action);
                    this.after()
                };
                this.after = function() {
                    a && (a(), a = null)
                }
            },
            j = new function() {
                this.id = "obj_levelup";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_levelup";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H / 2 + 60;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animLevelUp;
                var a = null;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.hide)
                };
                this.first = function() {
                    AnimMgr.updateCollWithAnim(this);
                    switch (this.action) {
                        case this.anim.action.up:
                            AnimMgr.isActionFinished(this.action) && (a = b)
                    }
                };
                var b = function() {
                    AnimMgr.changeAction(j, j.anim.action.hide)
                };
                this.blit = function() {
                    this.anim.image = "img_levelup";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action);
                    this.after()
                };
                this.after = function() {
                    a && (a(), a = null)
                }
            },
            l = new function() {
                this.id = "obj_buff";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_levelup";
                this.x = 40;
                this.y = SCREEN_H - 90;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animLevelUp;
                var a = null;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.hide)
                };
                this.first = function() {
                    AnimMgr.updateCollWithAnim(this);
                    switch (this.action) {
                        case this.anim.action.hide:
                            buffTimer > 0 && (a = b);
                            break;
                        case this.anim.action.buff:
                            buffTimer--, buffTimer <= 0 && (a = d)
                    }
                };
                var b = function() {
                        AnimMgr.changeAction(l, l.anim.action.buff)
                    },
                    d = function() {
                        AnimMgr.changeAction(l, l.anim.action.hide)
                    };
                this.blit = function() {
                    this.anim.image = "img_levelup";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action);
                    this.after()
                };
                this.after = function() {
                    a && (a(), a = null)
                }
            },
            k = new function() {
                this.id = "cmd_shop";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_command";
                this.x = 0;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animCommand;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.shop);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    isNetMode && enterGameMenu()
                };
                this.blit = function() {
                    this.anim.image = "img_command";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            m = new function() {
                this.id = "cmd_resume";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_command";
                this.x = SCREEN_W;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animCommand;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.resume);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    enterMenu()
                };
                this.blit = function() {
                    this.anim.image = "img_command";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            q = new function() {
                this.id = "obj_ui";
                this.group = GROUP_GAME_UI;
                this.tileset = "tile_ui";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animUI;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.lv);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {};
                this.blit = function() {
                    this.anim.image = "img_ui";
                    var a = {
                        tile: AnimMgr.getFrameID(this.anim.action.lv, 0),
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    a = this.anim.coll[AnimMgr.getFrameID(this.anim.action.lv, 0)];
                    ImageNumber.drawNum(gbox.getBufferContext(), curLevel, this.x + a[0], this.y + a[1], 1, "LB", animNum_3);
                    if (curExp !== 0) {
                        var a = this.anim.coll[AnimMgr.getFrameID(this.anim.action.lv, 1)],
                            b = Math.floor(a[2] * curExp / lvUpExp[curLevel]),
                            a = {
                                tile: AnimMgr.getFrameID(this.anim.action.lv, 2),
                                dx: this.x,
                                dy: this.y,
                                dw: b,
                                anim: this.anim
                            };
                        AnimMgr.draw(gbox.getBufferContext(), a);
                        a = {
                            tile: AnimMgr.getFrameID(this.anim.action.lv, 1),
                            dx: this.x,
                            dy: this.y,
                            anim: this.anim
                        };
                        AnimMgr.draw(gbox.getBufferContext(), a);
                        a = this.anim.coll[AnimMgr.getFrameID(this.anim.action.lv, 2)];
                        a = {
                            tile: AnimMgr.getFrameID(this.anim.action.lv, 3),
                            dx: this.x + a[0] + b,
                            dy: this.y,
                            anim: this.anim
                        };
                        AnimMgr.draw(gbox.getBufferContext(), a)
                    }
                }
            };
        listGameObj = [a, b, c, e, f, h, g, d, j, l, k, m, q];
        resetGame(b)
    },
    enterGame = function() {
        DEBUG && console.log("\nenterGame()");
        if (listGameObj != null) for (var a in listGameObj) gbox.addObject(listGameObj[a]);
        gbox.setRenderOrder([GROUP_MAP, GROUP_COW, GROUP_LARIAT, GROUP_GAME_UI, GROUP_BACK_CALL]);
        gbox.getGroupsInLayer(LAYER_GAME).length == 0 && gbox.setGroupsToLayer([GROUP_MAP, GROUP_COW, GROUP_LARIAT, GROUP_GAME_UI], LAYER_GAME);
        changeMap(LAYER_GAME)
    };

function callWhenColliding(a, b, c) {
    for (var e in gbox._objects[b]) if (!gbox._objects[b][e].initialize && toys.topview.collides(a, gbox._objects[b][e]) && gbox._objects[b][e][c]) return gbox._objects[b][e][c](a), e;
    return !1
}
var listGameMenuObj = null,
    initGameMenu = function() {
        listGameMenuObj = null;
        var a = new function() {
                this.id = "obj_menu_bg";
                this.group = GROUP_GAME_MENU;
                this.tileset = "tile_menu_bg";
                this.x = SCREEN_W / 2;
                this.y = 10;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.anim = animShop;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.title)
                };
                this.first = function() {};
                this.myclick = function() {};
                this.blit = function() {
                    gbox.blitFade(gbox.getBufferContext(), {
                        color: "#32B16C",
                        alpha: 1
                    });
                    var a = gbox.getImage("img_help_bg");
                    gbox.blitAll(gbox.getBufferContext(), a, {
                        dx: SCREEN_W / 2 - a.width / 2,
                        dy: SCREEN_H / 2 - a.height / 2
                    });
                    this.anim.image = "img_shop";
                    a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            b = null,
            c = new function() {
                this.id = "item_$50";
                this.group = GROUP_GAME_MENU;
                this.tileset = "tile_shop";
                this.x = SCREEN_W / 2 - 10;
                this.y = SCREEN_H / 2 - 10;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animShop;
                this.initialize = function() {
                    toys.topview.initialize(this, {})
                };
                this.first = function() {
                    AnimMgr.updatePolyWithAnim(this);
                    b == this ? AnimMgr.changeAction(this, this.anim.action.select_0) : AnimMgr.changeAction(this, this.anim.action.item_0)
                };
                this.myclick = function() {
                    b != this && (b = this)
                };
                this.blit = function() {
                    this.anim.image = "img_shop";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            e = new function() {
                this.id = "item_$100";
                this.group = GROUP_GAME_MENU;
                this.tileset = "tile_shop";
                this.x = SCREEN_W / 2 + 10;
                this.y = SCREEN_H / 2 - 10;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animShop;
                this.initialize = function() {
                    toys.topview.initialize(this, {})
                };
                this.first = function() {
                    AnimMgr.updatePolyWithAnim(this);
                    b == this ? AnimMgr.changeAction(this, this.anim.action.select_1) : AnimMgr.changeAction(this, this.anim.action.item_1)
                };
                this.myclick = function() {
                    b != this && (b = this)
                };
                this.blit = function() {
                    this.anim.image = "img_shop";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            f = new function() {
                this.id = "item_$300";
                this.group = GROUP_GAME_MENU;
                this.tileset = "tile_shop";
                this.x = SCREEN_W / 2 - 10;
                this.y = SCREEN_H / 2 + 10;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animShop;
                this.initialize = function() {
                    toys.topview.initialize(this, {})
                };
                this.first = function() {
                    AnimMgr.updatePolyWithAnim(this);
                    b == this ? AnimMgr.changeAction(this, this.anim.action.select_2) : AnimMgr.changeAction(this, this.anim.action.item_2)
                };
                this.myclick = function() {
                    b != this && (b = this)
                };
                this.blit = function() {
                    this.anim.image = "img_shop";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            h = new function() {
                this.id = "item_$1000";
                this.group = GROUP_GAME_MENU;
                this.tileset = "tile_shop";
                this.x = SCREEN_W / 2 + 10;
                this.y = SCREEN_H / 2 + 10;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animShop;
                this.initialize = function() {
                    toys.topview.initialize(this, {})
                };
                this.first = function() {
                    AnimMgr.updatePolyWithAnim(this);
                    b == this ? AnimMgr.changeAction(this, this.anim.action.select_3) : AnimMgr.changeAction(this, this.anim.action.item_3)
                };
                this.myclick = function() {
                    b != this && (b = this)
                };
                this.blit = function() {
                    this.anim.image = "img_shop";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            g = new function() {
                this.id = "cmd_resume";
                this.group = GROUP_GAME_MENU;
                this.tileset = "tile_command";
                this.x = SCREEN_W;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animCommand;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.resume);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    enterGame()
                };
                this.blit = function() {
                    this.anim.image = "img_command";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            b = c;
        listGameMenuObj = [a, c, e, f, h, g]
    },
    enterGameMenu = function() {
        DEBUG && console.log("\nenterGameMenu()");
        if (listGameMenuObj != null) for (var a in listGameMenuObj) gbox.addObject(listGameMenuObj[a]);
        gbox.setRenderOrder([GROUP_MAP, GROUP_GAME_MENU, GROUP_BACK_CALL]);
        gbox.getGroupsInLayer(LAYER_GAMEMENU).length == 0 && gbox.setGroupsToLayer([GROUP_GAME_MENU], LAYER_GAMEMENU);
        changeMap(LAYER_GAMEMENU)
    },
    listHelpObj = null,
    initHelp = function() {
        listHelpObj = null;
        var a = splitString("达人教学：\n\n１．点击屏幕绳套扔出，套到屏幕中跑过的牛为胜利。\n\n２．每次扔出绳套的时间限时为３０秒，每次扔出绳套消费１金币。计时结束仍未操作将消费１金币，绳套自动扔出。\n\n３．屏幕上方有每种牛的头像及套中后对应的报酬金钱数。当前出场牛的头像下方会有箭头指示。\n\n４．套中价值越高的牛，所获得的经验值也会越多。可以从屏幕下方查看当前等级已获经验。\n\n５．玩家经验满后等级将会提升。做为升级奖励，升级后玩家将有一回合奖励双倍的机会。此时套中牛所获得金币以及经验都享有双倍待遇，但仅限一回合。\n如未套中，则失去奖励回合。", 16, 16, 20),
            b = a.length,
            c = 0,
            e = new function() {
                this.id = "obj_help";
                this.group = GROUP_HELP;
                this.tileset = "tile_help";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H / 2;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animHelp;
                this.anim.image = "img_help";
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.help)
                };
                this.first = function() {};
                this.myclick = function() {};
                this.blit = function() {
                    var d = gbox.getImage("img_help_bg");
                    gbox.blitAll(gbox.getBufferContext(), d, {
                        dx: SCREEN_W / 2 - d.width / 2,
                        dy: SCREEN_H / 2 - d.height / 2
                    });
                    d = {
                        tile: AnimMgr.getFrameID(this.anim.action.help, 0),
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), d);
                    d = this.anim.coll[AnimMgr.getFrameID(this.anim.action.box, 2)];
                    ImageNumber.drawNum(gbox.getBufferContext(), c + 1 + "/" + b, this.x + d[0], this.y + d[1], 1, "RV", animNum_1);
                    var j = gbox.getBufferContext();
                    if (j != null) j.save(), j.lineWidth = 3, j.strokeStyle = "#FFFFFF", j.lineJoin = "round", j.beginPath(), d = this.anim.coll[AnimMgr.getFrameID(this.anim.action.box, 0)], j.moveTo(this.x + d[0], this.y + d[1] + d[3]), j.lineTo(this.x + d[0], this.y + d[1] + 4), j.lineTo(this.x + d[0] + 4, this.y + d[1]), j.lineTo(this.x + d[0] + d[2] / 2 - d[3] / 2, this.y + d[1]), j.lineTo(this.x + d[0] + d[2] / 2 + d[3] / 2, this.y + d[1] + d[3]), j.lineTo(this.x + d[0] + d[2], this.y + d[1] + d[3]), j.lineTo(this.x + d[0] + d[2], SCREEN_H - d[3] - 10), j.lineTo(this.x + d[0], SCREEN_H - d[3] - 10), j.closePath(), j.stroke(), j.restore();
                    var d = this.y + d[1] + d[3] + 10,
                        e;
                    for (e in a[c]) gbox.blitSystemText(gbox.getBufferContext(), {
                        text: a[c][e],
                        color: "#000000",
                        font: "bold 16px sans-serif",
                        align: "center",
                        x: SCREEN_W / 2 + 1,
                        y: d + e * 20 + 1
                    }), gbox.blitSystemText(gbox.getBufferContext(), {
                        text: a[c][e],
                        color: "#FFFFFF",
                        font: "bold 16px sans-serif",
                        align: "center",
                        x: SCREEN_W / 2,
                        y: d + e * 20
                    })
                }
            };
        new function() {
            this.id = "btn_home";
            this.group = GROUP_HELP;
            this.tileset = "tile_help";
            this.x = SCREEN_W / 2;
            this.y = SCREEN_H;
            this.poly = [
                [],
                [],
                [],
                []
            ];
            this.frame = 0;
            this.action = null;
            this.anim = animHelp;
            this.initialize = function() {
                toys.topview.initialize(this, {});
                AnimMgr.changeAction(this, this.anim.action.home);
                AnimMgr.updatePolyWithAnim(this)
            };
            this.first = function() {};
            this.myclick = function() {
                c = 0
            };
            this.blit = function() {
                this.anim.image = "img_help";
                var a = {
                    tile: this.frame,
                    dx: this.x,
                    dy: this.y,
                    anim: this.anim
                };
                AnimMgr.draw(gbox.getBufferContext(), a);
                this.frame = AnimMgr.nextFrame(this.action)
            }
        };
        var f = new function() {
                this.id = "btn_prev";
                this.group = GROUP_HELP;
                this.tileset = "tile_help";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animHelp;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.prev);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    c--;
                    c < 0 && (c = 0)
                };
                this.blit = function() {
                    this.anim.image = "img_help";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            h = new function() {
                this.id = "btn_next";
                this.group = GROUP_HELP;
                this.tileset = "tile_help";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animHelp;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.next);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    c++;
                    c > b - 1 && (c = b - 1)
                };
                this.blit = function() {
                    this.anim.image = "img_help";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            };
        new function() {
            this.id = "btn_end";
            this.group = GROUP_HELP;
            this.tileset = "tile_help";
            this.x = SCREEN_W / 2;
            this.y = SCREEN_H;
            this.poly = [
                [],
                [],
                [],
                []
            ];
            this.frame = 0;
            this.action = null;
            this.anim = animHelp;
            this.initialize = function() {
                toys.topview.initialize(this, {});
                AnimMgr.changeAction(this, this.anim.action.end);
                AnimMgr.updatePolyWithAnim(this)
            };
            this.first = function() {};
            this.myclick = function() {
                c = b - 1
            };
            this.blit = function() {
                this.anim.image = "img_help";
                var a = {
                    tile: this.frame,
                    dx: this.x,
                    dy: this.y,
                    anim: this.anim
                };
                AnimMgr.draw(gbox.getBufferContext(), a);
                this.frame = AnimMgr.nextFrame(this.action)
            }
        };
        var g = new function() {
            this.id = "cmd_back";
            this.group = GROUP_HELP;
            this.tileset = "tile_command";
            this.x = SCREEN_W;
            this.y = SCREEN_H;
            this.poly = [
                [],
                [],
                [],
                []
            ];
            this.frame = 0;
            this.action = null;
            this.anim = animCommand;
            this.initialize = function() {
                toys.topview.initialize(this, {});
                AnimMgr.changeAction(this, this.anim.action.resume);
                AnimMgr.updatePolyWithAnim(this)
            };
            this.first = function() {};
            this.myclick = function() {
                enterMenu()
            };
            this.blit = function() {
                this.anim.image = "img_command";
                var a = {
                    tile: this.frame,
                    dx: this.x,
                    dy: this.y,
                    anim: this.anim
                };
                AnimMgr.draw(gbox.getBufferContext(), a);
                this.frame = AnimMgr.nextFrame(this.action)
            }
        };
        listHelpObj = [e, g, f, h]
    },
    enterHelp = function() {
        DEBUG && console.log("\nenterHelp()");
        if (listHelpObj != null) for (var a in listHelpObj) gbox.addObject(listHelpObj[a]);
        gbox.setRenderOrder([GROUP_HELP, GROUP_BACK_CALL]);
        gbox.getGroupsInLayer(LAYER_HELP).length == 0 && gbox.setGroupsToLayer([GROUP_HELP], LAYER_HELP);
        changeMap(LAYER_HELP)
    },
    splitString = function(a, b, c, e) {
        var a = gbox.wordWrap(a, b, "\n", !0),
            f;
        for (f in a) {
            for (var h = a[f], g = b - h.length, c = 0; c < g; c++) h += "　";
            a[f] = h
        }
        c = animHelp.coll[AnimMgr.getFrameID(animHelp.action.box, 1)];
        e = Math.floor(c[3] / e) - 1;
        b = Math.floor(a.length / e);
        b += a.length % b > 0 ? 1 : 0;
        f = [];
        for (c = 0; c < b; c++) f.push(a.splice(0, e));
        return f
    },
    listRankObj = null,
    initRank = function() {
        listRankObj = null;
        var a = 0,
            b = new function() {
                this.id = "obj_rank";
                this.group = GROUP_RANK;
                this.tileset = "tile_help";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H / 2;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animHelp;
                this.anim.image = "img_help";
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.rank)
                };
                this.first = function() {};
                this.myclick = function() {};
                this.blit = function() {
                    var b = gbox.getImage("img_help_bg");
                    gbox.blitAll(gbox.getBufferContext(), b, {
                        dx: SCREEN_W / 2 - b.width / 2,
                        dy: SCREEN_H / 2 - b.height / 2
                    });
                    for (var b = ["home", "prev", "next", "end"], c = 0; c < b.length; c++) {
                        var e = {
                            tile: AnimMgr.getFrameID(this.anim.action[b[c]], 0),
                            dx: SCREEN_W / 2,
                            dy: SCREEN_H,
                            anim: this.anim
                        };
                        AnimMgr.draw(gbox.getBufferContext(), e)
                    }
                    e = {
                        tile: AnimMgr.getFrameID(this.anim.action.rank, 0),
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), e);
                    for (c = 0; c < 4; c++) e = {
                        tile: AnimMgr.getFrameID(this.anim.action.item_bg, 0),
                        dx: this.x,
                        dy: this.y - 80 + c * 60,
                        anim: this.anim
                    }, AnimMgr.draw(gbox.getBufferContext(), e);
                    this.frame = AnimMgr.nextFrame(this.action);
                    b = gbox.getBufferContext();
                    if (b != null) b.save(), b.lineWidth = 3, b.strokeStyle = "#FFFFFF", b.lineJoin = "round", b.beginPath(), c = this.anim.coll[AnimMgr.getFrameID(this.anim.action.box, 0)], b.moveTo(this.x + c[0], this.y + c[1] + c[3]), b.lineTo(this.x + c[0], this.y + c[1] + 4), b.lineTo(this.x + c[0] + 4, this.y + c[1]), b.lineTo(this.x + c[0] + c[2] / 2 - c[3] / 2, this.y + c[1]), b.lineTo(this.x + c[0] + c[2] / 2 + c[3] / 2, this.y + c[1] + c[3]), b.lineTo(this.x + c[0] + c[2], this.y + c[1] + c[3]), b.lineTo(this.x + c[0] + c[2], SCREEN_H - c[3] - 10), b.lineTo(this.x + c[0], SCREEN_H - c[3] - 10), b.closePath(), b.stroke(), b.restore();
                    if (isNetMode) for (c = a * topNumPerPage; c < topNumPerPage; c++) e = topList[c], gbox.blitSystemText(gbox.getBufferContext(), {
                        text: c + " - " + e.userName + "    " + e.level,
                        color: "#FFFFFF",
                        font: "normal 24px sans-serif",
                        align: "center",
                        baseline: "middle",
                        x: SCREEN_W / 2,
                        y: this.y - 80 + c * 60 + 28
                    })
                }
            },
            c = new function() {
                this.id = "btn_home";
                this.group = GROUP_RANK;
                this.tileset = "tile_help";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animHelp;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.home);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    a = 0
                };
                this.blit = function() {
                    this.anim.image = "img_help";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            e = new function() {
                this.id = "btn_end";
                this.group = GROUP_RANK;
                this.tileset = "tile_help";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animHelp;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.end);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    a = topNumMaxPage - 1
                };
                this.blit = function() {
                    this.anim.image = "img_help";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            f = new function() {
                this.id = "btn_prev";
                this.group = GROUP_RANK;
                this.tileset = "tile_help";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animHelp;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.end);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    a--;
                    a < 0 && (a = 0)
                };
                this.blit = function() {
                    this.anim.image = "img_help";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            h = new function() {
                this.id = "btn_next";
                this.group = GROUP_RANK;
                this.tileset = "tile_help";
                this.x = SCREEN_W / 2;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animHelp;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.end);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    a++;
                    a > topNumMaxPage - 1 && (a = topNumMaxPage - 1)
                };
                this.blit = function() {
                    this.anim.image = "img_help";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            },
            g = new function() {
                this.id = "cmd_back";
                this.group = GROUP_RANK;
                this.tileset = "tile_command";
                this.x = SCREEN_W;
                this.y = SCREEN_H;
                this.poly = [
                    [],
                    [],
                    [],
                    []
                ];
                this.frame = 0;
                this.action = null;
                this.anim = animCommand;
                this.initialize = function() {
                    toys.topview.initialize(this, {});
                    AnimMgr.changeAction(this, this.anim.action.resume);
                    AnimMgr.updatePolyWithAnim(this)
                };
                this.first = function() {};
                this.myclick = function() {
                    enterMenu()
                };
                this.blit = function() {
                    this.anim.image = "img_command";
                    var a = {
                        tile: this.frame,
                        dx: this.x,
                        dy: this.y,
                        anim: this.anim
                    };
                    AnimMgr.draw(gbox.getBufferContext(), a);
                    this.frame = AnimMgr.nextFrame(this.action)
                }
            };
        listRankObj = [b, c, e, f, h, g]
    },
    enterRank = function() {
        DEBUG && console.log("\nenterRank()");
        if (listRankObj != null) for (var a in listRankObj) gbox.addObject(listRankObj[a]);
        gbox.setRenderOrder([GROUP_RANK, GROUP_BACK_CALL]);
        gbox.getGroupsInLayer(LAYER_RANK).length == 0 && gbox.setGroupsToLayer([GROUP_RANK], LAYER_RANK);
        changeMap(LAYER_RANK)
    },
    isIPhone = !1;
    //ua = navigator.userAgent.toLowerCase();
//ua.indexOf("iphone") > 0 ? (isIPhone = !0, document.write('<meta name="viewport" content="user-scalable=no, width=device-width; initial-scale=0.5; minimum-scale=0.5; maximum-scale=0.5;" />')) : document.write('<meta name="viewport" content="user-scalable=no, width=device-width; initial-scale=1.0; minimum-scale=1.0; maximum-scale=1.0;" />');
var cache = window.applicationCache;
setTimeout(checkCache, 100);

function checkCache() {
    cache.status == 4 ? (console.log("swapCache"), cache.swapCache(), window.location.reload()) : cache.status == 1 || cache.status == 0 || setTimeout(checkCache, 100)
}
window.scrollTo(0, 1);
var Sys = {},
    ua = navigator.userAgent.toLowerCase();

function CheckBrower() {
    var a = "";
    (a = ua.match(/msie ([\d.]+)/)) ? Sys.ie = a[1] : (a = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = a[1] : (a = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = a[1] : (a = ua.match(/opera.([\d.]+)/)) ? Sys.opera = a[1] : (a = ua.match(/version\/([\d.]+).*safari/)) && (Sys.safari = a[1])
}
var applewebkitversion, webkitversion = 999;
CheckBrower();
if (!Sys.ie && !Sys.firefox && !Sys.chrome && !Sys.opera && Sys.safari)(applewebkitversion = ua.match(/applewebkit\/([\d.]+)/)) && (Sys.applewebkitversion = applewebkitversion[1]), Sys.applewebkitversion = Sys.applewebkitversion.substring(0, Sys.applewebkitversion.indexOf(".")), webkitversion = parseInt(Sys.applewebkitversion);
var screenHeight = window.innerHeight;
screenHeight > 533 && (screenHeight = 533);
var touchSpeed = 1,
    iphone = !1;
ua.indexOf("iphone") > 0 && (iphone = !0);
startGame();
if (webkitversion < 533 && ua.indexOf("htc") == -1) {
    var factor = 0.666;
    drawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function() {
        for (var a = arguments.length - 1; a >= 1; a--) arguments[a] *= factor;
        drawImage.apply(this, arguments)
    }
};