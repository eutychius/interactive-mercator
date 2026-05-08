Read STATE: /_wiki/UserStories/PROTO_STATE_<timestamp>.md.

Stage: critical-thinking.

Input: /_wiki/UserStories/STORY_<timestamp>.md.

Output: return the critical-thinking markdown to the parent agent so the parent can persist it as /_wiki/UserStories/CRITICAL_<timestamp>.md.

Do not write stage markdown artifacts directly in this stage. Return the full artifact content to the parent agent.

Think about the Request in the following dimensions:

---------------------------------------------------------------------------------------

1. Focus on the User Journey:
- Think deeply about the user journey.
- Identify the core user problems.
- Identify the UI flows needed to demonstrate value.
- Think about how big the prototype needs to be.
- If the user story is very big for a quick prototype, break it down and identify the smallest slice that can be built to demonstrate the core value.
- Take your time to really understand and communicate this correctly.
- Describe this first part "Focus on the User Journey" in detail. This will guide the implementation stage. We need a clear vision of what the problem is, how the prototype can best solve it and what the user journey looks like to be able to implement a prototype that demonstrates optimal value.

---------------------------------------------------------------------------------------

2. Categorization:

- Try to find a context agnostic way to categorize the user story. This will help to apply learnings across different prototypes and projects. For example, if the user story is in the educational domain, do the functional requirements align with an "E-learning Platform", an "Employee Management System", or a "Content Management System"? If the user story is about task coordination, you could categorize it as a "Productivity Tool" or a "Workflow Management App". The goal is to find a category that captures the essence of the user story without being too specific to the current project. This will help to build a library of insights and best practices that can be applied across different contexts.
- Generally we want broad and widely applicable categories. They are meant give the implementation stages an idea to work of. They genrally work much better when they can map the requirements to a well known type of application that they have allready been trained on. thats why its so important to find the best fitting category thats also very well known so the implementation stage can draw on relevant patterns. It should be super well known like "Weather App", "E-commerce Platform", "Admin Dashboard" so the next stages can easily relate to it. (NEVER to specific that agent wont have ). Choose the best one but if multiple fit really well then include up to 3 categories ranked from most to least relevant.
- To this categories you can then add a few sentences about what makes this application special or unique in within its category. Keep it brief.
- Also Include a short explenation of why the category is so important for the next stages and how they should intepret it to guide their work aswell as why you chose the specific category.
- The next Stages should now be able to draw on a type of software that its allready familiar with, has been trained on and can start from a strong base. now it just needs to map the specific requirements and user journey onto that which it allready knows.    


---------------------------------------------------------------------------------------

3. Multiple User Roles:

- Decide whether the prototype needs multiple user roles and, if so, which ones.
- For each role, describe what they need to see and do in the prototype, including their interactions and permissions.
- Decide whether the prototype needs multiple pages or if a single page is enough. If roles interact with data differently, separate pages may make sense. A simple role-selection page can act as login if full authentication is unnecessary.

---------------------------------------------------------------------------------------

4. Test Data:

- Decide whether the prototype needs local test data at all and, if it does, describe the minimum representative data files needed to exercise the prototype flow end to end.
- Prefer realistic sample content over placeholders. The test data should contain basic but credible domain examples rather than placeholder names.
- If the prototype does not depend on in-run sample data, explicitly state that no saved test data asset is needed unless the user asked for one

---------------------------------------------------------------------------------------

5. Technical Scope:

- Ignore non-functional requirements and technical constraints unless they block basic execution of the prototype.
- This will not become production code, so you can exclude hardening, scalability, security, and real integrations from the prototype
- NEVER have things like Logs or functionality that would not be there in the final product just for testing purposes. Unless it is specifically requested ofcourse.

 scope unless the user explicitly asks to include them.
