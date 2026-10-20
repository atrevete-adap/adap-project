# Use case consolidation review - 20 October 2026

This coordination note explains a proposed reduction from 24 to 18 contracts, following the group request to shorten the use case model. It is outside the four Submission 1 deliverables and records no meeting, approval or executed application test.

## Consolidation decisions

| Previous cases | Remaining contract | Reason and retained safeguards |
| --- | --- | --- |
| UC-02 + UC-03 | UC-02 | Customer onboarding/maintenance, with CSV as an explicit Administrator-only alternative and row-level outcomes. |
| UC-04 + UC-05 | UC-04 | Staff access administration, preserving separate role-administration and portfolio-assignment capabilities. |
| UC-06 + UC-07 | UC-06 | Subscription terms and their annual revision; human rate approval is retained and Time only creates review tasks. |
| UC-08 + UC-09 + UC-11 | UC-08 | Preparation, issuance and delivery are phases of one invoice outcome. Draft/issued/dispatched states, retries and consent remain distinct; automated/corrective callers provide authorised proposals. |
| UC-19 + UC-20 | UC-20 | Super Administrator supervision and recovery, with explicit read-only audit, backup and confirmed-restore branches. Time cannot restore. |

Six IDs are absorbed; existing surviving IDs are not renumbered. The model deliberately keeps independent payment reconciliation, reminder automation, cancellation, debt API, financial reporting, corrective invoices, issue resolution, approval and period closing as separate contracts. Their actor, trigger or financial guarantee differs enough to justify the distinction.

## Scope and current requirements

All 59 original FR remain covered. After the concurrent requirement decomposition in main at `046ecb9`, coverage is expressed over 85 parent requirements and their 112 defined descendant rules (197 FR IDs). Parent mappings include all explicitly defined descendants; none is discarded. UC BR links are updated to the six BR actually defined in the current main branch. BR/UR/FR/NFR definitions, the Scrum report and board evidence are not changed. Wider UR references do not implement currently deferred customer merging, cost centres, budget targets or cash refunds.

One existing cross-reference outside this change remains for the requirements owner: NFR-07 still names BR-10 although the latest requirements define only BR-01 to BR-06. This note flags it without editing another member's requirements. The current dashboard account-policy caveat and C4 client-review caveat remain explicit. The former C9 rule is now defined directly by FR3.2.6; consolidation does not invent decisions.

## Verification

- 18 distinct UC IDs match four PlantUML views, with explicit declarations and no retired case in an active flow.
- Mandatory fields, single primary roles, concrete descriptions/postconditions, sequential steps and 79 valid extensions checked.
- Every UC requirement reference exists; all 85 current parent FR and their 112 defined descendants are covered (197 IDs). The original package validator passed on its 59-FR baseline; a local copy is adapted for the current requirement hierarchy without changing its structural checks.
- The adapted coverage check requires an explicit mapping for every defined parent FR (IDs with at most one dot), expands each mapping to its defined descendants, and requires the expanded set to equal all FR definitions. It replaces the package validator's fixed count of 59; all actor, field, extension, link and export checks remain enabled.
- The package rendered all four PlantUML views. Locally, all four PNG embedded sources match PlantUML and all four diagram PDF images match the PNG pixels. The specification PDF is regenerated after the traceability update; all exported pages are rendered and visually inspected.
- The package reduced source Markdown from 77,728 to 54,745 UTF-8 bytes (29.6%); the subsequent traceability update preserves 18 contracts and regenerates the specification PDF. The diagram source and its four PNG/PDF views are unchanged by the requirement decomposition.
- The final regenerated specification PDF has 21 pages; the diagram PDF has four.
- These are documentation consistency checks; no running application or implementation test is claimed.

## Functional coverage

| Functional requirement | Current contracts |
| --- | --- |
| FR1 | UC-02 |
| FR1.1 | UC-02 |
| FR1.2 | UC-02 |
| FR1.3 | UC-02 |
| FR1.4 | UC-02 |
| FR1.5 | UC-04 |
| FR1.6 | UC-02 |
| FR2 | UC-08 |
| FR2.1 | UC-10 |
| FR2.2 | UC-06 |
| FR2.3 | UC-08, UC-21 |
| FR2.4 | UC-08 |
| FR2.5 | UC-08 |
| FR2.6 | UC-08 |
| FR2.7 | UC-08 |
| FR2.8 | UC-21 |
| FR3 | UC-12 |
| FR3.1 | UC-12 |
| FR3.2 | UC-13 |
| FR3.3 | UC-13 |
| FR3.4 | UC-13, UC-22 |
| FR3.5 | UC-23 |
| FR4 | UC-15 |
| FR4.1 | UC-15 |
| FR4.2 | UC-16 |
| FR5 | UC-06 |
| FR5.1 | UC-06, UC-18 |
| FR5.2 | UC-06 |
| FR6.1 | UC-01 |
| FR6.2 | UC-01, UC-04, UC-18 |
| FR6.3 | UC-04 |
| FR6.4 | UC-04 |
| FR7 | UC-14 |
| FR7.1 | UC-14 |
| FR7.2 | UC-14 |
| FR8 | UC-17 |
| FR8.1 | UC-17 |
| FR8.2 | UC-14 |
| FR8.3 | UC-14, UC-17 |
| FR8.4 | UC-17 |
| FR8.5 | UC-17 |
| FR9 | UC-20 |
| FR9.1 | UC-20 |
| FR9.2 | UC-10, UC-20 |
| FR10 | UC-06 |
| FR10.1 | UC-06 |
| FR10.2 | UC-06 |
| FR11 | UC-23 |
| FR11.1 | UC-23 |
| FR12 | UC-22 |
| FR12.1 | UC-22 |
| FR12.2 | UC-22 |
| FR13 | UC-13, UC-18 |
| FR13.1 | UC-08, UC-18 |
| FR13.2 | UC-24 |
| FR14 | UC-08, UC-10 |
| FR14.1 | UC-04 |
| FR14.2 | UC-08 |
| FR15 | UC-15, UC-16 |
| FR1.7 | UC-02 |
| FR1.8 | UC-02 |
| FR2.9 | UC-08 |
| FR2.10 | UC-08 |
| FR2.11 | UC-08 |
| FR3.6 | UC-12 |
| FR3.7 | UC-12 |
| FR4.3 | UC-15 |
| FR4.4 | UC-15 |
| FR5.3 | UC-06 |
| FR5.4 | UC-06 |
| FR5.5 | UC-06 |
| FR5.6 | UC-06 |
| FR8.6 | UC-17 |
| FR8.7 | UC-17 |
| FR8.8 | UC-17 |
| FR10.3 | UC-06 |
| FR11.2 | UC-08, UC-10 |
| FR11.3 | UC-23 |
| FR12.3 | UC-22 |
| FR13.3 | UC-18 |
| FR14.3 | UC-10 |
| FR14.4 | UC-10 |
| FR14.5 | UC-08, UC-12 |
| FR15.1 | UC-15, UC-16 |
| FR15.2 | UC-15, UC-16 |

## Concurrent main update

While PR #24 was being opened, main advanced from `2d9d12f` to `046ecb9`. The new commit is incorporated without editing its requirements content. The 26 newly named parent rules are mapped explicitly above and in the contracts; the 112 detailed sub-rules inherit their parent mapping. C5, C7, C8, C9, C10 and C12 are no longer active contradiction entries. In particular, FR3.2.6 now directly defines the former C9 communication-calendar rule; its existing diagram label remains a historical shorthand for that same rule. C4 remains subject to its stated client-review caveat. These are traceability updates, not added capabilities or approvals.
