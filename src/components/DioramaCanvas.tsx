/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WorldRegionId, AttractionPoint, SandboxPlacedItem } from '../types';
import { REGIONS_META } from '../data/tripData';
import { audioEngine } from '../utils/audioEngine';

interface DioramaCanvasProps {
  regionId: WorldRegionId;
  timeOfDay: number; // 0 - 24
  waveEnergy: number; // 0.1 - 2.0
  cameraMode: 'orbit' | 'isometric' | 'abuelo_walk' | 'drone';
  placedItems: SandboxPlacedItem[];
  attractions: AttractionPoint[];
  selectedAttractionId: string | null;
  onSelectAttraction: (attr: AttractionPoint | null) => void;
  sandboxPlaceType: 'scenic_camp' | 'photo_spot' | 'gourmet_cafe' | 'wildlife_post' | 'shuttle_stop' | null;
  onPlaceSandboxItem: (coords: [number, number, number]) => void;
  onCanvasReady?: (captureFn: () => string) => void;
  onSelectRegion?: (regId: WorldRegionId) => void;
  locationName?: string;
  displayDate?: string;
  isHangover?: boolean;
}

export const DioramaCanvas: React.FC<DioramaCanvasProps> = ({
  regionId,
  timeOfDay,
  waveEnergy,
  cameraMode,
  placedItems,
  attractions,
  selectedAttractionId,
  onSelectAttraction,
  sandboxPlaceType,
  onPlaceSandboxItem,
  onCanvasReady,
  onSelectRegion,
  locationName,
  displayDate,
  isHangover = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Dynamic references for animators
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const regionGroupRef = useRef<THREE.Group | null>(null);
  const placedGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const wildlifeGroupRef = useRef<THREE.Group | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const isHangoverRef = useRef(isHangover);
  isHangoverRef.current = isHangover;

  const [hoveredName, setHoveredName] = useState<string | null>(null);

  // Function to build current region models
  const rebuildRegionDiorama = useCallback((targetRegionId: WorldRegionId, currentHour: number) => {
    if (!regionGroupRef.current || !wildlifeGroupRef.current) return;
    const group = regionGroupRef.current;
    const wildlife = wildlifeGroupRef.current;

    // Clear previous children
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }
    while (wildlife.children.length > 0) {
      wildlife.remove(wildlife.children[0]);
    }

    const isNight = currentHour < 6 || currentHour > 19;

    switch (targetRegionId) {
      case 'hobbiton':
        buildHobbitonDiorama(group, isNight);
        buildWildlifeShire(wildlife);
        break;
      case 'rotorua':
        buildRotoruaDiorama(group, isNight);
        buildWildlifeRotorua(wildlife);
        break;
      case 'auckland':
      case 'nz_north':
        buildAucklandDiorama(group, isNight);
        buildWildlifeHarbor(wildlife);
        break;
      case 'waiheke':
        buildWaihekeDiorama(group, isNight);
        buildWildlifeHarbor(wildlife);
        break;
      case 'dunedin':
        buildDunedinDiorama(group, isNight);
        buildWildlifeDunedin(wildlife);
        break;
      case 'queenstown':
      case 'nz_south':
        buildQueenstownDiorama(group, isNight);
        buildWildlifeAlpine(wildlife);
        break;
      case 'milford':
        buildMilfordDiorama(group, isNight);
        buildWildlifeAlpine(wildlife);
        break;
      case 'wanaka':
        buildWanakaDiorama(group, isNight);
        buildWildlifeAlpine(wildlife);
        break;
      case 'christchurch':
        buildChristchurchDiorama(group, isNight);
        buildWildlifeChristchurch(wildlife);
        break;
      case 'flight_transit':
        buildFlightTransitDiorama(group, isNight);
        buildWildlifeFlight(wildlife);
        break;
      case 'fiji':
        buildFijiDiorama(group, isNight);
        buildWildlifeTropical(wildlife);
        break;
      case 'singapore':
        buildSingaporeDiorama(group, isNight);
        buildWildlifeCity(wildlife);
        break;
      case 'azerbaijan':
        buildBakuDiorama(group, isNight);
        buildWildlifeCaspian(wildlife);
        break;
      case 'spain_turkey':
        buildMadridIstanbulDiorama(group, isNight);
        buildWildlifeCelebration(wildlife);
        break;
      default:
        buildHobbitonDiorama(group, isNight);
        buildWildlifeShire(wildlife);
        break;
    }
  }, []);

  // Primary Three.js setup effect
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const measuredW = container.clientWidth || window.innerWidth || 1200;
    const measuredH = container.clientHeight || (window.innerHeight - 130) || 700;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, measuredW / measuredH, 0.5, 500);
    camera.position.set(22, 18, 24);
    camera.lookAt(0, 1.5, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(measuredW, measuredH, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.5, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 55;
    controlsRef.current = controls;

    if (onCanvasReady) {
      onCanvasReady(() => {
        if (!rendererRef.current) return '';
        return rendererRef.current.domElement.toDataURL('image/jpeg', 0.92);
      });
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x334455, 0.65);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    sunLight.position.set(24, 32, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Diorama Plinth Base
    const plinthGroup = new THREE.Group();
    scene.add(plinthGroup);

    const baseGeo = new THREE.CylinderGeometry(18, 19.5, 3.5, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      roughness: 0.65,
      metalness: 0.15,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -2.25;
    baseMesh.receiveShadow = true;
    plinthGroup.add(baseMesh);

    const rimGeo = new THREE.TorusGeometry(18.05, 0.22, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.85,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.5;
    plinthGroup.add(rimMesh);

    const seabedGeo = new THREE.CylinderGeometry(17.8, 17.8, 1.5, 32);
    const seabedMat = new THREE.MeshStandardMaterial({
      color: 0x1b3846,
      roughness: 0.9,
    });
    const seabed = new THREE.Mesh(seabedGeo, seabedMat);
    seabed.position.y = -1.2;
    seabed.receiveShadow = true;
    plinthGroup.add(seabed);

    // Water Surface
    const waterGeo = new THREE.CylinderGeometry(17.5, 17.5, 0.3, 48, 8);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x14a1c0,
      transparent: true,
      opacity: 0.8,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.55,
      ior: 1.333,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -0.4;
    waterMesh.receiveShadow = true;
    plinthGroup.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // Groups
    const regionGroup = new THREE.Group();
    scene.add(regionGroup);
    regionGroupRef.current = regionGroup;

    const placedGroup = new THREE.Group();
    scene.add(placedGroup);
    placedGroupRef.current = placedGroup;

    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    const wildlifeGroup = new THREE.Group();
    scene.add(wildlifeGroup);
    wildlifeGroupRef.current = wildlifeGroup;

    // Initial diorama build
    rebuildRegionDiorama(regionId, timeOfDay);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h, false);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Procedural wave displacement & shimmer
      if (waterMeshRef.current) {
        const waveSpeed = 1.2 * waveEnergy;
        waterMeshRef.current.position.y = -0.4 + Math.sin(elapsedTime * waveSpeed) * 0.06 * waveEnergy;
        waterMeshRef.current.rotation.y = elapsedTime * 0.02;
      }

      // Wildlife & Airplane animations
      if (wildlifeGroupRef.current) {
        wildlifeGroupRef.current.children.forEach((child) => {
          const animSeed = (child.userData?.animSeed as number) || 0;
          if (child.name === 'dolphin') {
            const cycle = (elapsedTime * 1.5 + animSeed) % (Math.PI * 2);
            child.position.y = Math.sin(cycle) * 1.2;
            child.rotation.x = Math.cos(cycle) * 0.6;
          } else if (child.name === 'bird') {
            const angle = elapsedTime * 0.8 + animSeed;
            child.position.x = Math.cos(angle) * 12;
            child.position.z = Math.sin(angle) * 12;
            child.rotation.y = -angle;
            const leftWing = child.getObjectByName('leftWing');
            const rightWing = child.getObjectByName('rightWing');
            if (leftWing && rightWing) {
              const flap = Math.sin(elapsedTime * 12) * 0.5;
              leftWing.rotation.z = flap;
              rightWing.rotation.z = -flap;
            }
          } else if (child.name === 'boat') {
            const angle = elapsedTime * 0.15;
            child.position.x = Math.cos(angle) * 9;
            child.position.z = Math.sin(angle) * 9;
            child.rotation.y = -angle + Math.PI / 2;
            child.position.y = 0.05 + Math.sin(elapsedTime * 2) * 0.03;
          } else if (child.name === 'plane') {
            // Smooth forward flying airplane with tangent vector
            const flightRadius = 19;
            const speed = 0.35;
            const angle = elapsedTime * speed;
            const currX = Math.cos(angle) * flightRadius;
            const currZ = Math.sin(angle) * flightRadius;
            const currY = 13 + Math.sin(elapsedTime * 0.6) * 1.2;
            child.position.set(currX, currY, currZ);

            // Compute tangent lookAt forward along path
            const lookAheadAngle = angle + 0.06;
            const nextX = Math.cos(lookAheadAngle) * flightRadius;
            const nextZ = Math.sin(lookAheadAngle) * flightRadius;
            const nextY = 13 + Math.sin((elapsedTime + 0.1) * 0.6) * 1.2;
            child.lookAt(nextX, nextY, nextZ);
            child.rotateZ(0.2); // aerodynamic inward banking
          }
        });
      }

      // Markers pulse
      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach((marker, mIdx) => {
          marker.position.y += Math.sin(elapsedTime * 3 + mIdx) * 0.003;
          marker.rotation.y = elapsedTime * 1.2;
        });
      }

      // Drone auto-rotation
      if (controlsRef.current) {
        if (cameraMode === 'drone') {
          controlsRef.current.autoRotate = true;
          controlsRef.current.autoRotateSpeed = 1.2;
        } else {
          controlsRef.current.autoRotate = false;
        }
        controlsRef.current.update();
      }

      // Subtle humorous dizzy camera wobble if hungover
      if (isHangoverRef.current && camera) {
        camera.rotation.z = Math.sin(elapsedTime * 2.4) * 0.022;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      if (controlsRef.current) controlsRef.current.dispose();
      if (rendererRef.current && rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update regional diorama whenever regionId or timeOfDay changes
  useEffect(() => {
    rebuildRegionDiorama(regionId, timeOfDay);

    if (controlsRef.current) {
      const meta = REGIONS_META[regionId];
      if (meta) {
        controlsRef.current.target.set(0, meta.defaultCamera.targetY, 0);
      }
    }
  }, [regionId, rebuildRegionDiorama, timeOfDay]);

  // Update camera mode
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (cameraMode === 'isometric') {
      camera.position.set(28, 22, 28);
      controls.target.set(0, 1.5, 0);
      controls.update();
    } else if (cameraMode === 'abuelo_walk') {
      camera.position.set(8, 3.2, 8);
      controls.target.set(0, 1.8, 0);
      controls.update();
    } else if (cameraMode === 'orbit') {
      camera.position.set(22, 18, 24);
      controls.target.set(0, 1.5, 0);
      controls.update();
    }
  }, [cameraMode]);

  // Raycast hover detection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    if (markersGroupRef.current) {
      const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData?.name && parent !== markersGroupRef.current) {
          parent = parent.parent;
        }
        if (parent && parent.userData?.name) {
          setHoveredName(parent.userData.name);
          return;
        }
      }
    }
    setHoveredName(null);
  };

  // Canvas click handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Sandbox item placement mode
    if (sandboxPlaceType) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectionPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
        const distFromCenter = Math.hypot(intersectionPoint.x, intersectionPoint.z);
        if (distFromCenter < 14) {
          audioEngine.playFanfare();
          onPlaceSandboxItem([
            +intersectionPoint.x.toFixed(2),
            +intersectionPoint.y.toFixed(2),
            +intersectionPoint.z.toFixed(2)
          ]);
        }
      }
      return;
    }

    // Attraction inspection
    if (markersGroupRef.current) {
      const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData?.attraction && parent !== markersGroupRef.current) {
          parent = parent.parent;
        }
        if (parent && parent.userData?.attraction) {
          const attr = parent.userData.attraction as AttractionPoint;
          audioEngine.playClick();
          onSelectAttraction(attr);

          if (controlsRef.current) {
            controlsRef.current.target.set(attr.position3D[0], attr.position3D[1], attr.position3D[2]);
            controlsRef.current.update();
          }
          return;
        }
      }
    }

    onSelectAttraction(null);
  };

  // Update Day / Night lighting and celestial cycle
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !hemiLightRef.current || !sceneRef.current) return;

    const sunAngle = ((timeOfDay - 6) / 24) * Math.PI * 2;
    const sunDist = 38;
    const sunY = Math.sin(sunAngle) * sunDist;
    const sunX = Math.cos(sunAngle) * sunDist;
    const sunZ = Math.sin(sunAngle * 0.5) * 15;

    sunLightRef.current.position.set(sunX, Math.max(-10, sunY), sunZ);

    const isDay = timeOfDay >= 6 && timeOfDay <= 18;
    const isGoldenHour = (timeOfDay >= 6 && timeOfDay <= 7.5) || (timeOfDay >= 17 && timeOfDay <= 19);

    if (isGoldenHour) {
      sunLightRef.current.color.setHex(0xffaa55);
      sunLightRef.current.intensity = 2.2;
      ambientLightRef.current.color.setHex(0xffeecc);
      ambientLightRef.current.intensity = 0.7;
      sceneRef.current.background = new THREE.Color(0x24172c);
      sceneRef.current.fog = new THREE.Fog(0x24172c, 45, 120);
    } else if (isDay) {
      sunLightRef.current.color.setHex(0xfffbf0);
      sunLightRef.current.intensity = 2.1;
      ambientLightRef.current.color.setHex(0xf1f5f9);
      ambientLightRef.current.intensity = 0.85;
      sceneRef.current.background = new THREE.Color(0x0f172a); // Rich slate-900 gallery: models POP with vibrant clarity!
      sceneRef.current.fog = new THREE.Fog(0x0f172a, 50, 130);
    } else {
      sunLightRef.current.color.setHex(0x6b8cce);
      sunLightRef.current.intensity = 0.5;
      ambientLightRef.current.color.setHex(0x1e293b);
      ambientLightRef.current.intensity = 0.5;
      sceneRef.current.background = new THREE.Color(0x060913); // Deep night velvet
      sceneRef.current.fog = new THREE.Fog(0x060913, 45, 120);
    }

    if (waterMeshRef.current) {
      const waterMat = waterMeshRef.current.material as THREE.MeshPhysicalMaterial;
      if (!isDay) {
        waterMat.color.setHex(0x0a192f);
        waterMat.opacity = 0.9;
      } else {
        waterMat.color.setHex(regionId === 'fiji' ? 0x0fe3d8 : 0x0284c7);
        waterMat.opacity = 0.82;
      }
    }
  }, [timeOfDay, regionId]);

  // Update attraction markers in 3D
  useEffect(() => {
    if (!markersGroupRef.current) return;
    const markers = markersGroupRef.current;

    while (markers.children.length > 0) {
      markers.remove(markers.children[0]);
    }

    attractions.forEach((attr) => {
      const markerGroup = new THREE.Group();
      markerGroup.position.set(attr.position3D[0], attr.position3D[1] + 1.2, attr.position3D[2]);
      markerGroup.userData = { attraction: attr, name: attr.name };

      const isSelected = selectedAttractionId === attr.id;

      const pinGeo = new THREE.OctahedronGeometry(isSelected ? 0.65 : 0.45);
      const pinMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xffdd00 : 0x00f0ff,
        emissive: isSelected ? 0xffaa00 : 0x007799,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.castShadow = true;
      markerGroup.add(pinMesh);

      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
      const stemMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffdd00 : 0x00f0ff,
        transparent: true,
        opacity: 0.6,
      });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.y = -0.6;
      markerGroup.add(stemMesh);

      const ringGeo = new THREE.RingGeometry(0.4, 0.6, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffcc00 : 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -1.2;
      markerGroup.add(ringMesh);

      markers.add(markerGroup);
    });
  }, [attractions, selectedAttractionId]);

  // Update placed sandbox items in 3D
  useEffect(() => {
    if (!placedGroupRef.current) return;
    const placed = placedGroupRef.current;

    while (placed.children.length > 0) {
      placed.remove(placed.children[0]);
    }

    const currentRegionItems = placedItems.filter((i) => i.regionId === regionId);

    currentRegionItems.forEach((item) => {
      const itemMesh = buildPlacedSandboxMesh(item.itemType);
      itemMesh.position.set(item.position[0], item.position[1], item.position[2]);
      itemMesh.userData = { sandboxItem: item, name: item.name };
      placed.add(itemMesh);
    });
  }, [placedItems, regionId]);

  const handleResetCamera = (mode: 'overview' | 'close' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;
    audioEngine.playClick();
    if (mode === 'overview') {
      cameraRef.current.position.set(19, 15, 23);
      controlsRef.current.target.set(0, 1.5, 0);
    } else if (mode === 'close') {
      cameraRef.current.position.set(10, 6, 12);
      controlsRef.current.target.set(0, 1.5, 0);
    } else if (mode === 'top') {
      cameraRef.current.position.set(0.1, 32, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  };

  const currentMeta = REGIONS_META[regionId] || REGIONS_META.hobbiton;

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <div
        ref={mountRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className={`w-full h-full ${sandboxPlaceType ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* Top Overlay: Active Location Badge & Quick Switcher */}
      <div className="absolute top-3 left-3 right-3 pointer-events-none z-20 flex flex-wrap items-center justify-between gap-2">
        {/* Destination Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl">
          <span className="text-xl">{currentMeta.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide uppercase">{currentMeta.title}</span>
              {displayDate && <span className="text-[10px] text-amber-400 font-mono">· {displayDate.split(' ')[0]} {displayDate.split(' ')[1]} {displayDate.split(' ')[2]}</span>}
            </div>
            <div className="text-[11px] text-slate-300 font-medium truncate max-w-[260px] sm:max-w-md">
              {locationName || currentMeta.subtitle}
            </div>
          </div>
        </div>

        {/* Quick Destination Pills */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px]">
          {[
            { id: 'hobbiton' as WorldRegionId, label: '🏡 Hobbiton (21 Oct)', flag: '🏡' },
            { id: 'rotorua' as WorldRegionId, label: '🌋 Rotorua (22 Oct)', flag: '🌋' },
            { id: 'auckland' as WorldRegionId, label: '🏙️ Auckland', flag: '🇳🇿' },
            { id: 'dunedin' as WorldRegionId, label: '🏰 Dunedin', flag: '🏰' },
            { id: 'queenstown' as WorldRegionId, label: '🏔️ Queenstown', flag: '🏔️' },
            { id: 'milford' as WorldRegionId, label: '🌊 Milford', flag: '🌊' },
            { id: 'fiji' as WorldRegionId, label: '🇫🇯 Fiji', flag: '🇫🇯' },
            { id: 'singapore' as WorldRegionId, label: '🇸🇬 Singapur', flag: '🇸🇬' },
            { id: 'azerbaijan' as WorldRegionId, label: '🇦🇿 Bakú', flag: '🇦🇿' },
            { id: 'spain_turkey' as WorldRegionId, label: '🇪🇸 Madrid', flag: '🇪🇸' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                audioEngine.playClick();
                if (onSelectRegion) onSelectRegion(item.id);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                regionId === item.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Camera Quick Presets */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px]">
          <button
            onClick={() => handleResetCamera('overview')}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Vista panorámica"
          >
            🔭 General
          </button>
          <button
            onClick={() => handleResetCamera('close')}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Vista detalle"
          >
            🔍 Detalle
          </button>
          <button
            onClick={() => handleResetCamera('top')}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Vista aérea cenital"
          >
            🗺️ Cenital
          </button>
        </div>
      </div>

      {/* Hover Inspection Tooltip */}
      {hoveredName && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide shadow-xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{hoveredName}</span>
            <span className="text-white/50 text-[10px]">· Clic para inspeccionar</span>
          </div>
        </div>
      )}

      {/* Sandbox Placement Indicator */}
      {sandboxPlaceType && (
        <div className="absolute bottom-6 left-4 z-20 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-200 text-xs font-medium shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Modo Construcción Activo: Haz clic en el diorama para colocar tu elemento</span>
          </div>
        </div>
      )}

      {/* Hangover Visual Indicator Overlay */}
      {isHangover && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-pulse">
          <div className="px-4 py-1.5 rounded-full bg-purple-950/90 backdrop-blur-md border border-purple-500/60 text-purple-200 text-xs font-semibold shadow-2xl flex items-center gap-2">
            <span className="text-base animate-spin">💫</span>
            <span>¡Mundo Tambaleante: El Abuelo tiene Resaca! 🤕 (Toma café o ibuprofeno para curarlo)</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3D DIORAMA PROCEDURAL BUILDERS
// ==========================================

// Helper to create adorable fluffy sheep for Hobbiton
function createCuteSheepMesh(): THREE.Group {
  const sheep = new THREE.Group();

  // Fluffy fleece body
  const bodyGeo = new THREE.SphereGeometry(0.38, 12, 10);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.scale.set(1.25, 0.95, 0.95);
  body.position.y = 0.45;
  body.castShadow = true;
  sheep.add(body);

  // Little black head
  const headGeo = new THREE.SphereGeometry(0.16, 10, 8);
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const head = new THREE.Mesh(headGeo, darkMat);
  head.position.set(0.42, 0.5, 0);
  head.castShadow = true;
  sheep.add(head);

  // Cute tiny ears
  const earGeo = new THREE.BoxGeometry(0.06, 0.04, 0.2);
  const ears = new THREE.Mesh(earGeo, darkMat);
  ears.position.set(0.38, 0.58, 0);
  sheep.add(ears);

  // 4 little dark legs
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.38, 6);
  const legOffsets = [
    [-0.24, 0.19, 0.16],
    [-0.24, 0.19, -0.16],
    [0.22, 0.19, 0.16],
    [0.22, 0.19, -0.16],
  ];
  legOffsets.forEach(([lx, ly, lz]) => {
    const leg = new THREE.Mesh(legGeo, darkMat);
    leg.position.set(lx, ly, lz);
    sheep.add(leg);
  });

  return sheep;
}

// 1. HOBBITON SHIRE (Cute round green hobbit doors, rolling mounds, party tree, sheep, bridge, flowers)
function buildHobbitonDiorama(group: THREE.Group, isNight: boolean) {
  // Rolling Green Hills (Fairytale green)
  const terrainGeo = new THREE.CylinderGeometry(11, 14, 2.2, 32);
  const terrainMat = new THREE.MeshStandardMaterial({ color: 0x48a832, roughness: 0.85 });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.position.y = 0.4;
  terrain.receiveShadow = true;
  group.add(terrain);

  // Bag End Grassy Mound (Hobbit hill)
  const hillGeo = new THREE.SphereGeometry(4.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const hillMat = new THREE.MeshStandardMaterial({ color: 0x3d9428, roughness: 0.9 });
  const hill = new THREE.Mesh(hillGeo, hillMat);
  hill.position.set(-1.5, 1.4, -0.5);
  hill.scale.set(1.4, 0.9, 1.2);
  hill.castShadow = true;
  group.add(hill);

  // Second Hobbit Mound on the right
  const hill2Geo = new THREE.SphereGeometry(3.2, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2);
  const hill2 = new THREE.Mesh(hill2Geo, hillMat);
  hill2.position.set(3.2, 1.4, 1.5);
  hill2.scale.set(1.2, 0.8, 1.1);
  hill2.castShadow = true;
  group.add(hill2);

  // 1. The Iconic Round Green Hobbit Door (Bag End)
  const doorGroup = new THREE.Group();
  doorGroup.position.set(-1.2, 2.2, 1.8);

  const trimGeo = new THREE.TorusGeometry(1.2, 0.12, 16, 32);
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x6e4726, roughness: 0.8 });
  const trim = new THREE.Mesh(trimGeo, trimMat);
  doorGroup.add(trim);

  const doorGeo = new THREE.CircleGeometry(1.15, 32);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x1f7a37, roughness: 0.5 }); // Iconic green door
  const door = new THREE.Mesh(doorGeo, doorMat);
  doorGroup.add(door);

  const knobGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const knobMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
  const knob = new THREE.Mesh(knobGeo, knobMat);
  knob.position.z = 0.08;
  doorGroup.add(knob);

  const porchGeo = new THREE.BoxGeometry(2.6, 0.2, 1.0);
  const porchMat = new THREE.MeshStandardMaterial({ color: 0x8a8479, roughness: 0.95 });
  const porch = new THREE.Mesh(porchGeo, porchMat);
  porch.position.set(0, -1.1, 0.4);
  doorGroup.add(porch);

  // Stone Chimney on top of the grassy roof puffing smoke
  const chimneyGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.6, 8);
  const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
  const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
  chimney.position.set(-1.8, 4.4, -0.8);
  chimney.castShadow = true;
  doorGroup.add(chimney);

  for (let sp = 0; sp < 3; sp++) {
    const smokeGeo = new THREE.SphereGeometry(0.22 + sp * 0.12, 8, 8);
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0.7 - sp * 0.18 });
    const smoke = new THREE.Mesh(smokeGeo, smokeMat);
    smoke.position.set(-1.8 + sp * 0.1, 5.2 + sp * 0.6, -0.8 + sp * 0.05);
    doorGroup.add(smoke);
  }

  group.add(doorGroup);

  // 2. Second Cute Hobbit Hole with Bright Yellow Door & Round Blue Window!
  const door2Group = new THREE.Group();
  door2Group.position.set(2.8, 2.0, 2.8);
  door2Group.rotation.y = -Math.PI / 4;

  const trim2 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.1, 16, 24), trimMat);
  door2Group.add(trim2);

  const door2 = new THREE.Mesh(new THREE.CircleGeometry(0.85, 24), new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 })); // Cheerful yellow door!
  door2Group.add(door2);

  const knob2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), knobMat);
  knob2.position.z = 0.06;
  door2Group.add(knob2);

  // Round blue window beside the yellow door
  const winGeo = new THREE.CircleGeometry(0.4, 16);
  const winMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
  const win = new THREE.Mesh(winGeo, winMat);
  win.position.set(1.4, 0.2, 0);
  door2Group.add(win);

  group.add(door2Group);

  // 3. Adorable Fluffy White Sheep Grazing on the Meadows!
  const sheep1 = createCuteSheepMesh();
  sheep1.position.set(1.5, 1.42, 0.8);
  sheep1.rotation.y = -0.5;
  group.add(sheep1);

  const sheep2 = createCuteSheepMesh();
  sheep2.position.set(3.8, 1.42, -0.6);
  sheep2.rotation.y = 1.3;
  group.add(sheep2);

  const sheep3 = createCuteSheepMesh();
  sheep3.position.set(-4.2, 1.45, 1.8);
  sheep3.rotation.y = 0.4;
  group.add(sheep3);

  // 4. The Party Tree (Majestic sprawling oak)
  const treeGroup = new THREE.Group();
  treeGroup.position.set(4.5, 1.4, -2.5);

  const trunkGeo = new THREE.CylinderGeometry(0.6, 1.0, 3.2, 12);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x543d2b, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.6;
  treeGroup.add(trunk);

  const foliageGeo = new THREE.SphereGeometry(2.6, 16, 14);
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d7a22, roughness: 0.8 });
  const foliage = new THREE.Mesh(foliageGeo, foliageMat);
  foliage.position.y = 3.8;
  foliage.scale.set(1.4, 0.9, 1.3);
  foliage.castShadow = true;
  treeGroup.add(foliage);

  // Festive party lanterns
  const lanternColors = [0xffcc00, 0xef4444, 0x38bdf8, 0x10b981];
  for (let l = 0; l < 4; l++) {
    const lant = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshBasicMaterial({ color: lanternColors[l] })
    );
    const lAngle = (l / 4) * Math.PI * 2;
    lant.position.set(Math.cos(lAngle) * 1.5, 2.7, Math.sin(lAngle) * 1.5);
    treeGroup.add(lant);
  }

  group.add(treeGroup);

  // 5. Cobblestone Footbridge over a creek
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(-2.0, 1.35, 4.2);
  const archGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.2, 16, 1, false, 0, Math.PI);
  const archMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.95 });
  const arch = new THREE.Mesh(archGeo, archMat);
  arch.rotation.z = Math.PI / 2;
  arch.rotation.y = Math.PI / 2;
  bridgeGroup.add(arch);
  group.add(bridgeGroup);

  // 6. Cute wooden split-rail fences
  for (let i = 0; i < 7; i++) {
    const postGeo = new THREE.BoxGeometry(0.08, 0.65, 0.08);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xb59a79 });
    const post = new THREE.Mesh(postGeo, postMat);
    const fAngle = 0.4 + i * 0.25;
    post.position.set(Math.cos(fAngle) * 3.5, 1.7, Math.sin(fAngle) * 3.5);
    group.add(post);
  }

  // 7. Garden Patch with Pumpkins!
  for (let p = 0; p < 3; p++) {
    const pGeo = new THREE.SphereGeometry(0.24, 10, 8);
    pGeo.scale(1.2, 0.8, 1.2);
    const pMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    const pumpkin = new THREE.Mesh(pGeo, pMat);
    pumpkin.position.set(-3.2 + p * 0.5, 1.48, -0.2 + (p % 2) * 0.3);
    group.add(pumpkin);
  }

  // 8. Colorful Flower Beds
  const flowerColors = [0xfacc15, 0xf472b6, 0xc084fc, 0xef4444];
  for (let i = 0; i < 22; i++) {
    const flGeo = new THREE.SphereGeometry(0.14, 6, 6);
    const flMat = new THREE.MeshBasicMaterial({ color: flowerColors[i % flowerColors.length] });
    const flower = new THREE.Mesh(flGeo, flMat);
    const angle = (i / 22) * Math.PI * 1.6;
    flower.position.set(Math.cos(angle) * 2.8 - 0.5, 1.5 + (i % 3) * 0.08, Math.sin(angle) * 2.2 + 0.8);
    group.add(flower);
  }
}

// 2. ROTORUA GEOTHERMAL (Steaming Pohutu geyser, turquoise Champagne pool, bubbling mud craters, Maori Wharenui)
function buildRotoruaDiorama(group: THREE.Group, isNight: boolean) {
  // Volcanic Geothermal Crusted Ground (Earthy ochre & grey mineral rock)
  const groundGeo = new THREE.CylinderGeometry(11, 14, 2.0, 32);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x5a534c, roughness: 0.95 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.3;
  ground.receiveShadow = true;
  group.add(ground);

  // 1. Steaming Pōhutu Geyser Cone & Spray
  const geyserConeGeo = new THREE.ConeGeometry(2.4, 2.8, 16);
  const geyserConeMat = new THREE.MeshStandardMaterial({ color: 0x786f66, roughness: 0.9 });
  const geyserCone = new THREE.Mesh(geyserConeGeo, geyserConeMat);
  geyserCone.position.set(-2.5, 1.6, -1.0);
  geyserCone.castShadow = true;
  group.add(geyserCone);

  // Erupting Geyser Steam Column (Billowing white vapor clouds)
  for (let s = 0; s < 5; s++) {
    const puffGeo = new THREE.SphereGeometry(0.65 + s * 0.4, 10, 10);
    const puffMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 - s * 0.14 });
    const puff = new THREE.Mesh(puffGeo, puffMat);
    puff.position.set(-2.5 + Math.sin(s) * 0.2, 3.2 + s * 1.3, -1.0 + Math.cos(s) * 0.2);
    group.add(puff);
  }

  // 2. Wai-O-Tapu Champagne Pool (Turquoise water with radiant fiery sulfur crust)
  const poolRimGeo = new THREE.TorusGeometry(3.3, 0.5, 12, 32);
  const poolRimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.85 }); // Golden orange sulfur crust
  const poolRim = new THREE.Mesh(poolRimGeo, poolRimMat);
  poolRim.rotation.x = Math.PI / 2;
  poolRim.position.set(3.2, 1.35, 1.2);
  group.add(poolRim);

  const poolWaterGeo = new THREE.CircleGeometry(3.0, 32);
  const poolWaterMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // Luminous turquoise thermal water
  const poolWater = new THREE.Mesh(poolWaterGeo, poolWaterMat);
  poolWater.rotation.x = -Math.PI / 2;
  poolWater.position.set(3.2, 1.4, 1.2);
  group.add(poolWater);

  // 3. Bubbling Mud Pool Craters
  const mudGroup = new THREE.Group();
  mudGroup.position.set(-3.5, 1.35, 2.4);

  const mudRim = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.25, 8, 16), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  mudRim.rotation.x = Math.PI / 2;
  mudGroup.add(mudRim);

  const mudSurface = new THREE.Mesh(new THREE.CircleGeometry(1.3, 16), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 }));
  mudSurface.rotation.x = -Math.PI / 2;
  mudSurface.position.y = 0.05;
  mudGroup.add(mudSurface);

  // Rising mud bubbles
  for (let b = 0; b < 3; b++) {
    const bub = new THREE.Mesh(new THREE.SphereGeometry(0.2 + b * 0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3 }));
    bub.position.set((b - 1) * 0.45, 0.18, ((b % 2) - 0.5) * 0.5);
    mudGroup.add(bub);
  }
  group.add(mudGroup);

  // 4. Traditional Māori Wharenui (Carved meeting house with red ochre maihi gables & Tekoteko)
  const maraeGroup = new THREE.Group();
  maraeGroup.position.set(0, 1.3, -4.5);

  const mWallsGeo = new THREE.BoxGeometry(3.8, 1.8, 3.2);
  const mWallsMat = new THREE.MeshStandardMaterial({ color: 0x88291f, roughness: 0.8 }); // Red ochre (Kokowai)
  const mWalls = new THREE.Mesh(mWallsGeo, mWallsMat);
  mWalls.position.y = 0.9;
  maraeGroup.add(mWalls);

  const mRoofGeo = new THREE.ConeGeometry(2.9, 1.6, 4);
  const mRoofMat = new THREE.MeshStandardMaterial({ color: 0x451a14, roughness: 0.9 });
  const mRoof = new THREE.Mesh(mRoofGeo, mRoofMat);
  mRoof.position.y = 2.4;
  mRoof.rotation.y = Math.PI / 4;
  maraeGroup.add(mRoof);

  // Carved Front Pole (Tekoteko ancestor figure) with Paua shell eyes
  const totemGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.4, 8);
  const totemMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
  const totem = new THREE.Mesh(totemGeo, totemMat);
  totem.position.set(0, 1.2, 1.65);
  maraeGroup.add(totem);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
  eyeL.position.set(-0.06, 2.1, 1.76);
  maraeGroup.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
  eyeR.position.set(0.06, 2.1, 1.76);
  maraeGroup.add(eyeR);

  group.add(maraeGroup);

  // 5. Native Silver Ferns
  for (let f = 0; f < 6; f++) {
    const fernGeo = new THREE.ConeGeometry(0.8, 1.8, 6);
    const fernMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 });
    const fern = new THREE.Mesh(fernGeo, fernMat);
    const fAngle = 1.0 + f * 0.8;
    fern.position.set(Math.cos(fAngle) * 5.0, 1.6, Math.sin(fAngle) * 4.5);
    group.add(fern);
  }
}

// 3. AUCKLAND (Sky Tower, Viaduct Harbour marina, sailing boats, volcanic cone)
function buildAucklandDiorama(group: THREE.Group, isNight: boolean) {
  const islandGeo = new THREE.CylinderGeometry(11, 14, 2.2, 32);
  const islandMat = new THREE.MeshStandardMaterial({ color: 0x3d7838, roughness: 0.85 });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.position.set(-1, 0.4, 0);
  island.receiveShadow = true;
  group.add(island);

  // Mount Eden volcanic cone
  const coneGeo = new THREE.ConeGeometry(3.2, 2.6, 24);
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x2e6628, roughness: 0.9 });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.set(-6, 2.2, -3);
  cone.castShadow = true;
  group.add(cone);

  // Auckland Sky Tower
  const towerGroup = new THREE.Group();
  towerGroup.position.set(0, 1.5, 0);

  const shaftGeo = new THREE.CylinderGeometry(0.35, 0.7, 7.5, 16);
  const shaftMat = new THREE.MeshStandardMaterial({ color: 0xd8dde3, roughness: 0.3, metalness: 0.4 });
  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.position.y = 3.75;
  shaft.castShadow = true;
  towerGroup.add(shaft);

  const podGeo = new THREE.CylinderGeometry(1.4, 1.2, 1.1, 24);
  const podMat = new THREE.MeshStandardMaterial({
    color: isNight ? 0x1a2e4a : 0x486581,
    emissive: isNight ? 0x00e5ff : 0x000000,
    emissiveIntensity: isNight ? 0.7 : 0,
    roughness: 0.2,
    metalness: 0.6,
  });
  const pod = new THREE.Mesh(podGeo, podMat);
  pod.position.y = 6.2;
  pod.castShadow = true;
  towerGroup.add(pod);

  const spireGeo = new THREE.ConeGeometry(0.12, 3.2, 8);
  const spireMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 });
  const spire = new THREE.Mesh(spireGeo, spireMat);
  spire.position.y = 8.4;
  towerGroup.add(spire);

  group.add(towerGroup);

  // Viaduct Harbour marina docks
  const dockGeo = new THREE.BoxGeometry(7, 0.3, 3);
  const dockMat = new THREE.MeshStandardMaterial({ color: 0x54493b, roughness: 0.9 });
  const dock = new THREE.Mesh(dockGeo, dockMat);
  dock.position.set(3, 1.4, 2);
  dock.receiveShadow = true;
  group.add(dock);

  // City skyscrapers
  const cityColors = [0x9fb3c8, 0x627d98, 0x334e68, 0xbcccdc];
  for (let i = 0; i < 8; i++) {
    const h = 2.5 + (i % 4) * 1.2;
    const w = 1.0 + (i % 2) * 0.4;
    const bGeo = new THREE.BoxGeometry(w, h, w);
    const bMat = new THREE.MeshStandardMaterial({
      color: cityColors[i % cityColors.length],
      emissive: isNight ? 0xffcc44 : 0x000000,
      emissiveIntensity: isNight ? 0.35 : 0,
      roughness: 0.3,
      metalness: 0.5,
    });
    const bMesh = new THREE.Mesh(bGeo, bMat);
    const angle = (i / 8) * Math.PI * 0.8 - 0.4;
    bMesh.position.set(Math.cos(angle) * 3.8 - 1, 1.5 + h / 2, Math.sin(angle) * 3.8);
    bMesh.castShadow = true;
    bMesh.receiveShadow = true;
    group.add(bMesh);
  }
}

// 4. WAIHEKE (Vineyards, rolling coastal hills, wine chalets)
function buildWaihekeDiorama(group: THREE.Group, isNight: boolean) {
  const islandGeo = new THREE.CylinderGeometry(11, 14, 2.2, 32);
  const islandMat = new THREE.MeshStandardMaterial({ color: 0x4d9438, roughness: 0.85 });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.position.y = 0.4;
  group.add(island);

  // Vineyard Grape Trellises (Lines of vines)
  for (let row = -3; row <= 3; row++) {
    const vineGeo = new THREE.BoxGeometry(5.0, 0.4, 0.25);
    const vineMat = new THREE.MeshStandardMaterial({ color: 0x226b24 });
    const vine = new THREE.Mesh(vineGeo, vineMat);
    vine.position.set(0, 1.7, row * 0.85);
    group.add(vine);
  }

  // Winery Chalet (Mudbrick Estate)
  const chaletGeo = new THREE.BoxGeometry(2.4, 1.4, 2.0);
  const chaletMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.8 });
  const chalet = new THREE.Mesh(chaletGeo, chaletMat);
  chalet.position.set(-4, 2.1, 0);
  group.add(chalet);

  const roofGeo = new THREE.ConeGeometry(2.0, 1.2, 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b3a2b });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(-4, 3.2, 0);
  roof.rotation.y = Math.PI / 4;
  group.add(roof);
}

// 5. DUNEDIN (Flemish Victorian Railway Station "Gingerbread House", Taieri Gorge train tracks, Baldwin Street, Larnach Castle)
function buildDunedinDiorama(group: THREE.Group, isNight: boolean) {
  // Basalt & Coastal Headland Ground
  const groundGeo = new THREE.CylinderGeometry(11, 14, 2.0, 32);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.3;
  group.add(ground);

  // 1. Dunedin Railway Station ("The Gingerbread House" - Flemish Victorian)
  const stationGroup = new THREE.Group();
  stationGroup.position.set(-1.0, 1.3, -1.0);

  // Dark Kokonga basalt main hall
  const mainHallGeo = new THREE.BoxGeometry(6.8, 2.3, 2.6);
  const mainHallMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 });
  const mainHall = new THREE.Mesh(mainHallGeo, mainHallMat);
  mainHall.position.y = 1.15;
  stationGroup.add(mainHall);

  // High-contrast white Oamaru limestone gingerbread arches & balustrades
  const trimGeo = new THREE.BoxGeometry(6.9, 0.22, 2.65);
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
  const trim = new THREE.Mesh(trimGeo, trimMat);
  trim.position.y = 1.85;
  stationGroup.add(trim);

  // White limestone arched front portico
  for (let a = -2; a <= 2; a++) {
    const archCol = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8), trimMat);
    archCol.position.set(a * 1.2, 0.7, 1.4);
    stationGroup.add(archCol);
  }

  // Iconic 37-meter Square Clock Tower
  const towerGeo = new THREE.BoxGeometry(1.5, 5.2, 1.5);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(2.6, 2.6, 0.4);
  stationGroup.add(tower);

  // Luminous Clock Face on tower
  const clockGeo = new THREE.CircleGeometry(0.38, 16);
  const clockMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
  const clock = new THREE.Mesh(clockGeo, clockMat);
  clock.position.set(2.6, 4.2, 1.18);
  stationGroup.add(clock);

  // Verdigris Green Oxidized Copper Spire
  const spireGeo = new THREE.ConeGeometry(0.95, 1.8, 8);
  const spireMat = new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.75, roughness: 0.3 });
  const spire = new THREE.Mesh(spireGeo, spireMat);
  spire.position.set(2.6, 5.8, 0.4);
  stationGroup.add(spire);

  group.add(stationGroup);

  // 2. Taieri Gorge Railway Tracks & Vintage Black Steam Locomotive!
  const trainGroup = new THREE.Group();
  trainGroup.position.set(-1.0, 1.35, 1.2);

  // Railway tracks (parallel steel rails)
  for (let r = -1; r <= 1; r += 2) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.06, 0.06), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
    rail.position.set(0, 0.03, r * 0.35);
    trainGroup.add(rail);
  }

  // Wooden railway ties
  for (let t = -7; t <= 7; t++) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.9), new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 }));
    tie.position.set(t * 0.48, 0.02, 0);
    trainGroup.add(tie);
  }

  // Black vintage steam locomotive engine
  const locoBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.8, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }));
  locoBody.rotation.z = Math.PI / 2;
  locoBody.position.set(-1.4, 0.45, 0);
  trainGroup.add(locoBody);

  // Golden brass boiler bands
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.03, 8, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
  band.rotation.y = Math.PI / 2;
  band.position.set(-1.4, 0.45, 0);
  trainGroup.add(band);

  // Smokestack with white puff
  const smokestack = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
  smokestack.position.set(-2.0, 0.85, 0);
  trainGroup.add(smokestack);

  const puff = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
  puff.position.set(-2.0, 1.15, 0);
  trainGroup.add(puff);

  // Passenger carriage
  const coach = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.5 })); // Heritage maroon carriage
  coach.position.set(0.8, 0.48, 0);
  trainGroup.add(coach);

  group.add(trainGroup);

  // 3. Baldwin Street (The World's Steepest Residential Street!)
  const baldwinGroup = new THREE.Group();
  baldwinGroup.position.set(-4.5, 1.4, 2.0);

  // Inclined asphalt roadway climbing steeply at 35 degrees
  const streetGeo = new THREE.BoxGeometry(1.4, 0.15, 4.0);
  const streetMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
  const street = new THREE.Mesh(streetGeo, streetMat);
  street.rotation.x = -0.55; // Steep 35-degree slope!
  street.position.y = 0.9;
  baldwinGroup.add(street);

  // 3 Cute Victorian pastel wooden cottages staggered on the steep hill
  const cottageColors = [0xfef08a, 0xa7f3d0, 0xbae6fd]; // Buttercup yellow, mint, powder blue
  for (let c = 0; c < 3; c++) {
    const cotGroup = new THREE.Group();
    const cot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.8), new THREE.MeshStandardMaterial({ color: cottageColors[c] }));
    cotGroup.add(cot);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.4, 4), new THREE.MeshStandardMaterial({ color: 0x991b1b }));
    roof.position.y = 0.48;
    roof.rotation.y = Math.PI / 4;
    cotGroup.add(roof);

    cotGroup.position.set(1.1, 0.5 + c * 0.8, -1.2 + c * 1.3);
    baldwinGroup.add(cotGroup);
  }
  group.add(baldwinGroup);

  // 4. Larnach Castle on the Otago Hill
  const castleGroup = new THREE.Group();
  castleGroup.position.set(4.2, 1.4, -3.2);

  const cBaseGeo = new THREE.BoxGeometry(2.4, 2.2, 2.2);
  const cBaseMat = new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.85 });
  const cBase = new THREE.Mesh(cBaseGeo, cBaseMat);
  cBase.position.y = 1.1;
  castleGroup.add(cBase);

  // Battlements (crenellations)
  const battGeo = new THREE.BoxGeometry(2.6, 0.35, 2.6);
  const batt = new THREE.Mesh(battGeo, cBaseMat);
  batt.position.y = 2.3;
  castleGroup.add(batt);

  // Turret tower
  const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 3.2, 8), cBaseMat);
  turret.position.set(1.1, 1.6, 1.1);
  castleGroup.add(turret);

  group.add(castleGroup);

  // 5. Taiaroa Head Coastal Cliff (Where Royal Albatrosses breed)
  const cliffGeo = new THREE.BoxGeometry(3.6, 2.2, 3.2);
  const cliffMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.95 });
  const cliff = new THREE.Mesh(cliffGeo, cliffMat);
  cliff.position.set(5.5, 1.2, 3.2);
  group.add(cliff);
}

// 6. QUEENSTOWN (Jagged Remarkables alpine razor ridges, Lake Wakatipu, Skyline Gondola, TSS Earnslaw steamship)
function buildQueenstownDiorama(group: THREE.Group, isNight: boolean) {
  // Alpine gravel & pine needle ground
  const groundGeo = new THREE.CylinderGeometry(11, 14, 2.0, 32);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e3a29, roughness: 0.95 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.3;
  group.add(ground);

  // 1. The Remarkables Jagged Alpine Razor Mountain Range (Sawtooth mountain ridges with crisp snow)
  const peakCoords: [number, number, number, number, number][] = [
    [-5.2, 2.0, -3.8, 5.2, 9.2],
    [-0.8, 2.0, -5.2, 4.6, 8.4],
    [3.8, 2.0, -4.2, 5.0, 8.8],
  ];

  peakCoords.forEach(([px, py, pz, r, h]) => {
    // Serrated dark alpine schist mountain
    const mGeo = new THREE.ConeGeometry(r, h, 5);
    const mMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
    const mountain = new THREE.Mesh(mGeo, mMat);
    mountain.position.set(px, py + h / 2, pz);
    mountain.castShadow = true;
    group.add(mountain);

    // Brilliant Snow Dusting on Razor Peak
    const sGeo = new THREE.ConeGeometry(r * 0.48, h * 0.38, 5);
    const sMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const snow = new THREE.Mesh(sGeo, sMat);
    snow.position.set(px, py + h * 0.8, pz);
    group.add(snow);
  });

  // 2. Dense Alpine Evergreen Pine Trees clustering the lake shore
  for (let pt = 0; pt < 8; pt++) {
    const pineGroup = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.0, 6), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
    trunk.position.y = 0.5;
    pineGroup.add(trunk);

    const needles = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.7 }));
    needles.position.y = 1.4;
    pineGroup.add(needles);

    const pAngle = -1.2 + pt * 0.35;
    pineGroup.position.set(Math.cos(pAngle) * 5.2 - 1, 1.3, Math.sin(pAngle) * 4.2);
    group.add(pineGroup);
  }

  // 3. Queenstown Skyline Gondola (Cables & cabins ascending Bob's Peak)
  const gondolaGroup = new THREE.Group();
  gondolaGroup.position.set(4.5, 1.3, 0);

  // Mountain Base Terminal
  const baseTerm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.4), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  baseTerm.position.set(0, 0.45, 1.5);
  gondolaGroup.add(baseTerm);

  // Bob's Peak Summit Complex
  const summit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.6), new THREE.MeshStandardMaterial({ color: 0x64748b }));
  summit.position.set(-1.2, 4.2, -3.0);
  gondolaGroup.add(summit);

  // Steel Cable Line ascending the mountain
  const cableGeo = new THREE.CylinderGeometry(0.04, 0.04, 5.8, 6);
  const cableMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const cable = new THREE.Mesh(cableGeo, cableMat);
  cable.position.set(-0.6, 2.3, -0.8);
  cable.rotation.x = 0.65;
  gondolaGroup.add(cable);

  // 2 Bright Red Gondola Cabins attached to cable
  for (let g = 0; g < 2; g++) {
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.38), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    cabin.position.set(-0.6, 1.6 + g * 1.5, 0.3 - g * 2.0);
    gondolaGroup.add(cabin);
  }
  group.add(gondolaGroup);

  // 4. TSS Earnslaw Vintage 1912 Steamship on Lake Wakatipu ("The Lady of the Lake")
  const boatGroup = new THREE.Group();
  boatGroup.position.set(-1.0, 0.4, 2.6);

  // Black hull
  const hullGeo = new THREE.BoxGeometry(3.2, 0.6, 1.1);
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.35 });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  boatGroup.add(hull);

  // White passenger superstructure & promenade deck
  const deckGeo = new THREE.BoxGeometry(2.2, 0.65, 0.85);
  const deckMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.y = 0.55;
  boatGroup.add(deck);

  // Wheelhouse
  const wheelhouse = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.6), deckMat);
  wheelhouse.position.set(-0.5, 1.0, 0);
  boatGroup.add(wheelhouse);

  // Iconic Bright Red & Black Smokestack with White Steam!
  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
  funnel.position.set(0.2, 1.15, 0);
  boatGroup.add(funnel);

  const funnelTop = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0x09090b }));
  funnelTop.position.set(0.2, 1.7, 0);
  boatGroup.add(funnelTop);

  // Puffing steam from Earnslaw funnel
  for (let st = 0; st < 3; st++) {
    const steam = new THREE.Mesh(new THREE.SphereGeometry(0.16 + st * 0.08, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 - st * 0.2 }));
    steam.position.set(0.2 + st * 0.15, 1.9 + st * 0.35, 0);
    boatGroup.add(steam);
  }

  group.add(boatGroup);
}

// Dedicated Flight Transit Diorama (Cruising Boeing 787 over rolling 3D clouds)
function buildFlightTransitDiorama(group: THREE.Group, isNight: boolean) {
  // Deep oceanic basin
  const oceanGeo = new THREE.CylinderGeometry(11, 14, 2.0, 32);
  const oceanMat = new THREE.MeshStandardMaterial({ color: 0x0a1e38, roughness: 0.5 });
  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.position.y = 0.3;
  group.add(ocean);

  // Rolling Fluffy 3D Cloud Formations
  const cloudGroup = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });

  for (let c = 0; c < 9; c++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(1.2 + (c % 3) * 0.4, 10, 8), cloudMat);
    const cAngle = (c / 9) * Math.PI * 2;
    puff.position.set(Math.cos(cAngle) * 6.5, 2.5 + (c % 2) * 0.8, Math.sin(cAngle) * 6.5);
    cloudGroup.add(puff);
  }
  group.add(cloudGroup);

  // Glowing International Date Line Meridian Ring
  const meridian = new THREE.Mesh(
    new THREE.TorusGeometry(8.5, 0.1, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
  );
  meridian.rotation.x = Math.PI / 2;
  meridian.position.y = 1.0;
  group.add(meridian);
}

function buildWildlifeFlight(group: THREE.Group) {
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

// 7. MILFORD SOUND (Colossal Fjord cliffs, Stirling waterfalls, glacial fjord basin)
function buildMilfordDiorama(group: THREE.Group, isNight: boolean) {
  const groundGeo = new THREE.CylinderGeometry(11, 14, 2.0, 32);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e3a29, roughness: 0.95 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.3;
  group.add(ground);

  // Sheer Mitre Peak Pyramid
  const mitreGeo = new THREE.ConeGeometry(5.8, 10.5, 5);
  const mitreMat = new THREE.MeshStandardMaterial({ color: 0x2c3539, roughness: 0.85 });
  const mitre = new THREE.Mesh(mitreGeo, mitreMat);
  mitre.position.set(-3.5, 5.2, -2.5);
  mitre.castShadow = true;
  group.add(mitre);

  const snowGeo = new THREE.ConeGeometry(2.5, 3.2, 5);
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.15 });
  const snow = new THREE.Mesh(snowGeo, snowMat);
  snow.position.set(-3.5, 8.8, -2.5);
  group.add(snow);

  // Opposing Fiord Wall
  const wallGeo = new THREE.ConeGeometry(5.2, 8.8, 5);
  const wall = new THREE.Mesh(wallGeo, mitreMat);
  wall.position.set(4.5, 4.4, -3.0);
  wall.castShadow = true;
  group.add(wall);

  // Cascading Stirling Waterfall
  const fallGeo = new THREE.PlaneGeometry(0.9, 6.5);
  const fallMat = new THREE.MeshBasicMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
  const fall = new THREE.Mesh(fallGeo, fallMat);
  fall.position.set(-1.8, 3.8, -1.2);
  fall.rotation.y = 0.4;
  group.add(fall);
}

// 8. WANAKA & MT COOK (That Wanaka Tree, Lake Tekapo Good Shepherd, Mt Cook)
function buildWanakaDiorama(group: THREE.Group, isNight: boolean) {
  const groundGeo = new THREE.CylinderGeometry(11, 14, 2.0, 32);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x385e38, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.3;
  group.add(ground);

  // That Wanaka Tree (Sauce sauceño creciendo en el agua)
  const treeGroup = new THREE.Group();
  treeGroup.position.set(1.5, 0.1, 2.0); // Directly in water!

  const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.8, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 0.9;
  trunk.rotation.z = 0.15;
  treeGroup.add(trunk);

  const leafGeo = new THREE.SphereGeometry(0.85, 10, 8);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8 });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.position.set(0.2, 1.8, 0);
  treeGroup.add(leaf);

  group.add(treeGroup);

  // Church of the Good Shepherd (Tekapo stone church)
  const churchGroup = new THREE.Group();
  churchGroup.position.set(-3.5, 1.3, 0);

  const bGeo = new THREE.BoxGeometry(2.4, 1.4, 1.6);
  const bMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.95 }); // Local stone
  const b = new THREE.Mesh(bGeo, bMat);
  b.position.y = 0.7;
  churchGroup.add(b);

  const rGeo = new THREE.ConeGeometry(1.6, 1.2, 4);
  const rMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
  const r = new THREE.Mesh(rGeo, rMat);
  r.position.y = 1.9;
  r.rotation.y = Math.PI / 4;
  churchGroup.add(r);

  group.add(churchGroup);

  // Aoraki / Mount Cook in the backdrop
  const cookGeo = new THREE.ConeGeometry(5.5, 9.5, 6);
  const cookMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
  const cook = new THREE.Mesh(cookGeo, cookMat);
  cook.position.set(0, 5.0, -5.0);
  cook.castShadow = true;
  group.add(cook);

  const snowGeo = new THREE.ConeGeometry(2.8, 3.8, 6);
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const snow = new THREE.Mesh(snowGeo, snowMat);
  snow.position.set(0, 8.2, -5.0);
  group.add(snow);
}

// 9. CHRISTCHURCH (Avon River, weeping willows, punting boat, historic tram)
function buildChristchurchDiorama(group: THREE.Group, isNight: boolean) {
  const groundGeo = new THREE.CylinderGeometry(11, 14, 2.0, 32);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x367c3e, roughness: 0.85 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.3;
  group.add(ground);

  // Meandering Avon River channel
  const riverGeo = new THREE.BoxGeometry(9.0, 0.2, 2.4);
  const riverMat = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8 });
  const river = new THREE.Mesh(riverGeo, riverMat);
  river.position.set(0, 0.8, 0);
  group.add(river);

  // Weeping Willow Trees
  for (let w = 0; w < 3; w++) {
    const willow = new THREE.Group();
    willow.position.set(-3.0 + w * 3.0, 1.2, -1.8);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0x4a3b32 }));
    trunk.position.y = 1.1;
    willow.add(trunk);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.4, 10), new THREE.MeshStandardMaterial({ color: 0x65a30d }));
    canopy.position.y = 2.4;
    canopy.rotation.x = Math.PI; // Drooping weeping branches
    willow.add(canopy);

    group.add(willow);
  }

  // Punting Boat on the Avon
  const puntGeo = new THREE.BoxGeometry(1.6, 0.15, 0.6);
  const puntMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
  const punt = new THREE.Mesh(puntGeo, puntMat);
  punt.position.set(0.5, 0.95, 0);
  group.add(punt);

  // Heritage Christchurch Electric Tram
  const tramGeo = new THREE.BoxGeometry(2.4, 1.1, 0.9);
  const tramMat = new THREE.MeshStandardMaterial({ color: 0x991b1b }); // Classic maroon tram
  const tram = new THREE.Mesh(tramGeo, tramMat);
  tram.position.set(-2, 1.5, 3.2);
  group.add(tram);
}

// 10. FIJI (Coral lagoon, overwater bures, palm trees, coral rings)
function buildFijiDiorama(group: THREE.Group, isNight: boolean) {
  const sandGeo = new THREE.CylinderGeometry(9.5, 12.5, 1.2, 32);
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.9 });
  const sand = new THREE.Mesh(sandGeo, sandMat);
  sand.position.set(0, 0.2, 0);
  sand.receiveShadow = true;
  group.add(sand);

  const hillGeo = new THREE.CylinderGeometry(4.5, 6.5, 2.0, 24);
  const hillMat = new THREE.MeshStandardMaterial({ color: 0x1f7a37, roughness: 0.85 });
  const hill = new THREE.Mesh(hillGeo, hillMat);
  hill.position.set(-2, 1.2, -1);
  group.add(hill);

  // Traditional Thatched Bures
  const burePositions: [number, number, number][] = [
    [-3, 1.4, 1.5],
    [2, 0.8, -2],
    [-1, 1.6, -3],
  ];

  burePositions.forEach(([x, y, z]) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(x, y, z);

    const wall = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.8), new THREE.MeshStandardMaterial({ color: 0x8a6240 }));
    wall.position.y = 0.5;
    bGroup.add(wall);

    const thatch = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.4, 4), new THREE.MeshStandardMaterial({ color: 0xba9b68 }));
    thatch.position.y = 1.7;
    thatch.rotation.y = Math.PI / 4;
    bGroup.add(thatch);

    group.add(bGroup);
  });

  // Overwater Bure on Stilts
  const stiltGroup = new THREE.Group();
  stiltGroup.position.set(4.5, 0.2, 3.5);

  const board = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 0.8), new THREE.MeshStandardMaterial({ color: 0xa88a64 }));
  board.position.x = -1.2;
  stiltGroup.add(board);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 1.6), new THREE.MeshStandardMaterial({ color: 0x8a6240 }));
  cabin.position.y = 0.6;
  stiltGroup.add(cabin);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.2, 4), new THREE.MeshStandardMaterial({ color: 0xba9b68 }));
  roof.position.y = 1.7;
  roof.rotation.y = Math.PI / 4;
  stiltGroup.add(roof);

  group.add(stiltGroup);

  // Palm Trees
  const palmCoords: [number, number, number][] = [
    [-4, 0.8, -1],
    [-2, 1.2, 3],
    [1, 0.8, 2],
    [3, 0.8, -3],
  ];

  palmCoords.forEach(([px, py, pz]) => {
    const palm = buildPalmTree();
    palm.position.set(px, py, pz);
    group.add(palm);
  });
}

// 11. SINGAPORE (Marina Bay Sands, Supertrees, Merlion)
function buildSingaporeDiorama(group: THREE.Group, isNight: boolean) {
  const cityGroundGeo = new THREE.CylinderGeometry(11.5, 14, 1.8, 32);
  const cityGroundMat = new THREE.MeshStandardMaterial({ color: 0x2e353f, roughness: 0.7 });
  const ground = new THREE.Mesh(cityGroundGeo, cityGroundMat);
  ground.position.y = 0.2;
  ground.receiveShadow = true;
  group.add(ground);

  // Marina Bay Sands
  const mbsGroup = new THREE.Group();
  mbsGroup.position.set(-3, 0.6, -2);

  const towerGeo = new THREE.BoxGeometry(1.1, 7.0, 1.3);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x8ba4b8,
    emissive: isNight ? 0x224466 : 0x000000,
    emissiveIntensity: isNight ? 0.4 : 0,
    roughness: 0.25,
    metalness: 0.6,
  });

  for (let t = -1; t <= 1; t++) {
    const tow = new THREE.Mesh(towerGeo, towerMat);
    tow.position.set(t * 1.8, 3.5, 0);
    tow.castShadow = true;
    mbsGroup.add(tow);
  }

  const skyParkGeo = new THREE.BoxGeometry(6.6, 0.6, 2.2);
  const skyParkMat = new THREE.MeshStandardMaterial({ color: 0xd9e2ec, roughness: 0.3 });
  const skyPark = new THREE.Mesh(skyParkGeo, skyParkMat);
  skyPark.position.set(0.6, 7.3, 0);
  skyPark.castShadow = true;
  mbsGroup.add(skyPark);

  const poolGeo = new THREE.BoxGeometry(4.8, 0.1, 0.8);
  const poolMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff });
  const pool = new THREE.Mesh(poolGeo, poolMat);
  pool.position.set(0.2, 7.62, -0.2);
  mbsGroup.add(pool);

  group.add(mbsGroup);

  // Supertrees
  const supertreeCoords: [number, number, number][] = [
    [3.5, 0.6, 1.0],
    [5.0, 0.6, -1.2],
    [2.2, 0.6, -3.0],
  ];

  supertreeCoords.forEach(([sx, sy, sz], idx) => {
    const stGroup = new THREE.Group();
    stGroup.position.set(sx, sy, sz);

    const trunkH = 4.2 + (idx % 2) * 1.2;
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, trunkH, 12);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkH / 2;
    stGroup.add(trunk);

    const canopyGeo = new THREE.CylinderGeometry(1.6, 0.4, 1.4, 16);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0xbd1550,
      emissive: isNight ? (idx === 0 ? 0xff0077 : 0x00e5ff) : 0x000000,
      emissiveIntensity: isNight ? 0.9 : 0,
      roughness: 0.3,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = trunkH + 0.5;
    stGroup.add(canopy);

    group.add(stGroup);
  });

  // Merlion
  const merlion = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.8, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
  merlion.position.set(-1.0, 1.2, 3.5);
  group.add(merlion);
}

// 12. BAKU (Flame Towers, Maiden Tower, Caspian promenade)
function buildBakuDiorama(group: THREE.Group, isNight: boolean) {
  const groundGeo = new THREE.CylinderGeometry(11, 14, 1.8, 32);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x4b433b, roughness: 0.8 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.2;
  group.add(ground);

  // Flame Towers
  const flameGroup = new THREE.Group();
  flameGroup.position.set(-3.5, 0.8, -1.5);

  const flameHeights = [6.8, 5.8, 5.0];
  flameHeights.forEach((h, idx) => {
    const fGeo = new THREE.ConeGeometry(1.2, h, 16);
    const fMat = new THREE.MeshStandardMaterial({
      color: isNight ? 0xff4500 : 0x334e68,
      emissive: isNight ? 0xff3700 : 0x000000,
      emissiveIntensity: isNight ? 0.85 : 0,
      roughness: 0.2,
      metalness: 0.6,
    });
    const flame = new THREE.Mesh(fGeo, fMat);
    const angle = (idx / 3) * Math.PI * 0.9;
    flame.position.set(Math.cos(angle) * 2.2, h / 2, Math.sin(angle) * 2.2);
    flameGroup.add(flame);
  });
  group.add(flameGroup);

  // Maiden Tower
  const maiden = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 3.8, 16), new THREE.MeshStandardMaterial({ color: 0xc4a47c, roughness: 0.95 }));
  maiden.position.set(1.5, 2.2, -1.0);
  group.add(maiden);
}

// 13. MADRID & ISTANBUL
function buildMadridIstanbulDiorama(group: THREE.Group, isNight: boolean) {
  const plazaGeo = new THREE.CylinderGeometry(11.5, 14, 1.8, 32);
  const plazaMat = new THREE.MeshStandardMaterial({ color: 0xd6c7b2, roughness: 0.8 });
  const plaza = new THREE.Mesh(plazaGeo, plazaMat);
  plaza.position.y = 0.2;
  group.add(plaza);

  // Puerta del Sol Clock Tower
  const towerGroup = new THREE.Group();
  towerGroup.position.set(0, 0.8, 0);

  const b = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.8, 2.2), new THREE.MeshStandardMaterial({ color: 0xb55338, roughness: 0.8 }));
  b.position.y = 1.4;
  towerGroup.add(b);

  const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.4, 12), new THREE.MeshStandardMaterial({ color: 0xeee6d8 }));
  clock.position.y = 4.0;
  towerGroup.add(clock);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3d4849, metalness: 0.7 }));
  dome.position.y = 5.2;
  towerGroup.add(dome);

  group.add(towerGroup);

  // Colonnade
  const col = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.5, 1.4), new THREE.MeshStandardMaterial({ color: 0xf5f0eb, roughness: 0.7 }));
  col.position.set(-3.5, 1.8, -3);
  group.add(col);

  // Istanbul Minarets
  const minMat = new THREE.MeshStandardMaterial({ color: 0xe8e4dc });
  const m1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 6.0, 12), minMat);
  m1.position.set(5.5, 3.2, -2);
  group.add(m1);

  const m2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 6.0, 12), minMat);
  m2.position.set(5.5, 3.2, 2);
  group.add(m2);
}

// Helpers
function buildPalmTree(): THREE.Group {
  const palm = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 2.8, 8), new THREE.MeshStandardMaterial({ color: 0x7a5a3a }));
  trunk.position.y = 1.4;
  trunk.rotation.z = 0.12;
  palm.add(trunk);

  const frondGeo = new THREE.ConeGeometry(1.4, 0.4, 5);
  const frondMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  for (let i = 0; i < 6; i++) {
    const f = new THREE.Mesh(frondGeo, frondMat);
    f.position.set(0.18, 2.8, 0);
    f.rotation.y = (i / 6) * Math.PI * 2;
    f.rotation.z = 0.55;
    palm.add(f);
  }
  return palm;
}

// Wildlife & Forward Flying Airplane
function buildWildlifeShire(group: THREE.Group) {
  for (let i = 0; i < 4; i++) {
    const bird = createBirdMesh();
    bird.userData = { animSeed: i * 2 };
    bird.name = 'bird';
    bird.position.y = 7 + i;
    group.add(bird);
  }
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeRotorua(group: THREE.Group) {
  for (let i = 0; i < 3; i++) {
    const bird = createBirdMesh();
    bird.userData = { animSeed: i * 2.5 };
    bird.name = 'bird';
    bird.position.y = 8 + i;
    group.add(bird);
  }
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeHarbor(group: THREE.Group) {
  for (let i = 0; i < 4; i++) {
    const bird = createBirdMesh();
    bird.userData = { animSeed: i * 2 };
    bird.name = 'bird';
    bird.position.y = 8 + i * 1.2;
    group.add(bird);
  }
  const boat = createBoatMesh(0x0284c7);
  boat.name = 'boat';
  group.add(boat);

  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeDunedin(group: THREE.Group) {
  // Giant Royal Albatrosses gliding
  for (let i = 0; i < 3; i++) {
    const albatross = createBirdMesh();
    albatross.scale.set(1.4, 1.4, 1.4);
    albatross.userData = { animSeed: i * 3 };
    albatross.name = 'bird';
    albatross.position.y = 9 + i * 1.5;
    group.add(albatross);
  }
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeAlpine(group: THREE.Group) {
  for (let i = 0; i < 3; i++) {
    const bird = createBirdMesh();
    bird.userData = { animSeed: i * 3 };
    bird.name = 'bird';
    bird.position.y = 9 + i * 1.5;
    group.add(bird);
  }
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeChristchurch(group: THREE.Group) {
  for (let i = 0; i < 4; i++) {
    const bird = createBirdMesh();
    bird.userData = { animSeed: i * 2 };
    bird.name = 'bird';
    bird.position.y = 7 + i;
    group.add(bird);
  }
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeTropical(group: THREE.Group) {
  for (let i = 0; i < 3; i++) {
    const dolphin = createDolphinMesh();
    dolphin.name = 'dolphin';
    dolphin.userData = { animSeed: i * 1.5 };
    dolphin.position.set(Math.cos(i * 2.2) * 8, 0, Math.sin(i * 2.2) * 8);
    group.add(dolphin);
  }
  const canoe = createBoatMesh(0xd97706);
  canoe.name = 'boat';
  group.add(canoe);
  for (let i = 0; i < 3; i++) {
    const bird = createBirdMesh();
    bird.userData = { animSeed: i * 2.5 };
    bird.name = 'bird';
    bird.position.y = 7 + i;
    group.add(bird);
  }
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeCity(group: THREE.Group) {
  const boat = createBoatMesh(0xef4444);
  boat.name = 'boat';
  group.add(boat);
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeCaspian(group: THREE.Group) {
  for (let i = 0; i < 3; i++) {
    const bird = createBirdMesh();
    bird.userData = { animSeed: i * 2 };
    bird.name = 'bird';
    bird.position.y = 8 + i;
    group.add(bird);
  }
  const boat = createBoatMesh(0x10b981);
  boat.name = 'boat';
  group.add(boat);
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function buildWildlifeCelebration(group: THREE.Group) {
  const plane = createAirplaneMesh();
  plane.name = 'plane';
  group.add(plane);
}

function createBirdMesh(): THREE.Group {
  const bird = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  body.rotation.x = Math.PI / 2;
  bird.add(body);

  const wingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.25), wingMat);
  leftWing.name = 'leftWing';
  leftWing.position.x = -0.3;
  bird.add(leftWing);

  const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.25), wingMat);
  rightWing.name = 'rightWing';
  rightWing.position.x = 0.3;
  bird.add(rightWing);

  return bird;
}

function createDolphinMesh(): THREE.Group {
  const dolphin = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  body.rotation.x = Math.PI / 2;
  dolphin.add(body);

  const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.45, 4), new THREE.MeshStandardMaterial({ color: 0x475569 }));
  dorsal.position.y = 0.35;
  dolphin.add(dorsal);

  return dolphin;
}

function createBoatMesh(colorHex: number): THREE.Group {
  const boat = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.7), new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 }));
  boat.add(hull);

  const sail = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.2, 3), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  sail.position.y = 0.7;
  boat.add(sail);

  return boat;
}

// Realistically oriented airplane flying with nose along -Z (FORWARD in Three.js)
function createAirplaneMesh(): THREE.Group {
  const plane = new THREE.Group();

  // Cylindrical Fuselage lying along Z axis
  const bodyGeo = new THREE.CylinderGeometry(0.22, 0.2, 2.2, 16);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.x = Math.PI / 2; // Lie along Z axis
  plane.add(body);

  // Aerodynamic Nose Cone pointed at -Z (FORWARD)
  const noseGeo = new THREE.ConeGeometry(0.22, 0.8, 16);
  const noseMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25 }); // Airline blue nose
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.z = -1.4;
  nose.rotation.x = -Math.PI / 2; // Point tip forward towards -Z!
  plane.add(nose);

  // Cockpit Windshield (Dark reflective glass) at -Z
  const glassGeo = new THREE.BoxGeometry(0.26, 0.14, 0.35);
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 0.16, -0.75);
  plane.add(glass);

  // Swept Wings extending along X axis
  const wingGeo = new THREE.BoxGeometry(3.6, 0.05, 0.8);
  const wingMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
  const wing = new THREE.Mesh(wingGeo, wingMat);
  wing.position.set(0, 0, 0);
  plane.add(wing);

  // Jet Turbines under the wings
  const engineGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12);
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
  const engL = new THREE.Mesh(engineGeo, engineMat);
  engL.rotation.x = Math.PI / 2;
  engL.position.set(-0.95, -0.16, 0);
  plane.add(engL);

  const engR = new THREE.Mesh(engineGeo, engineMat);
  engR.rotation.x = Math.PI / 2;
  engR.position.set(0.95, -0.16, 0);
  plane.add(engR);

  // Navigation lights: Green starboard (right), Red port (left)
  const navGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const greenLight = new THREE.Mesh(navGeo, new THREE.MeshBasicMaterial({ color: 0x22c55e }));
  greenLight.position.set(1.8, 0.02, 0);
  plane.add(greenLight);

  const redLight = new THREE.Mesh(navGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  redLight.position.set(-1.8, 0.02, 0);
  plane.add(redLight);

  // Vertical Tail Fin at +Z (AFT)
  const tailGeo = new THREE.BoxGeometry(0.05, 0.7, 0.6);
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
  const tail = new THREE.Mesh(tailGeo, tailMat);
  tail.position.set(0, 0.42, 1.0);
  plane.add(tail);

  // Horizontal Tail Stabilizers at +Z
  const hTailGeo = new THREE.BoxGeometry(1.3, 0.04, 0.4);
  const hTail = new THREE.Mesh(hTailGeo, wingMat);
  hTail.position.set(0, 0.15, 1.1);
  plane.add(hTail);

  return plane;
}

function buildPlacedSandboxMesh(itemType: string): THREE.Group {
  const group = new THREE.Group();

  switch (itemType) {
    case 'scenic_camp': {
      const tent = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.0, 6), new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 }));
      tent.position.y = 0.5;
      group.add(tent);
      break;
    }
    case 'photo_spot': {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
      pole.position.y = 0.6;
      group.add(pole);

      const cam = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
      cam.position.y = 1.25;
      group.add(cam);
      break;
    }
    case 'gourmet_cafe': {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      stand.position.y = 0.3;
      group.add(stand);

      const umb = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      umb.position.y = 1.3;
      group.add(umb);
      break;
    }
    case 'wildlife_post': {
      const binoc = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0x06b6d4 }));
      binoc.position.y = 0.55;
      group.add(binoc);
      break;
    }
    case 'shuttle_stop': {
      const bus = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 0.7), new THREE.MeshStandardMaterial({ color: 0x8b5cf6 }));
      bus.position.y = 0.3;
      group.add(bus);
      break;
    }
  }

  return group;
}
