alter table public.enrollments
  add column if not exists ai_experience_level text;

alter table public.paid_enrollments
  add column if not exists ai_experience_level text;

comment on column public.enrollments.ai_experience_level is
  'Student self-reported experience level with AI tools.';

comment on column public.paid_enrollments.ai_experience_level is
  'Student self-reported experience level with AI tools.';
