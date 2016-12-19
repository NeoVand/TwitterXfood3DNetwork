/**
 * Created by Neo on 12/12/2016.
 */
var foodTags= ['vegetarian','vegan','nonVeg','paleo','pescetarian'];
function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
    dragging = false;
    tweet = false;
}

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(-1, -1);
var tooltipVisible = false, dragging = false;
var tooltip = document.getElementById("tooltip");
var tooltipBody = tooltip.querySelector(".body");
var tweet = false;
// var tooltipAttribution = tooltip.querySelector(".attribution");

document.addEventListener("mousedown", function(e) {
    if(e.ctrlKey){
        tweet = true;
    }
    dragging = true;
});

document.addEventListener("mouseup", function() {
    dragging = false;
    tweet = false;
});

document.addEventListener("mousemove", function(e) {
    e.preventDefault();

    mouse.x = (e.pageX / WIDTH) * 2 - 1;
    mouse.y = -(e.pageY / HEIGHT) * 2 + 1;
});

function loadTooltipData(data) {
    tooltipBody.innerHTML = data.body;
    // tooltipAttribution.innerHTML = data.attribution;
}

function moveTooltip(e) {
    tooltip.style.top = e.pageY + 'px';
    tooltip.style.left = e.pageX + 'px';
}

function openTooltip() {
    tooltip.classList.remove("hidden");
    document.addEventListener("mousemove", moveTooltip);
}

function closeTooltip() {
    tooltip.classList.add("hidden");
    document.removeEventListener("mousemove", moveTooltip);
}


// config references
var chartConfig = {
    target : 'container',
    data_url : './data/foodGraph.json',
};

var vizController = {
    scale:1,
    nodeSize:3.5,
    nonVeg: [255,0,0],
    vegan: [0,80,0],
    vegetarian:[0,70,248],
    pescetarian:[255,165,0],
    paleo :[187,0,213],
    showAll: true,
    nonVegBox:false,
    veganBox:false,
    vegetarianBox:false,
    paleoBox:false,
    pescetarianBox:false,
    nodeVisibility :3.3,
    edgeVisibility : 1,
    nodeContrast:1,
    bgColor:[20,20,20],
    highlighted:0.03,
    dimmed:0.003,
    rotate:true,
    rotationSpeed:0.001,
    issueSignalStrength:0.072,
    issueDimmed:0.0018,
    issueThreshold:0,
    issueDesat:0.85
};

var gui = new dat.GUI();
// gui.add(vizController, 'scale', 0, 100);
//var foodTags= ['vegetarian','vegan','nonVeg','paleo','pescetarian'];

gui.add(vizController, 'rotate');
gui.add(vizController, 'rotationSpeed', 0, 0.01);
gui.add(vizController, 'nodeVisibility', 0, 10.).onChange(updateColors);
gui.add(vizController, 'nodeSize', 0, 10).onChange(updateSizes);
gui.add(vizController, 'nodeContrast', 1, 3.).onChange(updateColors);
gui.add(vizController, 'edgeVisibility', 0, 1).onChange(updateColors);
var nodeColorsFood = gui.addFolder('Food Profile');

nodeColorsFood.addColor(vizController, 'pescetarian').onChange(updateColors);
nodeColorsFood.addColor(vizController, 'paleo').onChange(updateColors);
nodeColorsFood.addColor(vizController, 'nonVeg').onChange(updateColors);
nodeColorsFood.addColor(vizController, 'vegetarian').onChange(updateColors);
nodeColorsFood.addColor(vizController, 'vegan').onChange(updateColors);


var isolated = gui.addFolder('Isolate');

// isolated.add(vizController, 'showAll').onChange(function(){
//     ttclick=tt;
//     updateColors();
// });
// isolated.add(vizController, 'issueThreshold', 0, 2).onChange(updateColors);
isolated.add(vizController, 'issueSignalStrength', 0, 0.1).name("Signal Intensity").onChange(updateColors);
isolated.add(vizController, 'issueDimmed', 0, 0.01).name("Brightness Contrast").onChange(updateColors);
isolated.add(vizController, 'issueDesat', 0, 1).name("Desaturation").onChange(updateColors);
isolated.add(vizController, 'pescetarianBox').onChange(function(){
    ttclick=tt;
    updateColors();
});
isolated.add(vizController, 'paleoBox').onChange(function(){
    ttclick=tt;
    updateColors();
});
isolated.add(vizController, 'vegetarianBox').onChange(function(){
    ttclick=tt;
    updateColors();
});
isolated.add(vizController, 'nonVegBox').onChange(function(){
    ttclick=tt;
    updateColors();
});
isolated.add(vizController, 'veganBox').onChange(function(){
    ttclick=tt;
    updateColors();
});


// gui.addColor( vizController, 'bgColor' ).name( 'Background' ).onChange(function(){
//     renderer.setClearColor( vizController.bgColor, 1 );
// });
// var edgeSettings = gui.addFolder('Edges');
// edgeSettings.addColor(vizController, 'verified').onFinishChange(updateColors);
// gui.close()
// gui.remember(vizController);
// gui.addEventListener("mousedown", function() {
//     guiClick = true;
// });
//
// gui.addEventListener("mouseup", function() {
//     guiClick = false;
// });
var container = document.getElementById( 'container' );

var opts = {
    lines: 17 // The number of lines to draw
    , length: 0 // The length of each line
    , width: 8 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 0.6 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
};


function loadData() {
    var spinner = new Spinner(opts).spin(container);

    // trigger loader
    // slow the json load intentionally, so we can see it every load

        // load json data and trigger callback
        d3.json(chartConfig.data_url, function(data) {

            // stop spin.js loader
            spinner.stop();
            console.log("data loaded");
            // console.log(data);
            // instantiate chart within callback
            init(data);
            animate();
        });

}

var renderer, scene, camera, stats, controller;
var iter=0;
var sphere;
var group;
var edgeBody;
var nodeList;
var nodeMap;
var nodeCount;
var edgeList;
var ttclick=-100;
var prevCols=[];
// var capturer;
var tt=0;

var edgeIndices=[];
var IssueBoxes=["veganBox",
    "pescetarianBox",
    "vegetarianBox",
    "paleoBox",
    "nonVegBox"];
var checkedBoxes=[];
// var noise = [];

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
function trans(){
    return Math.exp(10*(ttclick-tt));
}

loadData();

function init(d) {

    nodeMap = CreateNodes(d['nodes']);
    nodeList = Array.from(nodeMap.values());
    console.log(nodeList);
    edgeList = CreateEdges(d['edges'],nodeMap);
    console.log(edgeList);

    camera = new THREE.PerspectiveCamera( 43, WIDTH / HEIGHT, 1, 10000 );
    camera.position.z = 1200;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

    nodeCount = nodeMap.size;
    // var radius = 200;

    // Nodes
    var positions = new Float32Array( nodeCount * 3 );
    var colors = new Float32Array( nodeCount * 3 );
    var sizes = new Float32Array( nodeCount );

    var vertex = new THREE.Vector3();
    var color = new THREE.Color( 0xffffff );

    for ( var i = 0; i < nodeCount; i ++ ) {
        vertex.copy(nodeList[i].multiplyScalar(0.01*vizController.scale));
        prevCols.push([0,0,0]);
        vertex.toArray( positions, i * 3 );
        var tempColor = nodeColors(nodeList[i],vizController,i);
        prevCols[i]=tempColor;
        color.fromArray(tempColor);


        color.toArray( colors, i * 3 );

        sizes[ i ] = 7*vizController['nodeSize'];

    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

    //

    var material = new THREE.ShaderMaterial( {

        uniforms: {
            amplitude: { value: 1.0 },
            color:     { value: new THREE.Color( 0xffffff ) },
            texture:   { value: new THREE.TextureLoader().load( "./textures/ball.png" ) }
        },
        vertexShader:   document.getElementById( 'nodeVertexshader' ).textContent,
        fragmentShader: document.getElementById( 'nodeFragmentshader' ).textContent,

        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true

    });

    //

    sphere = new THREE.Points( geometry, material );
    // scene.add( sphere );

    //


    // Edges...
    for (let edge of edgeList){
        let v1= edge['source'];
        let v2= edge['target'];
        edgeIndices.push(nodeList.indexOf(v1));
        edgeIndices.push(nodeList.indexOf(v2));
    }

    // var epositions = positions.slice(0);
    // var epositions = positions;

    //var ecolors = colors;
    // var opacities = new Float32Array( nodeCount );

    // var evertex = new THREE.Vector3();
    // var ecolor = new THREE.Color( 0xffffff );

    // for ( var i = 0; i < nodeCount; i ++ ) {
    //     evertex.copy(nodeList[i].multiplyScalar(0.01*vizController.scale));
    //
    //     evertex.toArray( epositions, i * 3 );
    //
    //     ecolor.fromArray(nodeColors(nodeList[i],vizController));
    //
    //
    //     ecolor.toArray( ecolors, i * 3 );
    //
    //     opacities[ i ] = vizController['edgeVisibility'];
    //
    // }

    var egeometry = new THREE.BufferGeometry();
    egeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    egeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    // egeometry.addAttribute( 'opacity', new THREE.BufferAttribute( opacities, 1 ) );
    egeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(edgeIndices), 1));

    //

    // var ematerial = new THREE.LineBasicMaterial({
    //     color: 0xffffff,
    //      transparent:true,
    //      opacity:0.1,
    //     blending:       THREE.AdditiveBlending
    // });

    var ematerial = new THREE.ShaderMaterial( {

        uniforms: {
            opacity: { value: 0.1*vizController["edgeVisibility"] },
            color:     { value: new THREE.Color( 0xffffff ) },
        },
        vertexShader:   document.getElementById( 'edgeVertexshader' ).textContent,
        fragmentShader: document.getElementById( 'edgeFragmentshader' ).textContent,

        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true

    });
    edgeBody = new THREE.LineSegments( egeometry, ematerial );
    // scene.add( edgeBody );
    group = new THREE.Object3D();
    group.add(sphere);
    group.add(edgeBody);
    scene.add(group);
    group.scale.set(3.9,3.9,3.9);
    //


     // ---- Lights
     // back light
     light = new THREE.DirectionalLight( 0xffffff, 0.8 );
     light.position.set( 100, 230, -100 );
     scene.add( light );

     // hemi
     light = new THREE.HemisphereLight( 0x00ffff, 0x29295e, 1 );
     light.position.set( 370, 200, 20 );
     scene.add( light );

     // ambient
     light = new THREE.AmbientLight( 0x111111 );
     scene.add( light );


    //

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( WIDTH, HEIGHT );
    // renderer.setClearColor( vizController.bgColor, 1 );
    renderer.autoClear = false;
    container.appendChild( renderer.domElement );
    controller = new THREE.OrbitControls(camera,renderer.domElement);

    // stats = new Stats();
    // container.appendChild( stats.dom );
    // capturer = new CCapture( { format: 'webm' } );


    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    // capturer.start();
    raycaster.setFromCamera(mouse, camera);
    // if(typeof sphere.children[1] !== 'undefined') {
        var intersections = raycaster.intersectObject(sphere);
        if(intersections.length && !dragging) {
            var match = nodeList[intersections[0].index];
            if(!tooltipVisible) {
                openTooltip()
            }
            loadTooltipData({
                body: match.twitterHandle,
            })

        } else if(intersections.length && tweet){
            var match = nodeList[intersections[0].index];
            if(!tooltipVisible) {
                openTooltip()
            }
            loadTooltipData({
                body: match.twitterHandle,
            });
            console.log(match);
            //openInNewTab("https://twitter.com/"+match.twitterHandle);
            openInNewTab("http://18.85.27.65:5002/profile/"+match.twitterUserId);

            tooltipVisible = false;
            closeTooltip();
        }

        else {
            tooltipVisible = false;
            closeTooltip();
        }


    // console.log(vizController.trump);
    gamepadControl();



    requestAnimationFrame( animate );

    render();
    // capturer.capture( renderer.domElement );
    // stats.update();

}

function render() {
    tt+=0.0003;

    coef=0.4;
    var time = Date.now() * 0.005;
    iter++;
    var tick = Math.floor(iter/3);
    if((iter % 3)== 0){
        if(tick<100){
            embed(tick);
        }
    }

    if((iter % 4)== 0){
        if(isChecked()||trans()>0.00001){
            updateColors();
        }
    }

    if( vizController.rotate){

        group.rotation.z += vizController.rotationSpeed;
        group.rotation.y += vizController.rotationSpeed;

    }

    // if( tick <200){
    //
    //     group.rotation.z = 29*Math.exp(-tt/coef)* tt;
    //     group.rotation.y = 29*Math.exp(-tt/coef)* tt;
    //
    // }
    // else{
    //     capturer.stop();
    //     capturer.save();
    // }


    controller.update();
    renderer.render( scene, camera );

}

function updateColors(){
    var geometry = sphere.geometry;
    var attributes = geometry.attributes;
    var newColors = new Float32Array( nodeCount * 3 );
    var newColor =  new THREE.Color( 0xffffff );
    for ( var i = 0; i < nodeCount; i ++ ) {
        var tempCol = nodeColors(nodeList[i],vizController,i);
        prevCols[i]=tempCol;
        newColor.fromArray(tempCol);
        newColor.toArray( newColors, i * 3 );

    }
    attributes.customColor = new THREE.BufferAttribute( newColors, 3 );
    attributes.customColor.needsUpdate = true;

    var egeometry = edgeBody.geometry;
    var eattributes = egeometry.attributes;
    var euniforms = edgeBody.material.uniforms;
    // var enewColors = new Float32Array( nodeCount * 3 );
    // var enewColor =  new THREE.Color( 0xffffff );
    // for ( var i = 0; i < nodeCount; i ++ ) {
    //     enewColor.fromArray(nodeColors(nodeList[i],vizController));
    //     enewColor.toArray( enewColors, i * 3 );
    // }
    euniforms.opacity.value = 0.1*vizController['edgeVisibility'];
    euniforms.opacity.value.needsUpdate = true;
    eattributes.customColor = new THREE.BufferAttribute( newColors, 3 );
    eattributes.customColor.needsUpdate = true;
}

function updateSizes(){
    "use strict";
    var geometry = sphere.geometry;
    var attributes = geometry.attributes;
    var newSizes = new Float32Array( nodeCount );
    for ( var i = 0; i < nodeCount; i ++ ) {
        newSizes[ i ] = 7*vizController['nodeSize'];
    }
    attributes.size = new THREE.BufferAttribute( newSizes,1 );
    attributes.size.needsUpdate = true;
}

function embed(k){
    "use strict";
    let iters=0;
    let poss = new Float32Array( nodeCount * 3 );
    let vx= new THREE.Vector3();
    for(let n of nodeList){
        vx.set(... n.ep[k]).multiplyScalar(0.01);
        vx.toArray( poss, iters * 3 );
        iters++;
    }
    var geometry = sphere.geometry;
    var attributes = geometry.attributes;
    attributes.position = new THREE.BufferAttribute( poss, 3 );
    attributes.position.needsUpdate = true;
    var egeometry = edgeBody.geometry;
    var eattributes =egeometry.attributes;
    eattributes.position = new THREE.BufferAttribute( poss, 3 );
    eattributes.position.needsUpdate = true;
}

function isChecked(){
    "use strict";
    for(let box of IssueBoxes){
        if(vizController[box]){
            return true;
        }
    }
    return false;
}