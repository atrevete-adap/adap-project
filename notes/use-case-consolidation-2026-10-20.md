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

All 59 FR remain covered. UC BR links are updated to the six BR actually defined in the current main branch. BR/UR/FR/NFR definitions, the Scrum report and board evidence are not changed. Wider UR references do not implement currently deferred customer merging, cost centres, budget targets or cash refunds.

One existing cross-reference outside this change remains for the requirements owner: NFR-07 still names BR-10 although the latest requirements define only BR-01 to BR-06. This note flags it without editing another member's requirements. The current dashboard account-policy caveat and C4/C9 client-review caveats remain explicit; consolidation does not invent decisions.

## Verification

- 18 distinct UC IDs match four PlantUML views, with explicit declarations and no retired case in an active flow.
- Mandatory fields, single primary roles, concrete descriptions/postconditions, sequential steps and 79 valid extensions checked.
- Every UC requirement reference exists; all 59 current FR covered.
- PlantUML syntax checked and all four views rendered successfully. PDF and PNG exports regenerated and visually inspected.
- Source Markdown reduced from 77,728 to 54,745 UTF-8 bytes (29.6%); specification PDF has 21 pages and diagram PDF has four.
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
