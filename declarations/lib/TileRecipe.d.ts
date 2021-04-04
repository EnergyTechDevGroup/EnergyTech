/// <reference path="../core-engine.d.ts" />

interface RecipeData {
    source: ItemInstance[];
    result: ItemInstance[];
    extra: {[key: string]: any};
}

declare class TileEntity_TileRecipe {
    constructor(tileEntity: TileEntity);
    tileEntity: TileEntity;
    getRecipeData(): any;
    getInputSlot(): string[];
    getOutputSlot(): string[];
    getItemCount(slot: {[key: string]: ItemInstance},id: number,data?: number): number;
    getValidRecipeData(): RecipeData;
    parSlot(slot: string[]): ItemInstance[];
    outSourceToSlot(recipe): void;
}

declare namespace TileRecipe {
    function getRecipe(name: string,create?: boolean): RecipeData[];
    function addRecipe(name: string,source: ItemInstance[],result: ItemInstance[],extra?: {[key: string]: any} | number): void;
    function isValidInput(item: ItemInstance,side: number,tile: TileEntity): boolean;
}