# CIPM-BrowserExtension
Browser Extension for the CIPM Password Manager

## To-do
- virustotal malicious link detection (background-worker.js)
    ~~- notification showing~~ (shows upon web request)
    - figure out how to access value of API key from this file
    - request VT report based on supplied id
    - implement logic to show notification based on result of Id report
    - cover them under the same HTTP error if else block
    - add malicious link to "MaliciousUrls" chrome.storage
    - add safe link to "SafeUrls" chrome.storage
    - if current visited link in "SafeUrls" -> ignore
    - if current visited link in "MaliciousURls" -> notifcation
    - if current visited link not in both -> call VT function (visited_link)


- HIBP Passwords API (check breached password)
    - https://www.youtube.com/watch?v=B-9Ah4dpKJk (Part 2)
    - most likely gonna be implemented on the desktop application
    - tells that passwords starting with "<first 6 charas>" has been found in x breaches
- integration with desktop application for autofill


- extension: password integration (extra)
- extension: security tips (sendiri generate tips) (scraped)

Obstacles
- alerts() are deprecated for service-workers in manifest v3

buffer code for manifest
    "background": {
        "service_worker": "background-worker.js",
        "persistent": true
    },