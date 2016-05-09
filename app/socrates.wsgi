activate_this = '/var/www/html/Socrates/app/venv/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
import sys
sys.path.insert(0, '/var/www/html/Socrates/app')
from socrates import app as application
