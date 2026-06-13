"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  LogOut, 
  Users, 
  Calendar,
  X,
  Loader2,
  Bell,
    Check,
    RotateCcw,
  Ticket,
  MessageSquare,
  Star,
  CheckSquare, 
  Square,
  Eye,
  EyeOff
} from "lucide-react";

import { toast } from "sonner";
  import { 
    getAllCohorts, 
    getAllEnrollments, 
    getPaidEnrollments,
    createCohort, 
    updateCohort, 
    deleteCohort,
    resetCohortSpots,
    deleteEnrollment,
    deletePaidEnrollment,
    bulkDeleteEnrollments,
    getAllWaitlist,
    markWaitlistContacted,
    deleteWaitlistEntry,
    markEnrollmentPaid,
    getAllPromoCodes,
    createPromoCode,
    deletePromoCode,
    togglePromoCodeStatus,
    toggleAttendance,
    deleteFeedback
  } from "../actions";

import { Certificate } from "@/components/certificate";
import { Download } from "lucide-react";


interface Cohort {
  id: string;
  name: string;
  dates: string;
  time: string;
  original_price: number;
  sale_price: number | null;
  sale_tag: string | null;
  total_spots: number;
  spots_taken: number;
  description: string;
  is_active: boolean;
  delivery_type: string;
  created_at: string;
}

interface Enrollment {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  profession: string;
  joining_type: string;
  promo_code: string | null;
  price_paid: string;
  status: string | null;
  attended?: boolean;
  completion_date?: string;
  created_at: string;
  cohorts: { name: string } | null;
}

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  contacted: boolean;
  created_at: string;
  cohorts: { name: string } | null;
}

interface PromoCode {
  id: string;
  code: string;
  discount_amount: number;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cohorts" | "enrollments" | "waitlist" | "promocodes" | "attendance" | "feedback">("cohorts");
  const [cohortFilter, setCohortFilter] = useState<"active" | "full" | "inactive">("active");
  const [enrollmentFilter, setEnrollmentFilter] = useState<"pending" | "paid">("pending");
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<Enrollment[]>([]);
  const [paidEnrollments, setPaidEnrollments] = useState<Enrollment[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [saving, setSaving] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [individualDates, setIndividualDates] = useState<Record<string, string>>({});

    const [cohortForm, setCohortForm] = useState({
      name: "",
      dates: "",
      time: "",
      original_price: "",
      sale_price: "",
      sale_tag: "",
      total_spots: "20",
      description: "",
      is_active: true,
      delivery_type: "both",
    });

    const [promoForm, setPromoForm] = useState({
      code: "",
      discount_amount: "",
      usage_limit: "",
    });

    useEffect(() => {
    let interval: any;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData();
      }, 10000); // Refresh every 10 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated");

    if (!isAuthenticated) {
      router.push("/admin");
      return;
    }
    loadData();
  }, [router]);

  async function loadData() {
    try {
      setLoading(true);
      const [cohortsResult, pendingResult, paidResult, waitlistResult, promoResult, feedbackResult] = await Promise.all([
        getAllCohorts(),
        getAllEnrollments(),
        getPaidEnrollments(),
        getAllWaitlist(),
        getAllPromoCodes(),
        fetch("/api/feedback").then(res => res.ok ? res.json() : []).catch(() => [])
      ]);
      
      if (cohortsResult.data) setCohorts(cohortsResult.data);
      if (pendingResult.data) setPendingEnrollments(pendingResult.data);
      if (paidResult.data) setPaidEnrollments(paidResult.data);
      if (waitlistResult.data) setWaitlist(waitlistResult.data);
      if (promoResult.data) setPromoCodes(promoResult.data);
      if (Array.isArray(feedbackResult)) setFeedbacks(feedbackResult);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    router.push("/admin");
  };

  const openAddCohort = () => {
    setCohortForm({
      name: "",
      dates: "",
      time: "",
      original_price: "",
      sale_price: "",
      sale_tag: "",
      total_spots: "20",
      description: "",
      is_active: true,
      delivery_type: "both",
    });
    setEditingCohort(null);
    setShowCohortModal(true);
  };

  const openEditCohort = (cohort: Cohort) => {
    setCohortForm({
      name: cohort.name,
      dates: cohort.dates,
      time: cohort.time,
      original_price: cohort.original_price.toString(),
      sale_price: cohort.sale_price?.toString() || "",
      sale_tag: cohort.sale_tag || "",
      total_spots: cohort.total_spots.toString(),
      description: cohort.description,
      is_active: cohort.is_active,
      delivery_type: cohort.delivery_type || "both",
    });
    setEditingCohort(cohort);
    setShowCohortModal(true);
  };

  const handleSaveCohort = async () => {
    setSaving(true);
    const data = {
      name: cohortForm.name,
      dates: cohortForm.dates,
      time: cohortForm.time,
      original_price: parseInt(cohortForm.original_price),
      sale_price: cohortForm.sale_price ? parseInt(cohortForm.sale_price) : null,
      sale_tag: cohortForm.sale_tag || null,
      total_spots: parseInt(cohortForm.total_spots),
      description: cohortForm.description,
      is_active: cohortForm.is_active,
      delivery_type: cohortForm.delivery_type,
    };

    if (editingCohort) {
      const result = await updateCohort(editingCohort.id, data);
      if (result.success) {
        toast.success("Cohort updated!");
      } else {
        toast.error(result.error);
      }
    } else {
      const result = await createCohort(data);
      if (result.success) {
        toast.success("Cohort created!");
      } else {
        toast.error(result.error);
      }
    }
    
    setSaving(false);
    setShowCohortModal(false);
    loadData();
  };

  const openAddPromo = () => {
    setPromoForm({
      code: "",
      discount_amount: "",
      usage_limit: "",
    });
    setShowPromoModal(true);
  };

  const handleSavePromo = async () => {
    if (!promoForm.code || !promoForm.discount_amount) {
      toast.error("Code and discount amount are required");
      return;
    }

    setSaving(true);
    const result = await createPromoCode({
      code: promoForm.code.toUpperCase(),
      discount_amount: parseInt(promoForm.discount_amount),
      usage_limit: promoForm.usage_limit ? parseInt(promoForm.usage_limit) : null,
    });

    if (result.success) {
      toast.success("Promo code created!");
      setShowPromoModal(false);
      loadData();
    } else {
      toast.error(result.error);
    }
    setSaving(false);
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    const result = await deletePromoCode(id);
    if (result.success) {
      toast.success("Promo code deleted");
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleTogglePromoActive = async (promo: PromoCode) => {
    const result = await togglePromoCodeStatus(promo.id, !promo.is_active);
    if (result.success) {
      toast.success(`Promo code ${!promo.is_active ? "activated" : "deactivated"}`);
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteCohort = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cohort?")) return;
    const result = await deleteCohort(id);
    if (result.success) {
      toast.success("Cohort deleted!");
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleResetSpots = async (id: string) => {
    if (!confirm("Are you sure you want to reset spots? This will delete all paid enrollments for this cohort and reset the count to 0. This cannot be undone.")) return;
    const result = await resetCohortSpots(id);
    if (result.success) {
      toast.success("Spots reset successfully!");
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected enrollments?`)) return;
    
    const result = await bulkDeleteEnrollments(selectedIds, enrollmentFilter);
    if (result.success) {
      toast.success(`${selectedIds.length} enrollments deleted!`);
      setSelectedIds([]);
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredEnrollments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEnrollments.map(e => e.id));
    }
  };

  const handleDeleteEnrollment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enrollment?")) return;
    const result = enrollmentFilter === "pending" ? await deleteEnrollment(id) : await deletePaidEnrollment(id);
    if (result.success) {
      toast.success("Enrollment deleted!");
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    if (!confirm("Mark this enrollment as paid? This will send a confirmation email.")) return;
    const result = await markEnrollmentPaid(id);
    if (result.success) {
      toast.success("Marked as paid and email sent!");
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleContacted = async (entry: WaitlistEntry) => {
    const result = await markWaitlistContacted(entry.id, !entry.contacted);
    if (result.success) {
      toast.success(entry.contacted ? "Marked as not contacted" : "Marked as contacted!");
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteWaitlist = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    const result = await deleteWaitlistEntry(id);
    if (result.success) {
      toast.success("Waitlist entry deleted!");
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleAttendance = async (enrollment: Enrollment) => {
    const dateToUse = individualDates[enrollment.id] || enrollment.completion_date;

    if (!enrollment.attended && !dateToUse) {
      toast.error("Please enter a completion date first");
      return;
    }

    const result = await toggleAttendance(enrollment.id, !enrollment.attended, dateToUse);
    if (result.success) {
      toast.success(`${enrollment.name} marked as ${!enrollment.attended ? "attended" : "not attended"}`);
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const toggleCohortActive = async (cohort: Cohort) => {
    const result = await updateCohort(cohort.id, { is_active: !cohort.is_active });
    if (result.success) {
      toast.success(`Cohort ${!cohort.is_active ? "activated" : "deactivated"}!`);
      loadData();
    }
  };

  const reactivateCohort = async (cohort: Cohort, addSpots: number = 0) => {
    const newTotalSpots = addSpots > 0 ? cohort.total_spots + addSpots : cohort.total_spots;
    const result = await updateCohort(cohort.id, { 
      is_active: true,
      total_spots: newTotalSpots
    });
    if (result.success) {
      toast.success(`Cohort reactivated${addSpots > 0 ? ` with ${addSpots} more spots` : ""}!`);
      loadData();
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    const result = await deleteFeedback(id);
    if (result.success) {
      toast.success("Feedback deleted!");
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const totalRevenue = paidEnrollments.reduce((acc, curr) => acc + parseInt(curr.price_paid), 0);

  const activeCohorts = cohorts.filter(c => c.is_active && c.spots_taken < c.total_spots);
  const fullCohorts = cohorts.filter(c => c.spots_taken >= c.total_spots);
  const inactiveCohorts = cohorts.filter(c => !c.is_active && c.spots_taken < c.total_spots);

  const filteredCohorts = cohortFilter === "active" ? activeCohorts 
    : cohortFilter === "full" ? fullCohorts 
    : inactiveCohorts;

  const filteredEnrollments = enrollmentFilter === "pending" ? pendingEnrollments : paidEnrollments;

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </main>
    );
  }

    return (
      <main className="min-h-screen bg-black text-white">
        <div className="border-b border-white/10">
          <div className="container max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-xl font-bold">CodeKar Admin</h1>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Auto Refresh:</span>
                  <button 
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`w-8 h-4 rounded-full transition-colors relative ${autoRefresh ? "bg-green-500" : "bg-white/20"}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${autoRefresh ? "left-4.5" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg w-full sm:w-auto">

                <span className="text-[10px] sm:text-xs text-white/40 uppercase font-bold tracking-wider">Revenue:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-green-400 text-sm sm:text-base">
                    {showRevenue ? `PKR ${totalRevenue.toLocaleString()}` : "PKR ••••••••"}
                  </span>
                  <button 
                    onClick={() => setShowRevenue(!showRevenue)}
                    className="text-white/40 hover:text-white transition-colors p-1"
                  >
                    {showRevenue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 w-full sm:w-auto"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            <Button
              variant={activeTab === "cohorts" ? "default" : "outline"}
              className={activeTab === "cohorts" ? "bg-white text-black shrink-0 h-9 sm:h-10 text-xs sm:text-sm" : "border-white/20 text-white hover:bg-white/10 shrink-0 h-9 sm:h-10 text-xs sm:text-sm"}
              onClick={() => setActiveTab("cohorts")}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Cohorts ({cohorts.length})
            </Button>
            <Button
              variant={activeTab === "enrollments" ? "default" : "outline"}
              className={activeTab === "enrollments" ? "bg-white text-black shrink-0 h-9 sm:h-10 text-xs sm:text-sm" : "border-white/20 text-white hover:bg-white/10 shrink-0 h-9 sm:h-10 text-xs sm:text-sm"}
              onClick={() => setActiveTab("enrollments")}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Enrollments ({pendingEnrollments.length + paidEnrollments.length})
            </Button>
            <Button
              variant={activeTab === "waitlist" ? "default" : "outline"}
              className={activeTab === "waitlist" ? "bg-orange-500 text-white shrink-0 h-9 sm:h-10 text-xs sm:text-sm" : "border-white/20 text-white hover:bg-white/10 shrink-0 h-9 sm:h-10 text-xs sm:text-sm"}
              onClick={() => setActiveTab("waitlist")}
            >
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Waitlist ({waitlist.length})
            </Button>
            <Button
              variant={activeTab === "promocodes" ? "default" : "outline"}
              className={activeTab === "promocodes" ? "bg-blue-500 text-white shrink-0 h-9 sm:h-10 text-xs sm:text-sm" : "border-white/20 text-white hover:bg-white/10 shrink-0 h-9 sm:h-10 text-xs sm:text-sm"}
              onClick={() => setActiveTab("promocodes")}
            >
              <Ticket className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Promo ({promoCodes.length})
            </Button>
            <Button
              variant={activeTab === "attendance" ? "default" : "outline"}
              className={activeTab === "attendance" ? "bg-purple-600 text-white shrink-0 h-9 sm:h-10 text-xs sm:text-sm" : "border-white/20 text-white hover:bg-white/10 shrink-0 h-9 sm:h-10 text-xs sm:text-sm"}
              onClick={() => setActiveTab("attendance")}
            >
              <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Attendance ({paidEnrollments.length})
            </Button>
            <Button
              variant={activeTab === "feedback" ? "default" : "outline"}
              className={activeTab === "feedback" ? "bg-green-500 text-white shrink-0 h-9 sm:h-10 text-xs sm:text-sm" : "border-white/20 text-white hover:bg-white/10 shrink-0 h-9 sm:h-10 text-xs sm:text-sm"}
              onClick={() => setActiveTab("feedback")}
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Feedback ({feedbacks.length})
            </Button>
          </div>

          {activeTab === "cohorts" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">Manage Cohorts</h2>
                <Button className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto" onClick={openAddCohort}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Cohort
                </Button>
              </div>

              <div className="flex gap-1 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide">
                <Button
                  variant={cohortFilter === "active" ? "default" : "ghost"}
                  size="sm"
                  className={cohortFilter === "active" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 shrink-0" : "text-white/60 hover:text-white hover:bg-white/10 shrink-0"}
                  onClick={() => setCohortFilter("active")}
                >
                  Active ({activeCohorts.length})
                </Button>
                <Button
                  variant={cohortFilter === "full" ? "default" : "ghost"}
                  size="sm"
                  className={cohortFilter === "full" ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 shrink-0" : "text-white/60 hover:text-white hover:bg-white/10 shrink-0"}
                  onClick={() => setCohortFilter("full")}
                >
                  Full ({fullCohorts.length})
                </Button>
                <Button
                  variant={cohortFilter === "inactive" ? "default" : "ghost"}
                  size="sm"
                  className={cohortFilter === "inactive" ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 shrink-0" : "text-white/60 hover:text-white hover:bg-white/10 shrink-0"}
                  onClick={() => setCohortFilter("inactive")}
                >
                  Inactive ({inactiveCohorts.length})
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredCohorts.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    No {cohortFilter} cohorts found
                  </div>
                ) : (
                  filteredCohorts.map((cohort) => {
                    const isFull = cohort.spots_taken >= cohort.total_spots;
                    return (
                      <Card key={cohort.id} className="bg-[#111] border-white/10 p-4 sm:p-6 rounded-xl">
                        <div className="flex flex-col gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold">{cohort.name}</h3>
                              <div className="flex gap-1.5">
                                {isFull ? (
                                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                                    FULL
                                  </span>
                                ) : (
                                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cohort.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                    {cohort.is_active ? "ACTIVE" : "INACTIVE"}
                                  </span>
                                )}
                                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 uppercase">
                                  {cohort.delivery_type || "BOTH"}
                                </span>
                              </div>
                            </div>
                            <p className="text-white/60 text-xs sm:text-sm">{cohort.dates} • {cohort.time}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
                              <span className="text-white/60">
                                Price: <span className="text-white font-medium">PKR {cohort.original_price.toLocaleString()}</span>
                                {cohort.sale_price && (
                                  <span className="text-green-400 ml-2">→ PKR {cohort.sale_price.toLocaleString()}</span>
                                )}
                              </span>
                              <span className="text-white/60">
                                Spots: <span className={`font-medium ${isFull ? "text-orange-400" : "text-white"}`}>{cohort.spots_taken}/{cohort.total_spots}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-white/5 sm:border-0 sm:pt-0">
                            {isFull ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 sm:flex-none border-green-500/50 text-green-400 hover:bg-green-500/10 text-xs h-8"
                                onClick={() => {
                                  const spots = prompt("How many additional spots to add?", "5");
                                  if (spots && !isNaN(parseInt(spots))) {
                                    reactivateCohort(cohort, parseInt(spots));
                                  }
                                }}
                              >
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Add Spots
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 sm:flex-none border-white/20 text-white hover:bg-white/10 text-xs h-8"
                                onClick={() => toggleCohortActive(cohort)}
                              >
                                {cohort.is_active ? "Deactivate" : "Activate"}
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10 h-8 w-8 p-0"
                              onClick={() => openEditCohort(cohort)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 h-8 w-8 p-0"
                              onClick={() => handleResetSpots(cohort.id)}
                              title="Reset Spots"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                              onClick={() => handleDeleteCohort(cohort.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === "enrollments" && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold">Enrollments</h2>
              
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    <Button
                      variant={enrollmentFilter === "pending" ? "default" : "ghost"}
                      size="sm"
                      className={enrollmentFilter === "pending" ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" : "text-white/60 hover:text-white hover:bg-white/10"}
                      onClick={() => { setEnrollmentFilter("pending"); setSelectedIds([]); }}
                    >
                      Pending ({pendingEnrollments.length})
                    </Button>
                    <Button
                      variant={enrollmentFilter === "paid" ? "default" : "ghost"}
                      size="sm"
                      className={enrollmentFilter === "paid" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "text-white/60 hover:text-white hover:bg-white/10"}
                      onClick={() => { setEnrollmentFilter("paid"); setSelectedIds([]); }}
                    >
                      Paid ({paidEnrollments.length})
                    </Button>
                  </div>

                  {selectedIds.length > 0 && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full sm:w-auto bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected ({selectedIds.length})
                    </Button>
                  )}
                </div>


              {/* Mobile Card View */}
              <div className="grid gap-4 sm:hidden">
                {filteredEnrollments.length === 0 ? (
                  <div className="text-center py-12 text-white/40">No {enrollmentFilter} enrollments</div>
                ) : (
                    filteredEnrollments.map((enrollment) => (
                      <Card key={enrollment.id} className={`bg-[#111] border-white/10 p-4 rounded-xl space-y-3 transition-colors ${selectedIds.includes(enrollment.id) ? "border-white/40 bg-white/5" : ""}`}>
                        <div className="flex justify-between items-start gap-3">
                          <button 
                            onClick={() => toggleSelect(enrollment.id)}
                            className={`shrink-0 mt-1 p-0.5 rounded border transition-colors ${selectedIds.includes(enrollment.id) ? "bg-white border-white text-black" : "border-white/20 text-transparent"}`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <div className="flex-1">
                            <h3 className="font-bold text-white leading-tight">{enrollment.name}</h3>
                            <p className="text-[10px] text-white/40">{enrollment.email}</p>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 whitespace-nowrap">
                            {new Date(enrollment.created_at).toLocaleDateString()}
                          </span>
                        </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-white/20 uppercase font-bold text-[9px]">Phone</p>
                          <p className="text-white/60">{enrollment.phone}</p>
                        </div>
                        <div>
                          <p className="text-white/20 uppercase font-bold text-[9px]">Cohort</p>
                          <p className="text-white/60 truncate">{enrollment.cohorts?.name || "—"}</p>
                        </div>
                        <div>
                          <p className="text-white/20 uppercase font-bold text-[9px]">Price Paid</p>
                          <p className="text-green-400 font-bold">PKR {parseInt(enrollment.price_paid).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        {enrollmentFilter === "pending" && (
                          <Button 
                            className="flex-1 bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 h-9"
                            onClick={() => handleMarkAsPaid(enrollment.id)}
                          >
                            <Check className="w-4 h-4 mr-2" /> Mark Paid
                          </Button>
                        )}
                        <Button 
                          variant="outline"
                          className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10 h-9"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-left w-10">
                        <button 
                          onClick={selectAll}
                          className={`p-0.5 rounded border transition-colors ${selectedIds.length === filteredEnrollments.length && filteredEnrollments.length > 0 ? "bg-white border-white text-black" : "border-white/20 text-transparent hover:border-white/40"}`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Phone</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Cohort</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Price</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${selectedIds.includes(enrollment.id) ? "bg-white/5" : ""}`}>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => toggleSelect(enrollment.id)}
                            className={`p-0.5 rounded border transition-colors ${selectedIds.includes(enrollment.id) ? "bg-white border-white text-black" : "border-white/20 text-transparent hover:border-white/40"}`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </td>
                        <td className="py-3 px-4">{enrollment.name}</td>
                        <td className="py-3 px-4 text-white/60">{enrollment.email}</td>
                        <td className="py-3 px-4 text-white/60">{enrollment.phone}</td>
                        <td className="py-3 px-4 text-white/60">{enrollment.cohorts?.name || "—"}</td>
                        <td className="py-3 px-4">PKR {parseInt(enrollment.price_paid).toLocaleString()}</td>
                        <td className="py-3 px-4 text-white/60">
                          {new Date(enrollment.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {enrollmentFilter === "pending" && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-green-400 hover:bg-green-500/10"
                                onClick={() => handleMarkAsPaid(enrollment.id)}
                                title="Mark as Paid"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeleteEnrollment(enrollment.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "waitlist" && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold">Waitlist Leads</h2>
              
              {/* Mobile Card View */}
              <div className="grid gap-4 sm:hidden">
                {waitlist.length === 0 ? (
                  <div className="text-center py-12 text-white/40">No waitlist entries yet</div>
                ) : (
                  waitlist.map((entry) => (
                    <Card key={entry.id} className="bg-[#111] border-white/10 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-white">{entry.name}</h3>
                          <p className="text-xs text-white/40">{entry.email}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${entry.contacted ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
                          {entry.contacted ? "CONTACTED" : "PENDING"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-white/20 uppercase font-bold text-[9px]">Phone</p>
                          <p className="text-white/60">{entry.phone}</p>
                        </div>
                        <div>
                          <p className="text-white/20 uppercase font-bold text-[9px]">Interested Cohort</p>
                          <p className="text-white/60 truncate">{entry.cohorts?.name || "—"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <Button 
                          className={`flex-1 ${entry.contacted ? "bg-white/5 text-white/40" : "bg-green-500/10 text-green-400"} h-9 text-xs`}
                          onClick={() => handleToggleContacted(entry)}
                        >
                          <Check className="w-4 h-4 mr-2" /> {entry.contacted ? "Undo Contact" : "Mark Contacted"}
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-9 w-10 p-0"
                          onClick={() => handleDeleteWaitlist(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Phone</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Interested Cohort</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlist.map((entry) => (
                      <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">{entry.name}</td>
                        <td className="py-3 px-4 text-white/60">{entry.email}</td>
                        <td className="py-3 px-4 text-white/60">{entry.phone}</td>
                        <td className="py-3 px-4 text-white/60">{entry.cohorts?.name || "—"}</td>
                        <td className="py-3 px-4 text-white/60">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${entry.contacted ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
                            {entry.contacted ? "CONTACTED" : "PENDING"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={entry.contacted ? "text-white/40 hover:bg-white/10" : "text-green-400 hover:bg-green-500/10"}
                              onClick={() => handleToggleContacted(entry)}
                              title={entry.contacted ? "Mark as not contacted" : "Mark as contacted"}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeleteWaitlist(entry.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "promocodes" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">Manage Promo Codes</h2>
                <Button className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto" onClick={openAddPromo}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Promo Code
                </Button>
              </div>

              {/* Mobile Card View */}
              <div className="grid gap-4 sm:hidden">
                {promoCodes.length === 0 ? (
                  <div className="text-center py-12 text-white/40">No promo codes created yet</div>
                ) : (
                  promoCodes.map((promo) => (
                    <Card key={promo.id} className="bg-[#111] border-white/10 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-blue-400 text-lg uppercase tracking-wider">{promo.code}</h3>
                          <p className="text-green-400 font-bold">-PKR {promo.discount_amount.toLocaleString()}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${promo.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {promo.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                      <div className="flex gap-6 text-xs text-white/60">
                        <div>Usage: <span className="text-white font-bold">{promo.usage_count}</span></div>
                        <div>Limit: <span className="text-white font-bold">{promo.usage_limit || "Unlimited"}</span></div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <Button 
                          className={`flex-1 ${promo.is_active ? "bg-white/5 text-white/40" : "bg-green-500/10 text-green-400"} h-9 text-xs`}
                          onClick={() => handleTogglePromoActive(promo)}
                        >
                          <Check className="w-4 h-4 mr-2" /> {promo.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-9 w-10 p-0"
                          onClick={() => handleDeletePromo(promo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Code</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Discount</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Usage</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Limit</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoCodes.map((promo) => (
                      <tr key={promo.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-blue-400">{promo.code}</td>
                        <td className="py-3 px-4 text-green-400">-PKR {promo.discount_amount.toLocaleString()}</td>
                        <td className="py-3 px-4">{promo.usage_count}</td>
                        <td className="py-3 px-4 text-white/60">{promo.usage_limit || "Unlimited"}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${promo.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {promo.is_active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={promo.is_active ? "text-white/40 hover:bg-white/10" : "text-green-400 hover:bg-green-500/10"}
                              onClick={() => handleTogglePromoActive(promo)}
                              title={promo.is_active ? "Deactivate" : "Activate"}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeletePromo(promo.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

            {activeTab === "attendance" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Attendance & Certification</h2>
                  {selectedIds.length > 0 && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full sm:w-auto bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected ({selectedIds.length})
                    </Button>
                  )}
                </div>

              {/* Mobile Card View */}
              <div className="grid gap-4 sm:hidden">
                {paidEnrollments.length === 0 ? (
                  <div className="text-center py-12 text-white/40">No paid students found</div>
                ) : (
                  paidEnrollments.map((enrollment) => (
                    <Card key={enrollment.id} className={`bg-[#111] border-white/10 p-4 rounded-xl space-y-4 transition-colors ${selectedIds.includes(enrollment.id) ? "border-white/40 bg-white/5" : ""}`}>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleSelect(enrollment.id)}
                            className={`shrink-0 p-0.5 rounded border transition-colors ${selectedIds.includes(enrollment.id) ? "bg-white border-white text-black" : "border-white/20 text-transparent"}`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleToggleAttendance(enrollment)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              enrollment.attended 
                                ? "bg-green-500/10 border-green-500/20 text-green-500" 
                                : "bg-white/5 border-white/10 text-white/20"
                            }`}
                          >
                            {enrollment.attended ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                          <div>
                            <h3 className="font-bold text-white text-sm">{enrollment.name}</h3>
                            <p className="text-[10px] text-white/40 truncate max-w-[150px]">{enrollment.cohorts?.name || "—"}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500/40 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => { setEnrollmentFilter("paid"); handleDeleteEnrollment(enrollment.id); }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Completion Date</Label>
                        <Input 
                          placeholder="January 1, 2026"
                          value={individualDates[enrollment.id] || enrollment.completion_date || ""}
                          onChange={(e) => setIndividualDates({ ...individualDates, [enrollment.id]: e.target.value })}
                          className="bg-black border-white/10 text-xs h-8"
                        />
                      </div>

                      {enrollment.attended ? (
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1 text-[9px] text-green-400 font-bold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            PRESENT
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 h-9"
                            onClick={() => {
                              const params = new URLSearchParams({
                                name: enrollment.name,
                                email: enrollment.email || "",
                                enrollmentId: enrollment.id,
                                cohortName: enrollment.cohorts?.name || "",
                                date: enrollment.completion_date || ""
                              });
                              window.open(`/admin/certificate?${params.toString()}`, '_blank');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" /> View Certificate
                          </Button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-white/20 italic text-center py-1">Enter date & mark present to issue certificate</p>
                      )}
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-left w-10">
                        <button 
                          onClick={() => {
                            if (selectedIds.length === paidEnrollments.length) setSelectedIds([]);
                            else setSelectedIds(paidEnrollments.map(e => e.id));
                          }}
                          className={`p-0.5 rounded border transition-colors ${selectedIds.length === paidEnrollments.length && paidEnrollments.length > 0 ? "bg-white border-white text-black" : "border-white/20 text-transparent hover:border-white/40"}`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium w-48">Completion Date</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Cohort</th>
                      <th className="text-right py-3 px-4 text-white/60 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${selectedIds.includes(enrollment.id) ? "bg-white/5" : ""}`}>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => toggleSelect(enrollment.id)}
                            className={`p-0.5 rounded border transition-colors ${selectedIds.includes(enrollment.id) ? "bg-white border-white text-black" : "border-white/20 text-transparent hover:border-white/40"}`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleAttendance(enrollment)}
                            className={`p-1 rounded transition-colors ${
                              enrollment.attended 
                                ? "text-green-500 hover:bg-green-500/10" 
                                : "text-white/20 hover:text-white/40 hover:bg-white/10"
                            }`}
                          >
                            {enrollment.attended ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                        </td>
                        <td className="py-3 px-4 font-medium">{enrollment.name}</td>
                        <td className="py-3 px-4">
                          <Input 
                            placeholder="January 1, 2026"
                            value={individualDates[enrollment.id] || enrollment.completion_date || ""}
                            onChange={(e) => setIndividualDates({ ...individualDates, [enrollment.id]: e.target.value })}
                            className="bg-black border-white/10 text-xs h-8 w-40"
                          />
                        </td>
                        <td className="py-3 px-4 text-white/60">{enrollment.cohorts?.name || "—"}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                              {enrollment.attended ? (
                                <div className="relative inline-block">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8"
                                    onClick={() => {
                                      const params = new URLSearchParams({
                                        name: enrollment.name,
                                        email: enrollment.email || "",
                                        enrollmentId: enrollment.id,
                                        cohortName: enrollment.cohorts?.name || "",
                                        date: enrollment.completion_date || ""
                                      });
                                      window.open(`/admin/certificate?${params.toString()}`, '_blank');
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2" /> View Certificate
                                  </Button>
                                </div>
                              ) : (
                              <span className="text-[10px] text-white/20 italic">Set date & mark attended</span>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                              onClick={() => { setEnrollmentFilter("paid"); handleDeleteEnrollment(enrollment.id); }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Feedback Insights</h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Total Responses:</span>
                    <span className="text-sm font-mono font-bold text-white">{feedbacks.length}</span>
                  </div>
                </div>

                <div className="grid gap-6">
                  {feedbacks.length === 0 ? (
                    <div className="text-center py-12 text-white/40 border border-white/5 rounded-xl">No feedback received yet</div>
                  ) : (
                    feedbacks.map((fb) => (
                      <Card key={fb.id} className="bg-[#0A0A0A] border-white/10 overflow-hidden rounded-2xl group transition-all hover:border-white/20">
                        {/* Header: Student Info & Overall Rating */}
                        <div className="bg-white/[0.02] border-b border-white/5 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center text-lg font-bold text-white/40 border border-white/10">
                              {fb.student_name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-white">{fb.student_name}</h3>
                              <p className="text-xs text-white/40">{fb.student_email}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Overall</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star 
                                    key={s} 
                                    className={`w-3 h-3 sm:w-4 sm:h-4 ${s <= fb.rating ? "text-yellow-400 fill-yellow-400" : "text-white/10"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10 h-7 text-[10px] px-2 uppercase font-bold tracking-wider"
                              onClick={() => handleDeleteFeedback(fb.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete Record
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-8">
                          {/* Grid for Quick Stats */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider">Experience Level</p>
                              <p className="text-sm text-white/80">{fb.experience_level || "Not specified"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider">Built Website?</p>
                              <p className={`text-sm font-medium ${fb.built_website === 'Yes' ? 'text-green-400' : 'text-orange-400'}`}>
                                {fb.built_website || "Not specified"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider">Recommend?</p>
                              <p className={`text-sm font-medium ${fb.recommend === 'Yes' ? 'text-green-400' : 'text-white/60'}`}>
                                {fb.recommend || "Not specified"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider">Testimonial?</p>
                              <div className="flex items-center gap-1.5">
                                {fb.testimonial_permission ? (
                                  <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-xs text-green-400 font-medium">Granted</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                    <span className="text-xs text-white/20">Denied</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Ratings Breakdown */}
                          <div className="space-y-4">
                            <h4 className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Detailed Ratings</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              {[
                                { label: "Instruction", val: fb.instruction_rating },
                                { label: "AI Tools", val: fb.ai_tools_rating },
                                { label: "Pace", val: fb.pace_rating },
                                { label: "Hands-on", val: fb.hands_on_rating }
                              ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-white/40">{item.label}</span>
                                    <span className="text-white/80 font-mono">{item.val || 0}/5</span>
                                  </div>
                                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-white/40 rounded-full transition-all" 
                                      style={{ width: `${(item.val || 0) * 20}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Written Feedback */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-3">
                              <h4 className="text-[10px] text-green-400/60 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <Check className="w-3 h-3" /> Liked Most
                              </h4>
                              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl min-h-[80px]">
                                <p className="text-sm text-white/80 leading-relaxed italic">
                                  {fb.liked_most ? `"${fb.liked_most}"` : "No specific mention."}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-[10px] text-orange-400/60 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <Plus className="w-3 h-3 rotate-45" /> To Improve
                              </h4>
                              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl min-h-[80px]">
                                <p className="text-sm text-white/80 leading-relaxed italic">
                                  {fb.to_improve ? `"${fb.to_improve}"` : "No suggestions provided."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* General Comment if any */}
                          {fb.comment && (
                            <div className="pt-4 space-y-3">
                              <h4 className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Additional Comments</h4>
                              <p className="text-sm text-white/60 leading-relaxed bg-white/[0.01] p-4 rounded-xl border border-dashed border-white/5">
                                {fb.comment}
                              </p>
                            </div>
                          )}

                          <div className="pt-4 flex justify-between items-center text-[10px] text-white/10 font-bold uppercase tracking-widest">
                            <span>Record ID: {fb.id.slice(0, 8)}</span>
                            <span>Received {new Date(fb.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
              <Card className="bg-[#0A0A0A] border-white/5 p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white/80">Version Details</h3>
                    <p className="text-[10px] text-white/40 font-mono">Build v2.4.0-stable • Production Environment</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[9px] text-green-400 font-bold uppercase tracking-widest">
                      Database Online
                    </div>
                    <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-bold uppercase tracking-widest">
                      SSL Secure
                    </div>
                  </div>
                </div>
              </Card>
              
              <footer className="text-center pb-8">
                <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.2em]">
                  © 2025 CodeKar • made with love by jibran jalali
                </p>
              </footer>
            </div>
          </div>


        {showCohortModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="bg-[#111] border-white/10 p-5 sm:p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold">{editingCohort ? "Edit Cohort" : "Add New Cohort"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCohortModal(false)} className="h-8 w-8 p-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80 text-xs">Cohort Name</Label>
                  <Input
                    className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                    value={cohortForm.name}
                    onChange={(e) => setCohortForm({ ...cohortForm, name: e.target.value })}
                    placeholder="e.g. 2-Day Workshop"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">Dates</Label>
                    <Input
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.dates}
                      onChange={(e) => setCohortForm({ ...cohortForm, dates: e.target.value })}
                      placeholder="Jan 11 & 12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">Time</Label>
                    <Input
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.time}
                      onChange={(e) => setCohortForm({ ...cohortForm, time: e.target.value })}
                      placeholder="2:00 PM to 6:00 PM"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">Price (PKR)</Label>
                    <Input
                      type="number"
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.original_price}
                      onChange={(e) => setCohortForm({ ...cohortForm, original_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">Sale Price (PKR)</Label>
                    <Input
                      type="number"
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.sale_price}
                      onChange={(e) => setCohortForm({ ...cohortForm, sale_price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">Sale Tag</Label>
                    <Input
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.sale_tag}
                      onChange={(e) => setCohortForm({ ...cohortForm, sale_tag: e.target.value })}
                      placeholder="NEW YEAR SALE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">Spots</Label>
                    <Input
                      type="number"
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.total_spots}
                      onChange={(e) => setCohortForm({ ...cohortForm, total_spots: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 text-xs">Description</Label>
                  <textarea
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white min-h-[80px] text-sm"
                    value={cohortForm.description}
                    onChange={(e) => setCohortForm({ ...cohortForm, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 text-xs">Delivery</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["both", "online", "inperson"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setCohortForm({ ...cohortForm, delivery_type: type })}
                        className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                          cohortForm.delivery_type === type ? "bg-white text-black border-white" : "bg-[#1a1a1a] text-white/60 border-white/10"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    className={`w-9 h-5 rounded-full transition-colors ${cohortForm.is_active ? "bg-green-500" : "bg-white/20"}`}
                    onClick={() => setCohortForm({ ...cohortForm, is_active: !cohortForm.is_active })}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${cohortForm.is_active ? "translate-x-4.5" : "translate-x-1"}`} />
                  </button>
                  <Label className="text-white/80 text-xs">Publicly Active</Label>
                </div>
                
                <div className="flex gap-3 pt-6">
                  <Button variant="outline" className="flex-1 border-white/20 h-11" onClick={() => setShowCohortModal(false)}>Cancel</Button>
                  <Button className="flex-1 bg-white text-black hover:bg-gray-100 h-11" onClick={handleSaveCohort} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCohort ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {showPromoModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="bg-[#111] border-white/10 p-5 rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">New Promo Code</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPromoModal(false)} className="h-8 w-8 p-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80 text-xs">Promo Code</Label>
                  <Input
                    className="bg-[#1a1a1a] border-white/10 uppercase h-10"
                    value={promoForm.code}
                    onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                    placeholder="OFFER2026"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 text-xs">Discount (PKR)</Label>
                  <Input
                    type="number"
                    className="bg-[#1a1a1a] border-white/10 h-10"
                    value={promoForm.discount_amount}
                    onChange={(e) => setPromoForm({ ...promoForm, discount_amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 text-xs">Limit (Optional)</Label>
                  <Input
                    type="number"
                    className="bg-[#1a1a1a] border-white/10 h-10"
                    value={promoForm.usage_limit}
                    onChange={(e) => setPromoForm({ ...promoForm, usage_limit: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <Button variant="outline" className="flex-1 border-white/20 h-10" onClick={() => setShowPromoModal(false)}>Cancel</Button>
                  <Button className="flex-1 bg-white text-black h-10" onClick={handleSavePromo} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                  </Button>
                </div>
              </div>
            </Card>
            </div>
          )}

          </main>
      );
  }
