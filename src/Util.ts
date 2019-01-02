export class Util {
    static camelToSnake(string: string) {
        return string.replace(/[\w]([A-Z])/g, (m) => {
            return m[0] + "_" + m[1];
        }).toLowerCase();
    }

    static intersectRect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }
}