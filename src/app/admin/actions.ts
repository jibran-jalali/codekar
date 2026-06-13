"use server";

import { supabase } from "@/lib/supabase";
import { 
  sendPaymentConfirmationEmail,
  sendMeetingInvitationEmail,
  sendLocationInvitationEmail
} from "@/lib/mail";

export async function getAllCohorts() {
  const { data: cohorts, error: cohortsError } = await supabase
    .from("cohorts")
    .select("*")
    .order("created_at", { ascending: false });

  if (cohortsError) {
    return { success: false, error: cohortsError.message, data: [] };
  }

  // Get paid enrollment counts for each cohort
  const { data: counts, error: countsError } = await supabase
    .from("paid_enrollments")
    .select("cohort_id");

  if (countsError) {
    return { success: true, data: cohorts || [] };
  }

  const cohortsWithCounts = cohorts.map(cohort => ({
    ...cohort,
    spots_taken: counts.filter(c => c.cohort_id === cohort.id).length
  }));

  return { success: true, data: cohortsWithCounts };
}

export async function getAllEnrollments() {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, cohorts(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }
  return { success: true, data };
}

export async function getPaidEnrollments() {
  const { data, error } = await supabase
    .from("paid_enrollments")
    .select("*, cohorts(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }
  return { success: true, data };
}

export async function createCohort(cohortData: {
  name: string;
  dates: string;
  time: string;
  original_price: number;
  sale_price: number | null;
  sale_tag: string | null;
  total_spots: number;
  description: string;
  is_active: boolean;
  delivery_type: string;
  meeting_link?: string;
  whatsapp_group_link?: string;
}) {
  const { data, error } = await supabase
    .from("cohorts")
    .insert([cohortData])
    .select();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function updateCohort(id: string, cohortData: {
  name?: string;
  dates?: string;
  time?: string;
  original_price?: number;
  sale_price?: number | null;
  sale_tag?: string | null;
  total_spots?: number;
  spots_taken?: number;
  description?: string;
  is_active?: boolean;
  delivery_type?: string;
  meeting_link?: string;
  whatsapp_group_link?: string;
}) {
  const { data, error } = await supabase
    .from("cohorts")
    .update(cohortData)
    .eq("id", id)
    .select();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function deleteCohort(id: string) {
  const { error } = await supabase
    .from("cohorts")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function resetCohortSpots(cohortId: string) {
  const { error } = await supabase
    .from("paid_enrollments")
    .delete()
    .eq("cohort_id", cohortId);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function deleteEnrollment(id: string) {
  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function deletePaidEnrollment(id: string) {
  const { error } = await supabase
    .from("paid_enrollments")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function bulkDeleteEnrollments(ids: string[], type: "pending" | "paid") {
  const table = type === "pending" ? "enrollments" : "paid_enrollments";
  const { error } = await supabase
    .from(table)
    .delete()
    .in("id", ids);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getAllWaitlist() {
  const { data, error } = await supabase
    .from("waitlist")
    .select("*, cohorts(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }
  return { success: true, data };
}

export async function markWaitlistContacted(id: string, contacted: boolean) {
  const { error } = await supabase
    .from("waitlist")
    .update({ contacted })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function deleteWaitlistEntry(id: string) {
  const { error } = await supabase
    .from("waitlist")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

function generateCertificateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CERT-${result}`;
}

export async function markEnrollmentPaid(id: string) {
  const { data: enrollment, error: fetchError } = await supabase
    .from("enrollments")
    .select("*, cohorts(*)")
    .eq("id", id)
    .single();

  if (fetchError || !enrollment) {
    return { success: false, error: fetchError?.message || "Enrollment not found" };
  }

  const certId = generateCertificateId();

  // Insert into paid_enrollments
  const { error: insertError } = await supabase
    .from("paid_enrollments")
    .insert([{
      name: enrollment.name,
      age: enrollment.age,
      phone: enrollment.phone,
      email: enrollment.email,
      promo_code: enrollment.promo_code,
      price_paid: enrollment.price_paid,
      profession: enrollment.profession,
      joining_type: enrollment.joining_type,
      cohort_id: enrollment.cohort_id,
      status: 'paid',
      attended: false,
      certificate_id: certId
    }]);



  if (insertError) {
    return { success: false, error: "Failed to move to paid table: " + insertError.message };
  }

  // Increment promo code usage if applicable
  if (enrollment.promo_code) {
    const { data: promoData } = await supabase
      .from("promo_codes")
      .select("id, usage_count")
      .eq("code", enrollment.promo_code.toUpperCase())
      .maybeSingle();
    
    if (promoData) {
      await supabase
        .from("promo_codes")
        .update({ usage_count: (promoData.usage_count || 0) + 1 })
        .eq("id", promoData.id);
    }
  }

  // Delete from enrollments
  const { error: deleteError } = await supabase
    .from("enrollments")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Warning: Enrollment moved to paid but failed to delete from pending:", deleteError.message);
  }

  if (enrollment.email) {
    const emailResult = await sendPaymentConfirmationEmail({
      email: enrollment.email,
      name: enrollment.name,
      cohortName: enrollment.cohorts?.name || "Workshop",
      cohortDates: enrollment.cohorts?.dates || "",
      cohortTime: enrollment.cohorts?.time || "",
      joiningType: enrollment.joining_type || "online",
      meetingLink: enrollment.cohorts?.meeting_link || undefined,
    });
    
    if (emailResult.error) {
      console.error("Failed to send payment confirmation email:", emailResult.error);
    }
  }

  return { success: true };
}

export async function toggleAttendance(id: string, attended: boolean, completion_date?: string) {
  const updateData: { attended: boolean; completion_date?: string } = { attended };
  if (completion_date) {
    updateData.completion_date = completion_date;
  }
  
  const { error } = await supabase
    .from("paid_enrollments")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function bulkToggleAttendance(cohortId: string, attended: boolean, completion_date?: string) {
  const updateData: { attended: boolean; completion_date?: string } = { attended };
  if (completion_date) {
    updateData.completion_date = completion_date;
  }

  const { error } = await supabase
    .from("paid_enrollments")
    .update(updateData)
    .eq("cohort_id", cohortId);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function markCertificateSent(id: string, sent: boolean) {
  const { error } = await supabase
    .from("paid_enrollments")
    .update({ certificate_sent: sent })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function bulkMarkCertificatesSent(ids: string[], sent: boolean) {
  const { error } = await supabase
    .from("paid_enrollments")
    .update({ certificate_sent: sent })
    .in("id", ids);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function updateCompletionDate(id: string, completion_date: string) {
  const { error } = await supabase
    .from("paid_enrollments")
    .update({ completion_date })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getAllPromoCodes() {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }
  return { success: true, data };
}

export async function createPromoCode(promoData: {
  code: string;
  discount_amount: number;
  usage_limit: number | null;
}) {
  const { data, error } = await supabase
    .from("promo_codes")
    .insert([promoData])
    .select();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function deletePromoCode(id: string) {
  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function togglePromoCodeStatus(id: string, is_active: boolean) {
  const { error } = await supabase
    .from("promo_codes")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function deleteFeedback(id: string) {
  const { error } = await supabase
    .from("feedback")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getNotificationEmails() {
  const { data, error } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", "notification_emails")
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message, data: "" };
  }
  return { success: true, data: data?.value || "" };
}

export async function updateNotificationEmails(emails: string) {
  const { error } = await supabase
    .from("admin_settings")
    .upsert(
      {
        key: "notification_emails",
        value: emails,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function sendBulkMeetingEmails(students: { email: string, name: string }[], cohortName: string, cohortDates: string, cohortTime: string, meetingLink: string) {
  const results = [];
  for (const student of students) {
    const res = await sendMeetingInvitationEmail({
      email: student.email,
      name: student.name,
      cohortName,
      cohortDates,
      cohortTime,
      meetingLink
    });
    results.push(res);
  }
  return { success: true, results };
}

export async function sendBulkLocationEmails(students: { email: string, name: string }[], cohortName: string, cohortDates: string, cohortTime: string, locationName: string, locationLink: string) {
  const results = [];
  for (const student of students) {
    const res = await sendLocationInvitationEmail({
      email: student.email,
      name: student.name,
      cohortName,
      cohortDates,
      cohortTime,
      locationName,
      locationLink
    });
    results.push(res);
  }
  return { success: true, results };
}
