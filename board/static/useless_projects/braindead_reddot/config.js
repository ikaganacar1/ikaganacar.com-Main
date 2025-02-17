/*
  ____ ___  _   _ _____ ___ ____
 / ___/ _ \| \ | |  ___|_ _/ ___|
| |  | | | |  \| | |_   | | |  _
| |__| |_| | |\  |  _|  | | |_| |
 \____\___/|_| \_|_|   |___\____|
*/

var Config = {
  world: {
    gravity: 1,
    custom_window_size: false,
    window_size_x: 1000,
    window_size_y: 1000,
  },

  container_circle: {
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
    radius: 200,
    wallThickness: 30,
    numSegments: 30,
    color: "white",
    is_rotating: true,
    rotation_speed: 0.002,
    create_second_layer:true,
    create_third_layer:true,
  },

  camera: {
    camera_focus: false,
  },
  
  sound: {
    beep_on_collision:true,
  },

  smallBall: {
    X: window.innerWidth / 2,
    Y: window.innerHeight / 2,
    radius: 30,
    restitution: 1.03,
    friction: 0,
    frictionAir: 0.0001,
    color: 'red',
    initial_force: { x: 0.05, y: -0.05 },

  },
  
  mode: {
    allow_multiple_balls_on_click: true,
    grow_on_collision: false,
    growth_scale: 1.05,
    new_ball_on_collision: false,
    paint_on_collision: true,
    paint_random_color: false,
    paint_color:"rgb(255,0,0)",
    clear_the_scene: true,
    destroy_if_all_red: false,
    destroy_where_touched: true,
  },

};

document.addEventListener("DOMContentLoaded", function () {
  const configForm = document.getElementById("configForm");

  function createInput(name, value, path = "") {
    const label = document.createElement("label");
    label.textContent = name + ": ";

    const input = document.createElement("input");
    input.type = typeof value === "boolean" ? "checkbox" : "text";
    if (typeof value === "boolean") {
      input.checked = value;
    } else {
      input.value = value;
    }
    input.dataset.configKey = path ? `${path}.${name}` : name; 
    input.dataset.configType = typeof value; 

    const container = document.createElement("div");
    container.appendChild(label);
    container.appendChild(input);
    return container;
  }

  function createCollapsibleSection(title, content) {
    const section = document.createElement("div");
    section.classList.add("config-section");

    const header = document.createElement("div");
    header.classList.add("config-header");
    header.textContent = title;

    const body = document.createElement("div");
    body.classList.add("config-content");
    body.appendChild(content);

    header.addEventListener("click", () => {
      body.style.display = body.style.display === "none" ? "block" : "none";
    });

    section.appendChild(header);
    section.appendChild(body);
    return section;
  }

  function generateForm(config, parentElement, path = "") {
    for (const key in config) {
      if (typeof config[key] === "object" && config[key] !== null) {
        const subContainer = document.createElement("div");
        generateForm(config[key], subContainer, path ? `${path}.${key}` : key); 
        parentElement.appendChild(createCollapsibleSection(key, subContainer));
      } else {
        parentElement.appendChild(createInput(key, config[key], path)); 
      }
    }
  }

  generateForm(Config, configForm);
});
