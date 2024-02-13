import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    'electronAPI',
    {
        setTitle: (title: any) => ipcRenderer.send('set-title', title),
        invokeExample: async (arg: any) => {
            try {
                const result = await ipcRenderer.invoke('invoke-example', arg);
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
);