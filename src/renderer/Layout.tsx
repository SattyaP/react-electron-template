const { ipcRenderer } = window.electron;
import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Loading from './components/Loading';
import ApiModels from './utils/ApiModels';
import { Toast } from './utils/Toast';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string>('');

  useEffect(() => {
    ipcRenderer.sendMessage('re-session');
    ipcRenderer.on('re-session', (args: any) => {
      const data = JSON.parse(args);
      requestValidLicense(data.license_key);
    });

    const interval = setInterval(() => {
      ipcRenderer.sendMessage('re-session');
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const requestValidLicense = async (licenseKey: string) => {
    try {
      const request = (await ApiModels.validation(licenseKey)) as {
        success: boolean;
        message: string;
        data: any;
      };
      
      if (!request.success) {
        setError(request.message);
        setIsLoading(false);

        let timerInterval : NodeJS.Timeout;
        Toast.fire({
          icon: 'error',
          html: `${request.message} will close in <b>10</b> milliseconds.`,
          title: 'Oops...',
          text: request.message,
          timer: 10000,
          timerProgressBar: true,
          didOpen: () => {
            Toast.showLoading();
            const timer = Toast.getPopup()?.querySelector('b');
            timerInterval = setInterval(() => {
              if (timer) {
                timer.textContent = `${Toast.getTimerLeft()}`;
              }
            }, 1000);
          },
          willClose: () => {
            clearInterval(timerInterval);
            ipcRenderer.sendMessage('logout');
          },
        });
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: 'error',
        title: 'Ops...',
        text: 'An error occurred while validating the license key',
        allowOutsideClick: false,
        confirmButtonText: "Try Again",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          ipcRenderer.sendMessage('re-session')
          setIsLoading(true)
        },
      });
    }
  };

  return (
    <div className="min-h-screen w-full">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <div className="flex overflow-hidden bg-white pt-16">
            <Sidebar />
            <div
              id="main-content"
              className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
            >
              <main>
                <div className="pt-6 px-4">
                  <div className="w-full grid grid-cols-1 gap-4">
                    {children}
                  </div>
                </div>
              </main>
              <Footer />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
