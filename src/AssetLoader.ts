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

export class AssetLoader {

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

    static async loadAssets() {

        const promises = ASSETS.map((asset: string): Promise<HTMLImageElement> => {
            return AssetLoader._loadAsset(asset);
        });

        return Promise.all(promises);
    }
}