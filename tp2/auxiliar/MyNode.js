import * as THREE from 'three';

class MyNode extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, id, material, transformations) {
        super();
        this.app = app;
        this.id = id;
        this.material = material;
        this.transformations = transformations;
        this.group = new THREE.Group();
    }

    visitChildren(children){
        for(let child of children){
            let childNode;
            if(child.type == "node"){
                childNode = new MyNode(this.app, child.id, this.material, this.transformations)
            }
            else if(child.type == "primitive"){
                childNode = new MyPrimitive(child.data)
            }
            else if(child.type == "cylinder"){

            }
            // ...

            // transformações
            for(let childTransformation of child.transformations){
                if(childTransformation.type == "T"){
                    childNode.transformations += childTransformation;
                } 
                else if(childTransformation.type == "R" || childTransformation.type == "S"){
                    childNode.transformations *= childTransformation;
                } 
            }

            if(child.material != null) childNode.material = child.material;

            childNode.visitChildren(child.children)
            this.group.add(childNode.group)
            
        }

        

    }    
}

MyNode.prototype.isGroup = true;

export { MyNode };