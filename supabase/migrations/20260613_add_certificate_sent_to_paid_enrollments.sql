alter table public.paid_enrollments
  add column if not exists certificate_sent boolean not null default false;

comment on column public.paid_enrollments.certificate_sent is
  'Tracks whether the completion certificate email has been sent from the admin dashboard.';
