import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: any, ...args: unknown[]) {
      ipcRenderer.send(channel as string, ...args);
    },
    on(channel: any, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func.apply(null, args);
      ipcRenderer.on(channel as string, subscription);

      return () => {
        ipcRenderer.removeListener(channel as string, subscription);
      };
    },
    once(channel: any, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel as string, (_event, ...args) => func.apply(null, args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
