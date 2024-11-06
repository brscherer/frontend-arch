# Exercise 1

[Containers Diagrams](https://github.com/brscherer/frontend-arch/blob/main/diagrams/fullsnack-system/DIAGRAMS.md)

# Exercise 2
### Architecture Requirements

- Anonymous user with logic to integrate with user when it login
- Need to store user information, it can include email, phone and social media
- Restaurants needs to have name, type of food, ratings, delivery time average and location so we can calculate the distance to user be able to filter it
- Favorites are a authenticated only experience, so we must have a flag to check this and disable the whole feature if user is anonymous.
- App provides recommendations based on customer preferences and order history, so there is an algorithm observing user profile
- Food items are customizable, so we might need an entity of its own
- Orders must be an entity so user can apply discount in the order
- Orders can be scheduled
- Needs integration with Payments methods
- User can save payment method (must be local to be secure)
- Needs to integrate with async jobs to send emails for digital receipts after placing order
- Needs websocket connection to keep track of real-time order status
- Needs integration with notification system

[Course Version](https://github.com/Charca/frontend-architecture-workshop/blob/main/exercise-solutions/requirements-final.md#influential-functional-requirements)


