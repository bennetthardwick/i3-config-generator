"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid_1 = require("shortid");
class i3Tree {
    constructor() {
        this.current_window = "root";
        this.tree = new Tree();
    }
    newTerminal() {
        this.current_window = this.tree.addLeaf({ type: "terminal" }, this.current_window);
    }
    stacked() {
        this.windowAction("stacked");
    }
    tabbed() {
        this.windowAction("tabbed");
    }
    verticalSplit() {
        this.windowAction("v_split");
    }
    horizonalSplit() {
        this.windowAction("h_split");
    }
    fullscreen() {
    }
    closeWindow() {
    }
    windowAction(type) {
        this.tree.appendLeaf(this.tree.getParent(this.current_window), { type: type });
    }
}
exports.i3Tree = i3Tree;
class Tree {
    constructor() {
        this.leaves = {};
        this.leaves["root"] = { id: "root", type: "root", children: [], parent: "root" };
    }
    addLeaf(leaf, parent) {
        if (!leaf.id)
            leaf.id = shortid_1.generate();
        if (!leaf.children)
            leaf.children = [];
        if (!leaf.parent && parent)
            leaf.parent = parent;
        this.leaves[leaf.id] = leaf;
        this.leaves[leaf.parent].children.push(leaf.id);
        return leaf.id;
    }
    appendLeaf(parent, leaf) {
        let children = this.leaves[parent].children.slice();
        let id = this.addLeaf(Object.assign({}, leaf, { children: children }), parent);
        children.map(x => this.leaves[x].parent = id);
        this.leaves[parent].children = [id];
    }
    removeLeafById(id) {
        this.removeLeafChildrenById(id);
        removeElement(this.leaves[this.leaves[id].parent].children, id);
        delete this.leaves[id];
    }
    removeLeafChildrenRecursively(children) {
        children.forEach((x) => {
            if (this.leaves[x].children.length > 0)
                this.removeLeafChildrenRecursively(this.leaves[x].children);
            delete this.leaves[x];
        });
    }
    removeLeafChildrenById(id) {
        this.removeLeafChildrenRecursively(this.leaves[id].children);
        this.leaves[id].children = [];
    }
    removeLeaf(leaf) {
        this.removeLeafById(leaf.id);
    }
    getLeafById(id) {
        return this.leaves[id];
    }
    getLeaves() {
        return this.leaves;
    }
    getParent(child) {
        return this.leaves[child].parent;
    }
}
exports.Tree = Tree;
function removeElement(array, element) {
    let index = array.indexOf(element);
    if (index > -1)
        return array.splice(index, 1);
}