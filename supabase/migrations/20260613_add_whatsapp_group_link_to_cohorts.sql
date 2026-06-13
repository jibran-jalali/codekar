alter table public.cohorts
  add column if not exists whatsapp_group_link text;

comment on column public.cohorts.whatsapp_group_link is
  'WhatsApp group invite link included in free workshop confirmation emails.';
