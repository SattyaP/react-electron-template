import { createRoot } from 'react-dom/client';
const { ipcRenderer } = window.electron;
import App from './App';
import AuthPages from './auth/AuthPage';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

ipcRenderer.sendMessage('check-auth');
ipcRenderer.on('check-auth', (args) => {  
  root.render(args ? <App /> : <AuthPages />);
});
