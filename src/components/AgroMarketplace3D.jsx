import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

// Utility: create a holographic label as a Sprite from canvas
function createHoloTag(text = '$299 • Live') {
  const canvas = document.createElement('canvas')
  const size = 256
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  // background glow
  const grad = ctx.createRadialGradient(size/2, size/2, 10, size/2, size/2, size/2)
  grad.addColorStop(0, 'rgba(198,255,63,0.25)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0,0,size,size)
  // rounded rect chip
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  const w = size * 0.8, h = size * 0.28
  const x = (size-w)/2, y = size*0.6
  const r = 18
  ctx.beginPath()
  ctx.moveTo(x+r, y)
  ctx.arcTo(x+w, y, x+w, y+h, r)
  ctx.arcTo(x+w, y+h, x, y+h, r)
  ctx.arcTo(x, y+h, x, y, r)
  ctx.arcTo(x, y, x+w, y, r)
  ctx.closePath()
  ctx.fill()
  // text
  ctx.font = 'bold 28px Inter, Arial, sans-serif'
  ctx.fillStyle = '#C6FF3F'
  ctx.textAlign = 'center'
  ctx.fillText(text, size/2, y + h*0.7)
  // scanline
  ctx.strokeStyle = 'rgba(198,255,63,0.65)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(size*0.2, size*0.35)
  ctx.lineTo(size*0.8, size*0.35)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.encoding = THREE.sRGBEncoding
  const material = new THREE.SpriteMaterial({ map: texture, depthWrite: false, transparent: true })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(1.4, 1.4, 1)
  return sprite
}

// Utility: kinetic light ring
function createLightRing(radius = 3, color = 0x38f8e2) {
  const geo = new THREE.RingGeometry(radius * 0.98, radius, 96)
  const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
  const ring = new THREE.Mesh(geo, mat)
  ring.rotation.x = -Math.PI / 2
  return ring
}

// Utility: hydroponic vine using TubeGeometry + curve
function createVine(pathRadius = 0.06, height = 4, turns = 3, color = 0x5ce1a9) {
  const pts = []
  const coils = turns * Math.PI * 2
  for (let i = 0; i <= 200; i++) {
    const t = i / 200
    const theta = coils * t
    const r = 1.2 + 0.2 * Math.sin(t * Math.PI * 4)
    pts.push(new THREE.Vector3(Math.cos(theta) * r, t * height, Math.sin(theta) * r))
  }
  const curve = new THREE.CatmullRomCurve3(pts)
  const geo = new THREE.TubeGeometry(curve, 300, pathRadius, 12, false)
  const mat = new THREE.MeshPhysicalMaterial({ color, metalness: 0.2, roughness: 0.4, transmission: 0.2, opacity: 1, clearcoat: 1, clearcoatRoughness: 0.1 })
  const mesh = new THREE.Mesh(geo, mat)
  return mesh
}

// Utility: drone (simple stylized)
function createDrone() {
  const group = new THREE.Group()
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, roughness: 0.6, metalness: 0.8, clearcoat: 1, sheen: 0.3 })
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, emissive: 0x111111, metalness: 1, roughness: 0.25 })

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.35, 8, 16), bodyMat)
  group.add(body)

  for (let i = 0; i < 4; i++) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16), trimMat)
    arm.rotation.z = Math.PI / 2
    arm.position.set(0, 0.12, 0)
    const angle = (i / 4) * Math.PI * 2
    const armGroup = new THREE.Group()
    armGroup.rotation.y = angle
    armGroup.add(arm)

    const rotor = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 12, 24), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1, roughness: 0.2 }))
    rotor.position.x = 0.4
    armGroup.add(rotor)
    group.add(armGroup)
  }
  // payload sample pod
  const pod = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, thickness: 0.5, roughness: 0.15, metalness: 0.1 }))
  pod.position.y = -0.25
  group.add(pod)
  return group
}

// Utility: satellite dish
function createDish() {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.2 })
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI), mat)
  dish.scale.y = 0.5
  dish.rotation.x = -Math.PI / 2
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.2, 16), mat)
  stand.position.y = -0.6
  const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0xC6FF3F, emissive: 0x102010 }))
  feed.position.set(0, 0.2, 0.2)
  group.add(dish, stand, feed)
  return group
}

// Utility: product pod
function createProductPod(options = {}) {
  const group = new THREE.Group()
  const { coreColor = 0xeeeeee, ringColor = 0x00ffd5, label = 'Smart Seed $129' } = options

  // liquid glass shell
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 48, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      thickness: 1.0,
      roughness: 0.1,
      metalness: 0.0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      ior: 1.5,
      attenuationColor: new THREE.Color(0x9be6ff),
      attenuationDistance: 2
    })
  )

  // matte ceramic core
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.24, 2),
    new THREE.MeshStandardMaterial({ color: coreColor, roughness: 0.9, metalness: 0.1 })
  )

  // chrome + copper trims
  const trim1 = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.015, 24, 64), new THREE.MeshStandardMaterial({ color: 0xe7e7e7, metalness: 1, roughness: 0.2 }))
  const trim2 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.01, 24, 64), new THREE.MeshStandardMaterial({ color: 0xB87333, metalness: 1, roughness: 0.35 }))

  // analytics orbits
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.005, 8, 128),
    new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: 0.6 })
  )
  orbit.rotation.x = Math.PI / 3

  const orbit2 = orbit.clone()
  orbit2.rotation.y = Math.PI / 4

  const tag = createHoloTag(label)
  tag.position.set(0.9, 0.2, 0)

  group.add(shell, core, trim1, trim2, orbit, orbit2, tag)
  core.position.y = 0.02
  trim1.rotation.x = Math.PI / 2
  trim2.rotation.y = Math.PI / 2
  return group
}

export default function AgroMarketplace3D() {
  const containerRef = useRef(null)
  const exporterRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0A0A0A)
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.06)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200)
    camera.position.set(6, 5.5, 9)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setSize(width, height)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.maxPolarAngle = Math.PI * 0.495
    controls.minDistance = 3
    controls.maxDistance = 20

    // Lights: teal-to-amber gradient feel + god-ray-ish spot cones
    const hemi = new THREE.HemisphereLight(0x62ffe5, 0xffd39a, 0.5)
    scene.add(hemi)
    const dir1 = new THREE.DirectionalLight(0xC6FF3F, 1.1)
    dir1.position.set(5, 10, 4)
    scene.add(dir1)
    const dir2 = new THREE.DirectionalLight(0xffa95a, 0.7)
    dir2.position.set(-6, 7, -5)
    scene.add(dir2)

    // volumetric cones (fake god rays)
    const coneMat = new THREE.MeshBasicMaterial({ color: 0x38f8e2, transparent: true, opacity: 0.08 })
    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(2.8, 6, 64, 1, true), coneMat)
    cone1.position.set(-2, 3, 1)
    cone1.rotation.x = -Math.PI / 2.5
    scene.add(cone1)

    const coneMat2 = new THREE.MeshBasicMaterial({ color: 0xffb066, transparent: true, opacity: 0.06 })
    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(3.4, 7, 64, 1, true), coneMat2)
    cone2.position.set(3, 4, -2)
    cone2.rotation.x = -Math.PI / 2.8
    scene.add(cone2)

    // Glass pavilion floor
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(7, 7, 0.18, 128),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.85, thickness: 2.0, roughness: 0.2, metalness: 0.05, clearcoat: 1 })
    )
    floor.position.y = -0.2
    floor.receiveShadow = true
    scene.add(floor)

    // luminous pathways and kinetic rings
    const ringRadii = [6.2, 5.2, 4.1, 3.0]
    ringRadii.forEach((r, i) => {
      const ring = createLightRing(r, i % 2 ? 0x38f8e2 : 0xffb066)
      ring.position.y = 0.001 * i
      scene.add(ring)
    })

    // central trading column
    const column = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.8, 6, 64),
      new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.35, clearcoat: 1 })
    )
    column.position.y = 3/2
    scene.add(column)

    const holoBand = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 24, 128), new THREE.MeshBasicMaterial({ color: 0xC6FF3F, transparent: true, opacity: 0.8 }))
    holoBand.position.y = 2.2
    scene.add(holoBand)

    // floating product pods suspended magnetically
    const pods = []
    const labels = [
      'Smart Seeds $129',
      'Nutrient Cart. $79',
      'Nano-Soil Pack $49',
      'Bio-Polymer Gel $99',
      'Sensor Capsule $159'
    ]
    for (let i = 0; i < 5; i++) {
      const pod = createProductPod({
        coreColor: [0xe7e7e7, 0xe0ffe0, 0xe0f0ff, 0xffefdf, 0xf2e6ff][i],
        ringColor: i % 2 ? 0x38f8e2 : 0xffb066,
        label: labels[i]
      })
      const angle = (i / 5) * Math.PI * 2
      const radius = 3.5 + (i % 2 ? 0.5 : -0.1)
      pod.position.set(Math.cos(angle) * radius, 1.2 + 0.4 * Math.sin(i), Math.sin(angle) * radius)
      scene.add(pod)
      pods.push({ group: pod, angle, radius, speed: 0.2 + 0.05 * i })
    }

    // hovering drones delivering samples
    const drones = []
    for (let i = 0; i < 3; i++) {
      const d = createDrone()
      d.position.set(-2 + i * 2.4, 2.3 + 0.2 * i, -1.5 + 0.5 * i)
      scene.add(d)
      drones.push(d)
    }

    // satellite uplink dishes
    const dish1 = createDish()
    dish1.position.set(-5.2, 0.5, 2.2)
    scene.add(dish1)
    const dish2 = createDish()
    dish2.position.set(5, 0.5, -2.5)
    dish2.rotation.y = Math.PI
    scene.add(dish2)

    // hydroponic vines curling around
    const vine1 = createVine(0.05, 3.5, 3, 0x4fe7a8)
    vine1.position.set(1.4, 0.1, 1.2)
    scene.add(vine1)
    const vine2 = createVine(0.04, 3.2, 2.5, 0x3bd3b0)
    vine2.position.set(-1.6, 0.1, -1.1)
    scene.add(vine2)

    // subtle floating fog planes
    const fogMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.03, depthWrite: false })
    for (let i = 0; i < 6; i++) {
      const fog = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), fogMat)
      fog.rotation.x = -Math.PI / 2
      fog.position.y = 0.3 + i * 0.15
      scene.add(fog)
    }

    // tiny orbiting analytics around pods
    const analytics = []
    pods.forEach((p, idx) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshStandardMaterial({ color: idx % 2 ? 0x38f8e2 : 0xffb066, emissive: idx % 2 ? 0x082a28 : 0x2a1608 }))
      scene.add(s)
      analytics.push({ mesh: s, ref: p, t: 0 })
    })

    // exporter ref
    exporterRef.current = new GLTFExporter()

    // animation loop
    let t = 0
    const clock = new THREE.Clock()

    function animate() {
      const dt = clock.getDelta()
      t += dt
      pods.forEach((p, i) => {
        const yFloat = 0.15 * Math.sin(t * 2 + i)
        const rot = 0.3 * Math.sin(t * 1.5 + i)
        p.group.position.y = 1.2 + yFloat
        p.group.rotation.y += 0.3 * dt
        // gentle orbital drift
        const ang = p.angle + t * (0.08 + 0.02 * i)
        p.group.position.x = Math.cos(ang) * p.radius
        p.group.position.z = Math.sin(ang) * p.radius
      })
      drones.forEach((d, i) => {
        d.position.y = 2.2 + 0.25 * Math.sin(t * 2 + i)
        d.rotation.y += 0.5 * dt
      })
      analytics.forEach((a, i) => {
        const r = 0.9
        const ang = t * 2 + i
        a.mesh.position.copy(a.ref.group.position).add(new THREE.Vector3(Math.cos(ang) * r, 0.2 + 0.1 * Math.sin(ang*2), Math.sin(ang) * r))
      })
      holoBand.rotation.z += 0.6 * dt
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  const handleExportGLB = () => {
    if (!sceneRef.current || !exporterRef.current) return
    const exporter = exporterRef.current
    exporter.parse(
      sceneRef.current,
      (result) => {
        const blob = new Blob([result], { type: 'model/gltf-binary' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'knprr-agroverse-marketplace.glb'
        a.click()
        URL.revokeObjectURL(url)
      },
      (error) => {
        console.error('GLB export error', error)
        alert('Export failed. Check console for details.')
      },
      { binary: true, trs: false, onlyVisible: true, maxTextureSize: 2048 }
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white">
      <div className="relative h-[80vh] md:h-[90vh]" ref={containerRef}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute left-4 bottom-4 flex gap-3">
          <button onClick={handleExportGLB} className="px-4 py-2 rounded-full bg-[#C6FF3F] text-black font-semibold shadow-[0_0_20px_#C6FF3F] hover:shadow-[0_0_32px_#C6FF3F] transition">
            Export GLB
          </button>
          <a href="/" className="px-4 py-2 rounded-full border border-white/20 text-white/90 backdrop-blur hover:border-white/40">Back</a>
        </div>
        <div className="absolute right-4 top-4 text-sm text-zinc-300 bg-white/5 border border-white/10 rounded-xl px-3 py-2 backdrop-blur">
          3D Futuristic Agro Marketplace • Use mouse to orbit/zoom
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10 text-zinc-300">
        <p>
          Floating product pods with holographic pricing, kinetic analytics, a circular glass pavilion with luminous pathways and a central data column. Hovering drones, satellite uplinks, hydroponic vines, teal→amber lighting, subtle fog, and god-ray cones. Materials use glass, ceramic, chrome, and copper-inspired PBR settings. Ready to export as GLB.
        </p>
      </div>
    </div>
  )
}
