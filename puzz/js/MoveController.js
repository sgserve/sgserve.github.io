var MoveController = function(nbOfTilesV, nbOfTilesH) {
    var self = this;
    self.nbOfTilesV = nbOfTilesV;
    self.nbOfTilesH = nbOfTilesH;

    self.moveIfPossible = function(tiles, clickedTileIndex, endAnimationCallback) {
        var possibleMove = self.possibleMove(tiles, clickedTileIndex);

        if (possibleMove != null) {
            tiles[clickedTileIndex].animateMove(possibleMove, function() {
                    self.switchImages(tiles, clickedTileIndex);
                    endAnimationCallback();
            });
        }
    };

    self.switchImages = function(tiles, clickedTileIndex) {

        var blankTileIndex = self.getBlankTileIndex(tiles);
        //console.log(clickedTileIndex,'=>',blankTileIndex); //移动的方向
        //console.log(wilddogioRef)
        var blankTile = tiles[blankTileIndex];
        var tmpClip = tiles[clickedTileIndex].clip;
        var tmpClipIndex = tiles[clickedTileIndex].clipIndex;

        tiles[clickedTileIndex].clip = blankTile.clip;
        tiles[clickedTileIndex].clipIndex = blankTile.clipIndex;
        tiles[clickedTileIndex].hidden = true;
        blankTile.clip = tmpClip;
        blankTile.clipIndex = tmpClipIndex;
        blankTile.hidden = false;

        tiles[clickedTileIndex].draw();
        blankTile.draw();
    };

    self.possibleMove = function(tiles, index) {
        var surroundingTiles = self.getSurroundingTiles(tiles, index);
        for (var i=0; i < surroundingTiles.length; i++) {
            if (surroundingTiles[i].hidden) {
                return self.getMoveDirection(tiles, index);
            }
        }

        return null;
    };

    self.getSurroundingTiles = function(tiles, index) {
        var surroundingTiles = [];
        var x = Math.floor(index / self.nbOfTilesV);
        var y = index % self.nbOfTilesV;

        if (x == 0) {
            if (y == 0) {
                surroundingTiles.push(tiles[index + 1]);
                surroundingTiles.push(tiles[index + self.nbOfTilesV]);
            } else if (y == self.nbOfTilesV - 1) {
                surroundingTiles.push(tiles[index - 1]);
                surroundingTiles.push(tiles[index + self.nbOfTilesV]);
            } else {
                surroundingTiles.push(tiles[index - 1]);
                surroundingTiles.push(tiles[index + 1]);
                surroundingTiles.push(tiles[index + self.nbOfTilesV]);
            }
        } else if (x == self.nbOfTilesH - 1) {
            if (y == 0) {
                surroundingTiles.push(tiles[index + 1]);
                surroundingTiles.push(tiles[index - self.nbOfTilesV]);
            } else if (y == self.nbOfTilesV - 1) {
                surroundingTiles.push(tiles[index - 1]);
                surroundingTiles.push(tiles[index - self.nbOfTilesV]);
            } else {
                surroundingTiles.push(tiles[index + 1]);
                surroundingTiles.push(tiles[index - 1]);
                surroundingTiles.push(tiles[index - self.nbOfTilesV]);
            }
        } else if (y == 0) {
            surroundingTiles.push(tiles[index - self.nbOfTilesV]);
            surroundingTiles.push(tiles[index + self.nbOfTilesV]);
            surroundingTiles.push(tiles[index + 1]);
        } else if (y == self.nbOfTilesV - 1) {
            surroundingTiles.push(tiles[index - self.nbOfTilesV]);
            surroundingTiles.push(tiles[index + self.nbOfTilesV]);
            surroundingTiles.push(tiles[index - 1]);
        } else {
            surroundingTiles.push(tiles[index + 1]);
            surroundingTiles.push(tiles[index - 1]);
            surroundingTiles.push(tiles[index + self.nbOfTilesV]);
            surroundingTiles.push(tiles[index - self.nbOfTilesV]);
        }

        return surroundingTiles;
    };

    self.getMoveDirection = function(tiles, clickedTileIndex) {
        var blankTileIndex = self.getBlankTileIndex(tiles);
        var x = Math.floor(clickedTileIndex / self.nbOfTilesV);
        var y = clickedTileIndex % self.nbOfTilesV;
        var xblank = Math.floor(blankTileIndex / self.nbOfTilesV);
        var yblank = blankTileIndex % self.nbOfTilesV;

        if (x != xblank) {
            if (x < xblank) {
                return Directions.DOWN;
            } else {
                return Directions.UP;
            }
        } else {
            if (y < yblank) {
                return Directions.RIGHT;
            } else {
                return Directions.LEFT;
            }
        }
    };

    self.getBlankTileIndex = function(tiles) {
        var blankTileIndex = -1;

        for (var i=0; i < tiles.length; i++) {
            if (tiles[i].hidden) {
                blankTileIndex = i;
                break;
            }
        }

        return blankTileIndex;
    };

};
