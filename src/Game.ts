import $ from "jquery";
import _ from "lodash";
import { Assets } from "./Assets";
import { Skier } from "./Skier";

$(document).ready(async function() {

    const obstacleTypes = [
        "tree_1",
        "treeCluster",
        "rock_1",
        "rock_2"
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

    const skier = new Skier(ctx);

    const clearCanvas = function() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    const moveSkier = function() {
        skier.move();
        if (skier.direction === 2 || skier.direction === 3 || skier.direction === 4) {
            placeNewObstacle(skier.direction);
        }
    };

    const drawObstacles = function() {
        const newObstacles = [];

        _.each(obstacles, function(obstacle) {
            const obstacleImage = Assets.getImage(obstacle.type);
            const x = obstacle.x - skier.location.x - obstacleImage.width / 2;
            const y = obstacle.y - skier.location.y - obstacleImage.height / 2;

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
            const obstacleImage = Assets.getImage(obstacle.type);
            return obstacle.y + obstacleImage.height;
        });
    };

    const placeNewObstacle = function(direction) {
        const shouldPlaceObstacle = _.random(1, 8);
        if (shouldPlaceObstacle !== 8) {
            return;
        }

        const leftEdge = skier.location.x;
        const rightEdge = skier.location.x + gameWidth;
        const topEdge = skier.location.y;
        const bottomEdge = skier.location.y + gameHeight;

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
        const skierImage = Assets.getSkierImage(skier.direction);
        const skierRect = {
            left: skier.location.x + gameWidth / 2,
            right: skier.location.x + skierImage.width + gameWidth / 2,
            top: skier.location.y + skierImage.height - 5 + gameHeight / 2,
            bottom: skier.location.y + skierImage.height + gameHeight / 2
        };

        const collision = _.find(obstacles, function(obstacle) {
            const obstacleImage = Assets.getImage(obstacle.type);
            const obstacleRect = {
                left: obstacle.x,
                right: obstacle.x + obstacleImage.width,
                top: obstacle.y + obstacleImage.height - 5,
                bottom: obstacle.y + obstacleImage.height
            };

            return intersectRect(skierRect, obstacleRect);
        });

        if (collision) {
            skier.direction = 0;
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

        skier.drawSkier(gameWidth, gameHeight);

        drawObstacles();

        ctx.restore();

        requestAnimationFrame(gameLoop);
    };

    const setupKeyhandler = function() {
        $(window).keydown(function(event) {
            switch (event.which) {
                case 37: // left
                    if (skier.direction === 1) {
                        skier.location.x -= skier.speed;
                        placeNewObstacle(skier.direction);
                    }
                    else {
                        skier.direction--;
                    }
                    event.preventDefault();
                    break;
                case 39: // right
                    if (skier.direction === 5) {
                        skier.location.x += skier.speed;
                        placeNewObstacle(skier.direction);
                    }
                    else {
                        skier.direction++;
                    }
                    event.preventDefault();
                    break;
                case 38: // up
                    if (skier.direction === 1 || skier.direction === 5) {
                        skier.location.y -= skier.speed;
                        placeNewObstacle(6);
                    }
                    event.preventDefault();
                    break;
                case 40: // down
                    skier.direction = 3;
                    event.preventDefault();
                    break;
            }
        });
    };

    setupKeyhandler();
    await Assets.loadAssets();
    placeInitialObstacles();
    requestAnimationFrame(gameLoop);

});