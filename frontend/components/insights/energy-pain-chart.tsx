// frontend/components/insights/energy-pain-chart.tsx
'use client';

import { motion } from 'framer-motion';
import { useLogs } from '@/hooks/useLogs';
import { useEffect, useRef } from 'react';

export default function EnergyPainChart() {
  const { logs } = useLogs(14);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!logs || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const margin = 40;
    const plotWidth = width - 2 * margin;
    const plotHeight = height - 2 * margin;

    // Prepare data: last 14 days
    const energyData: (number | null)[] = Array(14).fill(null);
    const painData: (number | null)[] = Array(14).fill(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    logs.forEach(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - logDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 14) {
        const idxFromOld = 13 - diffDays;
        if (idxFromOld >= 0 && idxFromOld < 14) {
          // Use real data fields directly
          energyData[idxFromOld] = typeof log.energy === 'number' ? log.energy : null;
          painData[idxFromOld] = typeof log.pain === 'number' ? log.pain : null;
        }
      }
    });

    let energyProgress = 0;
    let painProgress = 0;
    let animationFrameId: number;

    const drawStep = () => {
      energyProgress += 0.03;
      painProgress += 0.03;
      if (energyProgress > 1) energyProgress = 1;
      if (painProgress > 1) painProgress = 1;

      drawChart(
        ctx,
        { energyData, painData },
        { width, height, margin, plotWidth, plotHeight },
        energyProgress,
        painProgress
      );

      if (energyProgress < 1 || painProgress < 1) {
        animationFrameId = requestAnimationFrame(drawStep);
      }
    };

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(drawStep);
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [logs]);

  if (!logs) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[340px] w-full rounded-2xl glass-card flex items-center justify-center text-sm text-muted-foreground"
      >
        Loading chart...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex flex-col justify-between h-[340px]"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground font-headings tracking-tight text-base">Energy & Pain Correlation</h3>
          <p className="text-xs text-muted-foreground">Track dynamic visual indices over 14 days</p>
        </div>
        <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100/50 uppercase tracking-widest font-headings">
          14 Days Log
        </span>
      </div>
      <div className="flex-1 min-h-0 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={240}
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
}

// Draw function
function drawChart(
  ctx: CanvasRenderingContext2D,
  data: { energyData: (number | null)[]; painData: (number | null)[] },
  { width, height, margin, plotWidth, plotHeight }: { width: number; height: number; margin: number; plotWidth: number; plotHeight: number },
  energyProgress: number,
  painProgress: number
) {
  ctx.clearRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin); // X axis
  ctx.stroke();

  // Draw grid lines (horizontal)
  for (let i = 1; i <= 5; i++) {
    const y = height - margin - (i * plotHeight / 5);
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(width - margin, y);
    ctx.strokeStyle = '#f1f5f9';
    ctx.stroke();
  }

  // Determine max value for scaling (max of both arrays ignoring nulls)
  const allVals = [...data.energyData, ...data.painData].filter((v): v is number => v !== null);
  
  if (allVals.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No energy or pain logs found for the last 14 days.', width / 2, height / 2);
    ctx.textAlign = 'left';
    return;
  }

  const maxVal = Math.max(...allVals);
  const maxValSafe = isFinite(maxVal) && maxVal > 0 ? maxVal : 5;

  // Helper to get point
  const getPoint = (val: number | null, index: number, progress: number) => {
    if (val === null) return null;
    const x = margin + (index / (data.energyData.length - 1)) * plotWidth;
    const y = height - margin - (val / maxValSafe) * plotHeight;
    // Apply progress: only draw up to index * progress
    const maxIndex = Math.floor((data.energyData.length - 1) * progress);
    if (index > maxIndex) return null;
    return { x, y };
  };

  // Draw energy line (green)
  ctx.strokeStyle = '#A8C5A0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let first = true;
  data.energyData.forEach((val, idx) => {
    const pt = getPoint(val, idx, energyProgress);
    if (!pt) {
      if (!first) {
        ctx.stroke();
        ctx.beginPath();
      }
      return;
    }
    if (first) {
      ctx.moveTo(pt.x, pt.y);
      first = false;
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
  ctx.stroke();

  // Draw energy points
  ctx.fillStyle = '#A8C5A0';
  data.energyData.forEach((val, idx) => {
    const pt = getPoint(val, idx, 1);
    if (pt) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw pain line (pink)
  ctx.strokeStyle = '#F48FB1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let first2 = true;
  data.painData.forEach((val, idx) => {
    const pt = getPoint(val, idx, painProgress);
    if (!pt) {
      if (!first2) {
        ctx.stroke();
        ctx.beginPath();
      }
      return;
    }
    if (first2) {
      ctx.moveTo(pt.x, pt.y);
      first2 = false;
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
  ctx.stroke();

  // Draw pain points
  ctx.fillStyle = '#F48FB1';
  data.painData.forEach((val, idx) => {
    const pt = getPoint(val, idx, 1);
    if (pt) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw legend
  const legendX = margin + 15;
  const legendY = margin - 15;
  // Energy
  ctx.fillStyle = '#A8C5A0';
  ctx.beginPath();
  ctx.arc(legendX, legendY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Energy (1-5)', legendX + 10, legendY + 3.5);
  
  // Pain
  ctx.fillStyle = '#F48FB1';
  ctx.beginPath();
  ctx.arc(legendX + 110, legendY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.fillText('Pain (0-5)', legendX + 120, legendY + 3.5);

  // X axis labels (day numbers)
  const numTicks = 4;
  for (let i = 0; i <= numTicks; i++) {
    const x = margin + (i / numTicks) * plotWidth;
    const dayNum = Math.round((i / numTicks) * 13) + 1; // 1 to 14
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Day ${dayNum}`, x - 12, height - margin + 18);
  }

  // Y axis labels
  for (let i = 0; i <= 5; i++) {
    const y = height - margin - (i * plotHeight / 5);
    const val = Math.round((i / 5) * maxValSafe);
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    ctx.font = '10px sans-serif';
    ctx.fillText(`${val}`, margin - 10, y + 3.5);
    ctx.textAlign = 'left';
  }
}