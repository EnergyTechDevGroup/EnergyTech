class TextureBuilder {
    public path: string;

    public file: any = [[null,0]];

    private bitmap: globalAndroid.graphics.Bitmap;
    private canvas: globalAndroid.graphics.Canvas;

    public parseColor(color: string): globalAndroid.graphics.Paint {
        let paint = new android.graphics.Paint();
        paint.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.parseColor(color),android.graphics.PorterDuff.Mode.MULTIPLY));
        return paint;
    }

    public draw(file: string,x: number,y: number,color: string) {
        let bitmap = FileTools.ReadImage(file + ".png");
        if(bitmap) this.canvas.drawBitmap(bitmap,(x || 0),(y || 0),(color?this.parseColor(color):null));
    }

    public write(exist,name?: string) {
        if(!FileTools.isExists(this.path)) FileTools.mkdir(this.path);
        let file = name || this.file[0][0] + "_" + this.file[0][1] + ".png";
        if(exist || !FileTools.isExists(this.path + file)) FileTools.WriteImage(this.path + file,this.bitmap);
    }

    constructor(path: string,x?: number,y?: number) {
        if(!path) {
            Logger.Log("path is not set, unable to generate item texture.","ERROR");
            return;
        }
        this.path = path;
        this.bitmap = android.graphics.Bitmap.createBitmap(x || 16,y || 16,android.graphics.Bitmap.Config.ARGB_8888);
        this.canvas = new android.graphics.Canvas(this.bitmap);
    }
}