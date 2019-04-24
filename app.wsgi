import sys
import logging
import os
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/dquest-flask/")
PROJECT_DIR = '/var/www/dquest-flask/venv'

activate_this = os.path.join(PROJECT_DIR, 'bin', 'activate_this.py')
execfile(activate_this, dict(__file__=activate_this))
sys.path.append(PROJECT_DIR)


from app import app as application
