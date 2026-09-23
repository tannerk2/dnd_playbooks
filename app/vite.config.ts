import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built folder works from any path (or opened from a tablet's file share).
export default defineConfig({ base: './', plugins: [react()] });
