# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## Investigation of ticket 4471

The signed findings page is `src/routes/kb/incidents/4471-findings/+page.svx`.
It uses the original cause table and queue timeline rather than copying computed
counts into prose. The supplied export is a snapshot, not the desk's current state.

From this directory, install the renderer dependencies and produce the page:

```sh
npm ci
npm run render
```

Open `rendered/4471-findings.html` directly in a browser. No web server is required.
The renderer checks that the derived desk reference, cause counts, and styles are
present. The accepted historical decision record is unchanged.

The renderer is for this trusted local export only. Its build dependencies currently
report a low-severity prototype-poisoning advisory in `deepmerge`, with no fix
available; do not expose this build process as an untrusted-input service.
