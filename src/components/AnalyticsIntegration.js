/**
 * Analytics Section Integration Components
 * Integrates all Analytics pages with backend APIs
 * Pages: Reports, Member Analytics, Financial Analytics
 */

import { useState, useCallback, useEffect, memo } from "react";
import {
  FaFileInvoiceDollar, FaUsers, FaChartPie,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle,
  FaDownload, FaPlus, FaBoxOpen, FaSync
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
    active: "sa-green", inactive: "sa-gray", high: "sa-red", medium: "sa-yellow", low: "sa-blue",
    success: "sa-green", failed: "sa-red", pending: "sa-yellow",
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

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────

export function SAReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, show } = useToast();

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[SAReports] Starting to fetch reports...');
      
      // Fetch all report types
      const responses = await Promise.all([
        superAdminAPI.analytics.getFinancialReport().catch((err) => {
          console.error('[SAReports] Financial report error:', err.message);
          return { success: false, data: null };
        }),
        superAdminAPI.analytics.getAttendanceReport().catch((err) => {
          console.error('[SAReports] Attendance report error:', err.message);
          return { success: false, data: null };
        }),
        superAdminAPI.analytics.getMembershipReport().catch((err) => {
          console.error('[SAReports] Membership report error:', err.message);
          return { success: false, data: null };
        }),
        superAdminAPI.analytics.getTrainerReport().catch((err) => {
          console.error('[SAReports] Trainer report error:', err.message);
          return { success: false, data: null };
        }),
        superAdminAPI.analytics.getBranchPerformanceReport().catch((err) => {
          console.error('[SAReports] Branch report error:', err.message);
          return { success: false, data: null };
        }),
      ]);

      console.log('[SAReports] All responses received:', responses);

      // Extract data from responses
      const [financial, attendance, membership, trainers, branches] = responses;

      // Build reports array with actual data
      const reportsData = [
        {
          id: 1,
          name: "Financial Report",
          type: "Financial",
          date: new Date().toLocaleDateString(),
          size: "2.4 MB",
          summary: financial?.data?.summary || {},
          transactions: financial?.data?.transactions || [],
          status: financial?.success ? 'ready' : 'error'
        },
        {
          id: 2,
          name: "Attendance Report",
          type: "Attendance",
          date: new Date().toLocaleDateString(),
          size: "1.8 MB",
          summary: attendance?.data?.summary || {},
          report: attendance?.data?.report || [],
          status: attendance?.success ? 'ready' : 'error'
        },
        {
          id: 3,
          name: "Membership Report",
          type: "Membership",
          date: new Date().toLocaleDateString(),
          size: "1.5 MB",
          summary: membership?.data?.summary || {},
          subscriptions: membership?.data?.subscriptions || [],
          status: membership?.success ? 'ready' : 'error'
        },
        {
          id: 4,
          name: "Trainers Report",
          type: "HR",
          date: new Date().toLocaleDateString(),
          size: "1.2 MB",
          summary: trainers?.data?.summary || {},
          report: trainers?.data?.report || [],
          status: trainers?.success ? 'ready' : 'error'
        },
        {
          id: 5,
          name: "Branches Report",
          type: "Operations",
          date: new Date().toLocaleDateString(),
          size: "3.1 MB",
          summary: branches?.data?.summary || {},
          report: branches?.data?.report || [],
          status: branches?.success ? 'ready' : 'error'
        },
      ];

      console.log('[SAReports] Reports data prepared:', reportsData);
      setReports(reportsData);
    } catch (err) {
      console.error('[SAReports] Error fetching reports:', err);
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDownload = (report, format) => {
    console.log(`[SAReports] Downloading ${report.name} as ${format}`);
    show(`Downloading ${report.name} as ${format}...`);
    // TODO: Implement actual download functionality
  };

  const handleGenerateReport = () => {
    console.log('[SAReports] Generate Report clicked');
    show('Generating reports...');
    fetchReports();
  };

  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaFileInvoiceDollar style={{ marginRight: 8 }} />Reports</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={handleGenerateReport}>
          <FaPlus style={{ marginRight: 6 }} />Generate Report
        </button>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="sa-card">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Period</th>
                <th>Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <EmptyState title="No reports available" desc="Click 'Generate Report' to fetch reports" />
                  </td>
                </tr>
              ) : (
                reports.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.name}</strong></td>
                    <td><SABadge s={r.type.toLowerCase()} /></td>
                    <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{r.date}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{r.size}</td>
                    <td>
                      <SABadge s={r.status === 'ready' ? 'success' : 'failed'} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button 
                          className="sa-link-btn" 
                          onClick={() => handleDownload(r, 'PDF')}
                          disabled={r.status !== 'ready'}
                        >
                          <FaDownload /> PDF
                        </button>
                        <button 
                          className="sa-link-btn" 
                          onClick={() => handleDownload(r, 'CSV')}
                          disabled={r.status !== 'ready'}
                        >
                          <FaDownload /> CSV
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Display report summaries */}
          {reports.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <h3 style={{ marginBottom: "16px" }}>Report Summaries</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
                {reports.map(r => (
                  <div key={r.id} className="sa-card" style={{ padding: "16px" }}>
                    <h4 style={{ marginBottom: "12px" }}>{r.name}</h4>
                    {r.status === 'ready' ? (
                      <div style={{ fontSize: ".85rem" }}>
                        {Object.entries(r.summary).slice(0, 3).map(([key, value]) => (
                          <div key={key} style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-secondary)" }}>{key}:</span>
                            <strong>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#ef4444" }}>Failed to load report data</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MEMBER ANALYTICS PAGE ────────────────────────────────────────────────────

export function SAMemberAnalytics() {
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [growthData, setGrowthData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await superAdminAPI.analytics.getUserGrowth?.({ period, year }).catch(() => null);
        const data = response?.data || {};

        setSummary({
          totalMembers: data.totalMembers || 0,
          activeMembers: data.activeMembers || 0,
          inactiveMembers: data.inactiveMembers || 0,
          retentionRate: data.retentionRate || 0,
          newMembers: data.newMembers || 0,
        });

        // Transform growth data for chart
        if (data.growth && Array.isArray(data.growth)) {
          setGrowthData(data.growth);
        } else {
          setGrowthData([]);
        }
      } catch (err) {
        console.error('[SAMemberAnalytics] Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberAnalytics();
  }, [period, year]);

  const maxActive = growthData.length > 0 ? Math.max(...growthData.map(d => d.active || 0)) : 1;

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaUsers style={{ marginRight: 8 }} />Member Analytics</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="sa-input" style={{ width: "120px" }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="sa-input" style={{ width: "100px" }}>
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          {summary && (
            <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              <KpiCard icon={<FaUsers />} label="Total Members" value={summary.totalMembers} color="#22c55e" change={`+${summary.newMembers} new`} trend="up" />
              <KpiCard icon={<FaCheckCircle />} label="Active Members" value={summary.activeMembers} color="#3b82f6" change={`${summary.activeMembers > 0 ? Math.round((summary.activeMembers / summary.totalMembers) * 100) : 0}% active`} />
              <KpiCard icon={<FaTimesCircle />} label="Inactive Members" value={summary.inactiveMembers} color="#ef4444" />
              <KpiCard icon={<FaSync />} label="Retention Rate" value={`${summary.retentionRate}%`} color="#8b5cf6" change="+0.8% vs last month" trend="up" />
            </div>
          )}
          <div className="sa-card">
            <div className="sa-card-head"><h3>Member Growth ({period})</h3></div>
            <div className="sa-bar-chart" style={{ height: 140 }}>
              {growthData.length > 0 ? growthData.map((d, i) => (
                <div className="sa-bar-col" key={i}>
                  <div style={{ display: "flex", gap: 1, alignItems: "flex-end", height: "100%" }}>
                    <div className="sa-bar" style={{ height: `${(d.active / maxActive) * 100}%`, background: "#22c55e", flex: 2 }} />
                    <div className="sa-bar" style={{ height: `${((d.inactive || 0) / maxActive) * 100}%`, background: "#ef4444", flex: 1 }} />
                  </div>
                  <span className="sa-bar-label">{d.label || d.month || d.week || d.day}</span>
                </div>
              )) : <EmptyState title="No growth data" desc="Member growth data will appear here" />}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: ".75rem" }}>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#22c55e", borderRadius: 2, marginRight: 4 }} />Active</span>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#ef4444", borderRadius: 2, marginRight: 4 }} />Inactive</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── FINANCIAL ANALYTICS PAGE ─────────────────────────────────────────────────

export function SAFinancialAnalytics() {
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await superAdminAPI.analytics.getBranches?.().catch(() => null);
        const data = response?.data || {};

        if (data.branches && Array.isArray(data.branches)) {
          setBranchData(data.branches);
        } else {
          setBranchData([]);
        }
      } catch (err) {
        console.error('[SAFinancialAnalytics] Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialAnalytics();
  }, []);

  const totalRevenue = branchData.reduce((sum, b) => sum + (b.revenue || 0), 0);
  const avgOccupancy = branchData.length > 0 ? Math.round(branchData.reduce((sum, b) => sum + (b.occupancy || 0), 0) / branchData.length) : 0;
  const maxRevenue = branchData.length > 0 ? Math.max(...branchData.map(b => b.revenue || 0)) : 1;

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaChartPie style={{ marginRight: 8 }} />Financial Analytics</h2>
      </div>
      {loading && <LoadingState />}
      {error && <div className="sa-error" style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaChartPie />} label="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} color="#22c55e" />
            <KpiCard icon={<FaUsers />} label="Avg Occupancy" value={`${avgOccupancy}%`} color="#3b82f6" />
            <KpiCard icon={<FaSync />} label="Active Branches" value={branchData.length} color="#8b5cf6" />
          </div>
          <div className="sa-two-col">
            <div className="sa-card">
              <div className="sa-card-head"><h3>Branch Revenue</h3></div>
              <div className="sa-bar-chart" style={{ height: 140 }}>
                {branchData.length > 0 ? branchData.map((b, i) => (
                  <div className="sa-bar-col" key={i}>
                    <span className="sa-bar-val">₹{(b.revenue / 100000).toFixed(1)}L</span>
                    <div className="sa-bar" style={{ height: `${(b.revenue / maxRevenue) * 100}%` }} />
                    <span className="sa-bar-label">{b.branchName || b.name}</span>
                  </div>
                )) : <EmptyState title="No branch data" desc="Branch revenue data will appear here" />}
              </div>
            </div>
            <div className="sa-card">
              <div className="sa-card-head"><h3>Branch Occupancy</h3></div>
              {branchData.length > 0 ? (
                branchData.map((b, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: 4 }}>
                      <span>{b.branchName || b.name}</span><strong>{b.occupancy || 0}%</strong>
                    </div>
                    <div style={{ background: "var(--bg-primary)", borderRadius: 4, height: 8 }}>
                      <div style={{ width: `${b.occupancy || 0}%`, height: "100%", background: "#3b82f6", borderRadius: 4 }} />
                    </div>
                  </div>
                ))
              ) : <EmptyState title="No occupancy data" desc="Occupancy metrics will appear here" />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default {
  SAReports,
  SAMemberAnalytics,
  SAFinancialAnalytics
};
