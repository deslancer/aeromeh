window.addEventListener("DOMContentLoaded", function(){
    class Scene {
        constructor(canvas) {
            this.canvas = canvas;
            this.engine = new BABYLON.Engine(canvas, true);

            this._setupEngine();
            this._loadingScreen();
            this.engine.displayLoadingUI();
            this._defaultScene();
        }
        _setupEngine() {
            let engine = this.engine;
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }
        _defaultScene() {
            let video_src = document.getElementById('particles_video')
            // Create the scene space
            const canvas = this.canvas;
            const scene = new BABYLON.Scene(this.engine);
            let engine = this.engine;
            scene.clearColor = new BABYLON.Color3(0.98, 0.93, 0.83);

            // Add a camera to the scene and attach it to the canvas
            const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 200, new BABYLON.Vector3(-25, 75, 0));
            camera.attachControl(canvas, true);
            if (detectMob()){
                camera.lowerRadiusLimit = 80;
                camera.upperRadiusLimit = 420;
                camera.radius = 420;
            }else {
                camera.lowerRadiusLimit = 50;
                camera.upperRadiusLimit = 320;
            }
            camera.lowerBetaLimit = 0.24;
            camera.upperBetaLimit = 1.5;


            // Add lights to the scene
            const light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
            light.position = new BABYLON.Vector3(20, 40, 20);
            
            this._environment(scene, light, camera);
            let materials = new Materials();

            let video_plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:60, width: 90, sideOrientation: BABYLON.Mesh.DOUBLESIDE})
            video_plane.position.y = 80;
            video_plane.position.x = -24;
            video_plane.rotation.y = Math.PI;

            BABYLON.SceneLoader.ImportMesh("", "assets/models/", "aeromeh.glb", scene,
                function (meshes, particleSystems, skeletons) {
                        
                let grid = scene.getMeshByName('grid');
                let shadowPlane = scene.getMeshByName('Shadow');
                let shadowMaterial = scene.getMaterialByName('shadow');
                shadowMaterial.transparencyMode = 3;
               
                let animation = scene.getAnimationGroupByName('Anim_0');
                animation.loopAnimation = false;
                animation.pause();
                animation.onAnimationEndObservable.add(function() {

                });
                let flag = 0;


                video_src.src = video_src.dataset.src; // подставляем правильный src
                let video_texture = new BABYLON.VideoTexture("video", video_src, scene, true);
                let playPromise = video_texture.video.play();
                  if (playPromise !== undefined) {
                    playPromise.then(_ => {
                       video_texture.video.pause();
                    })
                    .catch(error => {
                    });
                  }
                video_texture.hasAlpha = true;
                video_plane.material = materials.videoMaterial(video_texture, scene);
                    let freelook = true;
                    let itEnded = function() {
                        // if anim is ended, set freelook to true, again.
                        freelook = true;
                        console.log("animation ended - freelook set to true")
                }
                    let forceRebuild = function () {
                        if (!freelook)  // ie. IF animation is active/happening...
                            camera.rebuildAnglesAndRadius();
                        // else do nothing

                    };
                    scene.onBeforeRenderObservable.add(forceRebuild);

                function start_separation () {
                        let animationcamera2 = new BABYLON.Animation(
                            "animationcamera",
                            "position",
                            30,
                            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                        );

                        let anim_keys = [];

                        anim_keys.push({
                            frame: 0,
                            value: camera.position.clone(),
                        });

                        anim_keys.push({
                            frame: 100,
                            value: new BABYLON.Vector3(Math.PI / 2, 0.20, 100),
                        });

                        animationcamera2.setKeys(anim_keys);

                        camera.animations = [];
                        camera.animations.push(animationcamera2);

                        freelook = false;
                        scene.beginAnimation(camera, 0, 100, false, 1, itEnded);



                    video_texture.video.play();
                    video_texture.onUserActionRequestedObservable.add(() => {
                        scene.onPointerDown = function () {
                            video_texture.video.play();
                        };
                    });
                    greenLampsMtl.emissiveColor = new BABYLON.Color3(0, 1, 0);
                    greenLampsMtl.emissiveIntensity = 2;
                    camera.setTarget(video_plane);
                }
                function stop_separation () {
                    greenLampsMtl.emissiveIntensity = 0;
                    video_texture.video.loop = false;
                    camera.setTarget(new BABYLON.Vector3(-650, 75, 0));
                    let animationcamera = new BABYLON.Animation(
                        "myAnimationcamera",
                        "position",
                        30,
                        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                    );

                    let keys = [];

                    keys.push({
                        frame: 0,
                        value: camera.position.clone(),
                    });

                    keys.push({
                        frame: 50,
                        value: new BABYLON.Vector3(Math.PI / 2, Math.PI / 2.5, 200),
                    });

                    keys.push({
                        frame: 100,
                        value: new BABYLON.Vector3(Math.PI / 3, Math.PI / 3, 500),
                    });

                    animationcamera.setKeys(keys);

                    camera.animations = [];
                    camera.animations.push(animationcamera);

                    freelook = false;
                    scene.beginAnimation(camera, 0, 100, false, 1, itEnded);
                    $('.result').css("display", "flex")
                        .hide()
                        .fadeIn();
                    camera.detachControl(canvas);
                }
                $('#open').click(function () {
                        $('.a_dot').removeClass('active');
                        $(this).addClass('active');
                        let isResult = $('.result').is(':not(:hidden)');
                        camera.attachControl(canvas);
                        if(isResult){
                            $('.result').hide();
                        }
                    switch (flag) {
                        case 0 :
                            animation.play();
                            break;
                        case 2 :
                            camera.setTarget(video_plane);
                            break;

                        case  3 :
                            animation.play();
                            camera.setTarget(video_plane);
                            break;
                    }
                        flag = 1;
                    })
                $('#start').click(function () {
                    $('.a_dot').removeClass('active');
                    $(this).addClass('active');
                    camera.setTarget(grid);
                    start_separation();
                    let isResult = $('.result').is(':not(:hidden)');
                    if(isResult){
                        $('.result').hide();
                    }
                    camera.attachControl(canvas);
                    switch (flag) {
                        case 0 :
                            animation.play();
                            start_separation();
                            break;

                        case  3 :
                            animation.play();
                            camera.setTarget(video_plane);
                            start_separation();
                            break;
                    }
                    flag = 2;
                });
                $('#result').click(function () {
                        $('.a_dot').removeClass('active');
                        $(this).addClass('active');
                        stop_separation();
                        flag = 3;
                });
                let msg_box = $('.message_box p');
                $('#fwd').data('functions', [
                        function () {
                            $('.a_dot').removeClass('active');
                            $('#open').addClass('active');
                            let text = $('#open').data('text');
                            msg_box.html('');
                            msg_box.html(text);
                            animation.play();
                            let isResult = $('.result').is(':not(:hidden)');
                            if(isResult){
                                $('.result').hide();
                            }
                            camera.attachControl(canvas);
                            camera.setTarget(video_plane);
                        },
                        function () {
                            $('.a_dot').removeClass('active');
                            $('#start').addClass('active');
                            let text = $('#start').data('text');
                            msg_box.html('');
                            msg_box.html(text);
                            camera.attachControl(canvas);
                            start_separation();
                            let isResult = $('.result').is(':not(:hidden)');
                            if(isResult){
                                $('.result').hide();
                            }
                        },
                        function () {
                            $('.a_dot').removeClass('active');
                            $('#result').addClass('active');
                            let text = $('#result').data('text');
                            msg_box.html('');
                            msg_box.html(text);
                            camera.setTarget(new BABYLON.Vector3(-650, 75, 0));
                            stop_separation();
                        }
                        ]).click(function (e) {
                        let $this = $(this),
                            functions = $this.data('functions');
                        functions[0].call($this);
                        functions.push(functions.shift());
                });
                $('#bwd').data('functions', [
                        function () {
                        $('.a_dot').removeClass('active');
                        $('#start').addClass('active');
                        let text = $('#start').data('text');
                        msg_box.html('');
                        msg_box.html(text);
                        camera.attachControl(canvas);
                        start_separation();
                        let isResult = $('.result').is(':not(:hidden)');
                        if(isResult){
                            $('.result').hide();
                        }
                    },
                        function () {
                        $('.a_dot').removeClass('active');
                        $('#open').addClass('active');
                        let text = $('#open').data('text');
                        msg_box.html('');
                        msg_box.html(text);
                        animation.play();
                        let isResult = $('.result').is(':not(:hidden)');
                        if(isResult){
                            $('.result').hide();
                        }
                        camera.attachControl(canvas);

                    },
                        function () {
                            $('.a_dot').removeClass('active');
                            $('#result').addClass('active');
                            let text = $('#result').data('text');
                            msg_box.html('');
                            msg_box.html(text);
                            stop_separation();
                        }
                    ]).click(function (e) {
                        let $this = $(this),
                            functions = $this.data('functions');
                        functions[0].call($this);
                        functions.push(functions.shift());
                });

                let base_material = scene.getMaterialByName('Base_material');
                base_material.metallic = 0.7;
                base_material.roughness = 0.525;

                let metal_material = scene.getMaterialByName('White_metal');
                metal_material.albedoColor = new BABYLON.Color3(1, 1, 1);
                metal_material.metallic = 0.7;
                metal_material.roughness = 0.3;

                let grain_material = scene.getMaterialByName('grain');
                grain_material.metallic = 0.7;
                grain_material.roughness = 0.3;

                let logo_material = scene.getMaterialByName('Logo');
                logo_material.metallic = 0.4;
                logo_material.roughness = 0.3;
                    let material_1 = scene.getMaterialByName('1');
                    material_1.metallic = 0.4;
                    material_1.roughness = 0.5;
                    material_1.ambientColor = new BABYLON.Color3(1, 1, 1);
                    let material_2 = scene.getMaterialByName('2');
                    material_2.metallic = 0.4;
                    material_2.roughness = 0.5;
                    let material_3 = scene.getMaterialByName('3');
                    material_3.metallic = 0.7;
                    material_3.roughness = 0.5;
                    let material_4 = scene.getMaterialByName('4');
                    material_4.metallic = 0.4;
                    material_4.roughness = 0.5;
                    let material_5 = scene.getMaterialByName('5');
                    material_5.metallic = 0.4;
                    material_5.roughness = 0.5;



                let wheat = scene.getMaterialByName('wheat')
                wheat.albedoTexture.uOffset = 7;
                wheat.albedoTexture.vOffset = 7;
                wheat.albedoTexture.uScale = 7;
                wheat.albedoTexture.vScale = 7;

                let advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

                let greenLampsMtl = scene.getMaterialByName('green_btns');
                let ctrl_panel = scene.getMeshByName('control_panel');
                   let input_spot = new Hotspots('info', 3, new BABYLON.Vector3(-75,110,13),'#e93a3a',advancedTexture, scene);
                    input_spot.addTextWithLine('10%','30%','Бункер питатель');

                    let output_spot = new Hotspots('info', 3, new BABYLON.Vector3(-24,50,15),'#e93a3a',advancedTexture, scene);
                    output_spot.addTextWithLine('75%','0','Сборник фракций семян');

                    let generator = new Hotspots('info', 3, new BABYLON.Vector3(-75,75,14),'#e93a3a',advancedTexture, scene);
                    generator.addTextWithLine('65%','25%','Струйный генератор');

                    let fan_spot = new Hotspots('info', 3, new BABYLON.Vector3(-75,25,25),'#e93a3a',advancedTexture, scene);
                    fan_spot.addTextWithLine('85%','35%','Главный вентилятор');

                    let cyclon_spot = new Hotspots('info', 3, new BABYLON.Vector3(75,80,10),'#e93a3a',advancedTexture, scene);
                    cyclon_spot.addTextWithLine('60%','-40%','Циклон');

                    let asp_spot = new Hotspots('info', 3, new BABYLON.Vector3(25,110,20),'#e93a3a',advancedTexture, scene);
                    asp_spot.addTextWithLine('50%','-25%','Блок аспирации');

                    scene.onPointerDown = function (evt,pickResult) {
                        let pickedMesh;
                        if (pickResult.pickedMesh === null || undefined){
                            pickedMesh = '';
                        }else{
                            pickedMesh= pickResult.pickedMesh;
                        }
                        //console.log(pickedMesh);
                        if (pickedMesh.name !== 'info' || ''){
                        advancedTexture.executeOnAllControls(function (control) {
                                control.isVisible = false;
                                //console.log(control)
                            }, this._rootContainer)
                        } else {
                            advancedTexture._rootContainer.isVisible = true;
                        }
                    };
                    $('.spinner-path').addClass('change_opacity');
                    scene.executeWhenReady(() => {
                       engine.hideLoadingUI();
                        engine.runRenderLoop(() => {
                            scene.render();
                        });
                    });

            },
                function (evt) {
                // onProgress
                var loadedPercent = 0;
                if (evt.lengthComputable) {
                    loadedPercent = (evt.loaded * 100 / evt.total).toFixed();
                } else {
                    var dlCount = evt.loaded / (1024 * 1024);
                    loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
                }
                //console.log(loadedPercent)
                // assuming "loadingScreenPercent" is an existing html element
                document.getElementById("bar").style.width = loadedPercent + '%';
            });
            return scene;
        }

        _environment(scene, light, camera) {
            let materials = new Materials();
            scene.createDefaultEnvironment({
                createSkybox: false,
                createGround: false
            })
            // Create and tweak the background material.
            let backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
            backgroundMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/backgroundGround.png", scene);
            backgroundMaterial.diffuseTexture.hasAlpha = true;
            backgroundMaterial.shadowLevel = 0.4;

            let ground = BABYLON.MeshBuilder.CreatePlane('ground', {height:1500, width: 1500}, scene);
            ground.rotation.x = Math.PI / 2;
            ground.position.y = -1;
            ground.material = backgroundMaterial;
            ground.activeLight = light;
        }
        _loadingScreen() {
            BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
                //if loading screen exist already
                if (document.getElementById("preloader")) {
                    // Do not add a loading screen if there is already one
                    document.getElementById("preloader").style.display = "initial";

                } else {
                    document.getElementById("preloader").style.display = "flex";
                    document.getElementById("overlay").style.display = "block";
                }
                
            };

            BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
                document.querySelector('.preload_container').style.display = "none";
                document.getElementById("preloader").style.display = "none";
                 document.getElementById("overlay").style.display = "none";
            };
        }
    }
    let canvas = document.getElementById('renderCanvas');
    let default_scene = new Scene(canvas);
    function detectMob() {
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
})
