import React, { useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

// Komponenten importieren
import Messages from '../Messages/Messages';
import { CreateProduct } from '../Products/CreateProduct';
import Settings from '../Settings/Settings';

// Icons importieren
import dashboardIcon from '../../assets/image copy.png';
import paymentsIcon from '../../assets/image copy 6.png';
import productsIcon from '../../assets/image copy 4.png';
import ordersIcon from '../../assets/image copy 8.png';
import couponIcon from '../../assets/image copy 7.png';
import personIcon from '../../assets/image copy 8.png';
import createProductIcon from '../../assets/image copy 5.png';
import messagesIcon from '../../assets/image copy 2.png';
import settingsIcon from '../../assets/image.png';

const Dashboard: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo" style={{ color: 'red' }}>Realtecc</div>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarExpanded ? '←' : '→'}
          </button>
        </div>

        <nav className="nav-menu">
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Dashboard' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Dashboard');
                }}
              >
                <span className="nav-icon">
                  <img src={dashboardIcon} alt="Dashboard" className="icon-image" />
                </span>
                <span className="nav-text">Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Create Product' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Create Product');
                }}
              >
                <span className="nav-icon">
                  <img src={createProductIcon} alt="Create Product" className="icon-image" />
                </span>
                <span className="nav-text">Create Product</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Orders' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Orders');
                }}
              >
                <span className="nav-icon">
                  <img src={ordersIcon} alt="Orders" className="icon-image" />
                </span>
                <span className="nav-text">Orders</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Coupons' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Coupons');
                }}
              >
                <span className="nav-icon">
                  <img src={couponIcon} alt="Coupons" className="icon-image" />
                </span>
                <span className="nav-text">Coupons</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Products' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Products');
                }}
              >
                <span className="nav-icon">
                  <img src={productsIcon} alt="Products" className="icon-image" />
                </span>
                <span className="nav-text">Products</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Payments' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Payments');
                }}
              >
                <span className="nav-icon">
                  <img src={paymentsIcon} alt="Payments" className="icon-image" />
                </span>
                <span className="nav-text">Payments</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Messages' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Messages');
                }}
              >
                <span className="nav-icon">
                  <img src={messagesIcon} alt="Messages" className="icon-image" />
                </span>
                <span className="nav-text">Messages</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Settings' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Settings');
                }}
              >
                <span className="nav-icon">
                  <img src={settingsIcon} alt="Settings" className="icon-image" />
                </span>
                <span className="nav-text">Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <img src={personIcon} alt="User" className="avatar-image" />
            </div>
            <div className="user-details">
              <div className="user-name"></div>
              <div className="user-role">Verkäufer</div>
            </div>
          </div>
          <button className="logout-btn"></button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">{activePage}</h1>
          <div className="header-actions">
            <button className="notification-btn"></button>
            <button className="profile-btn"></button>
          </div>
        </header>

        <main className="content">
          {/* Dashboard Content */}
          {activePage === 'Dashboard' && (
            <>
              <div className="dashboard-cards">
                <div className="card">
                  <div className="card-icon"></div>
                  <div className="card-title">Gesamtumsatz</div>
                  <div className="card-value"></div>
                  <div className="card-change"></div>
                </div>
                <div className="card">
                  <div className="card-icon"></div>
                  <div className="card-title">Produkte</div>
                  <div className="card-value"></div>
                  <div className="card-change"></div>
                </div>
                <div className="card">
                  <div className="card-icon"></div>
                  <div className="card-title">Bestellungen</div>
                  <div className="card-value"></div>
                  <div className="card-change"></div>
                </div>
                <div className="card">
                  <div className="card-icon"></div>
                  <div className="card-title">Kunden</div>
                  <div className="card-value"></div>
                  <div className="card-change"></div>
                </div>
              </div>

              <div className="chart-container">
                <div className="chart-header">
                  <h2 className="chart-title">Umsatzübersicht</h2>
                  <div className="chart-actions">
                    <button className="chart-btn">Woche</button>
                    <button className="chart-btn active">Monat</button>
                    <button className="chart-btn">Jahr</button>
                  </div>
                </div>
                <div className="chart">
                  {/* Hier wird später die Chart-Komponente eingefügt */}
                  <div style={{ height: '300px', background: 'rgba(42, 125, 79, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Chart-Visualisierung
                  </div>
                </div>
              </div>

              <div className="table-container">
                <div className="table-header">
                  <h2 className="table-title">Letzte Bestellungen</h2>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bestell-ID</th>
                      <th>Kunde</th>
                      <th>Datum</th>
                      <th>Betrag</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Hier werden später die Echtzeitdaten eingefügt */}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Messages Content */}
          {activePage === 'Messages' && <Messages />}

          {/* Create Product Content */}
          {activePage === 'Create Product' && <CreateProduct />}

          {/* Settings Content */}
          {activePage === 'Settings' && <Settings />}

          {/* Produkte-Seite */}
          {activePage === 'Products' && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h2>Produkte</h2>
                <button 
                  className="create-button"
                  onClick={() => setActivePage('Create Product')}
                >
                  Neues Produkt erstellen
                </button>
              </div>
              
              {/* Produktliste hier */}
            </div>
          )}

          {/* Platzhalter für andere Seiten */}
          {activePage !== 'Dashboard' && 
           activePage !== 'Messages' && 
           activePage !== 'Products' && 
           activePage !== 'Create Product' && 
           activePage !== 'Settings' && (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <h2>Inhalt für {activePage}</h2>
              <p>Diese Seite ist noch in Entwicklung.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 