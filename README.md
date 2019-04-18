# dquest-flask
dquest implementation using flask

### Install and deploy
###### Enviroment
1. python2.7
2. dependency
```buildoutcfg
pip install -r requirements.txt
```
###### Bug to fix before deploy
```buildoutcfg
Traceback (most recent call last):
  File "/Users/cl3720/Projects/dquest-flask/run.py", line 1, in <module>
    from app import app
  File "/Users/cl3720/Projects/dquest-flask/app/__init__.py", line 9, in <module>
    cache.init_app (app)
  File "/Users/cl3720/Projects/dquest-flask/env/lib/python2.7/site-packages/flask_cache/__init__.py", line 156, in init_app
    from .jinja2ext import CacheExtension, JINJA_CACHE_ATTR_NAME
  File "/Users/cl3720/Projects/dquest-flask/env/lib/python2.7/site-packages/flask_cache/jinja2ext.py", line 33, in <module>
    from flask.ext.cache import make_template_fragment_key
ImportError: No module named ext.cache
```
1. find jinja2ext.py
2. locate line 33 and change to 
```buildoutcfg
from flask_cache import make_template_fragment_key
```
###### change configuration
```
app/lib/config.py
```