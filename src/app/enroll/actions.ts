"use server";

import { supabase } from "@/lib/supabase";
import { sendEnrollmentEmail, sendWaitlistEmail, sendAdminNotificationEmail } from "@/lib/mail";

export async function enrollUser(formData: {
  name: string;
  age: number;
  phone: string;
  email: string;
  profession?: string;
  joining_type?: string;
  promo_code: string | null;
  price_paid: number;
  cohort_id?: string;
  cohort_name?: string;
  cohort_dates?: string;
  cohort_time?: string;
}) {
    const { data, error } = await supabase
      .from("enrollments")
      .insert([
        {
          name: formData.name,
          age: formData.age,
          phone: formData.phone,
          email: formData.email,
          profession: formData.profession,
          joining_type: formData.joining_type,
          promo_code: formData.promo_code,
          price_paid: formData.price_paid,
          cohort_id: formData.cohort_id,
        },
      ])
      .select();

    if (error) {
      console.error("Error enrolling user:", error);
      return { success: false, error: error.message };
    }

    // Trigger automated email to student
    if (formData.email) {
      const emailResult = await sendEnrollmentEmail({
        email: formData.email,
        name: formData.name,
        cohortName: formData.cohort_name || "Workshop",
        cohortDates: formData.cohort_dates || "",
        cohortTime: formData.cohort_time || "",
        joiningType: formData.joining_type || "online",
        pricePaid: formData.price_paid,
      });

      if (emailResult.error) {
        console.error("Failed to send enrollment email:", emailResult.error);
      }
    }

    // Send admin notification emails
    const { data: adminSettings, error: adminSettingsError } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "notification_emails")
      .maybeSingle();

    if (adminSettingsError) {
      console.error("Failed to load admin notification emails:", adminSettingsError);
    }

    if (adminSettings?.value) {
      const adminEmails = adminSettings.value
        .split(',')
        .map((email: string) => email.trim())
        .filter(Boolean);

      if (adminEmails.length > 0) {
        const adminEmailResults = await sendAdminNotificationEmail({
          adminEmails,
          studentName: formData.name,
          studentEmail: formData.email,
          studentPhone: formData.phone,
          cohortName: formData.cohort_name || "Workshop",
          pricePaid: formData.price_paid,
          joiningType: formData.joining_type || "online",
        });

        const failedAdminEmails = adminEmailResults.filter(result => result.error);
        if (failedAdminEmails.length > 0) {
          console.error("Failed to send admin notification emails:", failedAdminEmails);
        }
      }
    }

    return { success: true, data };
}

export async function validatePromoCode(code: string) {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: "Invalid promo code" };
  }

  if (data.usage_limit && data.usage_count >= data.usage_limit) {
    return { success: false, error: "Promo code has reached its usage limit" };
  }

  return { success: true, data };
}

export async function joinWaitlist(formData: {
  name: string;
  email: string;
  phone: string;
  cohort_id: string;
  message?: string;
}) {
  // Get cohort info for the email
  const { data: cohort } = await supabase
    .from("cohorts")
    .select("name")
    .eq("id", formData.cohort_id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("waitlist")
    .insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cohort_id: formData.cohort_id,
        message: formData.message || null,
      },
    ])
    .select();

  if (error) {
    console.error("Error joining waitlist:", error);
    return { success: false, error: error.message };
  }

  // Trigger automated email
  if (formData.email) {
    const emailResult = await sendWaitlistEmail({
      email: formData.email,
      name: formData.name,
      cohortName: cohort?.name || "Workshop",
    });

    if (emailResult.error) {
      console.error("Failed to send waitlist email:", emailResult.error);
    }
  }

  return { success: true, data };
}

export async function getCohortById(id: string) {
  const { data, error } = await supabase
    .from("cohorts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching cohort:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getActiveCohorts() {
  const { data: cohorts, error: cohortsError } = await supabase
    .from("cohorts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (cohortsError) {
    console.error("Error fetching active cohorts:", cohortsError);
    return { data: [], error: cohortsError.message };
  }

  // Get paid enrollment counts for each cohort to accurately show spots available
  const { data: counts, error: countsError } = await supabase
    .from("paid_enrollments")
    .select("cohort_id");

  if (countsError) {
    console.error("Error fetching enrollment counts:", countsError);
    return { data: cohorts };
  }

  const cohortsWithCounts = cohorts.map(cohort => ({
    ...cohort,
    spots_taken: counts.filter(c => c.cohort_id === cohort.id).length
  }));

  return { data: cohortsWithCounts };
}
