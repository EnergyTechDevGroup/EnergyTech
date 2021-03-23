class RecipeUtils {
    static recipes: {[key: string]: any} = {}

    static addShaped(output,input) {
        var item = {}
        for(let i1 = 0;i1 < Math.min(3,input.length);i1++){
            for(let i2 = 0;i2 < Math.min(3,input[i1].length);i2++){
                if(input[i1][i2]) item[[[0,1,2],[3,4,5],[6,7,8]][i1][i2]] = input[i1][i2];
            }
        }

        var field = [];
        for(let i in item){
            field.push(i);
            field.push(item[i].id);
            field.push(item[i].data);
        }

        Recipes.addShaped(output,["012","345","678"],field,function(api,field,result){
            for(let i in item){
                if(item[i].damage){
                    item[i].data += item[i].damage;
                    if(item[i].data >= Item.getMaxDamage(item[i].id)){
                        api.decreaseFieldSlot(parseInt(i));
                    }
                } else {
                    api.decreaseFieldSlot(parseInt(i));
                }
            }
        });
    }

    static addShapeless(output,item) {
        Recipes.addShapeless(output,item,function(api,field,result){
            for(let i in item){
                if(item[i].damage){
                    item[i].data += item[i].damage;
                    if(item[i].data >= Item.getMaxDamage(item[i].id)){
                        api.decreaseFieldSlot(parseInt(i));
                    }
                } else {
                    api.decreaseFieldSlot(parseInt(i));
                }
            }
        });
    }

    static addCraftingShapeless(output,input) {
        var uid = "";

        var uidData = {}

        var item = [];
        for(let i in input){
            var name = NameByID(input[i].id,true);
            if(!uidData[name]) uidData[name] = 0;
            uidData[name]++;
            
            item.push({item: NameByID(input[i].id), data: (input[i].data || 0)});
        }

        for(let i in uidData){
            var count = uidData[i];
            uid += (i + (count > 1?count:""));
        }

        VanillaRecipe.addCraftingRecipe(uid + "_" + NameByID(output.id,true),{
            type: "shapeless",
            ingredients: item,
            result: {item: NameByID(output.id),count: output.count, data: output.data}
        },true);
    }

    static getRecipe(name: string,create?: boolean) {
        if(!this.recipes[name] && create){
			this.recipes[name] = [];
		}
        return this.recipes[name];
    }

    static addRecipe(name,source,result,extra?: {[key: string]: any} | number) {
        var data = {}
        if(typeof(extra) == "number"){
            data = {"work_time": extra}
        } else {
            data = extra;
        }

        var recipe = this.getRecipe(name,true);
        recipe.push({"source": source,"result": result,"extra": data});
    }

    static isValidInput(name,item) {
        var recipe = RecipeUtils.getRecipe(name);
        if(recipe){
            for(let i in recipe){
                if(recipe[i].source.id == item.id && recipe[i].source.data == item.data){
                    return true;
                }
            }
        }
        return false;
    }
}

class TileRecipe {
    public tileEntity: any;

    public getRecipeByName() {
        return this.tileEntity.getRecipeByName();
    }

    public getRecipeData() {
        return RecipeUtils.getRecipe(this.getRecipeByName() || "null");
    }

    public getInputSlot() {
        let item = [];
        let source = this.tileEntity.interface.getInputSlots();
        for(let i in source){
            item.push(this.tileEntity.container.getSlot(source[i]));
        }
        return item;
    }

    public getOutputSlot() {
        let item = [];
        let source = this.tileEntity.interface.getOutputSlots();
        for(let i in source){
            item.push(this.tileEntity.container.getSlot(source[i]));
        }
        return item;
    }

    public getRecipe() {
        let recipe = this.getRecipeData();
        if(recipe){
            let item = {};
            let input = this.getInputSlot();
            for(let i in input){
                if(input[i].id > 0){
                    item[input[i].id + ":" + input[i].data] = item[input[i].id + ":" + input[i].data] || 0;
                    item[input[i].id + ":" + input[i].data] += input[i].count;
                }
            }

            for(let i1 in recipe){
                let valid = true;
                for(let i2 in recipe[i1].source){
                    let input = recipe[i1].source[i2];
                    let count = item[input.id + ":" + input.data];
                    if(!count || count < input.count){
                        valid = false;
                        break;
                    }
                }
                if(valid) return recipe[i1];
            }
        }
        return null;
    }

    public outSource() {
        let recipe = this.getRecipe();
        if(recipe){
            for(let i in recipe.source){
                let input = recipe.source[i];
                let count = input.count;
                if(count > 0){
                    let slot = this.getInputSlot();
                    for(let i in slot){
                        if(slot[i].id == input.id && slot[i].data == input.data){
                            let remove = Math.min(count,slot[i].count);
                            count -= remove;
                            slot[i].count -= remove;
                            slot[i].validate();
                        }
                    }
                }
            }
    
            for(let i in recipe.result){
                let output = recipe.result[i];
                let count = output.count;
                if(count > 0){
                    let slot = this.getOutputSlot();
                    for(let i in slot){
                        if(slot[i].id == output.id && slot[i].data == output.data || slot[i].id == 0){
                            let add = Math.min(Item.getMaxStack(slot[i].id) - slot[i].count,count);
                            count -= add;
                            slot[i].setSlot(output.id,slot[i].count + add,output.data);
                            slot[i].validate();
                        }
                    }
    
                    if(count > 0){
                        World.drop(this.tileEntity.x,this.tileEntity.y,this.tileEntity.z,output.id,count,output.data);
                        count = 0;
                    }
                }
            }
        }
    }

    constructor(tile){
        this.tileEntity = tile;
    }
}

Callback.addCallback("TileEntityAdded",function(tileEntity,created){
    if(MachineRegistry.isMachine(tileEntity.blockID)){
        tileEntity.recipe = new TileRecipe(tileEntity);
    }
});

function NameByID(id: string | number,is?: boolean) {
    for(let uid in BlockID){
        if(BlockID[uid] == id){
            return (is?"":"block:") + uid;
        }
    }
    for(let uid in VanillaBlockID){
        if(VanillaBlockID[uid] == id){
            return uid;
        }
    }
    for(let uid in ItemID){
        if(ItemID[uid] == id){
            return (is?"":"item:") + uid;
        }
    }
    for(let uid in VanillaItemID){
        if(VanillaItemID[uid] == id){
            return uid;
        }
    }
}