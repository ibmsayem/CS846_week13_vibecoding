Buils a twitter like software with following Features:

Features need to implement:
    1. first signup and login
    2. create user profile




Guidelins I am using
1. Requirements
    1. I gave example prompt
    2. give more information
    3. Assigned a role to the LLM agent as a senior level software developer
    5. Ask for concrete cases when things can go wrong
    6. 
2. code generation
    1. Work in Short, Iterative Cycles
    2. Specify any project specific Tool and Workflow Execution Mechanics
    3. Specify the input type and output format


3. Testing
    1. Specify the Testing Goal and Scope in the Prompt
    2. Use a Generate–Validate–Repair Loop Instead of One-Shot
Generation

4. Debugging
    1. Respond - Collaborate - Followup
    2.  Self Debugging
    3. Generate Debug Outputs
    4. Specify Important Points at the End, “keep edge
cases in mind”

5. Code summarization
    1. guideline 1: Provide Project-Specific Examples of Code Summaries and Context for
functions/files
    2. guideline 4: Document Purpose and Contract, Not Implementation
    3. guideline 6: Develop a global plan for the entire repository.

6. Code review
    1. guideline 1: Understand the Intent Before You Review
    2. guideline 2: Write Structured Review Comments 
    3. guideline 4: Assess Regression Risk as Part of Every Review Decision
    5. guideline 7: Require Evidence-Grounded Justification Before Accepting
LLM Claims

7. performance
    1. guideline 3: Explicitly ask it to optimize for worst-case input size while preserving correctness
    2. guideline 4: Use Execution Profiler Traces for Optimizing a Program
    3. guideline 6: Check for Dead Code Before Optimizing 

8. Logging
    1. guideline 2: Enforce consistent log via Repository-Wide
    Indexing and Custom Instructions
    2. guideline 4: Implement Structured Logging with Standardized
        Formats
    3. guideline 9: Log at Appropriate Abstraction Levels
