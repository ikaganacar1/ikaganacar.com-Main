try {
  try {
    if (typeof MatterWrap !== 'undefined') {
      Matter.use('matter-wrap')
    } else {
      Matter.use(require('matter-wrap'))
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
    Svg = Matter.Svg,
    World = Matter.World,
    Events = Matter.Events
  //Composites = Matter.Composites,
  //Vector= Matter.Vector,
  //Vertices = Matter.Vertices,
  //MouseConstraint = Matter.MouseConstraint,

  const iEngine = Engine.create({ gravity: { y: 0 } }),
    world = iEngine.world

  const iRunner = Runner.create()

  const iRender = Render.create({
    element: document.body,
    engine: iEngine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      wireframes: false,
      background: 'transparent',
      wireframeBackground: 'transparent'
      //showAngleIndicator: true,
    }
  })

  var ratio = 1253376 / (window.screen.availWidth * window.screen.availHeight)

  if (ratio < 1) {
    ratio = 1
  }

  var circle_array = []
  const MAX_CIRCLES = 250
  const BALL_COLORS = ['#d9e8e6', '#9fb3c8', '#7dd3c7', '#89a8be', '#eaf2f1']
  const BUTTON_FILL = '#12313a'
  const CONTROL_STROKE = '#7dd3c7'
  const SOCIAL_STROKE = '#e8c46a'
  const LINK_FILL = '#eaf2f1'
  const LINK_STROKE = '#7dd3c7'
  const ikaLogoParts = []
  const clickableBodies = []
  const ICONS = {
    trash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#eaf2f1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 15h10l1-15"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
    palette: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#eaf2f1" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.3-3.5 1.2 1.2 0 0 1 .8-2.1H17a4 4 0 0 0 0-8.1A8.8 8.8 0 0 0 12 3Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="14.5" cy="7.8" r="1"/><circle cx="16.5" cy="11" r="1"/></svg>',
    gravity: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#eaf2f1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="3.4"/><path d="M7 4v4"/><path d="M12 3v5"/><path d="M17 4v4"/><path d="M7 8c0 3 2 4.5 5 4.5S17 11 17 8"/><path d="M5 20h14"/></svg>',
    refresh: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#eaf2f1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v6h-6"/></svg>',
    party: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#eaf2f1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 20 5-15 10 10-15 5Z"/><path d="m8 8 8 8"/><path d="M14 4h.01"/><path d="M18 2l1 2"/><path d="M22 7l-2 1"/><path d="M11 2l1 2"/></svg>',
    github: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eaf2f1"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.2-4.7-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.7 5 .4.3.7 1 .7 2v3.3c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eaf2f1"><path d="M6.8 8.8H3.6V20h3.2V8.8ZM5.2 4A1.9 1.9 0 1 0 5.2 7.8 1.9 1.9 0 0 0 5.2 4ZM20.4 13.6c0-3-1.6-5-4.2-5-1.9 0-2.7 1-3.2 1.8V8.8H9.8V20H13v-5.7c0-1.5.3-3 2.2-3 1.8 0 1.8 1.7 1.8 3.1V20h3.3v-6.4Z"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#eaf2f1" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>'
  }

  function iconTexture (name) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ICONS[name])}`
  }

  function trackClickableBody (body, hoverStroke = '#d9e8e6') {
    body.plugin = body.plugin || {}
    body.plugin.defaultLineWidth = body.render.lineWidth || 1
    body.plugin.defaultStrokeStyle = body.render.strokeStyle
    body.plugin.defaultOpacity = body.render.opacity || 1
    body.plugin.hoverStroke = hoverStroke
    clickableBodies.push(body)
    return body
  }

  function updateHoverState () {
    if (!mouse || !mouse.position.x) return

    let hasHover = false
    clickableBodies.forEach(body => {
      const hovering = Matter.Bounds.contains(body.bounds, mouse.position)
      hasHover = hasHover || hovering
      body.render.lineWidth = hovering
        ? body.plugin.defaultLineWidth + 2
        : body.plugin.defaultLineWidth
      body.render.strokeStyle = hovering
        ? body.plugin.hoverStroke
        : body.plugin.defaultStrokeStyle
      body.render.opacity = hovering ? 1 : body.plugin.defaultOpacity
    })
    document.body.style.cursor = hasHover ? 'pointer' : 'default'
  }

  function ikaGradientColor (index, time) {
    const hue = (174 + index * 34 + Math.sin(time + index * 1.45) * 22 + time * 18) % 360
    return `hsl(${hue}, 70%, 62%)`
  }

  function animateIkaLogo () {
    const time = performance.now() * 0.001
    ikaLogoParts.forEach((part, index) => {
      part.render.fillStyle = ikaGradientColor(index, time)
      part.render.strokeStyle = ikaGradientColor(index + 1, time + 0.5)
    })
  }

  function create_circles (x, y, color, apply_force) {
    if (color == 'gray') {
      /*let gray = Common.random(0,255);
      var curr_color = `rgb(${gray},${gray},${gray})`*/
      var curr_color = Common.choose(BALL_COLORS)
    } else {
      var curr_color = Common.choose(BALL_COLORS)
    }

    //ratio = 1;
    var radius = Math.sqrt(ratio) * Common.random(5, 30)

    //console.log(ratio,radius);
    //console.log(window.innerWidth , window.screen.availWidth);

    var circles = Bodies.circle(
      x + Common.random(-5, 5),
      y + Common.random(-5, 5),
      radius,
      {
        density: 0.0001,
        restitution: 0.25,
        friction: 0.1,
        //url: '#',
        render: {
          fillStyle: curr_color,
          strokeStyle: 'rgba(16, 19, 24, 0.55)',
          lineWidth: 2
        }
      }
    )

    if (apply_force == 1) {
      Body.applyForce(
        circles,
        { x: circles.position.x, y: circles.position.y },
        { x: Common.random(-0.03, 0.03), y: Common.random(-0.03, 0.03) }
      )
    }

    Composite.add(world, circles)
    circle_array.push(circles)
    if (circle_array.length > MAX_CIRCLES) {
      Composite.remove(world, circle_array.shift())
    }
    return circles
    //setTimeout(function(){Composite.remove(world,circles);},1000);
  }

  function del_obj (el) {
    for (let i = 0; i < circle_array.length; i++) {
      Composite.remove(iEngine.world, circle_array[i])
    }
    circle_array = []
  }

  var j = 0
  function color_obj (el) {
    if (circle_array.length === 0) return

    setTimeout(() => {
      circle_array[j].render.fillStyle = Common.choose(BALL_COLORS)
      j++
      if (j < circle_array.length) {
        color_obj()
      } else {
        j = 0
      }
    }, 10)
  }

  let mode = 1
  function gravity_obj (el) {
    switch (mode) {
      case 1:
        iEngine.gravity.y = 0.8
        mode = 2
        break
      case 2:
        iEngine.gravity.y = 0
        mode = 1
        break
      default:
        break
    }
  }

  var i = 0
  function party_obj (el) {
    setTimeout(() => {
      const angle = i * 0.72
      const distance = 70 + i * 2.5
      const body = create_circles(
        window.innerWidth / 2 + Math.cos(angle) * distance,
        window.innerHeight / 2 + Math.sin(angle) * distance,
        'gray',
        0
      )
      Body.applyForce(
        body,
        body.position,
        { x: Math.cos(angle) * 0.012, y: Math.sin(angle) * 0.012 }
      )
      i++
      if (i < 80) {
        party_obj()
      } else {
        i = 0
      }
    }, 10)
  }

  function refresh_page (el) {
    window.location.reload()
  }

  function create_walls () {
    const wall_bottom = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight,
      window.innerWidth,
      10,
      { isStatic: true, density: 10 }
    )
    const wall_top = Bodies.rectangle(
      window.innerWidth / 2,
      -10,
      window.innerWidth,
      10,
      { isStatic: true, density: 10 }
    )
    const wall_left = Bodies.rectangle(
      -10,
      window.innerHeight / 2,
      10,
      window.innerHeight,
      { isStatic: true, density: 10 }
    )
    const wall_right = Bodies.rectangle(
      window.innerWidth,
      window.innerHeight / 2,
      10,
      window.innerHeight,
      { isStatic: true, density: 10 }
    )
    Composite.add(world, [wall_bottom, wall_top, wall_left, wall_right])
  }

  function create_env_interaction_buttons () {
    var button_ratio
    if (window.innerWidth > window.innerHeight) {
      button_ratio = ratio
    } else {
      button_ratio = ratio / 2
    }
    const button_x = window.innerWidth - Math.max(72, 72 * button_ratio)
    const button_radius = Math.max(24, Math.min(34, 30 * button_ratio))
    const start_y = Math.max(110, window.innerHeight * 0.14)
    const button_gap = Math.max(84, 92 * button_ratio)

    var button_del_obj = Bodies.circle(
      button_x,
      start_y + button_gap * 3,
      button_radius,
      {
        isStatic: false,
        url: 'del_obj',
        restitution: 0.25,
        friction: 0.1,
        render: {
          fillStyle: BUTTON_FILL,
          strokeStyle: CONTROL_STROKE,
          lineWidth: 3,
          opacity: 0.96,
          sprite: {
            texture: iconTexture('trash'),
            xScale: 0.135 * button_ratio,
            yScale: 0.135 * button_ratio
          }
        }
      }
    )

    var button_color_obj = Bodies.circle(
      button_x,
      start_y + button_gap,
      button_radius,
      {
        isStatic: false,
        url: 'color_obj',
        restitution: 0.25,
        friction: 0.1,
        render: {
          fillStyle: BUTTON_FILL,
          strokeStyle: CONTROL_STROKE,
          lineWidth: 3,
          opacity: 0.96,
          sprite: {
            texture: iconTexture('palette'),
            xScale: 0.135 * button_ratio,
            yScale: 0.135 * button_ratio
          }
        }
      }
    )

    var button_gravity_obj = Bodies.circle(
      button_x,
      start_y + button_gap * 2,
      button_radius,
      {
        isStatic: false,
        url: 'gravity_obj',
        restitution: 0.25,
        friction: 0.1,
        render: {
          fillStyle: BUTTON_FILL,
          strokeStyle: CONTROL_STROKE,
          lineWidth: 3,
          opacity: 0.96,
          sprite: {
            texture: iconTexture('gravity'),
            xScale: 0.135 * button_ratio,
            yScale: 0.135 * button_ratio
          }
        }
      }
    )

    var button_refresh_page = Bodies.circle(
      button_x,
      start_y + button_gap * 4,
      button_radius,
      {
        isStatic: false,
        url: 'refresh_page',
        restitution: 0.25,
        friction: 0.1,
        render: {
          fillStyle: BUTTON_FILL,
          strokeStyle: CONTROL_STROKE,
          lineWidth: 3,
          opacity: 0.96,
          sprite: {
            texture: iconTexture('refresh'),
            xScale: 0.135 * button_ratio,
            yScale: 0.135 * button_ratio
          }
        }
      }
    )

    var button_party_obj = Bodies.circle(
      button_x,
      start_y,
      button_radius,
      {
        isStatic: false,
        url: 'party_obj',
        restitution: 0.25,
        friction: 0.1,
        render: {
          fillStyle: BUTTON_FILL,
          strokeStyle: CONTROL_STROKE,
          lineWidth: 3,
          opacity: 0.96,
          sprite: {
            texture: iconTexture('party'),
            xScale: 0.135 * button_ratio,
            yScale: 0.135 * button_ratio
          }
        }
      }
    )

    const link0 = Constraint.create({
      pointA: { x: button_x, y: 0 },
      bodyB: button_party_obj,
      stiffness: 0.1,
      length: Math.max(60, start_y * 0.5),
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: 'rgba(238, 244, 248, 0.36)'
      }
    })

    const link1 = Constraint.create({
      bodyA: button_party_obj,
      bodyB: button_color_obj,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: 'rgba(238, 244, 248, 0.36)'
      }
    })

    const link2 = Constraint.create({
      bodyA: button_color_obj,
      bodyB: button_gravity_obj,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: 'rgba(238, 244, 248, 0.36)'
      }
    })

    const link3 = Constraint.create({
      bodyA: button_gravity_obj,
      bodyB: button_del_obj,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: 'rgba(238, 244, 248, 0.36)'
      }
    })

    const link4 = Constraint.create({
      bodyA: button_del_obj,
      bodyB: button_refresh_page,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: 'rgba(238, 244, 248, 0.36)'
      }
    })

    const buttons = [
      button_color_obj,
      button_del_obj,
      button_gravity_obj,
      button_party_obj,
      button_refresh_page
    ]

    buttons.forEach(body => trackClickableBody(body, LINK_FILL))
    World.add(world, [link0, link1, link2, link3, link4])
    World.add(world, buttons)
  }

  function SVG_to_object () {
    var logoBodies = [],
      color = '#7dd3c7'
    ikaLogoParts.length = 0

    $('#svg')
      .find('path')
      .each(function (i, path) {
        //console.log(i);
        var v = Bodies.fromVertices(
          1,
          1,
          Svg.pathToVertices(path, 15),
          {
            url: 'ika',
            restitution: 0.1,
            //density:1,
            //frictionAir:0.01,
            render: {
              fillStyle: color,
              strokeStyle: '#eaf2f1',
              lineWidth: 1,
              opacity: 0.92
            }
          },
          true
        )

        var svg_ratio = Math.max(0.9, Math.min(1.45, Math.sqrt(ratio) * 1.15))
        if (window.innerWidth > window.innerHeight) {
          svg_ratio = Math.max(1.05, Math.min(1.65, Math.sqrt(ratio) * 1.35))
        }

        Body.scale(v, svg_ratio, svg_ratio)

        logoBodies.push(v)
        ikaLogoParts.push(v)
        v.parts.forEach(part => {
          if (part !== v && part.render) {
            ikaLogoParts.push(part)
          }
        })
      })

    const logo_gap = Math.max(18, window.innerWidth * 0.018)
    const body_widths = logoBodies.map(body => body.bounds.max.x - body.bounds.min.x)
    const total_width =
      body_widths.reduce((total, width) => total + width, 0) +
      logo_gap * (logoBodies.length - 1)
    const logo_y = window.innerHeight * 0.5
    const rotations = [-0.12, 0.08, -0.08]
    let next_x = window.innerWidth / 2 - total_width / 2

    logoBodies.forEach((body, i) => {
      const width = body_widths[i]
      Body.setPosition(body, {
        x: next_x + width / 2,
        y: logo_y
      })
      Body.rotate(body, rotations[i] || 0)
      next_x += width + logo_gap
    })

    World.add(world, logoBodies)
  }

  function create_initial_balls () {
    const count = 18
    const center_x = window.innerWidth / 2
    const center_y = window.innerHeight / 2
    const radius_x = Math.min(window.innerWidth * 0.32, 420)
    const radius_y = Math.min(window.innerHeight * 0.28, 260)

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      create_circles(
        center_x + Math.cos(angle) * radius_x,
        center_y + Math.sin(angle) * radius_y,
        'gray',
        0
      )
    }
  }

  const title_box = {
    w: 140,
    h: 80,
    body: Matter.Bodies.rectangle(
      window.innerWidth - window.innerWidth * 0.5,
      window.innerHeight * 0.72,
      5,
      5,
      { isStatic: true }
    ), //
    elem: document.querySelector('#box'),
    render () {
      const { x, y } = this.body.position
      this.elem.style.top = `${y - this.h / 2}px`
      this.elem.style.left = `${x - this.w / 2}px`
      this.elem.style.transform = `rotate(${this.body.angle}rad)`
    }
  }
  //World.add(world,box.body); //Don't need to see the box beacuse i just want to show the text

  var link_button = {
    w: window.innerWidth * 0.2,
    h: window.innerHeight * 0.07,
    body: Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight * 0.1,
      window.innerWidth * 0.2,
      window.innerHeight * 0.07,
      {
        restitution: 1,
        //isStatic: true,
        friction: 0.1,
        url: 'useless_projects',
        render: {
          fillStyle: LINK_FILL,
          strokeStyle: LINK_STROKE,
          lineWidth: 5,
          opacity: 0.94
        }
      }
    ),
    elem: document.querySelector('#link_button'),
    render () {
      const { x, y } = this.body.position
      const angle = this.body.angle

      this.elem.style.top = `${y - this.h / 2}px`
      this.elem.style.left = `${x - this.w / 2}px`

      this.elem.style.transform = `rotate(${angle}rad)`

      this.elem.style.width = `${this.w}px`
      this.elem.style.height = `${this.h}px`
    }
  }

  Composite.add(world, link_button.body)
  trackClickableBody(link_button.body, '#ffffff')

  Composite.add(
    world,
    Constraint.create({
      bodyA: link_button.body,
      pointB: { x: window.innerWidth / 2, y: 0 },
      stiffness: 0.7,
      length: 100,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    })
  )

  ;(function rerender () {
    link_button.render()
    title_box.render()
    requestAnimationFrame(rerender)
  })()

  function create_social_buttons () {
    var button_ratio
    if (window.innerWidth > window.innerHeight) {
      button_ratio = ratio
    } else {
      button_ratio = ratio / 2
    }
    const social_x = Math.max(72, window.innerWidth * 0.06)
    const social_radius = Math.max(24, Math.min(34, 30 * button_ratio))
    const social_start_y = Math.max(120, window.innerHeight * 0.18)
    const social_gap = Math.max(92, 122 * button_ratio)

    var button_github = Bodies.circle(
      social_x,
      social_start_y,
      social_radius,
      {
        isStatic: false,
        url: 'https://github.com/ikaganacar1',
        restitution: 0.25,
        friction: 0.1,
        render: {
          fillStyle: BUTTON_FILL,
          strokeStyle: SOCIAL_STROKE,
          lineWidth: 3,
          opacity: 0.96,
          sprite: {
            texture: iconTexture('github'),
            xScale: 0.135 * button_ratio,
            yScale: 0.135 * button_ratio
          }
        }
      }
    )

    var button_linkedin = Bodies.circle(
      social_x,
      social_start_y + social_gap,
      social_radius,
      {
        isStatic: false,
        url: 'https://www.linkedin.com/in/ismail-kağan-acar-24481b24b/',
        restitution: 0.25,
        friction: 0.1,
        render: {
          fillStyle: BUTTON_FILL,
          strokeStyle: SOCIAL_STROKE,
          lineWidth: 3,
          opacity: 0.96,
          sprite: {
            texture: iconTexture('linkedin'),
            xScale: 0.135 * button_ratio,
            yScale: 0.135 * button_ratio
          }
        }
      }
    )

    var button_mail = Bodies.circle(social_x, social_start_y + social_gap * 2, social_radius, {
      isStatic: false,
      url: 'mailto:acarismailkagan@gmail.com',
      restitution: 0.25,
      friction: 0.1,
      render: {
        fillStyle: BUTTON_FILL,
        strokeStyle: SOCIAL_STROKE,
        lineWidth: 3,
        opacity: 0.96,
        sprite: {
          texture: iconTexture('mail'),
          xScale: 0.135 * button_ratio,
          yScale: 0.135 * button_ratio
        }
      }
    })

    const link0 = Constraint.create({
      pointA: { x: social_x, y: 0 },
      bodyB: button_github,
      stiffness: 0.1,
      length: Math.max(70, social_start_y * 0.55),
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: 'rgba(238, 244, 248, 0.36)'
      }
    })

    const link1 = Constraint.create({
      bodyA: button_github,
      bodyB: button_linkedin,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: 'rgba(238, 244, 248, 0.36)'
      }
    })

    const link2 = Constraint.create({
      bodyA: button_linkedin,
      bodyB: button_mail,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: 'rgba(238, 244, 248, 0.36)'
      }
    })

    const buttons = [
      button_github,
      button_linkedin,
      button_mail
    ]

    buttons.forEach(body => trackClickableBody(body, LINK_FILL))
    World.add(world, [link0, link1, link2])
    World.add(world, buttons)
  } //end of create social button function

  //detect mouse
  let mouse = Mouse.create(iRender.canvas)
  let mouseConstraint = Matter.MouseConstraint.create(iEngine, {
    element: document.body,
    constraint: {
      render: {
        visible: false
      },
      stiffness: 0.2
    }
  })
  Matter.World.add(world, mouseConstraint)
  iRender.mouse = mouse

  function releaseMouseConstraint () {
    mouse.button = -1
    mouseConstraint.bodyB = null
    mouseConstraint.constraint.bodyB = null
    mouseConstraint.constraint.pointB = { x: 0, y: 0 }
  }

  window.addEventListener('pageshow', releaseMouseConstraint)
  window.addEventListener('pagehide', releaseMouseConstraint)
  window.addEventListener('blur', releaseMouseConstraint)

  //event detections
  let check_if_clicked = false
  Events.on(mouseConstraint, 'mousedown', function (event) {
    Body.set(title_box.body, 'position', { x: -1000 })
    check_if_clicked = true
    var mc = event.source
    var bodies = world.bodies

    if (!mc.bodyB) {
      for (let i = 0; i < bodies.length; i++) {
        var body = bodies[i]
        if (Matter.Bounds.contains(body.bounds, mc.mouse.position)) {
          var bodyUrl = body.url

          if (bodyUrl == 'del_obj') {
            del_obj()
            check_if_clicked = false
          } else if (bodyUrl == 'color_obj') {
            color_obj()
            check_if_clicked = false
          } else if (bodyUrl == 'gravity_obj') {
            gravity_obj()
            check_if_clicked = false
          } else if (bodyUrl == 'party_obj') {
            party_obj()
            check_if_clicked = false
          } else if (bodyUrl == 'refresh_page') {
            refresh_page()
            check_if_clicked = false
          } else if (bodyUrl == 'ika') {
            check_if_clicked = false
          } else if (bodyUrl != undefined) {
            releaseMouseConstraint()
            window.open(bodyUrl, '_self')
            check_if_clicked = false
          }

          break
        }
      }
    }
  })

  Events.on(mouseConstraint, 'mouseup', function (event) {
    check_if_clicked = false
  })

  //if it is suitable create circles when clicked
  Events.on(iEngine, 'afterUpdate', function (event) {
    animateIkaLogo()
    updateHoverState()

    if (!mouse.position.x) return

    if (check_if_clicked) {
      create_circles(mouse.position.x, mouse.position.y, 'gray', 0)
    }
  })

  create_walls()
  create_initial_balls()
  SVG_to_object()
  create_env_interaction_buttons()
  create_social_buttons()

  let matterActive = false
  function startMatter () {
    if (matterActive) return
    Render.run(iRender)
    Runner.run(iRunner, iEngine)
    matterActive = true
  }

  function stopMatter () {
    if (!matterActive) return
    Render.stop(iRender)
    Runner.stop(iRunner)
    matterActive = false
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      releaseMouseConstraint()
      stopMatter()
    } else {
      startMatter()
    }
  })

  startMatter()
} catch (e) {
  console.error(e)
} //global try catch to see the errors
