"use client";

import { useEffect, useRef, useState } from "react";

interface MemoryNode {
  id: string;
  x: number;
  y: number;
  connections: string[];
  glitchIntensity: number;
  pulsePhase: number;
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

      // Brain shape parameters
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const brainWidth = window.innerWidth * 0.4;
      const brainHeight = window.innerHeight * 0.6;

      // Cerebrum (main brain mass) - upper portion
      for (let i = 0; i < 8; i++) {
        const angle = (i / 7) * Math.PI * 0.8 - Math.PI * 0.4; // -36° to +36°
        const radius = brainWidth * 0.4 + Math.random() * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY - brainHeight * 0.3 + Math.sin(angle) * radius * 0.3;

        newNodes.push({
          id: `cerebrum-${i}`,
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 20,
          connections: [],
          glitchIntensity: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      // Cerebellum (lower back) - smaller rounded area
      for (let i = 0; i < 4; i++) {
        const angle = (i / 3) * Math.PI * 0.6 - Math.PI * 0.3; // -18° to +18°
        const radius = brainWidth * 0.2 + Math.random() * 15;
        const x = centerX + Math.cos(angle) * radius * 0.8;
        const y = centerY + brainHeight * 0.2 + Math.sin(angle) * radius * 0.5;

        newNodes.push({
          id: `cerebellum-${i}`,
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 15,
          connections: [],
          glitchIntensity: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      // Brainstem (bottom extension)
      for (let i = 0; i < 3; i++) {
        const x = centerX + (Math.random() - 0.5) * 40;
        const y = centerY + brainHeight * 0.4 + i * 30;

        newNodes.push({
          id: `brainstem-${i}`,
          x: x,
          y: y,
          connections: [],
          glitchIntensity: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      // Frontal lobe (front area)
      for (let i = 0; i < 5; i++) {
        const angle = (i / 4) * Math.PI * 0.4 - Math.PI * 0.2; // -12° to +12°
        const radius = brainWidth * 0.35 + Math.random() * 25;
        const x = centerX + Math.cos(angle) * radius * 1.1;
        const y = centerY - brainHeight * 0.25 + Math.sin(angle) * radius * 0.4;

        newNodes.push({
          id: `frontal-${i}`,
          x: x + (Math.random() - 0.5) * 25,
          y: y + (Math.random() - 0.5) * 20,
          connections: [],
          glitchIntensity: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      // Occipital lobe (back area)
      for (let i = 0; i < 4; i++) {
        const angle = (i / 3) * Math.PI * 0.5 - Math.PI * 0.25; // -15° to +15°
        const radius = brainWidth * 0.3 + Math.random() * 20;
        const x = centerX - Math.cos(angle) * radius * 0.9;
        const y = centerY - brainHeight * 0.1 + Math.sin(angle) * radius * 0.3;

        newNodes.push({
          id: `occipital-${i}`,
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 15,
          connections: [],
          glitchIntensity: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

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

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Check for node hover
    const hovered = nodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance < 30;
    });

    if (hovered && hovered.id !== hoveredNode) {
      setHoveredNode(hovered.id);
      playNodeSound(hovered);
    } else if (!hovered) {
      setHoveredNode(null);
    }
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

    // Draw connections with glitch effect
    connections.forEach((connection) => {
      const fromNode = nodes.find((n) => n.id === connection.from);
      const toNode = nodes.find((n) => n.id === connection.to);

      if (!fromNode || !toNode) return;

      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 1;
      ctx.globalAlpha =
        0.6 + Math.sin(time * 2 + connection.glitchOffset) * 0.2;

      // Glitch effect on connections
      const glitchAmount = Math.sin(time * 10 + connection.glitchOffset) * 3;

      ctx.beginPath();
      ctx.moveTo(fromNode.x + glitchAmount, fromNode.y);
      ctx.lineTo(toNode.x - glitchAmount, toNode.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pulse = Math.sin(time * 3 + node.pulsePhase) * 0.3 + 0.7;
      const glitchX = Math.sin(time * 20 + node.glitchIntensity * 10) * 2;
      const glitchY = Math.cos(time * 15 + node.glitchIntensity * 8) * 2;

      const isHovered = hoveredNode === node.id;
      const radius = isHovered ? 15 : 8 + pulse * 5;

      // Node glow
      const gradient = ctx.createRadialGradient(
        node.x + glitchX,
        node.y + glitchY,
        0,
        node.x + glitchX,
        node.y + glitchY,
        radius * 2
      );
      gradient.addColorStop(0, isHovered ? "#00ffff" : "#00ff88");
      gradient.addColorStop(0.5, isHovered ? "#0088ff" : "#00ff44");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x + glitchX, node.y + glitchY, radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Node core
      ctx.fillStyle = isHovered ? "#ffffff" : "#00ffff";
      ctx.beginPath();
      ctx.arc(node.x + glitchX, node.y + glitchY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Wireframe effect
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(node.x + glitchX, node.y + glitchY, radius + 5, 0, Math.PI * 2);
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
  }, [nodes, connections, time, hoveredNode]);

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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-pointer"
        onMouseMove={handleMouseMove}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            setMousePos({
              x: touch.clientX - rect.left,
              y: touch.clientY - rect.top,
            });
          }
        }}
      />

      {/* Overlay text */}
      <div className="absolute top-8 left-8 z-10 text-cyan-400 font-mono text-sm">
        <div className="mb-2">MEMORY TREE</div>
        <div className="text-xs opacity-70">
          Touch the nodes to hear the glitch
        </div>
      </div>

      {/* FPS counter */}
      <div className="absolute top-8 right-8 z-10 text-cyan-400 font-mono text-xs">
        {Math.round(1000 / 16)} FPS
      </div>
    </div>
  );
}
