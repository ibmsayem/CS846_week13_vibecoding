Buils a twitter like software with following Features:

Features need to implement:
    1. first signup and login
    2. create user profile




Guidelins I am using
1. Requirements
     - Guideline 4: Provide few-shot examples 
     - Guideline 1: Design a structured context prompt 
     - Guideline 3: Assign a role/persona to the LLM 
     - Guideline 13: Try asking for concrete cases when things go wrong (Pre-Mortem
Prompting)
    
2. code generation
     - Guideline 5: Work in Short, Iterative Cycles
     - Guideline 1: Specify any project specific Tool and Workflow Execution Mechanics
     - Guideline 4: Specify the input type and output format.


3. Testing
     - Guideline 1: Specify the Testing Goal and Scope in the Prompt
     - Guideline 2: Use a Generate–Validate–Repair Loop Instead of One-Shot
Generation

4. Debugging
     - Guideline 1: Respond - Collaborate - Followup
     - Guideline 2: Self Debugging
     - Guideline 3: Generate Debug Outputs
     - Guideline 6: Specify Important Points at the End, “keep edge cases in mind”

5. Code summarization
     - guideline 1: Provide Project-Specific Examples of Code Summaries and Context for functions/files
     - guideline 4: Document Purpose and Contract, Not Implementation
     - guideline 6: Develop a global plan for the entire repository.

6. Code review
     - guideline 1: Understand the Intent Before You Review
     - guideline 2: Write Structured Review Comments 
     - guideline 4: Assess Regression Risk as Part of Every Review Decision
     - guideline 7: Require Evidence-Grounded Justification Before Accepting LLM Claims

7. performance
     - guideline 3: Explicitly ask it to optimize for worst-case input size while preserving correctness
     - guideline 4: Use Execution Profiler Traces for Optimizing a Program
     - guideline 6: Check for Dead Code Before Optimizing 

8. Logging
     - guideline 2: Enforce consistent log via Repository-Wide Indexing and Custom Instructions
     - guideline 4: Implement Structured Logging with Standardized Formats
     - guideline 9: Log at Appropriate Abstraction Levels
