from locust import HttpLocust, TaskSet

#To run: put in appropriate username & password
#Run website code. 
#Console: locust --host =http://127.0.0.1:3000/
#Go to http://127.0.0.1:8089 for web interface

def login(l):
    l.client.post("/login", {"username":"test1", "password":"test1"})

def index(l):
    l.client.get("/landing")

def profile(l):
    l.client.get("/profile")

def admin(l):
	l.client.get("/admin")

class UserBehavior(TaskSet):
    tasks = {index:2, profile:1}

    def on_start(self):
        login(self)

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait=5000
    max_wait=9000