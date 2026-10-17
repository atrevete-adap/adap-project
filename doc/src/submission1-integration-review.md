# Submission 1: integration review and handoff

Review date: 2026-10-15. Inspected upstream baseline: [`4b091606e7400725b548a839adcf0f51abf94830`](https://github.com/atrevete-adap/adap-project/tree/4b091606e7400725b548a839adcf0f51abf94830).

This is a coordination and review document, not an additional mandatory deliverable or a record of a meeting. It accompanies Pablo's proposed use-case specification work. No task assignment has been changed on GitHub by this review.

## 1. What is actually present

| Item | Observed state | Owner / next action |
| --- | --- | --- |
| BR | Eight provisional BR in `requirements.md`; latest commit by Héctor | Héctor: clarify BR-04 and BR-06 against the extended transcript, and polish the English wording |
| UR | Three empty placeholders | Héctor: identify and number actual user goals |
| FR | Three empty placeholders | Deniz: define functional behavior and dependencies with real IDs |
| NFR | Six substantive NFR, including automation reliability | Víctor: finish FR links and refine the test workloads |
| Diagram | Styled PlantUML skeleton with no actors or use cases | Adam, assigned to issue #8: agree inventory and model the diagram |
| Use case specification | Empty Cockburn-style template in upstream | Proposed Pablo contribution: the accompanying 24-case behavioral draft for issue #9 |
| Traceability | FR/UR mapping cannot be completed while their content is absent | Proposed Pablo integration work for issue #10, coordinated with the requirement owners |
| Scrum report | Team list and planned sprint dates; activity and meeting evidence still blank | Scrum Master and whole team: fill from actual records and screenshots |
| Compiled PDFs | None in the inspected tree | Compile after content and diagram agree; issue #11 |

Only `main` was returned by the branch listing and the pull-request listing was empty at inspection time. This does not exclude work still on teammates' computers. The earlier ZIP prepared on 2026-10-08 must not be uploaded over the current shared `requirements.md`: it uses a different requirement catalog and would replace teammates' work.

The repository already improves on two WhatsApp checklist statements:

- **NFR-02** separates a Lighthouse score from WCAG compliance and includes manual checks. Keep this distinction.
- **NFR-05** refers to an approved retention policy instead of asserting a universal five-year deadline; it also includes audit records and a measured restore target. Keep this improvement.
- **NFR-06** adds idempotent billing and payment processing and recorded automation failures. Preserve it and map it to the final FR.

## 2. Proposed contribution boundaries

The accompanying `use-case-specification.md` fills the existing textual template. This review adds coordination notes and a provisional coverage table. The shared requirements, Adam's PlantUML, README, and Scrum report are unchanged by this contribution.

The 24 UC IDs are proposals for agreement with Adam; no final diagram coverage is claimed. UC-09 and UC-11 are reusable subfunctions, while monthly billing, reminders, and recovery describe system-owned process goals. Internal time events are triggers, not necessarily external UML actors. Customers, contacts, and the accounting firm are not application users.

Authentication is normally a precondition of staff goals. Avoid adding an `include Login` edge to every use case as a substitute for access control. A textual alternative flow is not automatically a UML `extend` relationship. Select `include` or `extend` only when the mandatory reuse or conditional extension has been justified. The draft describes UC-09 reused by issuance paths without imposing a final set of UML edges on Adam.

## 3. Decisions requiring agreement

Each interpretation below is proposed for the next group/client review; it is not a claim that the group has approved it. `E` refers to the PDF page number in the 18-page extended meeting transcript supplied for the project.

### DEC-01: cancellation and outstanding debt

**Conflict:** WhatsApp says the customer cannot fully cancel while in debt; provisional BR-04 also suggests preventing unsubscription. E pp. 4, 14 and 17 explicitly distinguish commercial cancellation from collection: stop new recurring charges from the effective date and keep collecting previous debt.

**Proposed resolution:** use the later explicit clarification in UC-15 and UC-16. Debt remains visible and collectible; it is not erased, paid, or allowed to cause indefinite new monthly charges. An external cancellation request enters a controlled internal workflow.

**Owner actions:** Héctor should express BR-04 as an objective to improve collection and preserve obligations rather than guarantee payment or absolutely prohibit cancellation. Deniz should model cancellation state separately from outstanding balance. Adam and Pablo align the diagram and UC-15 after agreement.

### DEC-02: issued invoices and closed periods

**Conflict:** the checklist describes an automatic quarterly legal lock, which could imply unrestricted editing before the boundary. E pp. 3-4 and 11 refine this: drafts can be corrected; issued data must not be silently overwritten, and relevant changes use a traceable correction/rectification flow. E p. 14 adds explicit administrative month/quarter closing and controlled reopening.

**Proposed resolution:** preserve issued snapshots from issuance, not just from the next quarter. Use UC-21 for corrections and UC-24 for administrative closing. Decide whether a calendar-quarter boundary additionally closes the period automatically or whether closing is an authorized action; these are different rules. Do not present the client's original calendar shortcut as a verified statutory rule.

**Owner actions:** Deniz specifies exact allowed mutations and closing events; the group validates the interpretation. An exceptional reopening never permits unaudited rewriting of original invoices.

### DEC-03: payment terms and reminder day counting

**Ambiguity:** “Day 1 / Day 3 / Day 5” does not specify whether five days means five elapsed days or the fifth labelled day. Customer-specific thirty-day terms override defaults (E p. 5). The overdue interval is described as two or three days.

**Proposed resolution for confirmation:** use business dates in `Europe/Madrid`. Let issue date be `d`; select one documented convention for the default due date and the first reminder. A concrete elapsed-day proposal is due `d + 5 calendar days`, first reminder `d + 3`, due-date notice at `due`, and overdue follow-up every three calendar days. This differs from treating issue as labelled Day 1; do not mix both examples. Record customer-specific terms on issuance. Choose an explicit pause/review policy and, if included, a working-day adjustment policy.

**Owner actions:** Super Administrator configuration belongs in FR; the group must approve exact offsets. UC-13 intentionally points here rather than inventing agreement. NFR verification should test the selected convention, month boundaries, and an agreed thirty-day customer.

### DEC-04: proration, precision, and annual rate changes

**Source:** E pp. 2-4, 11 and 14 require visible consistent proration, decimal amounts, effective dates, and human approval of annual band changes. The provisional BR-06 wording “adjusting prices automatically” should distinguish automatic proposal from approved activation.

**Proposed calculation for confirmation:** for a mid-month start, divide the monthly fee by the actual number of calendar days in that month and multiply by billable days from the start date through month end, inclusive. For EUR, round the net prorated line to two decimals with half-up rounding and then apply the agreed line/tax rounding policy consistently. Example: net monthly fee EUR 310, start 22 October 2026, ten days of 31 gives EUR 100 net before applicable tax. A first-day start uses the regular monthly invoice without an additional overlapping prorated invoice. Test February, leap years, and the last day of a month. Approved no-proration exceptions and future starts remain explicit.

**Owner actions:** Héctor and Deniz clarify proposal versus human approval for annual reviews; the group approves the calculation and rounding policy. No retroactive invoice rewriting or automatic catch-up charges follow from a corrected annual review.

### DEC-05: role capabilities and scope

**Source:** E pp. 7-8 distinguishes Administrator, Super Administrator, and editable assigned operational users. The checklist reserves the financial dashboard to Administrator.

**Proposed resolution:** do not model a role hierarchy that implicitly gives every Super Administrator the dashboard. A person can hold Administrator financial permission separately if agreed. Assigned User may create/edit permitted customer and invoice records only within valid assignments/delegations; assignment and global settings remain privileged. Explicitly decide whether account creation, CSV import, sensitive corrections, and approval thresholds are available to each role.

**Owner actions:** Héctor documents actor goals, Deniz specifies access checks, Adam uses actor associations consistent with the approved capabilities. Client/contact records are never interactive customer logins. No mandatory two-factor authentication is added to minimum scope.

### DEC-06: payments and API contracts

**Source:** E p. 6 requires simulated Stripe queries and events, duplicate protection, ambiguous-payment review, and under/overpayment handling. E pp. 11-12 requires separate API authentication and controlled requests.

**Proposed resolution:** auto-reconcile only a validated successful transaction with a unique invoice reference and compatible amount/currency under the approved policy; same amount alone is insufficient. Provider event identity and underlying transaction identity both matter. Keep ambiguous cases pending manual review and audit allocations and reversals. Do not expose an unprotected “mark paid” operation.

**API items to define:** stable external customer identifier; debt response with per-currency balance and snapshot time; minimal authorized details; authentication and scope; unknown/inaccessible customer behavior; unavailable-calculation error; request limits; and a cancellation-request operation that does not directly delete recurrence. UC-16 is behavioral, not a finalized endpoint/schema contract.

**Owner actions:** Deniz provides the real FR IDs and the contract decisions; Pablo then updates UC-12, UC-15 and UC-16 links. A query failure must never be interpreted as no debt.

### DEC-07: retention, accessibility, and measurable NFR tests

**Retention:** do not restore the checklist's universal “five years = 1,825 days, Spanish tax compliance” statement. Article 30 of the Spanish Commercial Code includes a six-year commercial-document retention rule measured from the last book entry, subject to general/special provisions. This alone demonstrates why a blanket five-year deletion rule is unsuitable; it is not a complete retention policy for all data categories. Agree category-specific policy, legal holds, permitted anonymization, and backup treatment. Current NFR-05 correctly leaves retention to the approved policy.

**Accessibility:** a Lighthouse score is a supplementary automated measure, not evidence of WCAG AA conformance by itself. Current NFR-02 already includes manual checks. Specify the views, complete flows, WCAG success criteria, keyboard/zoom checks, and evidence used for acceptance.

**Load tests:** retain Víctor's proposed 5,000 customers, 50 concurrent users, p95 under two seconds, and zero observed failed requests for the defined test. Complete the workload: invoice-history volume, request mix, duration/warm-up, environment, dataset, and distinction between expected validation rejections and server failures. Zero failures in a specified test is not a promise that production will never fail. Complete the exact final FR links for all six NFR.

**Backup:** every-24-hour creation and four-hour restore are existing team acceptance targets. Define backup contents and recovery drill/environment; restore success needs validation of documents, records, permissions, and safe automation resumption. Do not claim that a backup has been tested until a drill is actually run.

**Public references checked 2026-10-15:**

- [Commercial Code, article 30, BOE](https://www.boe.es/buscar/act.php?id=BOE-A-1885-6627#a30).
- [W3C: Evaluating Web Accessibility Overview](https://www.w3.org/WAI/test-evaluate/).
- [Chrome: Lighthouse accessibility score](https://developer.chrome.com/docs/lighthouse/accessibility/scoring).

### DEC-08: extended scope and submission readiness

The extended transcript explicitly requests more than the WhatsApp summary: multiple contacts, approvals, corrected documents, internal issues, period closing, and recovery/health. The UC draft includes those requested behaviors so they are visible for discussion. FR/UR owners must decide their final decomposition and links before sign-off.

Keep extensions that the source itself describes as future/optional separate unless the group explicitly accepts them: full multi-company billing, historical invoice migration, quotations, exchange-rate reporting, projects/cost centers, saved views/favorites/tags, targets, scheduled reports, and optional AI. The core cannot depend on real paid Stripe/WhatsApp credentials or an AI model. An agreed decision to defer additional source requests must be recorded as a scope decision rather than silently dropped.

## 4. Provisional coverage map

`FN-*` are coordination keys only. They avoid assigning FR numbers that would conflict with Deniz's work. The final column must be replaced with actual FR IDs after the requirements exist; actual UR mapping is also pending. BR IDs below refer to Héctor's current provisional text; NFR IDs refer to Víctor's current six definitions.

| Capability key | UC | Existing BR | Existing NFR | Final FR IDs |
| --- | --- | --- | --- | --- |
| `FN-AUTH` | UC-01 | BR-02 | NFR-02, NFR-04 | Pending |
| `FN-CUSTOMERS` | UC-02 | BR-02, BR-03, BR-05 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05 | Pending |
| `FN-CSV` | UC-03 | BR-01, BR-03, BR-05 | NFR-01, NFR-03, NFR-04, NFR-05 | Pending |
| `FN-USERS` | UC-04 | BR-02, BR-05 | NFR-04, NFR-05 | Pending |
| `FN-ASSIGNMENTS` | UC-05 | BR-02, BR-05 | NFR-04, NFR-05 | Pending |
| `FN-SUBSCRIPTIONS` | UC-06 | BR-01, BR-03, BR-05, BR-06 | NFR-01, NFR-04, NFR-05, NFR-06 | Pending |
| `FN-RATE-REVIEW` | UC-07 | BR-06 | NFR-04, NFR-05, NFR-06 | Pending |
| `FN-ONEOFF` | UC-08 | BR-01, BR-03 | NFR-01, NFR-02, NFR-04, NFR-05 | Pending |
| `FN-ISSUANCE` | UC-09 | BR-01, BR-03, BR-04 | NFR-01, NFR-04, NFR-05, NFR-06 | Pending |
| `FN-MONTHLY` | UC-10 | BR-01, BR-04, BR-05 | NFR-03, NFR-05, NFR-06 | Pending |
| `FN-DELIVERY` | UC-11 | BR-01, BR-04 | NFR-04, NFR-05, NFR-06 | Pending |
| `FN-PAYMENTS` | UC-12 | BR-01, BR-04 | NFR-04, NFR-05, NFR-06 | Pending |
| `FN-REMINDERS` | UC-13 | BR-01, BR-04 | NFR-04, NFR-05, NFR-06 | Pending |
| `FN-NOTIFICATIONS` | UC-14 | BR-01, BR-03, BR-05 | NFR-02, NFR-03, NFR-04, NFR-05 | Pending |
| `FN-CANCELLATION` | UC-15 | BR-02, BR-04 | NFR-04, NFR-05, NFR-06 | Pending |
| `FN-DEBT-API` | UC-16 | BR-02, BR-04 | NFR-03, NFR-04, NFR-05 | Pending |
| `FN-FINANCE` | UC-17 | BR-07 | NFR-02, NFR-03, NFR-04, NFR-05 | Pending |
| `FN-CONFIG` | UC-18 | BR-01, BR-02, BR-05, BR-06 | NFR-04, NFR-05, NFR-06 | Pending |
| `FN-AUDIT` | UC-19 | BR-02, BR-05 | NFR-04, NFR-05, NFR-06 | Pending |
| `FN-BACKUPS` | UC-20 | BR-02, BR-05 | NFR-04, NFR-05 | Pending |
| `FN-CORRECTIONS` | UC-21 | BR-02, BR-04, BR-07 | NFR-04, NFR-05, NFR-06 | Pending |
| `FN-ISSUES` | UC-22 | BR-01, BR-04, BR-05 | NFR-02, NFR-04, NFR-05 | Pending |
| `FN-APPROVALS` | UC-23 | BR-04, BR-06 | NFR-02, NFR-04, NFR-05, NFR-06 | Pending |
| `FN-PERIODS` | UC-24 | BR-02, BR-07 | NFR-04, NFR-05, NFR-06 | Pending |

This table is partial traceability, not a completed bidirectional matrix. After FR/UR integration, add the reverse requirement-to-UC coverage check, including each final functional subrequirement. NFR that span many goals should not be modelled as independent user goals merely to give them a diagram node.

BR-08 (affordable technology) is a cross-cutting solution constraint rather than a separate user goal. Simulated integrations and the exclusion of mandatory paid services support it; final cost/deployment acceptance conditions still belong in the agreed requirements.

## 5. Handoff and verification

1. Pablo reviews the draft's goals, exceptions, and proposed decisions, so he can explain the modeling choices during presentation.
2. Héctor completes UR and validates the BR-04 / BR-06 refinements. Deniz completes FR and shares final IDs. Víctor finishes FR links and NFR test details.
3. Pablo replaces capability-key placeholders with those real IDs and checks reverse coverage; no invented FR references are accepted.
4. Adam and Pablo agree the UC names, IDs, actor associations, decomposition, and justified UML relationships. Synchronize the diagram and textual specifications together. The current diagram skeleton is not covered by a claim of successful UML verification.
5. Resolve or explicitly record the open decisions above. Remove working-draft status only after the requirement and diagram completion gate passes.
6. Compile the final PDFs, review the rendered pages, complete Scrum evidence from real activities, and perform each member's own balls-method evaluation. No retrospective meetings, board snapshots, or scores are fabricated.

**Checks possible for this draft:** unique sequential UC IDs; all Cockburn template fields present; numbered extension anchors refer to real main-flow steps; existing BR/NFR links resolve; local Markdown links resolve; shared requirements/diagram/Scrum/README preserved. These are document checks, not application security, performance, usability, restore, or integration test results.
