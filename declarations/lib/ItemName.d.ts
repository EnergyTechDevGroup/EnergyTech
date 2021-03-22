/// <reference path="../core-engine.d.ts" />

declare namespace ItemName {
    let tooltipAddFunctions: {};
    function getTooltipFunc(id: number): void;
    function registerTooltipAddFunction(id: number,state: Function,prefix?: string): void;
    function removeTooltip(id: number): void;
    function removeTooltipByPrefix(id: number,prefix: string): void;
    function onAddTooltip(item: ItemInstance,translate: string,name: string): string;
}