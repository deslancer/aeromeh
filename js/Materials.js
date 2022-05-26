class Materials {
    videoMaterial(video_texture, scene) {
        let video_material = new BABYLON.StandardMaterial("video_material", scene);
        video_material.diffuseTexture = video_texture;
        video_material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
        video_material.opacityTexture = video_texture;
        video_material.disableLighting = true;
        video_material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        video_material.emissiveIntensity = 3;
        return video_material
    }
    baseMaterial(scene) {
        let base_material = scene.getMaterialByName('Base_material');
        return base_material
    }
    groundMaterial(scene) {
        let ground_material = new BABYLON.PBRMaterial("ground_mat", scene);
        ground_material.albedoColor = new BABYLON.Color3(0.98, 0.93, 0.83);
        ground_material.roughness = 0.9;
        ground_material.metallic = 0;
        ground_material.alpha = 0.25;
        return ground_material
    }


}