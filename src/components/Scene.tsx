import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Fixed full-screen 3D background: a living "neural network" sphere
 * (nodes, synapses, travelling signals, orbit rings, dust) that drifts
 * between sections as the visitor scrolls and tilts toward the cursor.
 */

type Props = { activeIndex: number };

type Target = { x: number; y: number; s: number; op: number };

const ACCENT_A = new THREE.Color("#8b5cf6"); // violet
const ACCENT_B = new THREE.Color("#22d3ee"); // cyan

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

function fibonacciSphere(n: number, r: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = phi * i;
    pts.push(new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r));
  }
  return pts;
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

    /* ---------- nodes ---------- */
    const outer = fibonacciSphere(130, 2.3);
    const inner = fibonacciSphere(36, 1.15);
    const nodes = [...outer, ...inner];

    // add slight organic jitter
    nodes.forEach((p) => p.add(new THREE.Vector3((Math.random() - 0.5) * 0.14, (Math.random() - 0.5) * 0.14, (Math.random() - 0.5) * 0.14)));

    const nPos = new Float32Array(nodes.length * 3);
    const nCol = new Float32Array(nodes.length * 3);
    const nPhase = new Float32Array(nodes.length);
    const nSize = new Float32Array(nodes.length);
    nodes.forEach((p, i) => {
      nPos.set([p.x, p.y, p.z], i * 3);
      const c = ACCENT_A.clone().lerp(ACCENT_B, (p.y / 2.3 + 1) / 2);
      nCol.set([c.r, c.g, c.b], i * 3);
      nPhase[i] = Math.random() * Math.PI * 2;
      nSize[i] = i < outer.length ? 0.2 + Math.random() * 0.12 : 0.3 + Math.random() * 0.12;
    });

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
    nodeGeo.setAttribute("aCol", new THREE.BufferAttribute(nCol, 3));
    nodeGeo.setAttribute("aPhase", new THREE.BufferAttribute(nPhase, 1));
    nodeGeo.setAttribute("aSize", new THREE.BufferAttribute(nSize, 1));
    const nodeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPR: { value: pixelRatio },
        uMap: { value: sprite },
        uOpacity: { value: 1 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aCol; attribute float aPhase; attribute float aSize;
        uniform float uTime; uniform float uPR;
        varying vec3 vCol; varying float vGlow;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float pulse = 0.62 + 0.38 * sin(uTime * 1.5 + aPhase);
          vGlow = pulse; vCol = aCol;
          gl_PointSize = aSize * (0.8 + pulse * 0.5) * uPR * (320.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap; uniform float uOpacity;
        varying vec3 vCol; varying float vGlow;
        void main(){
          float a = texture2D(uMap, gl_PointCoord).a;
          gl_FragColor = vec4(vCol * (0.9 + vGlow * 0.7), a * uOpacity * (0.55 + vGlow * 0.45));
        }`,
    });
    net.add(new THREE.Points(nodeGeo, nodeMat));
    disposables.push(nodeGeo, nodeMat);

    /* ---------- synapses ---------- */
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    const addEdge = (a: number, b: number) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seen.has(k)) return;
      seen.add(k);
      edges.push([a, b]);
    };
    for (let i = 0; i < outer.length; i++) {
      for (let j = i + 1; j < outer.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 0.95) addEdge(i, j);
      }
    }
    for (let i = 0; i < inner.length; i++) {
      const ii = outer.length + i;
      for (let j = i + 1; j < inner.length; j++) {
        if (nodes[ii].distanceTo(nodes[outer.length + j]) < 0.85) addEdge(ii, outer.length + j);
      }
      const near = outer
        .map((p, idx) => ({ idx, d: p.distanceTo(nodes[ii]) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      near.forEach((n) => addEdge(ii, n.idx));
    }

    const lPos = new Float32Array(edges.length * 6);
    const lCol = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      lPos.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], i * 6);
      const ca = ACCENT_A.clone().lerp(ACCENT_B, (nodes[a].y / 2.3 + 1) / 2);
      const cb = ACCENT_A.clone().lerp(ACCENT_B, (nodes[b].y / 2.3 + 1) / 2);
      lCol.set([ca.r, ca.g, ca.b, cb.r, cb.g, cb.b], i * 6);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lCol, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    net.add(new THREE.LineSegments(lineGeo, lineMat));
    disposables.push(lineGeo, lineMat);

    /* ---------- travelling signals ---------- */
    const SIGNALS = 46;
    const sigEdge = new Int32Array(SIGNALS);
    const sigT = new Float32Array(SIGNALS);
    const sigSpeed = new Float32Array(SIGNALS);
    for (let i = 0; i < SIGNALS; i++) {
      sigEdge[i] = Math.floor(Math.random() * edges.length);
      sigT[i] = Math.random();
      sigSpeed[i] = 0.25 + Math.random() * 0.5;
    }
    const sigPos = new Float32Array(SIGNALS * 3);
    const sigGeo = new THREE.BufferGeometry();
    sigGeo.setAttribute("position", new THREE.BufferAttribute(sigPos, 3));
    const sigMat = new THREE.PointsMaterial({
      map: sprite,
      size: 0.28,
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    net.add(new THREE.Points(sigGeo, sigMat));
    disposables.push(sigGeo, sigMat);

    /* ---------- core ---------- */
    const coreGeo = new THREE.IcosahedronGeometry(0.5, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: ACCENT_B,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    net.add(core);
    const haloMat = new THREE.SpriteMaterial({
      map: sprite,
      color: ACCENT_A,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(4.2, 4.2, 1);
    net.add(halo);
    disposables.push(coreGeo, coreMat, haloMat);

    /* ---------- orbit rings ---------- */
    const rings: THREE.Mesh[] = [];
    const ringMats: THREE.MeshBasicMaterial[] = [];
    [
      { r: 3.1, tilt: [1.2, 0.2], color: ACCENT_B, speed: 0.18 },
      { r: 3.5, tilt: [0.5, -0.9], color: ACCENT_A, speed: -0.12 },
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
      // satellite
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
      color: 0x9aa4ff,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
    disposables.push(dustGeo, dustMat);

    /* ---------- layout / interaction ---------- */
    let width = 1;
    let height = 1;
    let aspect = 1;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      aspect = width / height;
      renderer.setSize(width, height);
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

    const targetFor = (i: number): Target => {
      const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const W = vh * aspect;
      if (aspect < 0.95) {
        // portrait / mobile: centered, quieter, behind the content
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
        { x: W * 0.24, y: 0, s: 1, op: 1 },
        { x: -W * 0.43, y: 0.4, s: 0.55, op: 0.26 },
        { x: W * 0.45, y: 0.2, s: 0.55, op: 0.24 },
        { x: -W * 0.46, y: -0.3, s: 0.52, op: 0.22 },
        { x: W * 0.45, y: 0.1, s: 0.55, op: 0.24 },
        { x: 0, y: -1.2, s: 1.0, op: 0.14 },
      ][i] ?? { x: 0, y: 0, s: 1, op: 0.2 };
    };

    const cur: Target = { ...targetFor(indexRef.current) };
    root.position.set(cur.x, cur.y, 0);
    root.scale.setScalar(cur.s);

    const sigA = new THREE.Vector3();
    const clock = new THREE.Clock();
    let time = 0;
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

      const scrollY = window.scrollY;
      root.position.set(cur.x + mouse.x * 0.25, cur.y - mouse.y * 0.18 - scrollY * 0.0004, 0);
      root.scale.setScalar(cur.s);

      net.rotation.y = time * 0.12 + scrollY * 0.0012 + mouse.x * 0.35;
      net.rotation.x = Math.sin(time * 0.15) * 0.12 + mouse.y * 0.22;
      core.rotation.x = time * 0.5;
      core.rotation.y = time * 0.7;
      const breathe = 1 + Math.sin(time * 1.4) * 0.08;
      core.scale.setScalar(breathe);
      halo.scale.setScalar(4.2 + Math.sin(time * 1.4) * 0.25);

      rings.forEach((ring, i) => {
        ring.rotation.z += ring.userData.speed * dt * motion;
        const sat = ring.userData.sat as THREE.Sprite;
        const a = time * (0.5 + i * 0.25) * (i ? -1 : 1);
        sat.position.set(Math.cos(a) * sat.userData.r, Math.sin(a) * sat.userData.r, 0);
      });

      // signals
      const sp = sigGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < SIGNALS; i++) {
        sigT[i] += sigSpeed[i] * dt * motion;
        if (sigT[i] >= 1) {
          // hop to a connected edge so the signal feels like it propagates
          const [, b] = edges[sigEdge[i]];
          const options: number[] = [];
          for (let e = 0; e < edges.length && options.length < 8; e++) {
            const idx = (sigEdge[i] * 7 + e * 13) % edges.length;
            if (edges[idx][0] === b || edges[idx][1] === b) options.push(idx);
          }
          sigEdge[i] = options.length ? options[Math.floor(Math.random() * options.length)] : Math.floor(Math.random() * edges.length);
          sigT[i] = 0;
        }
        const [a, b] = edges[sigEdge[i]];
        sigA.copy(nodes[a]).lerp(nodes[b], sigT[i]);
        sp.setXYZ(i, sigA.x, sigA.y, sigA.z);
      }
      sp.needsUpdate = true;

      // opacity by section
      nodeMat.uniforms.uTime.value = time;
      nodeMat.uniforms.uOpacity.value = cur.op;
      lineMat.opacity = 0.3 * cur.op;
      sigMat.opacity = Math.min(1, cur.op * 1.1);
      coreMat.opacity = 0.85 * cur.op;
      haloMat.opacity = 0.55 * cur.op;
      ringMats.forEach((m) => (m.opacity = 0.5 * cur.op));
      (rings[0].userData.sat as THREE.Sprite).material.opacity = cur.op;
      (rings[1].userData.sat as THREE.Sprite).material.opacity = cur.op;

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
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
