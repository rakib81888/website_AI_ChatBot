import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ClientTable from '../components/ClientTable';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

const Clients = () => {
  const { isAuthenticated } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate API call to fetch clients
    setTimeout(() => {
      const mockClients = Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        name: `Client ${i + 1}`,
        domain: `client${i + 1}.com`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        apiKey: `chatbot_${Math.random().toString(36).substr(2, 12)}`
      }));
      setClients(mockClients);
      setLoading(false);
    }, 800);
  }, []);

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         client.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Client Management</h1>
        <Link 
          to="/clients/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Client
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-500 font-bold text-xl">{clients.filter(c => c.status === 'active').length}</div>
            <div className="text-gray-600">Active Clients</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-yellow-500 font-bold text-xl">{clients.filter(c => c.status === 'pending').length}</div>
            <div className="text-gray-600">Pending Clients</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-500 font-bold text-xl">${(clients.length * 299).toLocaleString()}</div>
            <div className="text-gray-600">Monthly Revenue</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <SearchBar 
            placeholder="Search clients..." 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />
          
          <div className="flex gap-4">
            <div>
              <label className="mr-2 text-gray-600">Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <ClientTable clients={currentClients} />
            {filteredClients.length > 0 ? (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No clients found matching your criteria
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Clients;