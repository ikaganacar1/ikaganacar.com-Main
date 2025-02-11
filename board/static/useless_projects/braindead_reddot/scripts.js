/*
  ____ ___  _   _ _____ ___ ____
 / ___/ _ \| \ | |  ___|_ _/ ___|
| |  | | | |  \| | |_   | | |  _
| |__| |_| | |\  |  _|  | | |_| |
 \____\___/|_| \_|_|   |___\____|

*/

const Config = {
  world:{
    gravity:1

  },

  container_circle: {
    centerX: window.innerWidth /2,
    centerY: window.innerHeight /2,
    radius:200,
    wallThickness:30,
    numSegments:30,
    color: "white",

    is_rotating:true,
    rotation_speed:0.002,

  },

  smallBall: {
    //Body
    X:window.innerWidth/2,
    Y:window.innerHeight/2,
    radius:30,
    restitution:1.03,
    friction:0,
    frictionAir:0.0001,
    color:'red',
    initial_force:{ x: 0.05, y: -0.05 },
    
    //Camera 
    camera_focus:false,
    
    //Modes 
    allow_multiple_balls_on_click:true, 

    grow_on_collision:false,
    growth_scale:1.05, 
    
    new_ball_on_collision:false,
    
    paint_on_collision:true,
    clear_the_scene:true,
    destroy_if_all_red:false,
    destroy_where_touched:true,

  }
}


/*
  ____ ___  _   _ ____ _____
 / ___/ _ \| \ | / ___|_   _|
| |  | | | |  \| \___ \ | |
| |__| |_| | |\  |___) || |
 \____\___/|_| \_|____/ |_|
 
*/

const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Bounds = Matter.Bounds,
      Events = Matter.Events,
      Common = Matter.Common,
      Vector = Matter.Vector
      Composite = Matter.Composite,
      World = Matter.World,
      Body = Matter.Body,
      Collision = Matter.Collision;

const engine = Engine.create({ gravity: { y: Config.world.gravity } });
const world = engine.world;



/*
 _____ _   _ _   _  ____
|  ___| | | | \ | |/ ___|
| |_  | | | |  \| | |
|  _| | |_| | |\  | |___
|_|    \___/|_| \_|\____|

*/


function static_circle(
  centerX = Config.container_circle.centerX,
  centerY = Config.container_circle.centerY,
  radius=Config.container_circle.radius,
  wallThickness=Config.container_circle.wallThickness,
  numSegments=Config.container_circle.numSegments,
  rotation_speed=Config.container_circle.rotation_speed,
  is_rotating=Config.container_circle.is_rotating,
  color=Config.container_circle.color,
){
  var angles = [];
  var ringBodies = [];
  for (let i = 0; i < numSegments; i++) {
    var angle = (i / numSegments) * Math.PI * 2;
    var x = centerX + Math.cos(angle) * radius;
    var y = centerY + Math.sin(angle) * radius;

    var segment = Bodies.circle(x, y, wallThickness / 2, {
      isStatic: true,
      render: { fillStyle: color }
    });

    ringBodies.push(segment);
    angles.push(angle);

  }
  World.add(world, [...ringBodies]);


  function rotate() {
    for (let i = 0; i < ringBodies.length; i++) {
      angles[i] += rotation_speed;
      const newX = centerX + Math.cos(angles[i]) * radius;
      const newY = centerY + Math.sin(angles[i]) * radius;
      Body.setPosition(ringBodies[i], { x: newX, y: newY });
    }
    requestAnimationFrame(rotate);
  }

  if (is_rotating) {
    rotate();
  }

  return(ringBodies);
}

function create_ball(
  X=Config.smallBall.X,
  Y=Config.smallBall.Y,
  radius=Config.smallBall.radius,
  restitution=Config.smallBall.restitution,
  friction=Config.smallBall.friction,
  frictionAir=Config.smallBall.frictionAir,
  color=Config.smallBall.color,
) {

  const ball = Bodies.circle(X, Y, radius, {
    restitution: restitution,
    friction: friction,
    frictionAir: frictionAir,
    render: {
      fillStyle: color
    }
  });

  World.add(world,ball);
  return(ball);
}


function beep() {
  var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
  snd.play().catch(e => console.error("Audio play blocked:", e));
  return(snd);
}

/*
 __  __    _    ___ _   _
|  \/  |  / \  |_ _| \ | |
| |\/| | / _ \  | ||  \| |
| |  | |/ ___ \ | || |\  |
|_|  |_/_/   \_\___|_| \_|

*/
try {

  document.addEventListener("DOMContentLoaded", () => {

    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'black',
      }
    });
    render.options.hasBounds = true;
    document.body.appendChild(render.canvas);

    var static_circle_elems = static_circle();
    var second_layer = static_circle(
      centerX = Config.container_circle.centerX ,
      centerY = Config.container_circle.centerY,
      radius=Config.container_circle.radius * 1.5,
      wallThickness=Config.container_circle.wallThickness,
      numSegments=Config.container_circle.numSegments *1.5,
      rotation_speed=-Config.container_circle.rotation_speed,
      is_rotating=Config.container_circle.is_rotating,
      color=Config.container_circle.color,
    );

    var third_layer= static_circle(
      centerX = Config.container_circle.centerX ,
      centerY = Config.container_circle.centerY,
      radius=Config.container_circle.radius * 1.95,
      wallThickness=Config.container_circle.wallThickness,
      numSegments=Config.container_circle.numSegments *2,
      rotation_speed=Config.container_circle.rotation_speed,
      is_rotating=Config.container_circle.is_rotating,
      color=Config.container_circle.color,
    );





    var ball_list = [];
    var beep_list = [];

    document.addEventListener("click", () => {
      smallBall = create_ball();
      ball_list.push(smallBall);
      
      Body.applyForce(smallBall, smallBall.position, Config.smallBall.initial_force);

    }, { once: !Config.smallBall.allow_multiple_balls_on_click});

    
    let hasCollided = false;
    Events.on(engine, 'collisionStart', function (event) {
      event.pairs.forEach(pair => {
        
        b=beep();
        beep_list.push(b);
        
        //Paint on Collision Mode
        if (Config.smallBall.paint_on_collision) {
          
          if (Config.smallBall.destroy_where_touched){
            if (ball_list.includes(pair.bodyA) && !(third_layer.includes(pair.bodyB )) && !(ball_list.includes(pair.bodyB))  ) {
              World.remove(world, pair.bodyB);
            }
            else if (ball_list.includes(pair.bodyB)  && !(third_layer.includes(pair.bodyA)) && !(ball_list.includes(pair.bodyA)) ){
              World.remove(world, pair.bodyA);
            }

          }

          if (pair.bodyA === smallBall) {
            pair.bodyB.render.fillStyle = "rgb(255,0,0)";//`rgb(${Common.random(0,255)},${Common.random(0, 255)},${Common.random(0, 255)})`
          }
          else {
            pair.bodyA.render.fillStyle = "rgb(255,0,0)";//`rgb(${Common.random(0,255)},${Common.random(0, 255)},${Common.random(0, 255)})`
          }

          let there_is_still_white_layer1 = false;
          static_circle_elems.forEach(element => {
            if (element.render.fillStyle == "white") {
              there_is_still_white_layer1 = true;

            }

          });

          let there_is_still_white_layer2 = false;
          second_layer.forEach(element => {
            if (element.render.fillStyle == "white") {
              there_is_still_white_layer2 = true;

            }

          });


          let there_is_still_white_layer3 = false;
          third_layer.forEach(element => {
            if (element.render.fillStyle == "white") {
              there_is_still_white_layer3 = true;

            }

          });


          //Clears the scene
          if (there_is_still_white_layer3 == false && Config.smallBall.clear_the_scene == true){

            ball_list.forEach(element => {
              World.remove(world,element);
            });

            beep_list.forEach(element => {
              element.pause();
            });

            third_layer.forEach(element => {
              element.render.fillStyle = 'white';
            });
          }

          if (there_is_still_white_layer1 == false && Config.smallBall.destroy_if_all_red == true) {
            static_circle_elems.forEach(element => {
              World.remove(world,element)
            });

            if (there_is_still_white_layer2 == false) {
              second_layer.forEach(element => {
              World.remove(world,element)
            });
              
            }

          }

        }
          


        if (pair.bodyA === smallBall || pair.bodyB === smallBall) {
          if (!hasCollided) {
            
            //New ball on collision mode (not working so great :/ )
            if (Config.smallBall.new_ball_on_collision == true){
              new_ball = create_ball();
              Body.applyForce(new_ball, new_ball.position, { x: 0.01, y: -0.01 });

            }


            //Grow on collision Mode
            if (Config.smallBall.grow_on_collision == true){
              if (smallBall.area < /*took pi 3 to make it slightly small*/3*(200*200) ) { 
                Body.scale(smallBall, Config.smallBall.growth_scale, Config.smallBall.growth_scale);
              }
            }



            hasCollided = true;
          }
        }
      });
    });

    Events.on(engine, 'collisionEnd', function (event) {
      event.pairs.forEach(pair => {
        if (pair.bodyA === smallBall || pair.bodyB === smallBall) {
          hasCollided = false;
        }
      });
    });


    Events.on(engine, 'afterUpdate', function() {
      if (typeof smallBall !== 'undefined' && Config.smallBall.camera_focus) {

        const targetX = smallBall.position.x - render.options.width / 2;
        const targetY = smallBall.position.y - render.options.height / 2;

        Bounds.shift(render.bounds, { x: targetX, y: targetY });
      }
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);


  });
} catch (error) {
  console.log(error)
}
