"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const LOGO_SIZE = 40;
const COL_SPACING = 80;
const ROW_SPACING = 80;
const SPEED = 0.2;
const OPACITY = 0.07;

export default function LogoScrollBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(
      -width / 2, width / 2,
      height / 2, -height / 2,
      -1, 1
    );

    const scene = new THREE.Scene();

    const texture = new THREE.TextureLoader().load("/logo-white.svg");
    texture.colorSpace = THREE.SRGBColorSpace;

    const numCols = Math.ceil(width / COL_SPACING) + 2;
    const numRows = Math.ceil(height / ROW_SPACING) + 4;

    // sprites[colIdx] = array of sprites for that column
    const columns: THREE.Sprite[][] = [];

    function buildGrid(w: number, h: number) {
      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: OPACITY,
        depthWrite: false,
      });

      const cols = Math.ceil(w / COL_SPACING) + 2;
      const rows = Math.ceil(h / ROW_SPACING) + 4;

      const built: THREE.Sprite[][] = [];

      for (let c = 0; c < cols; c++) {
        const colX = -w / 2 + c * COL_SPACING;
        // brick stagger: odd columns offset by half a row
        const staggerY = c % 2 === 1 ? ROW_SPACING / 2 : 0;
        const colSprites: THREE.Sprite[] = [];

        for (let r = 0; r < rows; r++) {
          const sprite = new THREE.Sprite(mat.clone());
          sprite.scale.set(LOGO_SIZE, LOGO_SIZE, 1);
          sprite.position.set(colX, h / 2 - r * ROW_SPACING + staggerY, 0);
          scene.add(sprite);
          colSprites.push(sprite);
        }
        built.push(colSprites);
      }
      return built;
    }

    let cols = buildGrid(width, height);
    columns.push(...cols);

    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);

      const h = height;
      const rows = Math.ceil(h / ROW_SPACING) + 4;
      const totalH = rows * ROW_SPACING;

      columns.forEach((colSprites, colIdx) => {
        const dir = colIdx % 2 === 0 ? 1 : -1;
        const delta = dir * SPEED;

        colSprites.forEach((sprite) => {
          sprite.position.y += delta;

          if (dir === 1 && sprite.position.y > h / 2 + LOGO_SIZE) {
            sprite.position.y -= totalH;
          } else if (dir === -1 && sprite.position.y < -h / 2 - LOGO_SIZE) {
            sprite.position.y += totalH;
          }
        });
      });

      renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;

      renderer.setSize(width, height);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      // rebuild grid
      columns.forEach((colSprites) =>
        colSprites.forEach((s) => {
          scene.remove(s);
          s.material.dispose();
        })
      );
      columns.length = 0;
      const rebuilt = buildGrid(width, height);
      columns.push(...rebuilt);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      columns.forEach((colSprites) =>
        colSprites.forEach((s) => {
          scene.remove(s);
          (s.material as THREE.SpriteMaterial).dispose();
        })
      );
      texture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
}
