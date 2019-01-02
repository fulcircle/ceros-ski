import $ from "jquery";
import _ from "lodash";

$(document).ready(function() {

    const assets = {
        "skierCrash" : "/public/images/skier_crash.png",
        "skierLeft" : "/public/images/skier_left.png",
        "skierLeftDown" : "/public/images/skier_left_down.png",
        "skierDown" : "/public/images/skier_down.png",
        "skierRightDown" : "/public/images/skier_right_down.png",
        "skierRight" : "/public/images/skier_right.png",
        "tree" : "/public/images/tree_1.png",
        "treeCluster" : "/public/images/tree_cluster.png",
        "rock1" : "/public/images/rock_1.png",
        "rock2" : "/public/images/rock_2.png"
    };
    const loadedAssets = {};

    const obstacleTypes = [
        "tree",
        "treeCluster",
        "rock1",
        "rock2"
    ];

    let obstacles = [];

    const gameWidth = window.innerWidth;
    const gameHeight = window.innerHeight;
    const canvas: any = $("<canvas></canvas>")
        .attr("width", gameWidth * window.devicePixelRatio)
        .attr("height", gameHeight * window.devicePixelRatio)
        .css({
            width: gameWidth + "px",
            height: gameHeight + "px"
        });
    $("body").append(canvas);
    const ctx = canvas[0].getContext("2d");

    let skierDirection = 5;
    let skierMapX = 0;
    let skierMapY = 0;
    const skierSpeed = 8;

    const clearCanvas = function() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    const moveSkier = function() {
        switch (skierDirection) {
            case 2:
                skierMapX -= Math.round(skierSpeed / 1.4142);
                skierMapY += Math.round(skierSpeed / 1.4142);

                placeNewObstacle(skierDirection);
                break;
            case 3:
                skierMapY += skierSpeed;

                placeNewObstacle(skierDirection);
                break;
            case 4:
                skierMapX += skierSpeed / 1.4142;
                skierMapY += skierSpeed / 1.4142;

                placeNewObstacle(skierDirection);
                break;
        }
    };

    const getSkierAsset = function() {
        let skierAssetName;
        switch (skierDirection) {
            case 0:
                skierAssetName = "skierCrash";
                break;
            case 1:
                skierAssetName = "skierLeft";
                break;
            case 2:
                skierAssetName = "skierLeftDown";
                break;
            case 3:
                skierAssetName = "skierDown";
                break;
            case 4:
                skierAssetName = "skierRightDown";
                break;
            case 5:
                skierAssetName = "skierRight";
                break;
        }

        return skierAssetName;
    };

    const drawSkier = function() {
        const skierAssetName = getSkierAsset();
        const skierImage = loadedAssets[skierAssetName];
        const x = (gameWidth - skierImage.width) / 2;
        const y = (gameHeight - skierImage.height) / 2;

        ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
    };

    const drawObstacles = function() {
        const newObstacles = [];

        _.each(obstacles, function(obstacle) {
            const obstacleImage = loadedAssets[obstacle.type];
            const x = obstacle.x - skierMapX - obstacleImage.width / 2;
            const y = obstacle.y - skierMapY - obstacleImage.height / 2;

            if (x < -100 || x > gameWidth + 50 || y < -100 || y > gameHeight + 50) {
                return;
            }

            ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

            newObstacles.push(obstacle);
        });

        obstacles = newObstacles;
    };

    const placeInitialObstacles = function() {
        const numberObstacles = Math.ceil(_.random(5, 7) * (gameWidth / 800) * (gameHeight / 500));

        const minX = -50;
        const maxX = gameWidth + 50;
        const minY = gameHeight / 2 + 100;
        const maxY = gameHeight + 50;

        for (let i = 0; i < numberObstacles; i++) {
            placeRandomObstacle(minX, maxX, minY, maxY);
        }

        obstacles = _.sortBy(obstacles, function(obstacle) {
            const obstacleImage = loadedAssets[obstacle.type];
            return obstacle.y + obstacleImage.height;
        });
    };

    const placeNewObstacle = function(direction) {
        const shouldPlaceObstacle = _.random(1, 8);
        if (shouldPlaceObstacle !== 8) {
            return;
        }

        const leftEdge = skierMapX;
        const rightEdge = skierMapX + gameWidth;
        const topEdge = skierMapY;
        const bottomEdge = skierMapY + gameHeight;

        switch (direction) {
            case 1: // left
                placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    };

    const placeRandomObstacle = function(minX, maxX, minY, maxY) {
        const obstacleIndex = _.random(0, obstacleTypes.length - 1);

        const position = calculateOpenPosition(minX, maxX, minY, maxY);

        obstacles.push({
            type : obstacleTypes[obstacleIndex],
            x : position.x,
            y : position.y
        });
    };

    const calculateOpenPosition = function(minX, maxX, minY, maxY) {
        const x = _.random(minX, maxX);
        const y = _.random(minY, maxY);

        const foundCollision = _.find(obstacles, function(obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if (foundCollision) {
            return calculateOpenPosition(minX, maxX, minY, maxY);
        }
        else {
            return {
                x: x,
                y: y
            };
        }
    };

    const checkIfSkierHitObstacle = function() {
        const skierAssetName = getSkierAsset();
        const skierImage = loadedAssets[skierAssetName];
        const skierRect = {
            left: skierMapX + gameWidth / 2,
            right: skierMapX + skierImage.width + gameWidth / 2,
            top: skierMapY + skierImage.height - 5 + gameHeight / 2,
            bottom: skierMapY + skierImage.height + gameHeight / 2
        };

        const collision = _.find(obstacles, function(obstacle) {
            const obstacleImage = loadedAssets[obstacle.type];
            const obstacleRect = {
                left: obstacle.x,
                right: obstacle.x + obstacleImage.width,
                top: obstacle.y + obstacleImage.height - 5,
                bottom: obstacle.y + obstacleImage.height
            };

            return intersectRect(skierRect, obstacleRect);
        });

        if (collision) {
            skierDirection = 0;
        }
    };

    const intersectRect = function(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };

    const gameLoop = function() {

        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        clearCanvas();

        moveSkier();

        checkIfSkierHitObstacle();

        drawSkier();

        drawObstacles();

        ctx.restore();

        requestAnimationFrame(gameLoop);
    };

    const loadAssets = function() {
        const assetPromises = [];

        _.each(assets, function(asset, assetName) {
            const assetImage = new Image();
            const assetDeferred = $.Deferred();

            assetImage.onload = function() {
                assetImage.width /= 2;
                assetImage.height /= 2;

                loadedAssets[assetName] = assetImage;
                assetDeferred.resolve();
            };
            assetImage.src = asset;

            assetPromises.push(assetDeferred.promise());
        });

        return $.when.apply($, assetPromises);
    };

    const setupKeyhandler = function() {
        $(window).keydown(function(event) {
            switch (event.which) {
                case 37: // left
                    if (skierDirection === 1) {
                        skierMapX -= skierSpeed;
                        placeNewObstacle(skierDirection);
                    }
                    else {
                        skierDirection--;
                    }
                    event.preventDefault();
                    break;
                case 39: // right
                    if (skierDirection === 5) {
                        skierMapX += skierSpeed;
                        placeNewObstacle(skierDirection);
                    }
                    else {
                        skierDirection++;
                    }
                    event.preventDefault();
                    break;
                case 38: // up
                    if (skierDirection === 1 || skierDirection === 5) {
                        skierMapY -= skierSpeed;
                        placeNewObstacle(6);
                    }
                    event.preventDefault();
                    break;
                case 40: // down
                    skierDirection = 3;
                    event.preventDefault();
                    break;
            }
        });
    };

    const initGame = (gameLoop: any) => {
        setupKeyhandler();
        loadAssets().then(function() {
            placeInitialObstacles();

            requestAnimationFrame(gameLoop);
        });
    };

    initGame(gameLoop);
});