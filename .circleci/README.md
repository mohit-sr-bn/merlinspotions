Mobify uses continuous integration platform Circle2.0. This folder stores the config.yml file for Circle2.0.
Mobify has a custom docker image [cci-docker-primary](https://github.com/mobify/progressive-web-sdk/blob/develop/.circleci/images/primary/dockerfile) that is hosted on Docker Cloud.

Docker Environment Highlights:
- Ubuntu 16.04
- The latest stable Chrome
- Java 8
- Node 8.9.4
- npm 5.6.0
- Nvm
- Xvfb (needed for chrome to run)

Mobify Internal Doc - [Deep Dive of Testing Environment](https://docs.google.com/document/d/18BNi17q1_V5QIBeiTH-k7eJGOIqDMJm1cityuNJsN-k/edit?usp=sharing) 