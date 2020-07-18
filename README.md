# airfilter
Secure Enterprise Airflow Admin User Web Interface Fine Grained Access Control

# Background
Improving Airflow UI Security
By Michael Permana on July 18, 2020

Airflow is a workflow platform. Airflow has limited security features, any user with access to the Airflow UI could access everything. This includes the metadata DB, modify globally shared objects like Connections and Variables, start or stop any DAG, mark any failed TaskInstance success and vice-versa, just to name a few.

This is enough for developer playground, however running in enterprise grade environment requires a more fine grained access control.  We want user to have access only to resources belongs to them.

Airfilter is UI replacement for Airflow user guarding it with a Fine Grained Access Control to solve the Enterprise requirement.


