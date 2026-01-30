
# ProjectHub Architecture & Flows

## Visual Flowchart
![Project Flowchart](/images/project_flowchart.png)

## Detailed Process Flows (Mermaid)

```mermaid
graph TD
    %% Actors
    User([User / Developer])
    Reviewer([Reviewer / Peer])
    System(System / Backend)
    DB[(Database)]

    %% Auth Flow
    subgraph Authentication
        User -->|Sign Up / Login| System
        System -->|Verify Credentials| DB
        DB -->|Session Token| System
        System -->|Auth Cookie| User
    end

    %% Project Submission Flow
    subgraph Project Submission
        User -->|1. Submit Project| System
        System -->|2. Validate GitHub URL| System
        System -->|3. Save Project (Status: Pending)| DB
        DB -- Create Project Record --> DB
    end

    %% Review Flow
    subgraph Peer Review Process
        Reviewer -->|4. Explore Projects| System
        System -->|Fetch Projects| DB
        DB -->|List of Projects| Reviewer
        Reviewer -->|5. View Details| System
        Reviewer -->|6. Submit Review| System
        
        subgraph Review Data
            ratings[Rating: 1-5]
            scores[Scores: UI/Code/Func]
            text[Pros & Cons]
        end
        
        Reviewer -.-> ratings
        Reviewer -.-> scores
        Reviewer -.-> text
        
        System -->|7. Save Review| DB
        System -->|8. Recalculate Project Score| DB
    end

    %% Gamification
    subgraph Gamification
        DB -->|Update User Reputation| System
        System -->|Award Badges| User
    end
```

## Entity Relationships

- **User**: Has many Projects, Reviews, Sessions.
- **Project**: belongs to User, has many Reviews, Tags.
- **Review**: belongs to User (reviewer) and Project, has Ratings.
