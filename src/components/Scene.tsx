import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Fixed full-screen 3D background: a glowing "quantum knot" — two counter-rotating
 * torus knots made of flowing light particles, orbit rings with satellites,
 * floating code glyphs and crystal shards. It drifts between sections as the
 * visitor scrolls and tilts toward the cursor.
 */

type Props = { activeIndex: number };

type Target = { x: number; y: number; s: number; op: number };

const ACCENT_A = new THREE.Color("#4a80f0"); // sapphire
const ACCENT_B = new THREE.Color("#6ec8ff"); // ice

function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.25, "rgba(255,255,255,0.8)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeGlyph(text: string) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.font = "600 64px 'JetBrains Mono', ui-monospace, Menlo, monospace";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = "rgba(110,200,255,0.9)";
  g.shadowBlur = 18;
  g.fillStyle = "#cfe6ff";
  g.fillText(text, 128, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Turns a torus-knot's vertices into a glowing point cloud with a travelling pulse. */
function knotPoints(
  geo: THREE.TorusKnotGeometry,
  tubular: number,
  radial: number,
  sizeBase: number,
  sprite: THREE.Texture,
  pr: number,
  cA: THREE.Color,
  cB: THREE.Color
) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const n = pos.count;
  const col = new Float32Array(n * 3);
  const phase = new Float32Array(n);
  const size = new Float32Array(n);
  const tmp = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const along = Math.floor(i / (radial + 1)) / tubular; // 0..1 along the knot
    phase[i] = along * Math.PI * 2;
    tmp.copy(cA).lerp(cB, 0.5 + 0.5 * Math.sin(along * Math.PI * 4));
    col.set([tmp.r, tmp.g, tmp.b], i * 3);
    size[i] = sizeBase * (0.6 + Math.random() * 0.8);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", pos);
  g.setAttribute("aCol", new THREE.BufferAttribute(col, 3));
  g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPR: { value: pr }, uMap: { value: sprite }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute vec3 aCol; attribute float aPhase; attribute float aSize;
      uniform float uTime; uniform float uPR;
      varying vec3 vCol; varying float vGlow;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        // a bright pulse that races along the knot
        float wave = 0.5 + 0.5 * sin(aPhase * 5.0 - uTime * 2.6);
        float pulse = pow(wave, 3.0);
        vGlow = pulse; vCol = aCol;
        gl_PointSize = aSize * (0.55 + pulse * 1.1) * uPR * (300.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform float uOpacity;
      varying vec3 vCol; varying float vGlow;
      void main(){
        float a = texture2D(uMap, gl_PointCoord).a;
        gl_FragColor = vec4(vCol * (0.7 + vGlow * 1.3), a * uOpacity * (0.22 + vGlow * 0.78));
      }`,
  });
  return { points: new THREE.Points(g, m), geo: g, mat: m };
}

export default function Scene({ activeIndex }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(activeIndex);

  useEffect(() => {
    indexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL: the page still looks fine on the plain gradient
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const sprite = makeSprite();
    const disposables: { dispose: () => void }[] = [sprite];

    const root = new THREE.Group(); // moves between sections
    const net = new THREE.Group(); // rotates
    root.add(net);
    scene.add(root);

    /* ---------- outer light-knot ---------- */
    const T1 = 420;
    const R1 = 26;
    const knotGeo = new THREE.TorusKnotGeometry(1.55, 0.52, T1, R1, 2, 3);
    const outer = knotPoints(knotGeo, T1, R1, 0.2, sprite, pixelRatio, ACCENT_A, ACCENT_B);
    net.add(outer.points);
    disposables.push(outer.geo, outer.mat, knotGeo);

    /* faint structural mesh so the knot reads as a solid form */
    const meshGeo = new THREE.TorusKnotGeometry(1.55, 0.52, 120, 10, 2, 3);
    const meshWire = new THREE.WireframeGeometry(meshGeo);
    const meshMat = new THREE.LineBasicMaterial({
      color: ACCENT_A,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    net.add(new THREE.LineSegments(meshWire, meshMat));
    disposables.push(meshGeo, meshWire, meshMat);

    /* ---------- inner counter-rotating knot ---------- */
    const T2 = 220;
    const R2 = 12;
    const knot2Geo = new THREE.TorusKnotGeometry(0.78, 0.2, T2, R2, 3, 2);
    const inner = knotPoints(knot2Geo, T2, R2, 0.26, sprite, pixelRatio, ACCENT_B, new THREE.Color("#dff1ff"));
    const innerGroup = new THREE.Group();
    innerGroup.add(inner.points);
    net.add(innerGroup);
    disposables.push(inner.geo, inner.mat, knot2Geo);

    /* ---------- core ---------- */
    const coreGeo = new THREE.OctahedronGeometry(0.34, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: ACCENT_B,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    net.add(core);
    const haloMat = new THREE.SpriteMaterial({
      map: sprite,
      color: ACCENT_A,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(4.4, 4.4, 1);
    net.add(halo);
    disposables.push(coreGeo, coreMat, haloMat);

    /* ---------- orbit rings ---------- */
    const rings: THREE.Mesh[] = [];
    const ringMats: THREE.MeshBasicMaterial[] = [];
    [
      { r: 3.15, tilt: [1.2, 0.2], color: ACCENT_B, speed: 0.18 },
      { r: 3.55, tilt: [0.5, -0.9], color: ACCENT_A, speed: -0.12 },
    ].forEach((cfg) => {
      const g = new THREE.TorusGeometry(cfg.r, 0.006, 8, 220);
      const m = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(g, m);
      ring.rotation.set(cfg.tilt[0], cfg.tilt[1], 0);
      ring.userData.speed = cfg.speed;
      const sat = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: sprite,
          color: cfg.color,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      sat.scale.set(0.35, 0.35, 1);
      sat.userData.r = cfg.r;
      ring.add(sat);
      ring.userData.sat = sat;
      net.add(ring);
      rings.push(ring);
      ringMats.push(m);
      disposables.push(g, m, sat.material);
    });

    /* ---------- dust ---------- */
    const DUST = 520;
    const dPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 28;
      dPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      dPos[i * 3 + 2] = -Math.random() * 14 - 1;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    const dustMat = new THREE.PointsMaterial({
      map: sprite,
      size: 0.09,
      color: 0xb8d4ff,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
    disposables.push(dustGeo, dustMat);

    /* ---------- floating crystal shards (depth layers) ---------- */
    const shardGeos = [new THREE.OctahedronGeometry(1, 0), new THREE.TetrahedronGeometry(1, 0), new THREE.IcosahedronGeometry(1, 0)];
    const shardGroup = new THREE.Group();
    scene.add(shardGroup);
    type Floater = { mesh: THREE.Object3D; spin: THREE.Vector3; base: THREE.Vector3; depth: number; phase: number };
    const shards: Floater[] = [];
    const shardMats: THREE.Material[] = [];
    const SHARDS = 16;
    for (let i = 0; i < SHARDS; i++) {
      const geo = shardGeos[i % shardGeos.length];
      const col = i % 3 === 0 ? ACCENT_B : ACCENT_A;
      const g = new THREE.Group();
      const wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      const face = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
      );
      g.add(wire, face);
      g.scale.setScalar(0.12 + Math.random() * 0.34);
      const depth = -Math.random() * 9 - 0.5;
      const base = new THREE.Vector3((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 12, depth);
      g.position.copy(base);
      shardGroup.add(g);
      shards.push({
        mesh: g,
        spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.7),
        base,
        depth,
        phase: Math.random() * Math.PI * 2,
      });
      shardMats.push(wire.material as THREE.Material, face.material as THREE.Material);
      disposables.push(wire.geometry, wire.material, face.material);
    }
    shardGeos.forEach((g) => disposables.push(g));

    /* ---------- floating code glyphs ---------- */
    const GLYPHS = ["</>", "{ }", "λ", "0101", "∑", "AI", "[ ]", "=>", "py", "∇", "01", "#!"];
    const glyphGroup = new THREE.Group();
    scene.add(glyphGroup);
    const glyphs: Floater[] = [];
    const glyphMats: THREE.SpriteMaterial[] = [];
    GLYPHS.forEach((txt, i) => {
      const tex = makeGlyph(txt);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(1.5, 0.75, 1);
      const depth = -Math.random() * 7 - 0.5;
      const base = new THREE.Vector3(((i / GLYPHS.length) * 2 - 1) * 11 + (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 11, depth);
      sp.position.copy(base);
      glyphGroup.add(sp);
      glyphs.push({ mesh: sp, spin: new THREE.Vector3(), base, depth, phase: Math.random() * Math.PI * 2 });
      glyphMats.push(mat);
      disposables.push(tex, mat);
    });

    /* ---------- layout / interaction ---------- */
    let aspect = 1;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      aspect = w / h;
      renderer.setSize(w, h);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // a click sends a pulse through the knot (spin boost)
    let boost = 0;
    const onDown = () => {
      boost = 1;
    };
    window.addEventListener("pointerdown", onDown, { passive: true });

    const targetFor = (i: number): Target => {
      const vh = 2 * 9 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const W = vh * aspect;
      if (aspect < 0.95) {
        return [
          { x: 0, y: 3.0, s: 0.55, op: 0.32 },
          { x: 0, y: 3.2, s: 0.5, op: 0.12 },
          { x: 0, y: 3.2, s: 0.5, op: 0.12 },
          { x: 0, y: 3.2, s: 0.5, op: 0.12 },
          { x: 0, y: 3.2, s: 0.5, op: 0.12 },
          { x: 0, y: 3.0, s: 0.5, op: 0.14 },
        ][i] ?? { x: 0, y: 3, s: 0.5, op: 0.12 };
      }
      return [
        { x: 0, y: 0.2, s: 1.12, op: 0.85 },
        { x: -W * 0.43, y: 0.4, s: 0.55, op: 0.28 },
        { x: W * 0.45, y: 0.2, s: 0.55, op: 0.26 },
        { x: -W * 0.46, y: -0.3, s: 0.52, op: 0.24 },
        { x: W * 0.45, y: 0.1, s: 0.55, op: 0.26 },
        { x: 0, y: -1.2, s: 1.0, op: 0.16 },
      ][i] ?? { x: 0, y: 0, s: 1, op: 0.2 };
    };

    const cur: Target = { ...targetFor(indexRef.current) };
    root.position.set(cur.x, cur.y, 0);
    root.scale.setScalar(cur.s);

    const clock = new THREE.Clock();
    let time = 0;
    let spinExtra = 0;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const motion = reduced ? 0 : 1;
      time += dt * motion;

      const k = 1 - Math.exp(-dt * 2.6);
      const t = targetFor(indexRef.current);
      cur.x += (t.x - cur.x) * k;
      cur.y += (t.y - cur.y) * k;
      cur.s += (t.s - cur.s) * k;
      cur.op += (t.op - cur.op) * k;

      mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 4));
      mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 4));

      boost *= Math.exp(-dt * 1.6);
      spinExtra += boost * dt * 5 * motion;

      const scrollY = window.scrollY;
      root.position.set(cur.x + mouse.x * 0.25, cur.y - mouse.y * 0.18 - scrollY * 0.0004, 0);
      root.scale.setScalar(cur.s * (1 + boost * 0.06));

      camera.position.z = 9 - Math.min(scrollY / 6000, 1) * 1.2;
      camera.position.x = mouse.x * 0.35;
      camera.position.y = -mouse.y * 0.25;
      camera.lookAt(0, 0, 0);

      net.rotation.y = time * 0.18 + spinExtra + scrollY * 0.0012 + mouse.x * 0.35;
      net.rotation.x = Math.sin(time * 0.2) * 0.18 + mouse.y * 0.22;
      innerGroup.rotation.y = -time * 0.6;
      innerGroup.rotation.z = time * 0.35;
      core.rotation.x = time * 0.8;
      core.rotation.y = time * 1.1;
      core.scale.setScalar(1 + Math.sin(time * 1.6) * 0.14);
      halo.scale.setScalar(4.4 + Math.sin(time * 1.6) * 0.3 + boost * 1.2);

      rings.forEach((ring, i) => {
        ring.rotation.z += ring.userData.speed * dt * motion;
        const sat = ring.userData.sat as THREE.Sprite;
        const a = time * (0.5 + i * 0.25) * (i ? -1 : 1);
        sat.position.set(Math.cos(a) * sat.userData.r, Math.sin(a) * sat.userData.r, 0);
      });

      outer.mat.uniforms.uTime.value = time;
      outer.mat.uniforms.uOpacity.value = cur.op;
      inner.mat.uniforms.uTime.value = time * 1.3;
      inner.mat.uniforms.uOpacity.value = cur.op;
      meshMat.opacity = 0.13 * cur.op;
      coreMat.opacity = 0.9 * cur.op;
      haloMat.opacity = 0.5 * cur.op;
      ringMats.forEach((m) => (m.opacity = 0.5 * cur.op));
      (rings[0].userData.sat as THREE.Sprite).material.opacity = cur.op;
      (rings[1].userData.sat as THREE.Sprite).material.opacity = cur.op;
      shardMats.forEach((m, i) => (m.opacity = (i % 2 === 0 ? 0.5 : 0.05) * (0.55 + cur.op * 0.45)));

      // shards: tumble + bob + parallax by depth (near ones move more)
      shards.forEach((sh) => {
        const par = 1 / (1 - sh.depth * 0.18);
        sh.mesh.rotation.x += sh.spin.x * dt * motion;
        sh.mesh.rotation.y += sh.spin.y * dt * motion;
        sh.mesh.rotation.z += sh.spin.z * dt * motion;
        sh.mesh.position.set(
          sh.base.x - mouse.x * 1.4 * par,
          sh.base.y + Math.sin(time * 0.5 + sh.phase) * 0.35 + scrollY * 0.0012 * par * 3 - mouse.y * 0.9 * par,
          sh.base.z
        );
      });

      // code glyphs drift upward and wrap, fading near the edges
      glyphs.forEach((gl, i) => {
        const par = 1 / (1 - gl.depth * 0.18);
        const y = gl.base.y + time * (0.35 + (i % 4) * 0.12) + gl.phase + scrollY * 0.0014 * par * 3;
        const wrapped = ((((y + 7) % 14) + 14) % 14) - 7;
        gl.mesh.position.set(gl.base.x - mouse.x * 1.1 * par + Math.sin(time * 0.4 + gl.phase) * 0.3, wrapped - mouse.y * 0.7 * par, gl.base.z);
        const edge = 1 - Math.min(1, Math.abs(wrapped) / 7);
        glyphMats[i].opacity = 0.42 * edge * (0.5 + cur.op * 0.5);
      });

      // dust parallax
      dust.position.y = scrollY * 0.0016;
      dust.rotation.y = time * 0.01 + mouse.x * 0.05;
      dust.position.x = -mouse.x * 0.3;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
