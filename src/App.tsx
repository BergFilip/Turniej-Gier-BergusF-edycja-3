import { AdminPanel } from './components/AdminPanel';
import { GameBoard } from './components/GameBoard';

export const App = () => {
  const isAdmin = window.location.pathname === '/admin';
  return isAdmin ? <AdminPanel /> : <GameBoard />;
};
