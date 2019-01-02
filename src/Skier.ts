import { Assets } from "./Assets";
import { Dimensions } from "./Game";

interface Location {
    x: number;
    y: number;
}

export class Skier {

    private _ctx: CanvasRenderingContext2D;
    private _direction: number = 5;
    gameDimensions: Dimensions;

    location: Location = {x: 0, y: 0};
    speed: number = 8;

    constructor(ctx: CanvasRenderingContext2D, gameDimensions: Dimensions) {
        this._ctx = ctx;
        this.gameDimensions = gameDimensions;
    }

    get direction() {
        return this._direction;
    }

    set direction(direction: number) {
        this._direction = direction;
    }

    drawSkier() {
        const skierImage = Assets.getSkierImage(this._direction);
        const x = (this.gameDimensions.width - skierImage.width) * 0.5;
        const y = (this.gameDimensions.height - skierImage.height) * 0.5;

        this._ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
    }

    move() {
        switch (this.direction) {
            case 2:
                this.location.x -= Math.round(this.speed / 1.4142);
                this.location.y += Math.round(this.speed / 1.4142);

                break;
            case 3:
                this.location.y += this.speed;

                break;
            case 4:
                this.location.x += this.speed / 1.4142;
                this.location.y += this.speed / 1.4142;

                break;
        }
    }
}