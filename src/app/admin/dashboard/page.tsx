"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
      EyeOff,
      BookOpen,
      Settings,
      Mail,
      UserPlus,
      Search,
      ChevronLeft,
      ChevronRight,
      Send,
      MapPin,
      Phone
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
    bulkToggleAttendance,
    markCertificateSent,
    bulkMarkCertificatesSent,
    deleteFeedback,
    getNotificationEmails,
    updateNotificationEmails,
    sendBulkMeetingEmails,
    sendBulkLocationEmails
  } from "../actions";

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
  meeting_link?: string;
  whatsapp_group_link?: string;
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
  certificate_id?: string | null;
  certificate_sent?: boolean;
  cohort_id?: string;
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

interface FeedbackEntry {
  id: string;
  student_name?: string;
  student_email?: string;
  rating: number;
  comment?: string | null;
  experience_level?: string | null;
  built_website?: string | null;
  instruction_rating?: number | null;
  ai_tools_rating?: number | null;
  pace_rating?: number | null;
  hands_on_rating?: number | null;
  liked_most?: string | null;
  to_improve?: string | null;
  recommend?: string | null;
  testimonial_permission?: boolean | null;
  created_at: string;
}

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  consent: boolean;
  source: string;
  status: string;
  created_at: string;
}

type AdminTab = "cohorts" | "enrollments" | "waitlist" | "promocodes" | "attendance" | "feedback" | "enrolment" | "settings" | "send-email" | "leads";

const ADMIN_TABS: AdminTab[] = ["cohorts", "enrollments", "waitlist", "promocodes", "attendance", "feedback", "enrolment", "settings", "send-email", "leads"];

  export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AdminTab>("cohorts");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cohortFilter, setCohortFilter] = useState<"active" | "full" | "inactive">("active");
  const [enrollmentFilter, setEnrollmentFilter] = useState<"pending" | "paid">("pending");
  const [attendanceCohortFilter, setAttendanceCohortFilter] = useState<string>("all");
  const [bulkMarkingAttendance, setBulkMarkingAttendance] = useState(false);
  const [bulkSendingCerts, setBulkSendingCerts] = useState(false);
  const [bulkCompletionDate, setBulkCompletionDate] = useState("");
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<Enrollment[]>([]);
  const [paidEnrollments, setPaidEnrollments] = useState<Enrollment[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [saving, setSaving] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [individualDates, setIndividualDates] = useState<Record<string, string>>({});
    const [crmStartDate, setCrmStartDate] = useState<string>("");
    const [crmEndDate, setCrmEndDate] = useState<string>("");
    const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
    const [newEmail, setNewEmail] = useState<string>("");
    const [savingSettings, setSavingSettings] = useState(false);

    // Send Email Tab State
    const [emailTemplate, setEmailTemplate] = useState<"meeting" | "location">("meeting");
    const [selectedEmailCohortId, setSelectedEmailCohortId] = useState<string>("");
    const [selectedEmailStudentIds, setSelectedEmailStudentIds] = useState<string[]>([]);
    const [meetingForm, setMeetingForm] = useState({ meetingLink: "" });
    const [locationForm, setLocationForm] = useState({ locationName: "", locationLink: "" });
    const [sendingEmails, setSendingEmails] = useState(false);

    // Leads Tab State
    const [leadsSubTab, setLeadsSubTab] = useState<"list" | "email">("list");
    const [leadsSearch, setLeadsSearch] = useState("");
    const [leadsSourceFilter, setLeadsSourceFilter] = useState("all");
    const [leadsStatusFilter, setLeadsStatusFilter] = useState("all");
    const [leadsPage, setLeadsPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
    const [leadEmailSubject, setLeadEmailSubject] = useState("");
    const [leadEmailBody, setLeadEmailBody] = useState("");
    const [sendingLeadEmails, setSendingLeadEmails] = useState(false);
    const LEADS_PER_PAGE = 10;

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
      meeting_link: "",
      whatsapp_group_link: "",
    });

    const [promoForm, setPromoForm] = useState({
      code: "",
      discount_amount: "",
      usage_limit: "",
    });

    useEffect(() => {
      const savedTab = localStorage.getItem("admin_active_tab");
      if (ADMIN_TABS.includes(savedTab as AdminTab)) {
        setActiveTab(savedTab as AdminTab);
      }
    }, []);

    const handleTabChange = (tab: AdminTab) => {
      setActiveTab(tab);
      localStorage.setItem("admin_active_tab", tab);
    };

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
      const [cohortsResult, pendingResult, paidResult, waitlistResult, promoResult, feedbackResult, emailsResult, leadsResult] = await Promise.all([
        getAllCohorts(),
        getAllEnrollments(),
        getPaidEnrollments(),
        getAllWaitlist(),
        getAllPromoCodes(),
        fetch("/api/feedback").then(res => res.ok ? res.json() : []).catch(() => []),
        getNotificationEmails(),
        fetch("/api/leads").then(res => res.ok ? res.json() : []).catch(() => [])
      ]);
      
      if (cohortsResult.data) setCohorts(cohortsResult.data);
      if (pendingResult.data) setPendingEnrollments(pendingResult.data);
      if (paidResult.data) setPaidEnrollments(paidResult.data);
      if (waitlistResult.data) setWaitlist(waitlistResult.data);
      if (promoResult.data) setPromoCodes(promoResult.data);
      if (Array.isArray(feedbackResult)) setFeedbacks(feedbackResult);
      if (Array.isArray(leadsResult)) setLeads(leadsResult);
      if (emailsResult.data) {
        const emails = emailsResult.data.split(',').filter((e: string) => e.trim());
        setNotificationEmails(emails);
      }
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
        meeting_link: "",
        whatsapp_group_link: "",
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
        meeting_link: cohort.meeting_link || "",
        whatsapp_group_link: cohort.whatsapp_group_link || "",
      });
      setEditingCohort(cohort);
      setShowCohortModal(true);
    };

    const handleSaveCohort = async () => {
      setSaving(true);
      const originalPrice = Number(cohortForm.original_price || 0);
      const salePrice = cohortForm.sale_price ? Number(cohortForm.sale_price) : null;
      const data = {
        name: cohortForm.name,
        dates: cohortForm.dates,
        time: cohortForm.time,
        original_price: originalPrice,
        sale_price: salePrice,
        sale_tag: cohortForm.sale_tag || null,
        total_spots: Number(cohortForm.total_spots || 0),
        description: cohortForm.description,
        is_active: cohortForm.is_active,
        delivery_type: cohortForm.delivery_type,
        meeting_link: cohortForm.meeting_link || null,
        whatsapp_group_link: cohortForm.whatsapp_group_link || null,
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

  const handleBulkMarkAttendance = async (scope: "selected" | "visible") => {
    const dateToUse = bulkCompletionDate.trim();
    const targetEnrollments = scope === "selected"
      ? visibleAttendanceEnrollments.filter(enrollment => selectedIds.includes(enrollment.id))
      : visibleAttendanceEnrollments;

    if (targetEnrollments.length === 0) {
      toast.error(scope === "selected" ? "Please select at least one student" : "No students in this view");
      return;
    }

    if (!dateToUse) {
      toast.error("Please enter a completion date for the bulk attendance update");
      return;
    }

    if (!confirm(`Mark ${targetEnrollments.length} student${targetEnrollments.length === 1 ? "" : "s"} as attended?`)) return;

    setBulkMarkingAttendance(true);
    try {
      let result: { success: boolean; error?: string };

      if (scope === "visible" && attendanceCohortFilter !== "all") {
        result = await bulkToggleAttendance(attendanceCohortFilter, true, dateToUse);
      } else {
        const results = await Promise.all(
          targetEnrollments.map(enrollment => toggleAttendance(enrollment.id, true, dateToUse))
        );
        const firstError = results.find(item => !item.success);
        result = firstError || { success: true };
      }

      if (result.success) {
        toast.success(`${targetEnrollments.length} student${targetEnrollments.length === 1 ? "" : "s"} marked attended`);
        setSelectedIds([]);
        loadData();
      } else {
        toast.error(result.error || "Failed to update attendance");
      }
    } finally {
      setBulkMarkingAttendance(false);
    }
  };

  const handleToggleCertificateSent = async (enrollment: Enrollment) => {
    const result = await markCertificateSent(enrollment.id, !enrollment.certificate_sent);
    if (result.success) {
      toast.success(`${enrollment.name} marked as ${!enrollment.certificate_sent ? "certificate sent" : "certificate not sent"}`);
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleBulkMarkCertificatesSent = async () => {
    const targetEnrollments = visibleAttendanceEnrollments.filter(
      enrollment => selectedIds.includes(enrollment.id) && enrollment.attended
    );

    if (targetEnrollments.length === 0) {
      toast.error("Select attended students first");
      return;
    }

    const result = await bulkMarkCertificatesSent(targetEnrollments.map(enrollment => enrollment.id), true);
    if (result.success) {
      toast.success(`${targetEnrollments.length} certificate${targetEnrollments.length === 1 ? "" : "s"} marked sent`);
      setSelectedIds([]);
      loadData();
    } else {
      toast.error(result.error);
    }
  };

  const handleBulkSendCertificates = async () => {
    const targetEnrollments = visibleAttendanceEnrollments.filter(
      enrollment => selectedIds.includes(enrollment.id) && enrollment.attended && enrollment.email
    );

    if (targetEnrollments.length === 0) {
      toast.error("Select attended students with email addresses first");
      return;
    }

    if (!confirm(`Send certificates to ${targetEnrollments.length} selected student${targetEnrollments.length === 1 ? "" : "s"}?`)) return;

    setBulkSendingCerts(true);
    const toastId = toast.loading(`Sending ${targetEnrollments.length} certificate${targetEnrollments.length === 1 ? "" : "s"}...`);

    try {
      const results = await Promise.all(
        targetEnrollments.map(async (enrollment) => {
          const response = await fetch("/api/send-certificate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: enrollment.name,
              email: enrollment.email,
              enrollmentId: enrollment.id,
              certificateId: enrollment.certificate_id || "",
              cohortName: enrollment.cohorts?.name || "",
              customDate: enrollment.completion_date || bulkCompletionDate || "",
            }),
          });

          return { id: enrollment.id, ok: response.ok };
        })
      );

      const successfulIds = results.filter(result => result.ok).map(result => result.id);
      const failedCount = results.length - successfulIds.length;

      if (successfulIds.length > 0) {
        await bulkMarkCertificatesSent(successfulIds, true);
      }

      if (failedCount === 0) {
        toast.success("Certificates sent successfully", { id: toastId });
        setSelectedIds([]);
      } else {
        toast.error(`${failedCount} certificate${failedCount === 1 ? "" : "s"} failed to send`, { id: toastId });
      }

      loadData();
    } catch {
      toast.error("An error occurred while sending certificates", { id: toastId });
    } finally {
      setBulkSendingCerts(false);
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

      const handleAddNotificationEmail = async () => {
        if (!newEmail || !newEmail.includes('@')) {
          toast.error("Please enter a valid email");
          return;
        }
        if (notificationEmails.length >= 2) {
          toast.error("Maximum 2 emails allowed");
          return;
        }
        if (notificationEmails.includes(newEmail.trim())) {
          toast.error("Email already added");
          return;
        }
        
        setSavingSettings(true);
        const updatedEmails = [...notificationEmails, newEmail.trim()];
        const result = await updateNotificationEmails(updatedEmails.join(','));
        if (result.success) {
          setNotificationEmails(updatedEmails);
          setNewEmail("");
          toast.success("Email added!");
        } else {
          toast.error(result.error);
        }
        setSavingSettings(false);
      };

      const handleSendBulkEmail = async () => {
        if (!selectedEmailCohortId) {
          toast.error("Please select a cohort");
          return;
        }
        if (selectedEmailStudentIds.length === 0) {
          toast.error("Please select at least one student");
          return;
        }

        if (emailTemplate === "meeting" && !meetingForm.meetingLink) {
          toast.error("Please enter a meeting link");
          return;
        }

        if (emailTemplate === "location" && (!locationForm.locationName || !locationForm.locationLink)) {
          toast.error("Please enter location name and link");
          return;
        }

        const cohort = cohorts.find(c => c.id === selectedEmailCohortId);
        const students = paidEnrollments
          .filter(e => selectedEmailStudentIds.includes(e.id))
          .map(e => ({ name: e.name, email: e.email }));

        setSendingEmails(true);
        const toastId = toast.loading(`Sending ${students.length} emails...`);

        try {
          let result;
          if (emailTemplate === "meeting") {
            result = await sendBulkMeetingEmails(
              students, 
              cohort?.name || "", 
              cohort?.dates || "",
              cohort?.time || "",
              meetingForm.meetingLink
            );
          } else {
            result = await sendBulkLocationEmails(
              students, 
              cohort?.name || "", 
              cohort?.dates || "",
              cohort?.time || "",
              locationForm.locationName, 
              locationForm.locationLink
            );
          }

          if (result.success) {
            toast.success("Emails sent successfully!", { id: toastId });
            setSelectedEmailStudentIds([]);
          } else {
            toast.error("Failed to send some emails", { id: toastId });
          }
        } catch {
          toast.error("An error occurred while sending emails", { id: toastId });
        } finally {
          setSendingEmails(false);
        }
      };


    const handleRemoveNotificationEmail = async (emailToRemove: string) => {
      setSavingSettings(true);
      const updatedEmails = notificationEmails.filter(e => e !== emailToRemove);
      const result = await updateNotificationEmails(updatedEmails.join(','));
      if (result.success) {
        setNotificationEmails(updatedEmails);
        toast.success("Email removed!");
      } else {
        toast.error(result.error);
      }
      setSavingSettings(false);
    };

    const downloadCSV = (data: Enrollment[]) => {
      const headers = ["Name", "Email", "Phone", "Age", "Profession", "Joining Type", "Cohort", "Price Paid", "Date"];
      const csvContent = [
        headers.join(","),
        ...data.map(e => [
          `"${e.name}"`,
          `"${e.email}"`,
          `"${e.phone}"`,
          e.age,
          `"${e.profession}"`,
          `"${e.joining_type}"`,
          `"${e.cohorts?.name || ""}"`,
          e.price_paid,
          new Date(e.created_at).toLocaleDateString()
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `enrolled_students_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Lead management functions
    const handleUpdateLeadStatus = async (id: string, status: string) => {
      try {
        const res = await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        if (res.ok) {
          toast.success("Lead status updated");
          setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
          setSelectedLead(null);
        } else {
          toast.error("Failed to update status");
        }
      } catch {
        toast.error("Failed to update status");
      }
    };

    const handleDeleteLead = async (id: string) => {
      if (!confirm("Delete this lead?")) return;
      try {
        const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Lead deleted");
          setLeads(leads.filter(l => l.id !== id));
          setSelectedLead(null);
        } else {
          toast.error("Failed to delete lead");
        }
      } catch {
        toast.error("Failed to delete lead");
      }
    };

    const handleSendLeadEmails = async () => {
      if (selectedLeadIds.length === 0) {
        toast.error("Please select at least one lead");
        return;
      }
      if (!leadEmailSubject.trim() || !leadEmailBody.trim()) {
        toast.error("Please fill in subject and message");
        return;
      }

      const selectedLeads = leads.filter(l => selectedLeadIds.includes(l.id) && l.consent);
      if (selectedLeads.length === 0) {
        toast.error("No selected leads have given consent to be contacted");
        return;
      }

      setSendingLeadEmails(true);
      const toastId = toast.loading(`Sending ${selectedLeads.length} emails...`);

      try {
        const res = await fetch("/api/leads/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: leadEmailSubject,
            body: leadEmailBody,
            recipient_emails: selectedLeads.map(l => l.email),
          }),
        });

        if (res.ok) {
          toast.success("Emails sent successfully!", { id: toastId });
          setLeadEmailSubject("");
          setLeadEmailBody("");
          setSelectedLeadIds([]);
        } else {
          toast.error("Failed to send some emails", { id: toastId });
        }
      } catch {
        toast.error("An error occurred while sending emails", { id: toastId });
      } finally {
        setSendingLeadEmails(false);
      }
    };

    // Filtered leads with search and filters
    const filteredLeads = leads.filter(lead => {
      const matchesSearch = leadsSearch === "" || 
        lead.full_name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
        lead.email.toLowerCase().includes(leadsSearch.toLowerCase());
      const matchesSource = leadsSourceFilter === "all" || lead.source === leadsSourceFilter;
      const matchesStatus = leadsStatusFilter === "all" || lead.status === leadsStatusFilter;
      return matchesSearch && matchesSource && matchesStatus;
    });

    const paginatedLeads = filteredLeads.slice((leadsPage - 1) * LEADS_PER_PAGE, leadsPage * LEADS_PER_PAGE);
    const totalLeadsPages = Math.ceil(filteredLeads.length / LEADS_PER_PAGE);

    const selectableLeads = leads.filter(l => l.consent);

    const totalRevenue = paidEnrollments.reduce((acc, curr) => acc + parseInt(curr.price_paid), 0);

  const activeCohorts = cohorts.filter(c => c.is_active && c.spots_taken < c.total_spots);
  const fullCohorts = cohorts.filter(c => c.spots_taken >= c.total_spots);
  const inactiveCohorts = cohorts.filter(c => !c.is_active && c.spots_taken < c.total_spots);

  const filteredCohorts = cohortFilter === "active" ? activeCohorts 
    : cohortFilter === "full" ? fullCohorts 
    : inactiveCohorts;

    const filteredEnrollments = enrollmentFilter === "pending" ? pendingEnrollments : paidEnrollments;

    const visibleAttendanceEnrollments = attendanceCohortFilter === "all"
      ? paidEnrollments
      : paidEnrollments.filter(enrollment => enrollment.cohort_id === attendanceCohortFilter);

    const selectedAttendanceIds = visibleAttendanceEnrollments
      .filter(enrollment => selectedIds.includes(enrollment.id))
      .map(enrollment => enrollment.id);

    const filteredCrmEnrollments = paidEnrollments.filter(e => e.attended).filter(e => {
      if (!crmStartDate && !crmEndDate) return true;
      const date = new Date(e.created_at);
      const start = crmStartDate ? new Date(crmStartDate) : null;
      const end = crmEndDate ? new Date(crmEndDate) : null;
      
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    });

    if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </main>
    );
  }

      return (
        <main className="min-h-screen bg-[#080808] text-white" suppressHydrationWarning>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 z-20 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 h-14 flex items-center px-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect y="2" width="18" height="2" rx="1" fill="currentColor"/><rect y="8" width="18" height="2" rx="1" fill="currentColor"/><rect y="14" width="18" height="2" rx="1" fill="currentColor"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black text-xs font-black">CK</span>
              </div>
              <span className="font-bold text-sm tracking-tight">CodeKar Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Revenue:</span>
              <span className="font-mono font-bold text-green-400 text-sm">
                {showRevenue ? `PKR ${totalRevenue.toLocaleString()}` : "PKR ••••••"}
              </span>
              <button onClick={() => setShowRevenue(!showRevenue)} className="text-white/40 hover:text-white transition-colors">
                {showRevenue ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/50 hover:text-white hover:bg-white/10 h-9 px-3"
              onClick={() => loadData()}
              disabled={loading}
            >
              <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/50 hover:text-white hover:bg-white/10 h-9 px-3"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex pt-14">
          {/* Sidebar */}
          <aside className={`fixed top-14 left-0 bottom-0 w-60 bg-[#0d0d0d] border-r border-white/5 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}>
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {[
                { id: "cohorts", label: "Cohorts", icon: <Calendar className="w-4 h-4" />, count: cohorts.length, color: "text-white" },
                { id: "enrollments", label: "Enrollments", icon: <Users className="w-4 h-4" />, count: pendingEnrollments.length + paidEnrollments.length, badge: pendingEnrollments.length, color: "text-orange-400" },
                { id: "waitlist", label: "Waitlist", icon: <Bell className="w-4 h-4" />, count: waitlist.length, color: "text-yellow-400" },
                { id: "promocodes", label: "Promo Codes", icon: <Ticket className="w-4 h-4" />, count: promoCodes.length, color: "text-blue-400" },
                { id: "attendance", label: "Attendance", icon: <CheckSquare className="w-4 h-4" />, count: paidEnrollments.length, color: "text-purple-400" },
                { id: "feedback", label: "Feedback", icon: <MessageSquare className="w-4 h-4" />, count: feedbacks.length, color: "text-green-400" },
                { id: "enrolment", label: "CRM", icon: <BookOpen className="w-4 h-4" />, count: paidEnrollments.filter(e => e.attended).length, color: "text-yellow-500" },
                { id: "send-email", label: "Send Email", icon: <Mail className="w-4 h-4" />, count: null, color: "text-pink-400" },
                { id: "leads", label: "Leads", icon: <UserPlus className="w-4 h-4" />, count: leads.length, color: "text-cyan-400" },
                { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" />, count: null, color: "text-white/60" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { handleTabChange(item.id as AdminTab); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                    activeTab === item.id
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={activeTab === item.id ? item.color : "text-white/30 group-hover:text-white/60"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="w-4 h-4 bg-orange-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== null && (
                      <span className={`text-xs font-mono ${activeTab === item.id ? "text-white/60" : "text-white/20"}`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-white/5">
              <div className="px-3 py-2 text-[10px] text-white/20 font-mono text-center">v2.4.0-stable</div>
            </div>
          </aside>

          {/* Main content area */}
          <div className="flex-1 lg:ml-60 min-w-0">
            <div className="p-4 sm:p-6 lg:p-8">


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
                    const displayPrice = cohort.sale_price ?? cohort.original_price;
                    const isFreeWorkshop = displayPrice <= 0;
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
                                Price: <span className="text-white font-medium">{isFreeWorkshop ? "Free" : `PKR ${cohort.original_price.toLocaleString()}`}</span>
                                {cohort.sale_price !== null && cohort.sale_price < cohort.original_price && !isFreeWorkshop && (
                                  <span className="text-green-400 ml-2">to PKR {cohort.sale_price.toLocaleString()}</span>
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
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Attendance & Certification</h2>
                    <p className="text-xs text-white/40 mt-1">
                      {visibleAttendanceEnrollments.length} paid student{visibleAttendanceEnrollments.length === 1 ? "" : "s"} in this view
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <select
                      value={attendanceCohortFilter}
                      onChange={(event) => {
                        setAttendanceCohortFilter(event.target.value);
                        setSelectedIds([]);
                      }}
                      className="h-9 rounded-md bg-[#111] border border-white/10 text-white text-xs px-3 outline-none"
                    >
                      <option value="all">All paid students</option>
                      {cohorts.map((cohort) => (
                        <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
                      ))}
                    </select>
                    <Input
                      placeholder="Completion date"
                      value={bulkCompletionDate}
                      onChange={(event) => setBulkCompletionDate(event.target.value)}
                      className="bg-[#111] border-white/10 text-xs h-9 w-full sm:w-44"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleBulkMarkAttendance("visible")}
                    disabled={bulkMarkingAttendance || visibleAttendanceEnrollments.length === 0}
                  >
                    {bulkMarkingAttendance ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckSquare className="w-4 h-4 mr-2" />}
                    Mark All Visible Attended
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    onClick={() => handleBulkMarkAttendance("selected")}
                    disabled={bulkMarkingAttendance || selectedAttendanceIds.length === 0}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Selected Attended ({selectedAttendanceIds.length})
                  </Button>
                  <Button
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={handleBulkSendCertificates}
                    disabled={bulkSendingCerts || selectedAttendanceIds.length === 0}
                  >
                    {bulkSendingCerts ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Selected Certificates
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    onClick={handleBulkMarkCertificatesSent}
                    disabled={selectedAttendanceIds.length === 0}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Mark Selected Sent
                  </Button>
                  {selectedIds.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected ({selectedIds.length})
                    </Button>
                  )}
                </div>

              {/* Mobile Card View */}
              <div className="grid gap-4 sm:hidden">
                {visibleAttendanceEnrollments.length === 0 ? (
                  <div className="text-center py-12 text-white/40">No paid students found</div>
                ) : (
                  visibleAttendanceEnrollments.map((enrollment) => (
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
                              <p className="text-[10px] text-white/60">{enrollment.email}</p>
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

                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Certificate Email</span>
                        <button
                          onClick={() => handleToggleCertificateSent(enrollment)}
                          disabled={!enrollment.attended}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            enrollment.certificate_sent
                              ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                              : enrollment.attended
                                ? "bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25"
                                : "bg-white/5 text-white/25 cursor-not-allowed"
                          }`}
                        >
                          {enrollment.certificate_sent ? "Marked Sent" : "Mark as Sent"}
                        </button>
                      </div>

                       {enrollment.attended ? (
                         <>
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
                                      certificateId: enrollment.certificate_id || "",
                                      cohortName: enrollment.cohorts?.name || "",
                                      date: enrollment.completion_date || ""
                                    });
                                    window.open(`/admin/certificate?${params.toString()}`, '_blank');
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" /> View Certificate
                                </Button>
                              </div>
                               <div className="flex justify-between items-center px-1 text-[9px] font-mono text-white/20">
                                 <span>CERT ID: {enrollment.certificate_id || "N/A"}</span>
                               </div>
                           </>
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
                            if (selectedAttendanceIds.length === visibleAttendanceEnrollments.length) {
                              setSelectedIds([]);
                            } else {
                              setSelectedIds(visibleAttendanceEnrollments.map(e => e.id));
                            }
                          }}
                          className={`p-0.5 rounded border transition-colors ${selectedAttendanceIds.length === visibleAttendanceEnrollments.length && visibleAttendanceEnrollments.length > 0 ? "bg-white border-white text-black" : "border-white/20 text-transparent hover:border-white/40"}`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </th>
                        <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-white/60 font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-white/60 font-medium">Email</th>
                          <th className="text-left py-3 px-4 text-white/60 font-medium w-48">Completion Date</th>
                        <th className="text-left py-3 px-4 text-white/60 font-medium">Cohort</th>
                        <th className="text-left py-3 px-4 text-white/60 font-medium">Certificate Email</th>
                        <th className="text-right py-3 px-4 text-white/60 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleAttendanceEnrollments.map((enrollment) => (
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
                          <td className="py-3 px-4 text-white/60">{enrollment.email}</td>
                          <td className="py-3 px-4">
                            <Input 
                              placeholder="January 1, 2026"
                              value={individualDates[enrollment.id] || enrollment.completion_date || ""}
                              onChange={(e) => setIndividualDates({ ...individualDates, [enrollment.id]: e.target.value })}
                              className="bg-black border-white/10 text-xs h-8 w-40"
                            />
                          </td>
                        <td className="py-3 px-4 text-white/60">{enrollment.cohorts?.name || "—"}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleCertificateSent(enrollment)}
                            disabled={!enrollment.attended}
                            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              enrollment.certificate_sent
                                ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                                : enrollment.attended
                                  ? "bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25"
                                  : "bg-white/5 text-white/25 cursor-not-allowed"
                            }`}
                          >
                            {enrollment.certificate_sent ? "Marked Sent" : "Mark as Sent"}
                          </button>
                        </td>
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
                                          certificateId: enrollment.certificate_id || "",
                                          cohortName: enrollment.cohorts?.name || "",
                                          date: enrollment.completion_date || ""
                                        });
                                        window.open(`/admin/certificate?${params.toString()}`, '_blank');
                                      }}
                                    >
                                      <Eye className="w-4 h-4 mr-2" /> View Certificate
                                    </Button>
                                     <div className="absolute -bottom-5 right-0 text-[8px] font-mono text-white/20 whitespace-nowrap">
                                      ID: {enrollment.certificate_id || "N/A"} {enrollment.certificate_sent ? "• SENT" : ""}
                                     </div>
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

{activeTab === "enrolment" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h2 className="text-xl sm:text-2xl font-bold">Enrolled Students (CRM)</h2>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            className="bg-white/5 border-white/10 text-white text-xs h-9 w-32 sm:w-40"
                            value={crmStartDate}
                            onChange={(e) => setCrmStartDate(e.target.value)}
                          />
                          <span className="text-white/40 text-xs">to</span>
                          <Input
                            type="date"
                            className="bg-white/5 border-white/10 text-white text-xs h-9 w-32 sm:w-40"
                            value={crmEndDate}
                            onChange={(e) => setCrmEndDate(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={() => downloadCSV(filteredCrmEnrollments)}
                          className="bg-white text-black hover:bg-gray-100 h-9"
                          disabled={filteredCrmEnrollments.length === 0}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download CSV
                        </Button>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                          <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Filtered:</span>
                          <span className="text-sm font-mono font-bold text-white">{filteredCrmEnrollments.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="grid gap-4 sm:hidden">
                      {filteredCrmEnrollments.length === 0 ? (
                        <div className="text-center py-12 text-white/40 border border-white/5 rounded-xl">No students found for this period</div>
                      ) : (
                        filteredCrmEnrollments.map((enrollment) => (
                          <Card key={enrollment.id} className="bg-[#0A0A0A] border-white/10 p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-white">{enrollment.name}</h3>
                                <p className="text-xs text-white/40">{enrollment.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                  ATTENDED
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0 text-red-500/40 hover:text-red-500 hover:bg-red-500/10"
                                  onClick={() => { setEnrollmentFilter("paid"); handleDeleteEnrollment(enrollment.id); }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px]">
                              <div>
                                <p className="text-white/20 uppercase font-bold">Phone</p>
                                <p className="text-white/60">{enrollment.phone}</p>
                              </div>
                              <div>
                                <p className="text-white/20 uppercase font-bold">Age</p>
                                <p className="text-white/60">{enrollment.age}</p>
                              </div>
                              <div>
                                <p className="text-white/20 uppercase font-bold">Profession</p>
                                <p className="text-white/60 truncate">{enrollment.profession}</p>
                              </div>
                              <div>
                                <p className="text-white/20 uppercase font-bold">Joining</p>
                                <p className="text-white/60 capitalize">{enrollment.joining_type}</p>
                              </div>
                              <div>
                                <p className="text-white/20 uppercase font-bold">Cohort</p>
                                <p className="text-white/60 truncate">{enrollment.cohorts?.name || "—"}</p>
                              </div>
                              <div>
                                <p className="text-white/20 uppercase font-bold">Paid</p>
                                <p className="text-green-400 font-bold">PKR {parseInt(enrollment.price_paid).toLocaleString()}</p>
                              </div>
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
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Student</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Contact</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Details</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Enrolment</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Date</th>
                            <th className="text-right py-3 px-4 text-white/60 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCrmEnrollments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-white/40">No students found for this period</td>
                            </tr>
                          ) : (
                            filteredCrmEnrollments.map((enrollment) => (
                              <tr key={enrollment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="font-bold text-white">{enrollment.name}</div>
                                  <div className="text-xs text-white/40">{enrollment.age} years old</div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-white/80">{enrollment.email}</div>
                                  <div className="text-xs text-white/40">{enrollment.phone}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-white/80">{enrollment.profession}</div>
                                  <div className="text-xs text-white/40 capitalize">{enrollment.joining_type}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-white/80">{enrollment.cohorts?.name || "—"}</div>
                                  <div className="text-xs text-green-400 font-bold">PKR {parseInt(enrollment.price_paid).toLocaleString()}</div>
                                </td>
                                <td className="py-4 px-4 text-white/40 text-xs">
                                  {new Date(enrollment.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                                    onClick={() => { setEnrollmentFilter("paid"); handleDeleteEnrollment(enrollment.id); }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    </div>
                  )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold">Settings</h2>
                
                <Card className="bg-[#111] border-white/10 p-6 rounded-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white/60" />
                      </div>
                      <div>
                        <h3 className="font-bold">Notification Emails</h3>
                        <p className="text-xs text-white/40">Get notified when a new student registers (max 2 emails)</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {notificationEmails.length > 0 && (
                        <div className="space-y-2">
                          {notificationEmails.map((email, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-green-500" />
                                </div>
                                <span className="text-sm text-white/80">{email}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                                onClick={() => handleRemoveNotificationEmail(email)}
                                disabled={savingSettings}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {notificationEmails.length < 2 && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter email address"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="bg-[#1a1a1a] border-white/10 h-11"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddNotificationEmail()}
                          />
                          <Button
                            onClick={handleAddNotificationEmail}
                            className="bg-white text-black hover:bg-gray-100 h-11 px-6"
                            disabled={savingSettings}
                          >
                            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          </Button>
                        </div>
                      )}

                      {notificationEmails.length === 0 && (
                        <p className="text-xs text-white/20 italic text-center py-4">No notification emails configured yet</p>
                      )}
                    </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                        <p className="text-[11px] text-blue-400/80 leading-relaxed">
                          <span className="font-bold">How it works:</span> When a student submits the registration form and clicks &quot;I Have Paid&quot;, an email notification will be sent to all configured email addresses with the student&apos;s details for payment verification.
                        </p>
                      </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "send-email" && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold">Send Bulk Invitation Emails</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Step 1: Template Selection */}
                  <Card className="bg-[#111] border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold">1</div>
                      <h3 className="font-bold">Select Template</h3>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant={emailTemplate === "meeting" ? "default" : "outline"}
                        className={`w-full justify-start h-12 ${emailTemplate === "meeting" ? "bg-pink-600" : "border-white/10 text-white/60"}`}
                        onClick={() => setEmailTemplate("meeting")}
                      >
                        <Mail className="w-4 h-4 mr-3" />
                        Online Meeting Invitation
                      </Button>
                      <Button 
                        variant={emailTemplate === "location" ? "default" : "outline"}
                        className={`w-full justify-start h-12 ${emailTemplate === "location" ? "bg-pink-600" : "border-white/10 text-white/60"}`}
                        onClick={() => setEmailTemplate("location")}
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Physical Location Invitation
                      </Button>
                    </div>
                  </Card>

                  {/* Step 2: Cohort & Students */}
                  <Card className="bg-[#111] border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold">2</div>
                      <h3 className="font-bold">Select Students</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white/40 text-[10px] uppercase font-bold">Select Cohort</Label>
                        <select 
                          className="w-full bg-black border border-white/10 rounded-lg h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                          value={selectedEmailCohortId}
                          onChange={(e) => {
                            setSelectedEmailCohortId(e.target.value);
                            setSelectedEmailStudentIds([]);
                          }}
                        >
                          <option value="">Select a cohort...</option>
                          {cohorts.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {selectedEmailCohortId && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-white/40 text-[10px] uppercase font-bold">Select Students</Label>
                            <button 
                              className="text-[10px] text-pink-500 hover:underline"
                              onClick={() => {
                                const cohortStudents = paidEnrollments.filter(e => e.cohort_id === selectedEmailCohortId);
                                if (selectedEmailStudentIds.length === cohortStudents.length) {
                                  setSelectedEmailStudentIds([]);
                                } else {
                                  setSelectedEmailStudentIds(cohortStudents.map(e => e.id));
                                }
                              }}
                            >
                              {selectedEmailStudentIds.length === paidEnrollments.filter(e => e.cohort_id === selectedEmailCohortId).length ? "Deselect All" : "Select All"}
                            </button>
                          </div>
                          <div className="max-h-[200px] overflow-y-auto border border-white/10 rounded-lg bg-black/50 p-2 space-y-1 scrollbar-hide">
                            {paidEnrollments.filter(e => e.cohort_id === selectedEmailCohortId).length === 0 ? (
                              <p className="text-xs text-white/20 italic text-center py-4">No students in this cohort</p>
                            ) : (
                              paidEnrollments.filter(e => e.cohort_id === selectedEmailCohortId).map(e => (
                                <button
                                  key={e.id}
                                  onClick={() => {
                                    setSelectedEmailStudentIds(prev => 
                                      prev.includes(e.id) ? prev.filter(id => id !== e.id) : [...prev, e.id]
                                    );
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded-md text-left text-xs transition-colors ${selectedEmailStudentIds.includes(e.id) ? "bg-pink-600/20 text-pink-400" : "hover:bg-white/5 text-white/60"}`}
                                >
                                  <span>{e.name}</span>
                                  {selectedEmailStudentIds.includes(e.id) && <Check className="w-3 h-3" />}
                                </button>
                              ))
                            )}
                          </div>
                          {selectedEmailStudentIds.length > 0 && (
                            <p className="text-[10px] text-pink-500 font-bold">{selectedEmailStudentIds.length} students selected</p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Step 3: Details & Send */}
                  <Card className="bg-[#111] border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold">3</div>
                      <h3 className="font-bold">Template Details</h3>
                    </div>

                    <div className="space-y-4">
                      {emailTemplate === "meeting" ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-white/40 text-[10px] uppercase font-bold">Meeting Link</Label>
                            <Input 
                              placeholder="https://meet.google.com/..."
                              className="bg-black border-white/10 h-11"
                              value={meetingForm.meetingLink}
                              onChange={(e) => setMeetingForm({ ...meetingForm, meetingLink: e.target.value })}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-white/40 text-[10px] uppercase font-bold">Location Name</Label>
                            <Input 
                              placeholder="Daali, Sindhi Muslim Society"
                              className="bg-black border-white/10 h-11"
                              value={locationForm.locationName}
                              onChange={(e) => setLocationForm({ ...locationForm, locationName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white/40 text-[10px] uppercase font-bold">Google Maps Link</Label>
                            <Input 
                              placeholder="https://maps.app.goo.gl/..."
                              className="bg-black border-white/10 h-11"
                              value={locationForm.locationLink}
                              onChange={(e) => setLocationForm({ ...locationForm, locationLink: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button 
                          className="w-full bg-pink-600 hover:bg-pink-700 h-12 font-bold"
                          onClick={handleSendBulkEmail}
                          disabled={sendingEmails || selectedEmailStudentIds.length === 0}
                        >
                          {sendingEmails ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Emails ({selectedEmailStudentIds.length})
                            </>
                          )}
                        </Button>
                        <p className="text-[10px] text-white/20 text-center mt-3">
                          Emails will be sent individually to each student.
                        </p>
                      </div>
                    </div>
                  </Card>
                  </div>
                </div>
              )}

            {activeTab === "leads" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Leads Management</h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600/10 border border-cyan-600/20 rounded-lg">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Total Leads:</span>
                    <span className="text-sm font-mono font-bold text-white">{leads.length}</span>
                  </div>
                </div>

                <div className="flex gap-2 border-b border-white/10 pb-4">
                  <Button
                    variant={leadsSubTab === "list" ? "default" : "ghost"}
                    size="sm"
                    className={leadsSubTab === "list" ? "bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30" : "text-white/60 hover:text-white hover:bg-white/10"}
                    onClick={() => setLeadsSubTab("list")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    All Leads
                  </Button>
                  <Button
                    variant={leadsSubTab === "email" ? "default" : "ghost"}
                    size="sm"
                    className={leadsSubTab === "email" ? "bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30" : "text-white/60 hover:text-white hover:bg-white/10"}
                    onClick={() => setLeadsSubTab("email")}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Email Leads
                  </Button>
                </div>

                {leadsSubTab === "list" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                          placeholder="Search by name or email..."
                          value={leadsSearch}
                          onChange={(e) => { setLeadsSearch(e.target.value); setLeadsPage(1); }}
                          className="bg-white/5 border-white/10 pl-10 h-10"
                        />
                      </div>
                      <select
                        value={leadsSourceFilter}
                        onChange={(e) => { setLeadsSourceFilter(e.target.value); setLeadsPage(1); }}
                        className="bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none"
                      >
                        <option value="all" className="bg-black">All Sources</option>
                        <option value="Student Lead" className="bg-black">Student Lead</option>
                      </select>
                      <select
                        value={leadsStatusFilter}
                        onChange={(e) => { setLeadsStatusFilter(e.target.value); setLeadsPage(1); }}
                        className="bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none"
                      >
                        <option value="all" className="bg-black">All Status</option>
                        <option value="New" className="bg-black">New</option>
                        <option value="Contacted" className="bg-black">Contacted</option>
                        <option value="Closed" className="bg-black">Closed</option>
                      </select>
                    </div>

                    <div className="grid gap-4 sm:hidden">
                      {paginatedLeads.length === 0 ? (
                        <div className="text-center py-12 text-white/40 border border-white/5 rounded-xl">No leads found</div>
                      ) : (
                        paginatedLeads.map((lead) => (
                          <Card 
                            key={lead.id} 
                            className="bg-[#111] border-white/10 p-4 rounded-xl space-y-3 cursor-pointer hover:border-white/20 transition-colors"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-white">{lead.full_name}</h3>
                                <p className="text-xs text-white/40">{lead.email}</p>
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                lead.status === "New" ? "bg-cyan-500/20 text-cyan-400" :
                                lead.status === "Contacted" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-green-500/20 text-green-400"
                              }`}>
                                {lead.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-white/20 uppercase font-bold text-[9px]">Phone</p>
                                <p className="text-white/60">{lead.phone}</p>
                              </div>
                              <div>
                                <p className="text-white/20 uppercase font-bold text-[9px]">Location</p>
                                <p className="text-white/60 truncate">{lead.city}, {lead.country}</p>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>

                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Name</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Email</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Phone</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Location</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Source</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Date</th>
                            <th className="text-left py-3 px-4 text-white/60 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedLeads.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-white/40">No leads found</td>
                            </tr>
                          ) : (
                            paginatedLeads.map((lead) => (
                              <tr 
                                key={lead.id} 
                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => setSelectedLead(lead)}
                              >
                                <td className="py-3 px-4 font-medium">{lead.full_name}</td>
                                <td className="py-3 px-4 text-white/60">{lead.email}</td>
                                <td className="py-3 px-4 text-white/60">{lead.phone}</td>
                                <td className="py-3 px-4 text-white/60">{lead.city}, {lead.country}</td>
                                <td className="py-3 px-4">
                                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                    {lead.source}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                    lead.status === "New" ? "bg-cyan-500/20 text-cyan-400" :
                                    lead.status === "Contacted" ? "bg-yellow-500/20 text-yellow-400" :
                                    "bg-green-500/20 text-green-400"
                                  }`}>
                                    {lead.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-white/40 text-xs">
                                  {new Date(lead.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id); }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {totalLeadsPages > 1 && (
                      <div className="flex justify-center items-center gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/10 h-8"
                          onClick={() => setLeadsPage(p => Math.max(1, p - 1))}
                          disabled={leadsPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-white/60">
                          Page {leadsPage} of {totalLeadsPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/10 h-8"
                          onClick={() => setLeadsPage(p => Math.min(totalLeadsPages, p + 1))}
                          disabled={leadsPage === totalLeadsPages}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {leadsSubTab === "email" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-[#111] border-white/10 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">Select Leads</h3>
                        <button 
                          className="text-[10px] text-cyan-500 hover:underline"
                          onClick={() => {
                            if (selectedLeadIds.length === selectableLeads.length) {
                              setSelectedLeadIds([]);
                            } else {
                              setSelectedLeadIds(selectableLeads.map(l => l.id));
                            }
                          }}
                        >
                          {selectedLeadIds.length === selectableLeads.length ? "Deselect All" : "Select All"}
                        </button>
                      </div>
                      
                      <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                        <p className="text-[11px] text-yellow-400/80">
                          <span className="font-bold">Note:</span> Only leads who gave consent can be emailed. {selectableLeads.length} of {leads.length} leads are selectable.
                        </p>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto border border-white/10 rounded-lg bg-black/50 p-2 space-y-1 scrollbar-hide">
                        {selectableLeads.length === 0 ? (
                          <p className="text-xs text-white/20 italic text-center py-4">No leads with consent available</p>
                        ) : (
                          selectableLeads.map(lead => (
                            <button
                              key={lead.id}
                              onClick={() => {
                                setSelectedLeadIds(prev => 
                                  prev.includes(lead.id) ? prev.filter(id => id !== lead.id) : [...prev, lead.id]
                                );
                              }}
                              className={`w-full flex items-center justify-between p-3 rounded-md text-left transition-colors ${selectedLeadIds.includes(lead.id) ? "bg-cyan-600/20 text-cyan-400" : "hover:bg-white/5 text-white/60"}`}
                            >
                              <div>
                                <span className="text-sm font-medium">{lead.full_name}</span>
                                <p className="text-xs text-white/40">{lead.email}</p>
                              </div>
                              {selectedLeadIds.includes(lead.id) && <Check className="w-4 h-4" />}
                            </button>
                          ))
                        )}
                      </div>
                      {selectedLeadIds.length > 0 && (
                        <p className="text-[10px] text-cyan-500 font-bold">{selectedLeadIds.length} leads selected</p>
                      )}
                    </Card>

                    <Card className="bg-[#111] border-white/10 p-6 rounded-2xl space-y-4">
                      <h3 className="font-bold">Compose Email</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-white/40 text-[10px] uppercase font-bold">Subject</Label>
                          <Input 
                            placeholder="Enter email subject..."
                            className="bg-black border-white/10 h-11"
                            value={leadEmailSubject}
                            onChange={(e) => setLeadEmailSubject(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/40 text-[10px] uppercase font-bold">Message (HTML supported)</Label>
                          <Textarea 
                            placeholder="Write your email message here... HTML tags are supported for formatting."
                            className="bg-black border-white/10 min-h-[200px] text-sm"
                            value={leadEmailBody}
                            onChange={(e) => setLeadEmailBody(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 font-bold"
                          onClick={handleSendLeadEmails}
                          disabled={sendingLeadEmails || selectedLeadIds.length === 0}
                        >
                          {sendingLeadEmails ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send to {selectedLeadIds.length} Lead{selectedLeadIds.length !== 1 ? 's' : ''}
                            </>
                          )}
                        </Button>
                        
                        <p className="text-[10px] text-white/20 text-center">
                          Emails will be sent individually. Logs are saved for reference.
                        </p>
                      </div>
                    </Card>
                  </div>
                )}
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
            </div>{/* end p-4 sm:p-6 lg:p-8 */}
          </div>{/* end flex-1 lg:ml-60 */}
        </div>{/* end flex pt-14 */}


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
                <button
                  type="button"
                  onClick={() => {
                    const isFree = cohortForm.original_price === "0" && !cohortForm.sale_price;
                    setCohortForm({
                      ...cohortForm,
                      original_price: isFree ? "" : "0",
                      sale_price: "",
                      sale_tag: isFree ? "" : "FREE",
                    });
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    cohortForm.original_price === "0" && !cohortForm.sale_price
                      ? "border-green-500/40 bg-green-500/10"
                      : "border-white/10 bg-[#1a1a1a] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">Free Workshop</p>
                      <p className="text-xs text-white/50">Students register directly and receive confirmation email without payment.</p>
                    </div>
                    <span className={`h-5 w-9 rounded-full p-0.5 transition-colors ${
                      cohortForm.original_price === "0" && !cohortForm.sale_price ? "bg-green-500" : "bg-white/20"
                    }`}>
                      <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                        cohortForm.original_price === "0" && !cohortForm.sale_price ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </span>
                  </div>
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">Price (PKR)</Label>
                    <Input
                      type="number"
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.original_price}
                      onChange={(e) => setCohortForm({ ...cohortForm, original_price: e.target.value })}
                      disabled={cohortForm.original_price === "0" && !cohortForm.sale_price}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">Sale Price (PKR)</Label>
                    <Input
                      type="number"
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.sale_price}
                      onChange={(e) => setCohortForm({ ...cohortForm, sale_price: e.target.value })}
                      disabled={cohortForm.original_price === "0" && !cohortForm.sale_price}
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
                    <Label className="text-white/80 text-xs">Meeting Link (Optional)</Label>
                    <Input
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.meeting_link}
                      onChange={(e) => setCohortForm({ ...cohortForm, meeting_link: e.target.value })}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80 text-xs">WhatsApp Group Link (Optional)</Label>
                    <Input
                      className="bg-[#1a1a1a] border-white/10 h-10 sm:h-11"
                      value={cohortForm.whatsapp_group_link}
                      onChange={(e) => setCohortForm({ ...cohortForm, whatsapp_group_link: e.target.value })}
                      placeholder="https://chat.whatsapp.com/..."
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

            {selectedLead && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <Card className="bg-[#111] border-white/10 p-5 sm:p-6 rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg sm:text-xl font-bold">Lead Details</h2>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)} className="h-8 w-8 p-0">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-cyan-600/10 flex items-center justify-center">
                          <span className="text-cyan-400 text-lg font-bold">{selectedLead.full_name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{selectedLead.full_name}</h3>
                          <p className="text-xs text-white/40">{selectedLead.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-white/40 text-[10px] uppercase font-bold">Phone</p>
                          <p className="text-white/80 flex items-center gap-2">
                            <Phone className="w-3 h-3" /> {selectedLead.phone}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white/40 text-[10px] uppercase font-bold">Location</p>
                          <p className="text-white/80 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> {selectedLead.city}, {selectedLead.country}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white/40 text-[10px] uppercase font-bold">Source</p>
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                            {selectedLead.source}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white/40 text-[10px] uppercase font-bold">Consent</p>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${selectedLead.consent ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {selectedLead.consent ? "Given" : "Not Given"}
                          </span>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <p className="text-white/40 text-[10px] uppercase font-bold">Date Submitted</p>
                          <p className="text-white/60 text-xs">{new Date(selectedLead.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/40 text-[10px] uppercase font-bold">Update Status</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["New", "Contacted", "Closed"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleUpdateLeadStatus(selectedLead.id, status)}
                            className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                              selectedLead.status === status 
                                ? status === "New" ? "bg-cyan-600/20 text-cyan-400 border-cyan-600/30" 
                                  : status === "Contacted" ? "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
                                  : "bg-green-600/20 text-green-400 border-green-600/30"
                                : "bg-[#1a1a1a] text-white/60 border-white/10 hover:border-white/20"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" className="flex-1 border-white/20 h-10" onClick={() => setSelectedLead(null)}>
                        Close
                      </Button>
                      <Button 
                        className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 h-10" 
                        onClick={() => handleDeleteLead(selectedLead.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            </main>
        );
    }
