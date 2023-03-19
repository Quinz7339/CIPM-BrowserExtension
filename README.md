# CIPM-BrowserExtension
Browser Extension for the CIPM Password Manager

## To-do
~~- malicious link detection~~


- HIBP Passwords API (check breached password)
    - https://www.youtube.com/watch?v=B-9Ah4dpKJk (Part 2)
    - most likely gonna be implemented on the desktop application
    - tells that passwords starting with "<first 6 charas>" has been found in x breaches
- integration with desktop application for autofill


- extension: password integration (extra)
- extension: security tips (sendiri generate tips) (scraped)

Obstacles
- alerts() are deprecated for service-workers in manifest v3
- making use of async functions for API requests (something new)
- persistent storage of extension data
    - solved through chrome API
- in general learnt about HTML, CSS and Javascript