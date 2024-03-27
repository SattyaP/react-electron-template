import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const Layout = ({ children }) => {
return (
<div className="min-h-screen w-full">
    <Navbar />
    <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />
        <div id="main-content" className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
            <main>
                <div className="pt-6 px-4">
                    <div className="w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                        {children}
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    </div>
</div>
);
};

export default Layout;