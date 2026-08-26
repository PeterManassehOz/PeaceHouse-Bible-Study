# Bible Study Application

A full-stack Bible study management application designed to provide users with a structured, interactive, and trackable Bible study experience.

The application allows users to work through Bible studies in sequence, track their individual study progress, participate in discussions, and continue directly from where they stopped. An administrative interface provides visibility into user activity and study completion across the platform.

---

## Overview

The Bible Study Application was built to transform a traditional Bible study experience into an accessible digital platform where users can study, interact, and monitor their progress.

The application provides a structured study workflow where users can:

- Browse available Bible studies
- Open individual Bible study lessons
- Start and complete studies
- Continue to the next uncompleted study
- Track completed studies
- Track studies currently in progress
- Identify studies that have not yet been started
- Participate in discussions attached to individual studies
- View their personal study progress

The system also provides an administrative environment where administrators can monitor study activity and understand how users are progressing through the available Bible studies.

---

## My Role

### Full-Stack Developer — MERN Stack

I designed and implemented the application as a full-stack web solution, working across the frontend, backend, database, APIs, user workflows, and administrative functionality.

My work included:

- Designing responsive application interfaces
- Building the Bible study user experience
- Implementing study navigation and progression
- Implementing user study-progress tracking
- Building the study completion workflow
- Implementing the "next uncompleted study" functionality
- Developing the study discussion/chat feature
- Connecting frontend components to backend REST APIs
- Designing and integrating MongoDB data models
- Implementing backend business logic with Express
- Building administrative functionality
- Implementing user activity and study-progress reporting
- Handling responsive layouts across screen sizes
- Implementing light and dark interface experiences
- Testing and refining the application around the expected study workflow

---

## Key Features

### 1. Bible Study Library

Users can access the available Bible studies through a structured interface.

Each study represents an individual lesson that users can open and work through independently.

The application provides a clear study experience designed to make it easy for users to identify available studies and continue their learning journey.

---

### 2. Individual Bible Study

Each Bible study has its own identifiable record and study page.

Users can open a specific study and interact with its content.

The study experience is designed around progression, allowing users to start a study, continue it, complete it, and move forward through the available lessons.

---

### 3. Study Progress Tracking

The application maintains an individual's study progress.

A user's studies can be categorized based on their current state:

- **Completed Studies** — studies the user has finished
- **Started Studies** — studies the user has begun but has not completed
- **Not Started Studies** — studies the user has not yet begun

This provides users with a clear understanding of their progress through the Bible study programme.

---

### 4. Continue to the Next Uncompleted Study

After completing a Bible study, users can proceed directly to the next study they have not completed.

This removes the need for users to manually search through the study library to determine what they should study next.

The progression workflow is designed to provide a continuous study experience:

```text
Open Study
    ↓
Begin Study
    ↓
Study Content
    ↓
Complete Study
    ↓
Find Next Uncompleted Study
    ↓
Continue Studying

5. Study Discussion / Chat

```

Each individual Bible study has an associated discussion area.

When users open a particular study, they can participate in the conversation surrounding that study by leaving comments.

For example:

```text

Bible Study #1
      ↓
Study Content
      ↓
Discussion
      ↓
User Comments
      ↓
Other Users Participate

```

Comments are associated with the specific study they belong to, allowing discussions to remain contextual to the Bible lesson.

This enables users studying the same material to share thoughts, ask questions, and engage with one another around the particular study.

6. User Study History

The application keeps track of a user's study activity.

The system can distinguish between:

Studies completed
Studies currently started
Studies not yet started

This creates a persistent study history rather than treating each visit to the application as an isolated session.

7. Administrative Dashboard

The application includes an administrative side that provides visibility into study activity across users.

Administrators can access information about how users are progressing through the Bible study programme.

The administrative functionality provides insight into areas such as:

User study activity
Completed studies
Started studies
Unstarted studies
Overall study progress
Individual user progress

This allows administrators to monitor engagement with the study programme from a centralized interface.

8. User Progress Monitoring

The administrative system provides a broader view of individual study activity.

Rather than only knowing that a user exists, administrators can determine how that user is interacting with the available Bible studies.

This makes the platform suitable for structured Bible study programmes where administrators or study coordinators need visibility into participation and progress.

9. Responsive User Interface

The application is designed to provide a consistent experience across different screen sizes.

The interface adapts to:

Desktop screens
Laptop screens
Tablets
Mobile devices

The layouts, navigation, study pages, discussion interfaces, and administrative views are designed with responsive behavior in mind.

10. Light & Dark Mode

The application supports both light and dark interface modes.

This allows users to choose an interface appearance that suits their preferences and viewing environment.

The application's components and layouts are designed to remain usable and visually consistent across both modes.

Technical Architecture

The application follows a MERN-based full-stack architecture.

```text
Frontend
    ↓
React / JavaScript
    ↓
RESTful API
    ↓
Express.js / Node.js
    ↓
MongoDB
    ↓
Persistent Application Data

```

The frontend communicates with the backend through RESTful API endpoints, while MongoDB provides persistent storage for users, Bible studies, comments, and study-progress information.

Technology Stack

```text
---------------------------------------------------------------
| Technology   | Purpose                                       |
| ------------ | --------------------------------------------- |
| JavaScript   | Primary programming language                  |
| React        | Frontend application development              |
| Tailwind CSS | Responsive UI styling and interface design    |
| Node.js      | Backend JavaScript runtime                    |
| Express.js   | Backend framework and RESTful API development |
| MongoDB      | Database and persistent data storage          |
| RESTful APIs | Frontend/backend communication                |
| MERN Stack   | Overall application architecture              |
---------------------------------------------------------------

```
Application Workflow

The primary user workflow follows this structure:

```text

Register / Sign In
        ↓
Browse Bible Studies
        ↓
Select a Study
        ↓
Read / Participate in Study
        ↓
Join Study Discussion
        ↓
Leave Comments
        ↓
Complete Study
        ↓
Update Study Progress
        ↓
Find Next Uncompleted Study
        ↓
Continue Studying


```
The application maintains the user's progress throughout this workflow.

Study Progress Model

At a high level, each user's relationship with a study can be represented through progression states:

```text

Not Started
     ↓
Started
     ↓
Completed


```

This progression allows the system to determine what the user has already studied, what they are currently working on, and what remains available for future study.

The same progress information is also made available to the administrative side for monitoring and reporting.

Data Management

The backend uses MongoDB to persist application data.

The database supports the application's core entities and relationships, including concepts such as:

Users
Bible Studies
Study Progress
Comments / Discussions
Administrative data

Study-specific discussions are associated with their corresponding Bible study, ensuring that comments remain connected to the correct study.

User progress is also associated with the relevant study and user, allowing the system to retrieve an individual's study history.

Challenges Solved
Disconnected Study Progress

Traditional study workflows may require users to manually remember which lessons they have completed.

The application maintains study progress automatically, providing a persistent record of the user's activity.

Difficulty Continuing a Study Programme

Users can lose track of what they should study next when working through multiple lessons.

The next-uncompleted-study workflow provides a straightforward way to continue the study programme.

Lack of Study-Specific Interaction

General discussion channels can make it difficult to associate a comment with the lesson being discussed.

The study-specific discussion feature keeps conversations connected to the relevant Bible study.

Limited Administrative Visibility

Without centralized progress information, administrators may have little visibility into participant engagement.

The administrative side provides access to user study-progress information, including completed, started, and unstarted studies.

Inconsistent Experience Across Devices

The responsive interface ensures that the application remains usable across desktop and mobile environments.

Development Approach

The application was developed around the actual workflow of a structured Bible study programme.

The development process involved:

Defining the Bible study workflow
Designing the user study experience
Structuring study and user data
Implementing authentication and user access
Building the Bible study interface
Implementing study-progress tracking
Implementing study completion
Building the next-uncompleted-study workflow
Implementing study-specific discussions
Connecting the frontend to RESTful APIs
Building the administrative monitoring interface
Implementing responsive layouts
Implementing light and dark modes
Testing and refining the application

The focus was on creating a complete study-management experience rather than simply presenting Bible study content.

Portfolio Relevance

The Bible Study Application demonstrates practical full-stack development experience through the implementation of a complete user-facing platform with persistent data, backend business logic, interactive features, and administrative monitoring.

The project demonstrates experience in:

Full-stack application development
React development
JavaScript programming
RESTful API design and integration
Express.js backend development
MongoDB data modelling
User-progress tracking
State-driven application workflows
Discussion and commenting systems
Administrative dashboards
Responsive interface development
Light and dark theme implementation
Business logic implementation
Data persistence
User-focused workflow design

The project also demonstrates the ability to translate a real-world workflow into a structured digital application with both user-facing and administrative experiences.

Outcome

The completed application provides a centralized digital environment for Bible study where users can study lessons, participate in study-specific discussions, track their progress, and continue through uncompleted studies.

At the same time, administrators have access to study-progress information that provides visibility into how users are engaging with the programme.

The project combines full-stack web development, persistent data management, interactive user workflows, progress tracking, discussion functionality, responsive UI design, and administrative monitoring into a single application.

Project Type

Bible Study & Study Progress Management Platform

Platform: Web Application

Architecture: MERN Stack

Application Model: Full-Stack Web Application

Primary Users: Bible study participants

Administrative Users: Study administrators

Primary Functions: Bible study, discussion, progress tracking, study progression, and administrative monitoring

Author

Peter Manasseh Oz

Full-Stack Software Engineer

I build full-stack web applications and business systems using modern technologies including JavaScript, React, Node.js, Express.js, MongoDB, RESTful APIs, and Tailwind CSS.

This project demonstrates my ability to build complete application workflows that combine user interaction, backend business logic, persistent data, administrative functionality, and responsive interface design.




