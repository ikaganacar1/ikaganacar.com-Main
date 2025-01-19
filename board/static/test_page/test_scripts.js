try {
  //

  try {
    if (typeof MatterWrap !== "undefined") {
      Matter.use("matter-wrap");
    } else {
      Matter.use(require("matter-wrap"));
    }
  } catch (e) {}

  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events;

  const iEngine = Engine.create({ gravity: { y: 0 } }),
    world = iEngine.world;

  const iRunner = Runner.create();

  const iRender = Render.create({
    element: document.body,
    engine: iEngine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: "transparent",
      wireframeBackground: "transparent",
      //showAngleIndicator: true,
    },
  });
  Render.run(iRender);
  Runner.run(iRunner, iEngine);

  let mouse = Mouse.create(iRender.canvas);
  let mouseConstraint = Matter.MouseConstraint.create(iEngine, {
    element: document.body,
    constraint: {
      render: {
        visible: false,
      },
      stiffness: 0.2,
    },
  });
  Matter.World.add(world, mouseConstraint);
  iRender.mouse = mouse;

  function create_walls() {
    const wall_bottom = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 10,
      window.innerWidth,
      10,
      { isStatic: true, density: 10 }
    );
    const wall_top = Bodies.rectangle(
      window.innerWidth / 2,
      -10,
      window.innerWidth * 2,
      10,
      { isStatic: true, density: 10, restitution: 0 }
    );
    const wall_left = Bodies.rectangle(
      -10,
      window.innerHeight / 2,
      10,
      window.innerHeight,
      { isStatic: true, restitution: 0, density: 10 }
    );
    const wall_right = Bodies.rectangle(
      window.innerWidth,
      window.innerHeight / 2,
      10,
      window.innerHeight,
      { isStatic: true, restitution: 0, density: 10 }
    );

    Composite.add(world, [wall_top, wall_bottom, wall_left, wall_right]);
  }

  create_walls();

  var ratio = 1253376 / (window.screen.availWidth * window.screen.availHeight);

  if (ratio < 1) {
    ratio = 1;
  }
  console.log(ratio);

  function create_clapboard_sign(x, y, link_tag, link) {
    const board_w = ratio > 1 ? 200 : 150;
    const board_h = ratio > 1 ? 300 : 150;
    const text_size = ratio > 1 ? "70px" : "40px";

    // Create the main clapboard object
    var clapboard = {
      w: board_w,
      h: board_h,
      body: Bodies.rectangle(x, y, board_w, board_h, {
        restitution: 0.5,
        friction: 0.1,
        render: {
          fillStyle: "#000000",
          strokeStyle: "gray",
          lineWidth: 2,
          opacity: 0.8,
        },
      }),
      elem: document.querySelector("#clapboard_sign"),
      render() {
        const { x, y } = this.body.position;
        const angle = this.body.angle;
        
        this.elem.style.top = `${y - this.h / 2}px`;
        this.elem.style.left = `${x - this.w / 2}px`;
        this.elem.style.transform = `rotate(${angle}rad)`;
        this.elem.style.width = `${this.w}px`;
        this.elem.style.height = `${this.h}px`;
      }
    };

    // Create the link button
    var link_button = {
      w: board_w * 0.2,
      h: board_h * 0.1,
      body: Bodies.rectangle(
        x,
        y + board_h / 2 + 30,
        board_w * 0.2,
        board_h * 0.1,
        {
          restitution: 1,
          friction: 1,
          url: link,
          render: {
            fillStyle: "#EBB55F",
            strokeStyle: "#050321",
            lineWidth: 5,
            opacity: 0.8,
          },
        }
      ),
      elem: document.querySelector(`#${link_tag}`),
      render() {
        const { x, y } = this.body.position;
        const angle = this.body.angle;

        this.elem.style.top = `${y - this.h / 2}px`;
        this.elem.style.left = `${x - this.w / 2}px`;
        this.elem.style.transform = `rotate(${angle}rad)`;
        this.elem.style.width = `${this.w}px`;
        this.elem.style.height = `${this.h}px`;
      },
    };

    // Add to world
    Composite.add(world, [clapboard.body, link_button.body]);

    // Add constraint between clapboard and link button
    const constraint = Constraint.create({
      bodyA: clapboard.body,
      bodyB: link_button.body,
      length: 60,
      stiffness: 0.5,
      render: {
        strokeStyle: "#393E46",
        lineWidth: 2,
        type: "line",
      },
    });

    //Composite.add(world, constraint);

    if (ratio > 1) {
      document.getElementById(`${link_tag}_p`).style.fontSize = text_size;
    }

    return [clapboard, link_button];
  }

  clapboard = create_clapboard_sign(
    window.innerWidth * 0.7, // x position
    window.innerHeight * 0.4, // y position
    "clapboard_link", // link tag
    "#" // URL for the link
  );

  (function rerender() {
    // Inside your rerender function:
    clapboard[0].render();
    clapboard[1].render();

    Matter.Engine.update(iEngine);
    requestAnimationFrame(rerender);
  })();

  window.addEventListener('resize', () => {
    Render.setPixelRatio(iRender, window.devicePixelRatio);
    Render.setSize(iRender, window.innerWidth, window.innerHeight);
});

  Events.on(mouseConstraint, "mousedown", function (event) {
    var mc = event.source;
    var bodies = world.bodies;

    if (!mc.bodyB) {
      for (i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        if (Matter.Bounds.contains(body.bounds, mc.mouse.position)) {
          if (body.url != undefined) {
            window.open(body.url, "_self");
            check_if_clicked = false;
          }

          break;
        }
      }
    }
  });
} catch (e) {
  console.log(e);
} //global try catch to see the errors on browser console
