import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Activity, 
  Power, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Snowflake
} from 'lucide-react';

export const StorageMonitoringScreen: React.FC = () => {
  const { 
    zones, 
    toggleZoneChiller, 
    toggleZoneVentilation, 
    updateZoneSetpoint
  } = useWarehouse();

  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || 'zone-a');

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  return (
    <div className="space-y-6">
      {/* Header Banner - Frosty Gelato Ice Bay */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-sky-400/25 via-cyan-300/35 to-indigo-300/25 border-2 border-sky-300/70 shadow-lg shadow-sky-200/50 backdrop-blur-sm">
        {/* Decorative Floating Confection Icons */}
        <div className="absolute -top-3 -right-3 text-5xl opacity-20 select-none pointer-events-none animate-pulse">
          🍧
        </div>
        <div className="absolute bottom-1 right-24 text-4xl opacity-20 select-none pointer-events-none">
          🍦
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-candy font-bold bg-sky-500 text-white shadow-sm flex items-center gap-1.5 border border-white/60">
              <Snowflake className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> 
              Sub-Zero Gelato Bay
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-candy font-bold bg-white/80 text-sky-800 border border-sky-200 shadow-sm flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-sky-500" /> Live IoT Sugar Telemetry
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-candy font-extrabold text-sky-950 flex items-center gap-2">
            <span>Popsicle Chillers & Confectionery Atmosphere</span>
            <span className="text-xl">🍨</span>
          </h2>

          <p className="text-xs sm:text-sm text-sky-900/80 max-w-2xl font-medium leading-relaxed">
            Real-time IoT telemetry monitoring sub-zero popsicle freezing bays, marshmallow drying chambers, and mint-fresh ethylene gas scrubbers. Automated overrides safeguard confection textures and cold chain integrity.
          </p>
        </div>
      </div>

      {/* 2D Interactive Warehouse Floor Map / Zone Scoops */}
      <div className="p-6 rounded-3xl bg-white/85 border-2 border-sky-200 shadow-xl shadow-sky-100/60 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-300 flex items-center justify-center text-white shadow-md shadow-sky-200">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-candy font-extrabold text-base text-sky-950">
                Interactive Icebox Plan & Cooler Bays
              </h3>
              <p className="text-[11px] text-sky-700/70 font-medium">Click a cooler bay to adjust thermostats & scrubbers</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-sky-100/80 text-sky-800 text-xs font-candy font-bold border border-sky-200">
            ❄️ 4 Cold Bays Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map(zone => {
            const isSelected = zone.id === selectedZone.id;
            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden space-y-3 ${
                  isSelected
                    ? 'bg-gradient-to-b from-sky-50 via-white to-pink-50/50 border-pink-400 ring-4 ring-pink-300/40 shadow-xl shadow-pink-200/40 scale-[1.02]'
                    : 'bg-white/90 border-sky-150 hover:border-sky-300 hover:shadow-lg shadow-sm'
                }`}
              >
                {/* Dripping frosting line on selected */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-sky-400" />
                )}

                {/* Zone Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-candy font-extrabold text-sm text-sky-950 flex items-center gap-1">
                      <span>{zone.id === 'zone-a' ? '🍓' : zone.id === 'zone-b' ? '🍨' : zone.id === 'zone-c' ? '🥛' : '🍫'}</span>
                      <span>{zone.name.split(' - ')[0]}</span>
                    </h4>
                    <span className="text-[10px] font-bold text-sky-600/80">{zone.categoryTag}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-candy font-bold ${
                    zone.status === 'Optimal'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-amber-100 text-amber-700 border border-amber-300 animate-pulse'
                  }`}>
                    {zone.status === 'Optimal' ? '✨ Optimal' : '⚠️ Warning'}
                  </span>
                </div>

                {/* Primary Temperature Gauge */}
                <div className="flex items-baseline justify-between py-1 bg-gradient-to-r from-sky-50/80 to-blue-50/40 p-2.5 rounded-2xl border border-sky-100">
                  <div className="text-3xl font-candy font-extrabold text-sky-950">
                    {zone.currentTemp > 0 ? `+${zone.currentTemp}` : zone.currentTemp}°C
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-sky-600 font-bold block">Target</span>
                    <span className="text-xs font-candy font-bold text-pink-600">{zone.targetTemp}°C</span>
                  </div>
                </div>

                {/* Secondary Telemetry Readouts */}
                <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-2xl bg-sky-50/60 text-[11px] border border-sky-100 font-medium">
                  <div>
                    <span className="text-sky-600/80 text-[10px] block font-bold">Humidity</span>
                    <span className="font-candy text-sky-950 font-bold">{zone.currentHumidity}%</span>
                  </div>
                  <div>
                    <span className="text-sky-600/80 text-[10px] block font-bold">Ethylene</span>
                    <span className="font-candy text-purple-700 font-bold">{zone.ethylenePpm}</span>
                  </div>
                  <div>
                    <span className="text-sky-600/80 text-[10px] block font-bold">CO2</span>
                    <span className="font-candy text-sky-950 font-bold">{zone.co2Ppm}</span>
                  </div>
                </div>

                {/* System Activity Indicators */}
                <div className="flex items-center justify-between text-[11px] text-sky-800 pt-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${zone.chillerActive ? 'bg-cyan-400 animate-pulse ring-2 ring-cyan-200' : 'bg-slate-300'}`} />
                    <span className="font-candy text-[10px] font-bold">Chiller {zone.chillerActive ? 'ON' : 'OFF'}</span>
                  </span>
                  <span className="font-candy text-[10px] text-sky-700 font-bold">🧇 {zone.occupiedPallets}/{zone.capacityPallets} Crates</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Zone Deep Dive & Control Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Telemetry Console & Setpoint Controls (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/90 border-2 border-sky-200 shadow-xl shadow-sky-100/60 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-sky-100 pb-4">
            <div>
              <span className="text-xs font-candy font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Active Cooler Console
              </span>
              <h3 className="text-xl font-candy font-extrabold text-sky-950">{selectedZone.name}</h3>
            </div>
            <span className="text-xs text-sky-700 font-medium px-3 py-1 rounded-full bg-sky-50 border border-sky-200">
              {selectedZone.description}
            </span>
          </div>

          {/* Environmental Dials Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-sky-50 to-white border-2 border-sky-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-candy font-bold text-sky-700 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-pink-500" />
                <span>Temperature</span>
              </span>
              <div className="text-2xl font-candy font-extrabold text-sky-950">
                {selectedZone.currentTemp}°C
              </div>
              <span className="text-[10px] font-medium text-sky-600 block">
                Safe: {selectedZone.minTemp}° to {selectedZone.maxTemp}°C
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-candy font-bold text-blue-700 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Humidity</span>
              </span>
              <div className="text-2xl font-candy font-extrabold text-blue-950">
                {selectedZone.currentHumidity}%
              </div>
              <span className="text-[10px] font-medium text-blue-600 block">
                Target: {selectedZone.targetHumidity}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-50 to-white border-2 border-purple-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-candy font-bold text-purple-700 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-purple-500" />
                <span>Ethylene</span>
              </span>
              <div className="text-2xl font-candy font-extrabold text-purple-950">
                {selectedZone.ethylenePpm} <span className="text-xs font-normal text-purple-600">ppm</span>
              </div>
              <span className="text-[10px] font-medium text-purple-600 block">
                Threshold: &lt; 0.05 ppm
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-teal-50 to-white border-2 border-teal-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-candy font-bold text-teal-700 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-500" />
                <span>Airflow</span>
              </span>
              <div className="text-2xl font-candy font-extrabold text-teal-950">
                {selectedZone.airflowMps} <span className="text-xs font-normal text-teal-600">m/s</span>
              </div>
              <span className="text-[10px] font-medium text-teal-600 block">
                Mint breeze active
              </span>
            </div>
          </div>

          {/* Interactive Setpoint Slider & System Toggles */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-50/70 to-pink-50/50 border-2 border-sky-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-candy font-bold text-sky-950 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-pink-500" />
                <span>Thermostat Target Setpoint Adjustment</span>
              </span>
              <span className="font-candy text-pink-600 font-extrabold text-base px-3 py-0.5 rounded-full bg-white border border-pink-200 shadow-sm">
                🍦 {selectedZone.targetTemp}°C
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-candy font-bold text-sky-700">{selectedZone.minTemp}°C</span>
              <input
                type="range"
                min={selectedZone.minTemp}
                max={selectedZone.maxTemp}
                step="0.5"
                value={selectedZone.targetTemp}
                onChange={(e) => updateZoneSetpoint(selectedZone.id, parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-3 bg-sky-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-candy font-bold text-sky-700">{selectedZone.maxTemp}°C</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => toggleZoneChiller(selectedZone.id)}
                className={`py-3 px-4 rounded-2xl border-2 text-xs font-candy font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
                  selectedZone.chillerActive
                    ? 'bg-gradient-to-r from-sky-400 to-cyan-400 border-sky-500 text-white shadow-sky-300/50'
                    : 'bg-white border-sky-200 text-sky-700 hover:bg-sky-50'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>Popsicle Chiller ({selectedZone.chillerActive ? 'ENGAGED ❄️' : 'STANDBY'})</span>
              </button>

              <button
                onClick={() => toggleZoneVentilation(selectedZone.id)}
                className={`py-3 px-4 rounded-2xl border-2 text-xs font-candy font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
                  selectedZone.ventilationActive
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400 border-teal-500 text-white shadow-teal-300/50'
                    : 'bg-white border-teal-200 text-teal-800 hover:bg-teal-50'
                }`}
              >
                <Wind className="w-4 h-4" />
                <span>Mint Scrubbers ({selectedZone.ventilationActive ? 'BLOWING 🍃' : 'OFF'})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Sensor Trend & HACCP Callout (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/90 border-2 border-sky-200 shadow-xl shadow-sky-100/60 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-sky-100 pb-3">
            <h3 className="font-candy font-extrabold text-sm text-sky-950 flex items-center gap-1.5">
              <span>🍧</span>
              <span>Recent Cooler Logs</span>
            </h3>
            <span className="text-xs text-sky-700 font-candy font-bold px-2.5 py-0.5 rounded-full bg-sky-100 border border-sky-200">
              6-Hour Window
            </span>
          </div>

          {/* Micro Telemetry Table */}
          <div className="space-y-2">
            {selectedZone.recentReadings.map((reading, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs font-candy transition hover:bg-sky-100/60"
              >
                <span className="text-sky-700 font-bold">{reading.timestamp}</span>
                <span className="font-extrabold text-pink-600">{reading.temperature}°C</span>
                <span className="text-sky-800 font-bold">{reading.humidity}% RH</span>
                <span className="text-purple-600 font-bold">{reading.ethylene} ppm</span>
              </div>
            ))}
          </div>

          {/* HACCP Compliance Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 border-2 border-amber-200 text-xs text-amber-950 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-pink-700 font-candy font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>HACCP Gelato & Cold Chain Guard</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/80 font-medium">
              Perishable dairy creams and fresh berry lots stored in this cold bay are tracked with continuous candy sensor telemetry. Any continuous excursion &gt; 120 minutes triggers an immediate quarantine dispatch and supervisor notification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

