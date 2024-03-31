import { useEffect, useState } from 'react';
const { ipcRenderer } = window.electron;
import Loading from '../components/Loading';
import { Toast } from '../utils/Toast';
import ApiModels from '../utils/ApiModels';

export default function AccountPage() {
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    ipcRenderer.sendMessage('get-data-user');
    ipcRenderer.on('get-data-user', (args: any) => {
      setData(JSON.parse(args));
    });
  }, []);

  useEffect(() => {
    if (data.license_key) {
      _getStatusLicense(data.license_key);
    }
  }, [data.license_key]);

  const _getStatusLicense = async (license_key: string) => {
    try {
      setIsLoading(true);
      const response = await ApiModels.getStatusLicense(license_key) as { success: boolean, message: string, data: any };
      setStatus(response.data.status);      
      setIsLoading(false);
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something error with your license key',
      });
      setIsLoading(false);
    }
  };

  const logout = () =>
    Toast
      .fire({
        title: 'Are you sure? to logout',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await ApiModels.logout(data.license_key) as { success: boolean, message: string, data: any };
          
          if (!response.success) {
            return Toast.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.message,
            });
          }

          ipcRenderer.sendMessage('logout');
        }
      })
      .catch(() => {
        setError('An error occurred while logout');
        Toast.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
      });

  return (
    <div className="mx-auto w-full">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="bg-white p-6 rounded mb-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Account Settings
            </h1>
          </div>

          <div className="bg-white p-6 rounded">
            <div className="mb-8">
              <h5 className="font-medium mb-3">Username</h5>
              <p className="shadow rounded w-full flex h-12 items-center align-middle px-4">
                {data?.customer_email?.split('@')[0]}
              </p>
            </div>
            <div className="mb-6">
              <h5 className="font-medium mb-1">Contact Email</h5>
              <p className="text-gray-600 text-sm mb-3">
                Manage your accounts email address for the invoices
              </p>
              <div className="flex gap-3">
                <p className="shadow rounded w-full justify-between flex h-12 items-center align-middle px-4">
                  {data?.customer_email}
                  <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Verified
                  </span>
                </p>
              </div>
            </div>
            <div className="mb-5">
              <h5 className="font-medium mb-1">License Key</h5>
              <p className="text-gray-600 text-sm mb-3">
                Remember this license is only valid for one device
              </p>
              <div className="flex gap-3">
                <div className="shadow rounded w-full justify-between flex h-12 items-center align-middle px-4">
                  {data?.license_key}
                  <div className="flex gap-3">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {status}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h5 className="font-medium mb-3">APP ID</h5>
              <div className="flex gap-3">
                <p className="shadow rounded w-full flex h-12 items-center align-middle px-4">
                  {data?.app_id}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3">
              Tips: you can switch devices by logging out of your old device.
            </p>
            <button
              onClick={logout}
              role="button"
              className="bg-red-600 text-white px-3 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
