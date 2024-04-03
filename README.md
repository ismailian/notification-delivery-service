# NDS - Notification Delivery Service

NDS is a micro-service designed to efficiently deliver updates to subscribers.
By utilizing NDS, clients are relieved from the burden of manually checking for new data at regular intervals, thus reducing the load on your web service. However, it's important to note that the example provided here is merely basic and lacks some key features.

### 1. Authentication:
This is very important if you intend to make this privately accessible throught the web. Implementing JWT/API keys would be enough

### 2. Repetition:
For now, the failed jobs will not be tried again. But for a more reliable solution, failed jobs need to be triggered again with a delay or maybe upon user activity.
