import { Util } from "./Util";

const ASSET_PATH = "/public/images/";

const ASSETS = [
    "skierCrash",
    "skierLeft",
    "skierLeftDown",
    "skierDown",
    "skierRightDown",
    "skierRight",
    "tree_1",
    "treeCluster",
    "rock_1",
    "rock_2"
];

const SKIER_DIRECTIONS = {
    0: "skierCrash",
    1: "skierLeft",
    2: "skierLeftDown",
    3: "skierDown",
    4: "skierRightDown",
    5: "skierRight"
};

const LOADED_ASSETS = {};

export class Assets {

    private static _loadAsset(asset: string): Promise<HTMLImageElement> {
        const file_name = Util.camelToSnake(asset) + ".png";
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                img.width *= 0.5;
                img.height *= 0.5;
                resolve(img);
            };
            img.onerror = reject;
            img.src = ASSET_PATH + file_name;
            img["key"] = asset;
        });
    }

    static getSkierImage(direction: number) {
        const skierAsset = SKIER_DIRECTIONS[direction];
        return Assets.getImage(skierAsset);
    }

    static getImage(type: string): HTMLImageElement {
        return LOADED_ASSETS[type];
    }

    static async loadAssets() {

        const promises = ASSETS.map((asset: string): Promise<HTMLImageElement> => {
            return Assets._loadAsset(asset);
        });

        const assets = await Promise.all(promises);
        assets.forEach((asset: HTMLImageElement) => {
            LOADED_ASSETS[asset["key"]] = asset;
        });
    }
}