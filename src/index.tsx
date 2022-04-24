import './assets/css/app.css';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';

const root = document.getElementById('app-root');
createRoot(root!).render(<App />)