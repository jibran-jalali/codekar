alter table public.cohorts
  add column if not exists meeting_link text;

alter table public.cohorts
  add column if not exists whatsapp_group_link text;

comment on column public.cohorts.meeting_link is
  'Optional online meeting link sent in student confirmation emails when configured.';

comment on column public.cohorts.whatsapp_group_link is
  'Optional WhatsApp group link sent in student confirmation emails when configured.';
