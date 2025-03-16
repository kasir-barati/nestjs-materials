# kafka-redis-websocket

How our entire process works

1. We are publishing CUD - Create, Update, and Delete - in the comment, connection, message, post, and user modules
2. We are localizing the parts of the published events we need in dashboard
3. We are broadcasting the new event in a redis cluster
4. If we need to update comment, connection, message, post, or user data we make an AJAX call to the respective endpoints in the blog app
5. We are consuming data in the dashboard frontend with a websocket connection to the dashboard api open sockets
