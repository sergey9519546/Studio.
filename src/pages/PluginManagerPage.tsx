/**
 * PluginManagerPage - Plugin management page component
 * Main page for plugin management and marketplace
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PluginManagerUI } from '../components/plugins/PluginManagerUI';

const PluginManagerPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="h-screen bg-app">
      <PluginManagerUI onClose={handleClose} />
    </div>
  );
};

export default PluginManagerPage;
