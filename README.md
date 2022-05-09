# Dancing with the Death
### version 1.0

An app to set appointments to dance with the Death in its proper time.  You can select any date and any hour, but beware!, you can make only one selection in your lifetime.  Please don't try to cheat on the Death, she will know and you will face the consequences.


This app handles a full CRUD process for the mentioned appointments.  It is based ina Postgres database.  The backend was written using Node/Express for the server, and the frontend was made entirely in HTML, CSS and JS.

the route for the API is
**/api/1.0/appointments**, 

and the documentation, generated through ***Swagger*** can be found on:
**/api/1.0/docs**


## Future Work

There is a couple of things that can be added to this app, but, because of timing, they will be delivered later, if requested.  Among other, I think that the following can be interesting, and easy to implement:
* - No appointment can be set, deleted or updated in a date previous to the current date
* - An email can be sent, using ***Nodemailer*** package everytime a new appointment is set, or when an appointment is updated
* - Authentication, usin ***JWT*** can be implemented and roles can be assigned, so anyone can set an appointment, but only app administrators can delete one
* - Responsiveness in the frontend *must* be implemented
* - **Unit tests need to be implemented!!!**

Please fell fre to contact me for any additional information: **dario.valenzuela@gmail.com**


