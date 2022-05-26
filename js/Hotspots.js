class Hotspots {
    /**
     * Creating a single hotspot .
     * @param {Object} position - Hotspot position by X,Y,Z in a World Matrix.
     * @param {Object} scene - Scene, where hotspot will created.
     * @param {string} name
     * @param {int} size
     * @param {string} color - Use for point texture.
     * @param {Object} adv_texture - AdvancedDynamicTExture.
     */
    constructor(name, size, position,color,adv_texture, scene) {
        this.scene = scene;
        this.mesh = '';

        this.size = size;
        this.mesh_position = position;
        this.actionManager = new BABYLON.ActionManager(this.scene);
        this.advancedTexture = adv_texture;
        this.highlight = new BABYLON.HighlightLayer("hl", this.scene);
        this.__createHotspot(name, size, color);
    }
    /**
     * @param {string} name - What function hotspt will be do.
     * @param {int} size - Use for define camera position.
     * @param {string} color - Use for point texture.
     */
    __createHotspot(name, size,color){
        let size_new;
        let highlight = this.highlight;
        let texture = this.createTexture(color);
        if(this.__detectMob()){
            size_new = size * 2.5;
        }else {
            size_new = size
        }
        let mesh = BABYLON.MeshBuilder.CreateDisc(name, {
                    radius: size_new,
                    sideOrientation: BABYLON.Mesh.DOUBLESIDE
                }, this.scene);
        let infoMaterial = new BABYLON.StandardMaterial("infoMat", this.scene);
        infoMaterial.diffuseTexture = new BABYLON.Texture(texture, this.scene);
        infoMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        infoMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
        infoMaterial.emissiveIntensity = 3;
        infoMaterial.diffuseTexture.hasAlpha = true;
        mesh.material = infoMaterial;
        this.mesh = mesh;
        mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
        mesh.position = this.mesh_position;
        //highlight.addMesh(mesh, BABYLON.Color3.White());
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
            highlight.addMesh(mesh,new BABYLON.Color3(1, 0, 0));
        }));
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
            highlight.removeMesh(mesh);
        }));
    }
    addTextBlock(h_text) {
        let textBlock = new BABYLON.GUI.Rectangle("rect");
        textBlock.background = "black";
        textBlock.color = "black";
        textBlock.width = "150px";
        textBlock.height = "50px";
        textBlock.alpha = 0.8;
        textBlock._isVisible = false;
        textBlock.linkOffsetX = this.size + 100;
        textBlock.linkOffsetY = this.size;
        this.advancedTexture.addControl(textBlock);
        textBlock.linkWithMesh(this.mesh);

        let text1 = new BABYLON.GUI.TextBlock();
        text1.text = h_text;
        text1.color = "white";
        text1.textWrapping = true;
        textBlock.addControl(text1);
        this.mesh.actionManager = this.actionManager;
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(ev){

            if (ev.meshUnderPointer.name === "info") {
                textBlock.isVisible = !textBlock.isVisible;
            }
        }));
        textBlock.onPointerDownObservable.add(function () {
            textBlock.isVisible = false;
        })
        return textBlock;
    }
    addAction(func) {
        this.mesh.actionManager = this.actionManager;
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(ev){
            if (ev.meshUnderPointer.name === "action") {
                func();
            }
        }));
    }
    addHoverText(h_text) {
        let text2 = new BABYLON.GUI.TextBlock();
        text2.text = h_text;
        text2.color = "White";
        text2.linkOffsetY = -30;
        text2.isVisible = false;
        this.advancedTexture.addControl(text2);
        text2.linkWithMesh(this.mesh);

        this.mesh.actionManager = this.actionManager;
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
            if (ev.meshUnderPointer.name === "action") {
                text2.isVisible = true;
            }
        }));
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
            if (ev.meshUnderPointer.name === "action") {
                text2.isVisible = false;
            }
        }));
    }
    addTextWithLine(top, left, txt) {
        let this_mesh = this.mesh;
        let label = new BABYLON.GUI.Rectangle("label for " + this.mesh.name);
        label.background = "#138d90";
        label.alpha = 0.9;
        if (this.__detectMob()){
            label.height = "90px";
            label.width = "300px";
        }else {
            label.height = "60px";
            label.width = "190px";
        }

        label.cornerRadius = 5;
        label.thickness = 1;
        label.linkOffsetY = 30;
        label.top = top;
        label.left = left;
        label.zIndex = 5;
        label.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        label.isVisible = false;
        this.advancedTexture.addControl(label);


        let text1 = new BABYLON.GUI.TextBlock();
        text1.text = txt;
        if (this.__detectMob()){
            text1.fontSize  = 30;
            text1.fontStyle = 'italic';
        }
        text1.color = "white";
        text1.textWrapping = true;
        label.addControl(text1);

        let line = new BABYLON.GUI.Line();
        line.alpha = 0.9;
        line.lineWidth = 2;
        line.color = '#138d90';
        line.isVisible = false;
        this.advancedTexture.addControl(line);
        line.linkWithMesh(this.mesh);
        line.connectedControl = label;

        let endRound = new BABYLON.GUI.Ellipse();
        endRound.width = "70px";
        endRound.isVisible = false;
        endRound.height = "70px";
        endRound.color = "#138d90";
        this.advancedTexture.addControl(endRound);
        endRound.linkWithMesh(this.mesh);

        this.mesh.actionManager = this.actionManager;
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(ev){

            if (ev.meshUnderPointer.name === this_mesh.name) {
                label.isVisible = true;
                text1.isVisible = true;
                line.isVisible = true;
                endRound.isVisible = true;
            }
        }));
    label.onPointerDownObservable.add(function () {
            label.isVisible = false;
            line.isVisible = false;
            endRound.isVisible = false;
        })
    return label
    }
    createTexture(color) {
        let canvas = document.createElement('canvas');
        canvas.style.background = 'transparent';
        canvas.width = 300;
        canvas.height = 300;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        //console.log(canvas)
        const radius = 60;
        const radius2 = 120;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius2, 0, 2 * Math.PI, false);
        ctx.lineWidth = 30;
        ctx.strokeStyle = color;
        ctx.stroke();
        let result = canvas.toDataURL("image/png");
        canvas.remove();
        return result
    }
    __detectMob() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }
}