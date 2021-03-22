function parInput(input){
    var data = {}
    for(let i1 = 0;i1 < Math.min(3,input.length);i1++){
        for(let i2 = 0;i2 < Math.min(3,input[i1].length);i2++){
            if(input[i1][i2]){
                data[[["0","1","2"],["3","4","5"],["6","7","8"]][i1][i2]] = input[i1][i2];
            }
        }
    }
    return data;
}

function parShaped(item){
    var field = [];
    for(let i in item){
        field.push(i);
        field.push(item[i].id);
        field.push(item[i].data);
    }
    return field;
}

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

var RecipeUtils = {
    recipes: {},

    addShaped(output,input) {
        var item = parInput(input);
        Recipes.addShaped(output,["012","345","678"],parShaped(item),function(api,field,result){
            for(let i in item){
                if(item[i].damage){
                    item[i].data += item[i].damage;
                    if(item[i].data >= Item.getMaxDamage(item[i].id)){
                        item[i].id = item[i].count = item[i].data = 0;
                    }
                } else {
                    api.decreaseFieldSlot(parseInt(i));
                }
            }
        });
    },

    addShapeless(output,item) {
        Recipes.addShapeless(output,item,function(api,field,result){
            for(let i in item){
                if(item[i].damage){
                    item[i].data += item[i].damage;
                    if(item[i].data >= Item.getMaxDamage(item[i].id)){
                        item[i].id = item[i].count = item[i].data = 0;
                    }
                } else {
                    api.decreaseFieldSlot(parseInt(i));
                }
            }
        });
    },

    addCraftingShapeless(output,input) {
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
    },

    getRecipe(name: string,create?: boolean) {
        if(!this.recipes[name] && create){
			this.recipes[name] = [];
		}
        return this.recipes[name];
    },

    addRecipe(name,source,result,extra?: {[key: string]: any} | number) {
        var data = {}
        if(typeof(extra) == "number"){
            data = {"work_time": extra}
        } else {
            data = extra;
        }

        var recipe = this.getRecipe(name,true);
        recipe.push({"source": source,"result": result,"extra": data});
    },

    parSource(source) {
        var item = {};
        for(let i in source){
            if(source[i].id > 0){
                item[source[i].id + ":" + source[i].data] = item[source[i].id + ":" + source[i].data] || 0;
                item[source[i].id + ":" + source[i].data] += source[i].count;
            }
        }
        return item;
    },

    getRecipeBySource(name,source) {
        var recipes = this.getRecipe(name);
        if(recipes){
            var item = this.parSource(source);
            for(let i1 in recipes){
                var valid = true;
                for(let i2 in recipes[i1].source){
                    var count = item[recipes[i1].source[i2].id + ":" + recipes[i1].source[i2].data];
                    if(!count || count < recipes[i1].source[i2].count){
                        valid = false;
                        break;
                    }
                }
                if(valid){
                    return recipes[i1];
                }
            }
        }
        return null;
    },

    getRecipeByTile(name,tile) {
        var item = [];
        var source = tile.interface.getInputSlots();
        for(let i in source){
            item.push(tile.container.getSlot(source[i]));
        }
        return this.getRecipeBySource(name,item);
    },

    outRecipeToTile(recipe,tile) {
        for(let i in recipe.source){
            var count = recipe.source[i].count;
            if(count > 0){
                var source = tile.interface.getInputSlots();
                for(let i in source){
                    var slot = tile.container.getSlot(source[i]);
                    if(slot.id == recipe.source[i].id && slot.data == recipe.source[i].data){
                        var remove = Math.min(count,slot.count);
                        count -= remove;
                        slot.count -= remove;
                    }
                }
            }
        }

        for(let i in recipe.result){
            var count = recipe.result[i].count;
            if(count > 0){
                var result = tile.interface.getOutputSlots();
                for(let i in result){
                    var slot = tile.container.getSlot(result[i]);
                    if(slot.id == recipe.result[i].id && slot.data == recipe.result[i].data || slot.id == 0){
                        slot.id = recipe.result[i].id;
                        slot.data = recipe.result[i].data;
                        var add = Math.min(Math.min(Item.getMaxStack(slot.id) - slot.count,count),64);
                        count -= add;
                        slot.count += add;
                    }
                }
                if(count > 0){
                    World.drop(tile.x,tile.y,tile.z,recipe.result[i].id,count,recipe.result[i].data);
                    count = 0;
                }
            }
        }

        tile.container.validateAll();
    },

    isValidInput(name,item) {
        var recipe = RecipeUtils.getRecipe(name);
        if(recipe){
            for(let i in recipe){
                if(recipe[i].source.id == item.id && recipe[i].source.data == item.data){
                    return true;
                }
            }
        }
        return false;
    },

    executeRecipeToTileTick(name,tile) {
        var recipe = this.getRecipeByTile(name,tile);
        if(recipe){
            if(tile.data.energy >= tile.data.energy_consume){
                tile.setActive(true);
                tile.data.energy -= tile.data.energy_consume;
                tile.data.progress += 1/(recipe.extra.work_time || tile.data.work_time);
                if(tile.data.progress.toFixed(3) >= 1){
                    this.outRecipeToTile(recipe,tile);
                    tile.data.progress = 0;
                }
            } else {
                tile.setActive(false);
            }
        } else {
            tile.setActive(false);
            tile.data.progress = 0;
        }

        tile.container.setScale("scaleProgress",tile.data.progress / 1);
    }
}