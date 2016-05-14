export class AngleUtil {
    static  decreaseRotation(angle:number) {
        angle = angle - 2;
        if (angle <= 0) {
            angle = 360;
        }
        return angle;
    }

    static increaseRotation(angle:number) {
        angle = angle + 2;
        if (angle >= 360) {
            angle = 0;
        }
        return angle;
    }
}