import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    return (
        <main className="min-h-screen transition-colors">
            <Nav />
            <div className="">
                <Sidebar />
            </div>
        </main>
    );
};

export default Dashboard;
