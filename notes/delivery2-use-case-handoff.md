# Submission 2 textual contracts: handoff to Adam

Prepared for Pablo Pérez Arcas (`ByCur`) on 2026-10-29. Scope: #36, the textual part of #35 and #37. This is a proposed textual baseline for diagram synchronisation, not a record of a meeting, team approval or client acceptance.

## Baseline and coordination

- Work starts from `origin/main` at `1bf9c0d`, after fetching the remote. The local working tree was clean. No applicable AGENTS.md was found in the workspace or its parent directories.
- Issues [#27](https://github.com/atrevete-adap/adap-project/issues/27), [#35](https://github.com/atrevete-adap/adap-project/issues/35), [#36](https://github.com/atrevete-adap/adap-project/issues/36) and [#37](https://github.com/atrevete-adap/adap-project/issues/37), including all comments, were inspected before editing. Deniz is the Submission 2 Scrum Master; #27 is his completed task.
- Adam's open [PR #41](https://github.com/atrevete-adap/adap-project/pull/41), including its review and response, removes the old timer actor and improves diagram notation and views. Its branch `claude/project-thread-ml2p7o` ends at `e3fdb74` in the inspected snapshot. It explicitly defers the split until after #36 and publishes no replacement split IDs. The [review response](https://github.com/atrevete-adap/adap-project/pull/41#issuecomment-6467859476) retains the existing proration extend direction pending professor clarification.
- [PR #39](https://github.com/atrevete-adap/adap-project/pull/39) concerns Deniz's Submission 2 Scrum report. That report, the requirements, existing historical notes, diagram source, PNGs and PDFs are outside this change.
- No old conversation ZIP is used. The editable source is the current repository. The first commit extracts all eighteen existing contract bodies without changing their text or IDs; the next commit changes behaviour wording and responsibility boundaries in those individual files.

## Authoritative IDs and contracts

Use the [single correspondence table in the index](../doc/src/use-cases/README.md#3-single-id-correspondence). Do not renumber unchanged cases. UC-05 retains draft preparation, UC-14 retains audit and health inspection, and the four appended contracts separate issuance, sending, backup creation and restoration. The historical original 24-case IDs in that table are not active references.

The [inventory](../doc/src/use-cases/README.md#2-inventory) links all twenty-two contracts. Their actors and entry triggers are:

| Contract | Primary / other initiating actor | Trigger |
| --- | --- | --- |
| [UC-01](../doc/src/use-cases/UC-01.md) | Operational User; Communication Service supports recovery | Staff request access. |
| [UC-02](../doc/src/use-cases/UC-02.md) | Operational User; Administrator alone imports CSV | Customer maintenance or import request. |
| [UC-03](../doc/src/use-cases/UC-03.md) | Administrator; Super Administrator or explicitly authorised account administrator for privileged branches | Account, assignment or delegation request. |
| [UC-04](../doc/src/use-cases/UC-04.md) | Operational User; Administrator decides annual reviews | Subscription request; configured annual-review date creates tasks internally. |
| [UC-05](../doc/src/use-cases/UC-05.md) | Operational User; authorised callers retain their context | Draft request or approved proposal from UC-04, UC-06 or UC-15. |
| [UC-06](../doc/src/use-cases/UC-06.md) | None | First-day billing occurrence or recovery of missed/interrupted generation. |
| [UC-07](../doc/src/use-cases/UC-07.md) | Operational User; Payment Provider supplies evidence | Staff review, configured payment query or provider notification. |
| [UC-08](../doc/src/use-cases/UC-08.md) | None; Communication Service supports sending | Reminder or overdue occurrence becomes due. |
| [UC-09](../doc/src/use-cases/UC-09.md) | Operational User | Login, work search or notification review. |
| [UC-10](../doc/src/use-cases/UC-10.md) | Administrator; External Application submits intake only | Cancellation request; external intake cannot confirm it. |
| [UC-11](../doc/src/use-cases/UC-11.md) | External Application; authorised UC-10 internal context | Debt query or UC-10 internal calculation. |
| [UC-12](../doc/src/use-cases/UC-12.md) | Administrator with financial-report permission | Report request or previously authorised summary occurrence. |
| [UC-13](../doc/src/use-cases/UC-13.md) | Super Administrator; authorised template editor only within its separate capability | Global policy or permitted template change request. |
| [UC-14](../doc/src/use-cases/UC-14.md) | Super Administrator | Audit or health inspection request. |
| [UC-15](../doc/src/use-cases/UC-15.md) | Administrator with correction permission | Correction of an issued original. |
| [UC-16](../doc/src/use-cases/UC-16.md) | Operational User | Staff issue report or delivery/reconciliation exception needing follow-up. |
| [UC-17](../doc/src/use-cases/UC-17.md) | Administrator; Super Administrator above the configured threshold | Eligible approver opens a current request. |
| [UC-18](../doc/src/use-cases/UC-18.md) | Administrator; higher capability for reopening | Period closure or exceptional reopening request. |
| [UC-19](../doc/src/use-cases/UC-19.md) | Operational User for direct issuance; authorised internal callers retain their context | Issuance request for a current draft. |
| [UC-20](../doc/src/use-cases/UC-20.md) | Operational User for resend; Communication Service supports delivery | UC-19 initial delivery request or staff resend. |
| [UC-21](../doc/src/use-cases/UC-21.md) | None on scheduled path; Super Administrator on manual path | Backup occurrence or authorised manual backup request. |
| [UC-22](../doc/src/use-cases/UC-22.md) | Super Administrator | Explicitly confirmed restoration to an approved target. |

Automatic billing, payment checks, review-task creation, reminder sending, summary generation and backup creation are internal system behaviour. Do not add an external timer, Scheduler actor or invented staff initiator. Scheduler belongs in the architecture and in future automatic sequence scenarios as explained by the professor in #27. Human policy ownership is not an association saying that a person starts every automatic run. Keep Payment Provider and Communication Service as supporting external systems.

## Diagram changes to apply

Use the [relationship table](../doc/src/use-cases/README.md#4-contract-relationships) as the canonical list of include, extend and workflow handoffs, with the exact step or extension anchoring each relationship. In the diagram, include points to the included contract; extend points to its base. Workflow navigation is not automatically a UML dependency.

1. Keep UC-01 through UC-18. Rename the UC-05 ellipse to **Prepare an invoice draft** and UC-14 to **Inspect audit and automation health**. Add UC-19 **Issue an invoice**, UC-20 **Send an issued invoice**, UC-21 **Create a data and document backup**, and UC-22 **Restore a validated backup**.
2. Keep the UC-06 and UC-15 includes of UC-05 for preparation; add their includes of UC-19 for issuance. UC-19 includes UC-20 for the initial delivery request. A failed delivery is a distinct outcome and does not undo successful issuance.
3. Add UC-19 extending UC-05 only when issuance is requested for a draft. It is valid to save, edit or delete a draft without issuing it. Internal batch/correction callers execute the explicit preparation and issuance stages without requiring a new staff session.
4. Preserve UC-10 including UC-11. UC-17 extends the relevant UC-04 commercial/review branches, UC-19 sensitive issuance and UC-15 corrective approval. Replace the prior UC-17-to-UC-05 issuance approval edge with UC-17-to-UC-19; approval decisions do not run after every normal draft edit.
5. Move the delivery-problem UC-16 extension from the old combined UC-05 to UC-20. Keep reconciliation-problem UC-16 extending UC-07. Follow-up remains conditional rather than running after every successful send or payment.
6. Retain UC-05 extending UC-04 for eligible initial proration as in PR #41. UC-04 extension 8a prepares the prorated draft and hands it to UC-19 for issuance. The professor's answer recorded in #27 settles automatic scheduling, not the separate disputed proration base/extension pair. The inspected PR review leaves that pair pending clarification; no new professor answer is claimed here.
7. Associate Super Administrator with UC-14 inspection, UC-21 manual backup and UC-22 restoration under their separate capabilities. Do not imply that inspection always includes backup or recovery, or that backup automatically restores itself. Automatic UC-21 remains actorless on its scheduled path; restoration always requires explicit human confirmation.
8. Update the overview and four views using the same IDs and names; retain Adam's undirected actor associations and role inheritance. Re-export the diagram PNGs and PDF from his source after synchronisation. The specification PDF also needs a later export assembled from the index and per-case files; the shim is not the full export input.

When integrating PR #41, retain its diagram source and exports. Its edits to the former monolithic specification must be reconciled against the new per-case files and shared rules; do not restore a second full monolithic copy. Existing terminology changes in other PRs remain their owners' work.

## Behaviour and traceability review

- Draft, issued invoice, PDF stage and dispatch attempt have separate postconditions and guarantees. Only UC-19 consumes a number. A failure after issuance resumes its missing PDF or UC-20 sending stage against the same invoice. An intentional resend is a new communication attempt, never a new invoice.
- Existing customer scope, account capabilities, threshold approval, closed-period rules, verified payment evidence, cancellation/debt separation, consent, immutable history, backup and recovery safeguards remain explicit. Changed conditions such as pending/rejected approval, partial/excess payment, provider failure/duplicate event, and backup/restore failure have separate extensions.
- The [traceability matrix](../doc/src/use-cases/README.md#5-functional-requirement-traceability) distinguishes explicit parent citations from child coverage inherited through each **defining parent**. A standalone parent such as FR1 does not replace explicit coverage of independent parents such as FR1.1. The current source defines eighty parent FR and ninety-seven children; the validator reads definitions dynamically rather than enforcing those counts.
- The upstream requirements file contains undefined FR references in several UR traceability lines. The validator prints those as a separate source notice. The new contracts, inventory, matrix and this handoff contain no undefined requirement citations. Repairing the upstream UR references belongs to the requirements owner; this PR does not edit that file.
- Run `node scripts/validate-use-cases.cjs` for read-only checks of files, IDs, mandatory contract fields, inventory titles/FR, correspondence targets, current FR/BR/UR/NFR references, parent/child traceability, local links, extension anchors, step jumps and include/extend invocation points. It also rejects include cycles and timer/Scheduler actor entries. This is structural documentation validation; clarity and behaviour preservation also require reading the contracts, and diagram/PDF consistency is deliberately pending.
- Run `git diff --check` and compare the changed paths against the stated scope. These checks concern documentation, not an implemented application. No application tests, meeting, group agreement or client approval are asserted.

Validation performed on this textual revision: the validator passed for twenty-two contracts, eighty explicit parent FR mappings and ninety-seven inherited child requirements. Ten deliberately invalid temporary fixtures were rejected (unknown FR, broken link, missing extension step, invalid step jump, timer actor, Scheduler actor, missing include invocation, stale inventory, unmapped new parent and false child inheritance). A consistent temporary baseline with an additional parent and child passed without changing the validator. The first commit's eighteen extracted bodies were compared exactly with the corresponding `origin/main` bodies. These temporary fixtures do not alter the repository requirements.

## Deferred dependencies

Neither #45 nor #47 is started here. In the inspected repository and open PRs on 2026-10-29, [#42](https://github.com/atrevete-adap/adap-project/issues/42) is open and `doc/src/domain-model.pu` is absent, so the domain-model dependency for #45 is not available. [#45](https://github.com/atrevete-adap/adap-project/issues/45) and [#46](https://github.com/atrevete-adap/adap-project/issues/46) are open; `doc/src/class-diagram.pu` and `doc/src/component-diagram.pu` are absent, so #47's class/component dependencies are also unavailable. Its future invoice sequence must use the separated preparation, issuance and delivery contracts, with lifelines and operations supplied by those design artefacts.

The draft PR references #36, #35 and #37 without automatic closing keywords. Diagram synchronisation and final export verification remain required before the complete #35 can be considered finished. No merge, group message or issue comment is part of this work.
