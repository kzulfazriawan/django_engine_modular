"""
Warning:
    Do not create a View class of def in here, if you're trying to create a View just create a new file in src/views/
    and create your file then create your view class (ONLY VIEW CLASS BASED NOT DEF)
"""

import importlib
import inspect
import os

_modules = list()

target_location  = os.path.abspath(os.path.dirname(__file__))
target_directory = os.path.join(target_location, 'src', 'views')
for item in os.listdir(target_directory):
    if item != '__init__.py':
        _modules.append('.'.join([os.path.basename(target_location), 'src', 'views', item.replace('.py', '')]))

routes = list()

for item in _modules:
    _importer = importlib.import_module(item)
    for name, obj in inspect.getmembers(_importer):
        if inspect.isclass(obj) and name[0] != '_':
            _tmp_obj = lambda: None
            _tmp_obj.__setattr__('is_generic', True if hasattr(obj, "_generic_view") else False)
            _tmp_obj.__setattr__('path', getattr(obj, '_route_location'))
            _tmp_obj.__setattr__('name', getattr(obj, '_route_name'))
            _tmp_obj.__setattr__(
                'view', obj.as_view() if _tmp_obj.is_generic else obj
            )

            routes.append(_tmp_obj)