import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/addons/renderers/CSS3DRenderer.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createMacbook, disposeMacbook } from "../lib/macbook.js";
import { keyboardTexture } from "../lib/textures.js";
import { fitDistance } from "../lib/camera.js";

export default function Macbook({ focused, mobile, onEnter, children }) {
  const hostRef = useRef(null);
  const mobileHostRef = useRef(null);
  const fallbackHostRef = useRef(null);
  const viewRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [screenElement] = useState(() => {
    const element = document.createElement("div");
    element.className = "screen-shell";
    return element;
  });
  viewRef.current = { focused, mobile, onEnter };

  useEffect(() => {
    if (mobile) return;
    const host = hostRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      viewRef.current.onEnter();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    const keyLight = new THREE.DirectionalLight("#fff6e8", 2.5);
    keyLight.position.set(-5, 8, 6);
    const rimLight = new THREE.DirectionalLight("#d4dbe9", 2);
    rimLight.position.set(5, 4, -3);
    scene.add(keyLight, rimLight, new THREE.AmbientLight("#ffffff", 0.5));
    const { laptop, lid, screen } = createMacbook(keyboardTexture());
    scene.add(laptop);

    // shortcut: CSS3D assumes 100% browser zoom; calibrate projection if zoom support is needed.
    const cssScene = new THREE.Scene();
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.domElement.className = "css-renderer";
    // Prevent focusing screen controls from scrolling the projected surface.
    cssRenderer.domElement.style.overflow = "clip";
    host.appendChild(cssRenderer.domElement);
    const cssScreen = new CSS3DObject(screenElement);
    cssScreen.scale.setScalar(6.09 / 1280);
    cssScene.add(cssScreen);

    const overviewTarget = new THREE.Vector3(0, 1.55, -0.35);
    const overviewDirection = new THREE.Vector3(0.19, 0.19, 1).normalize();
    const desiredPosition = new THREE.Vector3();
    const desiredTarget = new THREE.Vector3();
    const lookTarget = overviewTarget.clone();
    const screenPosition = new THREE.Vector3();
    const screenRotation = new THREE.Quaternion();
    const normal = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const rotation = { x: 0.025, y: -0.34 };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let zoom = 1;
    let overviewDistance = 16;
    let drag = null;
    let moved = false;
    let visible = true;
    let lastFrame = 0;
    let placedCamera = false;
    const started = performance.now();

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      cssRenderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      overviewDistance = fitDistance(8.8, 7.2, camera.aspect, camera.fov, 0.8);
      if (!placedCamera) {
        camera.position
          .copy(overviewTarget)
          .addScaledVector(overviewDirection, overviewDistance);
        camera.lookAt(overviewTarget);
        placedCamera = true;
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const hitScreen = (event) => {
      const rect = host.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObject(screen).length > 0;
    };
    const down = (event) => {
      if (
        event.button !== 0 ||
        viewRef.current.focused ||
        event.target.closest(".css-renderer")
      )
        return;
      drag = {
        x: event.clientX,
        y: event.clientY,
        rotationX: rotation.x,
        rotationY: rotation.y,
      };
      moved = false;
      host.setPointerCapture(event.pointerId);
    };
    const move = (event) => {
      if (viewRef.current.focused) return;
      if (!drag) {
        host.style.cursor = hitScreen(event) ? "pointer" : "grab";
        return;
      }
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      rotation.y = Math.max(-1.25, Math.min(1.25, drag.rotationY + dx * 0.005));
      rotation.x = Math.max(-0.22, Math.min(0.38, drag.rotationX + dy * 0.003));
      host.style.cursor = "grabbing";
    };
    const up = (event) => {
      const wasDragging = Boolean(drag);
      drag = null;
      host.style.cursor = viewRef.current.focused ? "default" : "grab";
      if (host.hasPointerCapture(event.pointerId))
        host.releasePointerCapture(event.pointerId);
      if (wasDragging && !moved && hitScreen(event)) viewRef.current.onEnter();
    };
    const cancel = () => {
      drag = null;
    };
    const wheel = (event) => {
      if (viewRef.current.focused || event.ctrlKey) return;
      event.preventDefault();
      zoom = Math.max(
        0.6,
        Math.min(1.55, zoom * Math.exp(event.deltaY * 0.0006)),
      );
    };
    const visibility = () => {
      visible = !document.hidden;
    };
    const key = (event) => {
      if (event.target !== host || viewRef.current.focused) return;
      switch (event.key) {
        case "Enter":
        case " ":
          viewRef.current.onEnter();
          break;
        case "ArrowLeft":
        case "ArrowRight":
          rotation.y = Math.max(
            -1.25,
            Math.min(
              1.25,
              rotation.y + (event.key === "ArrowLeft" ? -0.25 : 0.25),
            ),
          );
          break;
        case "ArrowUp":
        case "ArrowDown":
          zoom = Math.max(
            0.6,
            Math.min(1.55, zoom * (event.key === "ArrowUp" ? 0.9 : 1.1)),
          );
          break;
        case "Home":
          rotation.x = 0.025;
          rotation.y = -0.34;
          zoom = 1;
          break;
        default:
          return;
      }
      event.preventDefault();
    };
    host.addEventListener("pointerdown", down);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerup", up);
    host.addEventListener("pointercancel", cancel);
    host.addEventListener("wheel", wheel, { passive: false });
    host.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    resize();

    renderer.setAnimationLoop((time) => {
      if (!visible || time - lastFrame < 30 || viewRef.current.mobile) return;
      lastFrame = time;
      const focus = viewRef.current.focused;
      const blend = motion.matches ? 1 : 0.17;
      laptop.rotation.x +=
        ((focus ? 0 : rotation.x) - laptop.rotation.x) * blend;
      laptop.rotation.y +=
        ((focus ? 0 : rotation.y) - laptop.rotation.y) * blend;
      laptop.position.y =
        focus || motion.matches ? 0 : Math.sin(time * 0.0006) * 0.045;
      lid.rotation.x =
        -0.19 +
        (motion.matches || focus
          ? 0
          : Math.max(0, 1 - (performance.now() - started) / 750) ** 3 * 0.28);
      scene.updateMatrixWorld(true);
      screen.getWorldPosition(screenPosition);
      screen.getWorldQuaternion(screenRotation);
      normal.set(0, 0, 1).applyQuaternion(screenRotation);
      if (focus) {
        desiredTarget.copy(screenPosition);
        desiredPosition
          .copy(screenPosition)
          .addScaledVector(
            normal,
            fitDistance(6.09, 6.09 / 1.6, camera.aspect, camera.fov, 0.82),
          );
      } else {
        desiredTarget.copy(overviewTarget);
        desiredPosition
          .copy(overviewTarget)
          .addScaledVector(overviewDirection, overviewDistance * zoom);
      }
      camera.position.lerp(desiredPosition, blend);
      lookTarget.lerp(desiredTarget, blend);
      camera.lookAt(lookTarget);
      const interactive =
        focus &&
        camera.position.distanceTo(desiredPosition) < 0.035 &&
        lookTarget.distanceTo(desiredTarget) < 0.015;
      if (screenElement.getAttribute("aria-hidden") !== String(!interactive)) {
        screenElement.inert = !interactive;
        screenElement.setAttribute("aria-hidden", String(!interactive));
        screenElement.style.pointerEvents = interactive ? "auto" : "none";
        if (interactive)
          screenElement
            .querySelector(".os-menu-home")
            ?.focus({ preventScroll: true });
      }
      cssScreen.position.copy(screenPosition).addScaledVector(normal, 0.002);
      cssScreen.quaternion.copy(screenRotation);
      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    });
    const contextLost = (event) => {
      event.preventDefault();
      renderer.setAnimationLoop(null);
      setFailed(true);
      viewRef.current.onEnter();
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", cancel);
      host.removeEventListener("wheel", wheel);
      host.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      disposeMacbook(laptop);
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      screenElement.remove();
      renderer.domElement.remove();
      cssRenderer.domElement.remove();
    };
  }, [screenElement, mobile]);

  useEffect(() => {
    const directScreen = mobile || failed;
    screenElement.inert = !directScreen;
    screenElement.setAttribute("aria-hidden", String(!directScreen));
    screenElement.style.pointerEvents = directScreen ? "auto" : "none";
    screenElement.style.width = directScreen ? "100%" : "1280px";
    screenElement.style.height = directScreen ? "100%" : "800px";
    screenElement.classList.toggle("compact-screen", mobile);
    if (directScreen) {
      (mobile ? mobileHostRef : fallbackHostRef).current.appendChild(
        screenElement,
      );
      screenElement.style.transform = "none";
      screenElement
        .querySelector(".os-menu-home")
        ?.focus({ preventScroll: true });
    }
  }, [mobile, failed, screenElement]);

  return (
    <>
      <div
        ref={hostRef}
        className="world-stage"
        hidden={failed || mobile}
        tabIndex={0}
        role="region"
        aria-label="Original MacBook Air. Press Enter to explore, arrow keys to rotate or zoom, Home to reset, and Escape to return."
      />
      <div
        className="mobile-screen-host"
        ref={mobileHostRef}
        hidden={!mobile}
      />
      <div className="fallback-machine" hidden={!failed || mobile}>
        <div className="fallback-screen" ref={fallbackHostRef} />
        <div className="fallback-deck" />
      </div>
      {createPortal(children, screenElement)}
    </>
  );
}
