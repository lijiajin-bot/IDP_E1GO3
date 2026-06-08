import { useState, useMemo, useEffect } from 'react';
import { Clock, ShieldCheck, UserX, UserCheck, CheckCircle, FileText, Camera, UploadCloud, Ban, Undo2, Table, AlertTriangle, PackageCheck } from 'lucide-react';
import { useAppState } from '../context';
import type { UserRole } from '../auth';

interface ApplicationStatusProps {
  userRole: UserRole;
  currentUserEmail?: string;
}

export default function ApplicationStatus({ userRole, currentUserEmail = "" }: ApplicationStatusProps) {
  // Pulling the raw master applicationQueue from our multi-window sync context
  const { 
    applicationQueue,
    approveApplication, 
    rejectApplication, 
    blacklistedEmails, 
    toggleBlacklistUser,
    submitReturnRequest,
    approveReturnRequest
  } = useAppState();

  const [checkEmail, setCheckEmail] = useState('');
  const [checkerResult, setCheckerResult] = useState<{ searched: boolean; status: 'CLEAR' | 'BLACKLISTED' | null }>({
    searched: false,
    status: null,
  });

  const [activeReturnAppId, setActiveReturnAppId] = useState<string | null>(null);
  const [returnForm, setReturnForm] = useState({
    dateReturned: new Date().toISOString().split('T')[0],
    overseeingStaff: '',
    equipmentImage: '',
  });
  const [returnError, setReturnError] = useState('');

  // ===================================================================
  // REAL-TIME WINDOW TICKER (Forces the page to update instantly on data changes)
  // ===================================================================
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const triggerSyncUpdate = () => forceUpdate({});
    
    // Listen for storage changes from sibling browser tabs (Naqiyah vs Farhana vs Razali)
    window.addEventListener('storage', triggerSyncUpdate);
    
    // Safety polling fallback loop every 500ms to catch instant clicks without lagging
    const pollingInterval = setInterval(triggerSyncUpdate, 500);
    
    return () => {
      window.removeEventListener('storage', triggerSyncUpdate);
      clearInterval(pollingInterval);
    };
  }, []);

  // ===================================================================
  // REACTIVE 3-STAGE RE-COMPUTE ENGINE (Filters lists straight from raw storage live)
  // ===================================================================
  const incomingVerificationQueue = useMemo(() => {
    return applicationQueue.filter((app) => app.stage === 'PENDING');
  }, [applicationQueue]);

  const processedApplicationsLog = useMemo(() => {
    return applicationQueue.filter((app) => app.stage === 'ACTIVE_BORROW');
  }, [applicationQueue]);

  const historicalLedger = useMemo(() => {
    return applicationQueue.filter((app) => app.stage === 'HISTORICAL');
  }, [applicationQueue]);

  // Handle role-based scope visualization (Staff sees all, students see only their own)
  const displayedQueue = useMemo(() => {
    if (userRole === 'staff') return incomingVerificationQueue;
    return incomingVerificationQueue.filter(
      (app) => app.formData?.emailAddress?.toLowerCase().trim() === currentUserEmail.toLowerCase().trim()
    );
  }, [incomingVerificationQueue, userRole, currentUserEmail]);

  const displayedLog = useMemo(() => {
    if (userRole === 'staff') return processedApplicationsLog;
    return processedApplicationsLog.filter(
      (app) => app.formData?.emailAddress?.toLowerCase().trim() === currentUserEmail.toLowerCase().trim()
    );
  }, [processedApplicationsLog, userRole, currentUserEmail]);

  const displayedLedger = useMemo(() => {
    if (userRole === 'staff') return historicalLedger;
    return historicalLedger.filter(
      (app) => app.formData?.emailAddress?.toLowerCase().trim() === currentUserEmail.toLowerCase().trim()
    );
  }, [historicalLedger, userRole, currentUserEmail]);

  const handleCheckEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const target = checkEmail.toLowerCase().trim();
    if (!target) return;
    const isBlack = blacklistedEmails.includes(target);
    setCheckerResult({ searched: true, status: isBlack ? 'BLACKLISTED' : 'CLEAR' });
  };

  const triggerReturnWorkflow = (appId: string) => {
    setActiveReturnAppId(appId);
    setReturnError('');
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnForm.overseeingStaff.trim()) {
      setReturnError('Please fill in the supervising staff name.');
      return;
    }
    if (!activeReturnAppId) return;
    submitReturnRequest(activeReturnAppId, returnForm);
    setActiveReturnAppId(null);
    setReturnForm({
      dateReturned: new Date().toISOString().split('T')[0],
      overseeingStaff: '',
      equipmentImage: '',
    });
  };

  const handleCapturePhoto = () => {
    const dummyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    setReturnForm(prev => ({ ...prev, equipmentImage: dummyBase64 }));
  };

  return (
    <div className="space-y-4">
      {/* 1. BLACKLIST CHECKER BAR */}
      {userRole === 'staff' && (
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-800">Student Credential Verification Engine</h4>
              <p className="text-[10px] text-gray-400">Instantly query active matrix database status records</p>
            </div>
          </div>
          <form onSubmit={handleCheckEmail} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Enter student email..."
              value={checkEmail}
              onChange={(e) => setCheckEmail(e.target.value)}
              className="px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-utm-maroon w-full sm:w-52"
            />
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              Query
            </button>
          </form>
          {checkerResult.searched && (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${checkerResult.status === 'BLACKLISTED' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
              {checkerResult.status === 'BLACKLISTED' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              Status: {checkerResult.status}
            </div>
          )}
        </div>
      )}

      {/* 2. INCOMING VERIFICATION QUEUE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-utm-maroon" />
            <h3 className="text-xs font-bold text-gray-800">
              {userRole === 'staff' ? 'Incoming Verification Queue' : 'My Pending Verification Requests'}
            </h3>
          </div>
          <span className="bg-utm-maroon/10 text-utm-maroon px-2 py-0.5 rounded-full font-bold text-[10px]">
            {displayedQueue.length} Applications
          </span>
        </div>

        {displayedQueue.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-xs">No pending verification items found.</div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {displayedQueue.map((app) => (
              <div key={app.id} className={`p-3 flex items-center justify-between text-xs transition-colors ${app.isBlacklisted ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{app.formData?.fullName}</span>
                    <span className="text-gray-400">({app.formData?.yearCourse})</span>
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-gray-600 font-bold">{app.equipmentCode}</span>
                    {app.isBlacklisted && <span className="bg-red-600 text-white font-extrabold px-1 text-[8px] rounded uppercase">Flagged / Overdue Lock</span>}
                  </div>
                  <div className="text-[10px] text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>Date: <strong>{app.formData?.dateBorrow}</strong></span>
                    <span>Duration: <strong>{app.formData?.duration}</strong></span>
                    <span>Contact: <strong>{app.formData?.phoneNumber}</strong></span>
                    <span>Email: <strong className="font-mono">{app.formData?.emailAddress}</strong></span>
                  </div>
                </div>

                {userRole === 'staff' && (
                  <div className="flex items-center gap-1.5 ml-4 shrink-0">
                    <button 
                      onClick={() => toggleBlacklistUser(app.formData.emailAddress)} 
                      className={`p-1.5 rounded-lg border transition-colors ${app.isBlacklisted ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' : 'bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                      title="Toggle User Lockout Status"
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => rejectApplication(app.id)} 
                      className="px-2.5 py-1.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors text-[10px]"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => approveApplication(app.id)} 
                      className="px-2.5 py-1.5 bg-utm-maroon hover:bg-utm-maroon-dark text-white rounded-lg font-bold transition-colors text-[10px]"
                    >
                      Approve Borrow
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. ACTIVE BORROWED LOGS */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <h3 className="text-xs font-bold text-gray-800">
              {userRole === 'staff' ? 'Active Handout & Borrow Logs' : 'My Approved Active Handouts'}
            </h3>
          </div>
          <span className="bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
            {displayedLog.length} Live
          </span>
        </div>

        {displayedLog.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-xs">No active laboratory gear items out at this moment.</div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {displayedLog.map((app) => (
              <div key={app.id} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{app.formData?.fullName}</span>
                    <span className="bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">{app.equipmentCode}</span>
                    {app.isReturned && <span className="bg-orange-100 text-orange-700 font-bold px-1.5 text-[9px] rounded-full">Return Verification Pending</span>}
                  </div>
                  <p className="text-[10px] text-gray-400">Approved Frame Handout Timestamp: <span className="font-mono">{app.approvedAt ? new Date(app.approvedAt).toLocaleString() : 'N/A'}</span></p>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {userRole === 'student' && !app.isReturned && (
                    <button 
                      onClick={() => triggerReturnWorkflow(app.id)} 
                      className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-bold transition-colors text-[10px]"
                    >
                      Return Hardware Asset
                    </button>
                  )}
                  {userRole === 'staff' && app.isReturned && (
                    <button 
                      onClick={() => approveReturnRequest(app.id)} 
                      className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors text-[10px] flex items-center gap-1"
                    >
                      <PackageCheck className="w-3.5 h-3.5" /> Verify Asset Return
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. HISTORICAL RECOVERY LEDGER */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-gray-800">Historical Return Ledger</h3>
          </div>
        </div>
        {displayedLedger.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-xs">No records registered in the archival tracker ledger yet.</div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto text-[11px]">
            {displayedLedger.map((app) => (
              <div key={app.id} className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">{app.formData?.fullName} <span className="text-gray-400 text-[10px]">({app.equipmentCode})</span></p>
                  <p className="text-[9px] text-gray-400 font-mono">Returned: {app.returnVerifiedAt ? new Date(app.returnVerifiedAt).toLocaleString() : 'N/A'}</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Archived Safely</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- RETURN SUBMISSION POPUP MODAL FRAME --- */}
      {activeReturnAppId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="p-3 bg-gray-900 text-white flex items-center gap-1.5">
              <Undo2 className="w-4 h-4 text-utm-maroon" />
              <h3 className="text-xs font-bold">UTM FKE Laboratory Clearance Checklist</h3>
            </div>
            <form onSubmit={handleReturnSubmit} className="p-3 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Supervising Staff Witness</label>
                <input
                  type="text"
                  placeholder="e.g. ENCIK RAZALI AHMAD"
                  value={returnForm.overseeingStaff}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, overseeingStaff: e.target.value.toUpperCase() }))}
                  className="w-full px-2 py-1.5 border rounded-lg text-xs font-medium focus:ring-1 focus:ring-utm-maroon uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Hardware Condition Photo Verification</label>
                <div onClick={handleCapturePhoto} className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  {returnForm.equipmentImage ? (
                    <div className="space-y-1">
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">✓ File Loaded Successfully</p>
                      <img src={returnForm.equipmentImage} alt="Preview" className="h-16 mx-auto object-cover rounded border" />
                    </div>
                  ) : (
                    <div className="text-gray-400 space-y-1">
                      <UploadCloud className="w-6 h-6 mx-auto opacity-60" />
                      <p className="text-[10px] font-medium">Click to capture or choose high-res hardware image</p>
                    </div>
                  )}
                </div>
              </div>

              {returnError && <p className="text-[10px] font-bold text-red-500">{returnError}</p>}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setActiveReturnAppId(null)} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg transition-colors text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-utm-maroon hover:bg-utm-maroon-dark text-white font-bold py-2 rounded-lg transition-colors text-[10px]"
                >
                  Submit Return Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}