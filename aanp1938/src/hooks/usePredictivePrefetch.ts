"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export function usePredictivePrefetch() {
  const router = useRouter();
  const positions = useRef<{ x: number; y: number; t: number }[]>([]);
  const prefetchedUrls = useRef<Set<string>>(new Set());
  const frameRef = useRef<number>(0);

  const getTrajectory = useCallback(() => {
    const pts = positions.current;
    if (pts.length < 3) return null;
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 3];
    const dt = Math.max(last.t - prev.t, 1);
    return {
      vx: (last.x - prev.x) / dt,
      vy: (last.y - prev.y) / dt,
    };
  }, []);

  const checkPredictiveTarget = useCallback(() => {
    const traj = getTrajectory();
    if (!traj) return;

    const speed = Math.sqrt(traj.vx ** 2 + traj.vy ** 2);
    if (speed < 0.3) return; // only predict on deliberate motion

    const last = positions.current[positions.current.length - 1];
    // Project 200ms ahead
    const projX = last.x + traj.vx * 200;
    const projY = last.y + traj.vy * 200;

    const links = document.querySelectorAll<HTMLAnchorElement>("a[href]");
    links.forEach((link) => {
      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((projX - cx) ** 2 + (projY - cy) ** 2);
      const threshold = Math.max(rect.width, rect.height) * 0.9;

      if (dist < threshold) {
        const href = link.getAttribute("href") || "";
        if (href.startsWith("/") && !prefetchedUrls.current.has(href)) {
          prefetchedUrls.current.add(href);
          router.prefetch(href);
        }
      }
    });
  }, [getTrajectory, router]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      positions.current.push({ x: e.clientX, y: e.clientY, t: now });
      if (positions.current.length > 10) positions.current.shift();

      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(checkPredictiveTarget);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, [checkPredictiveTarget]);
}
