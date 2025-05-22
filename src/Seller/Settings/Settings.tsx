import React, { useState } from 'react';
import './Settings.css';

// Type definitions for settings
interface ProfileSettings {
  name: string;
  email: string;
  phone: string;
  password: string;
  language: 'en' | 'ru' | 'cn';
}

interface ShopSettings {
  shopName: string;
}

interface PaymentSettings {
  paymentMethods: {
    rub: boolean;
    yuan: boolean;
  };
  bankInfo: {
    accountNumber: string;
    bankName: string;
    swiftCode: string;
  };
  payoutOptions: {
    automatic: boolean;
    threshold: number;
  };
  taxInfo: {
    taxId: string;
    vatNumber: string;
  };
}

interface ShippingSettings {
  methods: {
    russia: boolean;
    china: boolean;
    international: boolean;
  };
  deliveryTimes: {
    russia: number;
    china: number;
    international: number;
  };
  packagingOptions: string[];
}

interface SecuritySettings {
  dataPrivacy: {
    shareData: boolean;
    newsletterConsent: boolean;
  };
}

interface MarketingSettings {
  advertising: {
    productBoost: boolean;
    budgetPerMonth: number;
  };
}

// Mock-Service for settings (will be replaced by backend API later)
const SettingsService = {
  // Get profile settings
  getProfileSettings: async (): Promise<ProfileSettings> => {
    // Implement API request here later
    return {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      password: '********',
      language: 'en',
    };
  },
  
  // Get shop settings
  getShopSettings: async (): Promise<ShopSettings> => {
    // Implement API request here later
    return {
      shopName: 'My Shop',
    };
  },
  
  // Get payment settings
  getPaymentSettings: async (): Promise<PaymentSettings> => {
    // Implement API request here later
    return {
      paymentMethods: {
        rub: true,
        yuan: false,
      },
      bankInfo: {
        accountNumber: 'US123456789',
        bankName: 'American Bank',
        swiftCode: 'AMERIC',
      },
      payoutOptions: {
        automatic: true,
        threshold: 100,
      },
      taxInfo: {
        taxId: 'US123456789',
        vatNumber: 'US987654321',
      },
    };
  },
  
  // Get shipping settings
  getShippingSettings: async (): Promise<ShippingSettings> => {
    // Implement API request here later
    return {
      methods: {
        russia: true,
        china: true,
        international: false,
      },
      deliveryTimes: {
        russia: 3,
        china: 5,
        international: 14,
      },
      packagingOptions: ['Standard', 'Premium'],
    };
  },
  
  // Get security settings
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    // Implement API request here later
    return {
      dataPrivacy: {
        shareData: true,
        newsletterConsent: true,
      },
    };
  },
  
  // Get marketing settings
  getMarketingSettings: async (): Promise<MarketingSettings> => {
    // Implement API request here later
    return {
      advertising: {
        productBoost: false,
        budgetPerMonth: 0,
      },
    };
  },
  
  // Save settings
  saveSettings: async (section: string, data: any): Promise<void> => {
    // Implement API request here later
    console.log(`Saving ${section} settings:`, data);
    // await fetch(`/api/settings/${section}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  }
};

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State variables for each settings category
  const [profileSettings, setProfileSettings] = useState<ProfileSettings | null>(null);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [marketingSettings, setMarketingSettings] = useState<MarketingSettings | null>(null);
  
  // Load settings on first render
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        const profile = await SettingsService.getProfileSettings();
        const shop = await SettingsService.getShopSettings();
        const payment = await SettingsService.getPaymentSettings();
        const shipping = await SettingsService.getShippingSettings();
        const security = await SettingsService.getSecuritySettings();
        const marketing = await SettingsService.getMarketingSettings();
        
        setProfileSettings(profile);
        setShopSettings(shop);
        setPaymentSettings(payment);
        setShippingSettings(shipping);
        setSecuritySettings(security);
        setMarketingSettings(marketing);
        
        setError(null);
      } catch (err) {
        setError('Error loading settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Save settings
  const saveSettings = async (section: string, data: any) => {
    try {
      setLoading(true);
      await SettingsService.saveSettings(section, data);
      
      // Update the corresponding state
      switch (section) {
        case 'profile':
          setProfileSettings(data);
          break;
        case 'shop':
          setShopSettings(data);
          break;
        case 'payment':
          setPaymentSettings(data);
          break;
        case 'shipping':
          setShippingSettings(data);
          break;
        case 'security':
          setSecuritySettings(data);
          break;
        case 'marketing':
          setMarketingSettings(data);
          break;
      }
      
      setError(null);
    } catch (err) {
      setError('Error saving settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileSettings) {
    return <div className="settings-loading">Loading settings...</div>;
  }
  
  if (error) {
    return <div className="settings-error">{error}</div>;
  }

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div className="settings-nav">
          <h2>Settings</h2>
          <ul className="settings-menu">
            <li 
              className={activeSection === 'profile' ? 'active' : ''}
              onClick={() => setActiveSection('profile')}
            >
              Profile & Account
            </li>
            <li 
              className={activeSection === 'shop' ? 'active' : ''}
              onClick={() => setActiveSection('shop')}
            >
              Shop Settings
            </li>
            <li 
              className={activeSection === 'payment' ? 'active' : ''}
              onClick={() => setActiveSection('payment')}
            >
              Payment Settings
            </li>
            <li 
              className={activeSection === 'shipping' ? 'active' : ''}
              onClick={() => setActiveSection('shipping')}
            >
              Shipping Settings
            </li>
            <li 
              className={activeSection === 'security' ? 'active' : ''}
              onClick={() => setActiveSection('security')}
            >
              Security & Privacy
            </li>
            <li 
              className={activeSection === 'marketing' ? 'active' : ''}
              onClick={() => setActiveSection('marketing')}
            >
              Marketing Settings
            </li>
          </ul>
        </div>
      </div>
      
      <div className="settings-content">
        {activeSection === 'profile' && profileSettings && (
          <div className="settings-section">
            <h3>Profile & Account</h3>
            
            <div className="settings-card">
              <h4>Personal/Business Information</h4>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={profileSettings.name}
                  onChange={(e) => setProfileSettings({...profileSettings, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={profileSettings.email}
                  onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  value={profileSettings.phone}
                  onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="settings-card">
              <h4>Change Password</h4>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" />
              </div>
            </div>
            
            <div className="settings-card">
              <h4>Language Settings</h4>
              <div className="form-group">
                <label>Language</label>
                <select 
                  value={profileSettings.language}
                  onChange={(e) => setProfileSettings({
                    ...profileSettings, 
                    language: e.target.value as 'en' | 'ru' | 'cn'
                  })}
                >
                  <option value="en">English</option>
                  <option value="ru">Russian</option>
                  <option value="cn">Chinese</option>
                </select>
              </div>
            </div>

            <div className="section-footer">
              <button 
                className="save-btn" 
                onClick={() => saveSettings('profile', profileSettings)}
              >
                Save All Changes
              </button>
            </div>
          </div>
        )}
        
        {activeSection === 'shop' && shopSettings && (
          <div className="settings-section">
            <h3>Shop Settings</h3>
            
            <div className="settings-card">
              <h4>Shop Name</h4>
              <div className="form-group">
                <label>Name (displayed as seller for products)</label>
                <input 
                  type="text" 
                  value={shopSettings.shopName}
                  onChange={(e) => setShopSettings({...shopSettings, shopName: e.target.value})}
                />
              </div>
            </div>

            <div className="section-footer">
              <button 
                className="save-btn"
                onClick={() => saveSettings('shop', shopSettings)}
              >
                Save All Changes
              </button>
            </div>
          </div>
        )}
        
        {activeSection === 'payment' && paymentSettings && (
          <div className="settings-section">
            <h3>Payment Settings</h3>
            
            <div className="settings-card">
              <h4>Manage Payment Methods</h4>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.rub}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings, 
                      paymentMethods: {
                        ...paymentSettings.paymentMethods,
                        rub: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>RUB (Russian Ruble)</label>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.yuan}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings, 
                      paymentMethods: {
                        ...paymentSettings.paymentMethods,
                        yuan: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>Yuan (Chinese Yuan)</label>
              </div>
            </div>
            
            <div className="settings-card">
              <h4>Bank Account/Payment Information</h4>
              <div className="form-group">
                <label>Account Number</label>
                <input 
                  type="text" 
                  value={paymentSettings.bankInfo.accountNumber}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    bankInfo: {
                      ...paymentSettings.bankInfo,
                      accountNumber: e.target.value
                    }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Bank Name</label>
                <input 
                  type="text" 
                  value={paymentSettings.bankInfo.bankName}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    bankInfo: {
                      ...paymentSettings.bankInfo,
                      bankName: e.target.value
                    }
                  })}
                />
              </div>
              <div className="form-group">
                <label>SWIFT/BIC</label>
                <input 
                  type="text" 
                  value={paymentSettings.bankInfo.swiftCode}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    bankInfo: {
                      ...paymentSettings.bankInfo,
                      swiftCode: e.target.value
                    }
                  })}
                />
              </div>
            </div>
            
            <div className="settings-card">
              <h4>Payout Options</h4>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.payoutOptions.automatic}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      payoutOptions: {
                        ...paymentSettings.payoutOptions,
                        automatic: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>Automatic Payout</label>
              </div>
              <div className="form-group">
                <label>Payout Threshold (in RUB)</label>
                <input 
                  type="number" 
                  value={paymentSettings.payoutOptions.threshold}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    payoutOptions: {
                      ...paymentSettings.payoutOptions,
                      threshold: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            </div>
            
            <div className="settings-card">
              <h4>Tax Information</h4>
              <div className="form-group">
                <label>Tax ID</label>
                <input 
                  type="text" 
                  value={paymentSettings.taxInfo.taxId}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    taxInfo: {
                      ...paymentSettings.taxInfo,
                      taxId: e.target.value
                    }
                  })}
                />
              </div>
              <div className="form-group">
                <label>VAT Number (if applicable)</label>
                <input 
                  type="text" 
                  value={paymentSettings.taxInfo.vatNumber}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    taxInfo: {
                      ...paymentSettings.taxInfo,
                      vatNumber: e.target.value
                    }
                  })}
                />
              </div>
            </div>

            <div className="section-footer">
              <button 
                className="save-btn"
                onClick={() => saveSettings('payment', paymentSettings)}
              >
                Save All Changes
              </button>
            </div>
          </div>
        )}
        
        {activeSection === 'shipping' && shippingSettings && (
          <div className="settings-section">
            <h3>Shipping Settings</h3>
            
            <div className="settings-card">
              <h4>Shipping Methods</h4>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={shippingSettings.methods.russia}
                    onChange={(e) => setShippingSettings({
                      ...shippingSettings,
                      methods: {
                        ...shippingSettings.methods,
                        russia: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>Ship to Russia</label>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={shippingSettings.methods.china}
                    onChange={(e) => setShippingSettings({
                      ...shippingSettings,
                      methods: {
                        ...shippingSettings.methods,
                        china: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>Ship to China</label>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={shippingSettings.methods.international}
                    onChange={(e) => setShippingSettings({
                      ...shippingSettings,
                      methods: {
                        ...shippingSettings.methods,
                        international: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>International Shipping</label>
              </div>
            </div>
            
            <div className="settings-card">
              <h4>Delivery Times</h4>
              <div className="form-group">
                <label>Delivery Time Russia (days)</label>
                <input 
                  type="number" 
                  value={shippingSettings.deliveryTimes.russia}
                  onChange={(e) => setShippingSettings({
                    ...shippingSettings,
                    deliveryTimes: {
                      ...shippingSettings.deliveryTimes,
                      russia: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Delivery Time China (days)</label>
                <input 
                  type="number" 
                  value={shippingSettings.deliveryTimes.china}
                  onChange={(e) => setShippingSettings({
                    ...shippingSettings,
                    deliveryTimes: {
                      ...shippingSettings.deliveryTimes,
                      china: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Delivery Time International (days)</label>
                <input 
                  type="number" 
                  value={shippingSettings.deliveryTimes.international}
                  onChange={(e) => setShippingSettings({
                    ...shippingSettings,
                    deliveryTimes: {
                      ...shippingSettings.deliveryTimes,
                      international: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            </div>
            
            <div className="settings-card">
              <h4>Packaging Options</h4>
              {shippingSettings.packagingOptions.map((option, index) => (
                <div className="form-group" key={index}>
                  <label>Option {index + 1}</label>
                  <input 
                    type="text" 
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...shippingSettings.packagingOptions];
                      newOptions[index] = e.target.value;
                      setShippingSettings({
                        ...shippingSettings,
                        packagingOptions: newOptions
                      });
                    }}
                  />
                </div>
              ))}
              <button 
                className="add-btn"
                onClick={() => setShippingSettings({
                  ...shippingSettings,
                  packagingOptions: [...shippingSettings.packagingOptions, '']
                })}
              >
                Add Option
              </button>
            </div>

            <div className="section-footer">
              <button className="save-btn" onClick={() => saveSettings('shipping', shippingSettings)}>
                Save All Changes
              </button>
            </div>
          </div>
        )}
        
        {activeSection === 'security' && securitySettings && (
          <div className="settings-section">
            <h3>Security & Privacy</h3>
            
            <div className="settings-card">
              <h4>Privacy Settings</h4>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.dataPrivacy.shareData}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      dataPrivacy: {
                        ...securitySettings.dataPrivacy,
                        shareData: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>Share anonymized data for improvements</label>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.dataPrivacy.newsletterConsent}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      dataPrivacy: {
                        ...securitySettings.dataPrivacy,
                        newsletterConsent: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>Receive newsletters and product updates</label>
              </div>
            </div>

            <div className="section-footer">
              <button 
                className="save-btn"
                onClick={() => saveSettings('security', securitySettings)}
              >
                Save All Changes
              </button>
            </div>
          </div>
        )}
        
        {activeSection === 'marketing' && marketingSettings && (
          <div className="settings-section">
            <h3>Marketing Settings</h3>
            
            <div className="settings-card">
              <h4>Advertising (for Product Boost)</h4>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={marketingSettings.advertising.productBoost}
                    onChange={(e) => setMarketingSettings({
                      ...marketingSettings,
                      advertising: {
                        ...marketingSettings.advertising,
                        productBoost: e.target.checked
                      }
                    })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label>Enable Product Boost</label>
              </div>
              <div className="form-group">
                <label>Monthly Budget (in RUB)</label>
                <input 
                  type="number" 
                  value={marketingSettings.advertising.budgetPerMonth}
                  onChange={(e) => setMarketingSettings({
                    ...marketingSettings,
                    advertising: {
                      ...marketingSettings.advertising,
                      budgetPerMonth: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            </div>

            <div className="section-footer">
              <button 
                className="save-btn"
                onClick={() => saveSettings('marketing', marketingSettings)}
              >
                Save All Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
