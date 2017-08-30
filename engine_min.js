var dynalist = {
        create: function() {
            return {
                first: null,
                last: null,
                data: [],
                dl: 0,
                gar: [],
                disconnect: function(a) {
                    this.data[a].__first != null ? this.data[this.data[a].__first].__next = this.data[a].__next : this.first = this.data[a].__next;
                    this.data[a].__next != null ? this.data[this.data[a].__next].__first = this.data[a].__first : this.last = this.data[a].__first
                },
                addObject: function(a, b) {
                    var c = this.gar.pop();
                    if (c == null) c = this.dl, this.dl++;
                    if (this.first == null) a.__next = null, a.__first = null, this.last = this.first = c;
                    else {
                        for (var d = this.first; d != null;) if (this.data[d].__prio > b) break;
                        else d = this.data[d].__next;
                        d == null ? (a.__next = null, a.__first = this.last, this.last = this.data[this.last].__next = c) : (a.__first = this.data[d].__first, a.__next = d, this.data[d].__first = c, a.__first != null ? this.data[a.__first].__next = c : this.first = c)
                    }
                    a.__prio = b;
                    a.__id = c;
                    this.data[c] = a;
                    return c
                },
                setPrio: function(a, b) {
                    if (this.data[a].__prio != b) {
                        if (this.first != this.last) if (this.data[a].__prio < b) {
                            if (this.data[a].__id != this.last) {
                                for (var c = this.data[a].__next; c != null;) if (this.data[c].__prio >= b) break;
                                else c = this.data[c].__next;
                                if (c == null || this.data[c].__first != this.data[a].__id) this.disconnect(a), c == null ? (this.data[this.last].__next = this.data[a].__id, this.data[a].__first = this.last, this.data[a].__next = null, this.last = this.data[a].__id) : (this.data[a].__first = this.data[c].__first, this.data[a].__next = c, this.data[c].__first = this.data[a].__id, this.data[a].__first != null ? this.data[this.data[a].__first].__next = this.data[a].__id : this.first = this.data[a].__id)
                            }
                        } else if (this.data[a].__id != this.first) {
                            for (c = this.data[a].__first; c != null;) if (this.data[c].__prio <= b) break;
                            else c = this.data[c].__first;
                            if (c == null || this.data[c].__next != this.data[a].__id) this.disconnect(a), c == null ? (this.data[this.first].__first = this.data[a].__id, this.data[a].__first = null, this.data[a].__next = this.first, this.first = this.data[a].__id) : (this.data[a].__first = c, this.data[a].__next = this.data[c].__next, this.data[c].__next = this.data[a].__id, this.data[a].__next != null ? this.data[this.data[a].__next].__first = this.data[a].__id : this.last = this.data[a].__id)
                        }
                        this.data[a].__prio = b
                    }
                },
                remove: function(a) {
                    this.disconnect(a);
                    this.gar.push(this.data[a].__id);
                    delete this.data[this.data[a].__id]
                }
            }
        }
    },
    cyclelist = {
        create: function(a) {
            return {
                _head: 0,
                _tail: 0,
                _data: [],
                _size: a ? a : 10,
                _total: 0,
                _done: 0,
                _current: null,
                getTotal: function() {
                    return this._total
                },
                getDone: function() {
                    return this._done
                },
                getSize: function() {
                    return this._size
                },
                isProcessing: function() {
                    return this._current != null
                },
                isEnded: function() {
                    return this._head == this._tail
                },
                isBusy: function() {
                    return this.isProcessing() || !this.isEnded()
                },
                getCurrent: function() {
                    return this._current
                },
                push: function(a) {
                    this._data[this._head] = a;
                    this._head = (this._head + 1) % this._size;
                    this._total++
                },
                pop: function() {
                    this.isEnded() ? (this._done = this._total = 0, this._current = null) : (this._current = this._data[this._tail], this._tail = (this._tail + 1) % this._size, this._done++);
                    return this._current
                },
                dump: function() {
                    for (var a = "", c = 0; c < this._size; c++) a += c + ") " + this._data[c] + " | " + (c == this._head ? "HEAD " : "") + (c == this._tail ? "TAIL " : "") + "\n";
                    a += "\n\n" + this._done + "/" + this._total;
                    return a
                }
            }
        }
    },
    cachelist = {
        create: function(a) {
            return {
                _cache: {},
                _queue: [],
                _head: 0,
                _size: a ? a : 10,
                add: function(a, c) {
                    this._cache[a] ? this._cache[a].value = c : (this._queue[this._head] && delete this._cache[this._queue[this._head]], this._queue[this._head] = a, this._cache[a] = {
                        pos: this._head,
                        value: c
                    }, this._head = (this._head + 1) % this._size)
                },
                read: function(a) {
                    return this._cache[a] ? this._cache[a].value : null
                },
                clear: function() {
                    this._cache = {};
                    this._queue = [];
                    this._head = 0
                }
            }
        }
    },
    gbox = {
        curentImage: "aaaa",
        testMessage: "",
        delta: 0,
        lastTime: 0,
        frames: 0,
        totalTime: 0,
        ALIGN_CENTER: 0,
        ALIGN_MIDDLE: 0,
        ALIGN_RIGHT: 1,
        ALIGN_BOTTOM: 1,
        COLOR_BLACK: "rgb(0,0,0)",
        COLOR_WHITE: "rgb(255,255,255)",
        ZINDEX_LAYER: -1,
        PALETTES: {
            c64: {
                order: ["black", "white", "red", "cyan", "purple", "green", "blue", "yellow", "orange", "brown", "lightred", "darkgray", "gray", "lightgreen", "lightblue", "lightgray"],
                colors: {
                    black: "#000000",
                    white: "#FFFFFF",
                    red: "#68372B",
                    cyan: "#70A4B2",
                    purple: "#6F3D86",
                    green: "#588D43",
                    blue: "#352879",
                    yellow: "#B8C76F",
                    orange: "#6F4F25",
                    brown: "#433900",
                    lightred: "#9A6759",
                    darkgray: "#444444",
                    gray: "#6C6C6C",
                    lightgreen: "#9AD284",
                    lightblue: "#6C5EB5",
                    lightgray: "#959595"
                }
            }
        },
        _autoid: 0,
        _cb: null,
        _keyboard: [],
        _keymap: {
            up: 38,
            down: 40,
            right: 39,
            left: 37,
            a: 90,
            b: 88,
            c: 67
        },
        _flagstype: {
            experimental: "check",
            noaudio: "check",
            loadscreen: "list",
            fse: "list"
        },
        _flags: {
            experimental: !1,
            noaudio: !1,
            loadscreen: "normal",
            fse: "none"
        },
        _localflags: {},
        _fonts: {},
        _tiles: {},
        _images: {},
        _camera: {},
        _screen: 0,
        _screenposition: 0,
        _keyboardpicker: 0,
        _screenh: 0,
        _screenw: 0,
        _screenhh: 0,
        _screenhw: 0,
        _zoom: 1,
        _canvas: {},
        _objects: {},
        _groups: [],
        _layer: [],
        _groupsInLayer: [],
        _groupsShow: [],
        _objectIds: [],
        GROUP_ID: 0,
        _renderorder: [],
        _groupplay: {},
        _actionqueue: ["first", "blit", "after"],
        _mspf: 0,
        _fps: 0,
        _gametimer: 0,
        _frameskip: 0,
        _autoskip: {
            min: 0,
            max: 5,
            lowidle: 0,
            hiidle: 5
        },
        _fskid: 0,
        _statbar: 0,
        _border: 0,
        _garbage: [],
        _zindexch: [],
        _framestart: 0,
        _zindex: dynalist.create(),
        _db: !1,
        _systemcookie: "__gboxsettings",
        _sessioncache: "",
        _breakcacheurl: function(a) {
            return a + (a.indexOf("?") == -1 ? "?" : "&") + "_brc=" + gbox._sessioncache
        },
        _forcedidle: 0,
        _gamewaiting: 0,
        _canlog: !1,
        _splash: {
            gaugeLittleColor: "rgb(255,240,0)",
            gaugeLittleBackColor: "rgb(255,255,255)",
            gaugeBorderColor: "rgb(0,0,0)",
            gaugeBackColor: "rgb(100,100,100)",
            gaugeColor: "rgb(255,240,0)",
            gaugeHeight: 10,
            background: null,
            minimalTime: 0,
            footnotes: null,
            footnotesSpacing: 1
        },
        _minimalexpired: 0,
        setCanLog: function(a) {
            this._canlog = a && window.console
        },
        canLog: function() {
            return this._canlog
        },
        log: function() {},
        _safedrawimage: function(a, b, c, d, f, e, g, j, i, h) {
            if (b && a) {
                c < 0 && (g -= i / f * c, f += c, c = 0);
                d < 0 && (j -= h / e * d, e += d, d = 0);
                c + f > b.width && (i = i / f * (b.width - c), f = b.width - c);
                d + e > b.height && (h = h / e * (b.height - d), e = b.height - d);
                try {
                    e > 0 && f > 0 && c < b.width && d < b.height && a.drawImage(b, c, d, f, e, g, j, i, h)
                } catch (l) {
                    alert("_safedrawimage " + l)
                }
            }
        },
        setScreenBorder: function(a) {
            this._border = a
        },
        initScreen: function(a, b) {
            document.body.style.textAlign = "TOP";
            document.body.style.height = "100%";
            document.body.style.margin = "0px";
            document.body.style.padding = "0px";
            document.getElementsByTagName("html")[0].style.height = "100%";
            var c = document.createElement("div");
            c.style.width = "100%";
            c.style.height = "100%";
            c.style.display = "table";
            this._box = document.createElement("div");
            this._box.style.display = "table-cell";
            this._box.style.width = "100%";
            this._box.style.textAlign = "TOP";
            this._box.style.verticalAlign = "TOP";
            this._screen = document.createElement("canvas");
            if (this._border) this._screen.style.border = "1px solid black";
            this._screen.setAttribute("width", a);
            this._screen.style.width = a * this._zoom + "px";
            isIPhone ? (this._screen.style.webkitTransform = "scale3d(2, 2, 0) translate3d(80px, " + b / 2 + "px, 0)", this._screen.setAttribute("height", b * 2), this._screen.style.height = b * this._zoom * 2 + "px") : (this._screen.setAttribute("height", b), this._screen.style.height = b * this._zoom + "px");
            this._screenh = b;
            this._screenw = a;
            this._screenhh = Math.floor(b / 2);
            this._screenhw = Math.floor(a / 2);
            this._camera.x = 0;
            this._camera.y = 0;
            this._camera.h = b;
            this._camera.w = a;
            this._box.appendChild(this._screen);
            c.appendChild(this._box);
            document.body.appendChild(c);
            this.createCanvas("_buffer");
            if (this._statbar) {
                this._statbar = document.createElement("div");
                if (this._border) this._statbar.style.border = "1px solid black";
                this._statbar.style.margin = "auto";
                this._statbar.style.backgroundColor = "#ffffff";
                this._statbar.style.fontSize = "10px";
                this._statbar.style.fontFamily = "sans-serif";
                this._statbar.style.width = a * this._zoom + "px";
                this._box.appendChild(this._statbar)
            }
            c = new Date;
            gbox._sessioncache = c.getDate() + "-" + c.getMonth() + "-" + c.getFullYear() + "-" + c.getHours() + "-" + c.getMinutes() + "-" + c.getSeconds();
            switch (gbox._flags.fse) {
                case "scanlines":
                    gbox.createCanvas("-gbox-fse", {
                        w: a,
                        h: b
                    });
                    gbox.getCanvasContext("-gbox-fse").save();
                    gbox.getCanvasContext("-gbox-fse").globalAlpha = 0.2;
                    gbox.getCanvasContext("-gbox-fse").fillStyle = gbox.COLOR_BLACK;
                    for (c = 0; c < b; c += 2) gbox.getCanvasContext("-gbox-fse").fillRect(0, c, a, 1);
                    gbox.getCanvasContext("-gbox-fse").restore();
                    gbox._localflags.fse = !0;
                    break;
                case "lcd":
                    gbox.createCanvas("-gbox-fse-old", {
                        w: a,
                        h: b
                    }), gbox.createCanvas("-gbox-fse-new", {
                        w: a,
                        h: b
                    }), gbox._localflags.fse = !0
            }
        },
        setDoubleBuffering: function(a) {
            this._db = a
        },
        setStatBar: function(a) {
            if (gbox._statbar) this._statbar.innerHTML = a ? a : "&nbsp"
        },
        setFps: function(a) {
            this._fps = a;
            this._mspf = Math.floor(1E3 / a)
        },
        getFps: function() {
            return this._fps
        },
        setAutoskip: function(a) {
            this._autoskip = a
        },
        setFrameskip: function(a) {
            this._frameskip = a
        },
        getScreenH: function() {
            return this._screenh
        },
        getScreenW: function() {
            return this._screenw
        },
        getScreenHH: function() {
            return this._screenhh
        },
        getScreenHW: function() {
            return this._screenhw
        },
        setZoom: function(a) {
            this._zoom = a
        },
        setCallback: function(a) {
            this._cb = a
        },
        _playobject: function(a, b, c) {
            gbox._objects[a][b].initialize && (gbox._objects[a][b].initialize(b), delete gbox._objects[a][b].initialize);
            if (gbox._objects[a][b][c]) gbox._objects[a][b][c](b, c)
        },
        _nextframe: function() {
            gbox._framestart = gbox._mspf - ((new Date).getTime() - gbox._framestart);
            gbox._autoskip && (gbox._framestart < gbox._autoskip.lowidle && gbox._frameskip < gbox._autoskip.max ? gbox.setFrameskip(gbox._frameskip + 1) : gbox._framestart > gbox._autoskip.hiidle && gbox._frameskip > gbox._autoskip.min && gbox.setFrameskip(gbox._frameskip - 1));
            this._gametimer = setTimeout(gbox.go, gbox._framestart <= 0 ? 1 : gbox._framestart)
        },
        _applyfse: function() {
            switch (gbox._flags.fse) {
                case "scanlines":
                    gbox.getBufferContext().drawImage(gbox.getCanvas("-gbox-fse"), 0, 0);
                    break;
                case "lcd":
                    gbox._localflags.fselcdget && gbox.getBuffer() && gbox.getCanvasContext("-gbox-fse-new").drawImage(gbox.getBuffer(), 0, 0), gbox.getBufferContext().save(), gbox.getBufferContext().globalAlpha = 0.5, gbox.getBufferContext().drawImage(gbox.getCanvas("-gbox-fse-old"), 0, 0), gbox.getBufferContext().restore(), gbox._localflags.fselcdget && gbox.swapCanvas("-gbox-fse-new", "-gbox-fse-old"), gbox._localflags.fselcdget = !gbox._localflags.fselcdget
            }
        },
        onLoad: function(a) {
            this.addEventListener(window, "load", a)
        },
        go: function() {
            if (gbox.totalTime > 200) gbox.totalTime = 0, gbox.frames = 0;
            var a = (new Date).getTime();
            gbox.delta = a - gbox.lastTime;
            gbox.lastTime = a;
            gbox.totalTime += gbox.delta;
            gbox.frames++;
            if (gbox._loaderqueue.isBusy()) {
                if (gbox._gamewaiting == 1) gbox._gamewaiting = !0;
                gbox._gamewaiting && gbox._gamewaiting--;
                setTimeout(gbox.go, 1E3)
            } else {
                gbox._gamewaiting = 3;
                gbox._framestart = a;
                for (a = 0; a < gbox._renderorder.length; a++) if (gbox._groupplay[gbox._renderorder[a]]) if (gbox._renderorder[a] == gbox.ZINDEX_LAYER) for (var b, c = 0; c < gbox._actionqueue.length; c++) for (b = gbox._zindex.first; b != null;) gbox._groupplay[gbox._zindex.data[b].g] && gbox._playobject(gbox._zindex.data[b].g, gbox._zindex.data[b].o, gbox._actionqueue[c]), b = gbox._zindex.data[b].__next;
                else for (c = 0; c < gbox._actionqueue.length; c++) for (var d in gbox._objects[gbox._renderorder[a]]) gbox._playobject(gbox._renderorder[a], d, gbox._actionqueue[c]);
                gbox._fskid >= gbox._frameskip ? (gbox._localflags.fse && gbox._applyfse(), gbox._db && gbox.blitImageToScreen(gbox.getBuffer()), gbox._fskid = 0) : gbox._fskid++;
                gbox.purgeGarbage();
                if (gbox._zindexch.length) {
                    for (c = 0; c < gbox._zindexch.length; c++) if (gbox._objects[gbox._zindexch[c].o.g][gbox._zindexch[c].o.o]) gbox._objects[gbox._zindexch[c].o.g][gbox._zindexch[c].o.o].__zt == null ? gbox._objects[gbox._zindexch[c].o.g][gbox._zindexch[c].o.o].__zt = gbox._zindex.addObject(gbox._zindexch[c].o, gbox._zindexch[c].z) : gbox._zindex.setPrio(gbox._objects[gbox._zindexch[c].o.g][gbox._zindexch[c].o.o].__zt, gbox._zindexch[c].z);
                    gbox._zindexch = []
                }
                gbox._forcedidle ? this._gametimer = setTimeout(gbox._nextframe, gbox._forcedidle) : gbox._nextframe()
            }
        },
        setZindex: function(a, b) {
            if (a.__zt == null || a.zindex != b) a.zindex = b, this._zindexch.push({
                o: {
                    g: a.group,
                    o: a.id
                },
                z: b
            })
        },
        dataSave: function(a, b, c) {
            var d = new Date;
            d.setTime(d.getTime() + (c ? c : 3650) * 864E5);
            document.cookie = this._systemcookie + "~" + a + "=" + b + "; expires=" + d.toGMTString() + "; path=/"
        },
        dataLoad: function(a, b) {
            for (var c = this._systemcookie + "~" + a + "=", d = document.cookie.split(";"), f = 0; f < d.length; f++) {
                for (var e = d[f]; e.charAt(0) == " ";) e = e.substring(1, e.length);
                if (e.indexOf(c) == 0) return c = e.substring(c.length, e.length), b && b.number ? c * 1 : c
            }
            return null
        },
        dataClear: function(a) {
            this.dataSave(a, "", -1)
        },
        getCamera: function() {
            return this._camera
        },
        setCameraY: function(a, b) {
            this._camera.y = a;
            if (this._camera.y + this._camera.h > b.h) this._camera.y = b.h - this._screenh;
            if (this._camera.y < 0) this._camera.y = 0
        },
        setCameraX: function(a, b) {
            this._camera.x = a;
            if (this._camera.x + this._camera.w > b.w) this._camera.x = b.w - this._screenw;
            if (this._camera.x < 0) this._camera.x = 0
        },
        centerCamera: function(a, b) {
            this.setCameraX(a.x - this._screenhw, b);
            this.setCameraY(a.y - this._screenhh, b)
        },
        getGroups: function() {
            return this._groups
        },
        getGroupsInLayer: function(a) {
            for (var b in this._groupsInLayer) if (this._groupsInLayer[b][0] == a) {
                var a = [],
                    c;
                for (c in this._groupsInLayer[b]) c > 0 && a.push(this._groupsInLayer[b][c]);
                return a
            }
            return []
        },
        setGroupsToLayer: function(a, b) {
            for (var c in this._groupsInLayer) if (this._groupsInLayer[c][0] == b) {
                for (var d in this._objectIds) for (var f in a) if (this._objectIds[d][0] == a[f]) {
                    delete this._objectIds[d];
                    break
                }
                return
            }
            this._groupsInLayer.push([b].concat(a))
        },
        addGroupToLayer: function(a, b) {
            this._groupsInLayer[b].push(a)
        },
        addGroupToLayer: function(a, b) {
            for (var c in this._groupsInLayer) for (var d in this._groupsInLayer[c]) this._groupsInLayer[c][d] == a && this._groupsInLayer[c].push(b)
        },
        getGroupLayer: function(a) {
            for (var b in this._groupsInLayer) for (var c in this._groupsInLayer[b]) if (this._groupsInLayer[b][c] == a) return this._groupsInLayer[b][0]
        },
        setLayers: function(a) {
            this._layers = a
        },
        setGroupShow: function(a) {
            for (var b in this._groupsShow) if (this._groupsShow[b][0] == a) {
                this._groupsShow[b][1] = 1;
                return
            }
            this._groupsShow.push([a, 1])
        },
        setGroupHide: function(a) {
            for (var b in this._groupsShow) if (this._groupsShow[b][0] == a) {
                this._groupsShow[b][1] = 0;
                return
            }
            this._groupsShow.push([a, 0])
        },
        getGroupShow: function(a) {
            for (var b in this._groupsShow) if (this._groupsShow[b][0] == a) return this._groupsShow[b][1];
            return 0
        },
        setLayerShow: function(a) {
            var a = this.getGroupsInLayer(a),
                b;
            for (b in a) this.setGroupShow(a[b])
        },
        setLayerHide: function(a) {
            var a = this.getGroupsInLayer(a),
                b;
            for (b in a) this.setGroupHide(a[b])
        },
        getObjectsInGroup: function(a) {
            var b = [],
                c;
            for (c in this._objectIds) if (this._objectIds[c][this.GROUP_ID] == a) for (var d in this._objectIds[c]) if (d > 0) {
                var f = this.getObject(a, this._objectIds[c][d]);
                b.push(f)
            }
            return b
        },
        clearObjectIds: function() {
            _objectIds = []
        },
        setGroups: function(a) {
            this._groups = a;
            this._groupplay[gbox.ZINDEX_LAYER] = !0;
            for (var b = 0; b < a.length; b++) this._objects[a[b]] || (this._objects[a[b]] = {}, this._groupplay[a[b]] = !0, this._renderorder[b] = a[b])
        },
        setRenderOrder: function(a) {
            this._renderorder = a
        },
        playGroup: function(a) {
            this._groupplay[a] = !0
        },
        stopGroup: function(a) {
            this._groupplay[a] = !1
        },
        toggleGroup: function(a) {
            this._groupplay[a] = !this._groupplay[a]
        },
        soloGroup: function(a) {
            for (var b = 0; b < this._groups.length; b++) this._groups[b] == a ? this.playGroup(this._groups[b]) : this.stopGroup(this._groups[b])
        },
        playAllGroups: function() {
            for (var a = 0; a < this._groups.length; a++) this.playGroup(this._groups[a])
        },
        clearGroup: function(a) {
            for (var b in this._objects[a]) this._objects[a][b].__zt != null && this._zindex.remove(this._objects[a][b].__zt), delete this._objects[a][b]
        },
        playGroups: function(a) {
            for (var b = 0; b < a.length; b++) this.playGroup(a[b])
        },
        stopGroups: function(a) {
            for (var b = 0; b < a.length; b++) this.stopGroup(a[b])
        },
        toggleGroups: function(a) {
            for (var b = 0; b < a.length; b++) this.toggleGroup(a[b])
        },
        getObject: function(a, b) {
            if (typeof a == "undefined") return null;
            return this._objects[a][b]
        },
        setSystemTextFont: function(a) {
            a == null ? this._screen.getContext("2d").font = "normal 14px sans-serif" : this._screen.getContext("2d").font = a.font
        },
        trashObject: function(a) {
            this._garbage[a.group] || (this._garbage[a.group] = {});
            this._garbage[a.group][a.id] = 1;
            a.__trashing = !0
        },
        purgeGarbage: function() {
            for (var a in this._garbage) for (var b in this._garbage[a]) {
                if (this._objects[a][b].onpurge) this._objects[a][b].onpurge();
                this._objects[a][b].__zt != null && this._zindex.remove(this._objects[a][b].__zt);
                delete this._objects[a][b]
            }
            gbox._garbage = {}
        },
        trashGroup: function(a) {
            this._garbage[a] || (this._garbage[a] = {});
            for (var b in this._objects[a]) this._garbage[a][b] = 1
        },
        objectIsTrash: function(a) {
            return a.__trashing
        },
        addObject: function(a) {
            if (!a.id) a.id = "obj-" + this._autoid, this._autoid = (this._autoid + 1) % 1E3;
            if (a.tileset) {
                if (a.h == null) a.h = this._tiles[a.tileset].tileh;
                if (a.w == null) a.w = this._tiles[a.tileset].tilew;
                if (a.hw == null) a.hw = this._tiles[a.tileset].tilehw;
                if (a.hh == null) a.hh = this._tiles[a.tileset].tilehh
            }
            this._objects[a.group][a.id] = a;
            a.zindex != null && this.setZindex(this._objects[a.group][a.id], a.zindex);
            var b = !1,
                c;
            for (c in this._objectIds) if (this._objectIds[c][0] == a.group) {
                for (var d in this._objectIds[c]) if (this._objectIds[c][d] == a.id) return this.sortAndCutObjectIds(), this._objects[a.group][a.id];
                this._objectIds[c].push(a.id);
                b = !0;
                break
            }
            b || this._objectIds.push([a.group, a.id]);
            this.sortAndCutObjectIds();
            return this._objects[a.group][a.id]
        },
        sortNumber: function(a, b) {
            return b.length - a.length
        },
        sortAndCutObjectIds: function() {
            this._objectIds.sort(this.sortNumber);
            for (var a = this._objectIds.length - 1; a >= 0; a--) if (typeof this._objectIds[a] == "undefined") this._objectIds.pop();
            else break
        },
        groupIsEmpty: function(a) {
            for (var b in this._objects[a]) return !1;
            return !0
        },
        createCanvas: function(a, b) {
            this.deleteCanvas(a);
            var c = b && b.w ? b.w : this._screenw,
                d = b && b.h ? b.h : this._screenh;
            this._canvas[a] = document.createElement("canvas");
            this._canvas[a].setAttribute("height", d);
            this._canvas[a].setAttribute("width", c);
            this._canvas[a].getContext("2d").save();
            this._canvas[a].getContext("2d").globalAlpha = 0;
            this._canvas[a].getContext("2d").fillStyle = gbox.COLOR_BLACK;
            this._canvas[a].getContext("2d").fillRect(0, 0, c, d);
            this._canvas[a].getContext("2d").restore()
        },
        swapCanvas: function(a, b) {
            var c = this._canvas[a];
            this._canvas[a] = this._canvas[b];
            this._canvas[b] = c
        },
        deleteCanvas: function(a) {
            this._canvas[a] && delete this._canvas[a]
        },
        imageIsLoaded: function(a) {
            return this._images[a] && this._images[a].getAttribute("wasloaded") && this._images[a].width
        },
        getImage: function(a) {
            return this._images[a]
        },
        getBuffer: function() {
            return gbox._fskid >= gbox._frameskip ? this._db ? this.getCanvas("_buffer") : this._screen : null
        },
        getBufferContext: function() {
            return gbox._fskid >= gbox._frameskip ? this._db ? this.getCanvasContext("_buffer") : this._screen.getContext("2d") : null
        },
        getCanvas: function(a) {
            return this._canvas[a]
        },
        getCanvasContext: function(a) {
            return this.getCanvas(a).getContext("2d")
        },
        addImage: function(a, b) {
            if (this._images[a]) if (this._images[a].getAttribute("src_org") == b) return;
            else delete this._images[a];
            this._addtoloader({
                type: "image",
                id: a,
                filename: b
            })
        },
        deleteImage: function(a) {
            delete this._images[a]
        },
        addTiles: function(a) {
            a.tilehh = Math.floor(a.tileh / 2);
            a.tilehw = Math.floor(a.tilew / 2);
            this._tiles[a.id] = a
        },
        getTiles: function(a) {
            return this._tiles[a]
        },
        wordWrap: function(a, b, c, d) {
            var f, e, g = a.split("\n");
            if (b > 0) for (f in g) {
                a = g[f];
                for (g[f] = ""; a.length > b; e = d ? b : (e = a.substr(0, b).match(/\S*$/)).input.length - e[0].length || b, g[f] += a.substr(0, e) + ((a = a.substr(e)).length ? c : ""));
                g[f] += a
            }
            return g.join("\n").split("\n")
        },
        loadAll: function(a) {
            if (this._canlog) this.log = console.log;
            if (!this._cb) this._cb = a;
            this._splash.background && this.addImage("_splash", this._splash.background);
            if (!gbox._splash.minimalTime) gbox._minimalexpired = 2;
            this._waitforloaded()
        },
        _implicitsargs: function(a) {
            a.camera && (a.dx -= this._camera.x, a.dy -= this._camera.y);
            if (a.sourcecamera) a.x = this._camera.x * (a.parallaxx ? a.parallaxx : 1), a.y = this._camera.y * (a.parallaxy ? a.parallaxy : 1)
        },
        blitTile: function(a, b) {
            if (a != null) {
                var c = this._tiles[b.tileset],
                    d = this.getImage(c.image);
                this._implicitsargs(b);
                a.save();
                a.globalAlpha = b.alpha ? b.alpha : 1;
                a.translate(b.fliph ? c.tilew : 0, b.flipv ? c.tileh : 0);
                a.scale(b.fliph ? -1 : 1, b.flipv ? -1 : 1);
                this._safedrawimage(a, d, c.gapx + c.tilew * (b.tile % c.tilerow), c.gapy + c.tileh * Math.floor(b.tile / c.tilerow), b.w == null ? c.tilew : b.w, b.h == null ? c.tileh : b.h, b.dx * (b.fliph ? -1 : 1), b.dy * (b.flipv ? -1 : 1), b.w ? b.w : c.tilew, b.h ? b.h : c.tileh);
                a.restore()
            }
        },
        blitAll: function(a, b, c) {
            if (a != null) this._implicitsargs(c), a.save(), a.globalAlpha = c.alpha ? c.alpha : 1, a.translate(c.fliph ? b.width : 0, c.flipv ? b.height : 0), a.scale(c.fliph ? -1 : 1, c.flipv ? -1 : 1), this._safedrawimage(a, b, 0, 0, b.width, b.height, c.dx * (c.fliph ? -1 : 1), c.dy * (c.flipv ? -1 : 1), b.width, b.height), a.restore()
        },
        blit: function(a, b, c) {
            if (a != null) this._implicitsargs(c), a.save(), a.globalAlpha = c.alpha ? c.alpha : 1, a.translate(c.fliph ? c.dw : 0, c.flipv ? c.dh : 0), a.scale(c.fliph ? -1 : 1, c.flipv ? -1 : 1), this._safedrawimage(a, b, c.x ? c.x : 0, c.y ? c.y : 0, c.w ? c.w : c.dw, c.h ? c.h : c.dh, c.dx * (c.fliph ? -1 : 1), c.dy * (c.flipv ? -1 : 1), c.dw, c.dh), a.restore()
        },
        blitSystemText: function(a, b) {
            if (a != null) a.save(), a.globalAlpha = b.alpha ? b.alpha : 1, a.fillStyle = b.color ? b.color : "0", a.font = b.font ? b.font : "normal 16px sans-serif", a.textAlign = b.align ? b.align : "left", a.textBaseline = b.baseline ? b.baseline : "top", iphone && (b.y -= 2), a.fillText(b.text, b.x, b.y), a.restore()
        },
        getTextWidth: function(a) {
            return this._screen.getContext("2d").measureText(a).width
        },
        blitPieChart: function(a, b) {
            if (a != null) a.save(), a.globalAlpha = 1, a.fillStyle = "#FF8000", a.beginPath(), a.arc(b.x, b.y, b.radius, 0, Math.PI * 2, !1), a.closePath(), a.fill(), a.fillStyle = "#00FFFF", a.beginPath(), a.arc(b.x, b.y, b.radius, Math.PI * 3 / 2, Math.PI * 3 / 2 + Math.PI * 2 * b.nValue / b.tValue, !1), a.lineTo(b.x, b.y), a.closePath(), a.fill(), a.restore()
        },
        blitClear: function(a, b) {
            a != null && (b == null && (b = {
                x: 0,
                y: 0
            }), this._implicitsargs(b), a.clearRect(b.x, b.y, b.w == null ? a.canvas.width : b.w, b.h == null ? a.canvas.height : b.h))
        },
        blitImageToScreen: function(a) {
            this._screen.getContext("2d").drawImage(a, 0, 0)
        },
        blitFade: function(a, b) {
            a && this.blitRect(a, {
                x: 0,
                y: 0,
                w: a.canvas.width,
                h: a.canvas.height,
                alpha: b.alpha,
                color: b.color
            })
        },
        blitRect: function(a, b) {
            if (a != null) a.save(), a.globalAlpha = b.globalAlpha ? b.globalAlpha : 1, a.fillStyle = b.color ? b.color : gbox.COLOR_BLACK, a.fillRect(b.x, b.y, b.w, b.h), a.restore()
        },
        collides: function(a, b, c) {
            c || (c = 0);
            return !(a.y + a.h - 1 - c < b.y + c || a.y + c > b.y + b.h - 1 - c || a.x + a.w - 1 - c < b.x + c || a.x + c > b.x + b.w - 1 - c)
        },
        pixelcollides: function(a, b, c) {
            c || (c = 0);
            return !(a.y < b.y + c || a.y > b.y + b.h - 1 - c || a.x < b.x + c || a.x > b.x + b.w - 1 - c)
        },
        objectIsVisible: function(a) {
            return this.collides(a, this._camera, 0)
        },
        setSplashSettings: function(a) {
            for (var b in a) this._splash[b] = a[b]
        },
        _xmlhttp: null,
        _loaderqueue: cyclelist.create(200),
        _loadercache: cachelist.create(200),
        _loaderimageloaded: function() {
            this.setAttribute("wasloaded", !0);
            this.hheight = Math.floor(this.height / 2);
            this.hwidth = Math.floor(this.width / 2);
            gbox._loaderloaded()
        },
        _loaderhmlhttploading: function() {
            var a = typeof this.status != "undefined" ? this.status : gbox._xmlhttp.status,
                b = typeof this.responseText != "undefined" ? this.responseText : gbox._xmlhttp.responseText;
            if ((typeof this.readyState != "undefined" ? this.readyState : gbox._xmlhttp.readyState) == 4 && (!a || a == 200) && b) gbox._loaderqueue.getCurrent().call.skipCacheSave || gbox._loadercache.add(gbox._loaderqueue.getCurrent().call.file, b), a = eval("(" + b + ")"), gbox.readBundleData(a, gbox._loaderqueue.getCurrent().call), gbox._loaderloaded()
        },
        _addtoloader: function(a) {
            gbox._loaderqueue.push(a);
            gbox._loaderqueue.isProcessing() || gbox._loadnext()
        },
        _loaderloaded: function() {
            setTimeout(gbox._loadnext, 100)
        },
        _loaderscript: function() {
            gbox._loaderqueue.getCurrent().call.onLoad && gbox._addtoloader({
                type: "exec-onl",
                func: gbox._loaderqueue.getCurrent().call.onLoad,
                call: gbox._loaderqueue.getCurrent().call
            });
            gbox._loadnext()
        },
        _loadnext: function() {
            var a = gbox._loaderqueue.pop();
            if (gbox._loaderqueue.isProcessing()) switch (gbox._loaderqueue.getCurrent().type) {
                case "image":
                    gbox._images[a.id] = new Image, curentImage = a.id, gbox._images[a.id].src = a.filename, gbox._images[a.id].setAttribute("name", a.filename), gbox.addEventListener(gbox._images[a.id], "load", gbox._loaderimageloaded), gbox._images[a.id].setAttribute("src_org", a.filename), gbox._images[a.id].setAttribute("id", a.id), gbox._images[a.id].setAttribute("wasloaded", !1)
            }
        },
        _waitforloaded: function() {
            if (gbox._loaderqueue.isBusy() || gbox._minimalexpired != 2) {
                var a = gbox._screen.getContext("2d");
                a.save();
                gbox.blitFade(a, {
                    alpha: 1
                });
                if (!gbox._minimalexpired && gbox._splashscreeniscompleted()) gbox._minimalexpired = 1, setTimeout(gbox._minimaltimeexpired, gbox._splash.minimalTime);
                gbox._splash.loading && gbox._splash.loading(a, gbox._loaderqueue.getDone(), gbox._loaderqueue.getTotal());
                switch (gbox._flags.loadscreen) {
                    case "c64":
                        for (var b = 0, c = 0; b != gbox.getScreenH();) c = 10 + Math.floor(Math.random() * gbox.getScreenH() / 4), b + c > gbox.getScreenH() && (c = gbox.getScreenH() - b), a.fillStyle = gbox.PALETTES.c64.colors[gbox.PALETTES.c64.order[Math.floor(Math.random() * gbox.PALETTES.c64.order.length)]], a.fillRect(0, b, gbox.getScreenW(), c), b += c;
                        a.fillStyle = gbox.PALETTES.c64.colors.lightblue;
                        a.fillRect(Math.floor(gbox.getScreenW() / 10), Math.floor(gbox.getScreenH() / 10), gbox.getScreenW() - Math.floor(gbox.getScreenW() / 5), gbox.getScreenH() - Math.floor(gbox.getScreenH() / 5));
                        gbox._splash.minilogo && gbox.imageIsLoaded("logo") && gbox.blit(a, gbox.getImage(gbox._splash.minilogo), {
                            w: gbox.getImage("logo").width,
                            h: gbox.getImage("logo").height,
                            dx: 0,
                            dy: 0,
                            dw: gbox.getImage("logo").width,
                            dh: gbox.getImage("logo").height
                        });
                        break;
                    default:
                        gbox._splash.background && gbox.imageIsLoaded("_splash") && gbox.blit(a, gbox.getImage("_splash"), {
                            w: gbox.getImage("_splash").width,
                            h: gbox.getImage("_splash").height,
                            dx: 0,
                            dy: 0,
                            dw: gbox.getScreenW(),
                            dh: gbox.getScreenH()
                        });
                        gbox._splash.minilogo && gbox.imageIsLoaded("logo") && (gbox.getScreenW(), gbox.getImage("logo"), gbox.getImage("logo"), gbox.blit(a, gbox.getImage(gbox._splash.minilogo), {
                            w: gbox.getImage("logo").width,
                            h: gbox.getImage("logo").height,
                            dx: 0,
                            dy: 0,
                            dw: gbox.getImage("logo").width,
                            dh: gbox.getImage("logo").height
                        }));
                        if (gbox._splash.footnotes && gbox.imageIsLoaded("_dbf")) {
                            if (!gbox.getCanvas("_footnotes")) {
                                b = gbox.getFont("_dbf");
                                gbox.createCanvas("_footnotes", {
                                    w: gbox.getScreenW() - 5,
                                    h: gbox._splash.footnotes.length * (b.tileh + gbox._splash.footnotesSpacing)
                                });
                                for (c = 0; c < gbox._splash.footnotes.length; c++) gbox.blitText(gbox.getCanvasContext("_footnotes"), {
                                    font: "_dbf",
                                    dx: 0,
                                    dy: c * (b.tileh + gbox._splash.footnotesSpacing),
                                    text: gbox._splash.footnotes[c]
                                })
                            }
                            gbox.blitAll(a, gbox.getCanvas("_footnotes"), {
                                dx: 5,
                                dy: gbox.getScreenH() - gbox.getCanvas("_footnotes").height - 5
                            })
                        }
                        gbox._loaderqueue.isBusy() && gbox.drawLoadingBar(a)
                }
                a.restore();
                gbox.setStatBar("Loading... (" + gbox._loaderqueue.getDone() + "/" + gbox._loaderqueue.getTotal() + ")");
                setTimeout(gbox._waitforloaded, 50)
            } else gbox.deleteImage("_splash"), gbox.setStatBar(), gbox._cb()
        },
        drawLoadingBar: function(a) {
            var b = Math.floor((gbox.getScreenW() - 84) * gbox._loaderqueue.getDone() / gbox._loaderqueue.getTotal());
            a.globalAlpha = 1;
            a.fillStyle = gbox._splash.gaugeBackColor;
            a.fillRect(40, Math.floor((gbox.getScreenH() - gbox._splash.gaugeHeight) / 2) + 90, gbox.getScreenW() - 80, gbox._splash.gaugeHeight + 5);
            a.fillStyle = gbox._splash.gaugeColor;
            a.fillRect(42, Math.floor((gbox.getScreenH() - gbox._splash.gaugeHeight) / 2 + 2) + 90, b > 0 ? b : 0, gbox._splash.gaugeHeight - 4 + 5);
            a.fillStyle = gbox._splash.gaugeColor;
            a.font = "normal 16px sans-serif";
            a.textAlign = "left";
            a.textBaseline = "top";
            a.fillText("loading...", 120, Math.floor((gbox.getScreenH() - gbox._splash.gaugeHeight) / 2 - 20 + 90));
            a.fillStyle = gbox._splash.gaugeColor;
            a.font = "normal 12px sans-serif";
            a.textAlign = "left";
            a.textBaseline = "top";
            a.fillText(curentImage, 0, 10)
        },
        clearCache: function() {
            this._loadercache.clear()
        },
        checkCanvasSupport: function() {
            return !!document.createElement("canvas").getContext
        },
        addEventListener: function(a, b, c) {
            a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c)
        },
        removeEventListener: function(a, b, c) {
            a.removeEventListener ? a.removeEventListener(b, c, !1) : a.detachEvent("on" + b, c)
        },
        XMLHttpFactories: [function() {
            return new XMLHttpRequest
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function() {
            return new ActiveXObject("Msxml3.XMLHTTP")
        }, function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }],
        createXmlHttpRequest: function() {
            var a = !1;
            if (!a) try {
                a = new XMLHttpRequest
            } catch (b) {
                a = !1
            }
            if (typeof ActiveXObject != "undefined") {
                if (!a) try {
                    a = new ActiveXObject("MSXML2.XMLHTTP")
                } catch (c) {
                    a = !1
                }
                if (!a) try {
                    a = new ActiveXObject("Microsoft.XMLHTTP")
                } catch (d) {
                    a = !1
                }
            }
            if (!a) try {
                a = createRequest()
            } catch (f) {
                a = !1
            }
            return a
        }
    },
    toys = {
        topview: {
            collides: function(a, b, c) {
                return Math.abs(a.z, b.z) < 5 ? gbox.collides({
                    x: a.x + a.colx,
                    y: a.y + a.coly,
                    h: a.colh,
                    w: a.colw
                }, {
                    x: b.x + b.colx,
                    y: b.y + b.coly,
                    h: b.colh,
                    w: b.colw
                }, c) : !1
            },
            pixelcollides: function(a, b, c) {
                return gbox.pixelcollides(a, {
                    x: b.x + b.colx,
                    y: b.y + b.coly,
                    h: b.colh,
                    w: b.colw
                }, c)
            },
            initialize: function(a, b) {
                help.mergeWithModel(a, help.mergeWithModel(b, {
                    x: 0,
                    y: 0,
                    z: 0,
                    accx: 0,
                    accy: 0,
                    accz: 0,
                    frames: {},
                    shadow: null,
                    maxacc: 4,
                    controlmaxacc: 4,
                    responsive: 0,
                    weapon: 0,
                    camera: !0,
                    flipv: !1,
                    fliph: !1,
                    facing: toys.FACE_DOWN,
                    flipside: !0,
                    haspushing: !1,
                    frame: 0,
                    colh: gbox.getTiles(a.tileset).tilehh,
                    colw: gbox.getTiles(a.tileset).tilew,
                    colx: 0,
                    staticspeed: 0,
                    nodiagonals: !1,
                    noreset: !1
                }));
                if (a.coly == null) a.coly = gbox.getTiles(a.tileset).tileh - a.colh;
                a.colhh = Math.floor(a.colh / 2);
                a.colhw = Math.floor(a.colw / 2);
                toys.topview.spawn(a)
            },
            spawn: function(a, b) {
                a.xpushing = toys.PUSH_NONE;
                a.vpushing = toys.PUSH_NONE;
                a.zpushing = toys.PUSH_NONE;
                a.counter = 0;
                a.hittimer = 0;
                a.killed = !1;
                help.copyModel(a, b);
                gbox.setZindex(a, a.y + a.h)
            }
        }
    },
    help = {
        searchObject: function(a, b, c) {
            if (a) for (; 0 < a.length; a++) if (a[0][b] == c) return a[0];
            return null
        },
        seq: function(a, b, c) {
            for (var d = []; a < b; a += c == null ? 1 : c) d.push(a);
            return d
        },
        multiplier: function(a, b) {
            return !a || a < 2 ? 1 : a * (!b ? 1 : b)
        },
        prepad: function(a, b, c) {
            for (a += ""; a.length < b;) a = c + a;
            return a
        },
        postpad: function(a, b, c) {
            for (a += ""; a.length < b;) a += c;
            return a
        },
        isSquished: function(a, b) {
            return b.accy > 0 && gbox.collides(a, b) && Math.abs(a.y - (b.y + b.h)) < a.h / 2
        },
        random: function(a, b) {
            return a + Math.floor(Math.random() * b)
        },
        decideFrame: function(a) {
            if ((new Date).getTime() - a.time > a.speed) a.cnt++, a.time = (new Date).getTime();
            return a.frames[Math.floor(a.cnt % a.frames.length)]
        },
        decideFrameOnce: function(a) {
            if ((new Date).getTime() - a.time > a.speed) a.cnt++, a.time = (new Date).getTime();
            return a.frames[a.cnt >= a.frames.length ? a.frames.length - 1 : a.cnt]
        },
        isLastFrameOnce: function(a, b) {
            return a >= b.frames.length * b.speed
        },
        upAndDown: function(a, b) {
            return a % b > b / 2 ? b - a % b : a % b
        },
        limit: function(a, b, c) {
            return a < b ? b : a > c ? c : a
        },
        goToZero: function(a) {
            return a ? a - a / Math.abs(a) : 0
        },
        mergeWithModel: function(a, b) {
            a == null && (a = {});
            if (b != null) for (var c in b) a[c] == null && (a[c] = b[c]);
            return a
        },
        copyModel: function(a, b) {
            a == null && (a = {});
            if (b != null) for (var c in b) a[c] = b[c];
            return a
        },
        createModel: function(a, b) {
            for (var c = {}, d = 0; d < b.length; d++) c[b[d]] = a[b[d]];
            return c
        },
        cloneObject: function(a) {
            if (!a) return a;
            var b = {},
                c;
            for (c in a) b[c] = a[c];
            return b
        },
        getArrayCapped: function(a, b) {
            return b >= a.length ? a[a.length - 1] : a[b]
        },
        getArrayIndexed: function(a, b, c) {
            if (a[0][c] == null) return a[0];
            for (var d = 0; b > a[d][c] && d != a.length - 1;) d++;
            return a[d]
        },
        framestotime: function(a) {
            a = Math.ceil(a / gbox.getFps() * 100);
            return this.prepad(Math.floor(a / 6E3) % 60, 2, "0") + ":" + this.prepad(Math.floor(a / 100) % 60, 2, "0") + ":" + this.prepad(a % 100, 2, "0")
        },
        geturlparameter: function(a) {
            a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            a = RegExp("[\\?&]" + a + "=([^&#]*)").exec(window.location.href);
            return a == null ? "" : a[1]
        },
        objToStr: function(a) {
            var b = "",
                c;
            for (c in a) b += c + ":[" + a[c] + "] ";
            return b
        },
        isDefined: function(a) {
            return typeof a !== "undefined" || a === null
        },
        getDeviceConfig: function() {
            return navigator.userAgent.match(/nintendo wii/i) ? {
                iswii: !0,
                height: window.innerHeight,
                doublebuffering: !0
            } : navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/Android/i) ? {
                touch: !0,
                width: 320
            } : navigator.userAgent.match(/iPad/i) ? {
                touch: !0,
                width: 768,
                forcedidle: 10
            } : {
                zoom: 2
            }
        },
        akihabaraInit: function(a) {
            (typeof a).toLowerCase() == "string" && (a = {
                title: a
            });
            var b = this.getDeviceConfig(),
                c = ["MADE WITH AKIHABARA (C)2010 - GPL2/MIT", "Project: www.kesiev.com/akihabara", "Sources: github.com/kesiev/akihabara"];
            document.title = a.title ? a.title : "Akihabara";
            if (a.splash) {
                if (a.splash.footnotes) for (var d = 0; d < c.length; d++) a.splash.footnotes.push(c[d]);
                gbox.setSplashSettings(a.splash)
            }
            c = a.width ? a.width : a.portrait ? 240 : 320;
            d = a.height ? a.height : a.portrait ? 320 : 240;
            if (b.iswii) gbox._keymap = {
                left: 175,
                right: 176,
                up: 177,
                down: 178,
                a: 173,
                b: 172,
                c: 13
            }, document.onkeypress = function(a) {
                a.preventDefault && a.preventDefault();
                return !1
            };
            (!a.splash || a.splash.minilogo == null) && gbox.setSplashSettings({
                minilogo: "logo"
            });
            if (!a || !a.hardwareonly) document.body.style.backgroundColor = "#000000", gbox.setScreenBorder(!1);
            help.geturlparameter("statusbar") && gbox.setStatusBar(1);
            (help.geturlparameter("db") || b.doublebuffering) && gbox.setDoubleBuffering(!0);
            help.geturlparameter("noautoskip") && gbox.setAutoskip(null);
            help.geturlparameter("zoom") ? gbox.setZoom(help.geturlparameter("zoom")) : help.isDefined(a.zoom) ? gbox.setZoom(a.zoom) : help.isDefined(b.zoom) ? gbox.setZoom(b.zoom) : help.isDefined(b.width) ? gbox.setZoom(b.width / c) : help.isDefined(b.height) && gbox.setZoom(b.height / d);
            help.geturlparameter("fps") ? gbox.setFps(help.geturlparameter("fps") * 1) : gbox.setFps(a.fps ? a.fps : 25);
            help.geturlparameter("fskip") && gbox.setFrameskip(help.geturlparameter("fskip"));
            help.geturlparameter("forcedidle") ? gbox.setForcedIdle(help.geturlparameter("forcedidle") * 1) : help.isDefined(b.forcedidle) && gbox.setForcedIdle(b.forcedidle);
            (!a || !a.hardwareonly) && gbox.initScreen(c, d);
            help.geturlparameter("showplayers") && gbox.setShowPlayers(help.geturlparameter("showplayers") == "yes");
            return b
        }
    },
    tool = {
        _images: [],
        _loadedflag: [],
        _data: {},
        _count: 0,
        _countloaded: 0,
        resolvePoly: function(a) {
            var b = [],
                c;
            for (c in a) c < a.length - 1 ? b.push([a[c], a[c + 1]]) : c == a.length - 1 && b.push([a[c], a[0]]);
            return b
        },
        pointInPoly: function(a, b) {
            cn = 0;
            pts = b.slice();
            pts.push([b[0][0], b[0][1]]);
            for (var c = 0; c < b.length; c++) if (pts[c][1] <= a[1] && pts[c + 1][1] > a[1] || pts[c][1] > a[1] && pts[c + 1][1] <= a[1]) a[0] < pts[c][0] + (a[1] - pts[c][1]) / (pts[c + 1][1] - pts[c][1]) * (pts[c + 1][0] - pts[c][0]) && (cn += 1);
            return cn % 2
        },
        _loaded: function(a) {
            this._loadedflag[a] = !0;
            tool._countloaded++;
            document.title = tool._countloaded + "/" + tool._count;
            for (a = 0; a < this._images.length; a++) this._loadedflag[a] || (document.title += this._images[a].src + ", ")
        },
        loadXmlFile: function(a) {
            var b = null;
            window.ActiveXObject ? (b = new ActiveXObject("Microsoft.XMLDOM"), b.load(a)) : document.implementation && document.implementation.createDocument ? (b = new window.XMLHttpRequest, b.open("GET", a, !1), b.send(null), b = b.responseXML) : b = null;
            return b
        },
        loadXMLDoc: function(a) {
            var b;
            try {
                b = new ActiveXObject("Microsoft.XMLDOM")
            } catch (c) {
                try {
                    var d = new XMLHttpRequest;
                    d.open("GET", a, !1);
                    d.send(null);
                    return d.responseXML
                } catch (f) {
                    try {
                        b = document.implementation.createDocument("", "", null)
                    } catch (e) {
                        alert(e.message)
                    }
                }
            }
            try {
                return b.async = !1, b.load(a), b
            } catch (g) {
                alert(g.message)
            }
            return null
        },
        _loadall: function() {
            tool._count != tool._countloaded ? setTimeout(tool._loadall, 1E3) : tool._allloaded()
        },
        makecels: function(a) {
            this._data = a;
            for (var b = 0, c = 0; c < a.rows.length; c++) for (var d = 0; d < a.rows[c].length; d++) this._images[b] = new Image, gbox.addEventListener(this._images[b], "load", function() {
                tool._loaded(this.id)
            }), this._images[b].setAttribute("id", b), this._images[b].src = a.rows[c][d].img, this._count++, b++;
            this._loadall()
        },
        _allloaded: function() {
            for (var a = this._data, b = 0, c = 0, d = 0, f = 0, e = 0; e < a.rows.length; e++) {
                c += this._images[f].height * 1;
                for (var g = d = 0; g < a.rows[e].length; g++) d += this._images[f].width * 1, f++;
                b < d && (b = d)
            }
            f = document.createElement("canvas");
            f.style.border = "1px solid red";
            f.setAttribute("height", c);
            f.setAttribute("width", b);
            document.body.appendChild(f);
            b = f.getContext("2d");
            for (e = f = d = c = 0; e < a.rows.length; e++) {
                for (g = c = 0; g < a.rows[e].length; g++) {
                    b.drawImage(this._images[f], c, d);
                    if (a.rows[e][g].filter && a.rows[e][g].filter) {
                        for (var j = b.getImageData(c, d, this._images[f].width, this._images[f].height), i = j.data, h = 0, l = i.length; h < l; h += 4) {
                            if (a.rows[e][g].filter.replace) for (var k = 0; k < a.rows[e][g].filter.replace.length; k++) if (repl = a.rows[e][g].filter.replace[k].from, to = a.rows[e][g].filter.replace[k].to, i[h] == repl.r && i[h + 1] == repl.g && i[h + 2] == repl.b && i[h + 3] == repl.a) i[h] = to.r, i[h + 1] = to.g, i[h + 2] = to.b, i[h + 3] = to.a;
                            if (a.rows[e][g].filter.color && i[h + 3] != 0) i[h] = a.rows[e][g].filter.color.r, i[h + 1] = a.rows[e][g].filter.color.g, i[h + 2] = a.rows[e][g].filter.color.b, i[h + 3] = a.rows[e][g].filter.color.a
                        }
                        b.putImageData(j, c, d)
                    }
                    c += this._images[f].width * 1;
                    f++
                }
                d += this._images[f - 1].height * 1
            }
        }
    };