create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.handle_first_admin();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'Jaber Nafiz',
  title text not null default 'Video Editor | Motion Graphics Designer | Creative Storyteller',
  hero_headline text not null default 'I CREATE VIDEOS THAT MAKE PEOPLE STOP SCROLLING.',
  hero_subtext text not null default 'Strategic video editing, creative storytelling, and motion graphics that transform raw footage into engaging visual experiences.',
  intro text not null default 'I''m Jaber Nafiz, a video editor and motion graphics designer focused on creating engaging, visually compelling, and strategically edited content for brands, creators, and businesses.',
  about_text text not null default '',
  philosophy text not null default '',
  showreel_url text,
  showreel_thumbnail text,
  profile_photo text,
  about_photo text,
  before_video_url text,
  after_video_url text,
  whatsapp text not null default '8801330176473',
  email text not null default 'jabaerhosen@gmail.com',
  socials jsonb not null default '{}'::jsonb,
  availability text not null default 'available' check (availability in ('available','limited','unavailable')),
  footer_text text not null default '',
  seo_title text not null default 'Jaber Nafiz — Video Editor & Motion Graphics Designer',
  seo_description text not null default 'Strategic video editing, storytelling and motion graphics for brands, creators and businesses.',
  ga_id text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant update, insert on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings admin write" on public.site_settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "settings admin insert" on public.site_settings for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create trigger t_settings before update on public.site_settings for each row execute function public.touch_updated_at();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null default '',
  objective text not null default '',
  approach text not null default '',
  creative_direction text not null default '',
  motion_details text not null default '',
  software text[] not null default '{}',
  result text not null default '',
  video_url text not null default '',
  thumbnail_url text not null default '',
  duration text not null default '',
  orientation text not null default 'landscape',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "published projects public" on public.projects for select to anon, authenticated using (published = true or public.has_role(auth.uid(),'admin'));
create policy "admin manage projects" on public.projects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_projects before update on public.projects for each row execute function public.touch_updated_at();

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  deliverables text[] not null default '{}',
  icon text not null default 'Film',
  visible boolean not null default true,
  cta_label text not null default 'Get a Quote',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "visible services public" on public.services for select to anon, authenticated using (visible = true or public.has_role(auth.uid(),'admin'));
create policy "admin manage services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text not null default '',
  designation text not null default '',
  feedback text not null,
  photo_url text not null default '',
  project_ref text not null default '',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "approved testimonials public" on public.testimonials for select to anon, authenticated using (approved = true or public.has_role(auth.uid(),'admin'));
create policy "admin manage testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "media admin select" on storage.objects for select to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));

insert into public.site_settings (id, about_text, philosophy, socials, showreel_url, showreel_thumbnail, footer_text) values (1,
'I started editing because I loved the moment a cut lands exactly on the beat. Today I edit ads, gym films, vlogs and motion pieces for brands and creators — always chasing that same moment.',
'Every frame has a job. If it doesn''t hold attention or move the story forward, it goes.',
'{"facebook":"https://www.facebook.com/jaber.nafiz","instagram":"https://www.instagram.com/jaber_nafiz/","linkedin":"https://www.linkedin.com/in/jaber-nafiz-7ab91a298/","fiverr":"https://www.fiverr.com/s/1EEr684","upwork":"https://www.upwork.com/freelancers/~01f7eae4d6b919b90e?mp_source=share","x":"https://x.com/jaber_nafiz"}'::jsonb,
'https://drive.google.com/file/d/15tVoU35A2HGSKvKndnH6vVsroV83AmYx/preview',
'https://drive.google.com/thumbnail?id=15tVoU35A2HGSKvKndnH6vVsroV83AmYx&sz=w1600',
'Video editing & motion graphics for brands, creators and businesses worldwide.');

insert into public.projects (slug,title,category,video_url,thumbnail_url,duration,orientation,featured,published,sort_order,software) values
('motion-ads','Motion Ads','motion-graphics','https://drive.google.com/file/d/1gAf79mySJk-ACMDfmFi6-p5FkjtJ5UmE/preview','https://drive.google.com/thumbnail?id=1gAf79mySJk-ACMDfmFi6-p5FkjtJ5UmE&sz=w1200','2:41','portrait',true,true,1,'{"After Effects","Premiere Pro"}'),
('gym-film','Gym Film','gym-fitness','https://drive.google.com/file/d/1j5MGhbO7I7Ur_980XwPOQCSbUdPMApEH/preview','https://drive.google.com/thumbnail?id=1j5MGhbO7I7Ur_980XwPOQCSbUdPMApEH&sz=w1200','4:47','landscape',true,true,2,'{"Premiere Pro"}'),
('facebook-ad-2','Facebook Ad II','commercial','https://drive.google.com/file/d/15tVoU35A2HGSKvKndnH6vVsroV83AmYx/preview','https://drive.google.com/thumbnail?id=15tVoU35A2HGSKvKndnH6vVsroV83AmYx&sz=w1200','1:30','landscape',true,true,3,'{"Premiere Pro","After Effects"}'),
('facebook-ad','Facebook Ad','social-reels','https://drive.google.com/file/d/1N7UqMIMDdyVrARqpNRSXTQb1uYVHW3mW/preview','https://drive.google.com/thumbnail?id=1N7UqMIMDdyVrARqpNRSXTQb1uYVHW3mW&sz=w1200','0:40','portrait',false,true,4,'{"Premiere Pro"}'),
('vlog','Vlog','travel-lifestyle','https://drive.google.com/file/d/1HYTm2SFqQbcH33bOFZXOv4BbaZ_tNsZ5/preview','https://drive.google.com/thumbnail?id=1HYTm2SFqQbcH33bOFZXOv4BbaZ_tNsZ5&sz=w1200','0:27','portrait',false,true,5,'{"CapCut"}'),
('cinematic-4k','Cinematic 4K Edit','commercial','https://drive.google.com/file/d/12JQ0Tm8HUyIkWqRicARHvbObJySDhOis/preview','https://drive.google.com/thumbnail?id=12JQ0Tm8HUyIkWqRicARHvbObJySDhOis&sz=w1200','0:40','landscape',false,true,6,'{"Premiere Pro"}'),
('video-one','Video One','talking-head','https://drive.google.com/file/d/1k-cSYP064suTIyW8vjcpw48o1UPLYqmm/preview','https://drive.google.com/thumbnail?id=1k-cSYP064suTIyW8vjcpw48o1UPLYqmm&sz=w1200','1:00','landscape',false,true,7,'{"Premiere Pro"}'),
('gym-4k','Gym Edit 4K','gym-fitness','https://drive.google.com/file/d/1t7YIgFpykD8xXVhxu8xgL4r6Ol5LIpg2/preview','https://drive.google.com/thumbnail?id=1t7YIgFpykD8xXVhxu8xgL4r6Ol5LIpg2&sz=w1200','1:12','landscape',false,true,8,'{"Premiere Pro"}'),
('motion-exp','Motion Experiment','motion-graphics','https://drive.google.com/file/d/1udn_30mzTowFQhUwjQ-vze9-xGY9Jb5R/preview','https://drive.google.com/thumbnail?id=1udn_30mzTowFQhUwjQ-vze9-xGY9Jb5R&sz=w1200','0:24','landscape',true,true,9,'{"After Effects"}'),
('motion-04','Motion Piece 04','motion-graphics','https://drive.google.com/file/d/1EKYY6QPsLo9ds5KOrTpNjFH2yXiZBtM9/preview','https://drive.google.com/thumbnail?id=1EKYY6QPsLo9ds5KOrTpNjFH2yXiZBtM9&sz=w1200','0:37','landscape',false,true,10,'{"After Effects"}'),
('motion-03','Motion Piece 03','saas-demo','https://drive.google.com/file/d/1R5SrHowIfUtbQOWpMNXelaHt8daxksWg/preview','https://drive.google.com/thumbnail?id=1R5SrHowIfUtbQOWpMNXelaHt8daxksWg&sz=w1200','0:59','landscape',false,true,11,'{"After Effects"}'),
('motion-02','Motion Piece 02','motion-graphics','https://drive.google.com/file/d/1Gh5EO__2nbrzXuFMVvvbijggIaibDb30/preview','https://drive.google.com/thumbnail?id=1Gh5EO__2nbrzXuFMVvvbijggIaibDb30&sz=w1200','0:26','landscape',false,true,12,'{"After Effects"}'),
('motion-01','Motion Piece 01','motion-graphics','https://drive.google.com/file/d/1Us_WoXd2EFSKecZfXs0YedrgftXHqWHZ/preview','https://drive.google.com/thumbnail?id=1Us_WoXd2EFSKecZfXs0YedrgftXHqWHZ&sz=w1200','0:28','landscape',false,true,13,'{"After Effects"}');

insert into public.services (name,description,deliverables,icon,sort_order) values
('YouTube Video Editing','Long-form edits paced for retention — hooks, b-roll, captions and sound that keep viewers to the end.','{"Hook-first structure","B-roll & captions","Thumbnail-ready frames"}','Youtube',1),
('Talking Head Editing','Clean jump cuts, punch-ins and kinetic captions that make a single camera feel dynamic.','{"Jump cuts & zooms","Animated captions","Audio cleanup"}','Mic',2),
('SaaS & Software Demos','Screen recordings turned into clear, polished product stories with UI animation.','{"Screen capture polish","UI callouts","Cursor & zoom motion"}','MonitorPlay',3),
('Commercial & Promotional','Ads built to sell: tight pacing, brand-safe color and a clear call to action.','{"Ad cutdowns","Color grading","Multiple aspect ratios"}','Megaphone',4),
('Gym & Fitness Editing','High-energy edits synced to the beat with speed ramps and punchy sound design.','{"Beat-synced cuts","Speed ramps","Sound effects"}','Dumbbell',5),
('Real Estate Editing','Smooth walkthroughs and property films that sell space and light.','{"Stabilized walkthroughs","Color correction","Text overlays"}','Building2',6),
('Motion Graphics & Animation','Logo reveals, kinetic typography and animated explainers built in After Effects.','{"Logo animation","Kinetic typography","Lower thirds"}','Sparkles',7),
('Social Media Reels & Shorts','Vertical content made to stop the scroll on Reels, TikTok and Shorts.','{"9:16 edits","Trending pacing","Captions & SFX"}','Smartphone',8);