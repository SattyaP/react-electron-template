import { useEffect, useState } from 'react';
import '../App.css';
import ApiModels from '../utils/ApiModels';
const { ipcRenderer } = window.electron;

// TODO: Handle callback api for validate count user used that license key
export default function AuthPages() {
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const firstRequest = await ApiModels.validation(licenseKey) as { success: boolean, message: string, data: any };
      
      if (!firstRequest.success) {
        setError(firstRequest.message); 
        return setLoading(false);
      }

      // [BUG] => CALLBACK API 
      // Details : why it need to restart the app to validate cause when the mac_address on server is already empty it said the license already used but it still update the mac_address even its said the license already used
      const callBackReq = await ApiModels.callBack(licenseKey, firstRequest.success, firstRequest.data.app_id) as { success: boolean, message: string, data: any}
      console.log(callBackReq);
      
      if (!callBackReq.success) {
        setError(callBackReq.message);
        return setLoading(false);
      } else {
        setError('');
        ipcRenderer.sendMessage('check-auth', true);
        ipcRenderer.sendMessage('activate-main-apps', firstRequest.data);
      }
    } catch (error) {
      setError('An error occurred while validating the license key');
    }
    setLoading(false);
  };

  return (
    <div className="px-6 py-4">
      <div className="mb-3">
        <label className="block text-sm font-bold mb-2" htmlFor="license-key">
          License Key
        </label>
        <input
          autoFocus
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="license-key"
          type="text"
          placeholder="license-key.."
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
        ></input>
        <div
          id="error-helper"
          className={`${
            error ? 'text-red-500' : 'text-gray-500'
          } text-xs italic mt-1`}
          dangerouslySetInnerHTML={{
            __html: error
              ? `${error}. <a role="button" style="color: blue;" href="https://www.alsavdev.com/" target="_blank">need help ?</a>`
              : 'Enter the valid license key',
          }}
        ></div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        type="button"
        className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 items-center"
      >
        {loading && (
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 mt-[-3px] h-4 me-2 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        )}
        {loading ? 'Validating' : 'Submit'}
      </button>
    </div>
  );
}
