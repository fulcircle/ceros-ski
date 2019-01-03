import { Assets } from "./Assets";
import { Skier } from "./Skier";
import { Util } from "./Util";
import _ from "lodash";
import { Dimensions } from "./Game";

const OBSTACLE_TYPES = [
    "tree_1",
    "treeCluster",
    "rock_1",
    "rock_2"
];


export class Obstacles {

    private _ctx: CanvasRenderingContext2D;
    private _skier: Skier;

    obstacles = [];
    gameDimensions: Dimensions;


    constructor(ctx: CanvasRenderingContext2D, skier: Skier, gameDimensions: Dimensions) {
        this._ctx = ctx;
        this._skier = skier;
        this.gameDimensions = gameDimensions;
    }

    drawObstacles() {

        const newObstacles = [];

        this.obstacles.forEach((obstacle) => {
            const obstacleImage = Assets.getImage(obstacle.type);
            const x = obstacle.x - this._skier.location.x - obstacleImage.width / 2;
            const y = obstacle.y - this._skier.location.y - obstacleImage.height / 2;

            if (x < -100 || x > this.gameDimensions.width + 50 || y < -100 || y > this.gameDimensions.height + 50) {
                return;
            }

            this._ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

            newObstacles.push(obstacle);
        });

        this.obstacles = newObstacles;
    }

    placeInitialObstacles() {
        const numberObstacles = Math.ceil(_.random(5, 7) * (this.gameDimensions.width / 800) * (this.gameDimensions.height / 500));

        const minX = -50;
        const maxX = this.gameDimensions.width + 50;
        const minY = this.gameDimensions.height / 2 + 100;
        const maxY = this.gameDimensions.height + 50;

        for (let i = 0; i < numberObstacles; i++) {
            this.placeRandomObstacle(minX, maxX, minY, maxY);
        }

        this.obstacles = _.sortBy(this.obstacles, function (obstacle) {
            const obstacleImage = Assets.getImage(obstacle.type);
            return obstacle.y + obstacleImage.height;
        });
    }

    placeNewObstacle(direction) {
        const shouldPlaceObstacle = _.random(1, 8);
        if (shouldPlaceObstacle !== 8) {
            return;
        }

        const leftEdge = this._skier.location.x;
        const rightEdge = this._skier.location.x + this.gameDimensions.width;
        const topEdge = this._skier.location.y;
        const bottomEdge = this._skier.location.y + this.gameDimensions.height;

        switch (direction) {
            case 1: // left
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    }

    placeRandomObstacle(minX, maxX, minY, maxY) {
        const obstacleIndex = _.random(0, OBSTACLE_TYPES.length - 1);

        const position = this.calculateOpenPosition(minX, maxX, minY, maxY);

        this.obstacles.push({
            type: OBSTACLE_TYPES[obstacleIndex],
            x: position.x,
            y: position.y
        });
    }

    calculateOpenPosition(minX, maxX, minY, maxY) {
        const x = _.random(minX, maxX);
        const y = _.random(minY, maxY);

        const foundCollision = _.find(this.obstacles, (obstacle) => {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if (foundCollision) {
            return this.calculateOpenPosition(minX, maxX, minY, maxY);
        } else {
            return {
                x: x,
                y: y
            };
        }
    }

    checkIfSkierHitObstacle() {
        if (this._skier.jumping) {
            return false;
        }

        const skierImage = Assets.getSkierImage(this._skier.direction);
        const skierRect = {
            left: this._skier.location.x + this.gameDimensions.width / 2,
            right: this._skier.location.x + skierImage.width + this.gameDimensions.width / 2,
            top: this._skier.location.y + skierImage.height - 5 + this.gameDimensions.height / 2,
            bottom: this._skier.location.y + skierImage.height + this.gameDimensions.height / 2
        };

        const collision = _.find(this.obstacles, function (obstacle) {
            const obstacleImage = Assets.getImage(obstacle.type);
            const obstacleRect = {
                left: obstacle.x,
                right: obstacle.x + obstacleImage.width,
                top: obstacle.y + obstacleImage.height - 5,
                bottom: obstacle.y + obstacleImage.height
            };

            return Util.intersectRect(skierRect, obstacleRect);
        });

        if (collision) {
            this._skier.direction = 0;
        }
    }
}
