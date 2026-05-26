import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Projects from "./pages/Projects";
import MyProjects from "./pages/MyProjects";
import Preview from "./pages/Preview";
import Community from "./pages/Community";
import View from "./pages/View";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import AuthPage from "./pages/auth/AuthPage";
import Settings from "./pages/Settings";
import Loading from "./pages/Loading";

const App = () => {
  const { pathname } = useLocation();

  const hideNavbar =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/");

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ── Deep-space background layers ── */}
      <div className="fixed inset-0 -z-10 bg-[#040d1a]" />

      {/* Radial nebula glows */}
      <div
        className="fixed -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          inset: 0,
          background: `
            radial-gradient(ellipse 900px 600px at 50% -60px, rgba(37,99,235,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 600px 500px at 0% 80%,   rgba(99,102,241,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 100% 60%, rgba(14,165,233,0.07) 0%, transparent 70%)
          `,
        }}
      />

      {/* Dot-grid texture */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none dot-grid opacity-100"
        aria-hidden="true"
      />

      {/* Subtle vignette */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 50%, rgba(4,13,26,0.6) 100%)",
        }}
      />

      <Toaster />
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/preview/:projectId/:versionId" element={<Preview />} />
        <Route path="/community" element={<Community />} />
        <Route path="/view/:projectId" element={<View />} />
        <Route path="/auth/:pathname" element={<AuthPage />} />
        <Route path="/account/settings" element={<Settings />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </div>
  );
};

export default App;
