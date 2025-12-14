import * as THREE from "three"

export class LumiGlassCrackFxV2 {
  private container: HTMLElement
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.OrthographicCamera
  private rafId: number | null = null

  // === core state ===
  private value = 0 // 当前强度 0~1
  private target = 0 // 目标强度 0~1
  private shattering = false

  // === visuals ===
  private crack!: THREE.LineSegments
  private crackGeo!: THREE.BufferGeometry
  private crackMat!: THREE.LineBasicMaterial
  private totalLineVertices = 0 // drawRange 需要的 count(顶点数)

  private shards: Array<{
    mesh: THREE.Mesh
    vx: number
    vy: number
    rz: number
  }> = []

  // ====== parameters（默认就能看，想调只调这）======
  private IN_SPEED = 0.14
  private OUT_SPEED = 0.22

  private DEADZONE = 0.03 // 小于这个直接认为“要消失”
  private EPS = 0.002 // 小于这个就彻底 stop

  private MAX_OPACITY = 0.85
  private JITTER_PX = 3.5 // 抖动只在 >0 时存在

  private RAY_COUNT = 42 // 裂纹数量（越大越密）
  private RAY_STEPS = 10 // 每条裂纹分段数（越大越细腻）
  private CURVE = 26 // 弧度扰动（越大越像“应力线”）
  private NOISE = 18 // 不规则程度

  private SHARD_COUNT = 120
  private SHARD_FORCE = 520 // 向外爆散力度
  private SHARD_LIFT = 120 // 轻微上扬
  private SHATTER_SEC = 0.45

  constructor(opts: { container: HTMLElement; zIndex?: number; dpr?: number }) {
    this.container = opts.container
    if (getComputedStyle(this.container).position === "static") {
      this.container.style.position = "relative"
    }

    const dpr = opts.dpr ?? Math.min(2, window.devicePixelRatio)
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    this.renderer.setPixelRatio(dpr)
    this.renderer.setClearColor(0x000000, 0)

    const el = this.renderer.domElement
    el.style.position = "absolute"
    el.style.inset = "0"
    el.style.pointerEvents = "none"
    el.style.zIndex = String(opts.zIndex ?? 20)
    this.container.appendChild(el)

    const { w, h } = this.size()
    this.camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -10, 10)
    this.camera.position.z = 1

    this.resize()
    this.buildCracks()
    this.buildShards()

    this.tick = this.tick.bind(this)
    this.rafId = requestAnimationFrame(this.tick)
    window.addEventListener("resize", this.resize)
  }

  /**
   * 你唯一喂的数据：pressure 0~1
   * - 0 => 必须完全消失
   * - 1 => 最密最亮
   */
  apply({ pressure }: { pressure: number }) {
    if (this.shattering) return

    const p = clamp01(pressure)

    // ✅ 关键：小于 deadzone 就直接归零（保证能消掉）
    this.target = p < this.DEADZONE ? 0 : p
  }

  /** 切页时调用：爆散 + 淡出 */
  async shatter() {
    if (this.shattering) return
    this.shattering = true

    // 先让裂纹满强度（看起来像“应力到顶”）
    this.value = Math.max(this.value, 0.9)
    this.target = this.value

    // 初始化碎片速度（向外爆散 + 上扬）
    for (const s of this.shards) {
      const x = (Math.random() - 0.5) * 2
      const y = (Math.random() - 0.5) * 2
      const len = Math.hypot(x, y) || 1
      const nx = x / len
      const ny = y / len

      s.vx = nx * (this.SHARD_FORCE * (0.6 + Math.random() * 0.7))
      s.vy = ny * (this.SHARD_FORCE * (0.6 + Math.random() * 0.7)) + this.SHARD_LIFT

      s.rz = (Math.random() - 0.5) * 8
      const mat = s.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 1
      s.mesh.visible = true
    }

    const t0 = performance.now()
    const dur = this.SHATTER_SEC * 1000

    await new Promise<void>((resolve) => {
      const step = () => {
        const k = clamp01((performance.now() - t0) / dur)
        const ease = 1 - Math.pow(1 - k, 3)

        for (const s of this.shards) {
          s.mesh.position.x += s.vx * 0.016
          s.mesh.position.y += s.vy * 0.016
          s.mesh.rotation.z += s.rz * 0.016
          const mat = s.mesh.material as THREE.MeshBasicMaterial
          mat.opacity = 1 - ease
        }

        // 裂纹淡掉
        this.crackMat.opacity = (1 - ease) * this.MAX_OPACITY
        const drawVerts = Math.floor(this.totalLineVertices * (1 - ease))
        this.crackGeo.setDrawRange(0, Math.max(0, drawVerts))

        if (k < 1) requestAnimationFrame(step)
        else resolve()
      }
      requestAnimationFrame(step)
    })

    // ✅ 彻底 reset
    this.hardHide()
    this.shattering = false
  }

  destroy() {
    window.removeEventListener("resize", this.resize)
    if (this.rafId) cancelAnimationFrame(this.rafId)

    this.scene.traverse((obj) => {
      // @ts-ignore
      if (obj.geometry) obj.geometry.dispose()
      // @ts-ignore
      if (obj.material) obj.material.dispose()
    })

    this.renderer.dispose()
    this.renderer.domElement.remove()
  }

  // ================= internal =================

  private tick(time: number) {
    // ✅ 状态追踪（target = pressure），保证密度随 pressure 变
    if (this.value < this.target) {
      this.value = Math.min(this.target, this.value + this.IN_SPEED)
    } else if (this.value > this.target) {
      this.value = Math.max(this.target, this.value - this.OUT_SPEED)
    }

    // ✅ 到 0 就彻底隐藏、停止抖动（你说的“往中间不消失”就在这）
    if (this.value <= this.EPS && this.target === 0 && !this.shattering) {
      this.hardHide()
      this.renderer.render(this.scene, this.camera)
      this.rafId = requestAnimationFrame(this.tick)
      return
    } else {
      this.crack.visible = true
    }

    // ✅ 越接近 1 越“密”：drawRange 控制绘制段数
    const drawVerts = Math.floor(this.totalLineVertices * this.value)
    this.crackGeo.setDrawRange(0, Math.max(2, drawVerts))

    // ✅ 透明度也随 value 增强
    this.crackMat.opacity = this.value * this.MAX_OPACITY

    // ✅ 抖动只在可见时存在
    const j = this.value * this.JITTER_PX
    this.crack.position.set((hash(time * 0.001) - 0.5) * j, (hash(time * 0.0017 + 9.3) - 0.5) * j, 0)

    this.renderer.render(this.scene, this.camera)
    this.rafId = requestAnimationFrame(this.tick)
  }

  private hardHide() {
    this.value = 0
    this.target = 0

    this.crack.visible = false
    this.crack.position.set(0, 0, 0)
    this.crackMat.opacity = 0
    this.crackGeo.setDrawRange(0, 0)

    for (const s of this.shards) {
      s.mesh.visible = false
      s.mesh.position.set(0, 0, 0)
      s.mesh.rotation.set(0, 0, 0)
      const mat = s.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0
    }
  }

  private buildCracks() {
    const { w, h } = this.size()

    // 裂纹从“偏右一点的点”发散，会更像你截图那种构图（也更中二）
    const originX = w * 0.12
    const originY = 0

    const lines: number[] = []
    const maxLen = Math.min(w, h) * 0.85

    for (let i = 0; i < this.RAY_COUNT; i++) {
      const a = (i / this.RAY_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.35
      let px = originX
      let py = originY

      for (let s = 1; s <= this.RAY_STEPS; s++) {
        const t = s / this.RAY_STEPS
        const len = maxLen * t

        // 弧度 + 不规则
        const bend = Math.sin(t * Math.PI) * this.CURVE
        const nx = Math.cos(a + Math.sin(t * 2 + i) * 0.12) * len
        const ny = Math.sin(a + Math.sin(t * 2 + i) * 0.12) * len

        const x = originX + nx + (Math.random() - 0.5) * this.NOISE + Math.cos(a + Math.PI / 2) * bend
        const y = originY + ny + (Math.random() - 0.5) * this.NOISE + Math.sin(a + Math.PI / 2) * bend

        lines.push(px, py, 0)
        lines.push(x, y, 0)

        px = x
        py = y

        // 分叉（更像玻璃裂纹）
        if (s >= 3 && Math.random() < 0.18) {
          const aa = a + (Math.random() - 0.5) * 0.8
          const bx = px + Math.cos(aa) * (maxLen * 0.18) + (Math.random() - 0.5) * this.NOISE
          const by = py + Math.sin(aa) * (maxLen * 0.18) + (Math.random() - 0.5) * this.NOISE
          lines.push(px, py, 0, bx, by, 0)
        }
      }
    }

    this.crackGeo = new THREE.BufferGeometry()
    this.crackGeo.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3))

    // LineSegments：drawRange 的 count 是“顶点数”
    this.totalLineVertices = lines.length / 3

    this.crackMat = new THREE.LineBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0,
    })

    this.crack = new THREE.LineSegments(this.crackGeo, this.crackMat)
    this.crack.visible = false
    this.scene.add(this.crack)
  }

  private buildShards() {
    const geo = new THREE.PlaneGeometry(10, 2)
    for (let i = 0; i < this.SHARD_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
      })
      const m = new THREE.Mesh(geo, mat)
      m.visible = false

      // 初始位置随机散在“裂纹中心附近”
      const { w, h } = this.size()
      m.position.set(w * 0.12 + (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, 0)

      m.rotation.z = Math.random() * Math.PI
      this.scene.add(m)

      this.shards.push({ mesh: m, vx: 0, vy: 0, rz: 0 })
    }
  }

  private resize = () => {
    const { w, h } = this.size()
    this.renderer.setSize(w, h, false)
    this.camera.left = -w / 2
    this.camera.right = w / 2
    this.camera.top = h / 2
    this.camera.bottom = -h / 2
    this.camera.updateProjectionMatrix()

    // 重建裂纹（尺寸变了就必须重建，否则你会觉得“对不齐”）
    this.scene.remove(this.crack)
    this.crackGeo?.dispose()
    this.crackMat?.dispose()
    this.buildCracks()

    // shards 不强制重建，够用
  }

  private size() {
    const r = this.container.getBoundingClientRect()
    return { w: Math.max(2, r.width), h: Math.max(2, r.height) }
  }
}

// ===== helpers =====
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}
function hash(t: number) {
  const s = Math.sin(t * 12.9898) * 43758.5453
  return s - Math.floor(s)
}
