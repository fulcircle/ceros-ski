import $ from "jquery";
import _ from "lodash";
import { Assets } from "./Assets";
import { Skier } from "./Skier";
import { Obstacles } from "./Obstacles";

export interface Dimensions {
    width: number;
    height: number;
}

class Game {

    window: Window = window;
    canvas = $("<canvas><canvas>");
    body = $("body");
    ctx: CanvasRenderingContext2D;
    skier: Skier;
    obstacles: Obstacles;

    dimensions: Dimensions = {
        width: this.window.innerWidth,
        height: this.window.innerHeight
    };

    async initGame() {
        this.canvas
            .attr("width", this.dimensions.width * this.window.devicePixelRatio)
            .attr("height", this.dimensions.height * this.window.devicePixelRatio)
            .css({
                width: this.dimensions.width + "px",
                height: this.dimensions.height + "px"
            });

        this.body.append(this.canvas);
        this.ctx = (<HTMLCanvasElement>this.canvas[0]).getContext("2d");

        await Assets.loadAssets();

        this.skier = new Skier(this.ctx, this.dimensions);

        this.obstacles = new Obstacles(this.ctx, this.skier, this.dimensions);
        this.obstacles.placeInitialObstacles();

        this.window.onkeydown = (event: KeyboardEvent) => {
            this.handleKeyDown(event);
        };

        requestAnimationFrame(() => {
            this.gameLoop();
        });

    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    }


    moveSkier() {
        this.skier.move();
        if (this.skier.direction === 2 || this.skier.direction === 3 || this.skier.direction === 4) {
            this.obstacles.placeNewObstacle(this.skier.direction);
        }
    }


    gameLoop() {

        this.ctx.save();

        // Retina support
        this.ctx.scale(this.window.devicePixelRatio, this.window.devicePixelRatio);

        this.clearCanvas();

        this.moveSkier();

        this.obstacles.checkIfSkierHitObstacle();

        this.skier.drawSkier();

        this.obstacles.drawObstacles();

        this.ctx.restore();

        requestAnimationFrame(() => {
            this.gameLoop();
        });
    }

    handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowLeft": // left
                if (this.skier.direction === 1) {
                    this.skier.location.x -= this.skier.speed;
                    this.obstacles.placeNewObstacle(this.skier.direction);
                }
                else if (this.skier.direction !== 0) {
                    this.skier.direction--;
                }
                event.preventDefault();
                break;

            case "ArrowRight": // right
                if (this.skier.direction === 5) {
                    this.skier.location.x += this.skier.speed;
                    this.obstacles.placeNewObstacle(this.skier.direction);
                }
                else if (this.skier.direction !== 0) {
                    this.skier.direction++;
                }
                event.preventDefault();
                break;

            case "ArrowUp": // up
                if (this.skier.direction === 1 || this.skier.direction === 5) {
                    this.skier.location.y -= this.skier.speed;
                    this.obstacles.placeNewObstacle(6);
                }
                event.preventDefault();
                break;

            case "ArrowDown": // down
                this.skier.direction = 3;
                event.preventDefault();
                break;
        }
    }

}

document.addEventListener("DOMContentLoaded", () => {
    // noinspection JSIgnoredPromiseFromCall
    (new Game()).initGame();
});
