const Bitmap = android.graphics.Bitmap;
const Canvas = android.graphics.Canvas;
const Color = android.graphics.Color;

class TextureBuilder {
    private path: string;
    private bitmap: globalAndroid.graphics.Bitmap;
    private canvas: globalAndroid.graphics.Canvas;

    private parseColor(color: string): globalAndroid.graphics.Paint {
        let paint = new android.graphics.Paint();
        paint.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.parseColor(color),android.graphics.PorterDuff.Mode.MULTIPLY));
        return paint;
    }

    public draw(file: string,x: number,y: number,color: string) {
        let bitmap = FileTools.ReadImage(file + ".png");
        if(bitmap){
            this.canvas.drawBitmap(bitmap,(x || 0),(y || 0),(color?this.parseColor(color):null));
        }
    }

    public write(fileName: any,exist?: boolean) {
        if(!FileTools.isExists(this.path)) FileTools.mkdir(this.path);
        if(exist || !FileTools.isExists(this.path + fileName + ".png")){
            FileTools.WriteImage(this.path + fileName + ".png",this.bitmap);
        }
    }

    constructor(path: string,x?: number,y?: number) {
        if(!path) {
            Logger.Log("path is not set, unable to generate item texture.","ERROR");
            return;
        }
        this.path = path;
        this.bitmap = Bitmap.createBitmap(x || 16,y || 16,Bitmap.Config.ARGB_8888);
        this.canvas = new Canvas(this.bitmap);
    }
}