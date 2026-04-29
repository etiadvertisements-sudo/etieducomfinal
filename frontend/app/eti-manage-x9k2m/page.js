'use client';

import { useState, useEffect } from 'react';
import { 
  Lock, LogIn, LogOut, LayoutDashboard, Users, FileText, Calendar,
  MessageSquare, Gift, GraduationCap, Plus, Trash2, Edit, Eye, Save, X, 
  Star, Building2, Award, Phone, Mail, CheckCircle, Clock, TrendingUp, 
  Handshake, Search, Download, RefreshCw, ExternalLink, Shield, AlertTriangle,
  Smartphone, Key, Video, Upload, Image as ImageIcon
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Image Upload Component
const ImageUploadField = ({ value, onChange, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');

  useEffect(() => { setPreview(value || ''); }, [value]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB.'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await adminFetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        const fullUrl = data.storage === 'cloudinary' ? data.url : `${API_URL}${data.url}`;
        onChange(fullUrl);
        setPreview(fullUrl);
        toast.success('Image uploaded!');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Upload failed');
      }
    } catch (err) { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <div className="flex gap-2">
            <input type="url" placeholder="Image URL or upload" value={value || ''} onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }} className="form-input flex-1" />
            <label className={`btn-primary text-sm cursor-pointer whitespace-nowrap ${uploading ? 'opacity-50' : ''}`}>
              <Upload className="w-4 h-4" /> {uploading ? '...' : 'Upload'}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
        {preview && <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" onError={() => setPreview('')} />}
      </div>
    </div>
  );
};
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Authenticated fetch helper - adds JWT token to all admin API calls
const adminFetch = (url, options = {}) => {
  const token = sessionStorage.getItem('admin_token');
  const headers = { ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Don't set Content-Type for FormData (file uploads)
  if (!(options.body instanceof FormData) && !headers['Content-Type'] && options.method && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  return fetch(url, { ...options, headers });
};

// Security utilities
const generateDeviceId = () => {
  const nav = window.navigator;
  const screen = window.screen;
  const data = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset()
  ].join('|');
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'DEV_' + Math.abs(hash).toString(36).toUpperCase();
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Components
const Spinner = () => (
  <div className="flex justify-center py-8">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl ${sizeClasses[size]} w-full p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${variants[variant]}`}>{children}</span>;
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('600', '100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

// HTML Editor for Blogs
const HTMLEditor = ({ value, onChange, placeholder }) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertTemplate = (template) => {
    const templates = {
      heading: '<h2 class="text-2xl font-bold mb-4">Your Heading</h2>\n',
      paragraph: '<p class="mb-4">Your paragraph text here...</p>\n',
      list: '<ul class="list-disc pl-6 mb-4">\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n',
      quote: '<blockquote class="border-l-4 border-primary pl-4 italic my-4">Quote here...</blockquote>\n',
      image: '<img src="IMAGE_URL" alt="Description" class="rounded-lg my-4 max-w-full" />\n',
    };
    onChange(value + templates[template]);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <button type="button" onClick={() => insertTemplate('heading')} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">H2</button>
        <button type="button" onClick={() => insertTemplate('paragraph')} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">P</button>
        <button type="button" onClick={() => insertTemplate('list')} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">List</button>
        <button type="button" onClick={() => insertTemplate('quote')} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Quote</button>
        <button type="button" onClick={() => insertTemplate('image')} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Image</button>
        <div className="flex-1"></div>
        <button type="button" onClick={() => setShowPreview(!showPreview)} 
          className={`px-3 py-1 rounded text-xs font-medium ${showPreview ? 'bg-primary text-white' : 'bg-gray-200'}`}>
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      {showPreview ? (
        <div className="p-4 min-h-[200px] prose max-w-none" dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400">No content...</p>' }} />
      ) : (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full p-4 min-h-[200px] font-mono text-sm focus:outline-none resize-y" />
      )}
    </div>
  );
};

// Dashboard Tab
function DashboardTab() {
  const [stats, setStats] = useState({ counsellingLeads: 0, summerLeads: 0, industrialLeads: 0, educonnectLeads: 0, referrals: 0, blogs: 0, reviews: 0, events: 0, quickEnquiries: 0, contactLeads: 0 });
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = ['counselling-leads', 'summer-training-leads', 'industrial-training-leads', 'educonnect/enquiries', 'referrals', 'blogs', 'reviews', 'events', 'quick-enquiry', 'contact'];
        const results = await Promise.all(endpoints.map(ep => fetch(`${API_URL}/api/${ep}`).then(r => r.json()).catch(() => [])));
        
        const allLeads = [
          ...results[0].map(l => ({ ...l, source: 'Counselling' })),
          ...results[1].map(l => ({ ...l, source: 'Summer' })),
          ...results[2].map(l => ({ ...l, source: 'Industrial' })),
          ...results[3].map(l => ({ ...l, source: 'EduConnect' })),
          ...results[8].map(l => ({ ...l, source: 'Quick Enquiry' })),
          ...results[9].map(l => ({ ...l, source: 'Contact' }))
        ].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 10);
        
        setRecentLeads(allLeads);
        setStats({
          counsellingLeads: results[0]?.length || 0, summerLeads: results[1]?.length || 0,
          industrialLeads: results[2]?.length || 0, educonnectLeads: results[3]?.length || 0,
          referrals: results[4]?.length || 0, blogs: results[5]?.length || 0,
          reviews: results[6]?.length || 0, events: results[7]?.length || 0,
          quickEnquiries: results[8]?.length || 0, contactLeads: results[9]?.length || 0
        });
      } catch (error) { console.error('Failed to fetch stats'); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  const totalLeads = stats.counsellingLeads + stats.summerLeads + stats.industrialLeads + stats.educonnectLeads + stats.quickEnquiries + stats.contactLeads;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={totalLeads} icon={Users} color="text-blue-600" />
        <StatCard label="EduConnect" value={stats.educonnectLeads} icon={GraduationCap} color="text-purple-600" />
        <StatCard label="Referrals" value={stats.referrals} icon={Gift} color="text-pink-600" />
        <StatCard label="Blogs" value={stats.blogs} icon={FileText} color="text-teal-600" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <div className="space-y-3">
            {[
              { label: 'Free Counselling', value: stats.counsellingLeads, color: 'bg-blue-500' },
              { label: 'Summer Training', value: stats.summerLeads, color: 'bg-green-500' },
              { label: 'Industrial Training', value: stats.industrialLeads, color: 'bg-purple-500' },
              { label: 'EduConnect', value: stats.educonnectLeads, color: 'bg-orange-500' },
              { label: 'Quick Enquiry', value: stats.quickEnquiries, color: 'bg-teal-500' },
              { label: 'Contact Form', value: stats.contactLeads, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="flex-1 text-sm text-gray-600">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Leads</h3>
          {recentLeads.length === 0 ? <p className="text-gray-500 text-sm">No recent leads</p> : (
            <div className="space-y-3">
              {recentLeads.map((lead, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.phone}</p>
                  </div>
                  <Badge variant="primary">{lead.source}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// All Leads Tab
function AllLeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllLeads = async () => {
    setLoading(true);
    try {
      const [counselling, summer, industrial, contact, service, quickEnquiry] = await Promise.all([
        fetch(`${API_URL}/api/counselling-leads`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/api/summer-training-leads`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/api/industrial-training-leads`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/api/contact`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/api/service-enquiry`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/api/quick-enquiry`).then(r => r.json()).catch(() => [])
      ]);
      
      const allLeads = [
        ...(Array.isArray(counselling) ? counselling : []).map(l => ({ ...l, source: 'Free Counselling', sourceColor: 'info', deleteEndpoint: 'counselling-leads' })),
        ...(Array.isArray(summer) ? summer : []).map(l => ({ ...l, source: 'Summer Training', sourceColor: 'success', deleteEndpoint: 'summer-training-leads' })),
        ...(Array.isArray(industrial) ? industrial : []).map(l => ({ ...l, source: 'Industrial Training', sourceColor: 'primary', deleteEndpoint: 'industrial-training-leads' })),
        ...(Array.isArray(contact) ? contact : []).map(l => ({ ...l, source: 'Contact Form', sourceColor: 'default', deleteEndpoint: 'contact' })),
        ...(Array.isArray(service) ? service : []).map(l => ({ ...l, name: l.contact_person || l.name, source: 'Service Enquiry', sourceColor: 'warning', deleteEndpoint: 'service-enquiry' })),
        ...(Array.isArray(quickEnquiry) ? quickEnquiry : []).map(l => ({ ...l, source: 'Quick Enquiry', sourceColor: 'info', deleteEndpoint: 'quick-enquiry' }))
      ].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      
      setLeads(allLeads);
    } catch (error) { toast.error('Failed to load leads'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAllLeads();
  }, []);

  const handleDeleteLead = async (lead) => {
    if (!confirm(`Are you sure you want to delete this ${lead.source} lead?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/${lead.deleteEndpoint}/${lead.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Lead deleted successfully');
        fetchAllLeads();
      } else {
        toast.error('Failed to delete lead');
      }
    } catch (error) {
      toast.error('Error deleting lead');
    }
  };

  if (loading) return <Spinner />;

  const filteredLeads = leads.filter(l => filter === 'all' || l.source === filter)
    .filter(l => !searchQuery || l.name?.toLowerCase().includes(searchQuery.toLowerCase()) || l.phone?.includes(searchQuery));

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Interest', 'Source', 'Date'];
    const rows = filteredLeads.map(l => [l.name || '', l.phone || '', l.email || '', l.preferred_track || l.program_interest || '', l.source, l.created_at ? new Date(l.created_at).toLocaleDateString() : '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">All Leads ({filteredLeads.length})</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-40" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-input w-auto text-sm">
            <option value="all">All Sources</option>
            <option value="Free Counselling">Free Counselling</option>
            <option value="Summer Training">Summer Training</option>
            <option value="Industrial Training">Industrial Training</option>
          </select>
          <button onClick={exportCSV} className="btn-secondary text-sm"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>
      
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl"><Users className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No leads found</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Interest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.slice(0, 50).map((lead, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{lead.name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{lead.phone || 'N/A'}</div>
                      {lead.email && <div className="text-sm text-gray-500">{lead.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.preferred_track || lead.program_interest || '-'}</td>
                    <td className="px-4 py-3"><Badge variant={lead.sourceColor}>{lead.source}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleDeleteLead(lead)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// EduConnect Leads Tab
function EduConnectLeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/educonnect/enquiries`);
      if (res.ok) setLeads(await res.json());
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`${API_URL}/api/educonnect/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Lead deleted');
        fetchLeads();
      }
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">ETI EduConnect Leads ({leads.length})</h2>
      {leads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl"><GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No leads yet</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Program</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-4 py-3"><div>{lead.phone}</div><div className="text-sm text-gray-500">{lead.email}</div></td>
                  <td className="px-4 py-3"><Badge variant="primary">{lead.program_interest || '-'}</Badge></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Referrals Tab
function ReferralsTab() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/referrals`);
      if (res.ok) setReferrals(await res.json());
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminFetch(`${API_URL}/api/referrals/${id}?status=${status}`, { method: 'PUT' });
      toast.success('Status updated');
      setReferrals(referrals.map(r => r.id === id ? { ...r, status } : r));
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this referral?')) return;
    try {
      const res = await adminFetch(`${API_URL}/api/referrals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Referral deleted');
        fetchReferrals();
      }
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Referrals ({referrals.length})</h2>
      {referrals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl"><Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No referrals yet</p></div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Referrer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Friend</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="font-medium">{ref.referrer_name}</div><div className="text-sm text-gray-500">{ref.referrer_phone}</div></td>
                  <td className="px-4 py-3"><div>{ref.friend_name}</div><div className="text-sm text-gray-500">{ref.friend_phone}</div></td>
                  <td className="px-4 py-3"><Badge variant={ref.status === 'converted' ? 'success' : ref.status === 'contacted' ? 'warning' : 'default'}>{ref.status || 'pending'}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select value={ref.status || 'pending'} onChange={(e) => updateStatus(ref.id, e.target.value)} className="text-sm border rounded-lg px-2 py-1">
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                      <button onClick={() => handleDelete(ref.id)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// SEO Analyzer - calculates real-time SEO score
const analyzeSEO = (data) => {
  const checks = [];
  const kw = (data.focus_keyword || '').toLowerCase();
  const title = (data.title || '').toLowerCase();
  const excerpt = (data.excerpt || '').toLowerCase();
  const content = (data.content || '').toLowerCase();
  const metaTitle = data.meta_title || data.title || '';
  const metaDesc = data.meta_description || data.excerpt || '';
  const slug = data.slug || '';

  // Title checks
  checks.push({ label: 'Title length (50-60 chars)', pass: metaTitle.length >= 50 && metaTitle.length <= 65, weight: 8 });
  checks.push({ label: 'Focus keyword in title', pass: kw && title.includes(kw), weight: 10 });
  
  // Meta description
  checks.push({ label: 'Meta description (140-160 chars)', pass: metaDesc.length >= 140 && metaDesc.length <= 165, weight: 8 });
  checks.push({ label: 'Focus keyword in meta description', pass: kw && metaDesc.toLowerCase().includes(kw), weight: 7 });
  
  // Slug
  checks.push({ label: 'Focus keyword in URL slug', pass: kw && slug.includes(kw.replace(/\s+/g, '-')), weight: 6 });
  checks.push({ label: 'Short URL slug (< 75 chars)', pass: slug.length > 0 && slug.length < 75, weight: 4 });
  
  // Content
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  checks.push({ label: 'Content length (> 800 words)', pass: wordCount > 800, weight: 10 });
  checks.push({ label: 'Focus keyword in first 100 words', pass: kw && content.replace(/<[^>]*>/g, '').substring(0, 600).toLowerCase().includes(kw), weight: 7 });
  
  // Keyword density (1-3%)
  if (kw && wordCount > 0) {
    const kwCount = (content.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    const density = (kwCount / wordCount) * 100;
    checks.push({ label: `Keyword density 1-3% (now ${density.toFixed(1)}%)`, pass: density >= 1 && density <= 3, weight: 6 });
  } else {
    checks.push({ label: 'Keyword density 1-3%', pass: false, weight: 6 });
  }
  
  // Headings
  const hasH2 = /<h2/i.test(content);
  const hasH3 = /<h3/i.test(content);
  checks.push({ label: 'Has H2 heading(s)', pass: hasH2, weight: 6 });
  checks.push({ label: 'Has H3 subheading(s)', pass: hasH3, weight: 4 });
  checks.push({ label: 'Focus keyword in H2/H3', pass: kw && (new RegExp(`<h[23][^>]*>.*?${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?</h[23]>`, 'is')).test(content), weight: 5 });
  
  // Images
  checks.push({ label: 'Featured image set', pass: !!data.featured_image, weight: 5 });
  const imgAltMatch = content.match(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi) || [];
  const imgTotal = (content.match(/<img/gi) || []).length;
  checks.push({ label: 'Images have alt text', pass: imgTotal === 0 || imgAltMatch.length >= imgTotal, weight: 4 });
  
  // Links
  const internalLinks = (content.match(/href=["'][^"']*etieducom[^"']*["']/gi) || []).length + (content.match(/href=["']\/[^"']*["']/gi) || []).length;
  const externalLinks = (content.match(/href=["']https?:\/\/(?!.*etieducom)[^"']*["']/gi) || []).length;
  checks.push({ label: 'Has internal links (> 0)', pass: internalLinks > 0, weight: 5 });
  checks.push({ label: 'Has external links (> 0)', pass: externalLinks > 0, weight: 3 });
  
  // Excerpt
  checks.push({ label: 'Excerpt set', pass: (data.excerpt || '').length > 20, weight: 5 });
  checks.push({ label: 'Focus keyword in excerpt', pass: kw && excerpt.includes(kw), weight: 5 });
  
  // Tags & Category
  checks.push({ label: 'Tags added (3+)', pass: (typeof data.tags === 'string' ? data.tags.split(',').filter(Boolean) : data.tags || []).length >= 3, weight: 3 });
  checks.push({ label: 'Category selected', pass: !!data.category, weight: 3 });

  // FAQ Schema
  checks.push({ label: 'FAQ schema added', pass: (data.faq_items || []).length > 0, weight: 4 });

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earnedWeight = checks.filter(c => c.pass).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  return { checks, score, wordCount, internalLinks, externalLinks };
};

// Blogs Tab
function BlogsTab() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', category: '', featured_image: '',
    tags: '', read_time: 5, author: 'ETI Educom', meta_title: '', meta_description: '',
    focus_keyword: '', secondary_keywords: '', canonical_url: '', robots: 'index, follow',
    og_image: '', faq_items: []
  });
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  const fetchBlogs = async () => { const res = await fetch(`${API_URL}/api/blogs?published_only=false`); if (res.ok) setBlogs(await res.json()); setLoading(false); };
  useEffect(() => { fetchBlogs(); }, []);

  const generateSlug = (title) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');

  const addFaq = () => {
    if (faqQuestion && faqAnswer) {
      setFormData({ ...formData, faq_items: [...formData.faq_items, { question: faqQuestion, answer: faqAnswer }] });
      setFaqQuestion(''); setFaqAnswer('');
    }
  };
  const removeFaq = (idx) => setFormData({ ...formData, faq_items: formData.faq_items.filter((_, i) => i !== idx) });

  // Extract headings from content
  const extractHeadings = (html) => {
    const matches = html.match(/<h([2-6])[^>]*>(.*?)<\/h[2-6]>/gi) || [];
    return matches.map(m => {
      const level = m.match(/<h(\d)/)?.[1] || '2';
      const text = m.replace(/<[^>]*>/g, '').trim();
      return `H${level}: ${text}`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = formData.slug || generateSlug(formData.title);
    const tags = typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags;
    const secondaryKw = typeof formData.secondary_keywords === 'string' ? formData.secondary_keywords.split(',').map(t => t.trim()).filter(Boolean) : formData.secondary_keywords;
    const meta_title = formData.meta_title || `${formData.title} | ETI Educom Blog`;
    const meta_description = formData.meta_description || formData.excerpt;
    const content = formData.content;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const headings = extractHeadings(content);
    const seoResult = analyzeSEO({ ...formData, slug, meta_title, meta_description });
    const readTime = formData.read_time || Math.max(1, Math.ceil(wordCount / 200));

    const payload = {
      ...formData, slug, tags, meta_title, meta_description,
      secondary_keywords: secondaryKw,
      word_count: wordCount,
      heading_structure: headings,
      internal_links: [],
      external_links: [],
      seo_score: seoResult.score,
      read_time: readTime,
      og_image: formData.og_image || formData.featured_image,
      published_at: new Date().toISOString()
    };

    const res = await adminFetch(`${API_URL}/api/blogs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success(`Blog published! SEO Score: ${seoResult.score}/100`);
      setShowForm(false); fetchBlogs();
      setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', featured_image: '', tags: '', read_time: 5, author: 'ETI Educom', meta_title: '', meta_description: '', focus_keyword: '', secondary_keywords: '', canonical_url: '', robots: 'index, follow', og_image: '', faq_items: [] });
    } else {
      const err = await res.json().catch(() => null);
      toast.error(err?.detail?.[0]?.msg || err?.detail || 'Failed to publish');
    }
  };

  const handleDelete = async (id) => { if (confirm('Delete?')) { await adminFetch(`${API_URL}/api/blogs/${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchBlogs(); } };

  // Live SEO analysis
  const seoSlug = formData.slug || (formData.title ? generateSlug(formData.title) : '');
  const seoTitle = formData.meta_title || (formData.title ? `${formData.title} | ETI Educom Blog` : '');
  const seoDesc = formData.meta_description || formData.excerpt || '';
  const seo = analyzeSEO({ ...formData, slug: seoSlug, meta_title: seoTitle, meta_description: seoDesc });
  const scoreColor = seo.score >= 80 ? 'text-green-600' : seo.score >= 50 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = seo.score >= 80 ? 'bg-green-500' : seo.score >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Blogs ({blogs.length})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> New Blog</button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create SEO-Optimized Blog" size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              <input type="text" placeholder="Blog Title * (50-60 chars ideal)" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input text-lg font-semibold" required data-testid="blog-title-input" />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Slug:</span>
                <input type="text" placeholder="auto-generated-from-title" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="form-input text-sm flex-1 py-1" />
              </div>

              {/* Focus Keyword */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Focus Keyword *</label>
                  <input type="text" placeholder="e.g., IT skills after 12th" value={formData.focus_keyword} onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })} className="form-input text-sm" data-testid="blog-focus-kw" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Secondary Keywords (comma separated)</label>
                  <input type="text" placeholder="computer course, career, India" value={formData.secondary_keywords} onChange={(e) => setFormData({ ...formData, secondary_keywords: e.target.value })} className="form-input text-sm" />
                </div>
              </div>

              <textarea placeholder="Excerpt / Summary * (140-160 chars for meta description)" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="form-input min-h-[80px]" required data-testid="blog-excerpt-input" />
              <HTMLEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} placeholder="Blog content (HTML) — Use H2/H3 headings, add internal links to /programs, /contact etc." />

              {/* FAQ Schema Section */}
              <div className="bg-gray-50 rounded-xl p-4 border">
                <h4 className="text-sm font-bold text-gray-700 mb-2">FAQ Schema (for Google Rich Snippets)</h4>
                <div className="space-y-2">
                  {formData.faq_items.map((faq, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{faq.question}</p>
                        <p className="text-xs text-gray-500">{faq.answer}</p>
                      </div>
                      <button type="button" onClick={() => removeFaq(idx)} className="text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <input type="text" placeholder="Question" value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} className="form-input text-sm" />
                    <textarea placeholder="Answer" value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} className="form-input text-sm min-h-[50px]" />
                    <button type="button" onClick={addFaq} className="text-sm text-primary font-medium flex items-center gap-1"><Plus className="w-3 h-3" /> Add FAQ</button>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Sidebar */}
            <div className="space-y-4">
              {/* SEO Score */}
              <div className="bg-gray-50 rounded-xl p-4 border text-center">
                <h4 className="text-sm font-bold text-gray-700 mb-2">SEO Score</h4>
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${seo.score}, 100`} className={scoreColor} />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${scoreColor}`}>{seo.score}</span>
                </div>
                <p className="text-xs text-gray-500">{seo.score >= 80 ? 'Great SEO!' : seo.score >= 50 ? 'Needs improvement' : 'Poor - fix issues below'}</p>
                <p className="text-xs text-gray-400 mt-1">{seo.wordCount} words</p>
              </div>

              {/* Google Preview */}
              <div className="bg-gray-50 rounded-xl p-4 border">
                <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1"><Search className="w-3 h-3" /> Google Preview</h4>
                <div className="bg-white rounded-lg p-3 border space-y-1">
                  <p className="text-blue-700 text-sm font-medium truncate">{seoTitle || 'Blog Title | ETI Educom Blog'}</p>
                  <p className="text-green-700 text-[10px] truncate">etieducom.com/blogs/{seoSlug || 'url-slug'}</p>
                  <p className="text-gray-600 text-[11px] line-clamp-2">{seoDesc || 'Write a 140-160 character meta description...'}</p>
                </div>
                <div className="mt-1 text-[10px] text-gray-400 flex gap-2">
                  <span className={seoTitle.length > 0 ? (seoTitle.length >= 50 && seoTitle.length <= 65 ? 'text-green-600' : 'text-red-500') : ''}>Title: {seoTitle.length}/60</span>
                  <span className={seoDesc.length > 0 ? (seoDesc.length >= 140 && seoDesc.length <= 165 ? 'text-green-600' : 'text-red-500') : ''}>Desc: {seoDesc.length}/160</span>
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="bg-gray-50 rounded-xl p-4 border max-h-[280px] overflow-y-auto">
                <h4 className="text-xs font-bold text-gray-700 mb-2">SEO Checklist</h4>
                <div className="space-y-1">
                  {seo.checks.map((check, i) => (
                    <div key={i} className={`flex items-center gap-1.5 text-[11px] ${check.pass ? 'text-green-700' : 'text-red-600'}`}>
                      {check.pass ? <CheckCircle className="w-3 h-3 shrink-0" /> : <AlertTriangle className="w-3 h-3 shrink-0" />}
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Meta Title</label>
                  <input type="text" placeholder="Auto-filled from title" value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} className="form-input text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Meta Description</label>
                  <textarea placeholder="Auto-filled from excerpt" value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} className="form-input text-sm min-h-[50px]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Canonical URL</label>
                  <input type="url" placeholder="https://etieducom.com/blogs/..." value={formData.canonical_url} onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })} className="form-input text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Robots Directive</label>
                  <select value={formData.robots} onChange={(e) => setFormData({ ...formData, robots: e.target.value })} className="form-input text-sm">
                    <option value="index, follow">Index, Follow (default)</option>
                    <option value="noindex, follow">Noindex, Follow</option>
                    <option value="index, nofollow">Index, Nofollow</option>
                    <option value="noindex, nofollow">Noindex, Nofollow</option>
                  </select>
                </div>
              </div>

              {/* Category, Tags, Image */}
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-input" required>
                <option value="">Category *</option>
                <option value="Career Tips">Career Tips</option>
                <option value="Technology">Technology</option>
                <option value="Industry Insights">Industry Insights</option>
                <option value="Student Success">Student Success</option>
                <option value="Certification Guide">Certification Guide</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Web Development">Web Development</option>
              </select>
              <input type="text" placeholder="Tags (comma separated) — 3+ recommended" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="form-input" />
              <ImageUploadField value={formData.featured_image} onChange={(url) => setFormData({ ...formData, featured_image: url })} label="Featured Image" />
              <ImageUploadField value={formData.og_image} onChange={(url) => setFormData({ ...formData, og_image: url })} label="OG Image (1200x630 for social)" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full justify-center text-lg py-3"><Save className="w-5 h-5" /> Publish SEO-Optimized Blog (Score: {seo.score}/100)</button>
        </form>
      </Modal>

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl"><FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No blogs</p></div>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-xl border p-4 flex justify-between items-start">
              <div className="flex gap-4">
                {blog.featured_image && <img src={blog.featured_image} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                <div>
                  <h3 className="font-bold text-gray-900">{blog.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{blog.excerpt}</p>
                  <div className="flex gap-2 mt-2 flex-wrap items-center">
                    <Badge variant="primary">{blog.category}</Badge>
                    <span className="text-xs text-gray-500">{blog.read_time} min</span>
                    {blog.seo_score > 0 && <span className={`text-xs font-bold ${blog.seo_score >= 80 ? 'text-green-600' : blog.seo_score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>SEO: {blog.seo_score}/100</span>}
                    {blog.focus_keyword && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{blog.focus_keyword}</span>}
                    <span className="text-xs text-gray-400">{blog.word_count || 0} words</span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(blog.id)} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reviews Tab
function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ student_name: '', course: '', review_text: '', photo_url: '', rating: 5 });

  const fetchReviews = async () => { const res = await fetch(`${API_URL}/api/reviews?active_only=false`); if (res.ok) setReviews(await res.json()); setLoading(false); };
  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await adminFetch(`${API_URL}/api/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { toast.success('Review added'); setShowForm(false); fetchReviews(); setFormData({ student_name: '', course: '', review_text: '', photo_url: '', rating: 5 }); }
    else toast.error('Failed to add review');
  };

  const handleDelete = async (id) => { if (confirm('Delete?')) { await adminFetch(`${API_URL}/api/reviews/${id}`, { method: 'DELETE' }); fetchReviews(); } };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Student Reviews ({reviews.length})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Student Review">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Student Name *" value={formData.student_name} onChange={(e) => setFormData({ ...formData, student_name: e.target.value })} className="form-input" required />
          <input type="text" placeholder="Course *" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="form-input" required />
          <textarea placeholder="Review Text * (min 10 chars)" value={formData.review_text} onChange={(e) => setFormData({ ...formData, review_text: e.target.value })} className="form-input min-h-[100px]" required />
          <ImageUploadField value={formData.photo_url} onChange={(url) => setFormData({ ...formData, photo_url: url })} label="Student Photo" />
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label><div className="flex gap-1">{[1,2,3,4,5].map(r => <button key={r} type="button" onClick={() => setFormData({ ...formData, rating: r })} className={formData.rating >= r ? 'text-yellow-500' : 'text-gray-300'}><Star className="w-6 h-6 fill-current" /></button>)}</div></div>
          <button type="submit" className="btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save Review</button>
        </form>
      </Modal>

      {reviews.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-xl"><Star className="w-12 h-12 text-gray-300 mx-auto" /></div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  {r.photo_url && <img src={r.photo_url} alt={r.student_name} className="w-12 h-12 rounded-full object-cover" />}
                  <div><h3 className="font-bold">{r.student_name}</h3><p className="text-sm text-gray-500">{r.course}</p></div>
                </div>
                <button onClick={() => handleDelete(r.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{r.review_text}</p>
              <div className="flex mt-2">{[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Events Tab
function EventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '', gallery_images: [] });
  const [newGalleryImage, setNewGalleryImage] = useState('');

  const fetchEvents = async () => { const res = await fetch(`${API_URL}/api/events?active_only=false`); if (res.ok) setEvents(await res.json()); setLoading(false); };
  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await adminFetch(`${API_URL}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { toast.success('Event added'); setShowForm(false); fetchEvents(); setFormData({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '', gallery_images: [] }); }
    else toast.error('Failed to add event');
  };

  const addGalleryImage = (url) => { if (url) { setFormData({ ...formData, gallery_images: [...formData.gallery_images, url] }); setNewGalleryImage(''); } };
  const removeGalleryImage = (idx) => { setFormData({ ...formData, gallery_images: formData.gallery_images.filter((_, i) => i !== idx) }); };

  const handleDelete = async (id) => { if (confirm('Delete?')) { await adminFetch(`${API_URL}/api/events/${id}`, { method: 'DELETE' }); fetchEvents(); } };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events ({events.length})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Event" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" required />
          <textarea placeholder="Description *" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-input min-h-[80px]" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} className="form-input" required />
            <input type="text" placeholder="Time" value={formData.event_time} onChange={(e) => setFormData({ ...formData, event_time: e.target.value })} className="form-input" />
          </div>
          <input type="text" placeholder="Location *" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="form-input" required />
          <ImageUploadField value={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} label="Event Cover Image" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
            <ImageUploadField value={newGalleryImage} onChange={(url) => { setNewGalleryImage(url); if (url) addGalleryImage(url); }} label="Add Gallery Photo" />
            {formData.gallery_images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.gallery_images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                    <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save Event</button>
        </form>
      </Modal>

      {events.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-xl"><Calendar className="w-12 h-12 text-gray-300 mx-auto" /></div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  {e.image_url && <img src={e.image_url} alt={e.title} className="w-16 h-16 object-cover rounded-lg" />}
                  <div><h3 className="font-bold">{e.title}</h3><div className="flex gap-3 text-sm text-gray-500"><span>{e.event_date}</span><span>{e.event_time}</span></div></div>
                </div>
                <button onClick={() => handleDelete(e.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{e.description}</p>
              {e.gallery_images?.length > 0 && <div className="flex gap-1 mt-2">{e.gallery_images.map((img, i) => <img key={i} src={img} alt="" className="w-10 h-10 object-cover rounded" />)}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Partners Tab
function PartnersTab() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', logo_url: '', partner_type: 'certification' });

  const fetchPartners = async () => { const res = await fetch(`${API_URL}/api/partners`); if (res.ok) setPartners(await res.json()); setLoading(false); };
  useEffect(() => { fetchPartners(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await adminFetch(`${API_URL}/api/partners`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { toast.success('Partner added'); setShowForm(false); fetchPartners(); setFormData({ name: '', logo_url: '', partner_type: 'certification' }); }
    else toast.error('Failed to add partner');
  };

  const handleDelete = async (id) => { if (confirm('Delete?')) { await adminFetch(`${API_URL}/api/partners/${id}`, { method: 'DELETE' }); fetchPartners(); } };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Partners ({partners.length})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Partner">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Partner Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" required />
          <ImageUploadField value={formData.logo_url} onChange={(url) => setFormData({ ...formData, logo_url: url })} label="Partner Logo" />
          <select value={formData.partner_type} onChange={(e) => setFormData({ ...formData, partner_type: e.target.value })} className="form-input">
            <option value="certification">Certification</option>
            <option value="placement">Placement</option>
          </select>
          <button type="submit" className="btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save Partner</button>
        </form>
      </Modal>

      {partners.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-xl"><Handshake className="w-12 h-12 text-gray-300 mx-auto" /></div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border p-4 text-center group relative">
              <button onClick={() => handleDelete(p.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              {p.logo_url && <img src={p.logo_url} alt={p.name} className="h-12 mx-auto object-contain" />}
              <p className="text-xs text-gray-600 mt-2">{p.name}</p>
              <Badge variant="primary">{p.partner_type}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Universities Tab
function UniversitiesTab() {
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', logo: '' });

  const fetchUnis = async () => { const res = await adminFetch(`${API_URL}/api/educonnect/universities`); if (res.ok) setUnis(await res.json()); setLoading(false); };
  useEffect(() => { fetchUnis(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await adminFetch(`${API_URL}/api/educonnect/universities?name=${encodeURIComponent(formData.name)}&logo=${encodeURIComponent(formData.logo)}&order=0`, { method: 'POST' });
    if (res.ok) { toast.success('University added'); setShowForm(false); fetchUnis(); setFormData({ name: '', logo: '' }); }
    else toast.error('Failed to add university');
  };

  const handleDelete = async (id) => { if (confirm('Delete?')) { await adminFetch(`${API_URL}/api/educonnect/universities/${id}`, { method: 'DELETE' }); fetchUnis(); } };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Universities ({unis.length})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add University">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="University Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" required />
          <ImageUploadField value={formData.logo} onChange={(url) => setFormData({ ...formData, logo: url })} label="University Logo" />
          <button type="submit" className="btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save University</button>
        </form>
      </Modal>

      {unis.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-xl"><Building2 className="w-12 h-12 text-gray-300 mx-auto" /></div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {unis.map((u) => (
            <div key={u.id} className="bg-white rounded-xl border p-4 text-center group relative">
              <button onClick={() => handleDelete(u.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              {u.logo && <img src={u.logo} alt={u.name} className="h-12 mx-auto object-contain" />}
              <p className="text-xs text-gray-600 mt-2">{u.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Security Tab
// MSG91 WhatsApp Settings Tab
function MSG91SettingsTab() {
  const [settings, setSettings] = useState({
    auth_key: '',
    is_enabled: false,
    integrated_number: '918728054145',
    template_name: 'webenq',
    template_namespace: '73fda5e9_77e9_445f_82ac_9c2e532b32f4'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminFetch(`${API_URL}/api/msg91-settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings({
            auth_key: data.auth_key || '',
            is_enabled: data.is_enabled || false,
            integrated_number: data.integrated_number || '918728054145',
            template_name: data.template_name || 'webenq',
            template_namespace: data.template_namespace || '73fda5e9_77e9_445f_82ac_9c2e532b32f4'
          });
        }
      } catch (error) {
        console.error('Failed to fetch MSG91 settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminFetch(`${API_URL}/api/msg91-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('MSG91 settings saved successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testPhone || testPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setTesting(true);
    try {
      const res = await adminFetch(`${API_URL}/api/msg91-settings/test?phone=${testPhone}&name=Test User`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Test WhatsApp sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send test message');
      }
    } catch (error) {
      toast.error('Failed to send test message');
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">MSG91 WhatsApp Settings</h2>
        <Badge variant={settings.is_enabled ? 'success' : 'danger'}>
          {settings.is_enabled ? 'Enabled' : 'Disabled'}
        </Badge>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800">WhatsApp Notifications</h3>
            <p className="text-sm text-blue-700 mt-1">
              When enabled, users will receive a WhatsApp message when they submit any form 
              (Free Counselling, Summer/Industrial Training, Contact, EduConnect, etc.)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-900">Enable WhatsApp Notifications</h3>
            <p className="text-sm text-gray-500">Toggle to enable/disable all WhatsApp messages</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, is_enabled: !settings.is_enabled })}
            className={`relative w-14 h-7 rounded-full transition-colors ${settings.is_enabled ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.is_enabled ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>

        <div>
          <label className="form-label">MSG91 Auth Key *</label>
          <input
            type="password"
            value={settings.auth_key}
            onChange={(e) => setSettings({ ...settings, auth_key: e.target.value })}
            placeholder="Enter your MSG91 auth key"
            className="form-input"
          />
          <p className="text-xs text-gray-500 mt-1">Get your auth key from MSG91 dashboard</p>
        </div>

        <div>
          <label className="form-label">Integrated Number</label>
          <input
            type="text"
            value={settings.integrated_number}
            onChange={(e) => setSettings({ ...settings, integrated_number: e.target.value })}
            placeholder="918728054145"
            className="form-input"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Template Name</label>
            <input
              type="text"
              value={settings.template_name}
              onChange={(e) => setSettings({ ...settings, template_name: e.target.value })}
              placeholder="webenq"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Template Namespace</label>
            <input
              type="text"
              value={settings.template_namespace}
              onChange={(e) => setSettings({ ...settings, template_namespace: e.target.value })}
              placeholder="73fda5e9_77e9_445f_82ac_9c2e532b32f4"
              className="form-input"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full justify-center"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Test Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Test WhatsApp Message</h3>
        <div className="flex gap-3">
          <input
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="Enter phone number (e.g., 9876543210)"
            className="form-input flex-1"
          />
          <button
            onClick={handleTest}
            disabled={testing || !settings.is_enabled}
            className="btn-secondary"
          >
            {testing ? 'Sending...' : 'Send Test'}
          </button>
        </div>
        {!settings.is_enabled && (
          <p className="text-sm text-yellow-600 mt-2">Enable WhatsApp notifications first to send test messages</p>
        )}
      </div>
    </div>
  );
}

// Cyber Warriors Tab - Assessments & Bookings
function CyberWarriorsTab() {
  const [assessments, setAssessments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [videoReviews, setVideoReviews] = useState([]);
  const [stats, setStats] = useState({ total_attempts: 0, passed: 0, failed: 0, pass_rate: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('assessments');
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideo, setNewVideo] = useState({ name: '', designation: '', location: '', video_url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assessRes, bookingsRes, statsRes, videosRes] = await Promise.all([
        fetch(`${API_URL}/api/cyber-warriors/assessments`),
        fetch(`${API_URL}/api/cyber-warriors/registrations`),
        fetch(`${API_URL}/api/cyber-warriors/assessments/stats`),
        fetch(`${API_URL}/api/cyber-warriors/video-reviews?active_only=false`)
      ]);
      
      if (assessRes.ok) setAssessments(await assessRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (videosRes.ok) setVideoReviews(await videosRes.json());
    } catch (error) {
      console.error('Error fetching cyber warriors data:', error);
    }
    setLoading(false);
  };

  const exportCSV = (data, filename) => {
    if (data.length === 0) return toast.error('No data to export');
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).map(v => `"${v || ''}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV exported successfully!');
  };

  const handleAddVideo = async () => {
    if (!newVideo.name || !newVideo.designation || !newVideo.video_url) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const res = await adminFetch(`${API_URL}/api/cyber-warriors/video-reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo)
      });
      if (res.ok) {
        toast.success('Video review added successfully!');
        setNewVideo({ name: '', designation: '', location: '', video_url: '' });
        setShowAddVideo(false);
        fetchData();
      } else {
        toast.error('Failed to add video review');
      }
    } catch (error) {
      toast.error('Error adding video review');
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!confirm('Are you sure you want to delete this video review?')) return;
    try {
      const res = await adminFetch(`${API_URL}/api/cyber-warriors/video-reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Video review deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Error deleting video review');
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (!confirm('Are you sure you want to delete this assessment record?')) return;
    try {
      const res = await adminFetch(`${API_URL}/api/cyber-warriors/assessments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Assessment deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Error deleting assessment');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await adminFetch(`${API_URL}/api/cyber-warriors/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Booking deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Error deleting booking');
    }
  };

  const handleToggleVideo = async (id) => {
    try {
      const res = await adminFetch(`${API_URL}/api/cyber-warriors/video-reviews/${id}/toggle`, { method: 'PUT' });
      if (res.ok) {
        toast.success('Video review status updated');
        fetchData();
      }
    } catch (error) {
      toast.error('Error updating video review');
    }
  };

  // Extract YouTube video ID for thumbnail
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Cyber Warriors
        </h2>
        <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Assessments" value={stats.total_attempts} icon={Users} color="text-blue-600" />
        <StatCard label="Passed" value={stats.passed} icon={CheckCircle} color="text-green-600" />
        <StatCard label="Failed" value={stats.failed} icon={AlertTriangle} color="text-red-600" />
        <StatCard label="Pass Rate" value={`${stats.pass_rate}%`} icon={TrendingUp} color="text-primary" />
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('assessments')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'assessments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Assessments ({assessments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Session Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('videos')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Video Reviews ({videoReviews.length})
        </button>
      </div>

      {/* Assessments Tab */}
      {activeSubTab === 'assessments' && (
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Assessment Results</h3>
            <button onClick={() => exportCSV(assessments, 'cyber_warriors_assessments')} className="btn-secondary text-sm">
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </button>
          </div>
          {assessments.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No assessments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assessments.map((a, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{a.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.college || '-'}</td>
                      <td className="px-4 py-3 text-sm font-medium">{a.score}/{a.total}</td>
                      <td className="px-4 py-3">
                        <Badge variant={a.passed ? 'success' : 'danger'}>
                          {a.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(a.completed_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleDeleteAssessment(a.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Session Booking Requests</h3>
            <button onClick={() => exportCSV(bookings, 'cyber_warriors_bookings')} className="btn-secondary text-sm">
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </button>
          </div>
          {bookings.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No session bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preferred Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map((b, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Badge variant={b.registration_type === 'institution' ? 'primary' : 'info'}>
                          {b.registration_type === 'institution' ? 'Institution' : 'Individual'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.organization_name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.contact_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.preferred_date || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={b.status === 'pending' ? 'warning' : b.status === 'confirmed' ? 'success' : 'default'}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(b.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleDeleteBooking(b.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Video Reviews Tab */}
      {activeSubTab === 'videos' && (
        <div className="space-y-4">
          {/* Add Video Form */}
          {showAddVideo ? (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Add Video Review (Reel Format)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newVideo.name}
                    onChange={(e) => setNewVideo({...newVideo, name: e.target.value})}
                    placeholder="Reviewer's Name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    value={newVideo.designation}
                    onChange={(e) => setNewVideo({...newVideo, designation: e.target.value})}
                    placeholder="e.g., Principal, Govt. School"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newVideo.location}
                    onChange={(e) => setNewVideo({...newVideo, location: e.target.value})}
                    placeholder="e.g., Pathankot, Punjab"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL *</label>
                  <input
                    type="url"
                    value={newVideo.video_url}
                    onChange={(e) => setNewVideo({...newVideo, video_url: e.target.value})}
                    placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: Upload vertical videos (9:16 ratio) to YouTube Shorts for best results
              </p>
              <div className="flex gap-2 mt-4">
                <button onClick={handleAddVideo} className="btn-primary">
                  <Plus className="w-4 h-4 mr-1" /> Add Video
                </button>
                <button onClick={() => setShowAddVideo(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddVideo(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-1" /> Add Video Review
            </button>
          )}

          {/* Video Reviews List */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Video Reviews ({videoReviews.length})</h3>
              <p className="text-sm text-gray-500">These video testimonials appear on the Cyber Warriors page in reel format</p>
            </div>
            {videoReviews.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">No video reviews yet. Add your first video testimonial!</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {videoReviews.map((video) => {
                  const videoId = getYouTubeId(video.video_url);
                  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                  return (
                    <div key={video.id} className={`border rounded-xl overflow-hidden ${!video.is_active ? 'opacity-60' : ''}`}>
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-gray-100">
                        {thumbnail ? (
                          <img src={thumbnail} alt={video.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Video className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                        {!video.is_active && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Hidden</span>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900">{video.name}</h4>
                        <p className="text-sm text-gray-600">{video.designation}</p>
                        {video.location && <p className="text-xs text-gray-500 mt-1">{video.location}</p>}
                        <div className="flex gap-2 mt-3">
                          <a 
                            href={video.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> View
                          </a>
                          <button 
                            onClick={() => handleToggleVideo(video.id)}
                            className={`text-xs ${video.is_active ? 'text-yellow-600' : 'text-green-600'} hover:underline`}
                          >
                            {video.is_active ? 'Hide' : 'Show'}
                          </button>
                          <button 
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SecurityTab({ loginLogs }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/api/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });
      if (res.ok) { toast.success('Password changed successfully!'); setCurrentPassword(''); setNewPassword(''); }
      else { const err = await res.json(); toast.error(err.detail || 'Failed to change password'); }
    } catch (e) { toast.error('Error changing password'); }
    finally { setChangingPassword(false); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Security & Login Logs</h2>
      
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-primary" /> Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-input" required placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-input" required placeholder="Enter new password (min 6 chars)" minLength={6} />
          </div>
          <button type="submit" disabled={changingPassword} className="btn-primary">
            <Save className="w-4 h-4" /> {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Security Features Active</h3>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• JWT token authentication with bcrypt password hashing</li>
              <li>• Secret admin URL (not /admin)</li>
              <li>• Rate limiting (5 attempts max)</li>
              <li>• 30 minute session timeout</li>
              <li>• Login attempt logging</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Recent Login Attempts</h3>
        {loginLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No login attempts recorded</p>
        ) : (
          <div className="space-y-2">
            {loginLogs.slice(-10).reverse().map((log, i) => (
              <div key={i} className={`p-3 rounded-lg text-sm ${log.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex justify-between">
                  <span className={log.success ? 'text-green-700' : 'text-red-700'}>
                    {log.success ? '✓ Successful' : '✗ Failed'}
                  </span>
                  <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-gray-600 mt-1">Device: {log.deviceId}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Admin Component
// Team Management Tab
function TeamTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '', title: '', bio: '', photo_url: '', linkedin_url: '', twitter_url: '', email: '', order: 0
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/team?active_only=false`);
      if (res.ok) setMembers(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const resetForm = () => {
    setFormData({ name: '', title: '', bio: '', photo_url: '', linkedin_url: '', twitter_url: '', email: '', order: 0 });
    setEditingMember(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.title) return toast.error('Name and title are required');
    
    try {
      const url = editingMember 
        ? `${API_URL}/api/team/${editingMember.id}` 
        : `${API_URL}/api/team`;
      const method = editingMember ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success(editingMember ? 'Team member updated!' : 'Team member added!');
        resetForm();
        fetchMembers();
      } else {
        toast.error('Failed to save team member');
      }
    } catch (e) {
      toast.error('Error saving team member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      title: member.title || '',
      bio: member.bio || '',
      photo_url: member.photo_url || '',
      linkedin_url: member.linkedin_url || '',
      twitter_url: member.twitter_url || '',
      email: member.email || '',
      order: member.order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const res = await adminFetch(`${API_URL}/api/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Team member deleted');
        fetchMembers();
      }
    } catch (e) { toast.error('Error deleting'); }
  };

  const handleToggleActive = async (member) => {
    try {
      const res = await adminFetch(`${API_URL}/api/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !member.is_active })
      });
      if (res.ok) {
        toast.success(`Team member ${member.is_active ? 'hidden' : 'visible'}`);
        fetchMembers();
      }
    } catch (e) { toast.error('Error updating'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Team Members ({members.length})
        </h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">
          <Plus className="w-4 h-4 mr-1" /> Add Member
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title/Role *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Software Trainer, HR Manager"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@etieducom.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <ImageUploadField value={formData.photo_url} onChange={(url) => setFormData({...formData, photo_url: url})} label="Team Member Photo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Brief description about this team member..."
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                <Save className="w-4 h-4 mr-1" /> {editingMember ? 'Update' : 'Add'} Member
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members Grid */}
      {members.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No team members yet. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.id} className={`bg-white rounded-xl border overflow-hidden ${!member.is_active ? 'opacity-60' : ''}`}>
              {/* Photo */}
              <div className="h-48 bg-gray-100 relative">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                {!member.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Hidden</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.title}</p>
                {member.email && <p className="text-xs text-gray-500 mt-1">{member.email}</p>}
                {member.bio && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{member.bio}</p>}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleToggleActive(member)} className={`text-sm flex items-center gap-1 ${member.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}>
                    <Eye className="w-3 h-3" /> {member.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 ml-auto">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default function SecureAdminPage() {
  const [authState, setAuthState] = useState('loading'); // loading, login, setup-2fa, otp, authenticated
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [loginLogs, setLoginLogs] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  // 2FA setup state
  const [setupSecret, setSetupSecret] = useState('');
  const [setupQrDataUrl, setSetupQrDataUrl] = useState('');
  const [setupOtpAuthUri, setSetupOtpAuthUri] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initialize
  useEffect(() => {
    const devId = generateDeviceId();
    setDeviceId(devId);
    
    // Check existing session
    const session = sessionStorage.getItem('admin_session');
    const sessionDevice = sessionStorage.getItem('admin_device');
    const sessionTime = sessionStorage.getItem('admin_last_activity');
    
    if (session === 'true' && sessionDevice === devId) {
      if (sessionTime && Date.now() - parseInt(sessionTime) < SESSION_TIMEOUT) {
        setAuthState('authenticated');
        setLastActivity(parseInt(sessionTime));
      } else {
        sessionStorage.clear();
        setAuthState('login');
      }
    } else {
      setAuthState('login');
    }

    // Load login logs
    const logs = JSON.parse(localStorage.getItem('admin_login_logs') || '[]');
    setLoginLogs(logs);

    // Check lockout
    const lockout = localStorage.getItem('admin_lockout');
    if (lockout && Date.now() < parseInt(lockout)) {
      setLockoutUntil(parseInt(lockout));
    }

    // Load attempts
    const attempts = parseInt(localStorage.getItem('admin_attempts') || '0');
    setLoginAttempts(attempts);
  }, []);

  // Session timeout checker
  useEffect(() => {
    if (authState !== 'authenticated') return;

    const checkTimeout = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        handleLogout();
        toast.error('Session expired due to inactivity');
      }
    }, 60000);

    const updateActivity = () => {
      setLastActivity(Date.now());
      sessionStorage.setItem('admin_last_activity', Date.now().toString());
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);

    return () => {
      clearInterval(checkTimeout);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
    };
  }, [authState, lastActivity]);

  const logLoginAttempt = (success) => {
    const log = { timestamp: Date.now(), success, deviceId };
    const logs = [...loginLogs, log].slice(-50);
    setLoginLogs(logs);
    localStorage.setItem('admin_login_logs', JSON.stringify(logs));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const mins = Math.ceil((lockoutUntil - Date.now()) / 60000);
      toast.error(`Too many attempts. Try again in ${mins} minutes.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.status === 401) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('admin_attempts', newAttempts.toString());
        logLoginAttempt(false);
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockout = Date.now() + LOCKOUT_TIME;
          setLockoutUntil(lockout);
          localStorage.setItem('admin_lockout', lockout.toString());
          toast.error('Too many failed attempts. Locked for 15 minutes.');
        } else {
          toast.error(`Invalid password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
        }
        return;
      }

      if (data.requires_setup) {
        setSetupSecret(data.secret);
        setSetupQrDataUrl(data.qr_data_url);
        setSetupOtpAuthUri(data.otpauth_uri);
        setOtp('');
        setAuthState('setup-2fa');
        return;
      }

      if (data.requires_otp) {
        setOtp('');
        setAuthState('otp');
        return;
      }

      toast.error('Unexpected server response');
    } catch (error) {
      toast.error('Unable to connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetup2FASubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Please enter the 6-digit code'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, otp, pending_secret: setupSecret })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('admin_token', data.token);
        completeLogin();
        localStorage.setItem('admin_attempts', '0');
        setLoginAttempts(0);
        toast.success('2FA enabled. Save your authenticator app — required for next login!');
        setSetupSecret(''); setSetupQrDataUrl(''); setSetupOtpAuthUri(''); setOtp('');
      } else {
        toast.error(data.detail || 'Invalid code. Please try again.');
        setOtp('');
      }
    } catch (error) {
      toast.error('Unable to connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Please enter the 6-digit code'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, otp })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('admin_token', data.token);
        completeLogin();
        localStorage.setItem('admin_attempts', '0');
        setLoginAttempts(0);
        setOtp('');
      } else {
        toast.error(data.detail || 'Invalid code. Please try again.');
        setOtp('');
      }
    } catch (error) {
      toast.error('Unable to connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const completeLogin = () => {
    sessionStorage.setItem('admin_session', 'true');
    sessionStorage.setItem('admin_device', deviceId);
    sessionStorage.setItem('admin_last_activity', Date.now().toString());
    setLastActivity(Date.now());
    setAuthState('authenticated');
    logLoginAttempt(true);
    toast.success('Welcome to Admin Panel');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setAuthState('login');
    setPassword('');
    setOtp('');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all-leads', label: 'All Leads', icon: Users },
    { id: 'educonnect-leads', label: 'EduConnect', icon: GraduationCap },
    { id: 'cyber-warriors', label: 'Cyber Warriors', icon: Shield },
    { id: 'referrals', label: 'Referrals', icon: Gift },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'partners', label: 'Partners', icon: Handshake },
    { id: 'universities', label: 'Universities', icon: Building2 },
    { id: 'msg91', label: 'WhatsApp', icon: MessageSquare },
    { id: 'security', label: 'Security', icon: Key },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'all-leads': return <AllLeadsTab />;
      case 'educonnect-leads': return <EduConnectLeadsTab />;
      case 'cyber-warriors': return <CyberWarriorsTab />;
      case 'referrals': return <ReferralsTab />;
      case 'team': return <TeamTab />;
      case 'blogs': return <BlogsTab />;
      case 'reviews': return <ReviewsTab />;
      case 'events': return <EventsTab />;
      case 'partners': return <PartnersTab />;
      case 'universities': return <UniversitiesTab />;
      case 'msg91': return <MSG91SettingsTab />;
      case 'security': return <SecurityTab loginLogs={loginLogs} />;
      default: return <DashboardTab />;
    }
  };

  if (authState === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  }

  // Login Screen
  if (authState === 'login') {
    const isLocked = lockoutUntil && Date.now() < lockoutUntil;
    
    return (
      <>
        <Toaster position="top-right" richColors />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Secure Admin</h1>
              <p className="text-gray-500 text-sm mt-1">ETI Educom Management</p>
            </div>
            
            {isLocked ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 font-medium">Account Locked</p>
                <p className="text-red-600 text-sm">Try again in {Math.ceil((lockoutUntil - Date.now()) / 60000)} minutes</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" placeholder="Enter admin password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="admin-password-input"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
                </div>
                <button type="submit" disabled={submitting} data-testid="admin-password-submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  <LogIn className="w-5 h-5" /> {submitting ? 'Verifying...' : 'Continue'}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  {MAX_LOGIN_ATTEMPTS - loginAttempts} attempts remaining
                </p>
                <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1 mt-2">
                  <Shield className="w-3 h-3 text-green-600" /> 2FA required for all logins
                </p>
              </form>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Smartphone className="w-4 h-4" />
                <span>Device: {deviceId}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 2FA Setup Screen (first-time)
  if (authState === 'setup-2fa') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Set Up 2FA</h1>
              <p className="text-gray-500 text-sm mt-1">Mandatory for admin access — one-time setup</p>
            </div>

            <ol className="text-sm text-gray-700 mb-5 space-y-2 list-decimal pl-5">
              <li>Install <b>Google Authenticator</b>, <b>Microsoft Authenticator</b>, or <b>Authy</b> on your phone.</li>
              <li>Scan the QR code below or enter the secret key manually.</li>
              <li>Enter the 6-digit code from your app to confirm.</li>
            </ol>

            {setupQrDataUrl && (
              <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4 mb-4">
                <img src={setupQrDataUrl} alt="Scan with Authenticator app" className="w-48 h-48 rounded-lg" data-testid="admin-2fa-qr" />
                <div className="mt-3 w-full">
                  <p className="text-xs text-gray-500 text-center mb-1">Can't scan? Enter this key manually:</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-2 font-mono text-xs text-center break-all select-all" data-testid="admin-2fa-secret">
                    {setupSecret}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSetup2FASubmit} className="space-y-4">
              <input type="text" placeholder="6-digit code from app" value={otp} maxLength={6}
                inputMode="numeric" autoComplete="one-time-code"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                data-testid="admin-2fa-setup-otp-input"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none" required />
              <button type="submit" disabled={submitting || otp.length !== 6} data-testid="admin-2fa-setup-submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                {submitting ? 'Verifying...' : 'Confirm & Enable 2FA'}
              </button>
              <button type="button" onClick={() => { setAuthState('login'); setOtp(''); setPassword(''); }} className="w-full text-gray-500 py-2 text-sm hover:text-gray-700">
                ← Cancel
              </button>
            </form>

            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <b>⚠ Important:</b> Save this device. You'll need the same authenticator app for all future logins. If you lose it, contact a developer to reset.
            </div>
          </div>
        </div>
      </>
    );
  }

  // OTP Screen (subsequent logins after 2FA enabled)
  if (authState === 'otp') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Key className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h1>
              <p className="text-gray-500 text-sm mt-1">Enter the 6-digit code from your authenticator app</p>
            </div>
            
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <input type="text" placeholder="000000" value={otp} maxLength={6}
                inputMode="numeric" autoComplete="one-time-code" autoFocus
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                data-testid="admin-otp-input"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-3xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none" required />
              <button type="submit" disabled={submitting || otp.length !== 6} data-testid="admin-otp-submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                {submitting ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button type="button" onClick={() => { setAuthState('login'); setOtp(''); setPassword(''); }} className="w-full text-gray-500 py-2 text-sm hover:text-gray-700">
                ← Back to Login
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // Authenticated Dashboard
  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ETI Educom Admin</h1>
                <p className="text-xs text-gray-500">Secure Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 hidden md:block">Device: {deviceId}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-56 flex-shrink-0">
              <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all text-sm ${
                        activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
            <main className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-gray-200 p-6">{renderTab()}</div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
