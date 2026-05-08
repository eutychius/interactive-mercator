Read STATE: /_wiki/UserStories/PROTO_STATE_<timestamp>.md.

Stage: implementation-plan.

Inputs:

- /_wiki/UserStories/STORY_<timestamp>.md
- /_wiki/UserStories/CRITICAL_<timestamp>.md

Output: return PLAN markdown content to the parent agent so the parent can persist it as /_wiki/UserStories/PLAN_<timestamp>.md.

Do not write stage markdown artifacts directly in this stage. Return the full artifact content to the parent agent.

Create a prototype-oriented implementation plan.
- Keep the Plan focused more focused on the functional requirements and the user journey rather than technical details or very detailed taks breakdowns. We want to leave enough space for the implementation stage to adapt and make decisions based on the actual prototype experience rather than having a rigid plan that tries to specify every detail upfront.

---------------------------------------------------------------------------------------

Use the Categorization section from the critical-thinking output as a orientation input for this stage.
- identify the strongest primary category from the critical-thinking output and treat it as the main product archetype for the prototype
- explicitly translate that category into a familiar UI/UX shape before planning individual features. think in terms of what users of that type of application expects / needs.
- map the story-specific requirements onto that familiar product shape instead of planning each requirement as an isolated UI element
- do not plan a prototype that feels like multiple small disconnected demos on one screen. it should feel like one believable application of the chosen category

The Categorization section from the critical-thinking stage is there to give you a strong signal about what kind of application this is and how the user journey should feel. It gives you something to work off of rather than having to start from scratch. It gives you something to identify familiar applications that you have been trained on and can draw from. You will use it as a base and then map the specific requirements and user journey on that.

---------------------------------------------------------------------------------------

Requirements:

- ALWAYS think critically about the best way for the prototype to demonstrate value to the user. For example, if a teacher needs to see students and edit grades, that should likely be one interactive list rather than separate cards for viewing and editing.
- make the first stage about generating the local test data, fixtures, or seed files required for the prototype functionality
- skip that first data stage only when the critical-thinking output explicitly concluded that no in-run sample data is needed
- focus on the user journey and the clickable experience
- ignore non-functional requirements unless they block basic execution
- use local fake data files to simulate backend, database, or service responses when the prototype flow benefits from representative data
- keep persistence expectations scoped to a single run. do not require persistence across runs unless specifically requested.
- If the critical-thinking stage identifies the need for multiple pages, then the prototype should have multiple pages.
- NEVER try to have multiple user pages/ user flows on the same page that would not make sense in the final product.
- keep alternatives, dependencies, testing, and risks sections short or omit them when they are not useful for the prototype
- prefer broad phases and broad implementation tasks over exhaustive planning. we want to leave room for adaptation during implementation.
- Never plan logs or prototype-only utility features that would not exist in the final product, such as "Last Updated" or "Current State" panels added only for testing. This prototype will be shown to the customer, so it should demonstrate the real user experience and only include real user features.


Complete only when PLAN content is fully returned to the parent agent so the parent can write the file and update state.