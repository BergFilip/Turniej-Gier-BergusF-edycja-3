import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom/client', 'zustand', 'zustand/middleware'],
  },
};
