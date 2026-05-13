/**
 * Finance Section Integration Components
 * Integrates all Finance pages with backend APIs
 * Pages: Billing, Revenue, Transactions, Plans
 */

import { useState, useCallback, useEffect, memo } from "react";
import {
  FaReceipt, FaChartBar, FaCreditCard, FaTags,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle,
  FaSearch, FaDownload, FaPlus, FaEdit, FaTrash,
  FaBoxOpen, FaSync
} from "react-icons/fa";
import superAdminAPI from "../services/superAdminAPI";

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const Toast = memo(({ msg, onClose }) => (
  <div className="sa-toast">
    <FaCheckCircle style={{ color: "#22c55e", marginRight: 8 }} />
    {msg}
    <button onClick={onClose} className="sa-toast-close">×</button>
  </div>
));

function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

const SABadge = memo(({ s }) => {
  const m = {
    active: "sa-green", inactive: "sa-gray", expiring: "sa-yellow", expired: "sa-gray",
    success: "sa-green", failed: "sa-red", pending: "sa-yellow", refunded: "sa-yellow",
  };
  return <span className={`sa-badge ${m[s] || "sa-gray"}`}>{s}</span>;
});

const EmptyState = ({ icon, title, desc }) => (
  <div className="sa-empty">
    <div className="sa-empty-icon">{icon || <FaBoxOpen />}</div>
    <h4>{title || "No data found"}</h4>
    <p>{desc || "Nothing to display here yet."}</p>
  </div>
);

const LoadingState = () => (
  <div className="sa-loading">
    <div className="sa-spinner" />
    <span>Loading...</span>
  </div>
);

const KpiCard = ({ icon, label, value, change, color, trend }) => (
  <div className="sa-kpi-card">
    <div className="sa-kpi-icon" style={{ background: color + "22" }}>{icon}</div>
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
      {change && <small style={{ color: trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "var(--text-secondary)" }}>{change}</small>}
    </div>
  </div>
);

function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="sa-pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className="sa-page-btn">‹</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} className={`sa-page-btn ${page === i + 1 ? "sa-page-active" : ""}`} onClick={() => onChange(i + 1)}>{i + 1}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)} className="sa-page-btn">›</button>
    </div>
  );
}

// ─── BILLING PAGE ─────────────────────────────────────────────────────────────

export function SABilling() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();
  const PER = 5;

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        status: filter === "all" ? undefined : filter,
        search: search || undefined,
        page,
        limit: PER
      };
      const response = await superAdminAPI.financial.getAllSubscriptions(filters);
      const subscriptionsArray = response?.data?.subscriptions || [];
      setSubscriptions(Array.isArray(subscriptionsArray) ? subscriptionsArray : []);
    } catch (err) {
      console.error('[SABilling] Error fetching subscriptions:', err);
      setError(err.message);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const active = subscriptions.filter(s => s.status === "active").length;
  const expired = subscriptions.filter(s => s.status === "expired").length;
  const expiring = subscriptions.filter(s => s.status === "expiring").length;

  const filtered = subscriptions.filter(s =>
    (filter === "all" || s.status === filter) &&
    ((s.user?.toLowerCase() || s.member?.toLowerCase() || '').includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaReceipt style={{ marginRight: 8 }} />Billing</h2>
        <button className="btn btn-outline sa-btn-sm" onClick={() => show('Billing data exported!')}><FaDownload style={{ marginRight: 6 }} />Export</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaCheckCircle />} label="Active Subscriptions" value={active} color="#22c55e" />
            <KpiCard icon={<FaExclamationCircle />} label="Expiring Soon" value={expiring} color="#f97316" change="Within 7 days" trend="down" />
            <KpiCard icon={<FaTimesCircle />} label="Expired Plans" value={expired} color="#ef4444" />
          </div>
          <div className="sa-filters">
            <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search member..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            {["all", "active", "expiring", "expired"].map(f => (
              <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
            ))}
          </div>
          <div className="sa-card">
            {paged.length === 0 ? <EmptyState title="No subscriptions found" desc="Try adjusting your search or filters." /> : (
              <table className="sa-table">
                <thead><tr><th>Member</th><th>Plan</th><th>Start</th><th>Expiry</th><th>Days Left</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {paged.map(s => (
                    <tr key={s.id || s._id}>
                      <td><strong>{s.user || s.member || 'N/A'}</strong></td>
                      <td>{s.plan || s.planName || 'N/A'}</td>
                      <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{new Date(s.startDate || s.start).toLocaleDateString() || 'N/A'}</td>
                      <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{new Date(s.endDate || s.expiry).toLocaleDateString() || 'N/A'}</td>
                      <td>
                        <span style={{ color: (s.daysLeft || 0) <= 7 ? "#ef4444" : (s.daysLeft || 0) <= 30 ? "#f97316" : "#22c55e", fontWeight: 700 }}>
                          {(s.daysLeft || 0) > 0 ? `${s.daysLeft}d` : "—"}
                        </span>
                      </td>
                      <td><SABadge s={s.status || 'active'} /></td>
                      <td><button className="sa-link-btn" onClick={() => show(`Renewing ${s.user || s.member}'s subscription`)}>Renew</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── REVENUE PAGE ─────────────────────────────────────────────────────────────

export function SARevenue() {
  const [period, setPeriod] = useState("monthly");
  const [revenueData, setRevenueData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superAdminAPI.analytics.getFinancialReport({ period });
        const reportData = response?.data || response;
        
        setSummary(reportData?.summary || {});
        
        // Transform transactions into monthly data
        if (reportData?.transactions && Array.isArray(reportData.transactions)) {
          const grouped = {};
          reportData.transactions.forEach(t => {
            const date = new Date(t.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!grouped[monthKey]) {
              grouped[monthKey] = 0;
            }
            grouped[monthKey] += t.amount || 0;
          });
          
          const monthlyData = Object.entries(grouped).map(([month, revenue]) => ({
            month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            revenue
          }));
          
          setRevenueData(monthlyData.length > 0 ? monthlyData : []);
        }
      } catch (err) {
        console.error('[SARevenue] Error fetching revenue:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [period]);

  const maxRev = revenueData.length > 0 ? Math.max(...revenueData.map(d => d.revenue)) : 1;

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaChartBar style={{ marginRight: 8 }} />Revenue</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["monthly", "yearly"].map(p => (
            <button key={p} className={`sa-filter-btn ${period === p ? "sa-filter-active" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          {summary && (
            <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: "20px" }}>
              <KpiCard icon={<FaChartBar />} label="Total Revenue" value={`₹${(summary.totalRevenue / 100000).toFixed(1)}L`} color="#22c55e" />
              <KpiCard icon={<FaSync />} label="Total Refunds" value={`₹${(summary.totalRefunds / 100000).toFixed(1)}L`} color="#ef4444" />
              <KpiCard icon={<FaCheckCircle />} label="Net Revenue" value={`₹${(summary.netRevenue / 100000).toFixed(1)}L`} color="#3b82f6" />
            </div>
          )}
          <div className="sa-card">
            <div className="sa-bar-chart">
              {revenueData.length > 0 ? revenueData.map((v, i) => (
                <div className="sa-bar-col" key={i}>
                  <span className="sa-bar-val">₹{(v.revenue / 100000).toFixed(1)}L</span>
                  <div className="sa-bar" style={{ height: `${maxRev > 0 ? (v.revenue / maxRev) * 100 : 0}%` }} />
                  <span className="sa-bar-label">{v.month}</span>
                </div>
              )) : <EmptyState title="No revenue data" desc="Revenue data will appear here" />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── TRANSACTIONS PAGE ────────────────────────────────────────────────────────

export function SATransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();
  const PER = 5;

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        status: filter === "all" ? undefined : filter,
        search: search || undefined,
        page,
        limit: PER
      };
      const response = await superAdminAPI.financial.getAllTransactions(filters);
      const transactionsArray = response?.data?.transactions || [];
      setTransactions(Array.isArray(transactionsArray) ? transactionsArray : []);
    } catch (err) {
      console.error('[SATransactions] Error fetching transactions:', err);
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const success = transactions.filter(t => t.status === "success").length;
  const failed = transactions.filter(t => t.status === "failed").length;
  const pending = transactions.filter(t => t.status === "pending").length;

  const filtered = transactions.filter(t =>
    (filter === "all" || t.status === filter) &&
    ((t.user?.toLowerCase() || t.description?.toLowerCase() || '').includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaCreditCard style={{ marginRight: 8 }} />Transactions</h2>
        <button className="btn btn-outline sa-btn-sm" onClick={() => show('Transactions exported!')}><FaDownload style={{ marginRight: 6 }} />Export</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaCheckCircle />} label="Successful" value={success} color="#22c55e" />
            <KpiCard icon={<FaExclamationCircle />} label="Pending" value={pending} color="#f97316" />
            <KpiCard icon={<FaTimesCircle />} label="Failed" value={failed} color="#ef4444" />
          </div>
          <div className="sa-filters">
            <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search transaction..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            {["all", "success", "pending", "failed"].map(f => (
              <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
            ))}
          </div>
          <div className="sa-card">
            {paged.length === 0 ? <EmptyState title="No transactions found" desc="Try adjusting your search or filters." /> : (
              <table className="sa-table">
                <thead><tr><th>User</th><th>Amount</th><th>Type</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {paged.map(t => (
                    <tr key={t.id || t._id}>
                      <td><strong>{t.user || 'N/A'}</strong></td>
                      <td>₹{(t.amount || 0).toLocaleString()}</td>
                      <td><SABadge s={t.type || 'payment'} /></td>
                      <td>{t.paymentMethod || 'N/A'}</td>
                      <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td><SABadge s={t.status || 'pending'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── PLANS PAGE ───────────────────────────────────────────────────────────────

export function SAPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState({ name: "", planCode: "", price: "", duration: "", description: "" });
  const { toast, show } = useToast();

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.financial.getAllPlans();
      const plansArray = response?.data?.plans || [];
      setPlans(Array.isArray(plansArray) ? plansArray : []);
    } catch (err) {
      console.error('[SAPlans] Error fetching plans:', err);
      setError(err.message);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const openAdd = () => {
    setEditPlan(null);
    setForm({ name: "", planCode: "", price: "", duration: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditPlan(p);
    setForm({
      name: p.planName || p.name || "",
      planCode: p.planCode || "",
      price: p.price || "",
      duration: p.duration || "",
      description: p.description || ""
    });
    setShowModal(true);
  };

  const savePlan = async () => {
    if (!form.name || !form.price || !form.duration) {
      show("Please fill all required fields");
      return;
    }

    try {
      const planCode = form.planCode || form.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10);
      const planData = {
        planName: form.name,
        planCode: planCode || 'PLAN_' + Date.now(),
        duration: parseInt(form.duration) || 1,
        durationType: "months",
        price: Number(form.price),
        description: form.description,
        status: "active"
      };

      console.log('[SAPlans] Saving plan:', planData);

      if (editPlan) {
        await superAdminAPI.financial.updatePlan(editPlan.id || editPlan._id, planData);
        show("Plan updated successfully");
      } else {
        await superAdminAPI.financial.createPlan(planData);
        show("Plan created successfully");
      }

      setShowModal(false);
      fetchPlans();
    } catch (err) {
      console.error('[SAPlans] Error saving plan:', err);
      show(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await superAdminAPI.financial.deletePlan(planId);
        show('Plan deleted successfully');
        fetchPlans();
      } catch (err) {
        show(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaTags style={{ marginRight: 8 }} />Plans & Pricing</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={openAdd}><FaPlus style={{ marginRight: 6 }} />New Plan</button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {plans.length === 0 ? <EmptyState title="No plans found" desc="Create your first membership plan" /> : plans.map(p => (
              <div className="sa-card" key={p.id || p._id} style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 5px 0" }}>{p.planName || 'N/A'}</h4>
                    <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: ".85rem" }}>{p.planCode || 'N/A'}</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="sa-link-btn" onClick={() => openEdit(p)}><FaEdit /></button>
                    <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDelete(p.id || p._id)}><FaTrash /></button>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ fontSize: "1.5rem", color: "#22c55e" }}>₹{(p.price || 0).toLocaleString()}</strong>
                    <span style={{ color: "var(--text-secondary)", marginLeft: "8px" }}>/{p.durationType || 'month'}</span>
                  </div>
                  <p style={{ margin: "10px 0", color: "var(--text-secondary)", fontSize: ".85rem" }}>
                    Duration: {p.duration || 0} {p.durationType || 'months'}
                  </p>
                  <p style={{ margin: "10px 0", color: "var(--text-secondary)", fontSize: ".85rem" }}>
                    {p.description || 'No description'}
                  </p>
                  <SABadge s={p.status || 'active'} />
                </div>
              </div>
            ))}
          </div>

          {showModal && (
            <div className="sa-modal-overlay" onClick={() => setShowModal(false)}>
              <div className="sa-modal" onClick={e => e.stopPropagation()}>
                <div className="sa-modal-head">
                  <h3>{editPlan ? "Edit Plan" : "Create New Plan"}</h3>
                  <button className="sa-modal-close" onClick={() => setShowModal(false)}>×</button>
                </div>
                <div className="sa-modal-body">
                  <div className="sa-form-group">
                    <label>Plan Name *</label>
                    <input
                      className="sa-input"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Basic, Premium, Gold"
                    />
                  </div>
                  <div className="sa-form-group">
                    <label>Plan Code *</label>
                    <input
                      className="sa-input"
                      value={form.planCode}
                      onChange={e => setForm(f => ({ ...f, planCode: e.target.value }))}
                      placeholder="e.g. BASIC, PREMIUM, GOLD"
                    />
                  </div>
                  <div className="sa-form-group">
                    <label>Price (₹) *</label>
                    <input
                      className="sa-input"
                      type="number"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="e.g. 999"
                    />
                  </div>
                  <div className="sa-form-group">
                    <label>Duration (months) *</label>
                    <input
                      className="sa-input"
                      type="number"
                      value={form.duration}
                      onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                      placeholder="e.g. 1, 3, 6, 12"
                    />
                  </div>
                  <div className="sa-form-group">
                    <label>Description</label>
                    <textarea
                      className="sa-input"
                      rows={3}
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Plan description..."
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <button className="btn btn-primary sa-btn-sm" onClick={savePlan}>
                      {editPlan ? "Update Plan" : "Create Plan"}
                    </button>
                    <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default {
  SABilling,
  SARevenue,
  SATransactions,
  SAPlans
};
