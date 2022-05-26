class GUI {
    constructor() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");
    }
    createLabel(mesh, color, text, width, height ) {
        let label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
        let width_in = width;
        let height_in = height;
        width_in !== undefined || null ? width_in = width : width_in = '100px';
        height_in !== undefined || null ? height_in = height : height_in = '30px';
        label.background = color;
        label.height = height_in;
        label.alpha = 0.8;
        label.width = width_in;
        label.cornerRadius = 20;
        label.thickness = 1;
        label.linkOffsetY = 30;
        this.advancedTexture.addControl(label);
        label.linkWithMesh(mesh);

        let text1 = new BABYLON.GUI.TextBlock();
        text1.text = text;
        text1.color = "white";
        text1.textWrapping = true;
        label.addControl(text1);
        return label
    }
    createLabelWithLine(mesh, color, text, top, left) {
        let label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
        label.background = color;
        label.height = "50px";
        label.alpha = 0.5;
        label.width = "200px";
        label.cornerRadius = 20;
        label.thickness = 1;
        label.linkOffsetY = 30;
        label.top = top;
        label.left = left;
        label.zIndex = 5;
        label.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.advancedTexture.addControl(label);

        let text1 = new BABYLON.GUI.TextBlock();
        text1.text = text;
        text1.textWrapping = true;
        text1.color = "white";
        label.addControl(text1);

        let line = new BABYLON.GUI.Line();
        line.alpha = 0.5;
        line.lineWidth = 5;
        line.dash = [5, 10];
        line.color = 'black'
        this.advancedTexture.addControl(line);
        line.linkWithMesh(mesh);
        line.connectedControl = label;

        let endRound = new BABYLON.GUI.Ellipse();
        endRound.width = "10px";
        endRound.background = "black";
        endRound.height = "10px";
        endRound.color = "white";
        this.advancedTexture.addControl(endRound);
        endRound.linkWithMesh(mesh);
    }
}