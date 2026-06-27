'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useUserData } from '@/hooks/useUserData';

// Define the types for the data
export type CycleChartData = {
  dayInCycle: number;
  phase: string;
  daysUntilNextPeriod: number;
  nextPeriodStart: Date;
  ovulationDate: Date;
  daysUntilOvulation: number;
};

export type CycleChartProps = {
  data?: CycleChartData;
  loading?: boolean;
};

export default function CycleChart({ data, loading = false }: CycleChartProps) {
  const { data: userData } = useUserData();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [isInView, setIsInView] = useState(false);

  const hasSettings = !!userData?.lastPeriodStart;

  // We'll generate the points based on the data
  // If we don't have data, we'll use default values for the skeleton
  const defaultData: CycleChartData = {
    dayInCycle: 14,
    phase: 'follicular',
    daysUntilNextPeriod: 14,
    nextPeriodStart: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    ovulationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    daysUntilOvulation: 0,
  };

  const chartData = data || defaultData;

  // We'll generate the points for the curve
  // We'll use a fixed cycle length of 28 days for the skeleton
  const cycleLength = 28;
  const pointsRef = useRef<Array<{x: number; y: number}>>([]);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Generate points for the curve
    const points: Array<{x: number; y: number}> = [];
    for (let i = 0; i <= cycleLength; i++) {
      let phase: string;
      if (i <= 5) phase = 'menstrual';
      else if (i < 14) phase = 'follicular';
      else if (i === 14) phase = 'ovulatory';
      else phase = 'luteal';

      let y: number;
      if (phase === 'menstrual') y = 80;
      else if (phase === 'follicular') y = 80 - ((i - 5) * 15);
      else if (phase === 'ovulatory') y = 20;
      else y = 20 + ((i - 14) * 15);
      y += (Math.random() - 0.5) * 4;
      const x = (i / cycleLength) * 100;
      points.push({ x, y });
    }
    pointsRef.current = points;

    // If we have data, we can adjust the points based on the actual cycle day and phase
    // But for simplicity, we'll use the same curve and just highlight the current day
  }, [chartData]);

  // Detect when chart is in view
  useEffect(() => {
    if (!chartRef.current) return;
    const ref = chartRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsInView(true);
      });
    }, { threshold: 0.1 });
    observer.observe(ref);
    return () => observer.unobserve(ref);
  }, []);

  // Animation: draw the chart when in view
  useEffect(() => {
    if (!isInView || !chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const width = chartRef.current.width;
    const height = chartRef.current.height;
    const margin = 40;
    const plotWidth = width - 2 * margin;
    const plotHeight = height - 2 * margin;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin); // X axis
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin); // Y axis
    ctx.stroke();

    // Draw grid lines (horizontal)
    for (let i = 1; i <= 5; i++) {
      const y = height - margin - (i * plotHeight / 5);
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.strokeStyle = '#eee';
      ctx.stroke();
    }

    // Determine max value for scaling (we'll use a fixed max of 100 for the y-axis)
    const maxVal = 100;

    // Get the points to draw
    const points = pointsRef.current;
    if (!points || points.length < 2) return;

    // Determine how many points to draw based on progress (for animation)
    // We'll animate the drawing of the line from left to right
    // We'll use a simple timeout for now; in a real app, we'd use framer-motion animation
    let progress = 0;
    if (isInView) {
      // We'll animate over 1.5 seconds
      const startTime = Date.now();
      const duration = 1500;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        drawChart(ctx, points, progress, margin, plotWidth, plotHeight, maxVal, chartData);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    } else {
      drawChart(ctx, points, 1, margin, plotWidth, plotHeight, maxVal, chartData);
    }
  }, [isInView, chartData]);

  if (!hasSettings) {
    return (
      <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6">
        <span className="text-4xl mb-2 select-none">📅</span>
        <h4 className="text-sm font-bold text-gray-700 font-headings">No Period Dates Configured</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
          Please configure your last period start date in Settings to see your cycle graph.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <div className="space-y-4">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20">
            <span className="text-[var(--pink-primary)]">📊</span>
          </div>
          <p className="text-sm text-muted-foreground">Loading cycle chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <canvas
        ref={chartRef}
        width={800}
        height={300}
        className="w-full h-full"
      />
    </div>
  );
}

// Helper function to draw the chart
function drawChart(
  ctx: CanvasRenderingContext2D,
  points: Array<{x: number; y: number}>,
  progress: number,
  margin: number,
  plotWidth: number,
  plotHeight: number,
  maxVal: number,
  data: any
) {
  // Determine number of points to draw
  const steps = Math.max(2, Math.floor(points.length * progress));
  if (steps < 2) return;

  // Gradient fill under curve
  const canvasHeight = plotHeight + 2 * margin;
  const canvasWidth = plotWidth + 2 * margin;
  const gradient = ctx.createLinearGradient(0, canvasHeight * 0.8, 0, canvasHeight * 0.2);
  gradient.addColorStop(0, 'rgba(168, 197, 160, 0.2)');
  gradient.addColorStop(1, 'rgba(248, 187, 208, 0.2)');

  // Fill area under curve
  ctx.beginPath();
  ctx.moveTo(margin, plotHeight + margin);
  for (let i = 0; i < steps; i++) {
    const px = (points[i].x / 100) * plotWidth + margin;
    const py = plotHeight + margin - (points[i].y / maxVal) * plotHeight;
    ctx.lineTo(px, py);
  }
  ctx.lineTo((points[steps - 1].x / 100) * plotWidth + margin, plotHeight + margin);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Stroke line
  ctx.beginPath();
  ctx.moveTo(
    (points[0].x / 100) * plotWidth + margin,
    plotHeight + margin - (points[0].y / maxVal) * plotHeight
  );
  for (let i = 1; i < steps; i++) {
    const px = (points[i].x / 100) * plotWidth + margin;
    const py = plotHeight + margin - (points[i].y / maxVal) * plotHeight;
    ctx.lineTo(px, py);
  }
  ctx.strokeStyle = '#A8C5A0';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Current day indicator
  const currentDay = data?.dayInCycle ?? 14;
  const currentIndex = Math.min(
    Math.floor((currentDay / 28) * points.length),
    points.length - 1
  );
  if (currentIndex < steps) {
    const cx = (points[currentIndex].x / 100) * plotWidth + margin;
    const cy = plotHeight + margin - (points[currentIndex].y / maxVal) * plotHeight;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#F8BBD0';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Axis labels
  ctx.fillStyle = '#666';
  ctx.font = '12px sans-serif';
  const phaseLabels = [
    { name: 'Menstrual', x: 0 },
    { name: 'Follicular', x: 25 },
    { name: 'Ovulation', x: 50 },
    { name: 'Luteal', x: 75 }
  ];
  phaseLabels.forEach(label => {
    const lx = (label.x / 100) * plotWidth + margin;
    ctx.fillText(label.name, lx - 20, plotHeight + margin + 20);
  });
}