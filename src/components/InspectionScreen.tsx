import React, { useState, useRef, useEffect } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  Save, 
  Eye, 
  Info,
  ScanLine
} from 'lucide-react';
import { INSPECTION_PRESETS, runQualityInspection, InspectionPreset } from '../services/aiVisionInspector';
import { DefectBoundingBox, InspectionVerdict, DefectType } from '../types/warehouse';

export const InspectionScreen: React.FC = () => {
  const { 
    batches, 
    inspections, 
    addInspection, 
    inspectingBatchId, 
    setInspectingBatchId 
  } = useWarehouse();

  // Mode: 'preset' | 'camera' | 'upload'
  const [mode, setMode] = useState<'preset' | 'camera' | 'upload'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<InspectionPreset>(INSPECTION_PRESETS[0]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(inspectingBatchId || batches[0]?.id || '');
  
  // Custom uploaded or captured image
  const [customImage, setCustomImage] = useState<string | null>(null);
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    visualFreshnessScore: number;
    packagingIntegrityScore: number;
    detectedDefects: DefectType[];
    boundingBoxes: DefectBoundingBox[];
    verdict: InspectionVerdict;
    aiConfidence: number;
    notes: string;
    imageUrl: string;
  } | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // If inspectingBatchId was passed from another screen, match it
  useEffect(() => {
    if (inspectingBatchId) {
      setSelectedBatchId(inspectingBatchId);
      const targetBatch = batches.find(b => b.id === inspectingBatchId);
      if (targetBatch) {
        // Try to find matching preset
        const matched = INSPECTION_PRESETS.find(p => p.productName.toLowerCase().includes(targetBatch.name.toLowerCase()));
        if (matched) setSelectedPreset(matched);
      }
    }
  }, [inspectingBatchId, batches]);

  // Clean camera on unmount or mode switch
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      setCameraError('Unable to access camera. Please allow camera permissions or use sample presets.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCustomImage(dataUrl);
      stopCamera();
      triggerAnalysis(dataUrl, undefined);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCustomImage(dataUrl);
        triggerAnalysis(dataUrl, undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAnalysis = async (imgUrl: string, preset?: InspectionPreset) => {
    setIsAnalyzing(true);
    setSavedSuccess(false);

    const targetBatch = batches.find(b => b.id === selectedBatchId);
    const batchNumber = targetBatch?.batchNumber || 'B-UNKNOWN';
    const productName = targetBatch?.name || preset?.productName || 'Produce Item';

    try {
      const result = await runQualityInspection(
        imgUrl,
        batchNumber,
        productName,
        preset?.id
      );

      setCurrentAnalysis({
        ...result,
        imageUrl: imgUrl
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: InspectionPreset) => {
    setSelectedPreset(preset);
    setCustomImage(null);
    stopCamera();
    triggerAnalysis(preset.imageUrl, preset);
  };

  // Run initial analysis on preset selection
  useEffect(() => {
    if (mode === 'preset' && !currentAnalysis && selectedPreset) {
      triggerAnalysis(selectedPreset.imageUrl, selectedPreset);
    }
  }, [mode, selectedPreset]);

  const handleSaveToLot = () => {
    if (!currentAnalysis) return;
    const targetBatch = batches.find(b => b.id === selectedBatchId);
    if (!targetBatch) return;

    addInspection({
      batchId: targetBatch.id,
      batchNumber: targetBatch.batchNumber,
      productName: targetBatch.name,
      inspectorName: 'AI CV Surface (ShelfNova Vision v2.4)',
      visualFreshnessScore: currentAnalysis.visualFreshnessScore,
      packagingIntegrityScore: currentAnalysis.packagingIntegrityScore,
      detectedDefects: currentAnalysis.detectedDefects,
      boundingBoxes: currentAnalysis.boundingBoxes,
      verdict: currentAnalysis.verdict,
      aiConfidence: currentAnalysis.aiConfidence,
      notes: currentAnalysis.notes,
      imageUrl: currentAnalysis.imageUrl
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentDisplayImage = customImage || selectedPreset.imageUrl;
  const targetBatch = batches.find(b => b.id === selectedBatchId);

  return (
    <div className="space-y-6">
      {/* Top Banner: Cotton Candy & Sugar Crystal QA Lab Theme */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-100 via-pink-100 to-emerald-100 border-2 border-purple-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-candy font-bold bg-purple-200 text-purple-900 border border-purple-300 shadow-xs flex items-center gap-1.5">
            <span>🧁</span> Candy Vision Scanner
          </span>
          <span className="text-xs text-[#78350f] font-semibold">Surface Freshness & Defect Verification</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-candy font-extrabold text-[#3d1a10]">
          AI Quality Inspection & Defect Detection Station
        </h2>
        <p className="text-xs sm:text-sm text-[#78350f]/85 max-w-2xl font-medium">
          Computer vision quality analysis evaluating produce for bruising, sugar bloom, soft moisture weep, and seal integrity with automated grading verdicts.
        </p>
      </div>

      {/* Main Inspection Station Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Source / Camera / Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="candy-card p-5 space-y-4 bg-white/95 border-2 border-purple-200">
            {/* Mode Selector Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-purple-100 pb-3 gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMode('preset');
                    stopCamera();
                  }}
                  className={`px-3 py-1.5 rounded-full font-candy font-bold text-xs transition cursor-pointer shadow-xs ${
                    mode === 'preset' ? 'candy-btn-gloss candy-pill-purple text-purple-950 scale-105' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  Preset Catalog
                </button>
                <button
                  onClick={() => {
                    setMode('camera');
                    startCamera();
                  }}
                  className={`px-3 py-1.5 rounded-full font-candy font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-xs ${
                    mode === 'camera' ? 'candy-btn-gloss candy-pill-purple text-purple-950 scale-105' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Live Camera</span>
                </button>
                <button
                  onClick={() => {
                    setMode('upload');
                    stopCamera();
                  }}
                  className={`px-3 py-1.5 rounded-full font-candy font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-xs ${
                    mode === 'upload' ? 'candy-btn-gloss candy-pill-purple text-purple-950 scale-105' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>

              {/* Target Batch Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8b5a45] font-bold">Target Lot:</span>
                <select
                  value={selectedBatchId}
                  onChange={(e) => {
                    setSelectedBatchId(e.target.value);
                    setInspectingBatchId(e.target.value);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-purple-50 border-2 border-purple-200 text-[#3d1a10] font-mono font-bold text-xs focus:border-purple-400"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.batchNumber} - {b.name.substring(0, 18)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Presets Row if in preset mode */}
            {mode === 'preset' && (
              <div className="space-y-2">
                <span className="text-xs text-[#8b5a45] block font-candy font-bold">Sample Produce Test Cases:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INSPECTION_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-2xl text-left border-2 transition flex items-center gap-2 cursor-pointer shadow-xs ${
                        selectedPreset.id === preset.id && !customImage
                          ? 'bg-purple-50 border-purple-400 text-[#3d1a10] scale-[1.02]'
                          : 'bg-[#fffafb] border-pink-100 text-[#78350f] hover:border-pink-300'
                      }`}
                    >
                      <img 
                        src={preset.imageUrl} 
                        alt={preset.name} 
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-purple-200" 
                      />
                      <div className="truncate">
                        <div className="font-candy font-bold text-xs truncate">{preset.name}</div>
                        <div className="text-[10px] text-pink-500 font-medium">{preset.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Camera View Surface */}
            {mode === 'camera' && (
              <div className="space-y-3">
                <div className="relative rounded-3xl overflow-hidden bg-black aspect-video flex items-center justify-center border-3 border-purple-300 shadow-inner">
                  <video 
                    ref={videoRef} 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-200 p-4 text-center bg-purple-950/60">
                      <Camera className="w-8 h-8 mb-2 text-purple-300" />
                      <p className="text-xs">{cameraError || 'Camera stream paused or requesting permissions.'}</p>
                      <button
                        onClick={startCamera}
                        className="candy-btn-gloss candy-pill-purple mt-3 px-4 py-1.5 rounded-full text-purple-950 text-xs font-candy font-bold cursor-pointer"
                      >
                        Start Stream
                      </button>
                    </div>
                  )}

                  {/* Candy reticle overlay */}
                  {isCameraActive && (
                    <div className="absolute inset-8 border-3 border-dashed border-pink-300 rounded-3xl pointer-events-none flex items-center justify-center">
                      <span className="text-[11px] font-candy font-bold text-pink-700 bg-white/90 px-3 py-1 rounded-full shadow-md">
                        Align item inside candy reticle
                      </span>
                    </div>
                  )}
                </div>

                {isCameraActive && (
                  <button
                    onClick={captureCameraFrame}
                    className="candy-btn-gloss candy-pill-purple w-full py-2.5 rounded-2xl text-purple-950 font-candy font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Capture Snapshot & Run AI Scan</span>
                  </button>
                )}
              </div>
            )}

            {/* Upload View */}
            {mode === 'upload' && (
              <div className="p-6 rounded-3xl border-3 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 text-center space-y-3">
                <Upload className="w-8 h-8 mx-auto text-purple-400" />
                <div>
                  <h4 className="text-sm font-candy font-bold text-[#3d1a10]">Upload Produce Photo</h4>
                  <p className="text-xs text-[#8b5a45]">Drop JPEG, PNG image of batch sample</p>
                </div>
                <label className="candy-btn-gloss candy-pill-purple inline-block px-5 py-2 rounded-2xl text-purple-950 text-xs font-candy font-bold cursor-pointer transition shadow-sm">
                  Browse File
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            )}

            {/* Inspection Surface with Bounding Boxes */}
            <div className="relative rounded-3xl overflow-hidden bg-purple-50 border-3 border-purple-200 aspect-video flex items-center justify-center shadow-inner">
              <img 
                src={currentDisplayImage} 
                alt="Inspected produce" 
                className="w-full h-full object-cover" 
              />

              {/* Loading Analysis Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center text-[#3d1a10] space-y-3">
                  <RefreshCw className="w-8 h-8 text-pink-500 animate-spin" />
                  <span className="text-xs font-candy font-bold tracking-wider uppercase text-pink-600">
                    Neural Vision Model Analyzing Textures & Glaze...
                  </span>
                </div>
              )}

              {/* Bounding Box Overlays */}
              {!isAnalyzing && currentAnalysis?.boundingBoxes.map((box, idx) => (
                <div
                  key={idx}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`
                  }}
                  className={`absolute border-3 rounded-2xl transition-all ${
                    box.label === 'No Visible Defect'
                      ? 'border-emerald-400 bg-emerald-500/15'
                      : box.severity === 'severe'
                      ? 'border-rose-500 bg-rose-500/20'
                      : 'border-amber-400 bg-amber-500/20'
                  }`}
                >
                  <span className={`absolute -top-7 left-0 px-2 py-0.5 rounded-full text-[10px] font-candy font-bold whitespace-nowrap shadow-sm border border-white ${
                    box.label === 'No Visible Defect'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-400 text-amber-950'
                  }`}>
                    {box.label} ({Math.round(box.confidence * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Result, Gauges & Verdict (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="candy-card p-5 space-y-4 bg-white/95 border-2 border-purple-200">
            <div className="flex items-center justify-between border-b-2 border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="font-candy font-bold text-sm text-[#3d1a10]">AI Quality Verdict</h3>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700">
                Confidence: <b>{currentAnalysis?.aiConfidence || 92}%</b>
              </span>
            </div>

            {/* Target Lot Context Card */}
            {targetBatch && (
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-[#8b5a45]">
                  <span>Target Lot:</span>
                  <span className="font-mono text-purple-700 font-bold">{targetBatch.batchNumber}</span>
                </div>
                <div className="font-bold text-[#3d1a10] truncate">{targetBatch.name}</div>
                <div className="text-[11px] text-[#8b5a45] flex justify-between">
                  <span>Zone: {targetBatch.zoneName.split(' - ')[0]}</span>
                  <span>Expiry: {targetBatch.expiryDate}</span>
                </div>
              </div>
            )}

            {/* Verdict Card */}
            {currentAnalysis && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border-2 flex items-center justify-between shadow-xs ${
                  currentAnalysis.verdict === 'Pass'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : currentAnalysis.verdict === 'Downgrade Grade B'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase font-candy font-bold tracking-wider block opacity-75">
                      Quality Verdict Stamp
                    </span>
                    <span className="text-lg font-candy font-extrabold">{currentAnalysis.verdict}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white shadow-xs">
                    {currentAnalysis.verdict === 'Pass' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    )}
                  </div>
                </div>

                {/* Dual Gauges */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Gauge 1: Visual Freshness */}
                  <div className="p-3 rounded-2xl bg-[#fffafb] border-2 border-pink-100 text-center space-y-1">
                    <span className="text-[11px] text-[#8b5a45] block font-candy font-bold">Freshness Glaze</span>
                    <div className="text-2xl font-candy font-extrabold text-[#3d1a10]">
                      {currentAnalysis.visualFreshnessScore}%
                    </div>
                    <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full ${
                          currentAnalysis.visualFreshnessScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${currentAnalysis.visualFreshnessScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Gauge 2: Packaging Integrity */}
                  <div className="p-3 rounded-2xl bg-[#fffafb] border-2 border-pink-100 text-center space-y-1">
                    <span className="text-[11px] text-[#8b5a45] block font-candy font-bold">Packaging Seal</span>
                    <div className="text-2xl font-candy font-extrabold text-[#3d1a10]">
                      {currentAnalysis.packagingIntegrityScore}%
                    </div>
                    <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full ${
                          currentAnalysis.packagingIntegrityScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${currentAnalysis.packagingIntegrityScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Detected Defects tags */}
                <div className="space-y-1.5">
                  <span className="text-xs font-candy font-bold text-[#3d1a10] block">Classified Anomalies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAnalysis.detectedDefects.map((def, idx) => (
                      <span 
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          def === 'No Visible Defect'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {def}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Notes */}
                <div className="p-3.5 rounded-2xl bg-[#fff8fa] border-2 border-pink-100 text-xs text-[#4a2215] space-y-1">
                  <span className="font-candy font-bold text-[#3d1a10] block flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-pink-500" />
                    <span>Agronomic Assessment Notes</span>
                  </span>
                  <p className="leading-relaxed text-[#78350f]">{currentAnalysis.notes}</p>
                </div>

                {/* Save Inspection Action */}
                <button
                  onClick={handleSaveToLot}
                  disabled={savedSuccess}
                  className={`candy-btn-gloss w-full py-2.5 rounded-2xl font-candy font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                    savedSuccess 
                      ? 'bg-emerald-500 text-white' 
                      : 'candy-pill-pink text-white'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Saved to Batch Inspection History!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Record Inspection to Batch Dossier</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Inspection Logs Table */}
      <div className="candy-card p-5 space-y-4 bg-white/95 border-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-100 text-purple-700">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-candy font-bold text-sm text-[#3d1a10]">Quality Inspection History Log</h3>
          </div>
          <span className="text-xs text-[#8b5a45] font-bold">{inspections.length} Total Verified Inspections</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-purple-100 text-[#8b5a45] font-candy font-bold">
                <th className="pb-2.5">Thumbnail</th>
                <th className="pb-2.5">Produce & Lot</th>
                <th className="pb-2.5">Timestamp</th>
                <th className="pb-2.5">Freshness & Packaging</th>
                <th className="pb-2.5">Defects</th>
                <th className="pb-2.5 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/80">
              {inspections.map(insp => (
                <tr key={insp.id} className="hover:bg-purple-50/50 transition">
                  <td className="py-2.5 pr-3">
                    <img 
                      src={insp.imageUrl} 
                      alt={insp.productName} 
                      className="w-12 h-12 rounded-xl object-cover border-2 border-purple-200 shadow-xs" 
                    />
                  </td>
                  <td className="py-2.5 pr-3">
                    <div className="font-bold text-[#3d1a10]">{insp.productName}</div>
                    <div className="font-mono text-[10px] text-[#8b5a45]">{insp.batchNumber}</div>
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-[#8b5a45] text-[11px]">
                    {insp.timestamp}
                  </td>
                  <td className="py-2.5 pr-3">
                    <div className="text-[11px]">Freshness: <b className="text-pink-600 font-mono">{insp.visualFreshnessScore}%</b></div>
                    <div className="text-[10px] text-[#8b5a45]">Seal: {insp.packagingIntegrityScore}%</div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="text-[11px] text-[#78350f]">{insp.detectedDefects.join(', ')}</span>
                  </td>
                  <td className="py-2.5 text-right font-medium">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      insp.verdict === 'Pass' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : insp.verdict === 'Downgrade Grade B'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {insp.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

