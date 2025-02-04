import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

class MyNurbs{

    /**
     * Constructor for MyNurbs class.
     *
     * @param {Object} nurbsData - The nurbs properties data.
    */
    constructor(nurbsData) {
        this.nurbsData = nurbsData;
        let dataControlPoints = nurbsData.controlpoints;
        this.controlPoints = [];
        for (let i=0; i < (nurbsData.degree_u + 1) * (nurbsData.degree_v + 1); i += nurbsData.degree_v + 1){
            let a = [];
            for(let j = 0; j < nurbsData.degree_v + 1; j++){
                a.push(dataControlPoints[i+j])
            }
            this.controlPoints.push(a)            
        }
    }

    /**
     * Builds the curved surface.
     *
    */
    build() {
        const knots1 = [];
        const knots2 = [];

        // build knots1 = [ 0, 0, 0, 1, 1, 1 ];
        for (var i = 0; i <= this.nurbsData.degree_u; i++) {
            knots1.push(0);
        }

        for (var i = 0; i <= this.nurbsData.degree_u; i++) {
            knots1.push(1);
        }

        // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
        for (var i = 0; i <= this.nurbsData.degree_v; i++) {
            knots2.push(0);
        }

        for (var i = 0; i <= this.nurbsData.degree_v; i++) {
            knots2.push(1);
        }

        let stackedPoints = [];

        for (var i = 0; i < this.controlPoints.length; i++) {
            let row = this.controlPoints[i];
            let newRow = [];

            for (var j = 0; j < row.length; j++) {
                let item = row[j];
                newRow.push(new THREE.Vector4(item.xx, item.yy, item.zz, 1.0));
            }

            stackedPoints[i] = newRow;
        }


        const nurbsSurface = new NURBSSurface( this.nurbsData.degree_u, this.nurbsData.degree_v, knots1, knots2, stackedPoints );
        const geometry = new ParametricGeometry( getSurfacePoint, this.nurbsData.parts_u, this.nurbsData.parts_v );
        return geometry;

        function getSurfacePoint( u, v, target ) {
            return nurbsSurface.getPoint( u, v, target );
        }

    }
}


export { MyNurbs };