<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Portfolio architecture
- Home owns all portfolio sections and playback; legacy page URLs redirect to Home section anchors to preserve shared links.
- Use InlineVideo for both showreel and gallery playback, with format logic in video-format so aspect ratios remain consistent.
- Resolve portfolio playback through video-media and CDN pointers into native video elements so one click starts playback without Drive's nested player; prefer the configured gig project for the showreel.
- Service slides use Embla Auto Scroll for continuous motion, pausing on hover/focus and respecting reduced motion.
- Home scroll entrances use a shared progressive-enhancement observer; leave content visible without JavaScript or with reduced motion.
- Format contact inquiry data through project-brief for consistent WhatsApp and email messages; video choices live alongside the formatter.
- Derive sitemap URLs from required route staticData decisions; include Home and exclude legacy redirects so search engines discover only actual public pages, without synthetic lastmod dates.
