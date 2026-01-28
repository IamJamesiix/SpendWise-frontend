import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Bot, 
  Receipt, 
  LogOut, 
  Sun, 
  Moon,
  PlusCircle,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { budgetService, taxService, chatService } from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [budget, setBudget] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetData, taxData] = await Promise.all([
        budgetService.getBudget().catch(() => null),
        taxService.getTaxes().catch(() => [])
      ]);
      
      setBudget(budgetData);
      setTaxes(taxData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalTaxes = taxes.reduce((sum, tax) => sum + (tax.amount || 0), 0);

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="nav-logo">💰</div>
          <h1>SpendWise</h1>
        </div>
        
        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="nav-user">
            <img 
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.fullName}&background=8B5CF6&color=fff`}
              alt={user?.fullName}
              className="user-avatar"
            />
            <span>{user?.fullName}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            icon={LogOut}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h2 className="page-title">Dashboard</h2>
            <p className="page-subtitle">Manage your finances efficiently</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading your financial data...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <Card 
                title="Current Budget" 
                icon={Wallet}
                gradient={true}
                className="stat-card"
              >
                <div className="stat-value">
                  {budget ? (
                    <>
                      <span className="currency">₦</span>
                      {budget.amount?.toLocaleString()}
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBudgetModal(true)}
                      icon={PlusCircle}
                    >
                      Set Budget
                    </Button>
                  )}
                </div>
                {budget && (
                  <p className="stat-label">Monthly Budget</p>
                )}
              </Card>

              <Card 
                title="Total Taxes" 
                icon={Receipt}
                hover={true}
                onClick={() => setShowTaxModal(true)}
              >
                <div className="stat-value">
                  <span className="currency">₦</span>
                  {totalTaxes.toLocaleString()}
                </div>
                <p className="stat-label">{taxes.length} tax record{taxes.length !== 1 ? 's' : ''}</p>
              </Card>

              <Card 
                title="AI Assistant" 
                icon={Bot}
                hover={true}
                onClick={() => setShowAIChat(true)}
              >
                <p className="feature-description">
                  Get personalized financial advice and insights powered by AI
                </p>
                <Button variant="secondary" fullWidth>
                  Chat with AI
                </Button>
              </Card>
            </div>

            <div className="dashboard-sections">
              <BudgetSection 
                budget={budget} 
                onUpdate={fetchData}
                onShowModal={() => setShowBudgetModal(true)}
              />
              
              <TaxSection 
                taxes={taxes} 
                onUpdate={fetchData}
                onShowModal={() => setShowTaxModal(true)}
              />
            </div>
          </>
        )}
      </div>

      {showBudgetModal && (
        <BudgetModal 
          budget={budget}
          onClose={() => setShowBudgetModal(false)}
          onSuccess={fetchData}
        />
      )}

      {showTaxModal && (
        <TaxModal 
          onClose={() => setShowTaxModal(false)}
          onSuccess={fetchData}
        />
      )}

      {showAIChat && (
        <AIChat onClose={() => setShowAIChat(false)} />
      )}
    </div>
  );
};

const BudgetSection = ({ budget, onUpdate, onShowModal }) => {
  return (
    <Card title="Budget Overview" icon={TrendingUp}>
      {budget ? (
        <div className="budget-details">
          <div className="budget-item">
            <span className="label">Amount:</span>
            <span className="value">₦{budget.amount?.toLocaleString()}</span>
          </div>
          <div className="budget-item">
            <span className="label">Currency:</span>
            <span className="value">{budget.currency}</span>
          </div>
          <Button variant="outline" onClick={onShowModal}>
            Update Budget
          </Button>
        </div>
      ) : (
        <div className="empty-state">
          <p>No budget set yet</p>
          <Button variant="primary" onClick={onShowModal}>
            Set Your Budget
          </Button>
        </div>
      )}
    </Card>
  );
};

const TaxSection = ({ taxes, onUpdate, onShowModal }) => {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tax record?')) return;
    
    try {
      await taxService.deleteTax(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting tax:', error);
      alert('Failed to delete tax record');
    }
  };

  return (
    <Card title="Tax Records" icon={Receipt}>
      {taxes.length > 0 ? (
        <div className="tax-list">
          {taxes.slice(0, 3).map(tax => (
            <div key={tax._id} className="tax-item">
              <div>
                <div className="tax-type">{tax.type}</div>
                <div className="tax-year">Year: {tax.year}</div>
              </div>
              <div className="tax-amount">₦{tax.amount?.toLocaleString()}</div>
            </div>
          ))}
          <Button variant="outline" onClick={onShowModal} fullWidth>
            Add Tax Record
          </Button>
        </div>
      ) : (
        <div className="empty-state">
          <p>No tax records yet</p>
          <Button variant="primary" onClick={onShowModal}>
            Add Tax Record
          </Button>
        </div>
      )}
    </Card>
  );
};

const BudgetModal = ({ budget, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(budget?.amount || '');
  const [currency, setCurrency] = useState(budget?.currency || 'NGN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await budgetService.setBudget(parseFloat(amount), currency);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Set Budget</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            label="Budget Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="50000"
            icon={DollarSign}
            required
          />
          
          <div className="modal-actions">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              Save Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaxModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await taxService.addTax({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to add tax record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Add Tax Record</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Tax Type"
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
            placeholder="Income Tax"
            required
          />
          
          <Input
            type="number"
            label="Amount"
            value={formData.amount}
            onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="12000"
            icon={DollarSign}
            required
          />
          
          <Input
            type="number"
            label="Year"
            value={formData.year}
            onChange={e => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            required
          />
          
          <div className="modal-actions">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              Add Tax
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AIChat = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(message);
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content chat-modal" onClick={e => e.stopPropagation()}>
        <div className="chat-header">
          <Bot size={24} />
          <h3>AI Finance Assistant</h3>
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <Bot size={48} />
              <p>Ask me anything about finance!</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-message assistant">
              <div className="message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSend} className="chat-input-form">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Ask me about taxes, budgeting, investments..."
            className="chat-input"
            disabled={loading}
          />
          <Button type="submit" variant="primary" disabled={loading || !message.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};