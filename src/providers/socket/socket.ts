import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.__cpLocation` object
const URL = import.meta.env.VITE_APP_NODE_ENV === 'production' ? undefined : import.meta.env.VITE_APP_SOCKET_URL;

export const socket = io(URL, { autoConnect: true })
