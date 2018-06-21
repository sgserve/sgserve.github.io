var ImageSliderGame = function(imgSrc, nbOfTilesV, nbOfTilesH) {
    var self = this;
    self.imgSrc = imgSrc;
    self.nbOfTilesV = nbOfTilesV;
    self.nbOfTilesH = nbOfTilesH;
    self.tiles = [];
    self.canvas = document.querySelector('canvas');
    self.ctx = self.canvas.getContext('2d');
    self.img = new Image();
    self.tilesSize = null;
    self.moveController = new MoveController(self.nbOfTilesV, self.nbOfTilesH);
    //self.menu = new Menu();
    self.maxWidth = parseInt(window.getComputedStyle(document.querySelector('body')).maxWidth);
    self.bgImg = new Image();
    self.bgImgSrc = 'im/2.jpg';
    self.video = document.querySelector('video');
    self.localMediaStream = null;
    self.drawCameraImageInterval = null;
    self.showingCamera = false;
    self.cameraCanvas = null;

    self.setUp = function() {
        self.resizeCanvas();
        self.loadGameImages();

    };

    self.setUpNavigator = function() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia;
    };

    self.resize = function() {
        self.resizeCanvas();
        self.updateTiles();
    };

    self.resizeCanvas = function() {
        if (window.innerWidth < self.maxWidth) {
            self.canvas.width = window.innerWidth;
        } else {
            self.canvas.width = self.maxWidth;
        }

        self.canvas.height = window.innerHeight   ;//可以减去预留边界大小  -120

    };

    self.loadGameImages = function() {
        self.img.src = self.imgSrc;
        self.img.onload = function() {
            document.querySelector('.hamburger').click()
            audio.load(function(){//开场
                document.querySelector('.overlay--loader').classList.remove('overlay--active');
                audio.fadeOut('bgm');
    			audio.play('bgm', 700);
    			audio.loop('bgm');
    			audio.fadeIn('bgm', 700);
            });
            document.querySelector('.hamburger').addEventListener('click', function(){
                audio.play('jump');
            });
            self.imgLoaded(self.img);
        };
    };

    self.imgLoaded = function(img) {
        img.loaded = true;
        self.startGame();
    };

    self.startGame = function() {
        if (self.img.loaded ) {
            self.setUpTiles();
            self.updateTiles();
            self.canvas.addEventListener('mousedown', self.onCanvasMouseDown);
            self.canvas.addEventListener('touchstart', self.onCanvasMouseDown);
            document.querySelector('#restartButton').addEventListener('click', self.restart);
            document.querySelector('#loadgame').addEventListener('click', self.loadGame);

            //self.setUpMenu();
        }
    };

    self.setUpMenu = function() {
        self.menu.setUp();
        self.menu.decNbOfTilesVButton.addEventListener('click', self.decNbOfTilesV);
        self.menu.setNbOfTilesVText(self.nbOfTilesV);
        self.menu.incNbOfTilesVButton.addEventListener('click', self.incNbOfTilesV);
        self.menu.decNbOfTilesHButton.addEventListener('click', self.decNbOfTilesH);
        self.menu.setNbOfTilesHText(self.nbOfTilesH);
        self.menu.incNbOfTilesHButton.addEventListener('click', self.incNbOfTilesH);
        self.menu.restartButton.addEventListener('click', self.restart);
        self.menu.loadImageButton.addEventListener('click', self.loadImageFile);
        self.menu.photoButton.addEventListener('click', self.showCamera);
        self.menu.solveButton.addEventListener('click', self.solve);
    };

    self.decNbOfTilesV = function() {
        if ((self.nbOfTilesV - 1) > 2) {
            self.nbOfTilesV--;
            self.menu.setNbOfTilesVText(self.nbOfTilesV);
            self.restart();
        }
    };

    self.incNbOfTilesV = function() {
        self.nbOfTilesV++;
        self.menu.setNbOfTilesVText(self.nbOfTilesV);
        self.restart();
    };

    self.decNbOfTilesH = function() {
        if ((self.nbOfTilesH - 1) > 2) {
            self.nbOfTilesH--;
            self.menu.setNbOfTilesHText(self.nbOfTilesH);
            self.restart();
        }
    };

    self.incNbOfTilesH = function() {
        self.nbOfTilesH++;
        self.menu.setNbOfTilesHText(self.nbOfTilesH);
        self.restart();
    };

    self.showCamera = function() {
        self.menu.photoButton.removeEventListener('click', self.showCamera);
        self.menu.showText('Loading camera...');

        navigator.getUserMedia({video: true}, function(stream) {
            self.video.src = window.URL.createObjectURL(stream);
            self.localMediaStream = stream;
            self.video.addEventListener('playing', self.drawCameraImage);
        }, function() {
            self.menu.showText('Error while loading camera');
            self.menu.photoButton.addEventListener('click', self.showCamera);
        });
    };

    self.drawCameraImage = function() {
        self.video.removeEventListener('playing', self.drawCameraImage);
        self.menu.showText('Click on video to take a picture!');
        self.cameraCanvas = document.createElement('canvas');
        self.cameraCanvas.setAttribute('id', 'cameraCanvas');
        self.canvas.removeEventListener('mousedown', self.onCanvasMouseDown);
        self.canvas.removeEventListener('touchstart', self.onCanvasMouseDown);
        document.querySelector('body').appendChild(self.cameraCanvas);
        var cameraCtx = self.cameraCanvas.getContext('2d');
        self.cameraCanvas.width = self.canvas.width;
        self.cameraCanvas.height = self.canvas.height;
        self.showingCamera = true;

        self.ctx.fillStyle = self.ctx.createPattern(self.bgImg, 'repeat');
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

        for (var i=0; i < self.tiles.length; i++) {
            self.tiles[i].clear();
        }

        self.drawCameraImageInterval = setInterval(function() {
            try {
                cameraCtx.drawImage(self.video, 0, 0, self.cameraCanvas.width, self.cameraCanvas.height);
            } catch (e) {
                return;
            }
            self.canvas.addEventListener('click', self.takePicture);
        }, 100);
    };

    self.takePicture = function() {
        clearInterval(self.drawCameraImageInterval);
        self.menu.hideText();
        self.canvas.removeEventListener('click', self.takePicture);
        self.canvas.addEventListener('mousedown', self.onCanvasMouseDown);
        self.canvas.addEventListener('touchstart', self.onCanvasMouseDown);
        self.menu.photoButton.addEventListener('click', self.showCamera);
        self.img = new Image();
        self.img.onload = self.restart;
        self.img.src = self.cameraCanvas.toDataURL();
        self.video.pause();
        self.localMediaStream.stop();
        self.localMediaStream = null;
        document.querySelector('body').removeChild(self.cameraCanvas);
        self.cameraCanvas = null;
        self.showingCamera = false;
    };
    //重新玩
    self.restart = function() {
        //self.menu.hideText();
        self.tiles = [];
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.moveController = new MoveController(self.nbOfTilesV, self.nbOfTilesH);
        self.setUpTiles();
        self.updateTiles();
        //
        document.querySelector('.hamburger').click()
    };
    //载入存档游戏
    self.loadGame = function() {

        wilddogioRef.child(namespace).child('game').child('save').once('value',function(snapshot){
            console.log( '载入存档 -------',snapshot.val() );
            self.tiles = [];
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.moveController = new MoveController(self.nbOfTilesV, self.nbOfTilesH);
            self.setUpTiles(snapshot.val());
            self.updateTiles();
            document.querySelector('.hamburger').click()
        })
    };
    self.loadImageFile = function() {
        self.menu.fileInput.addEventListener('change', self.onImageSelect);
        self.menu.fileInput.click();
    };

    self.onImageSelect = function() {
        self.menu.fileInput.removeEventListener('change', self.onImageChange);
        var fr = new FileReader();
        fr.onload = function() {
            self.img = new Image();
            self.img.onload = self.restart;
            self.img.src = fr.result;
        };
        fr.readAsDataURL(self.menu.fileInput.files[0]);
    };

    self.setUpTiles = function(mix) {
        var nbOfTiles = self.nbOfTilesV * self.nbOfTilesH;
        if( !mix ){
            mix = new Shuffler().mix(self.nbOfTilesV, self.nbOfTilesH);
            // var game = {
            //     'save':mix
            // }
            // console.log( '初始化游戏存档 --- ',mix )
            // wilddogioRef.child("wanghaiquan").child('game').set(game);
        }
        for (var i=0; i < nbOfTiles; i++) {
            var tile = new Tile(self.ctx, self.img, mix[i]);
            if (mix[i] == nbOfTiles - 1) {
                tile.setHidden(true);
            }
            self.tiles.push(tile);
        }
    };

    self.updateTiles = function() {


        if (self.showingCamera) {
            self.ctx.fillStyle = self.ctx.createPattern(self.bgImg, 'repeat');
            self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
        }

        var gameIsOver = true;

        for (var i=0; i < self.tiles.length; i++) {
            var clipIndex = self.tiles[i].clipIndex;

            if (clipIndex != i) {
                gameIsOver = false;
            }

            var newSize = new Size(
                    Math.floor(self.canvas.width / self.nbOfTilesV),
                    Math.floor(self.canvas.height / self.nbOfTilesH)
            );
            var newPos = new Position(
                    (i % self.nbOfTilesV) * newSize.width,
                    Math.floor(i / self.nbOfTilesV) * newSize.height
            );
            var newClipSize = new Size(
                    Math.floor(self.img.width / self.nbOfTilesV),
                    Math.floor(self.img.height / self.nbOfTilesH)
            );
            var newClipPos = new Position(
                    (clipIndex % self.nbOfTilesV) * newClipSize.width,
                    Math.floor(clipIndex / self.nbOfTilesV) * newClipSize.height
            );
            self.tilesSize = newSize;
            self.tiles[i].setPos(newPos);
            self.tiles[i].setSize(newSize);
            self.tiles[i].setClip(new Clip(newClipPos, newClipSize));
            if (self.showingCamera) {
                self.tiles[i].clear();
            } else {
                self.tiles[i].draw();

            }
        }


        //console.log(self.tiles)
        if (gameIsOver) {
            //self.menu.showText('Well done!');
            // wilddogioRef.child("wanghaiquan").child('game').update(
            //     {'ending':'done'}
            // );
            audio.play('win');
            for (var i=0; i < self.tiles.length; i++) {
                if (self.tiles[i].hidden) {
                    self.tiles[i].hidden = false;
                }
                self.tiles[i].padding = 0;
                self.tiles[i].draw();
            }

        }
    };

    self.onCanvasMouseDown = function(event) {

        var originalMousePos = self.getMousePos(event);

        if (originalMousePos == null) {
            return;
        }

        var clickedTileIndex = self.getTileIndex(originalMousePos);


        var originalPos = new Position(self.tiles[clickedTileIndex].pos.x, self.tiles[clickedTileIndex].pos.y);
        var direction = self.moveController.possibleMove(self.tiles, clickedTileIndex);
        if (direction == null) {
            return;
        }

        self.onCanvasMouseMove = function(event) {
            var mousePos = self.getMousePos(event);

            if (mousePos == null) {
                return;
            }

            self.tiles[clickedTileIndex].move(originalPos, mousePos, originalMousePos, direction);
            self.tiles[clickedTileIndex].draw();
        };

        self.onCanvasMouseUp = function(event) {

            document.querySelector('html').removeEventListener('mouseup', self.onCanvasMouseUp);
            document.querySelector('html').removeEventListener('mouseout', self.onCanvasMouseUp);
            document.querySelector('html').removeEventListener('touchend', self.onCanvasMouseUp);
            self.canvas.removeEventListener('mousemove', self.onCanvasMouseMove);
            self.canvas.removeEventListener('touchmove', self.onCanvasMouseMove);
            self.moveController.moveIfPossible(self.tiles, clickedTileIndex, self.endAnimation);
        };

        self.canvas.addEventListener('mousemove', self.onCanvasMouseMove);
        self.canvas.addEventListener('touchmove', self.onCanvasMouseMove);
        document.querySelector('html').addEventListener('mouseup', self.onCanvasMouseUp);
        document.querySelector('html').addEventListener('mouseout', self.onCanvasMouseUp);
        document.querySelector('html').addEventListener('touchend', self.onCanvasMouseUp);
        self.canvas.removeEventListener('mousedown', self.onCanvasMouseDown);
        self.canvas.removeEventListener('touchstart', self.onCanvasMouseDown);
    };

    self.endAnimation = function() {
        self.updateTiles();

        self.canvas.addEventListener('mousedown', self.onCanvasMouseDown);
        self.canvas.addEventListener('touchstart', self.onCanvasMouseDown);
        //hack 增加一个移动记录
        var save = []
        for (var i=0; i < self.tiles.length; i++) {
                save.push(self.tiles[i].clipIndex)
        }
        audio.play('blup');
        wilddogioRef.child(namespace).child('game').update({ save} );
        console.log( '数据移动存档'  , save );
    };

    self.getTileIndex = function(pos) {
        var x = Math.floor(pos.x / self.tilesSize.width);
        var y = Math.floor(pos.y / self.tilesSize.height);
        return x + y * self.nbOfTilesV;
    };

    self.getMousePos = function(event) {
        if (event.type == 'mousedown' || event.type == 'mousemove') {
            return new Position(event.clientX - self.canvas.offsetLeft, event.clientY - self.canvas.offsetTop);
        } else if (event.type == 'touchstart' || event.type == 'touchmove') {
            event.preventDefault();

            if (event.targetTouches.length == 1) {
                return new Position(
                        event.targetTouches[0].pageX - self.canvas.offsetLeft,
                        event.targetTouches[0].pageY - self.canvas.offsetTop
                );
            } else {
                return null;
            }
        }
    };

    self.solve = function() {
        self.canvas.removeEventListener('mousedown', self.onCanvasMouseDown);
        self.canvas.removeEventListener('touchstart', self.onCanvasMouseDown);
        // self.menu.decNbOfTilesVButton.removeEventListener('click', self.decNbOfTilesV);
        // self.menu.incNbOfTilesVButton.removeEventListener('click', self.incNbOfTilesV);
        // self.menu.decNbOfTilesHButton.removeEventListener('click', self.decNbOfTilesH);
        // self.menu.incNbOfTilesHButton.removeEventListener('click', self.incNbOfTilesH);
        // self.menu.restartButton.removeEventListener('click', self.restart);
        // self.menu.loadImageButton.removeEventListener('click', self.loadImageFile);
        // self.menu.photoButton.removeEventListener('click', self.showCamera);
        // self.menu.solveButton.removeEventListener('click', self.solve);
        // self.menu.showText('Solving puzzle...');

        var solution = new Solver(self.tiles, self.nbOfTilesV, self.nbOfTilesH).solve();

        try {
            self.solveAnimationStep(solution, 0, self.updateTiles, self.endSolveAnimation);
        } catch (e) {
            self.endSolveAnimation();
        }
    };

    self.solveAnimationStep = function(solution, index, endOfMoveCallback, endOfAnimationCallback) {
        if (index < solution.length) {
            self.moveController = new MoveController(self.nbOfTilesV, self.nbOfTilesH);
            self.moveController.moveIfPossible(self.tiles, solution[index], function() {
                endOfMoveCallback();
                setTimeout(function() {
                    self.solveAnimationStep(solution, index + 1, endOfMoveCallback, endOfAnimationCallback);
                }, 100);
            });
        } else {
            endOfAnimationCallback();
        }
    };

    self.endSolveAnimation = function() {
        self.updateTiles();
        self.canvas.addEventListener('mousedown', self.onCanvasMouseDown);
        self.canvas.addEventListener('touchstart', self.onCanvasMouseDown);
        // self.menu.decNbOfTilesVButton.addEventListener('click', self.decNbOfTilesV);
        // self.menu.incNbOfTilesVButton.addEventListener('click', self.incNbOfTilesV);
        // self.menu.decNbOfTilesHButton.addEventListener('click', self.decNbOfTilesH);
        // self.menu.incNbOfTilesHButton.addEventListener('click', self.incNbOfTilesH);
        // self.menu.restartButton.addEventListener('click', self.restart);
        // self.menu.loadImageButton.addEventListener('click', self.loadImageFile);
        // self.menu.photoButton.addEventListener('click', self.showCamera);
        // self.menu.solveButton.addEventListener('click', self.solve);
    };

};
