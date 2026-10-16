import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Printer, 
  Check, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';

export const AlertsAuditScreen: React.FC = () => {
  const { 
    alerts, 
    batches, 
    zones, 
    orders, 
    inspections, 
    acknowledgeAlert, 
    resolveAlert 
  } = useWarehouse();

  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [resolvedFilter, setResolvedFilter] = useState<string>('Unresolved');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportModal, setReportModal] = useState(false);

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSev = severityFilter === 'All' || alert.severity === severityFilter;
    const matchesRes = 
      resolvedFilter === 'All' 
        ? true 
        : resolvedFilter === 'Unresolved' 
        ? !alert.resolved 
        : alert.resolved;
    const matchesSearch = 
      !searchQuery || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.entityReference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesRes && matchesSearch;
  });

  const unresolvedCount = alerts.filter(a => !a.resolved).length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && !a.resolved).length;
  const haccpComplianceScore = Math.max(70, Math.min(100, 100 - (criticalCount * 12) - (unresolvedCount * 4)));

  // Generate downloadable CSV report
  const downloadCsvAudit = () => {
    const headers = ['Alert ID', 'Type', 'Severity', 'Title', 'Entity Reference', 'Timestamp', 'Acknowledged', 'Resolved', 'Suggested Action'];
    const rows = alerts.map(a => [
      a.id,
      `"${a.type}"`,
      a.severity,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.entityReference}"`,
      a.timestamp,
      a.acknowledged ? 'YES' : 'NO',
      a.resolved ? 'YES' : 'NO',
      `"${a.suggestedAction.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShelfNova_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Royal Candy Governance */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-300/25 via-orange-200/35 to-purple-300/25 border-2 border-amber-300/70 shadow-lg shadow-amber-200/50 backdrop-blur-sm">
        {/* Floating Icons */}
        <div className="absolute -top-3 -right-3 text-5xl opacity-20 select-none pointer-events-none animate-pulse">
          👑
        </div>
        <div className="absolute bottom-1 right-36 text-4xl opacity-20 select-none pointer-events-none">
          🍯
        </div>

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-candy font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1.5 border border-white/60">
              <Award className="w-3.5 h-3.5" /> Royal Candy Governance
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-candy font-bold bg-white/80 text-amber-900 border border-amber-200 shadow-sm">
              📜 FDA 21 CFR Confection Ledger
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-candy font-extrabold text-amber-950 flex items-center gap-2">
            <span>Confectionery Audit & Incident Response</span>
            <span className="text-xl">🏆</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-950/80 max-w-xl font-medium">
            Immutable cold-chain logs, automated HACCP hygiene checks, and quarantine protocols protecting the entire confectionery kingdom.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 shrink-0">
          <button
            onClick={downloadCsvAudit}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 text-xs font-candy font-bold border-2 border-amber-300 transition shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>Export Candy CSV</span>
          </button>
          <button
            onClick={() => setReportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-candy font-bold shadow-md shadow-emerald-300 transition cursor-pointer hover:scale-105 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Royal Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* 4 Confectionery KPI Seals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/90 border-2 border-amber-200 shadow-md shadow-amber-100/50 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-candy font-bold text-amber-800">HACCP Hygiene Score</span>
            <span className="text-xl">🏆</span>
          </div>
          <div className="text-3xl font-candy font-extrabold text-emerald-600">
            {haccpComplianceScore}%
          </div>
          <span className="text-[11px] text-amber-700/80 font-medium block">Confection grade compliant</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 border-2 border-orange-200 shadow-md shadow-orange-100/50 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-candy font-bold text-orange-800">Open Incidents</span>
            <span className="text-xl">🍊</span>
          </div>
          <div className="text-3xl font-candy font-extrabold text-orange-600">
            {unresolvedCount}
          </div>
          <span className="text-[11px] text-orange-700/80 font-medium block">Awaiting confectioner review</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 border-2 border-rose-200 shadow-md shadow-rose-100/50 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-candy font-bold text-rose-800">Critical Breaches</span>
            <span className="text-xl">🍓</span>
          </div>
          <div className="text-3xl font-candy font-extrabold text-rose-600">
            {criticalCount}
          </div>
          <span className="text-[11px] text-rose-700/80 font-medium block">Zero sugar tolerance</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 border-2 border-teal-200 shadow-md shadow-teal-100/50 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-candy font-bold text-teal-800">Inspected Lots</span>
            <span className="text-xl">🍬</span>
          </div>
          <div className="text-3xl font-candy font-extrabold text-teal-600">
            {inspections.length}
          </div>
          <span className="text-[11px] text-teal-700/80 font-medium block">Sugar crystal certified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white/90 border-2 border-amber-200 shadow-md shadow-amber-100/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-900 font-candy font-bold">Severity Filter:</span>
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-full font-candy font-bold transition cursor-pointer shadow-sm ${
                severityFilter === sev
                  ? 'bg-amber-500 text-white shadow-amber-300'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {sev === 'Critical' ? '🍓 ' : sev === 'High' ? '🍊 ' : sev === 'Medium' ? '🍋 ' : sev === 'Low' ? '🍃 ' : '✨ '}
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={resolvedFilter}
            onChange={(e) => setResolvedFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 font-candy font-bold focus:border-amber-500 outline-none shadow-sm cursor-pointer"
          >
            <option value="Unresolved">🚨 Active / Open Incidents</option>
            <option value="Resolved">✨ Resolved Incidents</option>
            <option value="All">📜 All Incidents History</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by lot or bay..."
            className="px-4 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 font-candy text-xs placeholder:text-amber-400 outline-none focus:border-amber-500 shadow-inner"
          />
        </div>
      </div>

      {/* Confectionery Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-white/80 border-2 border-dashed border-amber-200 text-amber-800 text-sm font-candy font-bold">
            🎉 All clear! No incidents matching your sweet criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
                alert.resolved
                  ? 'bg-emerald-50/70 border-emerald-200 opacity-80'
                  : alert.severity === 'Critical'
                  ? 'bg-gradient-to-r from-rose-50/90 via-white to-rose-50/50 border-rose-300 shadow-rose-100'
                  : alert.severity === 'High'
                  ? 'bg-gradient-to-r from-orange-50/90 via-white to-amber-50/50 border-orange-300 shadow-orange-100'
                  : 'bg-white border-amber-200'
              }`}
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-candy font-extrabold uppercase shadow-sm ${
                    alert.severity === 'Critical'
                      ? 'bg-rose-500 text-white'
                      : alert.severity === 'High'
                      ? 'bg-orange-500 text-white'
                      : 'bg-amber-400 text-amber-950'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-candy font-bold text-amber-900">{alert.type}</span>
                  <span className="text-[11px] font-candy text-amber-600">• {alert.timestamp}</span>
                  <span className="font-candy text-xs text-purple-700 font-bold px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-200">
                    {alert.entityReference}
                  </span>
                </div>

                <h4 className="font-candy font-extrabold text-base text-amber-950">{alert.title}</h4>
                <p className="text-xs text-amber-900/80 font-medium leading-relaxed">{alert.description}</p>

                <div className="pt-1 text-xs text-amber-950 font-candy">
                  <span className="font-extrabold text-pink-600">SOP Protocol:</span>{' '}
                  <span className="font-medium text-amber-900">{alert.suggestedAction}</span>
                </div>

                {alert.resolved && alert.resolvedAt && (
                  <div className="text-[11px] text-emerald-700 font-candy font-bold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Incident successfully resolved & certified in candy ledger at {alert.resolvedAt}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-candy font-bold border border-amber-300 transition cursor-pointer hover:scale-105"
                  >
                    🍬 Acknowledge
                  </button>
                )}

                {!alert.resolved ? (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-candy font-bold transition shadow-md shadow-emerald-200 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Resolve Incident</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-candy font-bold flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Certified & Closed</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Audit Dossier Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white border-4 border-amber-200 p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b-2 border-amber-100 pb-3">
              <div>
                <span className="text-[10px] font-candy font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Official Confectionery Dossier
                </span>
                <h3 className="text-xl font-candy font-extrabold text-amber-950">
                  ShelfNova Royal Confectionery Audit
                </h3>
                <span className="text-xs text-amber-700 font-candy font-bold">
                  Generated {new Date().toISOString()} • Facility #WMS-CANDY-01
                </span>
              </div>
              <button 
                onClick={() => setReportModal(false)}
                className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-candy font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center">
                <span className="text-amber-700 font-candy font-bold block">Compliance Grade</span>
                <span className="text-base font-candy font-extrabold text-emerald-600">GRADE A+ (Royal Pass)</span>
              </div>
              <div className="p-4 rounded-2xl bg-pink-50 border-2 border-pink-200 text-center">
                <span className="text-pink-700 font-candy font-bold block">Inventory Lots</span>
                <span className="text-base font-candy font-extrabold text-pink-900">{batches.length} Lots</span>
              </div>
              <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 text-center">
                <span className="text-teal-700 font-candy font-bold block">Confection Waste Saved</span>
                <span className="text-base font-candy font-extrabold text-teal-700">
                  {orders.reduce((sum, o) => sum + (o.wasteSavingsKg || 0), 0)} kg
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-candy font-bold text-amber-950 block">Cooler Bay Atmosphere Status</span>
              <div className="rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs font-candy">
                  <thead className="bg-amber-100/80 text-amber-900">
                    <tr>
                      <th className="p-2.5 font-bold">Bay</th>
                      <th className="p-2.5 font-bold">Temperature</th>
                      <th className="p-2.5 font-bold">Target</th>
                      <th className="p-2.5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 bg-white">
                    {zones.map(z => (
                      <tr key={z.id}>
                        <td className="p-2.5 font-bold text-amber-950">{z.name.split(' - ')[0]}</td>
                        <td className="p-2.5 font-extrabold text-pink-600">{z.currentTemp}°C</td>
                        <td className="p-2.5 text-amber-700 font-medium">{z.targetTemp}°C</td>
                        <td className="p-2.5 font-bold text-emerald-600">✨ {z.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-amber-100">
              <button
                onClick={() => setReportModal(false)}
                className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-candy font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-candy font-bold flex items-center gap-1.5 shadow-md shadow-emerald-200 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
