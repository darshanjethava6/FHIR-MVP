import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Authorizations from './pages/Authorizations';
import Providers from './pages/Providers';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/authorizations" element={<Authorizations />} />
          <Route path="/providers" element={<Providers />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
