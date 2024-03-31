import { AxiosInstance } from "../auth/AxiosInstance";
const { ipcRenderer } = window.electron

class ApiModels {    
    static async validation(licenseKey: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await AxiosInstance(licenseKey).post(`lisence/validated?lisence_key=${licenseKey}`);
                resolve(response.data);
            } catch (error) {
                reject(error)
            }
        });
    }

    static async getStatusLicense(licenseKey: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await AxiosInstance(licenseKey).get(`status?lisence_key=${licenseKey}`);
                resolve(response.data);
            } catch (error) {
                reject(error)
            }
        });
    }

    static async logout(licenseKey: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await AxiosInstance(licenseKey).post(`logout?lisence_key=${licenseKey}`);
                resolve(response.data);
            } catch (error) {
                reject(error)
            }
        });
    }

    static async callBack(licenseKey: string, valid: boolean, app_id: string) {
        ipcRenderer.sendMessage('get-mac');
        return new Promise((resolve, reject) => {
            ipcRenderer.on('get-mac', async (macs) => {
                try {
                    const response = await AxiosInstance(licenseKey).post(`lisence/validated/callback/valid?valid=${valid}&appId=${app_id}&mac_address=${macs}`);
                    resolve(response.data);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}

export default ApiModels;