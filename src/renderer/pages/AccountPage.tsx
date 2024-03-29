import { useEffect, useState } from 'react';
const { ipcRenderer } = window.electron;

export default function AccountPage() {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    ipcRenderer.sendMessage('get-data-user');
    ipcRenderer.on('get-data-user', (args: any) => {
      setData(JSON.parse(args));
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto w-full">
      <div className="bg-white p-6 rounded mb-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          Account Settings
        </h1>
      </div>

      <div className="bg-white p-6 rounded">
        <div className="mb-8">
          <h5 className="font-medium mb-3">Username</h5>
          <p className="shadow rounded w-full flex h-12 items-center align-middle px-4">
            {data && data.customer_email}
          </p>
        </div>
        <div className="mb-6">
          <h5 className="font-medium mb-1">Contact Email</h5>
          <p className="text-gray-600 text-sm mb-3">
            Manage your accounts email address for the invoices
          </p>
          <div className="flex gap-3">
            <p className="shadow rounded w-full justify-between flex h-12 items-center align-middle px-4">
              {data && data.customer_email}
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
            <p className="shadow rounded w-full justify-between flex h-12 items-center align-middle px-4">
              {data && data.license_key}
              <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Verified
              </span>
            </p>
          </div>
        </div>
        <div className="mb-6">
          <h5 className="font-medium mb-3">APP ID</h5>
          <div className="flex gap-3">
            <p className="shadow rounded w-full flex h-12 items-center align-middle px-4">
              {data && data.app_id}
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3">
          Tips: you can switch devices by logging out of your old device.
        </p>
        <button
          role="button"
          className="bg-red-600 text-white px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
