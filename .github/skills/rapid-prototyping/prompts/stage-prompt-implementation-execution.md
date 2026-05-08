Read STATE: /_wiki/UserStories/PROTO_STATE_<timestamp>.md.

Stage: implementation-execution.

Input: 
- /_wiki/UserStories/PLAN_<timestamp>.md.
- /_wiki/UserStories/CRITICAL_<timestamp>.md.
- /.github/skills/rapid-prototyping/prompts/design-guide.md.

Outputs:

- return IMPL markdown content to the parent agent so the parent can persist it as /_wiki/UserStories/IMPL_<timestamp>.md
- The full prototype code files required.

Do not write stage markdown artifacts directly in this stage. Return the full IMPL artifact content to the parent agent.


---------------------------------------------------------------------------------------

Working with the Inputs:

- The implementation plan is a guiding document, not a strict step-by-step manual. Everything needs to be implemented, but it is more something to fall back to when you are unsure or need input. When working with it and when building the prototype in general make sure to NEVER create each feature in isolation. Rather See broader purpose and user experience behind the requirements and create a full application that demonstrates value in a holistic way. Thats why you cant just implement each requirement or task in the plan one by one. The Categorization will also help you with that. Always think critically about the best way to demonstrate value.

To create the perfect prototype, build a real understanding of what the user needs. Think about how to translate the critical-thinking insights and the implementation-plan into the best possible user experience.

The Categorization section from the critical-thinking output is a mandatory orientation input for implementation.
- identify the primary category before making UI decisions and use it as the main product archetype for the prototype
- if multiple categories were provided, use one as the dominant anchor and use the others only to refine details, not to create multiple competing product shapes
- extract the expected interaction model, information hierarchy, navigation style, and content grouping from that category first
- map the specific story requirements into those familiar patterns so the prototype feels like a believable product in that category, not a collection of disconnected feature widgets
- if a requirement could be implemented in multiple ways, prefer the option that best preserves the natural user experience of the chosen category

The Categorization section from the critical-thinking stage is there to give you a strong signal about what kind of application this is and how the user journey should feel. It gives you something to work off of rather than having to start from scratch. It gives you something to identify familiar applications that you have been trained on and can draw from. You will use it as a base and then map the specific requirements and user journey on that.

- treat /.github/skills/rapid-prototyping/prompts/design-guide.md as mandatory UI direction for visual language, spacing, and interaction tone. apply it consistently across all prototype views while still preserving category-appropriate interaction patterns from critical-thinking.


---------------------------------------------------------------------------------------

General Implementation Instructions:

- ALWAYS think critically about the best way for the prototype to demonstrate value to the user. For example, if a teacher needs to see students and edit grades, that should likely be one interactive list rather than separate cards for viewing and editing.
- before building screens or components, decide what the prototype should feel like as a whole based on the chosen category. use that to determine layout, navigation, grouping of actions, and how users move through the experience
- do not implement the story by simply placing one requested feature after another on the page. related capabilities should be merged into category-appropriate interaction patterns that feel obvious and efficient to the user
- when a familiar application pattern from the chosen category would naturally solve multiple requirements together, use that pattern instead of inventing separate custom UI pieces for each requirement
- each page or major section should feel like it belongs to the same product and support one coherent user journey
- If the plan stage identifies the need for multiple pages, then the prototype should have multiple pages. It can still be one technical page with shown or hidden views based on a clearly separate role-selection screen if that best fits the flow.
- NEVER try to have multiple user pages/ user flows on the same page. that would not make sense in the final product.
- NEVER add logs or prototype-only utility features that would not exist in the final product, such as "Last Updated" or "Current State" panels added only for testing. This prototype will be shown to the customer, so it should demonstrate the real user experience and only include real user features.
- NEVER try to read the Git history during this stage. Its not the concern at this point.

---------------------------------------------------------------------------------------

Consistency and Experience Guidance:

- Build one coherent product experience that matches the chosen category and user journey.
- Keep interaction patterns consistent across pages or views so users can predict what happens next.
- Prefer clarity and task completion over decorative complexity.
- ALWAYS Avoid duplicate content or duplicate capabilities in the same flow. ALWAYS Try to merge related requirements into unified patterns that solve multiple needs together if that makes sense. We dont want overdrowing but we want to have editing option in the list of items rather than having to select an item that we can then edit in a separate card. it makes much more sense to have editing options directly in the list of items or open a dialog on click. This is just one example but apply the spirit more broadly.
- If a list or table is central to the flow, include only the controls users actually need to complete key tasks (for example filtering, sorting, and inline actions when appropriate).

---------------------------------------------------------------------------------------

Requirements:

- create or edit the actual prototype code files needed
- return the IMPL artifact content with concise execution notes for the parent agent to write
- return any required validation commands to the parent agent instead of executing them
- do not run any terminal commands or other commands or any other things that would require approval.

Complete only when code changes exist, IMPL content is returned to the parent agent, and the parent agent can validate afterward.