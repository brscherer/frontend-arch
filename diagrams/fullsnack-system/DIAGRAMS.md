# Full Snack System

This is a frontend architecture study from Maxi Ferreira at https://frontendatscale.com/courses/frontend-architecture

I'll use this folder to put all diagrams made during the course


## Containers Diagram

### Version 1 (first try)
![container-diagram-v1](https://github.com/user-attachments/assets/a099af0f-231d-46a2-ba84-1bfc479829e6)

### Version 2 (from course)
![container-diagram-v2](https://github.com/user-attachments/assets/34344896-e0b4-4d0e-82e3-4ebfe2b7049a)

Version 2 updates include:
- Actors that use the system (Consumer, Restaurant, Driver)
- A box indicating what is part of the system and what is not
- A box to group the web and mobile apps to clean the diagram (instead of arrowing each app)
- Integration between web sockets and apps with the Core API
- Better description for the arrow links


## Sequence Diagram

### Problem statement

When a customer places an order, the web app makes a request to the Core API which creates the order and returns a channel ID.
The web app then uses this channel ID to subscribe to the web sockets server, which emits real-time events when the order status changes.
If the connection with the web socket server drops at any point, the web app will start polling Core API with the latest order status.

![image](https://github.com/user-attachments/assets/0298599c-1d04-47bb-9cdd-12aacce08cfb)
