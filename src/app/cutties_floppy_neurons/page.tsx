"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { dataLogs, DataLog } from "./data";

interface MemoryNode {
  id: string;
  x: number;
  y: number;
  z: number;
  connections: string[];
  glitchIntensity: number;
  pulsePhase: number;
  dataLog?: DataLog;
}

interface Connection {
  from: string;
  to: string;
  glitchOffset: number;
}

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [nodes, setNodes] = useState<MemoryNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null
  );
  const [selectedNode, setSelectedNode] = useState<MemoryNode | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Helper function to get relative time
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 1) return null;
    if (diffInYears === 1) return "1 year ago";
    if (diffInMonths > 0)
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    if (diffInWeeks > 0)
      return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
    if (diffInDays > 0)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    if (diffInHours > 0)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInMinutes > 0)
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    return "just now";
  };

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Generate memory tree structure
  useEffect(() => {
    const generateTree = () => {
      const newNodes: MemoryNode[] = [];
      const newConnections: Connection[] = [];

      // Cluster parameters
      const centerX = 0;
      const centerY = 0;
      const centerZ = 0;
      const clusterRadius = 400;

      // Create nodes from data logs
      dataLogs.forEach((dataLog, index) => {
        // Determine node type based on index
        let nodeType: "cluster" | "spiral" | "outlier";
        let distributionParams: {
          x: number;
          y: number;
          z: number;
          offset: number;
        };

        if (index < 35) {
          // Cluster nodes (first 35)
          nodeType = "cluster";
          const radius = Math.random() * clusterRadius;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          distributionParams = {
            x: centerX + radius * Math.sin(phi) * Math.cos(theta),
            y: centerY + radius * Math.cos(phi),
            z: centerZ + radius * Math.sin(phi) * Math.sin(theta),
            offset: 50,
          };
        } else if (index < 43) {
          // Spiral nodes (next 8)
          nodeType = "spiral";
          const spiralIndex = index - 35;
          const angle = (spiralIndex / 7) * Math.PI * 4;
          const radius = 200 + spiralIndex * 30;
          distributionParams = {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            z: centerZ + (Math.random() - 0.5) * 100,
            offset: 40,
          };
        } else {
          // Outlier nodes (last 5)
          nodeType = "outlier";
          const angle = Math.random() * Math.PI * 2;
          const radius = clusterRadius * 0.8 + Math.random() * 200;
          distributionParams = {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            z: centerZ + (Math.random() - 0.5) * 150,
            offset: 60,
          };
        }

        newNodes.push({
          id: dataLog.id, // Use the actual ID from data log
          x:
            distributionParams.x +
            (Math.random() - 0.5) * distributionParams.offset,
          y:
            distributionParams.y +
            (Math.random() - 0.5) * distributionParams.offset,
          z: distributionParams.z,
          connections: [],
          glitchIntensity: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
          dataLog,
        });
      });

      // Create connections
      newNodes.forEach((node, index) => {
        const numConnections = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numConnections; i++) {
          const targetIndex = (index + i + 1) % newNodes.length;
          if (Math.abs(newNodes[targetIndex].y - node.y) < 200) {
            newConnections.push({
              from: node.id,
              to: newNodes[targetIndex].id,
              glitchOffset: Math.random() * 10,
            });
            node.connections.push(newNodes[targetIndex].id);
          }
        }
      });

      setNodes(newNodes);
      setConnections(newConnections);
    };

    generateTree();
  }, []);

  // Animation loop
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setTime((prev) => prev + 0.016);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // 3D rotation matrix functions
  const rotateX = (x: number, y: number, z: number, angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x,
      y: y * cos - z * sin,
      z: y * sin + z * cos,
    };
  };

  const rotateY = (x: number, y: number, z: number, angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos + z * sin,
      y: y,
      z: -x * sin + z * cos,
    };
  };

  // Project 3D to 2D
  const project3D = (x: number, y: number, z: number) => {
    const distance = 1000;
    const scale = distance / (distance + z);
    const sidebarWidth = sidebarCollapsed ? 0 : 320; // 320px when expanded
    const centerX = sidebarWidth + (window.innerWidth - sidebarWidth) / 2;
    return {
      x: x * scale * zoom + centerX,
      y: y * scale * zoom + window.innerHeight / 2,
    };
  };

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (isDragging) {
      const deltaX = x - lastMousePos.x;
      const deltaY = y - lastMousePos.y;

      setRotationY((prev) => prev + deltaX * 0.01);
      setRotationX((prev) => prev + deltaY * 0.01);

      setLastMousePos({ x, y });
    }

    // Check for node hover (using projected coordinates)
    const projectedNodes = nodes.map((node) => {
      let rotated = rotateX(node.x, node.y, node.z, rotationX);
      rotated = rotateY(rotated.x, rotated.y, rotated.z, rotationY);
      const projected = project3D(rotated.x, rotated.y, rotated.z);
      return { ...node, projectedX: projected.x, projectedY: projected.y };
    });

    const hovered = projectedNodes.find((node) => {
      const distance = Math.sqrt(
        (x - node.projectedX) ** 2 + (y - node.projectedY) ** 2
      );
      return distance < 30;
    });

    if (hovered && hovered.id !== hoveredNode) {
      setHoveredNode(hovered.id);
      playNodeSound(hovered);
    } else if (!hovered) {
      setHoveredNode(null);
    }
  };

  const handleNodeClick = (node: MemoryNode) => {
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
      setEnlargedImage(null);
    } else {
      setSelectedNode(node);
      setEnlargedImage(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return; // Don't trigger click if we were dragging

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check for node click (using projected coordinates)
    const projectedNodes = nodes.map((node) => {
      let rotated = rotateX(node.x, node.y, node.z, rotationX);
      rotated = rotateY(rotated.x, rotated.y, rotated.z, rotationY);
      const projected = project3D(rotated.x, rotated.y, rotated.z);
      return { ...node, projectedX: projected.x, projectedY: projected.y };
    });

    const clicked = projectedNodes.find((node) => {
      const distance = Math.sqrt(
        (x - node.projectedX) ** 2 + (y - node.projectedY) ** 2
      );
      return distance < 30;
    });

    if (clicked) {
      handleNodeClick(clicked);
    }
  };

  // Handle mouse wheel for zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const zoomDelta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    setZoom((prevZoom) => Math.max(0.1, Math.min(5, prevZoom + zoomDelta)));
  };

  // Play sound for node interaction
  const playNodeSound = (node: MemoryNode) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    // Create glitchy sound based on node properties
    const baseFreq = 200 + node.glitchIntensity * 400;
    oscillator.frequency.setValueAtTime(
      baseFreq,
      audioContextRef.current.currentTime
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      baseFreq * (1 + node.glitchIntensity * 0.5),
      audioContextRef.current.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContextRef.current.currentTime + 0.3
    );

    oscillator.type = "sine";
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.3);
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sort nodes by Z-depth for proper 3D rendering
    const sortedNodes = [...nodes].sort((a, b) => {
      let rotatedA = rotateX(a.x, a.y, a.z, rotationX);
      rotatedA = rotateY(rotatedA.x, rotatedA.y, rotatedA.z, rotationY);
      let rotatedB = rotateX(b.x, b.y, b.z, rotationX);
      rotatedB = rotateY(rotatedB.x, rotatedB.y, rotatedB.z, rotationY);
      return rotatedB.z - rotatedA.z;
    });

    // Draw connections with glitch effect
    connections.forEach((connection) => {
      const fromNode = sortedNodes.find((n) => n.id === connection.from);
      const toNode = sortedNodes.find((n) => n.id === connection.to);

      if (!fromNode || !toNode) return;

      // Apply 3D rotation
      let rotatedFrom = rotateX(fromNode.x, fromNode.y, fromNode.z, rotationX);
      rotatedFrom = rotateY(
        rotatedFrom.x,
        rotatedFrom.y,
        rotatedFrom.z,
        rotationY
      );
      let rotatedTo = rotateX(toNode.x, toNode.y, toNode.z, rotationX);
      rotatedTo = rotateY(rotatedTo.x, rotatedTo.y, rotatedTo.z, rotationY);

      // Project to 2D
      const projectedFrom = project3D(
        rotatedFrom.x,
        rotatedFrom.y,
        rotatedFrom.z
      );
      const projectedTo = project3D(rotatedTo.x, rotatedTo.y, rotatedTo.z);

      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 1;
      ctx.globalAlpha =
        0.6 + Math.sin(time * 2 + connection.glitchOffset) * 0.2;

      // Glitch effect on connections
      const glitchAmount = Math.sin(time * 10 + connection.glitchOffset) * 3;

      ctx.beginPath();
      ctx.moveTo(projectedFrom.x + glitchAmount, projectedFrom.y);
      ctx.lineTo(projectedTo.x - glitchAmount, projectedTo.y);
      ctx.stroke();
    });

    // Draw nodes
    sortedNodes.forEach((node) => {
      // Apply 3D rotation
      let rotated = rotateX(node.x, node.y, node.z, rotationX);
      rotated = rotateY(rotated.x, rotated.y, rotated.z, rotationY);

      // Project to 2D
      const projected = project3D(rotated.x, rotated.y, rotated.z);

      const pulse = Math.sin(time * 3 + node.pulsePhase) * 0.3 + 0.7;
      const glitchX = Math.sin(time * 20 + node.glitchIntensity * 10) * 2;
      const glitchY = Math.cos(time * 15 + node.glitchIntensity * 8) * 2;

      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode?.id === node.id;
      const radius = isSelected ? 20 : isHovered ? 15 : 8 + pulse * 5;

      // Node glow
      const gradient = ctx.createRadialGradient(
        projected.x + glitchX,
        projected.y + glitchY,
        0,
        projected.x + glitchX,
        projected.y + glitchY,
        radius * 2
      );
      gradient.addColorStop(
        0,
        isSelected ? "#ff00ff" : isHovered ? "#00ffff" : "#00ff88"
      );
      gradient.addColorStop(
        0.5,
        isSelected ? "#ff0088" : isHovered ? "#0088ff" : "#00ff44"
      );
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(
        projected.x + glitchX,
        projected.y + glitchY,
        radius * 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Node core
      ctx.fillStyle = isSelected
        ? "#ffffff"
        : isHovered
        ? "#ffffff"
        : "#00ffff";
      ctx.beginPath();
      ctx.arc(
        projected.x + glitchX,
        projected.y + glitchY,
        radius,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Wireframe effect
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(
        projected.x + glitchX,
        projected.y + glitchY,
        radius + 5,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw growing light effect from ground
    const groundGradient = ctx.createLinearGradient(
      0,
      canvas.height,
      0,
      canvas.height * 0.3
    );
    groundGradient.addColorStop(0, "rgba(0, 255, 255, 0.3)");
    groundGradient.addColorStop(0.5, "rgba(0, 255, 255, 0.1)");
    groundGradient.addColorStop(1, "transparent");

    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height * 0.3, canvas.width, canvas.height * 0.7);
  }, [
    nodes,
    connections,
    time,
    hoveredNode,
    rotationX,
    rotationY,
    zoom,
    sidebarCollapsed,
  ]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ touchAction: "none" }}
    >
      {/* Canvas container */}
      <div className="absolute inset-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          style={{ touchAction: "none" }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
          onTouchStart={(e) => {
            if (e.touches.length === 2) {
              const touch1 = e.touches[0];
              const touch2 = e.touches[1];
              const distance = Math.sqrt(
                Math.pow(touch1.clientX - touch2.clientX, 2) +
                  Math.pow(touch1.clientY - touch2.clientY, 2)
              );
              setLastTouchDistance(distance);
            }
          }}
          onTouchMove={(e) => {
            e.preventDefault();

            if (e.touches.length === 2 && lastTouchDistance !== null) {
              // Pinch to zoom
              const touch1 = e.touches[0];
              const touch2 = e.touches[1];
              const distance = Math.sqrt(
                Math.pow(touch1.clientX - touch2.clientX, 2) +
                  Math.pow(touch1.clientY - touch2.clientY, 2)
              );

              const zoomDelta = (distance - lastTouchDistance) * 0.01;
              setZoom((prevZoom) =>
                Math.max(0.1, Math.min(5, prevZoom + zoomDelta))
              );
              setLastTouchDistance(distance);
            } else if (e.touches.length === 1) {
              // Single touch for mouse position
              const touch = e.touches[0];
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                setMousePos({
                  x: touch.clientX - rect.left,
                  y: touch.clientY - rect.top,
                });
              }
            }
          }}
          onTouchEnd={() => {
            setLastTouchDistance(null);
          }}
        />
      </div>

      {/* Left Sidebar - Node List */}
      <div
        className={`absolute left-0 top-0 bottom-0 bg-black/90 border-r border-cyan-400/30 pointer-events-auto transition-all duration-300 ${
          sidebarCollapsed ? "w-12" : "w-80"
        }`}
      >
        <div className="p-4 border-b border-cyan-400/30">
          <div className="flex justify-between items-center">
            {!sidebarCollapsed && (
              <>
                <h2 className="text-cyan-400 font-mono font-bold text-lg">
                  JOURNAL ENTRIES
                </h2>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="text-cyan-400 hover:text-white transition-colors cursor-pointer"
                  title="Collapse sidebar"
                >
                  ◀
                </button>
              </>
            )}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-cyan-400 hover:text-white transition-colors text-lg cursor-pointer"
                title="Expand sidebar"
              >
                ▶
              </button>
            )}
          </div>
          {!sidebarCollapsed && (
            <p className="text-cyan-400/70 text-xs mt-2">
              Click to select • {nodes.length} total entries
            </p>
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="overflow-y-auto h-full">
            <div className="p-4 space-y-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    selectedNode?.id === node.id
                      ? "bg-cyan-400/20 border-cyan-400 text-white"
                      : "bg-black/50 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">
                        {node.id.length > 15
                          ? `${node.id.substring(0, 15)}...`
                          : node.id}
                      </span>
                      {node.dataLog && (
                        <span className="text-xs text-cyan-300/70">
                          {getRelativeTime(node.dataLog.timestamp)}
                        </span>
                      )}
                    </div>
                    {node.dataLog &&
                      getRelativeTime(node.dataLog.timestamp) === null && (
                        <span className="text-xs opacity-70">
                          {node.dataLog.timestamp.toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      )}
                  </div>
                  <div className="text-xs opacity-80 line-clamp-2">
                    {node.dataLog?.content}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.dataLog?.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-cyan-400/20 border border-cyan-400/50 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {node.dataLog && node.dataLog.tags.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-cyan-400/20 border border-cyan-400/50 rounded text-xs">
                        +{node.dataLog.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* UI Overlay - separate from canvas */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Overlay text */}
        <div
          className={`absolute top-8 text-cyan-400 font-mono text-sm transition-all duration-300 ${
            sidebarCollapsed ? "left-20" : "left-96"
          }`}
        >
          <div className="mb-2">CUTTIE&apos;S FLOPPY NEURONS</div>
          <div className="text-xs opacity-70">
            Drag to rotate • Scroll to zoom • Click nodes for details
          </div>
        </div>

        {/* FPS counter */}
        <div className="absolute top-8 right-8 text-cyan-400 font-mono text-xs">
          <div>{Math.round(1000 / 16)} FPS</div>
          <div className="opacity-70">Zoom: {Math.round(zoom * 100)}%</div>
        </div>

        {/* Selected Node Details Overlay */}
        {selectedNode && selectedNode.dataLog && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="bg-black/95 border border-cyan-400/50 rounded-lg p-8 text-cyan-400 font-mono max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto transition-all duration-300 pointer-events-auto"
              style={{
                transform: sidebarCollapsed
                  ? "translateX(0)"
                  : "translateX(160px)",
              }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{selectedNode.id}</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-cyan-400 hover:text-white transition-colors text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-cyan-300 font-semibold">
                    Timestamp:
                  </span>
                  <span className="ml-2 text-white">
                    {selectedNode.dataLog.timestamp.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-cyan-300 font-semibold">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedNode.dataLog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/50 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-cyan-300 font-semibold">Content:</span>
                  <p className="mt-2 text-white text-sm leading-relaxed">
                    {selectedNode.dataLog.content}
                  </p>
                </div>

                {selectedNode.dataLog.images.length > 0 && (
                  <div>
                    <span className="text-cyan-300 font-semibold">Images:</span>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {selectedNode.dataLog.images.map((image, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-32 h-32 object-cover rounded border border-purple-400/50 bg-purple-400/10 cursor-pointer hover:border-purple-400/80 transition-colors"
                            onClick={() => setEnlargedImage(image)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                          <span className="text-xs text-purple-300 mt-1 text-center">
                            {image}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.dataLog.links.length > 0 && (
                  <div>
                    <span className="text-cyan-300 font-semibold">Links:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedNode.dataLog.links.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-400/20 border border-blue-400/50 rounded text-sm text-blue-300 hover:bg-blue-400/30 transition-colors"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enlarged Image Overlay - Inside Modal */}
                {enlargedImage && (
                  <div className="absolute inset-0 flex items-start justify-center pt-8 pointer-events-none bg-black/90 z-10">
                    <div className="relative max-w-[70%] max-h-[60%] pointer-events-auto">
                      <img
                        src={enlargedImage}
                        alt="Enlarged image"
                        className="max-w-full max-h-full object-contain rounded border border-purple-400/50"
                      />
                      <button
                        onClick={() => setEnlargedImage(null)}
                        className="absolute -top-2 -right-2 text-purple-400 hover:text-white transition-colors text-sm bg-black/90 rounded-full w-6 h-6 flex items-center justify-center border border-purple-400/50 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hover Node Info */}
        {hoveredNode && !selectedNode && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-cyan-400/50 rounded-lg p-6 text-cyan-400 font-mono text-center min-w-[200px]">
            <div className="font-bold mb-2 text-lg">
              Hover: {hoveredNode && hoveredNode.length > 10 ? `${hoveredNode.substring(0, 10)}...` : hoveredNode}
            </div>
            <div className="text-sm opacity-70">Click for details</div>
          </div>
        )}
      </div>
    </div>
  );
}
