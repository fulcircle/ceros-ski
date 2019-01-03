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
    jumpState = {
        landTime: 0,
        jumping: false,
        frame: 1
    };

    timer: any;

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
        let skierImage;

        if (this.jumping) {
            if (this.jumpState.frame <= 5) {
                skierImage = Assets.getSkierJumpingImage(this.jumpState.frame);
            } else {
                this.land();
                skierImage = Assets.getSkierImage(this._direction);
            }
        } else {
            skierImage = Assets.getSkierImage(this._direction);
        }
        const x = (this.gameDimensions.width - skierImage.width) * 0.5;
        const y = (this.gameDimensions.height - skierImage.height) * 0.5;

        this._ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
    }

    jump() {
        if (this.canJump) {
            this.jumpState.jumping = true;
            this.jumpState.frame = 1;
            this.timer = setInterval(() => {
                this.jumpState.frame++;
            }, 100);
        }
    }

    land() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.jumpState.landTime = Date.now();
        this.jumpState.jumping = false;
        this.jumpState.frame = 1;
    }

    get canJump(): boolean {
        return this.direction !== 0 && this.direction !== 1 && this.direction !== 5 && Date.now() - this.jumpState.landTime > 1500;
    }

    get jumping(): boolean {
        return this.jumpState.jumping;
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