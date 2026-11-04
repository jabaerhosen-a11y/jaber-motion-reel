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
- Service slides use Embla Auto Scroll for continuous motion, pausing on hover/focus and respecting reduced motion.
