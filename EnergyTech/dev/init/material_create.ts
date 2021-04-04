/// <reference path="texture.ts"/>

class MaterialCreate {
    public path: string = ResDir;

    public color: string;

    public material: string;

    public elements: {[key: string]: any} = {}

    public getSourcePath(): string {
        return this.path + "texture-source/" + this.material.toUpperCase() + "/";
    }

    public addToElement(type: string,id: number,isGroup?: boolean) {
        if(this.elements[type]){
            if(!Array.isArray(this.elements[type])){
                this.elements[type] = [this.elements[type]];
            }
            this.elements[type].push(id);
        } else {
            this.elements[type] = id;
        }

        if(isGroup){
            Item.addCreativeGroup("et_" + type,Translation.translate("Materials"),[id]);
        }
    }

    protected _block(type: string,state: {[key: string]: any},specialType?: Block.SpecialType): number {
        for(let i1 in state){
            // name
            let name = (state[i1].name || "%s " + toTitleCase(type)).replace("%s",toTitleCase(this.material));

            // texture
            let textList = [];
            for(let i2 in state[i1].texture){
                let api = new TextureBuilder(this.path + "terrain-atlas/materials/" + type + "/");
                let textFunc = state[i1].texture[i2](api,this.getSourcePath());
                api.write(textFunc[0] + "_" + (textFunc[1] || 0),false);
                textList.push([textFunc[0],textFunc[1]]);
            }

            // create
            let block = IDRegistry.genBlockID((state[i1].uid || type + "%s").replace("%s",toTitleCase(this.material)));
            Block.createBlock(IDRegistry.getNameByID(block),[
                {name: name,texture: textList,inCreative: true}
            ],specialType);
            this.addToElement(type,block,true);
            return block;
        }
    }

    protected _item(type: string,state?: {[key: string]: any}): number {
        if(!state) state = {}

        // name
        let name = (state.name || "%s " + toTitleCase(type)).replace("%s",toTitleCase(this.material));

        var texture = {name: "null",meta: 0};
        if(state.texture){
            let api = new TextureBuilder(this.path + "items-opaque/materials/" + type + "/");
            let textFunc = state.texture(api,this.getSourcePath());
            api.write(textFunc.name + "_" + (textFunc.meta || 0),false);
            texture = textFunc;
        }

        var item = IDRegistry.genItemID((state.uid || "%s" + toTitleCase(this.material)).replace("%s",type));
        Item.createItem(IDRegistry.getNameByID(item),name,texture,{stack: (state.stack || 64)});
        this.addToElement(type,item,true);
        return item;
    }

    protected _tool(type: string,state?: {[key: string]: any}): number {
        if(!state) state = {};
        state.stack = 1;

        let item = this._item(type,state);
        ToolLib.setTool(item,this.material,state.type || {});

        ItemName.registerTooltipAddFunction(item,(item) => {
            var max = Item.getMaxDamage(item.id);
            return Translation.translate("Durability") + ": " + (max +  item.data) + "/" + max;
        });
        return item;
    }

    constructor(material: string,color: string) {
        this.material = material;
        this.color = color;
    }
}